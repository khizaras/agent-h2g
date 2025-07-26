import type { ThemeConfig } from "antd";
import { theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

export const antdTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    // Professional color palette - Microsoft/Apple/Google inspired
    colorPrimary: "#0066CC", // Clean blue like Microsoft
    colorSuccess: "#107C10", // Natural green
    colorWarning: "#FF8C00", // Warm orange
    colorError: "#D13438", // Clear red
    colorInfo: "#0078D4", // Information blue

    // Typography - Modern, clean typeface
    fontFamily:
      'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSizeHeading1: 48,
    fontSizeHeading2: 36,
    fontSizeHeading3: 28,
    fontSizeHeading4: 24,
    fontSizeHeading5: 20,
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeXL: 18,

    // Layout - Clean borders and spacing
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Spacing - Consistent and clean
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    paddingXS: 8,
    margin: 16,
    marginLG: 24,
    marginXL: 32,
    marginXS: 8,

    // Controls - Professional heights
    controlHeight: 44,
    controlHeightSM: 36,
    controlHeightLG: 52,

    // Colors - Minimal, clean palette
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",
    colorBgLayout: "#FAFAFA", // Very light grey
    colorBorder: "#E1E1E1", // Subtle borders
    colorBorderSecondary: "#F5F5F5",

    // Text - High contrast, professional
    colorText: "#323130", // Microsoft's text color
    colorTextSecondary: "#605E5C", // Secondary text
    colorTextTertiary: "#8A8886", // Tertiary text
    colorTextQuaternary: "#C8C6C4", // Quaternary text

    // Links - Professional blue
    colorLink: "#0066CC",
    colorLinkHover: "#004B87",

    // Shadows - Subtle, professional
    boxShadow:
      "0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
    boxShadowSecondary:
      "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
    boxShadowTertiary:
      "0 8px 16px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.12)",
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 44,
      fontWeight: 500,
      primaryShadow: "0 2px 4px rgba(0, 102, 204, 0.2)",
    },
    Card: {
      borderRadius: 12,
      headerBg: "transparent",
      bodyPadding: 24,
      boxShadowTertiary: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
    Input: {
      borderRadius: 8,
      controlHeight: 44,
      paddingInline: 16,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 44,
    },
    Modal: {
      borderRadius: 12,
      headerBg: "transparent",
    },
    Table: {
      borderRadius: 8,
      headerBg: "#FAFAFA",
      headerColor: "#323130",
    },
    Tabs: {
      borderRadius: 8,
      inkBarColor: "#0066CC",
      itemActiveColor: "#0066CC",
      itemHoverColor: "#004B87",
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
      itemActiveBg: "#F3F2F1",
      itemSelectedBg: "#E1DFDD",
      itemSelectedColor: "#323130",
      itemHoverBg: "#F8F7F6",
      subMenuItemBg: "#FFFFFF",
      popupBg: "#FFFFFF",
    },
    Dropdown: {
      borderRadius: 8,
      boxShadowSecondary: "0 4px 12px rgba(0, 0, 0, 0.12)",
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

// CSS variables for custom styling - refined palette
export const cssVariables = {
  "--primary-gradient": "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
  "--success-gradient": "linear-gradient(135deg, #059669 0%, #047857 100%)",
  "--warning-gradient": "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
  "--error-gradient": "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
  "--neutral-gradient": "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
  "--glass-bg": "rgba(255, 255, 255, 0.9)",
  "--glass-border": "rgba(226, 232, 240, 0.3)",
  "--shadow-glass": "0 8px 32px 0 rgba(15, 23, 42, 0.08)",
  "--backdrop-blur": "blur(16px)",
};

export const getThemeConfig = (
  mode: "light" | "dark" = "light",
): ThemeConfig => {
  return mode === "dark" ? darkTheme : antdTheme;
};
