/**
 * Department constants for R.P. Sarathy Institute of Technology.
 * Placeholder list based on common engineering institute departments —
 * confirm the final department list and codes with stakeholders before
 * wiring this into registration forms or the database seed.
 */

export const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science and Engineering" },
  { code: "IT", name: "Information Technology" },
  { code: "ECE", name: "Electronics and Communication Engineering" },
  { code: "EEE", name: "Electrical and Electronics Engineering" },
  { code: "MECH", name: "Mechanical Engineering" },
  { code: "CIVIL", name: "Civil Engineering" },
] as const;

export type DepartmentCode = (typeof DEPARTMENTS)[number]["code"];
