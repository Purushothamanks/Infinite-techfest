/** @type {import('tailwindcss').Config} */
// NOTE: Tailwind's config loader runs in plain Node (no TS/babel transform),
// so it cannot `require()` the .ts token files in theme/ directly. The values
// below are mirrored from theme/colors.ts and theme/typography.ts so that
// NativeWind class names stay the single way to consume design tokens in UI
// code (per AGENTS.md Section 4/6). Keep these in sync manually whenever the
// theme/ token files change.
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Mirrors theme/colors.ts (nested `text` produces classes like
        // `text-text-secondary` for colors.text.secondary, etc.)
        primary: "#0B2A6F",
        accent: "#E8A11C",
        background: "#FFFFFF",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        royalblue: "#2563EB",
        info: "#3B82F6",
        text: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
          disabled: "#9CA3AF",
          inverse: "#FFFFFF",
        },
      },
      fontFamily: {
        // Mirrors theme/typography.ts fontFamily
        "poppins-regular": ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
};
