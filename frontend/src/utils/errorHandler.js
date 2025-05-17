/**
 * Centralized error handling utility for API requests
 *
 * This utility standardizes error handling across the application,
 * making it easier to maintain consistent error messages and logging.
 */

// Standard error handler for API requests
export const handleApiError = (error) => {
  let errorMessage = "";

  // Handle axios error responses
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    } else if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data && error.response.data.errors) {
      const errors = error.response.data.errors;
      if (Array.isArray(errors)) {
        errorMessage = errors.map((err) => err.msg || err.message).join(", ");
      } else {
        errorMessage = "Validation failed. Please check your inputs.";
      }
    } else {
      errorMessage = `Server error: ${error.response.status}`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage =
      "No response from server. Please check your internet connection and try again.";
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || "An unexpected error occurred";
  }

  // Log errors in development environment
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", error);
  }

  return errorMessage;
};

// Check for authentication errors
export const isAuthError = (error) => {
  return (
    error?.response?.status === 401 ||
    error?.response?.data?.error?.toLowerCase().includes("not authorized") ||
    error?.response?.data?.error?.toLowerCase().includes("token")
  );
};

// Format validation errors from the backend
export const formatValidationErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) {
    return {};
  }

  return errors.reduce((acc, error) => {
    acc[error.param] = error.msg;
    return acc;
  }, {});
};
