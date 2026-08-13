import type { RoleValue } from "@/constants/roles";

/**
 * Domain model for an authenticated user.
 * Mirrors the shape expected from Supabase auth + profile data.
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: RoleValue;
  departmentCode: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

/** Minimal session shape derived from Supabase auth session. */
export interface UserSession {
  user: User;
  accessToken: string;
  expiresAt: number;
}
