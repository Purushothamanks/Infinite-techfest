import { CloudOff, RefreshCw } from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";

interface DashboardErrorProps {
  onRetry: () => void;
}

const ERROR_ICON_SIZE = 32;
const RETRY_ICON_SIZE = 18;

/**
 * Error state for the Student Home Dashboard, per the task brief's exact
 * copy requirement: "Couldn't load your dashboard" / "Please try again."
 * with a "Retry" action. Styled consistently with the existing design
 * system (rounded surface, primary CTA) rather than a raw crash/blank
 * screen.
 */
function DashboardErrorBase({ onRetry }: DashboardErrorProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <CloudOff size={ERROR_ICON_SIZE} color={colors.error} />
      </View>
      <Text className="mt-4 font-poppins-bold text-lg text-text-primary">
        Couldn&apos;t load your dashboard
      </Text>
      <Text className="mt-1 text-center font-poppins-regular text-sm text-text-secondary">
        Please try again.
      </Text>

      <TouchableOpacity
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading your dashboard"
        className="mt-6 h-12 flex-row items-center gap-2 rounded-full bg-primary px-6"
      >
        <RefreshCw size={RETRY_ICON_SIZE} color={colors.text.inverse} />
        <Text className="font-poppins-semibold text-sm text-text-inverse">
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const DashboardError = memo(DashboardErrorBase);
