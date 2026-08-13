import type { LucideIcon } from "lucide-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

import { colors } from "@/theme";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ICON_SIZE = 26;

/**
 * Generic icon-based empty state used across dashboard sections ("No
 * registered events", "No certificates yet", "No schedule for today"),
 * matching the Certificates card's empty-state treatment in
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: a
 * tinted rounded-square icon badge, a bold title, and a short supporting
 * line.
 *
 * The approved design's empty states are icon-based compositions (not
 * bespoke character illustrations), so this reuses the existing icon
 * library per the task's asset restriction rather than generating a new
 * raster illustration.
 */
function EmptyStateBase({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <View className="items-center px-4 py-6" accessibilityRole="text">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
        <Icon size={ICON_SIZE} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text className="mt-3 text-center font-poppins-bold text-sm text-primary">
        {title}
      </Text>
      <Text className="mt-1 max-w-[220px] text-center font-poppins-regular text-xs leading-4 text-text-secondary">
        {description}
      </Text>
    </View>
  );
}

export const EmptyState = memo(EmptyStateBase);
