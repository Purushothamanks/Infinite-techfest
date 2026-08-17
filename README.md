# Infinite Techfest 2026

A production-ready Symposium Management Platform for **R.P. Sarathy Institute of Technology**, built with React Native, Expo, and TypeScript.

The platform manages the full lifecycle of a technical symposium: student authentication, event registration, payment verification, QR pass generation, QR-based attendance, certificate generation, announcements, schedules, multi-role dashboards, analytics, and administration.

> Project status: **initialization phase.** Folder structure and documentation are in place; feature screens have not been implemented yet. See [`AGENTS.md`](./AGENTS.md) for the full architecture and development rules.

---

## Tech Stack

- **React Native** + **Expo** (SDK 57)
- **Expo Router** — file-based navigation
- **TypeScript** — strict mode
- **NativeWind** — Tailwind-style styling for React Native
- **React Native Paper** — Material Design 3 components
- **Supabase** — authentication, database backend
- **PostgreSQL** — via Supabase
- **Drizzle ORM** — type-safe database access
- **Zustand** — client state management
- **TanStack Query** — server state management
- **React Hook Form** + **Zod** — forms and validation
- **Expo Camera** — QR scanning
- **Expo Notifications** — push notifications
- **pdf-lib** — certificate/PDF generation
- **Lucide Icons** — icon set

Only Expo, Expo Router, and TypeScript are installed at this stage. The remaining libraries will be added incrementally as their corresponding features are built.

---

## Folder Structure

```
app/          Expo Router routes (screens & navigation)
components/   Reusable, generic UI components
features/     Feature-scoped modules (auth, events, payments, qr-attendance, ...)
hooks/        Reusable cross-feature React hooks
lib/          Client/integration setup (Supabase, Drizzle, pdf-lib, query client)
services/     API and business logic layer
store/        Zustand state stores
constants/    App-wide static constants
types/        Shared TypeScript types and interfaces
utils/        Pure helper functions
assets/       Images, fonts, icons
docs/         Project documentation
database/     Drizzle schema, migrations, seeds
scripts/      Dev/maintenance scripts
providers/    App-level React context providers
theme/        Design tokens (colors, spacing, typography)
config/       Environment and app configuration
```

Full rules for what belongs in each folder are documented in [`AGENTS.md`](./AGENTS.md#7-folder-structure--rules).

---

## Installation

### Prerequisites

- Node.js LTS
- npm (or pnpm)
- Expo Go app (Android/iOS) or an Android/iOS emulator, for local development

### Setup

```sh
# Install dependencies
npm install

# Start the development server
npm run start
```

---

## Development Commands

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run start`     | Start the Expo development server              |
| `npm run android`   | Start and open on an Android device/emulator   |
| `npm run ios`       | Start and open on an iOS device/simulator      |
| `npm run web`       | Start and open in a web browser                |
| `npm run lint`      | Run Expo's ESLint configuration                |
| `npm run typecheck` | Run the TypeScript compiler in check-only mode |

---

## Coding Standards

- TypeScript everywhere, strict mode enabled.
- Functional components only.
- Absolute imports (`@/components/...`) instead of deep relative paths.
- No inline styles — use NativeWind.
- Business logic stays out of UI components; screens stay lightweight and call into `services/`, `hooks/`, and `store/`.
- Clean architecture layering: UI → hooks/state → services → external APIs.

Full coding standards and naming conventions are documented in [`AGENTS.md`](./AGENTS.md#6-coding-standards).

---

## Project Roadmap

- [x] Project initialization: Expo + Expo Router + TypeScript scaffold, folder structure, documentation
- [ ] Design system setup (NativeWind config, theme tokens, Poppins font, React Native Paper theming)
- [ ] Supabase project setup and Drizzle schema for core entities (users, roles, events, registrations)
- [ ] Authentication (email + password) with role-based routing
- [ ] Event registration flow
- [ ] Payment verification flow
- [ ] QR pass generation
- [ ] QR-based attendance scanning
- [ ] Certificate generation (pdf-lib)
- [ ] Announcements and schedule screens
- [ ] Role-specific dashboards (Student, Event Coordinator, Staff Coordinator, Department Coordinator, Overall Coordinator, Symposium Admin, Super Admin)
- [ ] Analytics dashboard for admin roles
- [ ] Admin/back-office management screens
- [ ] Web admin dashboard (future)
- [ ] iOS release (future)
