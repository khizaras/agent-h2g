import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface AdminStats {
  totalUsers: number;
  totalCauses: number;
  totalActivities: number;
  totalCategories: number;
  activeUsers: number;
  activeCauses: number;
  completedCauses: number;
  pendingCauses: number;
  recentSignups: number;
  monthlyGrowth: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
  total_causes: number;
  total_activities: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AdminCause {
  id: number;
  title: string;
  category: string;
  user_name: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  view_count: number;
  like_count: number;
  location: string;
}

export interface AdminAnalytics {
  userGrowth: Array<{ date: string; users: number; }>;
  causesByCategory: Array<{ category: string; count: number; }>;
  activityTrends: Array<{ date: string; activities: number; }>;
  popularLocations: Array<{ location: string; count: number; }>;
  engagementMetrics: {
    avgViewsPerCause: number;
    avgLikesPerCause: number;
    conversionRate: number;
    activeUserRate: number;
  };
}

interface AdminState {
  stats: AdminStats | null;
  users: AdminUser[];
  causes: AdminCause[];
  analytics: AdminAnalytics | null;
  loading: boolean;
  usersLoading: boolean;
  causesLoading: boolean;
  analyticsLoading: boolean;
  error: string | null;
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  selectedUserId: number | null;
  selectedCauseId: number | null;
}

const initialState: AdminState = {
  stats: null,
  users: [],
  causes: [],
  analytics: null,
  loading: false,
  usersLoading: false,
  causesLoading: false,
  analyticsLoading: false,
  error: null,
  selectedTimeRange: '30d',
  selectedUserId: null,
  selectedCauseId: null,
};

// Async thunks
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (timeRange: string = '30d', { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/stats?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      const data = await response.json();
      return data.stats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; search?: string; status?: string } = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);

      const response = await fetch(`/api/admin/users?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data.users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchAdminCauses = createAsyncThunk(
  'admin/fetchCauses',
  async (params: { page?: number; limit?: number; search?: string; status?: string; category?: string } = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);
      if (params.category) searchParams.append('category', params.category);

      const response = await fetch(`/api/admin/causes?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch causes');
      }
      const data = await response.json();
      return data.causes;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (timeRange: string = '30d', { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      return data.analytics;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }: { userId: number; status: 'active' | 'inactive' | 'suspended' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      const data = await response.json();
      return { userId, status };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateCauseStatus = createAsyncThunk(
  'admin/updateCauseStatus',
  async ({ causeId, status }: { causeId: number; status: 'pending' | 'active' | 'completed' | 'rejected' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/causes/${causeId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cause status');
      }
      
      return { causeId, status };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<'7d' | '30d' | '90d' | '1y'>) => {
      state.selectedTimeRange = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
    setSelectedCause: (state, action: PayloadAction<number | null>) => {
      state.selectedCauseId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      state.stats = null;
      state.users = [];
      state.causes = [];
      state.analytics = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch users
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch causes
    builder
      .addCase(fetchAdminCauses.pending, (state) => {
        state.causesLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCauses.fulfilled, (state, action) => {
        state.causesLoading = false;
        state.causes = action.payload;
      })
      .addCase(fetchAdminCauses.rejected, (state, action) => {
        state.causesLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch analytics
    builder
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload as string;
      })
      
    // Update user status
    builder
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const user = state.users.find(u => u.id === userId);
        if (user) {
          user.status = status;
        }
      })
      
    // Update cause status
    builder
      .addCase(updateCauseStatus.fulfilled, (state, action) => {
        const { causeId, status } = action.payload;
        const cause = state.causes.find(c => c.id === causeId);
        if (cause) {
          cause.status = status;
        }
      });
  },
});

export const { 
  setTimeRange, 
  setSelectedUser, 
  setSelectedCause, 
  clearError, 
  clearAdminData 
} = adminSlice.actions;

// Selectors
export const selectAdminStats = (state: RootState) => state.admin.stats;
export const selectAdminUsers = (state: RootState) => state.admin.users;
export const selectAdminCauses = (state: RootState) => state.admin.causes;
export const selectAdminAnalytics = (state: RootState) => state.admin.analytics;
export const selectAdminLoading = (state: RootState) => state.admin.loading;
export const selectAdminUsersLoading = (state: RootState) => state.admin.usersLoading;
export const selectAdminCausesLoading = (state: RootState) => state.admin.causesLoading;
export const selectAdminAnalyticsLoading = (state: RootState) => state.admin.analyticsLoading;
export const selectAdminError = (state: RootState) => state.admin.error;
export const selectAdminTimeRange = (state: RootState) => state.admin.selectedTimeRange;
export const selectSelectedUserId = (state: RootState) => state.admin.selectedUserId;
export const selectSelectedCauseId = (state: RootState) => state.admin.selectedCauseId;

export default adminSlice.reducer;