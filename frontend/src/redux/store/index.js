import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import causesReducer from "../slices/causesSlice";
import contributionsReducer from "../slices/contributionsSlice";
import feedbackReducer from "../slices/feedbackSlice";
import notificationsReducer from "../slices/notificationsSlice";
import userReducer from "../slices/userSlice";
import alertsReducer from "../slices/alertsSlice";
import adminReducer from "../slices/adminSlice";
import categoriesReducer from "../slices/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    causes: causesReducer,
    contributions: contributionsReducer,
    feedback: feedbackReducer,
    notifications: notificationsReducer,
    user: userReducer,
    alerts: alertsReducer,
    admin: adminReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});
