import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/causes/";

// Create a new contribution
const createContribution = async (contributionData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      `${API_URL}${contributionData.cause_id}/contributions`,
      contributionData,
      config
    );

    return response.data.contribution;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get all contributions for a cause
const getCauseContributions = async (causeId) => {
  try {
    const response = await axios.get(`${API_URL}${causeId}/contributions`);

    return response.data.contributions;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const contributionsService = {
  createContribution,
  getCauseContributions,
};

export default contributionsService;
