# AGENTS.md

> This file is the **permanent project memory** and development rulebook for Infinite Techfest 2026.
> Any AI agent (Claude, Copilot, or otherwise) working on this repository must read this file first and follow it strictly.
> Never regenerate the architecture described here unless the user explicitly requests it. Always continue from the existing project state.

---

## 1. Project Overview

**Project Name:** Infinite Techfest 2026

**Purpose:** A Symposium Management Platform built for R.P. Sarathy Institute of Technology's technical symposium. It manages the full event lifecycle: student authentication, event registration, payment verification, QR pass generation, QR attendance, certificate generation, announcements, schedules, multi-role dashboards, analytics, and administration.

**Target Platform:**

- Android (Primary)
- iOS (Future)
- Web Admin Dashboard (Future)

**Current Development Phase:** Project initialization. Folder structure and documentation only — no feature screens implemented yet.

---

## 2. Tech Stack

| Layer          | Choice                                 |
| -------------- | -------------------------------------- |
| Framework      | React Native + Expo (SDK 57)           |
| Routing        | Expo Router                            |
| Language       | TypeScript (strict mode)               |
| Styling        | NativeWind                             |
| UI Components  | React Native Paper (Material Design 3) |
| Backend        | Supabase                               |
| Database       | PostgreSQL (via Supabase)              |
| ORM            | Drizzle ORM                            |
| Client State   | Zustand                                |
| Server State   | TanStack Query                         |
| Forms          | React Hook Form                        |
| Validation     | Zod                                    |
| Camera / QR    | Expo Camera                            |
| Notifications  | Expo Notifications                     |
| PDF Generation | pdf-lib                                |
| Icons          | Lucide Icons                           |

None of the above libraries beyond the Expo/Expo Router/TypeScript core have been installed yet. Add them only when the feature that needs them is being built, and pin exact or compatible-range versions validated with `npx expo install <package>`.

---

## 3. Authentication

- Use **Supabase Authentication** only.
- **Email + Password** login only.
- **No Google login.**
- **No OTP login.**

---

## 4. Design System

Always follow these design rules for every screen and component:

- Material Design 3
- Premium SaaS look and feel
- Light theme only (no dark mode for v1)
- White background
- Rounded cards
- Soft shadows
- 8-point spacing system (all spacing values must be multiples of 8, with 4 allowed for tight inner padding)
- Poppins typography
- Primary color: `#0B2A6F`
- Accent color: `#E8A11C`
- Modern, mobile-first design

Design tokens (colors, spacing, typography, radii, shadows) live in `theme/`. UI code must reference tokens from `theme/`, never hardcode raw hex values or magic numbers.

---

## 5. User Roles

1. Student
2. Event Coordinator
3. Staff Coordinator
4. Department Coordinator
5. Overall Coordinator
6. Symposium Admin
7. Super Admin

Role-based access and dashboards must be designed around this hierarchy. Each role's permissions and views should be modeled explicitly (e.g., in `types/` and `store/`), not inferred implicitly in UI code.

---

## 6. Coding Standards

- Use TypeScript everywhere. No `.js`/`.jsx` files.
- Use functional components only. No class components.
- Prefer reusable, composable components over one-off screen-specific components.
- Avoid duplicated code — extract shared logic into `hooks/`, `utils/`, or `lib/`.
- Keep files modular and small. One responsibility per file.
- Always use absolute imports (`@/components/...`, `@/features/...`, etc.) instead of relative `../../../` chains.
- Follow clean architecture: UI → hooks/state → services → external APIs. Never let a screen component call Supabase directly.
- Never use inline styles (`style={{ ... }}`). Use NativeWind classes.
- Keep business logic outside UI components — UI components render and dispatch; they don't compute.

---

## 7. Folder Structure & Rules

