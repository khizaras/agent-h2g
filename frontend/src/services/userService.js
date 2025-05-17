import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/users/";

// Get user statistics
const getUserStats = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + "stats", config);

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get user contributions
const getUserContributions = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + "contributions", config);

    return response.data.contributions;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get user followed causes
const getFollowedCauses = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + "followed-causes", config);

    return response.data.causes;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update user profile
const updateUserProfile = async (userData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.put(API_URL + "profile", userData, config);

    // Update user in local storage
    if (response.data.user && response.data.token) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response.data.user,
          token: response.data.token,
        })
      );
    }

    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Change user password
const updateUserPassword = async (passwordData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(
      API_URL + "password",
      passwordData,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const userService = {
  getUserStats,
  getUserContributions,
  getFollowedCauses,
  updateUserProfile,
  updateUserPassword,
};

export default userService;
