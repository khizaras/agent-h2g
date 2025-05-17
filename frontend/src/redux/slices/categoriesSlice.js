import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get all categories
export const getCategories = createAsyncThunk(
  "categories/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/categories");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Get category by ID with fields
export const getCategoryById = createAsyncThunk(
  "categories/getById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData, thunkAPI) => {
    try {
      const response = await axios.post("/api/admin/categories", categoryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

// Update a category
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/api/admin/categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

// Add a field to a category
export const addField = createAsyncThunk(
  "categories/addField",
  async ({ categoryId, fieldData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `/api/admin/categories/${categoryId}/fields`,
        fieldData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add field"
      );
    }
  }
);

// Update a field
export const updateField = createAsyncThunk(
  "categories/updateField",
  async ({ categoryId, fieldId, fieldData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/api/admin/categories/${categoryId}/fields/${fieldId}`,
        fieldData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update field"
      );
    }
  }
);

// Delete a field
export const deleteField = createAsyncThunk(
  "categories/deleteField",
  async ({ categoryId, fieldId }, thunkAPI) => {
    try {
      await axios.delete(
        `/api/admin/categories/${categoryId}/fields/${fieldId}`
      );
      return { categoryId, fieldId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete field"
      );
    }
  }
);

// Update field order
export const updateFieldOrder = createAsyncThunk(
  "categories/updateFieldOrder",
  async ({ categoryId, fields }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/api/admin/categories/${categoryId}/fields/order`,
        { fields }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update field order"
      );
    }
  }
);

// Get fields for a cause
export const getCauseFieldValues = createAsyncThunk(
  "categories/getCauseFieldValues",
  async (causeId, thunkAPI) => {
    try {
      const response = await axios.get(
        `/api/causes/${causeId}/category-values`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cause field values"
      );
    }
  }
);

// Save fields for a cause
export const saveCauseFieldValues = createAsyncThunk(
  "categories/saveCauseFieldValues",
  async ({ causeId, values }, thunkAPI) => {
    try {
      const response = await axios.post(
        `/api/causes/${causeId}/category-values`,
        { values }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save cause field values"
      );
    }
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  causeFieldValues: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const categoriesSlice = createSlice({
  name: "categories",
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
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.categories || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get category by ID
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCategory = action.payload.category;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedCategory = action.payload.category;
        state.categories = state.categories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        );
        if (state.currentCategory?.id === updatedCategory.id) {
          state.currentCategory = {
            ...state.currentCategory,
            ...updatedCategory,
          };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Add field
      .addCase(addField.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addField.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.currentCategory) {
          state.currentCategory.fields = state.currentCategory.fields || [];
          state.currentCategory.fields.push(action.payload.field);
        }
      })
      .addCase(addField.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update field
      .addCase(updateField.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateField.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.currentCategory) {
          state.currentCategory.fields = state.currentCategory.fields.map(
            (field) =>
              field.id === action.payload.field.id
                ? action.payload.field
                : field
          );
        }
      })
      .addCase(updateField.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete field
      .addCase(deleteField.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteField.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.currentCategory) {
          state.currentCategory.fields = state.currentCategory.fields.filter(
            (field) => field.id !== action.payload.fieldId
          );
        }
      })
      .addCase(deleteField.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update field order
      .addCase(updateFieldOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFieldOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The response is handled in the getCategoryById action, so we don't need to update state here
      })
      .addCase(updateFieldOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get cause field values
      .addCase(getCauseFieldValues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCauseFieldValues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.causeFieldValues = action.payload.values;
      })
      .addCase(getCauseFieldValues.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Save cause field values
      .addCase(saveCauseFieldValues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveCauseFieldValues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // No need to update state as the message doesn't contain field values
      })
      .addCase(saveCauseFieldValues.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = categoriesSlice.actions;
export default categoriesSlice.reducer;
