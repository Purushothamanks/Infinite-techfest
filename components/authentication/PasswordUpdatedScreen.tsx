import { router } from "expo-router";
import {
    ArrowLeft,
    Check,
    CircleCheck,
    LogIn,
    Star,
} from "lucide-react-native";
import { useCallback } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/PASSWORD UPDATED.png");

const BACK_ICON_SIZE = 22;
const SUCCESS_BADGE_ICON_SIZE = 26;
const NOTICE_ICON_SIZE = 20;
const BUTTON_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

/**
 * Password Updated Screen UI.
 *
 * Pure presentational component per
 * Designs/Authentication/9. Password Updated.png: logo, hero illustration,
 * a success badge, "Password Updated" heading, a two-line confirmation
 * message, a subtle account-secured status card, the Sign In action, and
 * the shared divider + footer branding.
 *
 * Deliberately mirrors the structure of
 * components/authentication/ResetEmailSentScreen.tsx and
 * components/authentication/VerifyEmailScreen.tsx (same header, hero
 * placement, typography, card, button, divider, and footer patterns) so
 * this success-state screen stays visually consistent with the rest of the
 * authentication flow.
 *
 * Shown after a successful Reset Password Screen submission
 * (components/authentication/ResetPasswordScreen.tsx) via
 * ROUTES.PASSWORD_UPDATED. The Reset Password screen is responsible for
 * updating the password — this screen is only the success-state UI shown
 * once that update has already succeeded.
 */
export default function PasswordUpdatedScreen() {
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleSignIn = useCallback(() => {
    router.push(ROUTES.LOGIN);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header — back navigation to the Reset Password Screen. */}
        <View className="h-10 flex-row items-center pt-2">
          <TouchableOpacity
            onPress={handleGoBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the Reset Password screen"
            className="h-10 w-10 items-center justify-center rounded-full"
            hitSlop={8}
          >
            <ArrowLeft size={BACK_ICON_SIZE} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Content section — top-anchored, explicit spacing only. */}
        <View className="items-center">
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
            className="mt-3.5 h-[220px] w-full"
            accessibilityRole="image"
            accessibilityLabel="A robot and shield confirming the password has been securely updated"
          />

          <View className="mt-4 h-14 w-14 items-center justify-center rounded-full bg-success">
            <Check
              size={SUCCESS_BADGE_ICON_SIZE}
              color={colors.text.inverse}
              strokeWidth={3}
            />
          </View>

          <Text className="mt-4 font-poppins-bold text-2xl text-primary">
            Password Updated
          </Text>
          <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
            Your password has been changed successfully.
          </Text>
          <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
            You can now sign in with your new password.
          </Text>
        </View>

        {/* Account-secured status card. */}
        <View className="mt-6 flex-row items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-success/10">
            <CircleCheck size={NOTICE_ICON_SIZE} color={colors.success} />
          </View>
          <Text className="flex-1 font-poppins-regular text-xs leading-4 text-text-secondary">
            Your account is now secured with your new password.
          </Text>
        </View>

        {/* Primary action. */}
        <View className="mt-6">
          <TouchableOpacity
            onPress={handleSignIn}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
            accessibilityHint="Returns to the Login screen to sign in with your new password"
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"
          >
            <LogIn size={BUTTON_ICON_SIZE} color={colors.text.inverse} />
            <Text className="font-poppins-semibold text-md text-text-inverse">
              Sign In
            </Text>
          </TouchableOpacity>

          <Text className="mt-3 text-center font-poppins-regular text-xs text-text-secondary">
            You can now sign in securely with your new password.
          </Text>
        </View>

        {/* Divider. */}
        <View className="mt-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Star
            size={DIVIDER_STAR_SIZE}
            color={colors.accent}
            fill={colors.accent}
          />
          <View className="h-px flex-1 bg-border" />
        </View>

        {/* Footer branding. */}
        <View className="mt-6 items-center">
          <Text className="font-poppins-regular text-xs text-text-secondary">
            Powered by
          </Text>
          <Text className="mt-1 font-poppins-semibold text-sm text-primary">
            R.P. Sarathy Institute of Technology
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
