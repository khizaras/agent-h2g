import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contributionsService from "../../services/contributionsService";

const initialState = {
  contributions: [],
  contribution: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Create new contribution
export const createContribution = createAsyncThunk(
  "contributions/create",
  async (contributionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await contributionsService.createContribution(
        contributionData,
        token
      );
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

// Get all contributions for a cause
export const getCauseContributions = createAsyncThunk(
  "contributions/getByCause",
  async (causeId, thunkAPI) => {
    try {
      return await contributionsService.getCauseContributions(causeId);
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

export const contributionsSlice = createSlice({
  name: "contributions",
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
      // Create contribution
      .addCase(createContribution.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createContribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contribution = action.payload;
      })
      .addCase(createContribution.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get cause contributions
      .addCase(getCauseContributions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCauseContributions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contributions = action.payload;
      })
      .addCase(getCauseContributions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = contributionsSlice.actions;
export default contributionsSlice.reducer;
