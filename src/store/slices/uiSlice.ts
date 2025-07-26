import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface UIState {
  theme: 'light' | 'dark' | 'auto';
  sidebarCollapsed: boolean;
  loading: {
    [key: string]: boolean;
  };
  modal: ModalState;
  toasts: ToastState[];
  notifications: {
    isOpen: boolean;
    unreadCount: number;
  };
  search: {
    isOpen: boolean;
    query: string;
    results: any[];
    isLoading: boolean;
  };
  layout: {
    headerHeight: number;
    sidebarWidth: number;
    contentPadding: number;
  };
  viewport: {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  preferences: {
    animations: boolean;
    soundEffects: boolean;
    reducedMotion: boolean;
    language: string;
    timezone: string;
  };
}

const initialState: UIState = {
  theme: 'light',
  sidebarCollapsed: false,
  loading: {},
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  toasts: [],
  notifications: {
    isOpen: false,
    unreadCount: 0,
  },
  search: {
    isOpen: false,
    query: '',
    results: [],
    isLoading: false,
  },
  layout: {
    headerHeight: 64,
    sidebarWidth: 256,
    contentPadding: 24,
  },
  viewport: {
    width: 1920,
    height: 1080,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  },
  preferences: {
    animations: true,
    soundEffects: false,
    reducedMotion: false,
    language: 'en',
    timezone: 'UTC',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Sidebar actions
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.loading[key] = isLoading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    clearAllLoading: (state) => {
      state.loading = {};
    },

    // Modal actions
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    updateModalData: (state, action: PayloadAction<any>) => {
      state.modal.data = action.payload;
    },

    // Toast actions
    addToast: (state, action: PayloadAction<Omit<ToastState, 'id'>>) => {
      const toast: ToastState = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },

    // Notification actions
    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.notifications.isOpen = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.notifications.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.notifications.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      if (state.notifications.unreadCount > 0) {
        state.notifications.unreadCount -= 1;
      }
    },

    // Search actions
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.search.isOpen = action.payload;
      if (!action.payload) {
        state.search.query = '';
        state.search.results = [];
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.search.results = action.payload;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.search.isLoading = action.payload;
    },

    // Layout actions
    setLayoutDimensions: (state, action: PayloadAction<Partial<UIState['layout']>>) => {
      state.layout = { ...state.layout, ...action.payload };
    },

    // Viewport actions
    setViewportDimensions: (state, action: PayloadAction<{ width: number; height: number }>) => {
      const { width, height } = action.payload;
      state.viewport = {
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      };
    },

    // Preferences actions
    setPreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    toggleAnimations: (state) => {
      state.preferences.animations = !state.preferences.animations;
    },
    toggleSoundEffects: (state) => {
      state.preferences.soundEffects = !state.preferences.soundEffects;
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.preferences.reducedMotion = action.payload;
    },

    // Utility actions
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme,
        preferences: state.preferences,
      };
    },
  },
});

export const {
  // Theme
  setTheme,
  toggleTheme,
  
  // Sidebar
  setSidebarCollapsed,
  toggleSidebar,
  
  // Loading
  setLoading,
  clearLoading,
  clearAllLoading,
  
  // Modal
  openModal,
  closeModal,
  updateModalData,
  
  // Toast
  addToast,
  removeToast,
  clearAllToasts,
  
  // Notifications
  setNotificationsOpen,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  
  // Search
  setSearchOpen,
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  
  // Layout
  setLayoutDimensions,
  
  // Viewport
  setViewportDimensions,
  
  // Preferences
  setPreferences,
  toggleAnimations,
  toggleSoundEffects,
  setReducedMotion,
  
  // Utility
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectModal = (state: { ui: UIState }) => state.ui.modal;
export const selectToasts = (state: { ui: UIState }) => state.ui.toasts;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectSearch = (state: { ui: UIState }) => state.ui.search;
export const selectLayout = (state: { ui: UIState }) => state.ui.layout;
export const selectViewport = (state: { ui: UIState }) => state.ui.viewport;
export const selectPreferences = (state: { ui: UIState }) => state.ui.preferences;

// Computed selectors
export const selectIsLoading = (key: string) => (state: { ui: UIState }) => 
  state.ui.loading[key] || false;

export const selectHasUnreadNotifications = (state: { ui: UIState }) => 
  state.ui.notifications.unreadCount > 0;

export const selectIsModalOpen = (type?: string) => (state: { ui: UIState }) => {
  if (type) {
    return state.ui.modal.isOpen && state.ui.modal.type === type;
  }
  return state.ui.modal.isOpen;
};

export const selectShouldReduceMotion = (state: { ui: UIState }) => 
  state.ui.preferences.reducedMotion;

export const selectIsMobile = (state: { ui: UIState }) => 
  state.ui.viewport.isMobile;

export const selectIsTablet = (state: { ui: UIState }) => 
  state.ui.viewport.isTablet;

export const selectIsDesktop = (state: { ui: UIState }) => 
  state.ui.viewport.isDesktop;