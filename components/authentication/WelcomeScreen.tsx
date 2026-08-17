import { router } from "expo-router";
import { LogIn, Star, UserPlus } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/hero illustration (White Background).png");

const BUTTON_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

/**
 * Welcome Screen UI.
 *
 * Pure presentational component per
 * Designs/Authentication/2. Landing - Welcome.png.
 *
 * Layout is deliberately split into two top-level, independently anchored
 * blocks instead of a single vertically-centered/evenly-distributed column:
 *   1. Content section — logo, hero illustration, heading, description.
 *      Top-anchored with explicit (non-flex) spacing between each element so
 *      proportions match the reference regardless of screen height.
 *   2. Bottom action section — CTAs, divider, legal links, footer.
 *      Anchored near the bottom safe area. A single flexible spacer between
 *      the two sections absorbs any extra vertical space instead of the
 *      sections themselves stretching or centering.
 *
 * No auth, Supabase, or navigation logic lives here — button handlers are
 * temporary placeholders until Login/Register screens exist (see TODOs
 * below and constants/navigation.ts ROUTES.LOGIN / ROUTES.REGISTER).
 */
export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Content section — top-anchored, explicit spacing only. */}
        <View className="items-center pt-2">
          <Image
            source={LOGO_ASSET}
            resizeMode="contain"
            className="h-[88px] w-full max-w-[340px]"
            accessibilityRole="image"
            accessibilityLabel="Infinite Techfest 2026 logo"
          />

          <Image
            source={HERO_ASSET}
            resizeMode="contain"
            className="mt-3.5 h-[220px] w-full scale-110"
            accessibilityRole="image"
            accessibilityLabel="Students and a robot collaborating with technology illustrations"
          />

          <View className="mt-3.5 items-center">
            <View className="items-start">
              <Text className="text-center font-poppins-bold text-3xl leading-7 text-primary">
                Innovate.
              </Text>
              <Text className="text-center font-poppins-bold text-3xl leading-7 text-royalblue">
                Collaborate.
              </Text>
              <Text className="text-center font-poppins-bold text-3xl leading-7 text-accent">
                Inspire.
              </Text>
            </View>
          </View>

          <Text className="mt-3 max-w-[290px] text-center font-poppins-regular text-sm leading-5 text-text-secondary">
            Join the biggest technical symposium and participate in coding
            contests, hackathons, workshops, paper presentations, project expos,
            and technical competitions.
          </Text>
        </View>

        {/* Single flexible spacer — the only flex-based sizing in this
            screen. It pushes the bottom action section down without
            centering or evenly distributing the content above it. */}
        <View className="flex-1" />

        {/* Bottom action section — anchored near the bottom safe area. */}
        <View className="pb-8 mt-3">
          <TouchableOpacity
            onPress={() => router.push(ROUTES.REGISTER)}
            accessibilityRole="button"
            accessibilityLabel="Create Account"
            accessibilityHint="Opens the account registration screen"
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"
          >
            <UserPlus size={BUTTON_ICON_SIZE} color={colors.text.inverse} />
            <Text className="font-poppins-semibold text-md text-text-inverse">
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(ROUTES.LOGIN)}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
            className="mt-4 h-14 flex-row items-center justify-center gap-2 rounded-full border border-primary"
          >
            <LogIn size={BUTTON_ICON_SIZE} color={colors.primary} />
            <Text className="font-poppins-semibold text-md text-primary">
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row items-center justify-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Star
              size={DIVIDER_STAR_SIZE}
              color={colors.accent}
              fill={colors.accent}
            />
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="mt-6 flex-row items-center justify-center gap-2">
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text className="font-poppins-regular text-xs text-primary">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="font-poppins-regular text-xs text-text-disabled">
              •
            </Text>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text className="font-poppins-regular text-xs text-primary">
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6 items-center">
            <Text className="font-poppins-regular text-xs text-text-secondary">
              Powered by
            </Text>
            <Text className="mt-1 font-poppins-semibold text-sm text-primary">
              R.P. Sarathy Institute of Technology
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
