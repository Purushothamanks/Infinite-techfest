#!/usr/bin/env bash
#
# scripts/deploy.sh
#
# Production deployment script for Infinite Techfest 2026.
#
# Deploys the Expo Router web export to an AWS EC2 instance fronted by
# Nginx. Supabase Cloud remains the auth/database/storage backend and is
# never touched by this script.
#
# Usage:
#   ./scripts/deploy.sh
#
# See docs/DEPLOYMENT.md for full details, prerequisites, and rollback
# instructions.

set -Eeuo pipefail

# --------------------------------------------------------------------------
# Configuration (edit these to change deployment target)
# --------------------------------------------------------------------------

REMOTE_USER="ubuntu"
REMOTE_HOST="13.203.182.176"

SSH_KEY="$HOME/.ssh/infinite-techfest-2026.pem"

REMOTE_DIR="/opt/infinite-techfest-2026"

REPO_URL="https://github.com/Aether-Frame-Creater/Infinite-Techfest-2026.git"

BRANCH="main"

DOMAIN="infinitetechfest.online"

SSH_OPTS=(-i "$SSH_KEY" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 -o BatchMode=yes)

# --------------------------------------------------------------------------
# Logging helpers
# --------------------------------------------------------------------------

if [[ -t 1 ]]; then
  RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; BLUE=$'\033[0;34m'; NC=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; BLUE=""; NC=""
fi

CURRENT_STAGE="startup"

log_info()    { echo "${BLUE}▶${NC} $*"; }
log_success() { echo "${GREEN}✔${NC} $*"; }
log_warn()    { echo "${YELLOW}⚠${NC} $*"; }
log_error()   { echo "${RED}✖${NC} $*" >&2; }

on_error() {
  local exit_code=$?
  log_error "Deployment FAILED during stage: ${CURRENT_STAGE}"
  log_error "Command '${BASH_COMMAND}' exited with status ${exit_code} (line ${1})"
  exit "$exit_code"
}
trap 'on_error $LINENO' ERR

stage() {
  CURRENT_STAGE="$1"
  echo
  log_info "== ${CURRENT_STAGE} =="
}

# --------------------------------------------------------------------------
# Stage 1: verify the PEM key exists and has safe permissions
# --------------------------------------------------------------------------

stage "Verify SSH key"

if [[ ! -f "$SSH_KEY" ]]; then
  log_error "SSH key not found at: $SSH_KEY"
  log_error "Set SSH_KEY in scripts/deploy.sh or place the key at that path."
  exit 1
fi

# ssh refuses keys that are group/world readable; fix locally, this never
# touches the repository or leaves this machine.
CURRENT_PERMS=$(stat -c "%a" "$SSH_KEY" 2>/dev/null || stat -f "%Lp" "$SSH_KEY")
if [[ "$CURRENT_PERMS" != "600" && "$CURRENT_PERMS" != "400" ]]; then
  log_warn "SSH key permissions are $CURRENT_PERMS, tightening to 600"
  chmod 600 "$SSH_KEY"
fi

log_success "SSH key found at $SSH_KEY"

# --------------------------------------------------------------------------
# Stage 2 & 3: verify SSH connectivity, connect as ubuntu
# --------------------------------------------------------------------------

stage "Verify SSH connectivity to $REMOTE_HOST"

if ! ssh "${SSH_OPTS[@]}" "$REMOTE_USER@$REMOTE_HOST" "true"; then
  log_error "Could not establish an SSH connection to $REMOTE_USER@$REMOTE_HOST"
  log_error "Check the security group allows port 22 from this machine, and that the key matches the instance."
  exit 1
fi

log_success "SSH connection established as $REMOTE_USER@$REMOTE_HOST"

# --------------------------------------------------------------------------
# Stage 4: verify the remote server
# --------------------------------------------------------------------------

stage "Verify remote server"

ssh "${SSH_OPTS[@]}" "$REMOTE_USER@$REMOTE_HOST" '
  echo "Host       : $(hostname)"
  echo "User       : $(whoami)"
  echo "OS         : $( . /etc/os-release && echo "$PRETTY_NAME" )"
  echo "Uptime     : $(uptime -p 2>/dev/null || true)"
  echo "Disk (root): $(df -h / | tail -1 | awk "{print \$4\" free of \"\$2}")"
  if ! sudo -n true 2>/dev/null; then
    echo "ERROR: user ubuntu does not have passwordless sudo, required for nginx/apt steps." >&2
    exit 1
  fi
'

log_success "Remote server reachable and sudo-capable"

# --------------------------------------------------------------------------
# Stages 5-14: clone/update, install, typecheck, build, deploy, nginx, health
# Run as a single remote script so the whole pipeline fails fast together.
# --------------------------------------------------------------------------

stage "Run remote deployment (clone/update -> install -> typecheck -> build -> deploy -> nginx -> health check)"

