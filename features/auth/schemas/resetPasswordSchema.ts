import { z } from "zod";

/**
 * A single password rule used both for Zod validation and for rendering the
 * live requirements checklist in ResetPasswordScreen.tsx per
 * Designs/Authentication/6. Reset Password Screen.png.
 */
export interface PasswordRequirement {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "Minimum 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "One number",
    test: (value) => /[0-9]/.test(value),
  },
  {
    id: "special",
    label: "One special character",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

function meetsAllPasswordRequirements(value: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(value));
}

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

/**
 * Maps how many PASSWORD_REQUIREMENTS a candidate password satisfies to the
 * Weak / Medium / Strong meter shown in the design.
 */
export function getPasswordStrength(value: string): {
  level: PasswordStrengthLevel;
  metCount: number;
} {
  const metCount = PASSWORD_REQUIREMENTS.filter((requirement) =>
    requirement.test(value),
  ).length;

  if (metCount >= PASSWORD_REQUIREMENTS.length) {
    return { level: "strong", metCount };
  }
  if (metCount >= 3) {
    return { level: "medium", metCount };
  }
  return { level: "weak", metCount };
}

/**
 * Validation schema for the Reset Password form per
 * Designs/Authentication/6. Reset Password Screen.png.
 *
 * - newPassword: required, must satisfy every rule in PASSWORD_REQUIREMENTS
 *   (minimum 8 characters, uppercase, lowercase, number, special character).
 * - confirmPassword: required, must match newPassword.
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "New password is required")
      .superRefine((value, ctx) => {
        if (value.length > 0 && !meetsAllPasswordRequirements(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must meet all the requirements below",
          });
        }
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
