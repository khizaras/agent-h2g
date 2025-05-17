import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/notifications/";

// Get user notifications with pagination
const getUserNotifications = async (page = 1, limit = 10, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
      },
    };

    const response = await axios.get(API_URL, config);

    return {
      notifications: response.data.notifications,
      pagination: response.data.pagination,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get unread notifications count
const getUnreadCount = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + "unread-count", config);

    return response.data.count;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Mark a notification as read
const markNotificationAsRead = async (notificationId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(API_URL + notificationId, {}, config);

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(API_URL + "read-all", {}, config);

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Create an admin notification (admin only)
const createAdminNotification = async (notificationData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL + "admin",
      notificationData,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Create a milestone notification (cause owner only)
const createMilestoneNotification = async (
  causeId,
  notificationData,
  token
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL + `milestone/${causeId}`,
      notificationData,
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const notificationsService = {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createAdminNotification,
  createMilestoneNotification,
};

export default notificationsService;
