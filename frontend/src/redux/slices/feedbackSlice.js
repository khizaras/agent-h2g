import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import feedbackService from "../../services/feedbackService";

const initialState = {
  feedbacks: [],
  feedback: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Create new feedback
export const createFeedback = createAsyncThunk(
  "feedback/create",
  async (feedbackData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await feedbackService.createFeedback(feedbackData, token);
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

// Get all feedback for a cause
export const getCauseFeedbacks = createAsyncThunk(
  "feedback/getByCause",
  async (causeId, thunkAPI) => {
    try {
      return await feedbackService.getCauseFeedbacks(causeId);
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

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.feedback = action.payload;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get cause feedbacks
      .addCase(getCauseFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCauseFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.feedbacks = action.payload;
      })
      .addCase(getCauseFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = feedbackSlice.actions;
export default feedbackSlice.reducer;
