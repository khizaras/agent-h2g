import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;

export const antdTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    // Primary brand colors
    colorPrimary: '#3B82F6', // Blue-500
    colorSuccess: '#10B981', // Emerald-500
    colorWarning: '#F59E0B', // Amber-500
    colorError: '#EF4444',   // Red-500
    colorInfo: '#8B5CF6',    // Violet-500
    
    // Typography
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeHeading1: 48,
    fontSizeHeading2: 40,
    fontSizeHeading3: 32,
    fontSizeHeading4: 24,
    fontSizeHeading5: 20,
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeXL: 20,
    
    // Layout & Spacing
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 6,
    
    // Shadows (Apple-style)
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    
    // Heights
    controlHeight: 44,
    controlHeightSM: 36,
    controlHeightLG: 52,
    
    // Colors
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F8FAFC',
    colorBgSpotlight: '#FFFFFF',
    colorBorder: '#E2E8F0',
    colorBorderSecondary: '#F1F5F9',
    
    // Text colors
    colorText: '#1E293B',
    colorTextSecondary: '#64748B',
    colorTextTertiary: '#94A3B8',
    colorTextQuaternary: '#CBD5E1',
    
    // Link colors
    colorLink: '#3B82F6',
    colorLinkHover: '#2563EB',
    colorLinkActive: '#1D4ED8',
    
    // Gradient tokens (custom)
    colorBgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  components: {
    Button: {
      borderRadius: 12,
      fontWeight: 600,
      primaryShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.35)',
      defaultShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      controlHeight: 44,
      controlHeightSM: 36,
      controlHeightLG: 52,
      paddingInline: 24,
      paddingBlock: 8,
    },
    Card: {
      borderRadius: 16,
      paddingLG: 32,
      boxShadowTertiary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      headerBg: 'transparent',
    },
    Input: {
      borderRadius: 12,
      controlHeight: 44,
      paddingInline: 16,
      fontSize: 16,
      fontWeight: 400,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 44,
      fontSize: 16,
    },
    Menu: {
      borderRadius: 12,
      itemBorderRadius: 8,
      itemActiveBg: 'rgba(59, 130, 246, 0.08)',
      itemSelectedBg: 'rgba(59, 130, 246, 0.12)',
      itemHoverBg: 'rgba(59, 130, 246, 0.04)',
    },
    Modal: {
      borderRadius: 20,
      paddingLG: 32,
      headerBg: 'transparent',
    },
    Drawer: {
      borderRadius: 20,
      paddingLG: 32,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#F8FAFC',
      headerColor: '#1E293B',
      headerSplitColor: '#E2E8F0',
      rowHoverBg: 'rgba(59, 130, 246, 0.04)',
    },
    Tabs: {
      borderRadius: 12,
      inkBarColor: '#3B82F6',
      itemActiveColor: '#3B82F6',
      itemHoverColor: '#2563EB',
      itemSelectedColor: '#3B82F6',
    },
    Switch: {
      borderRadius: 24,
      trackHeight: 24,
      trackMinWidth: 48,
      handleSize: 20,
    },
    Slider: {
      borderRadius: 4,
      trackBg: '#E2E8F0',
      trackHoverBg: '#CBD5E1',
      handleColor: '#3B82F6',
      handleActiveColor: '#2563EB',
      railBg: '#F1F5F9',
      railHoverBg: '#E2E8F0',
    },
    Progress: {
      borderRadius: 8,
      remainingColor: '#F1F5F9',
    },
    Notification: {
      borderRadius: 16,
      paddingLG: 24,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    Message: {
      borderRadius: 12,
      paddingLG: 16,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    Tag: {
      borderRadius: 8,
      paddingInline: 12,
      fontWeight: 500,
    },
    Badge: {
      borderRadius: 12,
      fontWeight: 600,
    },
    Avatar: {
      borderRadius: 12,
      containerSize: 40,
      containerSizeLG: 48,
      containerSizeSM: 32,
    },
    Tooltip: {
      borderRadius: 8,
      paddingXXS: 8,
      paddingXS: 12,
    },
    Popover: {
      borderRadius: 16,
      paddingLG: 20,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    Dropdown: {
      borderRadius: 12,
      paddingXXS: 8,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    DatePicker: {
      borderRadius: 12,
      controlHeight: 44,
      paddingInline: 16,
    },
    TimePicker: {
      borderRadius: 12,
      controlHeight: 44,
      paddingInline: 16,
    },
    Upload: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Form: {
      itemMarginBottom: 24,
      verticalLabelPadding: '0 0 12px',
      labelFontSize: 16,
      labelColor: '#1E293B',
      labelRequiredMarkColor: '#EF4444',
    },
    Statistic: {
      titleFontSize: 16,
      contentFontSize: 32,
      fontWeight: 700,
    },
    Steps: {
      borderRadius: 8,
      paddingLG: 16,
    },
    Anchor: {
      linkPaddingBlock: 8,
      linkPaddingInlineStart: 16,
    },
    Breadcrumb: {
      itemColor: '#64748B',
      lastItemColor: '#1E293B',
      linkColor: '#3B82F6',
      linkHoverColor: '#2563EB',
      separatorColor: '#94A3B8',
    },
  },
};

export const darkTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: darkAlgorithm,
  token: {
    ...antdTheme.token,
    // Dark mode overrides
    colorBgContainer: '#1E293B',
    colorBgElevated: '#334155',
    colorBgLayout: '#0F172A',
    colorBgSpotlight: '#1E293B',
    colorBorder: '#475569',
    colorBorderSecondary: '#334155',
    
    colorText: '#F1F5F9',
    colorTextSecondary: '#CBD5E1',
    colorTextTertiary: '#94A3B8',
    colorTextQuaternary: '#64748B',
  },
};

export const compactTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: [defaultAlgorithm, compactAlgorithm],
};

// Theme utilities
export const getThemeConfig = (mode: 'light' | 'dark' | 'compact' = 'light'): ThemeConfig => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'compact':
      return compactTheme;
    default:
      return antdTheme;
  }
};

// Custom CSS variables for additional styling
export const cssVariables = {
  '--primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '--success-gradient': 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
  '--warning-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  '--error-gradient': 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
  '--glass-bg': 'rgba(255, 255, 255, 0.1)',
  '--glass-border': 'rgba(255, 255, 255, 0.2)',
  '--shadow-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  '--backdrop-blur': 'blur(8px)',
};