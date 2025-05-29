import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatbotService from "../../services/chatbotService";

const initialState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  isError: false,
  message: "",
  sessionId: null,
  remainingMessages: 20, // Maximum messages per day (default)
  isApproachingLimit: false,
  limitReached: false,
  chatHistory: [], // User's chat history/sessions
};

// Send message to chatbot
export const sendMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;

      // If no token, user is not authenticated
      if (!token) {
        return thunkAPI.rejectWithValue("Please log in to use the chatbot");
      }

      const causes = thunkAPI.getState().causes.causes || [];
      const sessionId = thunkAPI.getState().chatbot.sessionId;
      return await chatbotService.sendMessage(
        messageData,
        causes,
        token,
        sessionId
      );
    } catch (error) {
      // Check for limit reached error
      if (error.response && error.response.status === 429) {
        return thunkAPI.rejectWithValue({
          message: error.response.data.reply || "Daily message limit reached",
          limitReached: true,
        });
      }

      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Fetch user's chat history
export const fetchChatHistory = createAsyncThunk(
  "chatbot/fetchHistory",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;

      // If no token, user is not authenticated
      if (!token) {
        return thunkAPI.rejectWithValue("Please log in to view chat history");
      }

      return await chatbotService.getChatHistory(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch specific chat session
export const fetchSessionMessages = createAsyncThunk(
  "chatbot/fetchSession",
  async (sessionId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;

      // If no token, user is not authenticated
      if (!token) {
        return thunkAPI.rejectWithValue("Please log in to view chat history");
      }

      return await chatbotService.getSessionMessages(sessionId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeChatbot: (state) => {
      state.isOpen = false;
    },
    openChatbot: (state) => {
      state.isOpen = true;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        text: action.payload,
        sender: "user",
        timestamp: new Date().toISOString(),
      });
    },
    "message/system": (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.sessionId = null;
    },
    startNewSession: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.isError = false;
      state.message = "";
    },
    resetChatError: (state) => {
      state.isError = false;
      state.message = "";
    },
    reset: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Set or update session ID
        if (action.payload.session_id) {
          state.sessionId = action.payload.session_id;
        }
        // Update remaining messages count
        if (action.payload.remaining_messages !== undefined) {
          state.remainingMessages = action.payload.remaining_messages;
          state.isApproachingLimit = action.payload.isApproachingLimit || false;
        }
        // Add the bot's response to messages
        state.messages.push({
          id: Date.now(),
          text: action.payload.reply || action.payload,
          sender: "bot",
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        // Handle chat limit reached case
        if (action.payload && action.payload.limitReached) {
          state.limitReached = true;
          state.message = action.payload.message;
          // Add system message about limit reached
          state.messages.push({
            id: Date.now(),
            text: action.payload.message,
            sender: "bot",
            timestamp: new Date().toISOString(),
            isSystemMessage: true,
          });
        } else {
          state.message = action.payload?.message || action.payload;
        }
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatHistory = action.payload.sessions;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchSessionMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSessionMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessionMessages = action.payload.messages;
      })
      .addCase(fetchSessionMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  toggleChatbot,
  closeChatbot,
  openChatbot,
  addUserMessage,
  clearMessages,
  startNewSession,
  resetChatError,
  reset,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
