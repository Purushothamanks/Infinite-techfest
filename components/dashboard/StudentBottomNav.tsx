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

/**
 * Expo Router's `usePathname()` returns the resolved pathname with route
 * group segments (e.g. `(student)`) already stripped — so `/(student)/home`
 * resolves to `/home` at runtime. ROUTES stores the group-qualified path
 * (needed for `router.push`), so tab-active matching must strip those
 * group segments before comparing against `usePathname()`, or every tab
 * silently fails to ever register as active.
 */
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

/**
 * Shared bottom navigation bar for the Student Module: Home, Events,
 * Schedule, QR Pass, Profile, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png. The
 * active tab is derived from the current route (via `usePathname`) rather
 * than a prop, so every Student Module screen can render this component
 * unmodified and have the correct tab highlighted automatically.
 *
 * This is the single Student Module bottom nav — per AGENTS.md Section 7
 * / the task's "reuse existing navigation" rule, every Student Module
 * screen (including the placeholder stubs) should render this component
 * rather than building another one.
 */
function StudentBottomNavBase() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[{ paddingBottom: Math.max(insets.bottom, 10) }, shadows.lg]}
      className="flex-row rounded-t-3xl bg-surface pt-3"
    >
      {NAV_ITEMS.map((item) => {
        const normalizedRoute = stripRouteGroups(item.route);
        const isActive =
          pathname === normalizedRoute ||
          pathname.startsWith(`${normalizedRoute}/`);
        const Icon = item.icon;
        const tintColor = isActive ? colors.primary : colors.text.disabled;
        // Only the House glyph reads correctly filled solid (matching the
        // design's solid navy Home icon) — filling the other line icons
        // (grid, clock, qr, user) would render them as unrecognizable solid
        // blobs, so they stay outline and rely on color + stroke weight to
        // signal the active state instead.
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
  );
}

export const StudentBottomNav = memo(StudentBottomNavBase);
