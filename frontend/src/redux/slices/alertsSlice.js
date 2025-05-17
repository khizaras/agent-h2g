import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: [],
};

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      const id = Date.now();
      state.alerts.push({
        id,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { setAlert, removeAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
