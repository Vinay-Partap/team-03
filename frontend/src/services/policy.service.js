import API from "./api";

const policyService = {
  // Policies API
  getPolicies: async (params) => {
    const response = await API.get("/policies", { params });
    return response.data;
  },

  getPolicyById: async (id) => {
    const response = await API.get(`/policies/${id}`);
    return response.data;
  },

  createPolicy: async (data) => {
    const response = await API.post("/policies", data);
    return response.data;
  },

  updatePolicy: async (id, data) => {
    const response = await API.put(`/policies/${id}`, data);
    return response.data;
  },

  deletePolicy: async (id) => {
    const response = await API.delete(`/policies/${id}`);
    return response.data;
  },

  submitPolicyApproval: async (id) => {
    const response = await API.put(`/policies/${id}/submit`);
    return response.data;
  },

  approvePolicy: async (id) => {
    const response = await API.put(`/policies/${id}/approve`);
    return response.data;
  },

  rejectPolicy: async (id) => {
    const response = await API.put(`/policies/${id}/reject`);
    return response.data;
  },

  archivePolicy: async (id) => {
    const response = await API.put(`/policies/${id}/archive`);
    return response.data;
  },

  // Schemes API
  getSchemes: async (params) => {
    const response = await API.get("/schemes", { params });
    return response.data;
  },

  getSchemeById: async (id) => {
    const response = await API.get(`/schemes/${id}`);
    return response.data;
  },

  createScheme: async (data) => {
    const response = await API.post("/schemes", data);
    return response.data;
  },

  updateScheme: async (id, data) => {
    const response = await API.put(`/schemes/${id}`, data);
    return response.data;
  },

  deleteScheme: async (id) => {
    const response = await API.delete(`/schemes/${id}`);
    return response.data;
  },

  submitSchemeApproval: async (id) => {
    const response = await API.put(`/schemes/${id}/submit`);
    return response.data;
  },

  approveScheme: async (id) => {
    const response = await API.put(`/schemes/${id}/approve`);
    return response.data;
  },

  rejectScheme: async (id) => {
    const response = await API.put(`/schemes/${id}/reject`);
    return response.data;
  },

  archiveScheme: async (id) => {
    const response = await API.put(`/schemes/${id}/archive`);
    return response.data;
  },

  addSchemeUpdate: async (id, content) => {
    const response = await API.post(`/schemes/${id}/updates`, { content });
    return response.data;
  },

  // Eligibility Checker
  checkEligibility: async (profile) => {
    const response = await API.post("/eligibility/check", profile);
    return response.data;
  },

  checkMyEligibility: async () => {
    const response = await API.get("/eligibility/check-my");
    return response.data;
  },
};

export default policyService;
