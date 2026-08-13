import { memo } from "react";
import { Text, View } from "react-native";

import { NextEventCard } from "@/components/dashboard/NextEventCard";
import { QrPassCard } from "@/components/dashboard/QrPassCard";
import type { NextEventSummary } from "@/types/dashboard";

interface NextUpAndQrRowProps {
  nextEvent: NextEventSummary | null;
  qrPassValue: string | null;
}

/**
 * Lays out the "Next Up" and "Your QR Pass" cards side by side, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png. When
 * there's no upcoming event, the Next Up card is replaced with a compact
 * empty message (rather than omitting the row entirely) so the QR Pass
 * card keeps its expected position.
 */
function NextUpAndQrRowBase({ nextEvent, qrPassValue }: NextUpAndQrRowProps) {
  return (
    <View className="mx-6 mt-6 flex-row gap-3">
      {nextEvent ? (
        <NextEventCard event={nextEvent} />
      ) : (
        <View className="flex-1 items-center justify-center rounded-2xl border border-border bg-surface p-5">
          <Text className="text-center font-poppins-semibold text-sm text-text-primary">
            No upcoming event
          </Text>
          <Text className="mt-1 text-center font-poppins-regular text-xs text-text-secondary">
            Register for an event to see it here.
          </Text>
        </View>
      )}

      <QrPassCard qrPassValue={qrPassValue} />
    </View>
  );
}

export const NextUpAndQrRow = memo(NextUpAndQrRowBase);
