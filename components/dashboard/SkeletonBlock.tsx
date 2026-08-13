import { memo, useEffect } from "react";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface SkeletonBlockProps {
  className: string;
}

const PULSE_DURATION = 700;
const MIN_OPACITY = 0.35;
const MAX_OPACITY = 0.75;

/**
 * A single pulsing placeholder block used to compose skeleton loading
 * states (see DashboardSkeleton.tsx). Follows the same
 * Reanimated-shared-value pulse pattern already used by
 * components/authentication/SplashScreen.tsx's LoadingDot, kept generic
 * here (opacity only) so it can stand in for any rectangular shape via
 * `className`.
 */
function SkeletonBlockBase({ className }: SkeletonBlockProps) {
  const opacity = useSharedValue(MIN_OPACITY);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(MAX_OPACITY, {
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(MIN_OPACITY, {
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`rounded-lg bg-border ${className}`}
      style={animatedStyle}
    />
  );
}

export const SkeletonBlock = memo(SkeletonBlockBase);
