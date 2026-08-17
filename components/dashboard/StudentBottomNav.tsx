import { router, usePathname } from "expo-router";
import { Clock, House, LayoutGrid, QrCode, User } from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ROUTES, type RoutePath } from "@/constants/navigation";
import { colors, shadows } from "@/theme";

interface NavItem {
  label: string;
  route: RoutePath;
  icon: typeof House;
}

const NAV_ICON_SIZE = 22;

function stripRouteGroups(path: string): string {
  return path.replace(/\/\([^)]+\)/g, "") || "/";
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", route: ROUTES.HOME, icon: House },
  { label: "Events", route: ROUTES.EVENTS, icon: LayoutGrid },
  { label: "Schedule", route: ROUTES.SCHEDULE, icon: Clock },
  { label: "QR Pass", route: ROUTES.QR_PASS, icon: QrCode },
  { label: "Profile", route: ROUTES.PROFILE, icon: User },
];

function StudentBottomNavBase() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        shadows.lg,
      ]}
      className="rounded-t-3xl pt-3 items-center"
    >
      <View className="flex-row w-full max-w-3xl justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const normalizedRoute = stripRouteGroups(item.route);
          const isActive =
            pathname === normalizedRoute ||
            pathname.startsWith(`${normalizedRoute}/`);
          const Icon = item.icon;
          const tintColor = isActive ? colors.primary : colors.text.disabled;
          const isHome = item.route === ROUTES.HOME;

          return (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.label}
              className="flex-1 items-center gap-1.5 py-1"
            >
              <Icon
                size={NAV_ICON_SIZE}
                color={tintColor}
                fill={isActive && isHome ? tintColor : "none"}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <Text
                className={`font-poppins-medium text-[11px] ${
                  isActive ? "text-primary" : "text-text-disabled"
                }`}
              >
                {item.label}
              </Text>
              {isActive ? (
                <View className="h-[3px] w-6 rounded-full bg-primary" />
              ) : (
                <View className="h-[3px] w-6" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

}

export const StudentBottomNav = memo(StudentBottomNavBase);
