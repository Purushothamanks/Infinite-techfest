# Deployment

Production deployment guide for Infinite Techfest 2026's Expo Router web build,
served from an AWS EC2 instance behind Nginx.

Supabase Cloud remains the backend for authentication, PostgreSQL, and storage.
This deployment never installs or self-hosts Supabase, Postgres, or Redis.

## 1. Architecture

```
GitHub (main) --push--> EC2 (ubuntu) --nginx--> https://infinitetechfest.online
                              |
                              +-- Supabase Cloud (auth / db / storage) [unchanged]
```

- The app is an Expo Router project. `npx expo export --platform web` produces a
  static site (SPA) in `dist/`, which Nginx serves directly.
- No Node server process is required for the web app itself — it's static files.
- A future backend API can later run on the same EC2 instance behind Nginx on an
  internal port; nothing in this setup blocks that.

## 2. AWS EC2 requirements

| Item      | Value                                                                                |
| --------- | ------------------------------------------------------------------------------------ |
| Instance  | `m7i-flex.large` (2 vCPU, 8 GB RAM)                                                  |
| OS        | Ubuntu Server LTS                                                                    |
| Region    | `ap-south-1`                                                                         |
| Public IP | `13.203.182.176` (Elastic IP)                                                        |
| SSH user  | `ubuntu` (no root SSH)                                                               |
| Inbound   | 22 (SSH, restricted to your IP if possible), 80 (HTTP), 443 (HTTPS, once configured) |

Do **not** expose these ports publicly: `3000`, `4000`, `8081`, `19000`, `19001`.
Nginx on port 80/443 is the only public entry point.

### One-time server prerequisites

The deploy script assumes the instance already has:

- Ubuntu with a non-root `ubuntu` user with **passwordless sudo** (default on
  Ubuntu AMIs).
- `git`, `curl` (the script will install `git` and `nginx` automatically if
  missing, via `apt-get`, using sudo).
