import type { LucideIcon } from "lucide-react-native";
import { memo } from "react";
import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

import { colors } from "@/theme";

interface AuthTextFieldProps extends TextInputProps {
  /** Leading icon rendered inside the field, e.g. Mail or Lock from lucide-react-native. */
  icon: LucideIcon;
  /** Validation error message shown below the field. Omit/undefined when the field is valid. */
  error?: string;
  /** Accessible label describing the field's purpose, e.g. "Email address". */
  accessibilityLabel: string;
  /** Optional trailing element, e.g. a password visibility toggle button. */
  rightAccessory?: React.ReactNode;
}

const ICON_SIZE = 20;

/**
 * Shared text input used by the auth forms (Login, Register, etc.) per
 * Designs/Authentication/3. Login Screen.png: a rounded, bordered field with
 * a leading icon, optional trailing accessory (e.g. password toggle), and an
 * error message slot beneath it.
 *
 * Pure presentational — validation state and error text are supplied by the
 * parent (react-hook-form + zod), this component never validates itself.
 */
function AuthTextFieldBase({
  icon: Icon,
  error,
  accessibilityLabel,
  rightAccessory,
  ...inputProps
}: AuthTextFieldProps) {
  return (
    <View>
      <View
        className={`h-14 flex-row items-center gap-3 rounded-2xl border bg-surface px-4 ${
          error ? "border-error" : "border-border"
        }`}
      >
        <Icon size={ICON_SIZE} color={colors.text.disabled} />
        <TextInput
          className="flex-1 font-poppins-regular text-md text-text-primary"
          placeholderTextColor={colors.text.disabled}
          accessibilityLabel={accessibilityLabel}
          {...inputProps}
        />
        {rightAccessory}
      </View>
      {error ? (
        <Text
          className="mt-1.5 font-poppins-regular text-xs text-error"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export const AuthTextField = memo(AuthTextFieldBase);
