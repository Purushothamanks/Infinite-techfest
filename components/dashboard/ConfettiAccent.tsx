import { memo } from "react";
import { View } from "react-native";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";

import { colors } from "@/theme";

/**
 * Decorative "party popper + confetti" illustration for the status
 * banner, per Designs/Student Module/1. STUDENT HOME DASHBOARD UI
 * DESIGN.png (the striped cone with scattered confetti in the top-right
 * of the "You're all set!" card).
 *
 * No image-generation tool is available in this environment, so rather
 * than fabricate a raster illustration, this is composed as a vector
 * graphic (striped cone + scattered dots/squares/ribbons) using
 * react-native-svg — already a project dependency. This keeps the asset
 * at zero binary size, perfectly brand-colored, and crisp at any
 * resolution.
 */
function ConfettiAccentBase({ size = 96 }: { size?: number }) {
  return (
    <View
      style={{ width: size, height: size }}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={size} viewBox="0 0 96 96">
        {/* Party popper cone */}
        <Polygon
          points="26,88 54,22 92,46"
          fill={colors.accent}
          opacity={0.9}
        />
        <Rect
          x={36}
          y={40}
          width={10}
          height={40}
          fill={colors.text.inverse}
          opacity={0.5}
          transform="rotate(64 41 60)"
        />
        <Rect
          x={52}
          y={34}
          width={8}
          height={42}
          fill={colors.text.inverse}
          opacity={0.5}
          transform="rotate(64 56 55)"
        />

        {/* Ribbon streamers */}
        <Path
          d="M58 30 Q72 22 80 30"
          stroke={colors.info}
          strokeWidth={2.5}
          fill="none"
          opacity={0.6}
        />
        <Path
          d="M66 46 Q80 44 84 56"
          stroke={colors.primary}
          strokeWidth={2.5}
          fill="none"
          opacity={0.5}
        />

        {/* Scattered confetti */}
        <Circle cx={18} cy={20} r={3} fill={colors.info} opacity={0.7} />
        <Circle cx={84} cy={14} r={2.5} fill={colors.accent} opacity={0.85} />
        <Circle cx={90} cy={64} r={3} fill={colors.info} opacity={0.6} />
        <Circle cx={12} cy={58} r={2.5} fill={colors.accent} opacity={0.65} />
        <Circle cx={70} cy={86} r={2.5} fill={colors.primary} opacity={0.5} />
        <Rect
          x={68}
          y={10}
          width={5}
          height={5}
          fill={colors.primary}
          opacity={0.45}
          transform="rotate(24 70 12)"
        />
        <Rect
          x={8}
          y={38}
          width={4}
          height={4}
          fill={colors.info}
          opacity={0.55}
          transform="rotate(-18 10 40)"
        />
        <Rect
          x={40}
          y={10}
          width={4}
          height={4}
          fill={colors.accent}
          opacity={0.7}
          transform="rotate(12 42 12)"
        />
      </Svg>
    </View>
  );
}

export const ConfettiAccent = memo(ConfettiAccentBase);
