import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowLeft, Circle, CircleCheck, Lock } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
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
import { PasswordVisibilityToggle } from "@/components/authentication/PasswordVisibilityToggle";
import { ROUTES } from "@/constants/navigation";
import {
    PASSWORD_REQUIREMENTS,
    getPasswordStrength,
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "@/features/auth/schemas/resetPasswordSchema";
import { updatePassword } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/Reset Password Hero Illustration (White Background).png");

const BACK_ICON_SIZE = 22;
const NOTICE_ICON_SIZE = 20;
const REQUIREMENT_ICON_SIZE = 16;

const DEFAULT_VALUES: ResetPasswordFormValues = {
  newPassword: "",
  confirmPassword: "",
};

const STRENGTH_METER_CONFIG = {
  weak: { color: colors.error, label: "Weak", filledSegments: 1 },
  medium: { color: colors.warning, label: "Medium", filledSegments: 2 },
  strong: { color: colors.success, label: "Strong", filledSegments: 3 },
} as const;

/**
 * Reset Password Screen UI.
 *
 * Pure presentational + form-state component per
 * Designs/Authentication/6. Reset Password Screen.png: logo, hero
 * illustration, "Create New Password" heading, a New Password / Confirm
 * Password pair with a live strength meter and requirements checklist, a
 * secure-encryption notice, the Update Password / Back to Login actions,
 * legal links, and footer branding.
 *
 * Form state is handled locally via react-hook-form + zod — no Supabase
 * call, no session handling. Submission is left as a TODO (matching the
 * pattern already used in LoginScreen.tsx / ForgotPasswordScreen.tsx) since
 * the auth service layer doesn't exist yet — see services/.
 */
export default function ResetPasswordScreen() {
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // AuthProvider only sets this status once a PKCE recovery code from the
  // deep link has been exchanged for a session. Arriving here without that
  // (a stale bookmark, an expired/reused link) means there's no valid
  // session to update — show a friendly notice instead of a form that
  // would just fail on submit.
  const authStatus = useAuthStore((state) => state.status);
  const hasValidRecoverySession = authStatus === "password_recovery";

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const newPasswordValue = watch("newPassword");
  const { level, metCount } = useMemo(
    () => getPasswordStrength(newPasswordValue),
    [newPasswordValue],
  );
  const strengthMeter = STRENGTH_METER_CONFIG[level];
  const showStrengthMeter = newPasswordValue.length > 0;

  const handleToggleNewPasswordVisibility = useCallback(() => {
    setNewPasswordVisible((previous) => !previous);
  }, []);

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((previous) => !previous);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleGoToLogin = useCallback(() => {
    router.push(ROUTES.LOGIN);
  }, []);

  const onSubmit = useCallback(async (values: ResetPasswordFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await updatePassword(values.newPassword);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push(ROUTES.PASSWORD_UPDATED);
  }, []);

  const handleSubmitPress = useCallback(() => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const newPasswordRightAccessory = useMemo(
    () => (
      <PasswordVisibilityToggle
        visible={newPasswordVisible}
        onToggle={handleToggleNewPasswordVisibility}
      />
    ),
    [newPasswordVisible, handleToggleNewPasswordVisibility],
  );

  const confirmPasswordRightAccessory = useMemo(
    () => (
      <PasswordVisibilityToggle
        visible={confirmPasswordVisible}
        onToggle={handleToggleConfirmPasswordVisibility}
      />
    ),
    [confirmPasswordVisible, handleToggleConfirmPasswordVisibility],
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
              className="mt-3.5 h-[220px] w-full scale-125"
              accessibilityRole="image"
              accessibilityLabel="A student and a robot securely protecting a new password with a shield and key"
            />

            <Text className="mt-4 font-poppins-bold text-2xl text-primary">
              Create New Password
            </Text>
            <Text className="mt-1 max-w-[290px] text-center font-poppins-regular text-sm text-text-secondary">
              Your identity has been verified. Create a new secure password for
              your Infinite Techfest account.
            </Text>
          </View>

          {/* Form section. */}
          <View className="mt-6">
            {hasValidRecoverySession ? (
              <>
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon={Lock}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter new password"
                      secureTextEntry={!newPasswordVisible}
                      autoCapitalize="none"
                      autoComplete="password-new"
                      textContentType="newPassword"
                      error={errors.newPassword?.message}
                      accessibilityLabel="New password"
                      accessibilityHint="Required. Enter a new password that meets all the requirements below"
                      rightAccessory={newPasswordRightAccessory}
                    />
                  )}
                />

                <View className="mt-4">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <AuthTextField
                        icon={Lock}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Confirm new password"
                        secureTextEntry={!confirmPasswordVisible}
                        autoCapitalize="none"
                        autoComplete="password-new"
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmitPress}
                        error={errors.confirmPassword?.message}
                        accessibilityLabel="Confirm new password"
                        accessibilityHint="Required. Re-enter the new password to confirm it matches"
                        rightAccessory={confirmPasswordRightAccessory}
                      />
                    )}
                  />
                </View>

                {/* Password strength meter — reflects the New Password field live. */}
                {showStrengthMeter ? (
                  <View className="mt-4 rounded-2xl border border-border bg-background px-4 py-3.5">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-poppins-semibold text-xs text-text-primary">
                        Password Strength
                      </Text>
                      <Text
                        className="font-poppins-semibold text-xs"
                        style={{ color: strengthMeter.color }}
                      >
                        {strengthMeter.label}
                      </Text>
                    </View>

                    <View className="mt-2 flex-row gap-1.5">
                      {[0, 1, 2].map((segmentIndex) => (
                        <View
                          key={segmentIndex}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            backgroundColor:
                              segmentIndex < strengthMeter.filledSegments
                                ? strengthMeter.color
                                : colors.border,
                          }}
                        />
                      ))}
                    </View>

                    <View className="mt-3 gap-1.5">
                      {PASSWORD_REQUIREMENTS.map((requirement) => {
                        const met = requirement.test(newPasswordValue);
                        return (
                          <View
                            key={requirement.id}
                            className="flex-row items-center gap-2"
                          >
                            {met ? (
                              <CircleCheck
                                size={REQUIREMENT_ICON_SIZE}
                                color={colors.success}
                              />
                            ) : (
                              <Circle
                                size={REQUIREMENT_ICON_SIZE}
                                color={colors.text.disabled}
                              />
                            )}
                            <Text
                              className={`font-poppins-regular text-xs ${
                                met
                                  ? "text-text-primary"
                                  : "text-text-secondary"
                              }`}
                            >
                              {requirement.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ) : null}

                {/* Secure encryption notice. */}
                <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lock size={NOTICE_ICON_SIZE} color={colors.primary} />
                  </View>
                  <Text className="flex-1 font-poppins-regular text-xs leading-4 text-text-secondary">
                    Your password will be securely encrypted and updated using{" "}
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
                  accessibilityLabel="Update Password"
                  accessibilityHint="Validates and submits your new password"
                  className={`mt-6 h-14 items-center justify-center rounded-full bg-primary ${
                    isSubmitting ? "opacity-60" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.text.inverse} />
                  ) : (
                    <Text className="font-poppins-semibold text-md text-text-inverse">
                      Update Password
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              // No valid password_recovery session — the recovery link was
              // likely invalid, expired, or already used. Show a friendly
              // notice instead of a form that would just fail on submit.
              <AuthErrorNotice message="This password reset link is invalid or has expired. Please request a new one from the Forgot Password screen." />
            )}

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
