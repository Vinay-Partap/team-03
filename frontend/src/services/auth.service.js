import API from "./api";

const authService = {
  login: async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    if (response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) sessionStorage.setItem("refreshToken", response.data.refreshToken);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    if (response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) sessionStorage.setItem("refreshToken", response.data.refreshToken);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    try { if (refreshToken) await API.post("/auth/logout", { refreshToken }); } finally { sessionStorage.removeItem("token"); sessionStorage.removeItem("refreshToken"); sessionStorage.removeItem("user"); }
  },

  logoutAllDevices: async () => {
    await API.post("/auth/logout-all");
    sessionStorage.removeItem("token"); sessionStorage.removeItem("refreshToken"); sessionStorage.removeItem("user");
  },

  getSessions: async () => (await API.get("/auth/sessions")).data,

  getProfile: async () => {
    const response = await API.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put("/auth/profile", profileData);
    if (response.data.user) {
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  loginWithAuth0: async (idToken, role = "citizen") => {
    const response = await API.post("/auth/oauth/auth0", { idToken, role });
    if (response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) sessionStorage.setItem("refreshToken", response.data.refreshToken);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await API.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },
};

export default authService;
