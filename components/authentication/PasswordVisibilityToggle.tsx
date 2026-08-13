import { Eye, EyeOff } from "lucide-react-native";
import { memo } from "react";
import { Pressable } from "react-native";

import { colors } from "@/theme";

const TOGGLE_ICON_SIZE = 20;

interface PasswordVisibilityToggleProps {
  /** Whether the associated field currently reveals its plaintext value. */
  visible: boolean;
  /** Called when the toggle is pressed to flip visibility. */
  onToggle: () => void;
}

/**
 * Password visibility toggle button shared by auth forms (Login, Register,
 * etc.) per Designs/Authentication/3. Login Screen.png and
 * Designs/Authentication/4. Register Screen.png.
 *
 * Extracted from LoginScreen.tsx so Register's Password/Confirm Password
 * fields can reuse the exact same control instead of duplicating it.
 * Memoized so typing in a sibling field doesn't re-render this icon/button.
 */
export const PasswordVisibilityToggle = memo(function PasswordVisibilityToggle({
  visible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={visible ? "Hide password" : "Show password"}
      accessibilityHint="Toggles whether the password field text is visible"
      hitSlop={8}
    >
      <Icon size={TOGGLE_ICON_SIZE} color={colors.text.disabled} />
    </Pressable>
  );
});
