import React from "react";
import {
  trackEvent,
  trackDonation,
  trackCauseFollow,
  trackCauseUnfollow,
} from "../../utils/analytics";

/**
 * Higher Order Component that adds analytics tracking to cause-related actions
 * @param {React.Component} WrappedComponent - The component to wrap with analytics tracking
 * @returns {React.Component} - Enhanced component with analytics tracking
 */
const withCauseAnalytics = (WrappedComponent) => {
  const WithCauseAnalytics = (props) => {
    // Track cause viewing
    const trackCauseView = (causeId, causeTitle) => {
      trackEvent("Cause", "View", causeTitle || causeId);
    };

    // Track donations with proper amount
    const trackCauseDonation = (causeId, amount, causeTitle) => {
      trackDonation(causeId, amount);
      trackEvent("Donation", "Completed", causeTitle || causeId, amount);
    };

    // Track follow/unfollow actions
    const trackCauseFollowAction = (causeId, isFollow, causeTitle) => {
      if (isFollow) {
        trackCauseFollow(causeId);
        trackEvent("Cause", "Followed", causeTitle || causeId);
      } else {
        trackCauseUnfollow(causeId);
        trackEvent("Cause", "Unfollowed", causeTitle || causeId);
      }
    };

    // Track comments
    const trackCauseComment = (causeId, causeTitle) => {
      trackEvent("Cause", "Comment", causeTitle || causeId);
    };

    // Track sharing
    const trackCauseShare = (causeId, platform, causeTitle) => {
      trackEvent("Cause", "Shared", platform, causeId);
    };

    return (
      <WrappedComponent
        {...props}
        trackCauseView={trackCauseView}
        trackCauseDonation={trackCauseDonation}
        trackCauseFollowAction={trackCauseFollowAction}
        trackCauseComment={trackCauseComment}
        trackCauseShare={trackCauseShare}
      />
    );
  };

  WithCauseAnalytics.displayName = `WithCauseAnalytics(${getDisplayName(
    WrappedComponent
  )})`;
  return WithCauseAnalytics;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withCauseAnalytics;
