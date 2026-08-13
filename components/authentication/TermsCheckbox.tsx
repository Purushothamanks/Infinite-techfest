import { Square, SquareCheckBig } from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";

interface TermsCheckboxProps {
  /** Whether the checkbox is currently checked. */
  checked: boolean;
  /** Called when the checkbox itself is pressed. */
  onToggle: () => void;
  /** Called when the "Terms of Service" link text is pressed. */
  onPressTerms: () => void;
  /** Called when the "Privacy Policy" link text is pressed. */
  onPressPrivacy: () => void;
  /** Validation error message shown below the row. */
  error?: string;
}

const ICON_SIZE = 20;

/**
 * "I agree to the Terms of Service and Privacy Policy" checkbox row used by
 * the Register form per Designs/Authentication/4. Register Screen.png.
 *
 * Pure presentational — checked state and error text are supplied by the
 * parent (react-hook-form + zod), this component never validates itself.
 */
function TermsCheckboxBase({
  checked,
  onToggle,
  onPressTerms,
  onPressPrivacy,
  error,
}: TermsCheckboxProps) {
  const Icon = checked ? SquareCheckBig : Square;

  return (
    <View>
      <View className="flex-row items-start gap-2">
        <Pressable
          onPress={onToggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel="Agree to Terms of Service and Privacy Policy"
          hitSlop={8}
        >
          <Icon
            size={ICON_SIZE}
            color={checked ? colors.primary : colors.text.disabled}
          />
        </Pressable>
        <Text className="flex-1 font-poppins-regular text-xs text-text-secondary">
          I agree to the{" "}
          <Text
            onPress={onPressTerms}
            accessibilityRole="link"
            className="font-poppins-medium text-primary"
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            onPress={onPressPrivacy}
            accessibilityRole="link"
            className="font-poppins-medium text-primary"
          >
            Privacy Policy
          </Text>
          .
        </Text>
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

export const TermsCheckbox = memo(TermsCheckboxBase);
