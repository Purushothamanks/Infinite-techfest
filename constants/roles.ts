/**
 * User role constants, matching AGENTS.md Section 5.
 * Order reflects the permission hierarchy from least to most privileged.
 */

export const ROLES = {
  STUDENT: "student",
  EVENT_COORDINATOR: "event_coordinator",
  STAFF_COORDINATOR: "staff_coordinator",
  DEPARTMENT_COORDINATOR: "department_coordinator",
  OVERALL_COORDINATOR: "overall_coordinator",
  SYMPOSIUM_ADMIN: "symposium_admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];

/** Ordered list of roles, least to most privileged. Useful for role hierarchy checks. */
export const ROLE_HIERARCHY: RoleValue[] = [
  ROLES.STUDENT,
  ROLES.EVENT_COORDINATOR,
  ROLES.STAFF_COORDINATOR,
  ROLES.DEPARTMENT_COORDINATOR,
  ROLES.OVERALL_COORDINATOR,
  ROLES.SYMPOSIUM_ADMIN,
  ROLES.SUPER_ADMIN,
];

/** Human-readable labels for each role, for UI display. */
export const ROLE_LABELS: Record<RoleValue, string> = {
  [ROLES.STUDENT]: "Student",
  [ROLES.EVENT_COORDINATOR]: "Event Coordinator",
  [ROLES.STAFF_COORDINATOR]: "Staff Coordinator",
  [ROLES.DEPARTMENT_COORDINATOR]: "Department Coordinator",
  [ROLES.OVERALL_COORDINATOR]: "Overall Coordinator",
  [ROLES.SYMPOSIUM_ADMIN]: "Symposium Admin",
  [ROLES.SUPER_ADMIN]: "Super Admin",
};
