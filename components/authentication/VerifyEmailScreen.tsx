import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CircleCheck, Info, Mail, Star } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthErrorNotice } from "@/components/authentication/AuthErrorNotice";
import { resendVerificationEmail } from "@/services/authService";
import { colors } from "@/theme";
import { maskEmail } from "@/utils/maskEmail";
import { openEmailApp } from "@/utils/openEmailApp";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/Secure Email Verification Assistant.png");

const BACK_ICON_SIZE = 22;
const NOTICE_ICON_SIZE = 20;
const BADGE_ICON_SIZE = 20;
const BUTTON_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

/** Seconds the user must wait before "Resend Verification Email" is
 * pressable again, per Designs/Authentication/5. Email Verification
 * Screen.png ("Resend available in 30s"). */
const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Verify Email Screen UI.
 *
 * Pure presentational component per
 * Designs/Authentication/5. Email Verification Screen.png: logo, hero
 * illustration, "Verify Your Email" heading, a masked-email status card, the
 * Open Email App action, Resend Verification Email (with cooldown) / Change
 * Email Address secondary actions, a "Didn't receive the email?" help
 * section, the shared divider, and footer branding.
 *
 * Shown after a successful Register Screen submission
 * (components/authentication/RegisterScreen.tsx) via
 * ROUTES.VERIFY_EMAIL?email=<address>. No Supabase call is made directly
 * here — resend/open-mail actions are thin wrappers left as TODOs until the
 * auth service layer exists (see services/), per AGENTS.md.
 */
export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [cooldownSeconds, setCooldownSeconds] = useState(
    RESEND_COOLDOWN_SECONDS,
  );
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const maskedEmail = email ? maskEmail(email) : "your registered email";

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldownSeconds((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleOpenEmailApp = useCallback(() => {
    void openEmailApp();
  }, []);

  const handleResendVerificationEmail = useCallback(async () => {
    if (!email) {
      return;
    }

    setResendError(null);
    setIsResending(true);

    const { error } = await resendVerificationEmail(email);

    setIsResending(false);

    if (error) {
      setResendError(error.message);
      return;
    }

    setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
  }, [email]);

  const handleChangeEmailAddress = useCallback(() => {
    router.back();
  }, []);

  const resendDisabled = cooldownSeconds > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header — back navigation to the Register Screen. */}
        <View className="h-10 flex-row items-center pt-2">
          <TouchableOpacity
            onPress={handleGoBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the Register screen"
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
            accessibilityLabel="A robot assistant confirming a securely verified email"
          />

          <Text className="mt-4 font-poppins-bold text-2xl text-primary">
            Verify Your Email
          </Text>
          <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
            We&apos;ve sent a verification link to your email address.
          </Text>
        </View>

        {/* Masked email status card. */}
        <View className="mt-6 flex-row items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail size={NOTICE_ICON_SIZE} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="font-poppins-semibold text-sm text-text-primary">
              {maskedEmail}
            </Text>
            <Text className="mt-0.5 font-poppins-regular text-xs text-text-secondary">
              Verification link sent
            </Text>
          </View>
          <CircleCheck size={BADGE_ICON_SIZE} color={colors.success} />
        </View>

        <Text className="mt-4 text-center font-poppins-regular text-sm text-text-secondary">
          Please check your inbox and click the verification link to activate
          your account.
        </Text>

        {/* Primary + secondary actions. */}
        <View className="mt-6">
          <TouchableOpacity
            onPress={handleOpenEmailApp}
            accessibilityRole="button"
            accessibilityLabel="Open Email App"
            accessibilityHint="Opens your device's email application"
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"
          >
            <Mail size={BUTTON_ICON_SIZE} color={colors.text.inverse} />
            <Text className="font-poppins-semibold text-md text-text-inverse">
              Open Email App
            </Text>
          </TouchableOpacity>

          <View className="mt-4 items-center">
            {resendDisabled ? (
              <Text className="font-poppins-medium text-xs text-text-disabled">
                Resend available in {cooldownSeconds}s
              </Text>
            ) : isResending ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <TouchableOpacity
                onPress={handleResendVerificationEmail}
                accessibilityRole="button"
                accessibilityLabel="Resend Verification Email"
                accessibilityHint="Sends a new verification link to your email address"
              >
                <Text className="font-poppins-medium text-xs text-royalblue">
                  Resend Verification Email
                </Text>
              </TouchableOpacity>
            )}

            {resendError ? (
              <View className="mt-3 w-full">
                <AuthErrorNotice message={resendError} />
              </View>
            ) : null}

            <Text className="mt-2 font-poppins-regular text-xs text-text-disabled">
              or
            </Text>

            <TouchableOpacity
              onPress={handleChangeEmailAddress}
              accessibilityRole="button"
              accessibilityLabel="Change Email Address"
              accessibilityHint="Returns to registration to update your email address"
              className="mt-2"
            >
              <Text className="font-poppins-medium text-xs text-royalblue">
                Change Email Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help section. */}
        <View className="mt-6 flex-row items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
          <Info size={NOTICE_ICON_SIZE} color={colors.info} />
          <View className="flex-1">
            <Text className="font-poppins-semibold text-xs text-text-primary">
              Didn&apos;t receive the email?
            </Text>
            <Text className="mt-1.5 font-poppins-regular text-xs leading-4 text-text-secondary">
              • Check your spam or junk folder.
            </Text>
            <Text className="mt-0.5 font-poppins-regular text-xs leading-4 text-text-secondary">
              • Make sure your email address is correct.
            </Text>
          </View>
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
