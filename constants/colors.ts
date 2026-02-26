// constants/colors.ts

const Colors = {
  primary: "#1E6FD9",
  primaryDark: "#1558B0",
  primaryLight: "#E8F0FB",

  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#0EA5E9",

  text: {
    primary: "#0F172A",
    secondary: "#64748B",
    tertiary: "#94A3B8",
    light: "#CBD5E1",
    white: "#FFFFFF",
  },

  bg: {
    primary: "#FFFFFF",
    secondary: "#F8FAFC",
    tertiary: "#F1F5F9",
  },

  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  inputBg: "#F8FAFC",
  disabled: "#CBD5E1",
};

// Typography scale
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
  },
  weights: {
    light: "300" as const,
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
};

// Spacing scale (8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
};

// Border radius
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
};

export default Colors;
