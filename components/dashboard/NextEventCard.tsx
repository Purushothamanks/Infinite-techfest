import { router } from "expo-router";
import { Calendar, Clock, MapPin } from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { CountdownRing } from "@/components/dashboard/CountdownRing";
import { eventDetailsRoute } from "@/constants/navigation";
import type { NextEventSummary } from "@/types/dashboard";
import { formatEventDate } from "@/utils/formatEventDate";

interface NextEventCardProps {
  event: NextEventSummary;
}

const RING_SIZE = 68;
const META_ICON_SIZE = 14;
const HEADER_CALENDAR_ICON_SIZE = 15;

/**
 * "Next Up" card for the soonest registered event, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: dark
 * primary-tinted card with a small calendar glyph in the header corner,
 * the event title, a metadata column beside a large countdown ring, and
 * a full-width "View Event" CTA that opens Event Details.
 *
 * This card now gets the majority share of its row (see
 * NextUpAndQrRow.tsx's flex-[1.7]/flex-1 split) rather than an even 50/50
 * split with the QR Pass card, matching the design's proportions and
 * leaving enough width for both the metadata text and the countdown ring
 * to sit side by side without truncating.
 */
function NextEventCardBase({ event }: NextEventCardProps) {
  const daysLabel =
    event.daysRemaining === 0
      ? "TODAY"
      : event.daysRemaining === 1
        ? "DAY"
        : "DAYS";
  const daysValue = event.daysRemaining.toString().padStart(2, "0");

  return (
    <View className="flex-1 rounded-2xl bg-primary p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-poppins-semibold text-xs text-text-inverse/80">
          Next Up
        </Text>

        <View
          className="h-7 w-7 items-center justify-center rounded-lg bg-text-inverse/10"
          importantForAccessibility="no-hide-descendants"
        >
          <Calendar
            size={HEADER_CALENDAR_ICON_SIZE}
            color="rgba(255,255,255,0.85)"
          />
        </View>
      </View>

      <Text
        className="mt-2 font-poppins-bold text-lg text-text-inverse"
        numberOfLines={1}
      >
        {event.title}
      </Text>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-1 gap-2 pr-2">
          <View className="flex-row items-center gap-1.5">
            <Calendar size={META_ICON_SIZE} color="rgba(255,255,255,0.7)" />
            <Text
              className="flex-1 font-poppins-regular text-xs text-text-inverse/90"
              numberOfLines={1}
            >
              {formatEventDate(event.date)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Clock size={META_ICON_SIZE} color="rgba(255,255,255,0.7)" />
            <Text
              className="flex-1 font-poppins-regular text-xs text-text-inverse/90"
              numberOfLines={1}
            >
              {event.time}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <MapPin size={META_ICON_SIZE} color="rgba(255,255,255,0.7)" />
            <Text
              className="flex-1 font-poppins-regular text-xs text-text-inverse/90"
              numberOfLines={1}
            >
              {event.location}
            </Text>
          </View>
        </View>

        <View className="items-center justify-center">
          <CountdownRing daysRemaining={event.daysRemaining} size={RING_SIZE} />
          <View className="absolute items-center">
            <Text className="font-poppins-bold text-base text-text-inverse">
              {daysValue}
            </Text>
            <Text className="font-poppins-semibold text-[8px] text-text-inverse/80">
              {daysLabel}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push(eventDetailsRoute(event.id))}
        accessibilityRole="button"
        accessibilityLabel={`View event details for ${event.title}`}
        className="mt-4 h-11 items-center justify-center rounded-full bg-surface"
      >
        <Text className="font-poppins-semibold text-sm text-primary">
          View Event
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const NextEventCard = memo(NextEventCardBase);
