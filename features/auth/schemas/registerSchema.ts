import { z } from "zod";

/**
 * Validation schema for the Register form per
 * Designs/Authentication/4. Register Screen.png.
 *
 * - fullName: required, whitespace trimmed.
 * - collegeName: required, whitespace trimmed.
 * - departmentCode: required (selected from constants/departments.ts).
 * - academicYear: required (selected from constants/academicYear.ts).
 * - registerNumber: required, whitespace trimmed.
 * - email: required, must be a valid email address.
 * - password: required, minimum 8 characters.
 * - confirmPassword: required, must match password.
 * - agreeToTerms: must be checked before the form can submit.
 */
export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    collegeName: z.string().trim().min(1, "College name is required"),
    departmentCode: z.string().min(1, "Please select your department"),
    academicYear: z.string().min(1, "Please select your year"),
    registerNumber: z.string().trim().min(1, "Register number is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
