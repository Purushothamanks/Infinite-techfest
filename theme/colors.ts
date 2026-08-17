/**
 * Design system color tokens.
 * Single source of truth for all colors used across the app.
 * Never hardcode raw hex values in components — import from here instead.
 */

export const colors = {
  primary: "#0B2A6F",
  accent: "#E8A11C",

  background: "#FFFFFF",
  surface: "#FFFFFF",

  text: {
    primary: "#1A1A1A",
    secondary: "#4A4A4A",
    disabled: "#9CA3AF",
    inverse: "#FFFFFF",
  },

  border: "#E5E7EB",

  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  royalblue: "#2563EB",
} as const;

export type Colors = typeof colors;

/**
 * Category tag tints for event category chips (e.g. "Coding", "AI / ML",
 * "Quiz" on the Student Home Dashboard's "My Events" cards — see
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png). Each
 * tint pairs a light background with a solid icon color. `violet` is the
 * only net-new hue (no existing token covers it); the rest reuse/tint the
 * tokens above so category chips stay visually consistent with the design
 * system instead of introducing an unrelated palette.
 */
export const categoryTint = {
  blue: { background: colors.info, icon: colors.text.inverse },
  violet: { background: "#7C3AED", icon: colors.text.inverse },
  amber: { background: colors.accent, icon: colors.text.inverse },
  green: { background: colors.success, icon: colors.text.inverse },
} as const;

export type CategoryTintKey = keyof typeof categoryTint;
