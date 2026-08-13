import { colors } from "@/theme/colors";
import { Star } from "lucide-react-native";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Poster.png");
const RPSIT_LOGO_ASSET = require("@/assets/images/RPSIT/RPSIT Logo.png");

const DOT_COUNT = 3;
const DOT_PULSE_DURATION = 450;
const DOT_STAGGER_DELAY = 200;
const DOT_MIN_SCALE = 0.65;
const DOT_MAX_SCALE = 1.6;
const DOT_MIN_OPACITY = 0.45;
const DOT_MAX_OPACITY = 1;
const DIVIDER_STAR_SIZE = 14;

/**
 * A single loading dot in a "wave" indicator: each dot grows and brightens
 * in turn (driven by a shared 0→1→0 progress value mapped to scale +
 * opacity), offset by `delay` so only one dot is at peak size at a time —
 * matching the design's still frame of a large, bold middle dot flanked by
 * smaller, lighter dots. Transform/opacity must be driven via Reanimated's
 * `style` (not a NativeWind className) since they mutate on the UI thread
 * every frame; base size, shape, and color still come from theme-backed
 * utility classes.
 */
function LoadingDot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: DOT_PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: DOT_PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
      ),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 1],
      [DOT_MIN_OPACITY, DOT_MAX_OPACITY],
    ),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [DOT_MIN_SCALE, DOT_MAX_SCALE],
        ),
      },
    ],
  }));

  return (
    <Animated.View
      className="h-2.5 w-2.5 rounded-full bg-primary"
      style={animatedStyle}
    />
  );
}

/**
 * Splash Screen UI.
 *
 * Pure presentational component per Designs/Authentication/1. Splash Screen.png:
 * centered logo poster asset, an infinitely animated three-dot loading
 * indicator, and a bottom-aligned "Powered by" footer.
 *
 * No auth checks, session checks, or navigation happen here — this component
 * only renders the splash UI. Wiring it up to app startup/navigation is a
 * separate concern.
 */
export default function SplashScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={RPSIT_LOGO_ASSET}
          resizeMode="contain"
          className="h-20 w-80"
          accessibilityRole="image"
          accessibilityLabel="R.P. Sarathy Institute of Technology logo"
        />

        <Image
          source={LOGO_ASSET}
          resizeMode="contain"
          className="mt-6 h-64 w-64"
          accessibilityRole="image"
          accessibilityLabel="Infinite Techfest 2026 logo"
        />

        <View
          className="mt-12 flex-row items-center justify-center gap-3"
          accessibilityRole="progressbar"
          accessibilityLabel="Loading"
        >
          {Array.from({ length: DOT_COUNT }).map((_, index) => (
            <LoadingDot key={index} delay={index * DOT_STAGGER_DELAY} />
          ))}
        </View>
      </View>

      <View className="items-center pb-10">
        <View className="flex-row items-center justify-center gap-3 px-8">
          <View className="h-px flex-1 bg-border" />
          <Star
            size={DIVIDER_STAR_SIZE}
            color={colors.accent}
            fill={colors.accent}
          />
          <View className="h-px flex-1 bg-border" />
        </View>

        <Text className="mt-4 font-poppins-regular text-xs text-text-secondary">
          Powered by
        </Text>
        <Text className="mt-1 font-poppins-semibold text-base text-primary">
          R.P. Sarathy Institute of Technology
        </Text>
        <Text className="mt-2 font-poppins-regular text-xs text-text-disabled">
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
