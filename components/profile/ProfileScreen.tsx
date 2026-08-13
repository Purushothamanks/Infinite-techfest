import { router } from "expo-router";
import {
  Award,
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  QrCode,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StudentBottomNav } from "@/components/dashboard/StudentBottomNav";
import { ROUTES } from "@/constants/navigation";
import { signOut } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { colors, shadows } from "@/theme";

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of Infinite Techfest 2026?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsSigningOut(true);
          await signOut();
          setIsSigningOut(false);
          router.replace(ROUTES.WELCOME);
        },
      },
    ]);
  };

  const menuItems = [
    {
      title: "My Scannable QR Pass",
      subtitle: "Pass ID: RPSIT-2026-8921",
      icon: QrCode,
      route: ROUTES.QR_PASS,
      accent: colors.primary,
    },
    {
      title: "Payment Receipts & Status",
      subtitle: "Verified • Total ₹600",
      icon: CreditCard,
      route: ROUTES.PAYMENT_STATUS,
      accent: colors.accent,
    },
    {
      title: "Symposium Schedule & Agenda",
      subtitle: "Aug 23 - 24, 2026",
      icon: Calendar,
      route: ROUTES.SCHEDULE,
      accent: colors.royalblue,
    },
    {
      title: "Notifications & Updates",
      subtitle: "3 new announcements",
      icon: Bell,
      route: ROUTES.NOTIFICATIONS,
      accent: "#8b5cf6",
    },
    {
      title: "My Certificates Portal",
      subtitle: "Preview & download certificates",
      icon: Award,
      action: () =>
        Alert.alert(
          "Certificates Portal",
          "Certificates will be unlocked after event completion on Day 2!"
        ),
      accent: "#059669",
    },
    {
      title: "Symposium Help & Support",
      subtitle: "Contact RPSIT Desk",
      icon: HelpCircle,
      action: () =>
        Alert.alert(
          "RPSIT Support Desk",
          "Email: techfest2026@rpsit.ac.in\nPhone: +91 98421 23456"
        ),
      accent: "#64748b",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-surface border-2 border-accent">
              <User size={32} color={colors.primary} />
            </View>

            <View className="flex-1">
              <Text className="font-poppins-bold text-xl text-text-inverse">
                {user?.fullName || "Purushothaman S"}
              </Text>
              <Text className="font-poppins-regular text-xs text-text-inverse/80">
                {user?.email || "purushothaman@rpsit.ac.in"}
              </Text>

              <View className="mt-2 flex-row items-center gap-2">
                <View className="rounded-full bg-accent/20 px-2.5 py-0.5 border border-accent/40">
                  <Text className="font-poppins-semibold text-[11px] text-accent">
                    CSE • 3rd Year
                  </Text>
                </View>
                <Text className="font-poppins-medium text-[11px] text-text-inverse/70">
                  RPSIT-2026-8921
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View className="px-6 -mt-5">
          <View
            style={shadows.md}
            className="flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4"
          >
            <View className="flex-1 items-center border-r border-border pr-2">
              <Text className="font-poppins-bold text-lg text-primary">3</Text>
              <Text className="font-poppins-medium text-[11px] text-text-secondary">
                Registered
              </Text>
            </View>

            <View className="flex-1 items-center border-r border-border px-2">
              <View className="flex-row items-center gap-1">
                <ShieldCheck size={14} color="#059669" />
                <Text className="font-poppins-bold text-xs text-emerald-600">
                  Verified
                </Text>
              </View>
              <Text className="font-poppins-medium text-[11px] text-text-secondary">
                Payment
              </Text>
            </View>

            <View className="flex-1 items-center pl-2">
              <View className="flex-row items-center gap-1">
                <UserCheck size={14} color={colors.accent} />
                <Text className="font-poppins-bold text-xs text-accent">
                  Active
                </Text>
              </View>
              <Text className="font-poppins-medium text-[11px] text-text-secondary">
                QR Pass
              </Text>
            </View>
          </View>
        </View>

        {/* Account Settings Menu */}
        <View className="px-6 py-6">
          <Text className="font-poppins-bold text-lg text-primary mb-3">
            Account & Symposium Services
          </Text>

          <View className="gap-2.5">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    if (item.route) router.push(item.route as any);
                    else if (item.action) item.action();
                  }}
                  style={shadows.sm}
                  className="flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4"
                >
                  <View className="flex-row items-center gap-3.5">
                    <View
                      style={{ backgroundColor: `${item.accent}15` }}
                      className="h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Icon size={20} color={item.accent} />
                    </View>
                    <View>
                      <Text className="font-poppins-bold text-sm text-primary">
                        {item.title}
                      </Text>
                      <Text className="font-poppins-regular text-xs text-text-secondary">
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>

                  <ChevronRight size={18} color={colors.text.disabled} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            disabled={isSigningOut}
            className="mt-8 h-13 flex-row items-center justify-center gap-2 rounded-full border border-primary bg-surface"
          >
            {isSigningOut ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <LogOut size={18} color={colors.primary} />
                <Text className="font-poppins-bold text-sm text-primary">
                  Sign Out Account
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text className="mt-6 text-center font-poppins-medium text-xs text-text-disabled">
            Infinite Techfest 2026 v1.0.0 • R.P. Sarathy Institute of Technology
          </Text>
        </View>
      </ScrollView>

      <StudentBottomNav />
    </SafeAreaView>
  );
}
