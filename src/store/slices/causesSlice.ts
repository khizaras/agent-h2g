// Revamped Causes Redux Slice
// Clean, type-safe implementation for the new cause management system

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Type Definitions
export interface CauseBase {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  category_id: number;
  user_id: number;
  cause_type: 'wanted' | 'offered';
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  gallery?: string[];
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_featured: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  contact_phone?: string;
  contact_email?: string;
  contact_person?: string;
  availability_hours?: string;
  special_instructions?: string;
  tags?: string[];
  expires_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  creator_name?: string;
  creator_avatar?: string;
  category_name?: string;
  category_display_name?: string;
  category_color?: string;
  category_icon?: string;

  // Flattened category-specific fields for display purposes
  // Food fields
  food_type?: string;
  serving_size?: number;
  expiration_date?: string;
  
  // Clothes fields
  clothes_type?: string;
  gender?: string;
  condition?: string;
  
  // Training fields
  training_type?: string;
  skill_level?: string;
  duration_hours?: number;
  is_free?: boolean;
}

export interface FoodDetails {
  id: number;
  cause_id: number;
  food_type: string;
  cuisine_type?: string;
  quantity: number;
  unit: string;
  serving_size?: number;
  dietary_restrictions?: string[];
  allergens?: string[];
  expiration_date?: string;
  preparation_date?: string;
  storage_requirements?: string;
  temperature_requirements: 'frozen' | 'refrigerated' | 'room-temp' | 'hot';
  pickup_instructions?: string;
  delivery_available: boolean;
  delivery_radius?: number;
  is_urgent: boolean;
  ingredients?: string;
  nutritional_info?: Record<string, any>;
  halal: boolean;
  kosher: boolean;
  vegan: boolean;
  vegetarian: boolean;
  organic: boolean;
}

export interface ClothesDetails {
  id: number;
  cause_id: number;
  clothes_type: string;
  gender: 'men' | 'women' | 'unisex' | 'boys' | 'girls';
  age_group: 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'senior';
  size_range: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
  quantity: number;
  colors?: string[];
  brands?: string[];
  material_composition?: string;
  care_instructions?: string;
  special_requirements?: string;
  pickup_instructions?: string;
  delivery_available: boolean;
  delivery_radius?: number;
  is_urgent: boolean;
  is_cleaned: boolean;
  donation_receipt_available: boolean;
}

export interface TrainingDetails {
  id: number;
  cause_id: number;
  training_type: 'workshop' | 'course' | 'mentoring' | 'seminar' | 'bootcamp' | 'certification' | 'skills' | 'academic';
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'all-levels';
  topics: string[];
  max_participants: number;
  current_participants: number;
  duration_hours: number;
  number_of_sessions: number;
  prerequisites?: string;
  learning_objectives?: string[];
  curriculum?: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  schedule: Record<string, any>;
  delivery_method: 'in-person' | 'online' | 'hybrid' | 'self-paced';
  location_details?: string;
  meeting_platform?: string;
  meeting_link?: string;
  meeting_id?: string;
  meeting_password?: string;
  instructor_name: string;
  instructor_email?: string;
  instructor_phone?: string;
  instructor_bio?: string;
  instructor_qualifications?: string;
  certification_provided: boolean;
  certification_body?: string;
  materials_provided?: string[];
  materials_required?: string[];
  software_required?: string[];
  price: number;
  is_free: boolean;
  course_language: string;
  subtitles_available?: string[];
  difficulty_rating: number;
  course_materials_url?: string;
  enrollment_status: 'open' | 'closed' | 'waitlist' | 'full';
}

export interface FoodCause extends CauseBase {
  food_details?: FoodDetails;
}

export interface ClothesCause extends CauseBase {
  clothes_details?: ClothesDetails;
}

export interface TrainingCause extends CauseBase {
  training_details?: TrainingDetails;
}

export type Cause = FoodCause | ClothesCause | TrainingCause;

export interface CauseFilters {
  category?: string;
  cause_type?: 'wanted' | 'offered';
  location?: string;
  search?: string;
  status?: string;
  priority?: string;
  is_featured?: boolean;
  is_urgent?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'priority';
  sort_order?: 'asc' | 'desc';
}

