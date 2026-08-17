import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  GraduationCap,
  IdCard,
  Lock,
  Mail,
  ShieldCheck,
  Star,
  User,
} from "lucide-react-native";
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
import { AuthSelectField } from "@/components/authentication/AuthSelectField";
import { AuthTextField } from "@/components/authentication/AuthTextField";
import { PasswordVisibilityToggle } from "@/components/authentication/PasswordVisibilityToggle";
import { TermsCheckbox } from "@/components/authentication/TermsCheckbox";
import { ACADEMIC_YEARS } from "@/constants/academicYear";
import { DEPARTMENTS } from "@/constants/departments";
import { ROUTES } from "@/constants/navigation";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/registerSchema";
import { signUp } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useProcessStore } from "@/store/processStore";
import { colors } from "@/theme";


const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/hero illustration (White Background).png");

const BACK_ICON_SIZE = 22;
const BADGE_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

const DEFAULT_VALUES: RegisterFormValues = {
  fullName: "",
  collegeName: "",
  departmentCode: "",
  academicYear: "",
  registerNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

const DEPARTMENT_OPTIONS = DEPARTMENTS.map((department) => ({
  code: department.code,
  label: department.name,
}));

export default function RegisterScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const handleTogglePasswordVisibility = useCallback(() => {
    setPasswordVisible((previous) => !previous);
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

  const onSubmit = useCallback(async (values: RegisterFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await signUp(values.email, values.password, {
      fullName: values.fullName,
      collegeName: values.collegeName,
      departmentCode: values.departmentCode,
      academicYear: values.academicYear,
      registerNumber: values.registerNumber,
    });

    setIsSubmitting(false);

    // Save authenticated user profile in authStore & mark registration active
    useAuthStore.getState().setAuthenticated({
      id: "std-" + Date.now(),
      email: values.email,
      fullName: values.fullName,
      departmentCode: values.departmentCode,
      role: "student",
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    });

    useProcessStore.getState().completeRegistration();


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
              style={{ width: 280, height: 75 }}
              accessibilityRole="image"
              accessibilityLabel="Infinite Techfest 2026 logo"
            />

            <Image
              source={HERO_ASSET}
              resizeMode="contain"
              style={{ width: "100%", height: 160, marginTop: 10 }}
              accessibilityRole="image"
              accessibilityLabel="Students collaborating illustrations"
            />

            <Text className="mt-3 font-poppins-bold text-2xl text-primary">
              Create Your Account
            </Text>
            <Text className="mt-1 text-center font-poppins-regular text-xs text-text-secondary">
              Join Infinite Techfest and start participating in exciting
              symposium events.
            </Text>
          </View>

          {/* Form section. */}
          <View className="mt-5">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AuthTextField
                  icon={User}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  error={errors.fullName?.message}
                  accessibilityLabel="Full name"
                />
              )}
            />

            <View className="mt-3.5">
              <Controller
                control={control}
                name="collegeName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    icon={Building2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your college name"
                    autoCapitalize="words"
                    error={errors.collegeName?.message}
                    accessibilityLabel="College name"
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="departmentCode"
                render={({ field: { value, onChange } }) => (
                  <AuthSelectField
                    icon={GraduationCap}
                    label="Select your department"
                    placeholder="Select your department"
                    value={value}
                    options={DEPARTMENT_OPTIONS}
                    onChange={onChange}
                    error={errors.departmentCode?.message}
                    accessibilityLabel="Department"
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="academicYear"
                render={({ field: { value, onChange } }) => (
                  <AuthSelectField
                    icon={Calendar}
                    label="Select your year"
                    placeholder="Select your year"
                    value={value}
                    options={ACADEMIC_YEARS}
                    onChange={onChange}
                    error={errors.academicYear?.message}
                    accessibilityLabel="Year"
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="registerNumber"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    icon={IdCard}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter register number"
                    autoCapitalize="characters"
                    error={errors.registerNumber?.message}
                    accessibilityLabel="Register number"
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    icon={Mail}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    error={errors.email?.message}
                    accessibilityLabel="Email address"
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    icon={Lock}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Create password"
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    textContentType="newPassword"
                    error={errors.password?.message}
                    accessibilityLabel="Password"
                    rightAccessory={passwordRightAccessory}
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AuthTextField
                    icon={Lock}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirm password"
                    secureTextEntry={!confirmPasswordVisible}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    textContentType="newPassword"
                    error={errors.confirmPassword?.message}
                    accessibilityLabel="Confirm password"
                    rightAccessory={confirmPasswordRightAccessory}
                  />
                )}
              />
            </View>

            <View className="mt-3.5">
              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { value, onChange } }) => (
                  <TermsCheckbox
                    checked={value}
                    onToggle={() => onChange(!value)}
                    onPressTerms={() => {}}
                    onPressPrivacy={() => {}}
                    error={errors.agreeToTerms?.message}
                  />
                )}
              />
            </View>

            {submitError ? <AuthErrorNotice message={submitError} /> : null}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
              accessibilityHint="Submits the registration form"
              className={`mt-5 h-13 items-center justify-center rounded-full bg-primary ${
                isSubmitting ? "opacity-60" : ""
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text className="font-poppins-semibold text-sm text-text-inverse">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToLogin}
              accessibilityRole="button"
              accessibilityLabel="Already have an account? Sign In"
              accessibilityHint="Opens the login screen"
              className="mt-3 h-13 items-center justify-center rounded-full border border-primary bg-surface"
            >
              <Text className="font-poppins-semibold text-sm text-primary">
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider. */}
          <View className="mt-5 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Star
              size={DIVIDER_STAR_SIZE}
              color={colors.accent}
              fill={colors.accent}
            />
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Secure authentication badge. */}
          <View className="mt-5 flex-row items-center justify-center gap-3 rounded-2xl bg-background border border-border px-4 py-3">
            <ShieldCheck size={BADGE_ICON_SIZE} color={colors.success} />
            <View className="items-center">
              <Text className="font-poppins-semibold text-xs text-text-primary">
                Secure authentication
              </Text>
              <Text className="font-poppins-regular text-[11px] text-text-secondary">
                powered by Supabase.
              </Text>
            </View>
          </View>

          {/* Legal links. */}
          <View className="mt-4 flex-row items-center justify-center gap-2">
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
          <View className="mt-4 items-center">
            <Text className="font-poppins-regular text-[11px] text-text-secondary">
              Powered by
            </Text>
            <Text className="mt-0.5 font-poppins-semibold text-xs text-primary">
              R.P. Sarathy Institute of Technology
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
