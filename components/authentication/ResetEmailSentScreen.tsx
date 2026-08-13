import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    CircleCheck,
    Hash,
    Info,
    Mail,
    Star,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthErrorNotice } from "@/components/authentication/AuthErrorNotice";
import { AuthTextField } from "@/components/authentication/AuthTextField";
import {
    verifyRecoveryOtpSchema,
    type VerifyRecoveryOtpFormValues,
} from "@/features/auth/schemas/verifyRecoveryOtpSchema";
import {
    requestPasswordReset,
    verifyRecoveryOtp,
} from "@/services/authService";
import { colors } from "@/theme";
import { maskEmail } from "@/utils/maskEmail";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/Secure Email Verification Assistant.png");

const BACK_ICON_SIZE = 22;
const NOTICE_ICON_SIZE = 20;
const BADGE_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

/** Seconds the user must wait before "Resend Code" is pressable again,
 * matching the cooldown pattern used by VerifyEmailScreen.tsx. */
const RESEND_COOLDOWN_SECONDS = 30;

const DEFAULT_VALUES: VerifyRecoveryOtpFormValues = { code: "" };

/**
 * Reset Email Sent Screen UI — now doubles as the OTP-entry step.
 *
 * Adapted from Designs/Authentication/7. RESET EMAIL SENT.png to collect
 * the 6-digit recovery code instead of only confirming a link was sent:
 * logo, hero illustration, "Reset Email Sent" heading, a masked-email
 * status card, a 6-digit code field, the Verify Code action, a Resend Code
 * control (with cooldown, mirroring VerifyEmailScreen.tsx), a "Didn't
 * receive the email?" help section, the shared divider, and footer
 * branding.
 *
 * Shown after a successful Forgot Password Screen submission
 * (components/authentication/ForgotPasswordScreen.tsx) via
 * ROUTES.RESET_EMAIL_SENT?email=<address>.
 *
 * Password recovery uses an OTP the user types in rather than a clickable
 * link: email clients like Gmail prefetch/scan links for safety, which
 * silently burns a PKCE recovery code before the user ever taps it,
 * surfacing a false "invalid or expired" error. Requires the Supabase
 * dashboard's "Reset Password" email template to render `{{ .Token }}` (the
 * OTP) somewhere in its body — see services/authService.ts's
 * requestPasswordReset().
 */
export default function ResetEmailSentScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const maskedEmail = email ? maskEmail(email) : "your registered email";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(
    RESEND_COOLDOWN_SECONDS,
  );
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyRecoveryOtpFormValues>({
    resolver: zodResolver(verifyRecoveryOtpSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

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

  const onSubmit = useCallback(
    async (values: VerifyRecoveryOtpFormValues) => {
      if (!email) {
        return;
      }

      setSubmitError(null);
      setIsSubmitting(true);

      const { error } = await verifyRecoveryOtp(email, values.code);

      setIsSubmitting(false);

      if (error) {
        setSubmitError(error.message);
        return;
      }

      // Success triggers a PASSWORD_RECOVERY auth event — AuthProvider
      // navigates to Reset Password itself, so no explicit router call is
      // needed here.
    },
    [email],
  );

  const handleSubmitPress = useCallback(() => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const handleResendCode = useCallback(async () => {
    if (!email) {
      return;
    }

    setResendError(null);
    setIsResending(true);

    const { error } = await requestPasswordReset(email);

    setIsResending(false);

    if (error) {
      setResendError(error.message);
      return;
    }

    setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
  }, [email]);

  const resendDisabled = cooldownSeconds > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header — back navigation to the Forgot Password Screen. */}
          <View className="h-10 flex-row items-center pt-2">
            <TouchableOpacity
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the Forgot Password screen"
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
              accessibilityLabel="A robot assistant confirming a securely delivered password reset email"
            />

            <Text className="mt-4 font-poppins-bold text-2xl text-primary">
              Reset Email Sent
            </Text>
            <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
              Check your inbox for the 6-digit code.
            </Text>
            <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
              We&apos;ve sent a password reset code to your registered email
              address.
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
                Reset code sent
              </Text>
            </View>
            <CircleCheck size={BADGE_ICON_SIZE} color={colors.success} />
          </View>

          {/* Code entry form. */}
          <View className="mt-6">
            <Controller
              control={control}
              name="code"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  icon={Hash}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter the 6-digit code"
                  keyboardType="number-pad"
                  maxLength={6}
                  textContentType="oneTimeCode"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmitPress}
                  error={errors.code?.message}
                  accessibilityLabel="6-digit password reset code"
                  accessibilityHint="Required. Enter the 6-digit code from your email"
                />
              )}
            />

            {submitError ? <AuthErrorNotice message={submitError} /> : null}

            <TouchableOpacity
              onPress={handleSubmitPress}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Verify Code"
              accessibilityHint="Verifies the code and continues to create a new password"
              className={`mt-6 h-14 items-center justify-center rounded-full bg-primary ${
                isSubmitting ? "opacity-60" : ""
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text className="font-poppins-semibold text-md text-text-inverse">
                  Verify Code
                </Text>
              )}
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
                  onPress={handleResendCode}
                  accessibilityRole="button"
                  accessibilityLabel="Resend Code"
                  accessibilityHint="Sends a new password reset code to your email address"
                >
                  <Text className="font-poppins-medium text-xs text-royalblue">
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}

              {resendError ? (
                <View className="mt-3 w-full">
                  <AuthErrorNotice message={resendError} />
                </View>
              ) : null}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
