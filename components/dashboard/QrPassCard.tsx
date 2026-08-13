import { router } from "expo-router";
import { QrCode } from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import QRCodeSVG from "react-native-qrcode-svg";

import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";

interface QrPassCardProps {
  qrPassValue: string | null;
}

const HEADER_ICON_SIZE = 13;
const QR_SIZE = 80;
const PLACEHOLDER_ICON_SIZE = 28;

/**
 * "Your QR Pass" card, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: a real
 * scannable QR code preview (rendered client-side from the student's pass
 * value via react-native-qrcode-svg — a pinned, SVG-based renderer, not a
 * generated raster image) and a "View QR Pass" CTA.
 *
 * Sized for this card's real ~38% share of the Next Up/QR Pass row (see
 * NextUpAndQrRow.tsx) — the design's mockup canvas is wider than an
 * actual phone screen, so QR_SIZE and the surrounding padding are tuned
 * down from a literal 1:1 pixel copy to keep the QR crisp and the CTA
 * text on one line at real device widths, while preserving the same
 * title/subtitle/QR/CTA composition.
 *
 * When the pass hasn't been issued yet (`qrPassValue` is null), shows a
 * neutral icon placeholder instead of a broken/empty QR block.
 */
function QrPassCardBase({ qrPassValue }: QrPassCardProps) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-surface p-3">
      <Text className="font-poppins-bold text-sm text-primary">
        Your QR Pass
      </Text>
      <Text
        className="mt-0.5 font-poppins-regular text-[11px] text-text-secondary"
        numberOfLines={2}
      >
        {qrPassValue ? "Ready for event entry" : "Not issued yet"}
      </Text>

      <View className="mt-3 items-center justify-center rounded-xl bg-background p-2">
        {qrPassValue ? (
          <QRCodeSVG
            value={qrPassValue}
            size={QR_SIZE}
            color={colors.text.primary}
            backgroundColor={colors.surface}
          />
        ) : (
          <View
            style={{ width: QR_SIZE, height: QR_SIZE }}
            className="items-center justify-center"
          >
            <QrCode size={PLACEHOLDER_ICON_SIZE} color={colors.text.disabled} />
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => router.push(ROUTES.QR_PASS)}
        accessibilityRole="button"
        accessibilityLabel="View QR Pass"
        accessibilityHint="Opens your full QR pass for event entry"
        className="mt-3 h-10 flex-row items-center justify-center gap-1.5 rounded-full bg-primary px-2"
      >
        <QrCode size={HEADER_ICON_SIZE} color={colors.text.inverse} />
        <Text
          className="font-poppins-semibold text-xs text-text-inverse"
          numberOfLines={1}
        >
          View QR Pass
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const QrPassCard = memo(QrPassCardBase);
