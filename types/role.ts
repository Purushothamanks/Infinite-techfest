import type { RoleValue } from "@/constants/roles";

/**
 * Role-related domain types, complementing constants/roles.ts.
 * Keep role values here in sync with the ROLES constant.
 */

export type { RoleValue };

/** Describes a role's permission set for a given resource/action pair. */
export interface RolePermission {
  role: RoleValue;
  resource: string;
  actions: Array<"create" | "read" | "update" | "delete">;
}
