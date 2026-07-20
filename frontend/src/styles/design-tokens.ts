/**
 * VarshaAI Design Tokens
 * Extracted from the official UI reference screens.
 * Single source of truth for all component styling constants.
 */

export const colors = {
  // Surface system
  surface: {
    dim: "#051424",
    base: "#051424",
    containerLowest: "#010f1f",
    containerLow: "#0d1c2d",
    container: "#122131",
    containerHigh: "#1c2b3c",
    containerHighest: "#273647",
    bright: "#2c3a4c",
    variant: "#273647",
  },
  // Primary (Cyan)
  primary: {
    base: "#a8e8ff",
    container: "#00d4ff",
    fixedDim: "#3cd7ff",
    onPrimary: "#003642",
    onContainer: "#00586b",
  },
  // Secondary (Purple)
  secondary: {
    base: "#dcb8ff",
    container: "#7701d0",
  },
  // Tertiary (Green / Success)
  tertiary: {
    base: "#6af7ba",
    container: "#49da9f",
  },
  // Error (Red)
  error: {
    base: "#ffb4ab",
    container: "#93000a",
    onError: "#690005",
  },
  // Text
  text: {
    primary: "#d4e4fa",
    secondary: "#bbc9cf",
    muted: "#859398",
  },
  // Borders
  outline: {
    base: "#859398",
    variant: "#3c494e",
  },
} as const;

export const typography = {
  displayXl: {
    fontFamily: "Geist, system-ui, sans-serif",
    fontSize: "72px",
    lineHeight: "80px",
    letterSpacing: "-0.04em",
    fontWeight: 700,
  },
  displayLg: {
    fontFamily: "Geist, system-ui, sans-serif",
    fontSize: "48px",
    lineHeight: "56px",
    letterSpacing: "-0.02em",
    fontWeight: 600,
  },
  headlineMd: {
    fontFamily: "Geist, system-ui, sans-serif",
    fontSize: "32px",
    lineHeight: "40px",
    letterSpacing: "-0.01em",
    fontWeight: 500,
  },
  bodyLg: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "18px",
    lineHeight: "28px",
    fontWeight: 400,
  },
  bodyMd: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 400,
  },
  labelCaps: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0.1em",
    fontWeight: 700,
    textTransform: "uppercase" as const,
  },
  dataMono: {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.05em",
    fontWeight: 500,
  },
} as const;

export const spacing = {
  unit: 8,
  gutter: 24,
  sectionGap: 80,
  containerPaddingMobile: 20,
  containerPaddingDesktop: 40,
  sidebarWidth: 240,
  topBarHeight: 56,
} as const;

export const animation = {
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springGentle: { type: "spring" as const, stiffness: 200, damping: 25 },
  fade: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as number[] },
  slideIn: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as number[] },
} as const;