# NOTE: outer heredoc is quoted ('REMOTE_SCRIPT') so nothing here expands
# locally. All values are passed in as positional args to the remote shell.
ssh "${SSH_OPTS[@]}" "$REMOTE_USER@$REMOTE_HOST" \
  bash -s -- "$REMOTE_DIR" "$REPO_URL" "$BRANCH" "$DOMAIN" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

REMOTE_DIR="$1"
REPO_URL="$2"
BRANCH="$3"
DOMAIN="$4"

log() { echo "  [remote] $*"; }
fail() { echo "  [remote] ERROR: $*" >&2; exit 1; }

# --- prerequisites -------------------------------------------------------
command -v git >/dev/null 2>&1 || { log "git missing, installing"; sudo apt-get update -y && sudo apt-get install -y git; }
command -v node >/dev/null 2>&1 || fail "node not found. Install Node.js >= 18 LTS on the server first (see docs/DEPLOYMENT.md)."
command -v npm  >/dev/null 2>&1 || fail "npm not found on the server."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  fail "Node.js $NODE_MAJOR is too old, need >= 18."
fi

# --- clone or update the repository -------------------------------------
if [ -d "$REMOTE_DIR/.git" ]; then
  log "Repository exists at $REMOTE_DIR, updating"
  cd "$REMOTE_DIR"

  # Protect environment/secret files before any hard reset. These are
  # untracked (gitignored) so `git reset --hard` never touches them, but we
  # back them up as an extra safety net. We NEVER run `git clean`.
  BACKUP_DIR="/tmp/itf2026-env-backup"
  mkdir -p "$BACKUP_DIR"
  for f in .env .env.production .env.local; do
    if [ -f "$f" ]; then
      cp -p "$f" "$BACKUP_DIR/$f.bak"
    fi
  done

  git fetch origin
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"

  for f in .env .env.production .env.local; do
    if [ -f "$BACKUP_DIR/$f.bak" ] && [ ! -f "$f" ]; then
      log "Restoring $f from backup (was not present after update)"
      cp -p "$BACKUP_DIR/$f.bak" "$f"
    fi
  done
else
  PROTECTED_FILES=(.env .env.production .env.local)

  if [ -d "$REMOTE_DIR" ] && [ -n "$(ls -A "$REMOTE_DIR" 2>/dev/null)" ]; then
    # Directory exists, is not a git repo, and is not empty. This is only
    # safe to proceed with automatically if the only things present are the
    # protected env files (expected on a first-ever deploy where the .env
    # was placed manually beforehand). Anything else aborts, listing exactly
    # what was unexpected so a human can inspect it.
    UNEXPECTED_FILES=()
    while IFS= read -r -d '' entry; do
      base="$(basename "$entry")"
      is_protected=false
      for p in "${PROTECTED_FILES[@]}"; do
        if [ "$base" = "$p" ]; then
          is_protected=true
          break
        fi
      done
      if [ "$is_protected" = false ]; then
        UNEXPECTED_FILES+=("$base")
      fi
    done < <(find "$REMOTE_DIR" -mindepth 1 -maxdepth 1 -print0)

    if [ "${#UNEXPECTED_FILES[@]}" -gt 0 ]; then
      fail "$REMOTE_DIR exists, is not a git repository, and contains unexpected files, refusing to overwrite: ${UNEXPECTED_FILES[*]}"
    fi

    log "$REMOTE_DIR contains only protected env file(s), safe to clone into it"

    # git clone refuses a non-empty target directory, so clone to a scratch
    # location first, then move the repo contents in place without ever
    # deleting or overwriting the protected env files.
    TEMP_CLONE="/tmp/infinite-techfest-2026-clone"
    rm -rf "$TEMP_CLONE"
    log "Cloning $REPO_URL (branch $BRANCH) into scratch dir $TEMP_CLONE"
    git clone --branch "$BRANCH" "$REPO_URL" "$TEMP_CLONE"

    for p in "${PROTECTED_FILES[@]}"; do
      if [ -f "$TEMP_CLONE/$p" ]; then
        rm -f "$TEMP_CLONE/$p"
      fi
    done

    log "Moving cloned repository contents into $REMOTE_DIR (preserving existing env files)"
    find "$TEMP_CLONE" -mindepth 1 -maxdepth 1 -exec mv -t "$REMOTE_DIR" {} +
    rm -rf "$TEMP_CLONE"
  else
    log "Cloning $REPO_URL (branch $BRANCH) into $REMOTE_DIR"
    sudo mkdir -p "$REMOTE_DIR"
    sudo chown "$(id -u):$(id -g)" "$REMOTE_DIR"
    git clone --branch "$BRANCH" "$REPO_URL" "$REMOTE_DIR"
  fi
fi

cd "$REMOTE_DIR"

if [ "$(git rev-parse --is-inside-work-tree 2>/dev/null || true)" != "true" ]; then
  fail "$REMOTE_DIR is not a valid git working tree after clone/update."
fi

log "At commit $(git rev-parse --short HEAD) on branch $(git rev-parse --abbrev-ref HEAD)"

