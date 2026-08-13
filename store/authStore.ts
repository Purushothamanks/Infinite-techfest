import { create } from "zustand";

import type { User } from "@/types/user";

/**
 * Auth/session status.
 * - "loading": initial getSession() call hasn't resolved yet.
 * - "unauthenticated": no valid session.
 * - "authenticated": a valid session exists.
 * - "password_recovery": a PKCE recovery code was just exchanged for a
 *   session (via a deep link) — the user must land on Reset Password, not
 *   be routed to Home despite technically having a session.
 */
export type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated"
  | "password_recovery";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  setAuthenticated: (user: User) => void;
  setUnauthenticated: () => void;
  setPasswordRecovery: (user: User) => void;
  setLoading: () => void;
}

/**
 * Client-only auth/session state, per AGENTS.md Section 9 ("Zustand is for
 * client-only state... session/local user state"). Populated exclusively
 * by providers/AuthProvider.tsx, which is the single source of truth for
 * calling supabase.auth.getSession() / onAuthStateChange(). Screens should
 * read from this store (or a useAuth() hook wrapping it), never call
 * supabase.auth directly.
 */
export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setUnauthenticated: () => set({ status: "unauthenticated", user: null }),
  setPasswordRecovery: (user) => set({ status: "password_recovery", user }),
  setLoading: () => set({ status: "loading" }),
}));
