import { z } from "zod";

/**
 * Validation schema for the Login form per
 * Designs/Authentication/3. Login Screen.png.
 *
 * - email: required, must be a valid email address.
 * - password: required (login only checks presence; strength rules belong
 *   to the Register/Reset Password schemas, not here).
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
