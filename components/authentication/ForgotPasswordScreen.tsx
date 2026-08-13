import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowLeft, Lock, Mail } from "lucide-react-native";
import { useCallback, useState } from "react";
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
import { ROUTES } from "@/constants/navigation";
import {
    forgotPasswordSchema,
    type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgotPasswordSchema";
import { requestPasswordReset } from "@/services/authService";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/Forgot Password Hero Illustration (White Background).png");

const BACK_ICON_SIZE = 22;
const NOTICE_ICON_SIZE = 20;

const DEFAULT_VALUES: ForgotPasswordFormValues = { email: "" };

/**
 * Forgot Password Screen UI.
 *
 * Pure presentational + form-state component per
 * Designs/Authentication/5. Forgot Password.png: logo, hero illustration,
 * "Forgot Password?" heading, a registered-email field, a secure reset
 * notice, the Send Reset Link / Back to Login actions, legal links, and
 * footer branding.
 *
 * Form state is handled locally via react-hook-form + zod — no Supabase
 * call, no email dispatch. Submission is left as a TODO (matching the
 * pattern already used in LoginScreen.tsx / RegisterScreen.tsx) since the
 * auth service layer doesn't exist yet — see services/.
 */
export default function ForgotPasswordScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push(ROUTES.LOGIN);
  }, []);

  const onSubmit = useCallback(async (values: ForgotPasswordFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await requestPasswordReset(values.email);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push({
      pathname: ROUTES.RESET_EMAIL_SENT,
      params: { email: values.email },
    });
  }, []);

  const handleSubmitPress = useCallback(() => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

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
          {/* Header — back navigation to the Login Screen. */}
          <View className="h-10 flex-row items-center pt-2">
            <TouchableOpacity
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the Login screen"
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
              className="mt-3.5 h-[220px] w-full scale-110"
              accessibilityRole="image"
              accessibilityLabel="A student and a robot securely exchanging a password reset email"
            />

            <Text className="mt-4 font-poppins-bold text-2xl text-primary">
              Forgot Password?
            </Text>
            <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
              Enter your registered email address. We&apos;ll send a secure
              password reset link.
            </Text>
          </View>

          {/* Form section. */}
          <View className="mt-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  icon={Mail}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your registered email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmitPress}
                  error={errors.email?.message}
                  accessibilityLabel="Registered email address"
                  accessibilityHint="Required. Enter the email address associated with your account"
                />
              )}
            />

            {/* Secure reset notice. */}
            <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Lock size={NOTICE_ICON_SIZE} color={colors.primary} />
              </View>
              <Text className="flex-1 font-poppins-regular text-xs leading-4 text-text-secondary">
                A secure password reset link will be sent to your email.{"\n"}
                Powered by{" "}
                <Text className="font-poppins-semibold text-success">
                  Supabase
                </Text>{" "}
                Authentication.
              </Text>
            </View>

            {submitError ? <AuthErrorNotice message={submitError} /> : null}

            <TouchableOpacity
              onPress={handleSubmitPress}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Send Reset Link"
              accessibilityHint="Validates your email and sends a password reset link"
              className={`mt-6 h-14 items-center justify-center rounded-full bg-primary ${
                isSubmitting ? "opacity-60" : ""
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text className="font-poppins-semibold text-md text-text-inverse">
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToLogin}
              accessibilityRole="button"
              accessibilityLabel="Back to Login"
              accessibilityHint="Returns to the Login screen"
              className="mt-4 h-14 items-center justify-center rounded-full border border-primary bg-surface"
            >
              <Text className="font-poppins-semibold text-md text-primary">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* Legal links. */}
          <View className="mt-6 flex-row items-center justify-center gap-2">
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text className="font-poppins-regular text-xs text-primary">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="font-poppins-regular text-xs text-text-disabled">
              |
            </Text>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text className="font-poppins-regular text-xs text-primary">
                Privacy Policy
              </Text>
            </TouchableOpacity>
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
