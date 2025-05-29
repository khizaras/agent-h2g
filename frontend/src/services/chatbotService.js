import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "/api/chatbot/";

// Send message to chatbot
const sendMessage = async (messageData, causes, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000, // 30 second timeout for the request
    };

    // Filter to include only active causes to keep context size reasonable
    const activeCauses = causes.filter(
      (cause) =>
        cause.status === "active" ||
        cause.status === "Active" ||
        cause.status === "published" ||
        cause.status === "Published"
    );

    // Use all causes if filter results in empty array
    const contextCauses = activeCauses.length > 0 ? activeCauses : causes;

    // Limit to max 10 causes to prevent context overflow
    const limitedCauses = contextCauses.slice(0, 10);

    // Prepare context data about causes
    const contextData = {
      message: messageData,
      causes: limitedCauses.map((cause) => ({
        id: cause.id,
        title: cause.title,
        description:
          cause.description && cause.description.length > 300
            ? `${cause.description.substring(0, 300)}...`
            : cause.description,
        location: cause.location,
        category: cause.category_name,
        target_amount: cause.target_amount,
        current_amount: cause.current_amount,
        status: cause.status,
        created_at: cause.created_at,
      })),
    };

    const response = await axios.post(API_URL, contextData, config);
    return response.data.reply;
  } catch (error) {
    console.error("Chatbot error:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage || "Failed to communicate with the chatbot");
  }
};

const chatbotService = {
  sendMessage,
};

export default chatbotService;
