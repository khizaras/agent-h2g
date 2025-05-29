import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatbotService from "../../services/chatbotService";

const initialState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  isError: false,
  message: "",
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
      return await chatbotService.sendMessage(messageData, causes, token);
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
        state.messages.push({
          id: Date.now(),
          text: action.payload,
          sender: "bot",
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
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
  reset,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
