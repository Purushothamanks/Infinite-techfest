import { router } from "expo-router";
import { CalendarX2, ChevronRight } from "lucide-react-native";
import { memo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { RegisteredEventCard } from "@/components/dashboard/RegisteredEventCard";
import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";
import type { RegisteredEventSummary } from "@/types/dashboard";

interface MyEventsSectionProps {
  events: RegisteredEventSummary[];
}

const CHEVRON_ICON_SIZE = 16;

/**
 * "My Events" section, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: section
 * header with a "View All" link to the Events screen, followed by a
 * horizontally scrollable row of RegisteredEventCard items. Falls back to
 * an icon-based empty state when the student has no registered events.
 */
function MyEventsSectionBase({ events }: MyEventsSectionProps) {
  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between px-6">
        <Text className="font-poppins-bold text-lg text-primary">
          My Events
        </Text>
        <TouchableOpacity
          onPress={() => router.push(ROUTES.EVENTS)}
          accessibilityRole="button"
          accessibilityLabel="View all my events"
          className="flex-row items-center gap-1"
        >
          <Text className="font-poppins-semibold text-sm text-primary">
            View All
          </Text>
          <ChevronRight size={CHEVRON_ICON_SIZE} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {events.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 px-6 pt-3"
        >
          {events.map((event) => (
            <RegisteredEventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      ) : (
        <View className="mx-6 mt-3 rounded-2xl border border-border bg-surface">
          <EmptyState
            icon={CalendarX2}
            title="No registered events"
            description="Explore events and register to see them here."
          />
        </View>
      )}
    </View>
  );
}

export const MyEventsSection = memo(MyEventsSectionBase);
