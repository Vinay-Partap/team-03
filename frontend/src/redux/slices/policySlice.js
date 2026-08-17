import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import policyService from "../../services/policy.service";

const initialState = {
  policies: [],
  schemes: [],
  currentPolicy: null,
  currentScheme: null,
  matchedSchemes: [],
  loading: false,
  error: null,
};

export const fetchPolicies = createAsyncThunk(
  "policy/fetchPolicies",
  async (params, thunkAPI) => {
    try {
      const data = await policyService.getPolicies(params);
      return data.policies;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load policies");
    }
  }
);

export const fetchPolicyDetails = createAsyncThunk(
  "policy/fetchPolicyDetails",
  async (id, thunkAPI) => {
    try {
      const data = await policyService.getPolicyById(id);
      return data.policy;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load policy details");
    }
  }
);

export const createNewPolicy = createAsyncThunk(
  "policy/createPolicy",
  async (policyData, thunkAPI) => {
    try {
      const data = await policyService.createPolicy(policyData);
      return data.policy;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create policy");
    }
  }
);

export const updatePolicyDetails = createAsyncThunk(
  "policy/updatePolicy",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await policyService.updatePolicy(id, data);
      return res.policy;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update policy");
    }
  }
);

export const deletePolicy = createAsyncThunk(
  "policy/deletePolicy",
  async (id, thunkAPI) => {
    try {
      await policyService.deletePolicy(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete policy");
    }
  }
);

export const fetchSchemes = createAsyncThunk(
  "policy/fetchSchemes",
  async (params, thunkAPI) => {
    try {
      const data = await policyService.getSchemes(params);
      return data.schemes;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load schemes");
    }
  }
);

export const fetchSchemeDetails = createAsyncThunk(
  "policy/fetchSchemeDetails",
  async (id, thunkAPI) => {
    try {
      const data = await policyService.getSchemeById(id);
      return data.scheme;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load scheme details");
    }
  }
);

export const createNewScheme = createAsyncThunk(
  "policy/createScheme",
  async (schemeData, thunkAPI) => {
    try {
      const data = await policyService.createScheme(schemeData);
      return data.scheme;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create scheme");
    }
  }
);

export const updateSchemeDetails = createAsyncThunk(
  "policy/updateScheme",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await policyService.updateScheme(id, data);
      return res.scheme;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update scheme");
    }
  }
);

export const deleteScheme = createAsyncThunk(
  "policy/deleteScheme",
  async (id, thunkAPI) => {
    try {
      await policyService.deleteScheme(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete scheme");
    }
  }
);

export const checkMyEligibility = createAsyncThunk(
  "policy/checkMyEligibility",
  async (_, thunkAPI) => {
    try {
      const data = await policyService.checkMyEligibility();
      return data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to check eligibility");
    }
  }
);

const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {
    clearCurrents: (state) => {
      state.currentPolicy = null;
      state.currentScheme = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPolicyDetails.fulfilled, (state, action) => {
        state.currentPolicy = action.payload;
      })
      // Schemes
      .addCase(fetchSchemes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSchemeDetails.fulfilled, (state, action) => {
        state.currentScheme = action.payload;
      })
      // Eligibility Matching
      .addCase(checkMyEligibility.fulfilled, (state, action) => {
        state.matchedSchemes = action.payload;
      })
      // Add deletes local updates
      .addCase(deletePolicy.fulfilled, (state, action) => {
        state.policies = state.policies.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteScheme.fulfilled, (state, action) => {
        state.schemes = state.schemes.filter((s) => s._id !== action.payload);
      });
  },
});

export const { clearCurrents } = policySlice.actions;
export default policySlice.reducer;
