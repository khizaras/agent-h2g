// Microsoft Fluent Design System for Hands2gether
// Based on Microsoft.com design principles
// Professional, clean, and trustworthy styling

export const revampedTheme = {
  token: {
    // Primary Colors - Microsoft Fluent blue palette
    colorPrimary: '#0078d4', // Microsoft Communication Blue
    colorPrimaryHover: '#106ebe',
    colorPrimaryActive: '#005a9e',
    colorPrimaryBg: '#deecf9',
    colorPrimaryBorder: '#92c5f7',
    colorPrimaryText: '#0078d4',

    // Secondary Colors - Microsoft Fluent semantic colors
    colorSuccess: '#0078d4', // Microsoft Blue for success (consistent theme)
    colorWarning: '#797775', // Microsoft Warning Gray
    colorError: '#d13438',   // Microsoft Red
    colorInfo: '#0078d4',    // Microsoft Blue

    // Neutral Colors - Microsoft Fluent gray scale
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#faf9f8',
    colorBgLayout: '#f3f2f1',
    colorBgSpotlight: '#fefefe',
    
    // Text Colors - Microsoft Fluent text hierarchy
    colorText: '#323130',        // Fluent primary text
    colorTextSecondary: '#605e5c', // Fluent secondary text
    colorTextTertiary: '#8a8886',  // Fluent tertiary text
    colorTextQuaternary: '#c8c6c4',
    
    // Border Colors - Microsoft Fluent neutrals
    colorBorder: '#edebe9',
    colorBorderSecondary: '#f3f2f1',
    
    // Typography - Using Segoe UI for authentic Microsoft appearance
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Line Heights - Microsoft Fluent specifications
    lineHeight: 1.43,
    lineHeightHeading1: 1.25,
    lineHeightHeading2: 1.29,
    lineHeightHeading3: 1.33,
    
    // Spacing - Microsoft 4px base unit system
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
    
    // Border Radius - Microsoft Fluent specifications
    borderRadius: 4,
    borderRadiusXS: 2,
    borderRadiusSM: 4,
    borderRadiusLG: 8,
    borderRadiusXL: 12,
    
    // Shadows - Microsoft Fluent elevation
    boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
    boxShadowSecondary: '0 6.4px 14.4px 0 rgba(0,0,0,.132), 0 1.2px 3.6px 0 rgba(0,0,0,.108)',
    
    // Motion - Microsoft Fluent easing
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    
    // Z-index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  
  // Component specific styling - Microsoft Fluent components
  components: {
    Button: {
      borderRadius: 4,
      controlHeight: 32,
      controlHeightSM: 24,
      controlHeightLG: 40,
      fontWeight: 600, // Semibold - Microsoft standard
      primaryShadow: 'none',
      defaultBorderColor: '#8a8886',
      defaultColor: '#323130',
      defaultHoverBorderColor: '#0078d4',
      defaultHoverColor: '#0078d4',
      primaryColor: '#ffffff',
      primaryBg: '#0078d4',
    },
    
    Card: {
      borderRadius: 8,
      boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
      headerBg: '#ffffff',
      bodyPadding: 24,
    },
    
    Input: {
      borderRadius: 4,
      controlHeight: 32,
      paddingInline: 12,
      fontSize: 14,
      borderColor: '#8a8886',
      hoverBorderColor: '#0078d4',
      activeBorderColor: '#0078d4',
    },
    
    Layout: {
      headerBg: '#ffffff',
      headerPadding: '0 24px',
      headerHeight: 48,
      siderBg: '#faf9f8',
      bodyBg: '#f3f2f1',
    },
    
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#deecf9',
      itemSelectedColor: '#0078d4',
      itemHoverBg: '#f3f2f1',
      borderRadius: 4,
    },
    
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 16,
    },
    
    Form: {
      labelColor: '#323130',
      itemMarginBottom: 24,
      verticalLabelPadding: '0 0 8px',
    },
    
    Select: {
      borderRadius: 4,
      controlHeight: 32,
      optionSelectedBg: '#deecf9',
    },
    
    Tabs: {
      itemSelectedColor: '#0078d4',
      itemHoverColor: '#0078d4',
      inkBarColor: '#0078d4',
      titleFontSize: 14,
    },
    
    Tag: {
      borderRadius: 4,
      fontSizeSM: 12,
      lineHeightSM: 1.43,
    },
    
    Modal: {
      borderRadius: 8,
      headerBg: '#ffffff',
      contentBg: '#ffffff',
    },
    
    Avatar: {
      borderRadius: 50,
    },
    
    Badge: {
      borderRadius: 10,
    },
    
    Alert: {
      borderRadius: 4,
      withDescriptionIconSize: 20,
    },
    
    Drawer: {
      borderRadius: 0,
      headerHeight: 48,
    },
    
    Steps: {
      titleLineHeight: 1.43,
      descriptionMaxWidth: 200,
    },
  },
};