```
app/          Expo Router routes only. Screens here must stay lightweight — they compose components/features and call hooks, nothing else.
components/   Generic, reusable, presentational UI components shared across features (buttons, cards, inputs, modals).
features/     Feature-scoped modules (e.g., features/auth, features/events, features/qr-attendance). Each feature can have its own components, hooks, and screens-support code.
hooks/        Reusable, cross-feature React hooks (e.g., useDebounce, useAuthGuard).
lib/          Low-level integrations and clients (Supabase client init, Drizzle client, pdf-lib wrappers, query client setup).
services/     API/business logic layer. All Supabase/Postgres/network calls live here, grouped by domain (authService, eventService, paymentService, etc.).
store/        Zustand stores, grouped by domain slice (authStore, eventStore, uiStore, etc.).
constants/    Static app-wide constants (roles, route names, enums, config values that never change at runtime).
types/        Shared TypeScript types and interfaces (domain models, API DTOs, role definitions).
utils/        Pure utility/helper functions with no side effects (formatters, validators, date helpers).
assets/       Images, fonts, icons, and other static assets.
docs/         Project documentation (architecture notes, ADRs, API references).
database/     Drizzle schema definitions, migrations, and seed scripts.
scripts/      One-off dev/maintenance scripts (data seeding, codegen, CI helpers).
providers/    React context/providers that wrap the app (ThemeProvider, QueryClientProvider, AuthProvider, etc.), composed in app/_layout.tsx.
theme/        Design tokens: colors, spacing, typography, radii, shadows. Single source of truth for the design system.
config/       Environment and app configuration (env variable parsing, feature flags, third-party SDK config).
```

Rules:

- Components should be reusable — if a component is only ever used in one feature, it belongs under `features/<feature>/components/`, not the top-level `components/`.
- Screens (`app/`) should stay lightweight — no business logic, no direct API calls.
- Services should contain all API/backend logic — screens and hooks call services, never fetch/Supabase directly.
- Hooks should contain reusable logic that wraps state and side effects for UI consumption.
- Store should contain Zustand state — one store file per domain slice, not a single giant store.
- Theme should contain colors, spacing, and typography — never redefine these ad hoc in component files.

---

## 8. Naming Conventions

- **PascalCase** for components (`EventCard.tsx`, `QrScannerModal.tsx`).
- **camelCase** for variables, functions, and hooks (`getUserProfile`, `useAuthGuard`).
- **kebab-case** for folder names (`qr-attendance/`, `event-registration/`).
- Filenames must be meaningful and describe their content precisely — no `utils2.ts`, `helper.ts`, or `temp.ts`.

---

## 9. State Management

- Use **Zustand** for client/UI state.
- **Do not use Redux.**
- Use **TanStack Query** for all server state (fetching, caching, syncing with Supabase/Postgres).
- Never duplicate server data into Zustand — Zustand is for client-only state (UI flags, session/local user state, form wizard steps, etc.).

---

## 10. Forms

- Use **React Hook Form** for all forms.
- Use **Zod** for schema validation, integrated via `@hookform/resolvers/zod`.
- Define one Zod schema per form, colocated with the feature (e.g., `features/auth/schemas/loginSchema.ts`).

---

## 11. Database

- Backend: **Supabase**
- Database: **PostgreSQL**
- ORM: **Drizzle ORM**
- Schema, migrations, and seed data live in `database/`.
- Never write raw SQL in feature code — go through Drizzle queries defined in `services/` or `database/`.

---

## 12. Memory Rules for AI Agents

Maintain project context between sessions. Always remember:

- Architecture (clean architecture layering described in Section 7)
- Folder structure (Section 7)
- Tech stack (Section 2)
- Naming conventions (Section 8)
- Design system (Section 4)
- User roles (Section 5)
- Current development phase (top of Section 1 — update this line as phases progress)

**Never regenerate the architecture unless explicitly requested by the user.** Always continue from the existing project state — read this file and the current folder structure before proposing structural changes.

---

## 13. Environment Setup Notes

- `create-expo-app@4.0.0` is currently incompatible with npm 12's `npm pack --json` output format (npm now returns an object keyed by package name instead of an array), causing the CLI to fail with a JSON parse error. This project was scaffolded by manually extracting the `expo-template-default` npm tarball instead. If re-scaffolding is ever needed, check whether `create-expo-app` has been patched before relying on it, or continue using the manual tarball extraction approach.
