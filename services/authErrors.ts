import {
    isAuthApiError,
    isAuthRetryableFetchError,
} from "@supabase/supabase-js";

import type { ApiError } from "@/types/common";

/**
 * Maps a Supabase Auth error (or any thrown value) to a friendly,
 * non-technical message safe to show directly in the auth screens' UI.
 *
 * Supabase's `AuthApiError.code` values (see `@supabase/auth-js`'s
 * `ErrorCode` union) are mapped to specific copy where a friendlier message
 * meaningfully helps the user; everything else falls back to a generic
 * message rather than leaking raw server text.
 */
export function mapAuthError(error: unknown): ApiError {
  if (isAuthRetryableFetchError(error)) {
    return {
      message: "Network error. Check your connection and try again.",
      code: "network_error",
    };
  }

  if (isAuthApiError(error)) {
    return {
      message: friendlyMessageForCode(error.code, error.message),
      code: error.code,
      statusCode: error.status,
    };
  }

  if (error instanceof Error) {
    return { message: "Something went wrong. Please try again." };
  }

  return { message: "Something went wrong. Please try again." };
}

function friendlyMessageForCode(
  code: string | undefined,
  fallbackMessage: string,
): string {
  switch (code) {
    case "invalid_credentials":
      return "Incorrect email or password. Please try again.";
    case "email_not_confirmed":
      return "Please verify your email address before signing in.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email may already exist. Try signing in, or reset your password if you forgot it.";
    case "weak_password":
      return "This password is too weak. Choose a stronger password.";
    case "same_password":
      return "Your new password must be different from your current password.";
    case "email_address_invalid":
      return "Please enter a valid email address.";
    case "validation_failed":
      return "Please check the form for errors and try again.";
    case "session_not_found":
    case "session_expired":
    case "refresh_token_not_found":
    case "refresh_token_already_used":
      return "Your session has expired. Please sign in again.";
    case "signup_disabled":
      return "New account registrations are currently closed.";
    case "otp_expired":
    case "flow_state_expired":
    case "flow_state_not_found":
    case "bad_code_verifier":
      return "This link has expired or was already used. Please request a new one.";
    case "over_email_send_rate_limit":
      return "Too many requests. Please wait a bit before trying again.";
    case "over_request_rate_limit":
    case "over_sms_send_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    case "user_banned":
      return "This account has been suspended. Contact support for help.";
    case "user_not_found":
      return "We couldn't find an account with that email.";
    default:
      return fallbackMessage || "Something went wrong. Please try again.";
  }
}
