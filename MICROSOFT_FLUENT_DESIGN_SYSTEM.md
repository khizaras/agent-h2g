# Microsoft Fluent-Inspired Design System for Hands2gether

## Overview

This design system is based on Microsoft's official Fluent Design System, adapted for the Hands2gether community platform. It emphasizes trustworthiness, professionalism, and accessibility while maintaining modern aesthetics.

## 1. Color Palette

### Primary Colors
```css
/* Microsoft Communication Blue */
--color-primary: #0078d4;
--color-primary-hover: #106ebe;
--color-primary-active: #005a9e;
--color-primary-bg: #deecf9;
--color-primary-border: #0078d4;
```

### Semantic Colors
```css
/* Success */
--color-success: #107c10;
--color-success-light: #dff6dd;

/* Warning */
--color-warning: #797775;
--color-warning-light: #fff4ce;

/* Error */
--color-error: #d13438;
--color-error-light: #fde7e9;

/* Info */
--color-info: #004578;
```

### Neutral Colors
```css
/* Text Colors */
--color-text-primary: #323130;
--color-text-secondary: #605e5c;
--color-text-tertiary: #8a8886;
--color-text-disabled: #a19f9d;

/* Background Colors */
--color-bg-primary: #ffffff;
--color-bg-secondary: #faf9f8;
--color-bg-tertiary: #f3f2f1;

/* Border Colors */
--color-border-primary: #edebe9;
--color-border-secondary: #e1dfdd;
--color-border-focus: #0078d4;
```

## 2. Typography

### Font Family
Primary: `'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif`

### Type Scale
Based on Microsoft Fluent specifications:

| Style | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| Display | 68px | 92px | 600 | Hero sections |
| Large Title | 40px | 52px | 600 | Page titles |
| Title 1 | 32px | 40px | 600 | Section headers |
| Title 2 | 28px | 36px | 600 | Sub-headers |
| Title 3 | 24px | 32px | 600 | Component titles |
| Subtitle 1 | 20px | 26px | 600 | Large subtitles |
| Subtitle 2 | 16px | 22px | 600 | Standard subtitles |
| Body 1 | 14px | 20px | 400/600 | Body text |
| Caption 1 | 12px | 16px | 400/600 | Captions |
| Caption 2 | 10px | 14px | 400/600 | Small text |

## 3. Spacing System

### Global Spacing Ramp
Following Fluent's 4px base unit system:

| Token | Value | Usage |
|-------|-------|-------|
| size40 | 4px | Minimal spacing |
| size80 | 8px | Small spacing |
| size120 | 12px | Default spacing |
| size160 | 16px | Medium spacing |
| size240 | 24px | Large spacing |
| size320 | 32px | Extra large spacing |
| size480 | 48px | Section spacing |
| size560 | 56px | Maximum spacing |

## 4. Layout System

### Grid System
- **Columns**: 12-column flexible grid
- **Gutters**: Responsive (16px to 40px)
- **Container max-widths**: 
  - SM: 576px
  - MD: 768px
  - LG: 992px
  - XL: 1200px
  - XXL: 1400px

### Breakpoints
Following Fluent responsive specifications:

| Breakpoint | Value | Description |
|------------|-------|-------------|
| xs | 320px | Small mobile |
| sm | 480px | Mobile |
| md | 640px | Tablet |
| lg | 1024px | Desktop |
| xl | 1366px | Large desktop |
| xxl | 1920px | Extra large |

## 5. Component Specifications

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #0078d4;
  color: #ffffff;
  border-radius: 4px;
  height: 32px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #0078d4;
}

.btn-primary:hover {
  background: #106ebe;
}
```

### Cards
```css
.card {
  background: #ffffff;
  border: 1px solid #edebe9;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12);
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.14), 0 0px 2px rgba(0, 0, 0, 0.12);
}
```

### Form Controls
```css
.form-input {
  border: 1px solid #edebe9;
  border-radius: 4px;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
}

.form-input:focus {
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}
```

## 6. Interactive Patterns

### Motion & Animation
Following Fluent motion principles:

```css
/* Durations */
--duration-fast: 0.1s;
--duration-normal: 0.2s;
--duration-slow: 0.3s;

/* Easing */
--easing-standard: cubic-bezier(0.33, 0.00, 0.67, 1.00);
--easing-accelerate: cubic-bezier(0.50, 0.00, 1.00, 1.00);
--easing-decelerate: cubic-bezier(0.00, 0.00, 0.50, 1.00);
```

### Hover States
- **Buttons**: Background color shift
- **Cards**: Subtle elevation increase
- **Links**: Color change + underline
- **Icons**: Opacity/color shift

### Focus States
- **Outline**: 2px solid #0078d4
- **Offset**: 2px from element
- **Visible only**: On keyboard navigation

## 7. Accessibility Guidelines

### Color Contrast
- **Standard text**: 4.5:1 minimum ratio
- **Large text**: 3:1 minimum ratio
- **Interactive elements**: Clear focus indicators

### Typography
- **Minimum size**: 12px for body text
- **Line height**: 1.4+ for readability
- **Font weights**: Regular (400) and Semibold (600)

### Interactive Elements
- **Touch targets**: Minimum 44x44px
- **Keyboard navigation**: Logical tab order
- **Screen readers**: Proper semantic markup

## 8. Implementation Guidelines

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary: #0078d4;
  --color-text: #323130;
  --color-bg: #ffffff;
  
  /* Typography */
  --font-family: 'Segoe UI', system-ui, sans-serif;
  --font-size-body: 14px;
  --line-height-body: 1.43;
  
  /* Spacing */
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  
  /* Motion */
  --duration-normal: 0.2s;
  --easing-standard: cubic-bezier(0.33, 0.00, 0.67, 1.00);
}
```

### Ant Design Integration
The theme configuration in `src/config/theme.ts` applies these Fluent principles to Ant Design components:

- **Button heights**: 24px (small), 32px (default), 40px (large)
- **Border radius**: 4px (standard), 8px (cards/modals)
- **Shadows**: Subtle elevation system
- **Colors**: Microsoft's official palette

## 9. Category Color System

### Category-Specific Colors
```css
/* Food - Microsoft Red variation */
--category-food: #d13438;
--category-food-light: #fde7e9;

/* Clothes - Microsoft Blue */
--category-clothes: #0078d4;
--category-clothes-light: #deecf9;

/* Training - Microsoft Green */
--category-training: #107c10;
--category-training-light: #dff6dd;
```

## 10. Best Practices

### Do's
- ✅ Use consistent spacing from the spacing ramp
- ✅ Apply proper color contrast ratios
- ✅ Implement subtle hover/focus states
- ✅ Use Segoe UI font family
- ✅ Follow the component hierarchy
- ✅ Implement proper semantic markup

### Don'ts
- ❌ Use colors outside the defined palette
- ❌ Create overly complex animations
- ❌ Ignore accessibility requirements
- ❌ Use inconsistent spacing values
- ❌ Override core component behaviors unnecessarily

## 11. Resources

- **Official Fluent Design**: https://fluent2.microsoft.design/
- **Color System**: https://fluent2.microsoft.design/color
- **Typography**: https://fluent2.microsoft.design/typography
- **Design Tokens**: https://fluent2.microsoft.design/design-tokens

This design system ensures a consistent, professional, and trustworthy user experience that aligns with Microsoft's design principles while being optimized for community platforms.