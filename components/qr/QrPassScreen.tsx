import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  QrCode as QrIcon,
  Share2,
  ShieldCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import { StudentBottomNav } from "@/components/dashboard/StudentBottomNav";
import { useAuthStore } from "@/store/authStore";
import { useProcessStore } from "@/store/processStore";
import { colors, shadows } from "@/theme";

const RPSIT_LOGO = require("@/assets/images/RPSIT/RPSIT Logo.png");


export function QrPassScreen() {
  const { width } = useWindowDimensions();
  const passValue = "ITF2026-PASS-8921-RPSIT";
  const user = useAuthStore((state) => state.user);
  const { isPaymentVerified, completeFullProcess } = useProcessStore();

  // Dynamically calculate QR size to fit inside card on small mobile screens
  const dynamicQrSize = Math.min(160, Math.max(120, width - 140));

  const [registeredEvents] = useState([
    { title: "CodeCraft", location: "Lab 404", status: isPaymentVerified ? "Verified" : "Pending" },
    { title: "AI Innovators", location: "Seminar Hall", status: isPaymentVerified ? "Verified" : "Pending" },
    { title: "Tech Quiz", location: "Auditorium", status: "Pending" },
    { title: "RoboWars", location: "Ground Arena", status: isPaymentVerified ? "Verified" : "Pending" },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-3 pb-2 max-w-4xl mx-auto w-full">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-poppins-bold text-2xl text-primary">
                My QR Entry Pass
              </Text>
              <Text className="font-poppins-regular text-xs text-text-secondary">
                Infinite Techfest 2026 • RPSIT Pass
              </Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <QrIcon size={20} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* QR Pass Card (Ticket View) */}
        <View className="px-6 py-2 max-w-4xl mx-auto w-full">
          <View
            style={shadows.lg}
            className="overflow-hidden rounded-3xl border border-border bg-surface w-full"
          >
            {/* Top Ticket Header */}
            <View className="bg-primary p-5 items-center w-full">
              <View className="h-10 w-36 items-center justify-center mb-1 overflow-hidden">
                <Image
                  source={RPSIT_LOGO}
                  resizeMode="contain"
                  className="h-full w-full"
                  accessibilityLabel="RPSIT Institution Logo"
                />
              </View>
              <Text className="font-poppins-semibold text-xs text-accent uppercase tracking-widest text-center">
                R.P. Sarathy Institute of Technology
              </Text>
              <Text className="mt-1 font-poppins-bold text-xl text-text-inverse text-center">
                INFINITE TECHFEST 2026
              </Text>
              <View className="mt-2 flex-row items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 border border-emerald-400/30">
                <ShieldCheck size={14} color={isPaymentVerified ? "#34d399" : "#f59e0b"} />
                <Text className={`font-poppins-semibold text-xs ${isPaymentVerified ? "text-emerald-300" : "text-amber-300"}`}>
                  {isPaymentVerified ? "OFFICIAL DELEGATE PASS" : "PASS PENDING VERIFICATION"}
                </Text>
              </View>
            </View>

            {/* QR Code Graphic Container */}
            <View className="items-center justify-center bg-white p-5 w-full">
              {isPaymentVerified ? (
                <>
                  <View className="rounded-2xl border-4 border-primary/20 p-2.5 bg-white max-w-full overflow-hidden items-center justify-center">
                    <QRCode
                      value={passValue}
                      size={dynamicQrSize}
                      color={colors.primary}
                      backgroundColor="#FFFFFF"
                    />
                  </View>

                  <Text className="mt-3 font-poppins-bold text-base text-primary tracking-wider text-center">
                    {passValue}
                  </Text>
                  <Text className="font-poppins-regular text-xs text-text-secondary text-center">
                    Present this QR at Gate & Event Check-in
                  </Text>
                </>
              ) : (
                <View className="py-6 px-4 items-center justify-center">
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-3 border border-amber-300">
                    <QrIcon size={32} color="#d97706" />
                  </View>
                  <Text className="font-poppins-bold text-base text-primary text-center">
                    QR Pass Locked
                  </Text>
                  <Text className="mt-1 max-w-xs font-poppins-regular text-xs text-text-secondary text-center leading-4">
                    Complete your registration & payment verification to unlock your official scannable entry QR pass.
                  </Text>

                  <TouchableOpacity
                    onPress={completeFullProcess}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-primary items-center justify-center"
                  >
                    <Text className="font-poppins-semibold text-xs text-text-inverse">
                      ⚡ Complete Verification & Unlock Pass
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Ticket Dashed Separator */}
            <View className="flex-row items-center justify-between bg-white px-2">
              <View className="h-6 w-3 rounded-r-full bg-background border-r border-t border-b border-border" />
              <View className="h-[1px] flex-1 border-b border-dashed border-border" />
              <View className="h-6 w-3 rounded-l-full bg-background border-l border-t border-b border-border" />
            </View>

            {/* Student Info Details */}
            <View className="bg-surface p-5">
              <View className="flex-row justify-between">
                <View>
                  <Text className="font-poppins-regular text-xs text-text-secondary">
                    Delegate Name
                  </Text>
                  <Text className="font-poppins-bold text-base text-primary">
                    {user?.fullName || "Purushothaman S"}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-poppins-regular text-xs text-text-secondary">
                    Registration ID
                  </Text>
                  <Text className="font-poppins-bold text-sm text-accent">
                    {isPaymentVerified ? "RPSIT-2026-8921" : "PENDING-REG"}
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row justify-between border-t border-border/60 pt-3">
                <View>
                  <Text className="font-poppins-regular text-[11px] text-text-secondary">
                    College / Dept
                  </Text>
                  <Text className="font-poppins-medium text-xs text-text-primary">
                    RPSIT • CSE
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-poppins-regular text-[11px] text-text-secondary">
                    Pass Status
                  </Text>
                  <View className="flex-row items-center gap-1">
                    {isPaymentVerified ? (
                      <>
                        <CheckCircle2 size={14} color="#059669" />
                        <Text className="font-poppins-semibold text-xs text-emerald-600">
                          Active
                        </Text>
                      </>
                    ) : (
                      <>
                        <Clock size={14} color="#d97706" />
                        <Text className="font-poppins-semibold text-xs text-amber-600">
                          Pending
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>


          {/* Action Buttons */}
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Save Pass", "QR Pass downloaded to gallery!")
              }
              style={shadows.sm}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-3"
            >
              <Download size={18} color={colors.text.inverse} />
              <Text className="font-poppins-semibold text-xs text-text-inverse">
                Save to Phone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert("Share Pass", "Pass details copied to clipboard!")
              }
              style={shadows.sm}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-primary bg-surface py-3"
            >
              <Share2 size={18} color={colors.primary} />
              <Text className="font-poppins-semibold text-xs text-primary">
                Share Pass
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registered Events Entry Checklist */}
        <View className="px-6 py-4 max-w-4xl mx-auto w-full">
          <Text className="font-poppins-bold text-lg text-primary">
            Event Entry Status
          </Text>
          <Text className="font-poppins-regular text-xs text-text-secondary mb-3">
            Coordinators scan your QR code at each venue hall entry
          </Text>

          <View className="gap-2.5">
            {registeredEvents.map((evt, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between rounded-xl border border-border bg-surface p-3.5"
              >
                <View className="flex-row items-center gap-3">
                  {evt.status === "Verified" ? (
                    <CheckCircle2 size={20} color="#059669" />
                  ) : (
                    <Clock size={20} color={colors.accent} />
                  )}
                  <View>
                    <Text className="font-poppins-semibold text-sm text-primary">
                      {evt.title}
                    </Text>
                    <Text className="font-poppins-regular text-xs text-text-secondary">
                      Venue: {evt.location}
                    </Text>
                  </View>
                </View>

                <View
                  className={`rounded-full px-3 py-1 ${
                    evt.status === "Verified"
                      ? "bg-emerald-100"
                      : "bg-amber-100"
                  }`}
                >
                  <Text
                    className={`font-poppins-medium text-xs ${
                      evt.status === "Verified"
                        ? "text-emerald-700"
                        : "text-amber-800"
                    }`}
                  >
                    {evt.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View className="mx-6 mb-8 max-w-4xl mx-auto w-full rounded-2xl border border-border bg-surface p-4">
          <View className="flex-row items-center gap-2">
            <AlertCircle size={18} color={colors.primary} />
            <Text className="font-poppins-bold text-sm text-primary">
              Gate Entry Guidelines
            </Text>
          </View>

          <Text className="mt-1.5 font-poppins-regular text-xs text-text-secondary leading-5">
            1. Keep your physical college ID card ready along with this digital pass.{"\n"}
            2. High brightness on your phone screen speeds up scanner verification.{"\n"}
            3. In case of scanner issues, display your Reg ID (RPSIT-2026-8921) to the desk.
          </Text>
        </View>
      </ScrollView>

      <StudentBottomNav />
    </SafeAreaView>
  );
}
