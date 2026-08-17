import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileCheck,
  QrCode,
  ShieldCheck,
  UploadCloud,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import { StudentBottomNav } from "@/components/dashboard/StudentBottomNav";
import { fetchPaymentDetails, submitPaymentProof } from "@/services/paymentService";
import { useProcessStore } from "@/store/processStore";
import { colors, shadows } from "@/theme";
import type { PaymentDetails } from "@/services/paymentService";

export function PaymentScreen() {
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"status" | "instructions" | "upload">(
    "status"
  );
  const [utrInput, setUtrInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPaymentDetails();
      setDetails(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleCopy = (text: string, label: string) => {
    Alert.alert("Copied to Clipboard", `${label}: ${text}`);
  };

  const handleProofSubmit = async () => {
    if (!utrInput.trim() || utrInput.length < 6) {
      Alert.alert("Invalid Input", "Please enter a valid 12-digit UTR / UPI Transaction Reference number.");
      return;
    }
    setIsSubmitting(true);
    const res = await submitPaymentProof(utrInput);
    setIsSubmitting(false);

    // Complete process: activates Registration, Payment Verified, QR Pass Ready ("You're all set!")
    useProcessStore.getState().completeFullProcess();

    Alert.alert("Payment Verified! 🎉", "You're all set! Your symposium journey is ready to begin.");
    setDetails((prev) => (prev ? { ...prev, status: "verified", utrNumber: utrInput } : null));
    setActiveTab("status");
  };



  if (loading || !details) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-3 font-poppins-medium text-sm text-text-secondary">
          Loading payment information...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-poppins-bold text-2xl text-primary">
                Payment Verification
              </Text>
              <Text className="font-poppins-regular text-xs text-text-secondary">
                Infinite Techfest 2026 • RPSIT Accounts Desk
              </Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <CreditCard size={20} color={colors.primary} />
            </View>
          </View>

          {/* Segment Selector */}
          <View className="mt-4 flex-row rounded-full bg-surface p-1 border border-border">
            {(["status", "instructions", "upload"] as const).map((tab) => {
              const isActive = activeTab === tab;
              const labels = {
                status: "Status",
                instructions: "UPI / Bank",
                upload: "Submit Proof",
              };
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-full items-center ${
                    isActive ? "bg-primary" : ""
                  }`}
                >
                  <Text
                    className={`font-poppins-semibold text-xs ${
                      isActive ? "text-text-inverse" : "text-text-secondary"
                    }`}
                  >
                    {labels[tab]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tab Content */}
        <View className="p-6">
          {activeTab === "status" && (
            <View>
              {/* Main Status Banner */}
              <View
                style={shadows.md}
                className={`rounded-3xl p-5 border ${
                  details.status === "verified"
                    ? "bg-emerald-700 border-emerald-600"
                    : details.status === "pending"
                    ? "bg-amber-600 border-amber-500"
                    : "bg-red-700 border-red-600"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 rounded-full bg-white/20 px-3 py-1">
                    {details.status === "verified" ? (
                      <CheckCircle2 size={16} color="#fff" />
                    ) : (
                      <Clock size={16} color="#fff" />
                    )}
                    <Text className="font-poppins-bold text-xs text-white capitalize">
                      {details.status === "verified"
                        ? "Payment Verified"
                        : details.status === "pending"
                        ? "Verification Pending"
                        : "Action Required"}
                    </Text>
                  </View>
                  <Text className="font-poppins-bold text-lg text-white">
                    ₹{details.totalFee}
                  </Text>
                </View>

                <Text className="mt-4 font-poppins-bold text-xl text-white">
                  {details.status === "verified"
                    ? "Your Registration is Complete!"
                    : "Payment under review by RPSIT Accounts."}
                </Text>

                <Text className="mt-1 font-poppins-regular text-xs text-white/90 leading-5">
                  {details.status === "verified"
                    ? "Receipt issued. You can now present your QR pass at any event check-in desk."
                    : "Uploaded UTR is being cross-verified against bank statements."}
                </Text>

                <View className="mt-4 border-t border-white/20 pt-3">
                  <Text className="font-poppins-regular text-xs text-white/80">
                    UTR Reference: {details.utrNumber || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Itemized Event Fee Breakdown */}
              <Text className="mt-6 font-poppins-bold text-lg text-primary">
                Itemized Fee Summary
              </Text>
              <View className="mt-3 gap-2.5">
                <View className="flex-row items-center justify-between rounded-xl border border-border bg-surface p-3.5">
                  <View>
                    <Text className="font-poppins-semibold text-sm text-primary">
                      CodeCraft Flagship Contest
                    </Text>
                    <Text className="font-poppins-regular text-xs text-text-secondary">
                      Individual Slot
                    </Text>
                  </View>
                  <Text className="font-poppins-bold text-sm text-primary">₹150</Text>
                </View>

                <View className="flex-row items-center justify-between rounded-xl border border-border bg-surface p-3.5">
                  <View>
                    <Text className="font-poppins-semibold text-sm text-primary">
                      AI Innovators Hackathon
                    </Text>
                    <Text className="font-poppins-regular text-xs text-text-secondary">
                      Team Entry (3 Members)
                    </Text>
                  </View>
                  <Text className="font-poppins-bold text-sm text-primary">₹300</Text>
                </View>

                <View className="flex-row items-center justify-between rounded-xl border border-border bg-surface p-3.5">
                  <View>
                    <Text className="font-poppins-semibold text-sm text-primary">
                      RoboWars Arena Entry
                    </Text>
                    <Text className="font-poppins-regular text-xs text-text-secondary">
                      Bot Slot
                    </Text>
                  </View>
                  <Text className="font-poppins-bold text-sm text-primary">₹150</Text>
                </View>

                <View className="flex-row items-center justify-between rounded-xl bg-primary/10 p-4 border border-primary/20">
                  <Text className="font-poppins-bold text-base text-primary">
                    Total Payable Amount
                  </Text>
                  <Text className="font-poppins-bold text-lg text-primary">₹600</Text>
                </View>
              </View>

              {/* Actions */}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Download Receipt",
                    "Official tax receipt PDF downloaded for ₹600!"
                  )
                }
                style={shadows.sm}
                className="mt-6 flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5"
              >
                <Download size={18} color={colors.text.inverse} />
                <Text className="font-poppins-bold text-sm text-text-inverse">
                  Download Official Receipt
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "instructions" && (
            <View>
              <Text className="font-poppins-bold text-lg text-primary">
                Scan & Pay via Any UPI App
              </Text>
              <Text className="font-poppins-regular text-xs text-text-secondary">
                Google Pay, PhonePe, Paytm, or BHIM UPI
              </Text>

              {/* UPI QR Display */}
              <View style={shadows.sm} className="mt-4 items-center rounded-3xl border border-border bg-surface p-6">
                <View className="rounded-2xl border-2 border-primary/20 bg-white p-3">
                  <QRCode value={details.upiId} size={180} color={colors.primary} />
                </View>
                <Text className="mt-4 font-poppins-bold text-base text-primary">
                  {details.upiId}
                </Text>

                <TouchableOpacity
                  onPress={() => handleCopy(details.upiId, "UPI ID")}
                  className="mt-2 flex-row items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5"
                >
                  <Copy size={14} color={colors.primary} />
                  <Text className="font-poppins-semibold text-xs text-primary">
                    Copy UPI ID
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Direct Bank Details */}
              <Text className="mt-6 font-poppins-bold text-lg text-primary">
                Direct Bank Transfer (NEFT / IMPS)
              </Text>
              <View className="mt-3 rounded-2xl border border-border bg-surface p-4 gap-3">
                <View className="flex-row items-center justify-between border-b border-border pb-2.5">
                  <Text className="font-poppins-regular text-xs text-text-secondary">
                    Bank Name
                  </Text>
                  <Text className="font-poppins-bold text-sm text-primary">
                    {details.bankName}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between border-b border-border pb-2.5">
                  <Text className="font-poppins-regular text-xs text-text-secondary">
                    Account Holder
                  </Text>
                  <Text className="font-poppins-semibold text-xs text-text-primary">
                    {details.accountHolder}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between border-b border-border pb-2.5">
                  <Text className="font-poppins-regular text-xs text-text-secondary">
                    Account Number
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleCopy(details.accountNumber, "Account Number")}
                    className="flex-row items-center gap-1"
                  >
                    <Text className="font-poppins-bold text-sm text-primary">
                      {details.accountNumber}
                    </Text>
                    <Copy size={12} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="font-poppins-regular text-xs text-text-secondary">
                    IFSC Code
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleCopy(details.ifscCode, "IFSC Code")}
                    className="flex-row items-center gap-1"
                  >
                    <Text className="font-poppins-bold text-sm text-primary">
                      {details.ifscCode}
                    </Text>
                    <Copy size={12} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setActiveTab("upload")}
                className="mt-6 flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5"
              >
                <UploadCloud size={18} color={colors.accent} />
                <Text className="font-poppins-bold text-sm text-text-inverse">
                  Completed Payment? Submit Proof →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "upload" && (
            <View>
              <Text className="font-poppins-bold text-lg text-primary">
                Upload Payment Verification Proof
              </Text>
              <Text className="font-poppins-regular text-xs text-text-secondary">
                Provide your 12-digit UTR reference or upload transaction screenshot
              </Text>

              <View className="mt-4 gap-4">
                <View>
                  <Text className="font-poppins-medium text-xs text-primary mb-1">
                    UPI UTR / Bank Reference Number *
                  </Text>
                  <TextInput
                    placeholder="e.g. 429810294812"
                    value={utrInput}
                    onChangeText={setUtrInput}
                    keyboardType="number-pad"
                    className="rounded-xl border border-border bg-surface p-3.5 font-poppins-regular text-sm text-text-primary"
                  />
                </View>

                {/* Screenshot Upload Simulator Box */}
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Attach Screenshot",
                      "Selected payment_receipt.jpg from gallery!"
                    )
                  }
                  className="items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6"
                >
                  <UploadCloud size={32} color={colors.primary} />
                  <Text className="mt-2 font-poppins-bold text-sm text-primary">
                    Upload Payment Screenshot
                  </Text>

                  <Text className="mt-1 font-poppins-regular text-xs text-text-secondary">
                    PNG, JPG, or PDF up to 5MB
                  </Text>
                </TouchableOpacity>

                <View className="rounded-2xl border border-border bg-surface p-4">
                  <View className="flex-row items-center gap-2">
                    <ShieldCheck size={18} color={colors.primary} />
                    <Text className="font-poppins-bold text-xs text-primary">
                      Instant Auto-Check Engine
                    </Text>
                  </View>
                  <Text className="mt-1 font-poppins-regular text-xs text-text-secondary leading-5">
                    Valid UTR submissions reflect automatically on your QR entry pass within 1-2 hours.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleProofSubmit}
                  disabled={isSubmitting}
                  className="items-center justify-center rounded-full bg-primary py-3.5 mt-2"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-poppins-bold text-sm text-text-inverse">
                      Submit Proof for Verification
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <StudentBottomNav />
    </SafeAreaView>
  );
}
