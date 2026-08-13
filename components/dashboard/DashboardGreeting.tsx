import { memo } from "react";
import { Text, View } from "react-native";

interface DashboardGreetingProps {
  timeOfDayGreeting: string;
  fullName: string;
}

/**
 * "Good Morning 👋 / Welcome back, {name}" header block, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png.
 *
 * Falls back to "Student" when the profile's full name is unavailable
 * (empty string), satisfying the task brief's "Use safe fallback values
 * if profile data is unavailable" rule — never a hardcoded real name.
 */
function DashboardGreetingBase({
  timeOfDayGreeting,
  fullName,
}: DashboardGreetingProps) {
  const displayName = fullName.trim().length > 0 ? fullName.trim() : "Student";

  return (
    <View className="mt-4 px-6">
      <Text className="font-poppins-medium text-md text-text-secondary">
        {timeOfDayGreeting} 👋
      </Text>
      <Text
        className="mt-1 font-poppins-bold text-3xl text-primary"
        accessibilityRole="header"
        numberOfLines={2}
      >
        Welcome back, {displayName}
      </Text>
    </View>
  );
}

export const DashboardGreeting = memo(DashboardGreetingBase);