- **Node.js >= 18 LTS** and npm installed (not installed automatically — install
  once via [NodeSource](https://github.com/nodesource/distributions) or `nvm`,
  matching the version you use locally).

## 3. SSH key

The PEM private key lives **outside the repository** and must never be
committed:

```
~/.ssh/infinite-techfest-2026.pem
```

- Never copy the `.pem` file into the repo.
- Never commit it, print its contents, or upload it anywhere.
- Recommended permissions: `chmod 600 ~/.ssh/infinite-techfest-2026.pem`
  (`scripts/deploy.sh` will tighten this automatically if it's too open).

## 4. Deployment command

From the project root:

```bash
./scripts/deploy.sh
```

Configuration lives at the top of `scripts/deploy.sh`:

```bash
REMOTE_USER="ubuntu"
REMOTE_HOST="13.203.182.176"
SSH_KEY="$HOME/.ssh/infinite-techfest-2026.pem"
REMOTE_DIR="/opt/infinite-techfest-2026"
REPO_URL="https://github.com/Aether-Frame-Creater/Infinite-Techfest-2026.git"
BRANCH="main"
DOMAIN="infinitetechfest.online"
```

Edit these values if the target host, key path, or branch changes.

### What the script does

1. Verifies the PEM key exists locally and has safe permissions.
2. Verifies SSH connectivity to the EC2 instance as `ubuntu`.
3. Verifies the remote host (OS, disk space, passwordless sudo).
4. Clones the repo into `/opt/infinite-techfest-2026` if it isn't there yet,
   otherwise fetches `origin/main` and hard-resets to it (env files are backed
   up to `/tmp/itf2026-env-backup` and restored automatically — `git clean` is
   never used). On a first deploy where `.env`/`.env.production`/`.env.local`
   were already placed on the server ahead of time, the directory is not
   empty but has no `.git` yet — the script detects that the only files
   present are protected env files, clones the repo into a scratch directory
   (`/tmp/infinite-techfest-2026-clone`), strips any env files that came from
   the repo itself, and moves the cloned contents into place without
   deleting or overwriting the existing env files. If any _other_ unexpected
   file is found in a non-git, non-empty target directory, the script still
   refuses to proceed and lists exactly which files caused the refusal.
5. Installs dependencies with the package manager matching the committed
   lockfile (`npm ci` for this repo, since `package-lock.json` is committed).
6. Runs `npm run typecheck` (falls back to `npx tsc --noEmit` if that script
   is ever removed).
7. Runs `npm run lint` **only if** an ESLint config is already committed to the
   repo (none exists yet — see note below).
8. Builds the web app into a staging directory (`dist.new`) with
   `npx expo export --platform web --output-dir dist.new`, then atomically
   renames it to `dist/` only after the build succeeds. The previous build is
   kept as `dist.previous` for manual rollback.
9. Installs/configures Nginx to serve `dist/` as a static SPA, reloading only
   if the config actually changed.
10. Health-checks: confirms Nginx is active, `dist/index.html` exists, and
    `curl -I http://localhost` returns `200`.
11. Prints a clear success/failure summary. Any failed stage aborts the whole
    script (`set -Eeuo pipefail` + a trap), leaving the previously deployed
    `dist/` untouched because the swap only happens after a successful build.

Note on lint: this project has no ESLint config committed yet (`npm run lint`
runs `expo lint`, which auto-installs `eslint` + `eslint-config-expo`
interactively on first run). The deploy script deliberately does **not**
trigger that interactive install on the server. Once an `eslint.config.js` (or
`.eslintrc*`) is committed to the repo, the script will start running lint
automatically — no script changes needed.

## 5. Remote directory layout

```
/opt/infinite-techfest-2026/        <- git working tree (checked out at origin/main)
/opt/infinite-techfest-2026/dist/           <- currently served build
/opt/infinite-techfest-2026/dist.previous/  <- previous build, kept for rollback
/opt/infinite-techfest-2026/.env            <- server-side env file (see below), never touched by git operations
```

## 6. Environment variables

The web build inlines `EXPO_PUBLIC_*` variables at build time. Create
`/opt/infinite-techfest-2026/.env` on the server **before the first deploy**
(the script fails fast if it's missing):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Use the Supabase **anon** key only — never the service-role key, and never
commit either key to the repository. `.env`, `.env.production`, and
`.env.local` are gitignored locally and are explicitly protected (backed up
and restored) across `git reset --hard` on the server.

## 7. Nginx

The script writes `/etc/nginx/sites-available/infinite-techfest-2026.conf`
(symlinked into `sites-enabled/`) serving `dist/` as a single-page app on port
80, and removes the default Nginx site if present. If you already have a
custom Nginx setup, the script compares the generated config against what's on
disk and only replaces/reloads it if something changed, keeping a timestamped
`.bak` copy of whatever it replaces.

If you need custom Nginx behavior (e.g. reverse-proxying a future backend API
under `/api/`), edit
`/etc/nginx/sites-available/infinite-techfest-2026.conf` on the server directly
— re-running the deploy script will detect the drift and leave it as-is only if
it matches; if you want the script to stop managing this file at all, remove
the "managed-by" comment at the top and adjust `scripts/deploy.sh` accordingly.

## 8. Domain and HTTPS

Public domain: `infinitetechfest.online`.

This first implementation serves plain HTTP on port 80. To enable HTTPS:

1. Confirm the domain's DNS `A` record points at the Elastic IP `13.203.182.176`
   (already configured — `infinitetechfest.online` and `api.infinitetechfest.online`
   both resolve here).
2. On the server, install certbot and request a certificate:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d infinitetechfest.online
   ```
3. Certbot edits the Nginx site config to add the TLS listener and sets up
   auto-renewal. After this, re-running `./scripts/deploy.sh` will detect that
   the on-disk config no longer matches its generated template and will
   **not** overwrite certbot's changes as long as you keep the config diverged
   intentionally — review the diff before accepting the deploy script's
   version if you re-run it after enabling TLS.

DNS and certificate issuance are not automated by this script per the project
requirements — no SSL certificates or DNS records are invented ahead of time.

## 9. Health check details

After every deploy, the script checks:

```bash
sudo systemctl is-active --quiet nginx
curl -s -o /dev/null -w '%{http_code}' http://localhost   # expects 200
```

plus that `dist/index.html` exists. If any check fails, the script exits
non-zero and prints the exact failing check — the previously deployed `dist/`
is left in place because the swap already happened, so to recover see
Rollback below.

## 10. Troubleshooting

| Symptom                       | Likely cause                                        | Fix                                                                                                          |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `SSH key not found`           | Wrong path/machine                                  | Check `SSH_KEY` variable, confirm the `.pem` file is on the machine running the script                       |
| SSH connection fails          | Security group blocks port 22, or wrong key         | Check EC2 security group inbound rules; confirm the key pair matches the instance                            |
| `passwordless sudo` error     | `ubuntu` user sudo config changed                   | Restore `ubuntu ALL=(ALL) NOPASSWD:ALL` in `/etc/sudoers.d/`                                                 |
| `.env not found`              | First deploy without server env file                | Create `/opt/infinite-techfest-2026/.env` manually (see Section 6)                                           |
| `npm ci` fails                | `package-lock.json` out of sync with `package.json` | Run `npm install` locally, commit the updated lockfile                                                       |
| `tsc --noEmit` fails          | Type errors in the committed code                   | Fix locally, `git push`, redeploy                                                                            |
| Expo export fails             | Missing/invalid env vars, or a broken route         | Check the printed Metro/Expo error; run `npx expo export --platform web` locally to reproduce                |
| `dist.new/index.html` missing | Expo web output config changed                      | Confirm `app.json` still has `"web": { "output": "static" }`                                                 |
| nginx config test fails       | Manual edits to the Nginx site file are invalid     | `sudo nginx -t` on the server for the exact syntax error; restore from the `.bak.<timestamp>` file if needed |
| Health check returns non-200  | Nginx serving wrong root, or `dist/` empty          | `curl -v http://localhost` on the server, check `/var/log/nginx/error.log`                                   |

## 11. Rollback procedure

The script keeps the previous build as `dist.previous/`. To roll back
manually on the server:

```bash
ssh -i ~/.ssh/infinite-techfest-2026.pem ubuntu@13.203.182.176
cd /opt/infinite-techfest-2026
[ -d dist.previous ] || { echo "no previous build available"; exit 1; }
sudo mv dist dist.broken.$(date +%s)
sudo mv dist.previous dist
sudo nginx -t && sudo systemctl reload nginx
curl -I http://localhost
```

To roll back the source code itself to a specific commit before rebuilding:

```bash
cd /opt/infinite-techfest-2026
git log --oneline -10          # find the commit to roll back to
git reset --hard <commit-sha>
# then re-run ./scripts/deploy.sh from your local machine, or repeat
# steps 9 (install), 10 (typecheck), 11 (build) manually on the server.
```

## 12. Manual AWS steps not automated by this script

- Launching/configuring the EC2 instance itself (AMI, instance type, security
  group, key pair) — assumed to already exist per the provided IP/region.
- Installing Node.js/npm on the server the first time.
- Creating `/opt/infinite-techfest-2026/.env` with real Supabase credentials.
- Pointing DNS for `infinitetechfest.online` at the EC2 public IP.
- Requesting/renewing the TLS certificate (`certbot`).
- Any EC2 security group / firewall changes (opening 80/443, restricting 22).
