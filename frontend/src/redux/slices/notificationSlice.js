import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user.service";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const data = await userService.getNotifications();
      return data.notifications;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, thunkAPI) => {
    try {
      await userService.markNotificationRead(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update notification");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk("notifications/readAll", async (_, api) => { await userService.markAllNotificationsRead(); return null; });
export const deleteNotification = createAsyncThunk("notifications/delete", async (id) => { await userService.deleteNotification(id); return id; });

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => { state.notifications.forEach((n) => { n.read = true; }); })
      .addCase(deleteNotification.fulfilled, (state, action) => { state.notifications = state.notifications.filter((n) => n._id !== action.payload); })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n._id === action.payload ? { ...n, read: true } : n
        );
      });
  },
});

export default notificationSlice.reducer;
