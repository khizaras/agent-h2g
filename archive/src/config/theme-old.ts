import type { ThemeConfig } from "antd";
import { theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

// Professional Theme Configuration for Complete Redesign
export const antdTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    // Professional Brand Colors - Matching globals.css
    colorPrimary: "#1a365d",
    colorSuccess: "#38a169",
    colorWarning: "#d69e2e",
    colorError: "#e53e3e",
    colorInfo: "#3182ce",

    // Typography System - Professional
    fontFamily:
      'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeXL: 20,
    fontSizeHeading1: 48,
    fontSizeHeading2: 40,
    fontSizeHeading3: 32,
    fontSizeHeading4: 24,
    fontSizeHeading5: 20,

    // Layout & Spacing - Generous Whitespace
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 6,

    // Professional Spacing Scale
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,

    // Color Palette - Minimal & Clean
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#fafafa",
    colorBgLayout: "#f7f7f7",
    colorBorder: "#e2e8f0",
    colorBorderSecondary: "#f7fafc",

    // Text Colors - Professional Hierarchy
    colorText: "#1a202c",
    colorTextSecondary: "#4a5568",
    colorTextTertiary: "#718096",
    colorTextQuaternary: "#a0aec0",

    // Shadows - Elegant & Subtle
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
      "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    boxShadowTertiary:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

    // Interactive Elements
    controlHeight: 40,
    controlHeightSM: 32,
    controlHeightLG: 48,

    // Professional Motion
    motionDurationFast: "0.1s",
    motionDurationMid: "0.2s",
    motionDurationSlow: "0.3s",
    motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    motionEaseOut: "cubic-bezier(0.0, 0, 0.2, 1)",

    // Z-Index Management
    zIndexBase: 0,
    zIndexPopupBase: 1000,

    // Professional Line Heights
    lineHeight: 1.7,
    lineHeightHeading1: 1.1,
    lineHeightHeading2: 1.15,
    lineHeightHeading3: 1.2,
    lineHeightHeading4: 1.3,
    lineHeightHeading5: 1.4,

    // Professional Weights
    fontWeightStrong: 600,
    wireframe: false,
  },
  components: {
    // Button - Professional Styling
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontWeight: 600,
      primaryShadow: "0 2px 0 rgba(26, 54, 93, 0.045)",
      dangerShadow: "0 2px 0 rgba(229, 62, 62, 0.045)",
    },

    // Card - Clean & Interactive
    Card: {
      borderRadius: 16,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      headerFontSize: 18,
      headerFontSizeSM: 16,
      bodyPadding: 24,
      headerBg: "transparent",
    },

    // Input - Professional Forms
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      paddingInline: 12,
      fontSize: 16,
    },

    // Select - Enhanced UX
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontSize: 16,
      optionPadding: "8px 12px",
    },

    // Menu - Professional Navigation
    Menu: {
      borderRadius: 8,
      itemHeight: 40,
      itemPaddingInline: 16,
      fontSize: 15,
      subMenuItemBorderRadius: 6,
    },

    // Typography - Enhanced Readability
    Typography: {
      titleMarginBottom: "0.5em",
      titleMarginTop: "1.2em",
    },

    // Table - Professional Data Display
    Table: {
      borderRadius: 12,
      headerBg: "#fafafa",
      headerColor: "#1a202c",
      headerSortActiveBg: "#f1f1f1",
      rowHoverBg: "#fafafa",
      fontSize: 15,
      cellPaddingInline: 16,
      cellPaddingBlock: 16,
    },

    // Modal - Elegant Overlays
    Modal: {
      borderRadius: 16,
      titleFontSize: 20,
      titleLineHeight: 1.3,
      contentBg: "#ffffff",
      footerBg: "#fafafa",
      headerBg: "transparent",
    },

    // Drawer - Smooth Interactions
    Drawer: {
      borderRadius: 0,
      footerPaddingBlock: 16,
      footerPaddingInline: 24,
    },

    // Notification - Professional Alerts
    Notification: {
      borderRadius: 12,
      padding: 20,
      paddingContentHorizontal: 20,
      fontSize: 15,
      lineHeight: 1.6,
    },

    // Message - Clean Feedback
    Message: {
      borderRadius: 8,
      contentPadding: "10px 16px",
      fontSize: 15,
    },

    // Tooltip - Helpful & Subtle
    Tooltip: {
      borderRadius: 6,
      colorBgSpotlight: "rgba(26, 32, 44, 0.85)",
      fontSize: 13,
      lineHeight: 1.5,
    },

    // Popover - Professional Overlays
    Popover: {
      borderRadius: 12,
      titleMinWidth: 177,
      minWidth: 177,
      fontSize: 14,
      lineHeight: 1.6,
    },

    // Dropdown - Enhanced Menus
    Dropdown: {
      borderRadius: 8,
      controlPaddingHorizontal: 12,
      fontSize: 15,
      lineHeight: 1.6,
    },

    // Tabs - Professional Navigation
    Tabs: {
      borderRadius: 6,
      cardHeight: 40,
      fontSize: 15,
      margin: 0,
      padding: 12,
      inkBarColor: "#1a365d",
      itemActiveColor: "#1a365d",
      itemHoverColor: "#2d3748",
    },

    // Form - Enhanced UX
    Form: {
      itemMarginBottom: 24,
      verticalLabelPadding: "0 0 8px",
      labelFontSize: 15,
      labelColor: "#1a202c",
      labelColonMarginInlineStart: 2,
      labelColonMarginInlineEnd: 8,
    },

    // Layout - Professional Structure
    Layout: {
      bodyBg: "#ffffff",
      headerBg: "#ffffff",
      headerHeight: 64,
      headerPadding: "0 24px",
      footerBg: "#fafafa",
      footerPadding: "24px 24px",
      siderBg: "#ffffff",
      triggerBg: "#fafafa",
      triggerColor: "#1a202c",
    },
  },
};

// Dark theme variant for professional look
export const darkTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: darkAlgorithm,
  token: {
    ...antdTheme.token,
    colorPrimary: "#63b3ed",
    colorBgBase: "#1a202c",
    colorBgContainer: "#2d3748",
    colorBgElevated: "#4a5568",
    colorBgLayout: "#171923",
    colorBorder: "#4a5568",
    colorBorderSecondary: "#2d3748",
    colorText: "#f7fafc",
    colorTextSecondary: "#e2e8f0",
    colorTextTertiary: "#cbd5e0",
    colorTextQuaternary: "#a0aec0",
  },
};

// Professional CSS variables for enhanced styling
export const cssVariables = {
  "--primary-gradient": "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
  "--success-gradient": "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
  "--warning-gradient": "linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)",
  "--error-gradient": "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
  "--accent-gradient": "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
  "--glass-bg": "rgba(255, 255, 255, 0.8)",
  "--glass-border": "rgba(255, 255, 255, 0.2)",
  "--shadow-glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  "--backdrop-blur": "blur(12px)",
  "--shadow-elegant": "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
  "--shadow-strong": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  "--shadow-medium": "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
  "--shadow-soft": "0 4px 6px -1px rgba(0, 0, 0, 0.07)",
  "--shadow-minimal": "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
};

export const getThemeConfig = (
  mode: "light" | "dark" = "light",
): ThemeConfig => {
  return mode === "dark" ? darkTheme : antdTheme;
};

export default antdTheme;
