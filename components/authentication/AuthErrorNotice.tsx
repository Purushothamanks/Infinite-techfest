import { AlertCircle } from "lucide-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

import { colors } from "@/theme";

interface AuthErrorNoticeProps {
  /** The friendly error message to display, e.g. from services/authErrors.ts. */
  message: string;
}

const NOTICE_ICON_SIZE = 20;

/**
 * Submission-level (API) error banner for the auth screens — e.g. "Invalid
 * login credentials", rate-limit errors, expired recovery links.
 *
 * Follows the exact visual pattern already used by the existing notice
 * cards (secure reset notice in ForgotPasswordScreen, masked-email status
 * card in VerifyEmailScreen, etc.) — a rounded-2xl bordered row with a
 * leading icon in a tinted circle — just recolored with the `error` token,
 * since no Alert.alert or toast pattern exists anywhere else in the auth
 * UI (per AGENTS.md's "no UI redesign" constraint).
 *
 * Field-level validation errors stay on `AuthTextField`'s own `error`
 * prop — this component is only for errors that don't belong to a single
 * field (failed sign-in, failed sign-up, expired links, etc.).
 */
function AuthErrorNoticeBase({ message }: AuthErrorNoticeProps) {
  return (
    <View
      className="mt-4 flex-row items-center gap-3 rounded-2xl border border-error bg-error/10 px-4 py-3.5"
      accessibilityRole="alert"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-error/10">
        <AlertCircle size={NOTICE_ICON_SIZE} color={colors.error} />
      </View>
      <Text className="flex-1 font-poppins-regular text-xs leading-4 text-text-primary">
        {message}
      </Text>
    </View>
  );
}

export const AuthErrorNotice = memo(AuthErrorNoticeBase);
