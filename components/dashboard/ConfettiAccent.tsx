import { memo } from "react";
import { Image, View } from "react-native";

const CONFETTI_ASSET = require("@/assets/images/Student/confetti.webp");

/**
 * Decorative "party popper + confetti" illustration for the status
 * banner, per Designs/Student Module/1. STUDENT HOME DASHBOARD UI
 * DESIGN.png.
 *
 * Uses the project's official student confetti asset from
 * assets/images/Student/confetti.webp.
 */
function ConfettiAccentBase({ size = 80 }: { size?: number }) {
  return (
    <View
      style={{ width: size, height: size }}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={CONFETTI_ASSET}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

export const ConfettiAccent = memo(ConfettiAccentBase);