// Premium sophisticated color palette
export const premiumColors = {
  // Primary brand colors
  brand: {
    primary: '#0f172a',    // Sophisticated dark
    secondary: '#1e293b',  // Elegant secondary
    accent: '#3b82f6',     // Premium blue
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  // Category colors with premium feel
  food: {
    primary: '#dc2626',    // Rich red
    secondary: '#fef2f2',  // Soft background
    accent: '#991b1b',     // Deep accent
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  },
  clothing: {
    primary: '#7c3aed',    // Sophisticated purple
    secondary: '#faf5ff',  // Elegant background  
    accent: '#5b21b6',     // Deep purple
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  },
  education: {
    primary: '#0d9488',    // Premium teal
    secondary: '#f0fdfa',  // Fresh background
    accent: '#0f766e',     // Deep teal
    gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  },
  
  // Neutral palette for premium feel
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Status colors
  success: '#059669',
  warning: '#d97706', 
  error: '#dc2626',
  info: '#0284c7',
};

// Legacy support - map to new system
export const categoryColors = {
  food: premiumColors.food,
  clothes: premiumColors.clothing,
  training: premiumColors.education,
  education: premiumColors.education,
};

// Microsoft-inspired image configuration with Unsplash
export const imageConfig = {
  baseUrl: 'https://images.unsplash.com',
  defaultParams: {
    w: 1200,
    h: 600,
    fit: 'crop',
    q: 80,
    fm: 'webp',
  },
  
  // Category-specific professional image collections
  collections: {
    hero: [
      'photo-1582213782179-e0d53f98f2ca', // Community support
      'photo-1559027615-cd4628902d4a', // People helping
      'photo-1600298881974-6be191ceeda1', // Community gathering
      'photo-1593113598332-cd288d649433', // Group collaboration
      'photo-1517486808906-6ca8b3f04846', // Professional meeting
    ],
    food: [
      'photo-1504674900247-0877df9cc836', // Professional food spread
      'photo-1504113888839-1c8eb50233d3', // Community meal
      'photo-1567620905732-2d1ec7ab7445', // Food preparation
      'photo-1546554137-f86b9593a222',   // Cooking together
      'photo-1555939594-58d7cb561ad1',   // Professional kitchen
    ],
    clothes: [
      'photo-1441986300917-64674bd600d8', // Professional clothing display
      'photo-1434389677669-e08b4cac3105', // Clothing donation
      'photo-1523381210434-271e8be1f52b', // Organized wardrobe
      'photo-1445205170230-053b83016050', // Fashion arrangement
      'photo-1515372039744-b8f02a3ae446', // Clothing collection
    ],
    training: [
      'photo-1522202176988-66273c2fd55f', // Professional learning
      'photo-1571019613454-1cb2f99b2d8b', // Online education
      'photo-1513475382585-d06e58bcb0e0', // Workshop setting
      'photo-1517486808906-6ca8b3f04846', // Training session
      'photo-1507003211169-0a1dd7228f2d', // Professional development
    ],
  },
  
  // Helper function to get image with Microsoft-style parameters
  getImage: (imageId: string, params?: Record<string, any>) => {
    const queryParams = new URLSearchParams({
      ...imageConfig.defaultParams,
      ...params,
    });
    return `${imageConfig.baseUrl}/${imageId}?${queryParams.toString()}`;
  },
  
  // Helper function to get random image from collection
  getRandomImage: (collection: keyof typeof imageConfig.collections, params?: Record<string, any>) => {
    const images = imageConfig.collections[collection];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return imageConfig.getImage(randomImage, params);
  },
};

// Microsoft Fluent layout configurations
export const layoutConfig = {
  header: {
    height: 48,
    padding: '0 24px',
    background: '#ffffff',
    borderBottom: '1px solid #edebe9',
    boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132)',
  },
  
  main: {
    padding: '24px',
    background: '#f3f2f1',
    minHeight: 'calc(100vh - 48px)',
  },
  
  footer: {
    background: '#faf9f8',
    borderTop: '1px solid #edebe9',
    padding: '32px 24px 24px',
  },
  
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
  },
  
  section: {
    padding: '56px 0',
    marginBottom: 0,
  },
};

// Premium animation system
export const animations = {
  // Basic animations with premium easing
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  // Premium interactions
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  
  // Stagger animations
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      },
    },
  },
  
  staggerFast: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      },
    },
  },
  
  // Premium page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Microsoft Fluent responsive breakpoints
export const breakpoints = {
  xs: 320,
  sm: 480,
  md: 640,
  lg: 1024,
  xl: 1366,
  xxl: 1920,
};

export default revampedTheme;