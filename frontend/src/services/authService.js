import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/auth/";

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData);

    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData);

    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Google login
const googleLogin = async (token) => {
  try {
    const response = await axios.post(API_URL + "google", { token });

    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Get current user
const getCurrentUser = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + "me", config);
    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update profile
const updateProfile = async (profileData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.put("/api/users/profile", profileData, config);

    if (response.data.success) {
      // Update stored user data but keep the token
      const user = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...user,
        ...response.data.user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update password
const updatePassword = async (passwordData, token) => {
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

const authService = {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
  updateProfile,
  updatePassword,
};

export default authService;