# --- verify env file needed for the web build ----------------------------
if [ ! -f .env ]; then
  fail ".env not found in $REMOTE_DIR. Create it with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY before deploying (see docs/DEPLOYMENT.md)."
fi

# --- install dependencies using the repo's existing package manager -----
if [ -f package-lock.json ]; then
  log "Installing dependencies with npm ci"
  npm ci
elif [ -f pnpm-lock.yaml ]; then
  log "Installing dependencies with pnpm install --frozen-lockfile"
  corepack enable >/dev/null 2>&1 || true
  pnpm install --frozen-lockfile
elif [ -f yarn.lock ]; then
  log "Installing dependencies with yarn install --frozen-lockfile"
  yarn install --frozen-lockfile
else
  fail "No lockfile found (package-lock.json / pnpm-lock.yaml / yarn.lock)."
fi

# --- TypeScript validation ------------------------------------------------
if node -e "process.exit((require('./package.json').scripts||{}).typecheck ? 0 : 1)"; then
  log "Running npm run typecheck"
  npm run typecheck
else
  log "No typecheck script found, running npx tsc --noEmit"
  npx tsc --noEmit
fi

# --- lint (only if the project already has an ESLint config) ------------
if ls eslint.config.* .eslintrc* >/dev/null 2>&1; then
  log "Running npm run lint"
  npm run lint
else
  log "Skipping lint: no ESLint config committed yet (expo lint would auto-install one on first run)."
fi

# --- build the Expo web export into a staging dir for atomic swap -------
rm -rf dist.new
log "Running npx expo export --platform web"
npx expo export --platform web --output-dir dist.new

[ -f dist.new/index.html ] || fail "Expo web build did not produce dist.new/index.html"

# --- atomically swap the new build into place ----------------------------
if [ -d dist ]; then
  rm -rf dist.previous
  mv dist dist.previous
fi
mv dist.new dist
log "Deployed new web build to $REMOTE_DIR/dist"

# --- nginx: install if missing, write/refresh site config ----------------
if ! command -v nginx >/dev/null 2>&1; then
  log "nginx not found, installing"
  sudo apt-get update -y
  sudo apt-get install -y nginx
fi

NGINX_CONF="/etc/nginx/sites-available/infinite-techfest-2026.conf"
NEW_CONF="$(cat <<NGINXEOF
# managed-by: infinite-techfest-2026 scripts/deploy.sh -- do not edit by hand
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN _;

    root $REMOTE_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }

    location ~* \.(?:css|js|svg|png|jpg|jpeg|gif|ico|woff2?)\$ {
        expires 30d;
        access_log off;
    }
}
NGINXEOF
)"

CURRENT_CONF=""
if [ -f "$NGINX_CONF" ]; then
  CURRENT_CONF="$(cat "$NGINX_CONF")"
fi

if [ "$CURRENT_CONF" != "$NEW_CONF" ]; then
  log "Writing nginx site configuration"
  if [ -f "$NGINX_CONF" ]; then
    sudo cp "$NGINX_CONF" "$NGINX_CONF.bak.$(date +%s)"
  fi
  echo "$NEW_CONF" | sudo tee "$NGINX_CONF" >/dev/null
  sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/infinite-techfest-2026.conf
  if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
  fi

  if sudo nginx -t; then
    sudo systemctl reload nginx 2>/dev/null || sudo systemctl restart nginx
  else
    fail "nginx config test failed, previous config left untouched at $NGINX_CONF.bak.*"
  fi
else
  log "nginx configuration unchanged"
  sudo systemctl is-active --quiet nginx || sudo systemctl start nginx
fi

sudo systemctl enable nginx >/dev/null 2>&1 || true

# --- health check ----------------------------------------------------------
sudo systemctl is-active --quiet nginx || fail "nginx is not active after deployment"
[ -f "$REMOTE_DIR/dist/index.html" ] || fail "deployed dist/index.html is missing"

HTTP_STATUS="$(curl -s -o /dev/null -w '%{http_code}' http://localhost || echo 000)"
if [ "$HTTP_STATUS" != "200" ]; then
  fail "health check failed: curl -I http://localhost returned $HTTP_STATUS"
fi

log "Health check passed (HTTP $HTTP_STATUS)"
log "Deployed commit: $(git rev-parse --short HEAD)"
REMOTE_SCRIPT

log_success "Remote deployment steps completed"

# --------------------------------------------------------------------------
# Stage 15: final report
# --------------------------------------------------------------------------

stage "Deployment summary"

log_success "Deployment finished successfully."
echo "  Remote directory : $REMOTE_DIR"
echo "  Branch           : $BRANCH"
echo "  Web build path   : $REMOTE_DIR/dist"
echo "  Serving via      : Nginx on $REMOTE_HOST:80"
echo "  Domain (once DNS points here): http://$DOMAIN"
echo
log_info "HTTPS is not configured yet. See docs/DEPLOYMENT.md to enable it with certbot once DNS is pointed at $REMOTE_HOST."
