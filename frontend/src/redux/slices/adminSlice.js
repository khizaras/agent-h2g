import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { handleApiError } from "../../utils/errorHandler";

// Get all users
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/admin/users");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post("/api/admin/users", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Get all causes
export const getAllCauses = createAsyncThunk(
  "admin/getAllCauses",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/admin/causes");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Update cause status
export const updateCauseStatus = createAsyncThunk(
  "admin/updateCauseStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await axios.patch(`/api/admin/causes/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Delete cause
export const deleteCause = createAsyncThunk(
  "admin/deleteCause",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/api/admin/causes/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Get admin stats
export const getAdminStats = createAsyncThunk(
  "admin/getStats",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/admin/stats");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Get admin activities
export const getAdminActivities = createAsyncThunk(
  "admin/getActivities",
  async ({ startDate, endDate, type = "all" }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/api/admin/activities?startDate=${startDate}&endDate=${endDate}&type=${type}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  users: [],
  causes: [],
  notifications: [],
  stats: null,
  activities: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const adminSlice = createSlice({
  name: "admin",
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
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get all causes
      .addCase(getAllCauses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCauses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causes = action.payload;
      })
      .addCase(getAllCauses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update cause status
      .addCase(updateCauseStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCauseStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causes = state.causes.map((cause) =>
          cause.id === action.payload.id ? action.payload : cause
        );
      })
      .addCase(updateCauseStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete cause
      .addCase(deleteCause.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCause.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causes = state.causes.filter(
          (cause) => cause.id !== action.payload
        );
      })
      .addCase(deleteCause.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get admin stats
      .addCase(getAdminStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get admin activities
      .addCase(getAdminActivities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activities = action.payload;
      })
      .addCase(getAdminActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
