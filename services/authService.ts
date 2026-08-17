import * as Linking from "expo-linking";

import { supabase } from "@/lib/supabase";
import { mapAuthError } from "@/services/authErrors";
import type { ApiError } from "@/types/common";

/** Generic result shape for auth operations that don't return extra data. */
export interface AuthResult {
  error: ApiError | null;
}

/** Result of a sign-up attempt. */
export interface SignUpResult extends AuthResult {
  /**
   * True when Supabase returned an obfuscated/fake user object
   * (`identities: []`) for an email that already belongs to a confirmed
   * account. Per Supabase's anti-enumeration design, the user-facing
   * message must stay generic ("check your email") regardless of this
   * flag — it exists only for internal logging/branching, never to tell
   * the user their email is already registered.
   */
  isLikelyDuplicate: boolean;
}

/** Metadata captured on the Register form, stored in Supabase Auth's
 * `user_metadata` (no `profiles` table exists yet — see AGENTS.md). */
export interface SignUpMetadata {
  fullName: string;
  collegeName: string;
  departmentCode: string;
  academicYear: string;
  registerNumber: string;
}

/**
 * Auth service layer. All Supabase Auth calls live here — screens and
 * hooks call these functions, never `supabase.auth` directly, per
 * AGENTS.md Section 7 ("clean architecture: UI -> hooks/state -> services
 * -> external APIs").
 */

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error: error ? mapAuthError(error) : null };
}

export async function signUp(
  email: string,
  password: string,
  metadata: SignUpMetadata,
): Promise<SignUpResult> {
  // Without this, Supabase falls back to the project's Site URL (dashboard
  // default: http://localhost:3000) for the confirmation link, which is
  // unreachable from a device — the link must deep-link back into the app
  // instead. See AuthProvider's Linking.useLinkingURL() handler, which
  // exchanges this path's `code` param for a session.
  const emailRedirectTo = Linking.createURL("verify-email");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: metadata.fullName,
        college_name: metadata.collegeName,
        department_code: metadata.departmentCode,
        academic_year: metadata.academicYear,
        register_number: metadata.registerNumber,
      },
    },
  });

  if (error) {
    return { error: mapAuthError(error), isLikelyDuplicate: false };
  }

  // Obfuscated response: Supabase returns a fake user with no identities
  // when the email already belongs to a confirmed account (with both
  // Confirm email/phone enabled). Treated as success to avoid leaking
  // account existence — see SignUpResult.isLikelyDuplicate doc above.
  const isLikelyDuplicate = data.user?.identities?.length === 0;

  return { error: null, isLikelyDuplicate };
}

export async function resendVerificationEmail(
  email: string,
): Promise<AuthResult> {
  // Same reasoning as signUp() above — without this, the resend link also
  // falls back to the Site URL default instead of deep-linking into the app.
  const emailRedirectTo = Linking.createURL("verify-email");

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  return { error: error ? mapAuthError(error) : null };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  // No redirectTo/deep link here on purpose: the recovery email delivers a
  // 6-digit OTP (see verifyRecoveryOtp below), not a clickable link. Email
  // clients like Gmail prefetch/scan links for safety, which silently burns
  // a PKCE recovery code before the user ever taps it, surfacing a false
  // "invalid or expired" error. An OTP the user types in has nothing for a
  // scanner to consume. Requires the Supabase dashboard's "Reset Password"
  // email template to include `{{ .Token }}` — see ResetEmailSentScreen.tsx.
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  return { error: error ? mapAuthError(error) : null };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  return { error: error ? mapAuthError(error) : null };
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();

  return { error: error ? mapAuthError(error) : null };
}

/**
 * Exchanges a PKCE confirmation `code` (extracted from the incoming
 * email-confirmation deep link by AuthProvider) for a real session. On
 * success, Supabase's auth-js emits a `SIGNED_IN` event, which the store
 * listens for.
 */
export async function exchangeConfirmationCode(
  code: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  return { error: error ? mapAuthError(error) : null };
}

/**
 * Verifies the 6-digit OTP sent by the "Reset Password" email (entered on
 * ResetEmailSentScreen.tsx) and exchanges it for a real session. On
 * success, Supabase's auth-js automatically emits a `PASSWORD_RECOVERY`
 * event via `onAuthStateChange`, which the store listens for.
 */
export async function verifyRecoveryOtp(
  email: string,
  token: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  return { error: error ? mapAuthError(error) : null };
}
