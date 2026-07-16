import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import policyReducer from "./slices/policySlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    policy: policyReducer,
    notifications: notificationReducer,
  },
});

export default store;
