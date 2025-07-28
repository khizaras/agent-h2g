import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cause, FilterParams, ApiResponse } from '@/types';

interface CausesState {
  causes: Cause[];
  featuredCauses: Cause[];
  currentCause: Cause | null;
  filters: FilterParams;
  searchQuery: string;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: string[];
  locations: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list' | 'map';
  cache: {
    [key: string]: {
      data: Cause[];
      timestamp: number;
      expiry: number;
    };
  };
}

const initialState: CausesState = {
  causes: [],
  featuredCauses: [],
  currentCause: null,
  filters: {
    page: 1,
    limit: 12,
    sort: 'createdAt',
    order: 'desc',
  },
  searchQuery: '',
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  categories: [],
  locations: [],
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'grid',
  cache: {},
};

// Async thunks
export const fetchCauses = createAsyncThunk(
  'causes/fetchCauses',
  async (filters: FilterParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/causes?${queryParams}`);
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch causes');
      }

      const data: ApiResponse<Cause[]> = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchFeaturedCauses = createAsyncThunk(
  'causes/fetchFeaturedCauses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/causes/featured');
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch featured causes');
      }

      const data: ApiResponse<Cause[]> = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchCauseById = createAsyncThunk(
  'causes/fetchCauseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch cause');
      }

      const data: ApiResponse<Cause> = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createCause = createAsyncThunk(
  'causes/createCause',
  async (causeData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/causes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: causeData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create cause');
      }

      const data: ApiResponse<Cause> = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateCause = createAsyncThunk(
  'causes/updateCause',
  async ({ id, causeData }: { id: number; causeData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/causes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: causeData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update cause');
      }

      const data: ApiResponse<Cause> = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteCause = createAsyncThunk(
  'causes/deleteCause',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/causes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete cause');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const likeCause = createAsyncThunk(
  'causes/likeCause',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/causes/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to like cause');
      }

      const data: ApiResponse<{ liked: boolean; likeCount: number }> = await response.json();
      return { id, ...data.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const shareCause = createAsyncThunk(
  'causes/shareCause',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/causes/${id}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to share cause');
      }

      const data: ApiResponse<{ shareCount: number }> = await response.json();
      return { id, shareCount: data.data!.shareCount };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const searchCauses = createAsyncThunk(
  'causes/searchCauses',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to search causes');
      }

      const data: ApiResponse<Cause[]> = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Causes slice
const causesSlice = createSlice({
  name: 'causes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCause: (state, action: PayloadAction<Cause | null>) => {
      state.currentCause = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 12,
        sort: 'createdAt',
        order: 'desc',
      };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.filters.sort = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      state.filters.order = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'map'>) => {
      state.viewMode = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.filters.limit = action.payload;
    },
    addToCache: (state, action: PayloadAction<{ key: string; data: Cause[]; expiry?: number }>) => {
      const { key, data, expiry = 5 * 60 * 1000 } = action.payload; // 5 minutes default
      state.cache[key] = {
        data,
        timestamp: Date.now(),
        expiry,
      };
    },
    clearCache: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        delete state.cache[action.payload];
      } else {
        state.cache = {};
      }
    },
    updateCauseInList: (state, action: PayloadAction<Cause>) => {
      const updatedCause = action.payload;
      
      // Update in main causes list
      const mainIndex = state.causes.findIndex(cause => cause.id === updatedCause.id);
      if (mainIndex !== -1) {
        state.causes[mainIndex] = updatedCause;
      }
      
      // Update in featured causes list
      const featuredIndex = state.featuredCauses.findIndex(cause => cause.id === updatedCause.id);
      if (featuredIndex !== -1) {
        state.featuredCauses[featuredIndex] = updatedCause;
      }
      
      // Update current cause if it matches
      if (state.currentCause?.id === updatedCause.id) {
        state.currentCause = updatedCause;
      }
    },
    removeCauseFromList: (state, action: PayloadAction<number>) => {
      const causeId = action.payload;
      
      state.causes = state.causes.filter(cause => cause.id !== causeId);
      state.featuredCauses = state.featuredCauses.filter(cause => cause.id !== causeId);
      
      if (state.currentCause?.id === causeId) {
        state.currentCause = null;
      }
    },
    incrementViewCount: (state, action: PayloadAction<number>) => {
      const causeId = action.payload;
      
      // Update in main causes list
      const mainCause = state.causes.find(cause => cause.id === causeId);
      if (mainCause) {
        mainCause.viewCount += 1;
      }
      
      // Update in featured causes list
      const featuredCause = state.featuredCauses.find(cause => cause.id === causeId);
      if (featuredCause) {
        featuredCause.viewCount += 1;
      }
      
      // Update current cause
      if (state.currentCause?.id === causeId) {
        state.currentCause.viewCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch causes
    builder
      .addCase(fetchCauses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCauses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.causes = action.payload.data?.causes || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
        state.error = null;
      })
      .addCase(fetchCauses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch featured causes
    builder
      .addCase(fetchFeaturedCauses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedCauses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredCauses = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchFeaturedCauses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch cause by ID
    builder
      .addCase(fetchCauseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCauseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCause = action.payload.data || null;
        state.error = null;
      })
      .addCase(fetchCauseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create cause
    builder
      .addCase(createCause.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCause.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload.data) {
          state.causes.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createCause.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update cause
    builder
      .addCase(updateCause.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCause.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.data) {
          causesSlice.caseReducers.updateCauseInList(state, { 
            payload: action.payload.data, 
            type: 'causes/updateCauseInList' 
          });
        }
        state.error = null;
      })
      .addCase(updateCause.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete cause
    builder
      .addCase(deleteCause.fulfilled, (state, action) => {
        causesSlice.caseReducers.removeCauseFromList(state, { 
          payload: action.payload, 
          type: 'causes/removeCauseFromList' 
        });
      });

    // Like cause
    builder
      .addCase(likeCause.fulfilled, (state, action) => {
        const { id, liked, likeCount } = action.payload;
        
        // Update in main causes list
        const mainCause = state.causes.find(cause => cause.id === id);
        if (mainCause) {
          mainCause.likeCount = likeCount;
        }
        
        // Update in featured causes list
        const featuredCause = state.featuredCauses.find(cause => cause.id === id);
        if (featuredCause) {
          featuredCause.likeCount = likeCount;
        }
        
        // Update current cause
        if (state.currentCause?.id === id) {
          state.currentCause.likeCount = likeCount;
        }
      });

    // Share cause
    builder
      .addCase(shareCause.fulfilled, (state, action) => {
        const { id, shareCount } = action.payload;
        
        // Update in main causes list
        const mainCause = state.causes.find(cause => cause.id === id);
        if (mainCause) {
          mainCause.shareCount = shareCount;
        }
        
        // Update in featured causes list
        const featuredCause = state.featuredCauses.find(cause => cause.id === id);
        if (featuredCause) {
          featuredCause.shareCount = shareCount;
        }
        
        // Update current cause
        if (state.currentCause?.id === id) {
          state.currentCause.shareCount = shareCount;
        }
      });

    // Search causes
    builder
      .addCase(searchCauses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCauses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.causes = action.payload.data || [];
        state.error = null;
      })
      .addCase(searchCauses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentCause,
  setFilters,
  clearFilters,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setViewMode,
  setPage,
  setLimit,
  addToCache,
  clearCache,
  updateCauseInList,
  removeCauseFromList,
  incrementViewCount,
} = causesSlice.actions;

export default causesSlice.reducer;

// Selectors
export const selectCauses = (state: { causes: CausesState }) => state.causes;
export const selectCausesList = (state: { causes: CausesState }) => state.causes.causes;
export const selectFeaturedCauses = (state: { causes: CausesState }) => state.causes.featuredCauses;
export const selectCurrentCause = (state: { causes: CausesState }) => state.causes.currentCause;
export const selectCausesLoading = (state: { causes: CausesState }) => state.causes.isLoading;
export const selectCausesError = (state: { causes: CausesState }) => state.causes.error;
export const selectCausesFilters = (state: { causes: CausesState }) => state.causes.filters;
export const selectCausesPagination = (state: { causes: CausesState }) => state.causes.pagination;
export const selectCausesViewMode = (state: { causes: CausesState }) => state.causes.viewMode;