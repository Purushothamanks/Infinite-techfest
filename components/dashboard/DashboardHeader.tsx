import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { AvatarPlaceholder } from "@/components/dashboard/AvatarPlaceholder";
import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Branding/infinite-techfest-horizontal.png");

const BELL_ICON_SIZE = 24;
const AVATAR_SIZE = 52;
const MAX_BADGE_COUNT = 9;

interface DashboardHeaderProps {
  avatarUrl: string | null;
  fullName: string;
  unreadNotificationCount: number;
}

/**
 * Top header for the Student Home Dashboard: brand wordmark, notification
 * bell (with unread badge), and profile avatar, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png.
 *
 * Navigates to the Notifications and Profile placeholder routes (see
 * constants/navigation.ts ROUTES doc) — no business logic lives here.
 */
function DashboardHeaderBase({
  avatarUrl,
  fullName,
  unreadNotificationCount,
}: DashboardHeaderProps) {
  const badgeLabel =
    unreadNotificationCount > MAX_BADGE_COUNT
      ? `${MAX_BADGE_COUNT}+`
      : String(unreadNotificationCount);

  const displayName = fullName.trim().length > 0 ? fullName.trim() : "your";

  return (
    <View className="flex-row items-center justify-between px-6 py-3">
      <View>
        <Image
          source={LOGO_ASSET}
          resizeMode="contain"
          className="h-11 w-[190px]"
          accessibilityRole="image"
          accessibilityLabel="Infinite Techfest 2026"
        />
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => router.push(ROUTES.NOTIFICATIONS)}
          accessibilityRole="button"
          accessibilityLabel={
            unreadNotificationCount > 0
              ? `Notifications, ${unreadNotificationCount} unread`
              : "Notifications"
          }
          accessibilityHint="Opens your notifications"
          className="h-11 w-11 items-center justify-center rounded-full"
          hitSlop={4}
        >
          <Bell size={BELL_ICON_SIZE} color={colors.text.primary} />
          {unreadNotificationCount > 0 ? (
            <View className="absolute right-1 top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-error px-1">
              <Text className="font-poppins-semibold text-[10px] leading-none text-text-inverse">
                {badgeLabel}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(ROUTES.PROFILE)}
          accessibilityRole="button"
          accessibilityLabel="Open your profile"
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              className="rounded-full border border-border"
              accessibilityRole="image"
              accessibilityLabel="Your profile photo"
            />
          ) : (
            <View
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              className="items-center justify-center overflow-hidden rounded-full border border-border bg-primary/5"
              accessibilityRole="image"
              accessibilityLabel={`${displayName} profile picture placeholder`}
            >
              <AvatarPlaceholder size={AVATAR_SIZE} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const DashboardHeader = memo(DashboardHeaderBase);
