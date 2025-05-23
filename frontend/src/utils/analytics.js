// Google Analytics utility
import ReactGA from "react-ga4";

// GA4 Measurement ID - Replace with your actual GA4 measurement ID
const MEASUREMENT_ID = "G-04GM4QLW5N"; // Hands2gether Google Analytics Measurement ID

// Initialize Google Analytics
export const initGA = () => {
  // Only initialize in production or if a valid ID is provided
  if (MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        cookieFlags: "SameSite=None;Secure",
        cookieUpdate: true,
      },
    });
    return true;
  }
  return false;
};

// Track page views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track user events
export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track user login
export const trackLogin = (method) => {
  trackEvent("User", "Login", method);
};

// Track user registration
export const trackRegistration = (method) => {
  trackEvent("User", "Registration", method);
};

// Track donation events
export const trackDonation = (causeId, amount) => {
  trackEvent("Donation", "Completed", causeId, amount);
};

// Track cause creation
export const trackCauseCreation = (causeId) => {
  trackEvent("Cause", "Created", causeId);
};

// Track cause follow/unfollow
export const trackCauseFollow = (causeId) => {
  trackEvent("Cause", "Followed", causeId);
};

export const trackCauseUnfollow = (causeId) => {
  trackEvent("Cause", "Unfollowed", causeId);
};

// Track search events
export const trackSearch = (query) => {
  trackEvent("Search", "Performed", query);
};

// Track form submissions
export const trackFormSubmission = (formName) => {
  trackEvent("Form", "Submitted", formName);
};

// Track category filtering
export const trackCategoryFilter = (categoryName) => {
  trackEvent("Filter", "Category", categoryName);
};

// Track errors
export const trackError = (errorType, errorMessage) => {
  trackEvent("Error", errorType, errorMessage);
};

// Track outbound links
export const trackOutboundLink = (url) => {
  trackEvent("Outbound Link", "Click", url);
};

// Track user logout
export const trackLogout = () => {
  trackEvent("User", "Logout");
};

// Track profile updates
export const trackProfileUpdate = (fieldChanged) => {
  trackEvent("User", "Profile Updated", fieldChanged);
};

// Track share events
export const trackShare = (contentType, contentId, platform) => {
  trackEvent("Share", platform, `${contentType}:${contentId}`);
};

// Track video interactions
export const trackVideoInteraction = (action, videoId) => {
  trackEvent("Video", action, videoId);
};

// Track file downloads
export const trackDownload = (fileType, fileName) => {
  trackEvent("Download", fileType, fileName);
};

// Track notification interactions
export const trackNotification = (action, notificationType) => {
  trackEvent("Notification", action, notificationType);
};
