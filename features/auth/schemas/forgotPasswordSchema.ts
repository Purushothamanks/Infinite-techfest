import { z } from "zod";

/**
 * Validation schema for the Forgot Password form per
 * Designs/Authentication/5. Forgot Password.png.
 *
 * - email: required, whitespace trimmed, must be a valid email address.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
