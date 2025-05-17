/**
 * Responsive design utility functions
 *
 * This file contains utility functions and constants to assist with
 * creating a consistent responsive design across the application.
 */

// Standard breakpoints
export const breakpoints = {
  xs: 480, // Extra small devices (phones)
  sm: 576, // Small devices (landscape phones)
  md: 768, // Medium devices (tablets)
  lg: 992, // Large devices (desktops)
  xl: 1200, // Extra large devices (large desktops)
  xxl: 1600, // Extra extra large devices
};

// Media query helpers for styled-components
export const mediaQuery = {
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
  xxl: `@media (max-width: ${breakpoints.xxl}px)`,
};

// Responsive column spans for Ant Design grid
export const getResponsiveColumnSpan = (screenSize) => {
  // Return column span based on screen size
  // Adjust based on your layout needs
  const spans = {
    xs: 24, // Full width on extra small screens
    sm: 12, // Half width on small screens
    md: 8, // 1/3 width on medium screens
    lg: 6, // 1/4 width on large screens
    xl: 6, // 1/4 width on extra large screens
    xxl: 4, // 1/6 width on extra extra large screens
  };

  return spans[screenSize] || 24; // Default to full width if size not specified
};

// Responsive gutter for Ant Design grid
export const getResponsiveGutter = (screenSize) => {
  // Return gutter size based on screen size
  const gutters = {
    xs: [8, 8], // Small gutters on extra small screens
    sm: [16, 16], // Medium gutters on small screens
    md: [16, 24], // Medium to large gutters on medium screens
    lg: [24, 32], // Large gutters on large screens
    xl: [32, 32], // Extra large gutters on extra large screens
  };

  return gutters[screenSize] || [16, 16]; // Default to medium gutters
};

// Check if the current device is mobile
export const isMobile = () => {
  // Use window.innerWidth if available (client-side)
  if (typeof window !== "undefined") {
    return window.innerWidth < breakpoints.md;
  }

  // Default to false for server-side rendering
  return false;
};

// Adjust container padding based on screen size
export const getContainerPadding = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < breakpoints.sm) {
      return "0 10px";
    } else if (window.innerWidth < breakpoints.md) {
      return "0 15px";
    } else if (window.innerWidth < breakpoints.lg) {
      return "0 20px";
    }
  }

  return "0 24px"; // Default padding
};
