import type { ThemeConfig } from "antd";
import { theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

export const antdTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    // Professional color palette
    colorPrimary: "#2563EB",
    colorSuccess: "#059669",
    colorWarning: "#D97706",
    colorError: "#DC2626",
    colorInfo: "#0891B2",

    // Typography
    fontFamily:
      'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeHeading1: 56,
    fontSizeHeading2: 48,
    fontSizeHeading3: 36,
    fontSizeHeading4: 28,
    fontSizeHeading5: 22,
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeXL: 20,

    // Layout
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 6,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    paddingXS: 8,
    margin: 16,
    marginLG: 24,
    marginXL: 32,
    marginXS: 8,

    // Controls
    controlHeight: 48,
    controlHeightSM: 40,
    controlHeightLG: 56,

    // Colors
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",
    colorBgLayout: "#FAFAFA",
    colorBorder: "#E5E7EB",
    colorBorderSecondary: "#F3F4F6",

    // Text
    colorText: "#111827",
    colorTextSecondary: "#4B5563",
    colorTextTertiary: "#6B7280",
    colorTextQuaternary: "#9CA3AF",

    // Links
    colorLink: "#2563EB",
    colorLinkHover: "#1D4ED8",

    // Shadows
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 48,
      fontWeight: 600,
      primaryShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
    },
    Card: {
      borderRadius: 16,
      headerBg: "transparent",
      bodyPadding: 24,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 48,
      paddingInline: 16,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 48,
    },
    Modal: {
      borderRadius: 20,
      headerBg: "transparent",
    },
    Table: {
      borderRadius: 12,
      headerBg: "#F9FAFB",
      headerColor: "#111827",
    },
    Tabs: {
      borderRadius: 12,
      inkBarColor: "#2563EB",
      itemActiveColor: "#2563EB",
      itemHoverColor: "#1D4ED8",
    },
  },
};

export const darkTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: darkAlgorithm,
  token: {
    ...antdTheme.token,
    colorBgContainer: "#1F2937",
    colorBgElevated: "#374151",
    colorBgLayout: "#111827",
    colorBorder: "#4B5563",
    colorBorderSecondary: "#374151",
    colorText: "#F9FAFB",
    colorTextSecondary: "#D1D5DB",
    colorTextTertiary: "#9CA3AF",
    colorTextQuaternary: "#6B7280",
  },
};

// CSS variables for custom styling
export const cssVariables = {
  "--primary-gradient": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
  "--success-gradient": "linear-gradient(135deg, #059669 0%, #047857 100%)",
  "--warning-gradient": "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
  "--error-gradient": "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
  "--glass-bg": "rgba(255, 255, 255, 0.8)",
  "--glass-border": "rgba(255, 255, 255, 0.2)",
  "--shadow-glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  "--backdrop-blur": "blur(12px)",
};

export const getThemeConfig = (
  mode: "light" | "dark" = "light",
): ThemeConfig => {
  return mode === "dark" ? darkTheme : antdTheme;
};
