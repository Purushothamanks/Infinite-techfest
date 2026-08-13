import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowLeft, Lock, Mail, ShieldCheck, Star } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
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
import { PasswordVisibilityToggle } from "@/components/authentication/PasswordVisibilityToggle";
import { ROUTES } from "@/constants/navigation";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import { signIn } from "@/services/authService";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/hero illustration (White Background).png");

const BACK_ICON_SIZE = 22;
const BADGE_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

const DEFAULT_VALUES: LoginFormValues = { email: "", password: "" };

/**
 * Login Screen UI.
 *
 * Pure presentational + form-state component per
 * Designs/Authentication/3. Login Screen.png: logo, hero illustration,
 * "Welcome Back" heading, email/password fields, Forgot Password link,
 * Sign In / Create New Account actions, a Supabase-secured badge, legal
 * links, and footer branding.
 *
 * Form state is handled locally via react-hook-form + zod — no Supabase
 * call, no auth/session logic. Submission is left as a TODO (matching the
 * pattern already used in WelcomeScreen.tsx) since the auth service layer
 * doesn't exist yet — see services/.
 */
export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const handleTogglePasswordVisibility = useCallback(() => {
    setPasswordVisible((previous) => !previous);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const onSubmit = useCallback(async (values: LoginFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await signIn(values.email, values.password);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.replace(ROUTES.HOME);
  }, []);

  const passwordRightAccessory = useMemo(
    () => (
      <PasswordVisibilityToggle
        visible={passwordVisible}
        onToggle={handleTogglePasswordVisibility}
      />
    ),
    [passwordVisible, handleTogglePasswordVisibility],
  );

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
          {/* Header — back navigation to the Welcome Screen. */}
          <View className="h-10 flex-row items-center pt-2">
            <TouchableOpacity
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the Welcome screen"
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
              accessibilityLabel="Students and a robot collaborating with technology illustrations"
            />

            <Text className="mt-4 font-poppins-bold text-2xl text-primary">
              Welcome Back
            </Text>
            <Text className="mt-1 text-center font-poppins-regular text-sm text-text-secondary">
              Sign in to continue your symposium journey.
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
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  error={errors.email?.message}
                  accessibilityLabel="Email address"
                />
              )}
            />

            <View className="mt-4">
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    icon={Lock}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    error={errors.password?.message}
                    accessibilityLabel="Password"
                    rightAccessory={passwordRightAccessory}
                  />
                )}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
              accessibilityRole="link"
              accessibilityLabel="Forgot Password"
              accessibilityHint="Opens the password reset flow"
              className="mt-2 self-end"
            >
              <Text className="font-poppins-medium text-xs text-primary">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {submitError ? <AuthErrorNotice message={submitError} /> : null}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Sign In"
              accessibilityHint="Submits the login form"
              className={`mt-6 h-14 items-center justify-center rounded-full bg-primary ${
                isSubmitting ? "opacity-60" : ""
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text className="font-poppins-semibold text-md text-text-inverse">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(ROUTES.REGISTER)}
              accessibilityRole="button"
              accessibilityLabel="Create New Account"
              accessibilityHint="Opens the account registration screen"
              className="mt-4 h-14 items-center justify-center rounded-full border border-primary bg-surface"
            >
              <Text className="font-poppins-semibold text-md text-primary">
                Create New Account
              </Text>
            </TouchableOpacity>
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

          {/* Secure authentication badge. */}
          <View className="mt-6 flex-row items-center justify-center gap-3 rounded-2xl bg-background border border-border px-4 py-3.5">
            <ShieldCheck size={BADGE_ICON_SIZE} color={colors.success} />
            <View className="items-center">
              <Text className="font-poppins-semibold text-sm text-text-primary">
                Secure authentication
              </Text>
              <Text className="font-poppins-regular text-sm text-text-secondary">
                powered by Supabase.
              </Text>
            </View>
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
