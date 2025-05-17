import axios from "axios";

// Configure axios interceptors to add auth token to every request
const setupAxiosInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const user = JSON.parse(localStorage.getItem("user"));

      // If token exists, add it to the Authorization header
      if (user && user.token) {
        config.headers["Authorization"] = `Bearer ${user.token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor (optional - for handling token expiration, etc.)
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 (Unauthorized) or 403 (Forbidden) errors
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // You can redirect to login or show an error message
        console.error("Authentication error:", error.response.data);
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
