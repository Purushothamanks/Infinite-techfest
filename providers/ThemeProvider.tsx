import type { ReactNode } from "react";
import { useMemo } from "react";
import type { MD3Theme } from "react-native-paper";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

import { colors } from "@/theme";

/**
 * App-wide Material Design 3 theme, built on React Native Paper's
 * MD3LightTheme. Light theme only for v1, per AGENTS.md Section 4.
 * Colors are sourced from theme/colors.ts — never redefine them here.
 */
export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    background: colors.background,
    surface: colors.surface,
    onSurface: colors.text.primary,
    error: colors.error,
  },
};

export type AppTheme = typeof appTheme;

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with React Native Paper's theming context.
 * Compose this in app/_layout.tsx alongside QueryProvider.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useMemo(() => appTheme, []);

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
