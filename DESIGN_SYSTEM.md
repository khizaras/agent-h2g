# Hands2gether Design System

## Overview

This comprehensive design system provides a consistent set of design tokens, components, and patterns for building beautiful, accessible, and maintainable user interfaces across the Hands2gether platform.

## Design Tokens

### Colors

```css
/* Primary Brand Colors */
--brand-primary: #52c41a;
--brand-primary-hover: #73d13d;
--brand-primary-dark: #389e0d;
--brand-secondary: #1890ff;
--brand-secondary-hover: #40a9ff;
--brand-secondary-dark: #096dd9;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
--gradient-secondary: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
--gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Typography

```css
/* Font Sizes */
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;
--font-size-4xl: 36px;
--font-size-5xl: 48px;
--font-size-6xl: 60px;
```

### Spacing

```css
/* Spacing System */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 80px;
```

### Shadows

```css
/* Shadow System */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 12px 40px rgba(0, 0, 0, 0.15);
```

## Typography System

### Headings

```tsx
// Hero titles for landing pages
<h1 className="hero-title">
  Building <span className="hero-title-accent">Communities</span> Together
</h1>

// Section titles
<h2 className="section-title">Section Title</h2>

// Card titles
<h3 className="card-title">Card Title</h3>
```

### Body Text

```tsx
// Hero subtitles
<p className="hero-subtitle">
  Large subtitle text for hero sections with enhanced readability.
</p>

// Section subtitles
<p className="section-subtitle">
  Subtitle text that provides context and supporting information.
</p>

// Card subtitles
<p className="card-subtitle">
  Body text with optimal line height for comfortable reading.
</p>
```

## Button System

### Primary Buttons

```tsx
// Hero primary button
<Button className="btn-hero-primary">
  <FiHeart className="mr-2" />
  Start a Cause
</Button>

// Large primary button
<Button className="btn-primary-large">
  <FiUsers className="mr-2" />
  Join Community
</Button>
```

### Secondary Buttons

```tsx
// Hero secondary button
<Button className="btn-hero-secondary">
  <FiPlay className="mr-2" />
  Watch Demo
</Button>

// Large secondary button
<Button className="btn-secondary-large">
  <FiGlobe className="mr-2" />
  Learn More
</Button>
```

### CTA Buttons

```tsx
// CTA primary button
<Button className="cta-btn-primary">
  <FiCheckCircle className="mr-2" />
  Get Started
</Button>

// CTA secondary button
<Button className="cta-btn-secondary">
  <FiStar className="mr-2" />
  Learn More
</Button>
```

## Layout Components

### Containers

```tsx
// Fluid container (max-width: 1400px)
<div className="container-fluid">
  Content goes here
</div>

// Standard container (max-width: 1200px)
<div className="container-standard">
  Content goes here
</div>

// Narrow container (max-width: 800px)
<div className="container-narrow">
  Content goes here
</div>
```

### Section Wrappers

```tsx
// Standard section padding
<section className="section-wrapper">
  <div className="container-standard">
    Section content
  </div>
</section>

// Hero section with larger padding
<section className="section-wrapper-hero">
  <div className="container-standard">
    Hero content
  </div>
</section>

// Compact section padding
<section className="section-wrapper-compact">
  <div className="container-standard">
    Compact content
  </div>
</section>
```

### Section Headers

```tsx
// Standard section header
<div className="section-header">
  <h2 className="section-title">Section Title</h2>
  <p className="section-subtitle">Supporting description text</p>
</div>

// Compact section header
<div className="section-header-compact">
  <h2 className="section-title">Section Title</h2>
  <p className="section-subtitle">Supporting description text</p>
</div>
```

## Card System

### Modern Cards

```tsx
<Card className="card-modern">
  <div className="card-image">
    <img src="image-url" alt="Card image" />
  </div>
  <div className="card-content">
    <h3 className="card-title">Card Title</h3>
    <p className="card-subtitle">Card description text</p>
  </div>
</Card>
```

### Feature Cards

```tsx
<div className="card-feature">
  <div
    className="feature-icon-wrapper"
    style={{ background: "var(--gradient-primary)" }}
  >
    <FiHeart />
  </div>
  <h3 className="card-title">Feature Title</h3>
  <p className="card-subtitle">Feature description</p>
</div>
```

### Hero Cards

```tsx
<div className="card-hero">
  <h3 className="card-title">Hero Card</h3>
  <p className="card-subtitle">Semi-transparent card for hero sections</p>
</div>
```

### Testimonial Cards

```tsx
<div className="card-testimonial">
  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
    <Avatar src="avatar-url" size={48} style={{ marginRight: "12px" }} />
    <div>
      <Text strong>Customer Name</Text>
      <br />
      <Text type="secondary">Role/Title</Text>
    </div>
  </div>
  <p className="card-subtitle">"Testimonial content goes here..."</p>
</div>
```

## Grid System

### Responsive Grids

```tsx
// 4-column grid (responsive: 4 → 2 → 1)
<div className="grid-4">
  <Card className="card-modern">Grid Item 1</Card>
  <Card className="card-modern">Grid Item 2</Card>
  <Card className="card-modern">Grid Item 3</Card>
  <Card className="card-modern">Grid Item 4</Card>
</div>

