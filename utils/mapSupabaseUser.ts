import type { User as SupabaseUser } from "@supabase/supabase-js";

import { ROLES } from "@/constants/roles";
import type { User } from "@/types/user";

/**
 * Maps a raw Supabase Auth user (with registration fields stored in
 * `user_metadata` — see services/authService.ts SignUpMetadata) to the
 * app-level `User` shape.
 *
 * No `role` is assignable through self-registration yet, so every mapped
 * user defaults to `ROLES.STUDENT`. Staff/coordinator/admin roles require
 * a real `profiles` table with server-assigned roles (see AGENTS.md
 * Section 11) — a known limitation until that table exists.
 */
export function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata ?? {};

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    fullName: typeof metadata.full_name === "string" ? metadata.full_name : "",
    role: ROLES.STUDENT,
    departmentCode:
      typeof metadata.department_code === "string"
        ? metadata.department_code
        : null,
    avatarUrl: null,
    createdAt: supabaseUser.created_at,
  };
}
