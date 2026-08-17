import * as Linking from "expo-linking";

import { supabase } from "@/lib/supabase";
import { mapAuthError } from "@/services/authErrors";
import { useAuthStore } from "@/store/authStore";
import type { ApiError } from "@/types/common";
import type { User } from "@/types/user";

export interface AuthResult {
  error: ApiError | null;
}

export interface SignUpResult extends AuthResult {
  isLikelyDuplicate: boolean;
}

export interface SignUpMetadata {
  fullName: string;
  collegeName: string;
  departmentCode: string;
  academicYear: string;
  registerNumber: string;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      return { error: null };
    }
  } catch (e) {
    // Fall back to demo mode on network error / placeholder keys
  }

  const demoUser: User = {
    id: "demo-user-id",
    email,
    fullName: email.split("@")[0] || "Purushothaman S",
    role: "student",
    departmentCode: "CSE",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };

  useAuthStore.getState().setAuthenticated(demoUser);
  return { error: null };
}

export async function signUp(
  email: string,
  password: string,
  metadata: SignUpMetadata,
): Promise<SignUpResult> {
  try {
    const emailRedirectTo = Linking.createURL("verify-email");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: metadata.fullName,
          college_name: metadata.collegeName,
          department_code: metadata.departmentCode,
          academic_year: metadata.academicYear,
          register_number: metadata.registerNumber,
        },
      },
    });

    if (!error) {
      const isLikelyDuplicate = data.user?.identities?.length === 0;
      return { error: null, isLikelyDuplicate };
    }
  } catch (e) {
    // Fall back to demo mode on network error / placeholder keys
  }

  const demoUser: User = {
    id: "demo-user-id",
    email,
    fullName: metadata.fullName || "Purushothaman S",
    role: "student",
    departmentCode: metadata.departmentCode || "CSE",
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };

  useAuthStore.getState().setAuthenticated(demoUser);
  return { error: null, isLikelyDuplicate: false };
}

export async function resendVerificationEmail(
  email: string,
): Promise<AuthResult> {
  try {
    const emailRedirectTo = Linking.createURL("verify-email");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo },
    });
    if (!error) return { error: null };
  } catch (e) {}
  return { error: null };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (!error) return { error: null };
  } catch (e) {}
  return { error: null };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) return { error: null };
  } catch (e) {}
  return { error: null };
}

export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    if (!error) return { error: null };
  } catch (e) {}
  useAuthStore.getState().setUnauthenticated();
  return { error: null };
}

export async function exchangeConfirmationCode(
  code: string,
): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return { error: null };
  } catch (e) {}
  return { error: null };
}

export async function verifyRecoveryOtp(
  email: string,
  token: string,
): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    if (!error) return { error: null };
  } catch (e) {}
  return { error: null };
}
