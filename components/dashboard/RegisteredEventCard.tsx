import { Calendar, CheckCircle2, Clock, MapPin } from "lucide-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

import { getEventCategoryVisual } from "@/constants/eventCategories";
import { colors } from "@/theme";
import { categoryTint } from "@/theme/colors";
import type {
    EventRegistrationStatus,
    RegisteredEventSummary,
} from "@/types/dashboard";
import { formatEventDate } from "@/utils/formatEventDate";

interface RegisteredEventCardProps {
  event: RegisteredEventSummary;
}

const META_ICON_SIZE = 13;
const CATEGORY_ICON_SIZE = 18;
const STATUS_PILL_ICON_SIZE = 11;
const CARD_WIDTH = 200;

const STATUS_LABEL: Record<EventRegistrationStatus, string> = {
  registered: "Registered",
  pending_payment: "Pending Payment",
  waitlisted: "Waitlisted",
};

/**
 * Single card in the "My Events" horizontal list, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: category
 * badge + label, event title, date/time/location rows, and a status pill.
 * Color/meaning for the status pill never relies on color alone — each
 * state also has a distinct label and (for "Registered") a check icon vs.
 * "Pending Payment" clock icon, satisfying the accessibility requirement
 * that important state isn't conveyed by color alone.
 */
function RegisteredEventCardBase({ event }: RegisteredEventCardProps) {
  const { icon: CategoryIcon, tint } = getEventCategoryVisual(event.category);
  const tintColors = categoryTint[tint];
  const isPending = event.status === "pending_payment";

  return (
    <View
      style={{ width: CARD_WIDTH }}
      className="rounded-2xl border border-border bg-surface p-4"
      accessibilityRole="summary"
      accessibilityLabel={`${event.title}, ${event.category}, ${formatEventDate(
        event.date,
      )} at ${event.time}, ${event.location}, ${STATUS_LABEL[event.status]}`}
    >
      <View className="flex-row items-center gap-2">
        <View
          style={{ backgroundColor: tintColors.background }}
          className="h-9 w-9 items-center justify-center rounded-xl"
        >
          <CategoryIcon size={CATEGORY_ICON_SIZE} color={tintColors.icon} />
        </View>
        <Text className="font-poppins-medium text-xs text-text-secondary">
          {event.category}
        </Text>
      </View>

      <Text
        className="mt-2.5 font-poppins-bold text-md text-primary"
        numberOfLines={1}
      >
        {event.title}
      </Text>

      <View className="mt-2.5 gap-1.5">
        <View className="flex-row items-center gap-1.5">
          <Calendar size={META_ICON_SIZE} color={colors.text.disabled} />
          <Text className="font-poppins-regular text-xs text-text-secondary">
            {formatEventDate(event.date)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Clock size={META_ICON_SIZE} color={colors.text.disabled} />
          <Text className="font-poppins-regular text-xs text-text-secondary">
            {event.time}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <MapPin size={META_ICON_SIZE} color={colors.text.disabled} />
          <Text
            className="flex-1 font-poppins-regular text-xs text-text-secondary"
            numberOfLines={1}
          >
            {event.location}
          </Text>
        </View>
      </View>

      <View
        className={`mt-3 flex-row items-center gap-1 self-start rounded-full px-2.5 py-1 ${
          isPending ? "bg-warning/15" : "bg-success/15"
        }`}
      >
        {isPending ? (
          <Clock size={STATUS_PILL_ICON_SIZE} color={colors.warning} />
        ) : (
          <CheckCircle2 size={STATUS_PILL_ICON_SIZE} color={colors.success} />
        )}
        <Text
          className={`font-poppins-semibold text-[11px] ${
            isPending ? "text-warning" : "text-success"
          }`}
        >
          {STATUS_LABEL[event.status]}
        </Text>
      </View>
    </View>
  );
}

export const RegisteredEventCard = memo(RegisteredEventCardBase);