export interface CausesState {
  // Data
  causes: Cause[];
  featuredCauses: Cause[];
  currentCause: Cause | null;
  userCauses: Cause[];
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
  
  // Loading states
  loading: boolean;
  featuredLoading: boolean;
  currentCauseLoading: boolean;
  userCausesLoading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  
  // Error states
  error: string | null;
  featuredError: string | null;
  currentCauseError: string | null;
  userCausesError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  
  // UI state
  filters: CauseFilters;
  selectedCategory: string | null;
  searchQuery: string;
}

const initialState: CausesState = {
  causes: [],
  featuredCauses: [],
  currentCause: null,
  userCauses: [],
  pagination: null,
  loading: false,
  featuredLoading: false,
  currentCauseLoading: false,
  userCausesLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  featuredError: null,
  currentCauseError: null,
  userCausesError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  filters: {},
  selectedCategory: null,
  searchQuery: '',
};

// Async Thunks
export const fetchCauses = createAsyncThunk(
  'causes/fetchCauses',
  async (filters: CauseFilters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/causes?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch causes');
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedCauses = createAsyncThunk(
  'causes/fetchFeaturedCauses',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/featured?limit=${limit}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch featured causes');
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCauseById = createAsyncThunk(
  'causes/fetchCauseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch cause');
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCauses = createAsyncThunk(
  'causes/fetchUserCauses',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/causes?user_id=${userId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch user causes');
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCause = createAsyncThunk(
  'causes/createCause',
  async (causeData: Partial<Cause>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/causes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(causeData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create cause');
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCause = createAsyncThunk(
  'causes/updateCause',
  async ({ id, causeData }: { id: number; causeData: Partial<Cause> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(causeData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update cause');
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCause = createAsyncThunk(
  'causes/deleteCause',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete cause');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeCause = createAsyncThunk(
  'causes/likeCause',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/causes/${id}/like`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to like cause');
      }
      
      return { id, liked: data.data.liked, likeCount: data.data.like_count };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const causesSlice = createSlice({
  name: 'causes',
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action: PayloadAction<CauseFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
      state.selectedCategory = null;
      state.searchQuery = '';
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.filters = { ...state.filters, category: action.payload || undefined };
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filters = { ...state.filters, search: action.payload || undefined };
    },
    
    // UI actions
    clearCurrentCause: (state) => {
      state.currentCause = null;
      state.currentCauseError = null;
    },
    
    clearErrors: (state) => {
      state.error = null;
      state.featuredError = null;
      state.currentCauseError = null;
      state.userCausesError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    
    // Optimistic updates
    incrementViewCount: (state, action: PayloadAction<number>) => {
      const cause = state.causes.find(c => c.id === action.payload);
      if (cause) {
        cause.view_count += 1;
      }
      if (state.currentCause?.id === action.payload) {
        state.currentCause.view_count += 1;
      }
    },
  },
  
  extraReducers: (builder) => {
    // Fetch Causes
    builder
      .addCase(fetchCauses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCauses.fulfilled, (state, action) => {
        state.loading = false;
        state.causes = action.payload.causes || [];
        state.pagination = action.payload.pagination || null;
        state.error = null;
      })
      .addCase(fetchCauses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.causes = [];
      });
    
    // Fetch Featured Causes
    builder
      .addCase(fetchFeaturedCauses.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedCauses.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredCauses = action.payload || [];
        state.featuredError = null;
      })
      .addCase(fetchFeaturedCauses.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload as string;
        state.featuredCauses = [];
      });
    
    // Fetch Cause By ID
    builder
      .addCase(fetchCauseById.pending, (state) => {
        state.currentCauseLoading = true;
        state.currentCauseError = null;
      })
      .addCase(fetchCauseById.fulfilled, (state, action) => {
        state.currentCauseLoading = false;
        state.currentCause = action.payload;
        state.currentCauseError = null;
      })
      .addCase(fetchCauseById.rejected, (state, action) => {
        state.currentCauseLoading = false;
        state.currentCauseError = action.payload as string;
        state.currentCause = null;
      });
    
    // Fetch User Causes
    builder
      .addCase(fetchUserCauses.pending, (state) => {
        state.userCausesLoading = true;
        state.userCausesError = null;
      })
      .addCase(fetchUserCauses.fulfilled, (state, action) => {
        state.userCausesLoading = false;
        state.userCauses = action.payload || [];
        state.userCausesError = null;
      })
      .addCase(fetchUserCauses.rejected, (state, action) => {
        state.userCausesLoading = false;
        state.userCausesError = action.payload as string;
        state.userCauses = [];
      });
    
    // Create Cause
    builder
      .addCase(createCause.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createCause.fulfilled, (state, action) => {
        state.creating = false;
        state.causes.unshift(action.payload);
        state.userCauses.unshift(action.payload);
        state.createError = null;
      })
      .addCase(createCause.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      });
    
    // Update Cause
    builder
      .addCase(updateCause.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateCause.fulfilled, (state, action) => {
        state.updating = false;
        const updatedCause = action.payload;
        
        // Update in causes array
        const causeIndex = state.causes.findIndex(c => c.id === updatedCause.id);
        if (causeIndex !== -1) {
          state.causes[causeIndex] = updatedCause;
        }
        
        // Update in user causes array
        const userCauseIndex = state.userCauses.findIndex(c => c.id === updatedCause.id);
        if (userCauseIndex !== -1) {
          state.userCauses[userCauseIndex] = updatedCause;
        }
        
        // Update current cause if it matches
        if (state.currentCause?.id === updatedCause.id) {
          state.currentCause = updatedCause;
        }
        
        state.updateError = null;
      })
      .addCase(updateCause.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });
    
    // Delete Cause
    builder
      .addCase(deleteCause.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteCause.fulfilled, (state, action) => {
        state.deleting = false;
        const deletedId = action.payload;
        
        // Remove from causes array
        state.causes = state.causes.filter(c => c.id !== deletedId);
        
        // Remove from user causes array
        state.userCauses = state.userCauses.filter(c => c.id !== deletedId);
        
        // Clear current cause if it matches
        if (state.currentCause?.id === deletedId) {
          state.currentCause = null;
        }
        
        state.deleteError = null;
      })
      .addCase(deleteCause.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload as string;
      });
    
    // Like Cause
    builder
      .addCase(likeCause.fulfilled, (state, action) => {
        const { id, likeCount } = action.payload;
        
        // Update in causes array
        const cause = state.causes.find(c => c.id === id);
        if (cause) {
          cause.like_count = likeCount;
        }
        
        // Update current cause if it matches
        if (state.currentCause?.id === id) {
          state.currentCause.like_count = likeCount;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedCategory,
  setSearchQuery,
  clearCurrentCause,
  clearErrors,
  incrementViewCount,
} = causesSlice.actions;

// Selectors
export const selectCauses = (state: { causes: CausesState }) => state.causes.causes || [];
export const selectFeaturedCauses = (state: { causes: CausesState }) => state.causes.featuredCauses || [];
export const selectCurrentCause = (state: { causes: CausesState }) => state.causes.currentCause;
export const selectUserCauses = (state: { causes: CausesState }) => state.causes.userCauses || [];
export const selectCausesLoading = (state: { causes: CausesState }) => state.causes.loading;
export const selectFeaturedLoading = (state: { causes: CausesState }) => state.causes.featuredLoading;
export const selectCurrentCauseLoading = (state: { causes: CausesState }) => state.causes.currentCauseLoading;
export const selectPagination = (state: { causes: CausesState }) => state.causes.pagination;
export const selectFilters = (state: { causes: CausesState }) => state.causes.filters;
export const selectSelectedCategory = (state: { causes: CausesState }) => state.causes.selectedCategory;
export const selectSearchQuery = (state: { causes: CausesState }) => state.causes.searchQuery;
export const selectCausesError = (state: { causes: CausesState }) => state.causes.error;
export const selectCreating = (state: { causes: CausesState }) => state.causes.creating;
export const selectUpdating = (state: { causes: CausesState }) => state.causes.updating;
export const selectDeleting = (state: { causes: CausesState }) => state.causes.deleting;

export default causesSlice.reducer;