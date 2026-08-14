import API from "./api";

const userService = {
  // Admin User CRUD
  getAllUsers: async () => {
    const response = await API.get("/users");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await API.put("/users/role", { userId, role });
    return response.data;
  },

  getAccountStatusHistory: async (id) => (await API.get(`/users/${id}/status-history`)).data,

  updateAccountStatus: async (id, status, reason = "") => (await API.patch(`/users/${id}/status`, { status, reason })).data,

  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },

  // Saved Bookmarks
  savePolicy: async (policyId) => {
    const response = await API.post("/users/save-policy", { policyId });
    return response.data;
  },

  unsavePolicy: async (policyId) => {
    const response = await API.post("/users/unsave-policy", { policyId });
    return response.data;
  },

  saveScheme: async (schemeId) => {
    const response = await API.post("/users/save-scheme", { schemeId });
    return response.data;
  },

  unsaveScheme: async (schemeId) => {
    const response = await API.post("/users/unsave-scheme", { schemeId });
    return response.data;
  },

  getSavedItems: async () => {
    const response = await API.get("/users/saved");
    return response.data;
  },

  // Search History
  getSearchHistory: async () => {
    const response = await API.get("/users/search-history");
    return response.data;
  },

  addSearchQuery: async (query) => {
    const response = await API.post("/users/search-history", { query });
    return response.data;
  },

  clearSearchHistory: async () => {
    const response = await API.delete("/users/search-history");
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await API.get("/notifications");
    return response.data;
  },

  markAllNotificationsRead: async () => (await API.put("/notifications/read-all")).data,

  deleteNotification: async (id) => (await API.delete(`/notifications/${id}`)).data,

  markNotificationRead: async (id) => {
    const response = await API.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Feedback & Helpdesk
  submitFeedback: async (feedbackData) => {
    const response = await API.post("/feedback", feedbackData);
    return response.data;
  },

  getFeedbacks: async () => {
    const response = await API.get("/feedback");
    return response.data;
  },

  getSupportAssignees: async () => (await API.get("/feedback/assignees")).data,
  updateTicket: async (id, data) => (await API.put(`/feedback/${id}`, data)).data,
  addTicketReply: async (id, data) => (await API.post(`/feedback/${id}/replies`, data)).data,
  getTicketReplies: async (id) => (await API.get(`/feedback/${id}/replies`)).data,

  resolveFeedback: async (id) => {
    const response = await API.put(`/feedback/${id}/resolve`);
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async () => {
    const response = await API.get("/audit-logs");
    return response.data;
  },

  // Dashboard Data
  getCitizenDashboard: async () => {
    const response = await API.get("/dashboard/citizen");
    return response.data;
  },

  getGovernmentDashboard: async () => {
    const response = await API.get("/dashboard/government");
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await API.get("/dashboard/admin");
    return response.data;
  },

  // Reports
  getReportsAnalytics: async () => {
    const response = await API.get("/reports/analytics");
    return response.data;
  },
};

export default userService;
