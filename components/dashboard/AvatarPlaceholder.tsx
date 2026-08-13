import { memo } from "react";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { colors } from "@/theme";

interface AvatarPlaceholderProps {
  size?: number;
}

const DEFAULT_SIZE = 52;

/**
 * Fallback profile avatar used in the Student Home Dashboard header when
 * the authenticated user has no `avatarUrl` yet, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png (the
 * header's rounded avatar bubble).
 *
 * No image-generation tool is available in this environment, so — same
 * approach as ConfettiAccent.tsx — this is a small vector illustration
 * (react-native-svg, already a project dependency) rather than a
 * fabricated raster asset: a simple flat head-and-shoulders glyph tinted
 * with the design system's primary color. This deliberately avoids a
 * photorealistic/cartoon avatar per the asset design language rules
 * ("Avoid: Photorealistic people") while still reading as a person
 * placeholder rather than a bare initial letter.
 */
function AvatarPlaceholderBase({
  size = DEFAULT_SIZE,
}: AvatarPlaceholderProps) {
  return (
    <View
      style={{ width: size, height: size }}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Circle cx={26} cy={26} r={26} fill={colors.primary} opacity={0.08} />
        <Circle cx={26} cy={20} r={9} fill={colors.primary} opacity={0.4} />
        <Path
          d="M6 47c2.5-11 10.5-18 20-18s17.5 7 20 18Z"
          fill={colors.primary}
          opacity={0.4}
        />
      </Svg>
    </View>
  );
}

export const AvatarPlaceholder = memo(AvatarPlaceholderBase);
