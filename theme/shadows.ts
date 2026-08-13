import { Platform } from "react-native";

/**
 * Design system shadow tokens.
 * Supports the "soft shadows" requirement from AGENTS.md.
 * Uses boxShadow on web/new architecture and elevation on Android.
 */

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }),
} as const;

export type Shadows = typeof shadows;
