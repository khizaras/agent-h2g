import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/causes/";

// Get all causes
const getCauses = async (filters = {}) => {
  try {
    const {
      category,
      location,
      status,
      search,
      page = 1,
      limit = 10,
    } = filters;

    // Build query string
    let queryString = `?page=${page}&limit=${limit}`;

    if (category) queryString += `&category=${category}`;
    if (location) queryString += `&location=${encodeURIComponent(location)}`;
    if (status) queryString += `&status=${status}`;
    if (search) queryString += `&search=${encodeURIComponent(search)}`;

    const response = await axios.get(API_URL + queryString);

    return {
      causes: response.data.causes,
      pagination: response.data.pagination,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get cause by ID
const getCauseById = async (causeId, token) => {
  try {
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await axios.get(API_URL + causeId, config);

    return response.data.cause;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Create new cause
const createCause = async (causeData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(API_URL, causeData, config);

    return response.data.cause;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update cause
const updateCause = async (causeId, causeData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.put(API_URL + causeId, causeData, config);

    return response.data.cause;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
// Delete cause
const deleteCause = async (causeId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(API_URL + causeId, config);

    return { id: causeId };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get cause contributions
const getCauseContributions = async (causeId) => {
  try {
    const response = await axios.get(API_URL + causeId + "/contributions");

    return response.data.contributions;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get cause feedback
const getCauseFeedback = async (causeId) => {
  try {
    const response = await axios.get(API_URL + causeId + "/feedback");

    return response.data.feedback;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Add contribution to cause
const addContribution = async (causeId, contributionData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL + causeId + "/contribute",
      contributionData,
      config
    );

    return response.data.contribution;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Add feedback to cause
const addFeedback = async (causeId, feedbackData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL + causeId + "/feedback",
      feedbackData,
      config
    );

    return response.data.feedback;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Follow cause
const followCause = async (causeId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL + causeId + "/follow",
      {},
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Unfollow cause
const unfollowCause = async (causeId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      API_URL + causeId + "/unfollow",
      {},
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get category field values for a cause
const getCauseFieldValues = async (causeId) => {
  try {
    const response = await axios.get(API_URL + causeId + "/category-values");
    return response.data.values;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const causesService = {
  getCauses,
  getCauseById,
  createCause,
  updateCause,
  deleteCause,
  getCauseContributions,
  getCauseFeedback,
  addContribution,
  addFeedback,
  followCause,
  unfollowCause,
  getCauseFieldValues,
};

export default causesService;