// 3-column grid (responsive: 3 → 2 → 1)
<div className="grid-3">
  <Card className="card-modern">Grid Item 1</Card>
  <Card className="card-modern">Grid Item 2</Card>
  <Card className="card-modern">Grid Item 3</Card>
</div>

// 2-column grid (responsive: 2 → 1)
<div className="grid-2">
  <Card className="card-modern">Grid Item 1</Card>
  <Card className="card-modern">Grid Item 2</Card>
</div>
```

## Hero Section

### Complete Hero Implementation

```tsx
<section
  className="section-wrapper-hero"
  style={{
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflow: "hidden",
  }}
>
  <img className="hero-background" src="hero-image-url" alt="Hero background" />
  <div className="hero-overlay" />
  <div className="container-standard">
    <div className="card-content-hero">
      <motion.h1
        className="hero-title"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Hero <span className="hero-title-accent">Title</span>
      </motion.h1>
      <motion.p
        className="hero-subtitle"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Hero subtitle describing the page or product value proposition.
      </motion.p>
      <motion.div
        className="hero-actions-section"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="hero-actions">
          <Button className="btn-hero-primary">
            <FiHeart className="mr-2" />
            Primary Action
          </Button>
          <Button className="btn-hero-secondary">
            <FiPlay className="mr-2" />
            Secondary Action
          </Button>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

## CTA Section

### Call-to-Action Implementation

```tsx
<section className="cta-section">
  <div className="container-standard">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="cta-title">Ready to Get Started?</h2>
      <p className="cta-description">
        Join thousands of community members making a difference every day.
      </p>
      <div className="cta-actions">
        <Button className="cta-btn-primary">
          <FiCheckCircle style={{ marginRight: "8px" }} />
          Get Started
        </Button>
        <Button className="cta-btn-secondary">
          <FiGlobe style={{ marginRight: "8px" }} />
          Learn More
        </Button>
      </div>
    </motion.div>
  </div>
</section>
```

## Footer

### Modern Footer Implementation

```tsx
<footer className="footer-modern">
  <div className="container-standard">
    <div className="footer-grid">
      <div className="footer-section">
        <h4>Hands2gether</h4>
        <p>Building stronger communities through collective action.</p>
        <div className="social-links">
          <a href="#" className="social-link">
            <FiGlobe size={18} />
          </a>
          <a href="#" className="social-link">
            <FiHeart size={18} />
          </a>
        </div>
      </div>
      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Causes</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Resources</h4>
        <ul>
          <li>
            <a href="#">Help Center</a>
          </li>
          <li>
            <a href="#">Guidelines</a>
          </li>
          <li>
            <a href="#">Community</a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Support</h4>
        <ul>
          <li>
            <a href="#">FAQ</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a href="#">Feedback</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="footer-divider">
      <div className="footer-bottom">
        <p>&copy; 2024 Hands2gether. All rights reserved.</p>
        <div className="social-links">
          <a href="#" className="social-link">
            <FiGlobe size={16} />
          </a>
          <a href="#" className="social-link">
            <FiHeart size={16} />
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
```

## Utility Classes

### Text Alignment

```tsx
<div className="text-center">Centered text</div>
<div className="text-left">Left-aligned text</div>
<div className="text-right">Right-aligned text</div>
```

### Spacing Utilities

```tsx
<div className="mb-lg">Margin bottom large</div>
<div className="mt-xl">Margin top extra large</div>
<div className="p-md">Padding medium</div>
```

### Flexbox Utilities

```tsx
<div className="flex-center">Centered flex container</div>
<div className="flex-between">Space between flex container</div>
<div className="gap-lg">Flex container with large gap</div>
```

## Animation Guidelines

### Motion Configuration

```tsx
// Standard fade in from bottom
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}

// Staggered animations
transition={{ duration: 0.8, delay: 0.2 }}
transition={{ duration: 0.8, delay: 0.4 }}
transition={{ duration: 0.8, delay: 0.6 }}

// Viewport-triggered animations
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
```

## Color Usage Guidelines

### Primary Actions

- Use `var(--brand-primary)` for main CTAs and primary actions
- Use `var(--gradient-primary)` for hero buttons and important actions

### Secondary Actions

- Use `var(--text-secondary)` for secondary text
- Use `var(--border-medium)` for secondary button borders

### Status Colors

- Success: `var(--gradient-success)`
- Warning: `var(--gradient-warning)`
- Danger: `var(--gradient-danger)`

## Responsive Design

The design system is mobile-first and includes responsive breakpoints:

- Mobile: 480px and below
- Tablet: 768px and below
- Desktop: 1024px and above

All grid systems, typography, and spacing automatically adapt to different screen sizes.

## Examples

To see the design system in action, visit:

- `/design-system` - Comprehensive showcase of all components
- `/home-ultimate` - Modern home page implementation
- `/admin` - Professional admin dashboard

## Migration from Inline Styles

Replace inline styles with CSS classes for consistency:

```tsx
// Before (inline styles)
<h1 style={{ fontSize: "3rem", fontWeight: 800, color: "white" }}>
  Title
</h1>

// After (design system)
<h1 className="hero-title">
  Title
</h1>
```

This design system ensures consistency, maintainability, and scalability across the entire Hands2gether platform.
