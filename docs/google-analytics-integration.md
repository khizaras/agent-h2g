# Google Analytics Integration

This document outlines how Google Analytics has been implemented in the Hands2gether application.

## Setup

The application uses Google Analytics 4 (GA4) for tracking user interactions and events. The integration is implemented using the `react-ga4` package.

### Key Files

1. **`utils/analytics.js`** - Core analytics utility functions
2. **`hooks/usePageTracking.js`** - Hook for tracking page views
3. **`hooks/useAnalytics.js`** - Hook for tracking various events
4. **`components/analytics/PageTracker.js`** - Component to track page views
5. **`components/analytics/AnalyticsEventsTracker.js`** - Component to track specific events based on URL patterns
6. **`components/analytics/withCauseAnalytics.js`** - HOC to add analytics capabilities to cause-related components
7. **`context/AnalyticsContext.js`** - Context provider for app-wide analytics access

## Configuration

To configure Google Analytics, update the `MEASUREMENT_ID` in `utils/analytics.js` with your Google Analytics 4 Measurement ID.

## Tracked Events

The following events are tracked throughout the application:

### Page Views

- Every page view is automatically tracked

### User Events

- User registration (email and Google)
- User login (email and Google)
- User logout
- Profile updates

### Cause Events

- Cause creation
- Cause viewing
- Cause following/unfollowing
- Cause sharing
- Cause contributions/donations

### Navigation Events

- Search queries
- Category filtering
- Pagination

### Interaction Events

- Form submissions
- Button clicks on key actions
- External link clicks

## Usage

### Tracking Page Views

Page views are tracked automatically through the `PageTracker` component.

### Tracking Custom Events

To track custom events in a component:

```jsx
import { trackEvent } from "../utils/analytics";

// Later in your code
trackEvent("Category", "Action", "Label", Value);
```

### Using the Analytics Context

For components that need to track multiple events:

```jsx
import { useAnalyticsContext } from "../context/AnalyticsContext";

function MyComponent() {
  const analytics = useAnalyticsContext();

  const handleClick = () => {
    // Do something
    analytics.trackInteraction("ButtonClick", "FeatureButton");
  };
}
```

### Using the HOC for Cause Components

For cause-related components:

```jsx
import withCauseAnalytics from "../components/analytics/withCauseAnalytics";

function CauseComponent({ trackCauseView, trackCauseDonation, ...props }) {
  // Use tracking functions in your component
}

export default withCauseAnalytics(CauseComponent);
```

## Best Practices

1. Always include an appropriate event category, action, and label
2. Use consistent naming conventions
3. Track errors to understand user pain points
4. Don't track personally identifiable information
5. Ensure events are properly categorized for easier analysis
