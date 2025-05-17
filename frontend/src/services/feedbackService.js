import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/causes/";

// Create a new feedback
const createFeedback = async (feedbackData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      `${API_URL}${feedbackData.cause_id}/feedback`,
      feedbackData,
      config
    );

    return response.data.feedback;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get all feedback for a cause
const getCauseFeedbacks = async (causeId) => {
  try {
    const response = await axios.get(`${API_URL}${causeId}/feedback`);

    return response.data.feedback;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const feedbackService = {
  createFeedback,
  getCauseFeedbacks,
};

export default feedbackService;
