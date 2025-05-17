import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

const initialState = {
  stats: {
    causesCreated: 0,
    causesFollowed: 0,
    totalContributions: 0,
    totalContributedAmount: 0,
    totalContributedFood: 0,
  },
  contributions: [],
  followedCauses: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get user statistics
export const getUserStats = createAsyncThunk(
  "user/getStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await userService.getUserStats(token);
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

// Get user contributions
export const getUserContributions = createAsyncThunk(
  "user/getContributions",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await userService.getUserContributions(token);
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

// Get user followed causes
export const getFollowedCauses = createAsyncThunk(
  "user/getFollowedCauses",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await userService.getFollowedCauses(token);
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

export const userSlice = createSlice({
  name: "user",
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
      // Get user stats
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get user contributions
      .addCase(getUserContributions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserContributions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contributions = action.payload;
      })
      .addCase(getUserContributions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get followed causes
      .addCase(getFollowedCauses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFollowedCauses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.followedCauses = action.payload;
      })
      .addCase(getFollowedCauses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
