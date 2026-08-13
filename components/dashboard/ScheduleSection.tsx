import { router } from "expo-router";
import { CalendarX2, ChevronRight, MapPin } from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";
import type { ScheduleEntry } from "@/types/dashboard";

interface ScheduleSectionProps {
  entries: ScheduleEntry[];
}

const CHEVRON_ICON_SIZE = 16;
const TIMELINE_DOT_SIZE = 8;
const LOCATION_ICON_SIZE = 13;

/**
 * "Today's Schedule" section, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: a
 * vertical timeline of time / title / location rows with a connecting
 * line, and a "View All" link to the full Schedule screen. Falls back to
 * an icon-based empty state when there's nothing scheduled today.
 */
function ScheduleSectionBase({ entries }: ScheduleSectionProps) {
  return (
    <View className="mx-6 mt-6">
      <View className="flex-row items-center justify-between">
        <Text className="font-poppins-bold text-lg text-primary">
          Today&apos;s Schedule
        </Text>
        <TouchableOpacity
          onPress={() => router.push(ROUTES.SCHEDULE)}
          accessibilityRole="button"
          accessibilityLabel="View all schedule items"
          className="flex-row items-center gap-1"
        >
          <Text className="font-poppins-semibold text-sm text-primary">
            View All
          </Text>
          <ChevronRight size={CHEVRON_ICON_SIZE} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="mt-3 rounded-2xl border border-border bg-surface px-4">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <View
              key={entry.id}
              className={`flex-row gap-3 py-3.5 ${
                index < entries.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View className="relative w-2 items-center justify-center">
                {index < entries.length - 1 ? (
                  <View className="absolute bottom-0 top-0 w-[2px] bg-info/20" />
                ) : null}
                <View
                  style={{
                    width: TIMELINE_DOT_SIZE,
                    height: TIMELINE_DOT_SIZE,
                  }}
                  className="rounded-full bg-info"
                />
              </View>
              <View className="flex-1 flex-row items-center gap-3">
                <Text className="w-[72px] font-poppins-medium text-xs text-text-secondary">
                  {entry.time}
                </Text>
                <Text
                  className="flex-1 font-poppins-semibold text-sm text-text-primary"
                  numberOfLines={1}
                >
                  {entry.title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <MapPin
                    size={LOCATION_ICON_SIZE}
                    color={colors.text.disabled}
                  />
                  <Text
                    className="font-poppins-regular text-xs text-text-secondary"
                    numberOfLines={1}
                  >
                    {entry.location}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon={CalendarX2}
            title="No schedule for today"
            description="Your scheduled sessions will appear here."
          />
        )}
      </View>
    </View>
  );
}

export const ScheduleSection = memo(ScheduleSectionBase);
