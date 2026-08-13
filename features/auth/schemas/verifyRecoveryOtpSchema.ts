import { z } from "zod";

/**
 * Validation schema for the password-reset OTP form shown on
 * ResetEmailSentScreen.tsx.
 *
 * - code: required, exactly 6 digits (the OTP Supabase's recovery email
 *   template renders via `{{ .Token }}`).
 */
export const verifyRecoveryOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
});

export type VerifyRecoveryOtpFormValues = z.infer<
  typeof verifyRecoveryOtpSchema
>;
