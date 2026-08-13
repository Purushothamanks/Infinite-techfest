import { CheckCircle2 } from "lucide-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

import { ConfettiAccent } from "@/components/dashboard/ConfettiAccent";
import { colors } from "@/theme";

interface StatusBannerProps {
  registrationActive: boolean;
  paymentVerified: boolean;
  qrPassReady: boolean;
}

const CHECK_ICON_SIZE = 14;

/**
 * "You're all set!" readiness banner, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png. Renders
 * a checklist row (Registration Active / Payment Verified / QR Pass
 * Ready) — each item's check mark only shows filled-green when its
 * corresponding boolean is true, so a student who hasn't finished
 * registration/payment/QR issuance sees an accurate state rather than a
 * hardcoded "all done" message.
 *
 * Uses lucide's PartyPopper emoji-style glyph via plain text ("🎉") to
 * match the design's celebratory tone without introducing a raster asset
 * for a single inline glyph — the accompanying ConfettiAccent SVG (a
 * vector decoration, not a photographic/illustrative asset) supplies the
 * scattered confetti dots seen in the design.
 */
function StatusBannerBase({
  registrationActive,
  paymentVerified,
  qrPassReady,
}: StatusBannerProps) {
  const checklist: { label: string; value: string; done: boolean }[] = [
    { label: "Registration", value: "Active", done: registrationActive },
    { label: "Payment", value: "Verified", done: paymentVerified },
    { label: "QR Pass", value: "Ready", done: qrPassReady },
  ];

  return (
    <View className="mx-6 mt-5 overflow-hidden rounded-2xl border border-border bg-info/5 px-5 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-poppins-bold text-lg text-primary">
            You&apos;re all set! 🎉
          </Text>
          <Text className="mt-1 font-poppins-regular text-xs text-text-secondary">
            Your symposium journey is ready to begin.
          </Text>
        </View>
        <ConfettiAccent size={80} />
      </View>

      <View className="mt-4 flex-row justify-between border-t border-border pt-3">
        {checklist.map((item) => (
          <View
            key={item.label}
            className="flex-1 flex-row items-start gap-1.5 pr-1"
          >
            <View
              className={`mt-0.5 h-5 w-5 items-center justify-center rounded-full ${
                item.done ? "bg-success" : "bg-border"
              }`}
            >
              <CheckCircle2
                size={CHECK_ICON_SIZE}
                color={item.done ? colors.text.inverse : colors.text.disabled}
              />
            </View>
            <View className="flex-1">
              <Text
                className="font-poppins-regular text-xs text-text-secondary"
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text
                className="font-poppins-semibold text-xs text-text-primary"
                numberOfLines={1}
              >
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export const StatusBanner = memo(StatusBannerBase);
