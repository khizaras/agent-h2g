import React from "react";
import { usePageTracking } from "../../hooks/usePageTracking";
import AnalyticsEventsTracker from "./AnalyticsEventsTracker";

/**
 * Component to track page views and other analytics events
 * Add this inside the Router but outside the Routes
 */
const PageTracker = () => {
  usePageTracking();
  return <AnalyticsEventsTracker />;
};

export default PageTracker;
