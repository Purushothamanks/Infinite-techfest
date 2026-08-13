import { router } from "expo-router";
import { ArrowLeft, type LucideIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme";

interface ComingSoonScreenProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const BACK_ICON_SIZE = 22;
const CONTENT_ICON_SIZE = 30;

/**
 * Thin placeholder stub for Student Module screens that don't exist yet
 * (Events, Schedule, QR Pass, Profile, Payment Status, Notifications —
 * see constants/navigation.ts ROUTES doc). Per the user's chosen approach
 * ("Thin placeholder stub routes"), these keep every dashboard navigation
 * action landing on a real, working screen instead of a dead link, while
 * clearly communicating the feature is not built yet.
 *
 * Follows the existing auth screens' back-navigation pattern
 * (components/authentication/VerifyEmailScreen.tsx etc.) using
 * router.back(), since these are always pushed on top of Home.
 */
export function ComingSoonScreen({
  title,
  description,
  icon: Icon,
}: ComingSoonScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="h-10 flex-row items-center px-6 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
          className="h-10 w-10 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <ArrowLeft size={BACK_ICON_SIZE} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="h-16 w-16 items-center justify-center rounded-full border border-border bg-surface">
          <Icon size={CONTENT_ICON_SIZE} color={colors.primary} />
        </View>
        <Text className="mt-4 text-center font-poppins-bold text-lg text-primary">
          {title}
        </Text>
        <Text className="mt-2 text-center font-poppins-regular text-sm text-text-secondary">
          {description}
        </Text>
        <View className="mt-4 rounded-full bg-background px-4 py-1.5 border border-border">
          <Text className="font-poppins-semibold text-xs text-text-secondary">
            Coming Soon
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
