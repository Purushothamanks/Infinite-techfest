import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { AvatarPlaceholder } from "@/components/dashboard/AvatarPlaceholder";
import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";

const BRAND_ICON = require("@/assets/images/Branding/infinite-techfest-icon.png");

const BELL_ICON_SIZE = 22;
const AVATAR_SIZE = 44;
const MAX_BADGE_COUNT = 9;

interface DashboardHeaderProps {
  avatarUrl: string | null;
  fullName: string;
  unreadNotificationCount: number;
}

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
    <View className="flex-row items-center justify-between px-4 py-3 bg-surface border-b border-border">
      {/* Left: Brand Logo Icon + Typography */}
      <TouchableOpacity
        onPress={() => router.push(ROUTES.HOME)}
        activeOpacity={0.85}
        className="flex-row items-center gap-2.5 flex-1 pr-2"
      >
        <Image
          source={BRAND_ICON}
          resizeMode="contain"
          style={{ width: 42, height: 42, borderRadius: 10 }}
          accessibilityRole="image"
          accessibilityLabel="Infinite Techfest Logo Icon"
        />
        <View className="justify-center">
          <Text className="font-poppins-bold text-base leading-tight text-primary">
            INFINITE TECHFEST
          </Text>
          <Text className="font-poppins-semibold text-[11px] leading-tight text-accent tracking-wide">
            2026 • RPSIT
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right: Actions */}
      <View className="flex-row items-center gap-2.5">
        <TouchableOpacity
          onPress={() => router.push(ROUTES.NOTIFICATIONS)}
          accessibilityRole="button"
          accessibilityLabel={
            unreadNotificationCount > 0
              ? `Notifications, ${unreadNotificationCount} unread`
              : "Notifications"
          }
          className="h-10 w-10 items-center justify-center rounded-full bg-background border border-border"
          hitSlop={4}
        >
          <Bell size={BELL_ICON_SIZE} color={colors.primary} />
          {unreadNotificationCount > 0 ? (
            <View className="absolute -right-0.5 -top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-error px-1">
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
              className="rounded-full border border-primary/30"
              accessibilityRole="image"
              accessibilityLabel="Your profile photo"
            />
          ) : (
            <View
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              className="items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary/5"
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
