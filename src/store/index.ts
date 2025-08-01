import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Create noop storage for SSR compatibility
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use web storage if available, otherwise use noop storage
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Import slices
import authSlice from "./slices/authSlice";
import causesSlice from "./slices/causesSlice";
import categoriesSlice from "./slices/categoriesSlice";
import adminSlice from "./slices/adminSlice";
import notificationsSlice from "./slices/notificationsSlice";
import uiSlice from "./slices/uiSlice";
import chatbotSlice from "./slices/chatbotSlice";
import userSlice from "./slices/userSlice";

// Persist configuration
const persistConfig = {
  key: "hands2gether",
  storage,
  whitelist: ["auth", "ui"], // Only persist auth and UI state
  blacklist: ["causes", "admin", "notifications"], // Don't persist these (refetch on reload)
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  causes: causesSlice,
  categories: categoriesSlice,
  admin: adminSlice,
  notifications: notificationsSlice,
  ui: uiSlice,
  chatbot: chatbotSlice,
  user: userSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register", "rehydrate"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
