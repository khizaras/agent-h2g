import { useEffect } from "react";
import {
  trackEvent,
  trackSearch,
  trackCategoryFilter,
  trackFormSubmission,
  trackDonation,
  trackCauseCreation,
  trackCauseFollow,
  trackCauseUnfollow,
  trackError,
} from "../utils/analytics";

/**
 * Custom hook for tracking analytics across the application
 * This provides a simple interface to track various events
 */
export const useAnalytics = () => {
  // Track any UI interaction event
  const trackInteraction = (action, label = null, value = null) => {
    trackEvent("UI Interaction", action, label, value);
  };

  // Track form interactions
  const trackForm = (formName, action = "Submitted") => {
    trackFormSubmission(formName);
    trackEvent("Form", action, formName);
  };

  // Track donation
  const trackDonationEvent = (causeId, amount, method = "cc") => {
    trackDonation(causeId, amount);
    trackEvent("Payment", method, causeId, amount);
  };

  // Track search
  const trackSearchQuery = (query, resultsCount = null) => {
    trackSearch(query);
    if (resultsCount !== null) {
      trackEvent("Search", "Results Count", query, resultsCount);
    }
  };

  // Track filtering
  const trackFilter = (filterType, filterValue) => {
    if (filterType === "category") {
      trackCategoryFilter(filterValue);
    }
    trackEvent("Filter", filterType, filterValue);
  };

  // Track cause actions
  const trackCauseAction = (action, causeId, detail = null) => {
    switch (action) {
      case "create":
        trackCauseCreation(causeId);
        break;
      case "follow":
        trackCauseFollow(causeId);
        break;
      case "unfollow":
        trackCauseUnfollow(causeId);
        break;
      case "share":
        trackEvent("Cause", "Shared", detail || causeId);
        break;
      default:
        trackEvent("Cause", action, causeId);
    }
  };

  // Track error events
  const trackErrorEvent = (type, message) => {
    trackError(type, message);
  };

  return {
    trackInteraction,
    trackForm,
    trackDonationEvent,
    trackSearchQuery,
    trackFilter,
    trackCauseAction,
    trackErrorEvent,
  };
};

export default useAnalytics;
