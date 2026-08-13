/**
 * Academic year (year of study) constants used by the Register form's
 * "Year" select field per Designs/Authentication/4. Register Screen.png.
 */

export const ACADEMIC_YEARS = [
  { code: "1", label: "1st Year" },
  { code: "2", label: "2nd Year" },
  { code: "3", label: "3rd Year" },
  { code: "4", label: "4th Year" },
] as const;

export type AcademicYearCode = (typeof ACADEMIC_YEARS)[number]["code"];
