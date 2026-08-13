import { memo } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors } from "@/theme";

interface CountdownRingProps {
  /** Whole days remaining until the event starts (0 = today). */
  daysRemaining: number;
  size?: number;
}

const DEFAULT_SIZE = 72;
const STROKE_WIDTH = 6;
/** Days-remaining window used to scale the ring's fill — purely a decorative
 * approximation of "getting closer" (see comment below), not a literal
 * countdown of a fixed calendar window. */
const FILL_WINDOW_DAYS = 7;
const MIN_FILL_FRACTION = 0.15;

/**
 * Circular countdown indicator for the "Next Up" event card, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png (the ring
 * around "01 DAY"). The filled fraction grows as `daysRemaining` shrinks —
 * a deliberately simple, decorative approximation (not a precise
 * progress-against-a-deadline calculation) since the design doesn't
 * specify exact ring math, only that "sooner" reads as "more filled".
 */
function CountdownRingBase({
  daysRemaining,
  size = DEFAULT_SIZE,
}: CountdownRingProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillFraction = Math.min(
    1,
    Math.max(MIN_FILL_FRACTION, 1 - daysRemaining / FILL_WINDOW_DAYS),
  );
  const strokeDashoffset = circumference * (1 - fillFraction);

  return (
    <View
      style={{ width: size, height: size }}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.accent}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </View>
  );
}

export const CountdownRing = memo(CountdownRingBase);
