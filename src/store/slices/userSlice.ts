import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  is_admin: boolean;
  is_verified: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_enabled: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_causes: number;
  active_causes: number;
  completed_causes: number;
  total_activities: number;
  total_registrations: number;
  likes_received: number;
  views_received: number;
  impact_score: number;
}

export interface UserActivity {
  id: number;
  type: 'cause_created' | 'cause_updated' | 'activity_logged' | 'registration' | 'donation';
  description: string;
  cause_id?: number;
  cause_title?: string;
  metadata?: any;
  created_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  currency: string;
  location_sharing: boolean;
  public_profile: boolean;
  marketing_emails: boolean;
  weekly_digest: boolean;
  cause_categories: string[];
  notification_frequency: 'immediate' | 'daily' | 'weekly';
}

interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  activities: UserActivity[];
  preferences: UserPreferences | null;
  loading: boolean;
  statsLoading: boolean;
  activitiesLoading: boolean;
  preferencesLoading: boolean;
  error: string | null;
  profilePictureUploading: boolean;
}

const initialState: UserState = {
  profile: null,
  stats: null,
  activities: [],
  preferences: null,
  loading: false,
  statsLoading: false,
  activitiesLoading: false,
  preferencesLoading: false,
  error: null,
  profilePictureUploading: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      return data.profile;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      
      const data = await response.json();
      return data.profile;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'user/uploadProfilePicture',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }
      
      const data = await response.json();
      return data.avatar_url;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      const data = await response.json();
      return data.stats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchUserActivities = createAsyncThunk(
  'user/fetchActivities',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/users/activities?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }
      const data = await response.json();
      return data.activities;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchUserPreferences = createAsyncThunk(
  'user/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences');
      }
      const data = await response.json();
      return data.preferences;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user preferences');
      }
      
      const data = await response.json();
      return data.preferences;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user account');
      }
      
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const enableTwoFactor = createAsyncThunk(
  'user/enableTwoFactor',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/2fa/enable', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to enable two-factor authentication');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const disableTwoFactor = createAsyncThunk(
  'user/disableTwoFactor',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to disable two-factor authentication');
      }
      
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.stats = null;
      state.activities = [];
      state.preferences = null;
    },
    updateLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addActivity: (state, action: PayloadAction<UserActivity>) => {
      state.activities.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Upload profile picture
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.profilePictureUploading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.profilePictureUploading = false;
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.profilePictureUploading = false;
        state.error = action.payload as string;
      })
      
    // Fetch stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch activities
    builder
      .addCase(fetchUserActivities.pending, (state) => {
        state.activitiesLoading = true;
        state.error = null;
      })
      .addCase(fetchUserActivities.fulfilled, (state, action) => {
        state.activitiesLoading = false;
        state.activities = action.payload;
      })
      .addCase(fetchUserActivities.rejected, (state, action) => {
        state.activitiesLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch preferences
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.error = action.payload as string;
      })
      
    // Update preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.error = action.payload as string;
      })
      
    // Two-factor authentication
    builder
      .addCase(enableTwoFactor.fulfilled, (state) => {
        if (state.profile) {
          state.profile.two_factor_enabled = true;
        }
      })
      .addCase(disableTwoFactor.fulfilled, (state) => {
        if (state.profile) {
          state.profile.two_factor_enabled = false;
        }
      });
  },
});

export const { clearError, clearUserData, updateLocalProfile, addActivity } = userSlice.actions;

// Selectors
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserStats = (state: RootState) => state.user.stats;
export const selectUserActivities = (state: RootState) => state.user.activities;
export const selectUserPreferences = (state: RootState) => state.user.preferences;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserStatsLoading = (state: RootState) => state.user.statsLoading;
export const selectUserActivitiesLoading = (state: RootState) => state.user.activitiesLoading;
export const selectUserPreferencesLoading = (state: RootState) => state.user.preferencesLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectProfilePictureUploading = (state: RootState) => state.user.profilePictureUploading;

export default userSlice.reducer;