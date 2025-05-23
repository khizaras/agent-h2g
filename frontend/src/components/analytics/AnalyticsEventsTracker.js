import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  trackPageView,
  trackEvent,
  trackCauseCreation,
  trackCauseFollow,
  trackDonation,
  trackOutboundLink,
  trackSearch,
  trackCategoryFilter,
} from "../../utils/analytics";

/**
 * This component handles Google Analytics event tracking throughout the application.
 * It captures key events and actions based on URL patterns and query parameters.
 */
const AnalyticsEventsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on each location change
    trackPageView(location.pathname + location.search);

    // Extract query parameters from URL
    const searchParams = new URLSearchParams(location.search);

    // Track specific page patterns and events

    // Track cause views
    if (location.pathname.match(/\/causes\/\d+$/)) {
      const causeId = location.pathname.split("/").pop();
      trackEvent("Cause", "View", causeId);
    }

    // Track category filtering
    const category = searchParams.get("category");
    if (category) {
      trackCategoryFilter(category);
    }

    // Track search queries
    const searchQuery = searchParams.get("q") || searchParams.get("query");
    if (searchQuery) {
      trackSearch(searchQuery);
    }

    // Track donation success pages
    if (location.pathname.includes("/donation/success")) {
      const causeId = searchParams.get("causeId");
      const amount = searchParams.get("amount");
      if (causeId && amount) {
        trackDonation(causeId, parseFloat(amount));
      }
    }

    // Track successful cause creation
    if (location.pathname.includes("/create/success")) {
      const causeId = searchParams.get("causeId");
      if (causeId) {
        trackCauseCreation(causeId);
      }
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default AnalyticsEventsTracker;
