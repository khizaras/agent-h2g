import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import causesService from "../../services/causesService";

const initialState = {
  causes: [],
  cause: null,
  categoryFieldValues: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get all causes
export const getCauses = createAsyncThunk(
  "causes/getAll",
  async (filters, thunkAPI) => {
    try {
      return await causesService.getCauses(filters);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cause by ID
export const getCauseById = createAsyncThunk(
  "causes/getById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await causesService.getCauseById(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new cause
export const createCause = createAsyncThunk(
  "causes/create",
  async (causeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.createCause(causeData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cause
export const updateCause = createAsyncThunk(
  "causes/update",
  async ({ id, causeData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.updateCause(id, causeData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete cause
export const deleteCause = createAsyncThunk(
  "causes/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.deleteCause(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cause contributions
export const getCauseContributions = createAsyncThunk(
  "causes/getContributions",
  async (id, thunkAPI) => {
    try {
      return await causesService.getCauseContributions(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cause feedback
export const getCauseFeedback = createAsyncThunk(
  "causes/getFeedback",
  async (id, thunkAPI) => {
    try {
      return await causesService.getCauseFeedback(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add contribution to cause
export const addContribution = createAsyncThunk(
  "causes/addContribution",
  async ({ id, contributionData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.addContribution(id, contributionData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add feedback to cause
export const addFeedback = createAsyncThunk(
  "causes/addFeedback",
  async ({ id, feedbackData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.addFeedback(id, feedbackData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Follow cause
export const followCause = createAsyncThunk(
  "causes/follow",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.followCause(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unfollow cause
export const unfollowCause = createAsyncThunk(
  "causes/unfollow",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await causesService.unfollowCause(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle follow cause (convenience function to handle both follow and unfollow)
export const toggleFollowCause = createAsyncThunk(
  "causes/toggleFollow",
  async ({ id, isFollowing }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (isFollowing) {
        return await causesService.unfollowCause(id, token);
      } else {
        return await causesService.followCause(id, token);
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cause category field values
export const getCauseFieldValues = createAsyncThunk(
  "causes/getCategoryValues",
  async (id, thunkAPI) => {
    try {
      return await causesService.getCauseFieldValues(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const causesSlice = createSlice({
  name: "causes",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearCause: (state) => {
      state.cause = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all causes cases
      .addCase(getCauses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCauses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causes = action.payload.causes;
        state.pagination = action.payload.pagination;
      })
      .addCase(getCauses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get cause by ID cases
      .addCase(getCauseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCauseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cause = action.payload;
      })
      .addCase(getCauseById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create cause cases
      .addCase(createCause.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCause.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causes.unshift(action.payload);
      })
      .addCase(createCause.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update cause cases
      .addCase(updateCause.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCause.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cause = action.payload;
        state.causes = state.causes.map((cause) =>
          cause.id === action.payload.id ? action.payload : cause
        );
      })
      .addCase(updateCause.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete cause cases
      .addCase(deleteCause.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCause.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causes = state.causes.filter(
          (cause) => cause.id !== action.payload.id
        );
      })
      .addCase(deleteCause.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      }) // Follow cause cases
      .addCase(followCause.fulfilled, (state) => {
        if (state.cause) {
          state.cause.isFollowing = true;
        }
      })

      // Unfollow cause cases
      .addCase(unfollowCause.fulfilled, (state) => {
        if (state.cause) {
          state.cause.isFollowing = false;
        }
      })

      // Toggle follow cause cases
      .addCase(toggleFollowCause.fulfilled, (state, action) => {
        if (state.cause) {
          state.cause.isFollowing = action.payload.isFollowing;
        }
      })

      // Add contribution cases
      .addCase(addContribution.fulfilled, (state, action) => {
        if (state.cause) {
          // Update current funding or food quantity
          if (action.payload.amount) {
            state.cause.current_funding =
              parseFloat(state.cause.current_funding) +
              parseFloat(action.payload.amount);
          }

          if (action.payload.food_quantity) {
            state.cause.current_food =
              parseInt(state.cause.current_food) +
              parseInt(action.payload.food_quantity);
          }
        }
      })
      // Get cause field values cases
      .addCase(getCauseFieldValues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCauseFieldValues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categoryFieldValues = action.payload;
      })
      .addCase(getCauseFieldValues.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCause } = causesSlice.actions;
export default causesSlice.reducer;
