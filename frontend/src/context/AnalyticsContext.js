import React, { createContext, useContext } from "react";
import useAnalytics from "../hooks/useAnalytics";

// Create the analytics context
const AnalyticsContext = createContext(null);

/**
 * Analytics Provider Component
 * This provides analytics tracking capabilities to the entire app
 */
export const AnalyticsProvider = ({ children }) => {
  const analytics = useAnalytics();

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

/**
 * Hook to use the analytics context
 * @returns {Object} Analytics tracking functions
 */
export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);

  if (context === null) {
    throw new Error(
      "useAnalyticsContext must be used within an AnalyticsProvider"
    );
  }

  return context;
};

export default AnalyticsProvider;
