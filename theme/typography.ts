/**
 * Design system typography tokens.
 * Font family is Poppins per AGENTS.md. Font files live in
 * assets/fonts/ and are loaded via expo-font's useFonts in app/_layout.tsx.
 */

export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 28,
  "2xl": 32,
  "3xl": 38,
  "4xl": 44,
} as const;

export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
} as const;

export type Typography = typeof typography;
