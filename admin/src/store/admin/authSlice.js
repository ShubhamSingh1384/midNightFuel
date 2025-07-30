import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const handleUnauthorized = (error) => {
  const message = error?.response?.data?.message?.toLowerCase?.() || "";
  if (
    message.includes("unauthorized") ||
    message.includes("unauthorised") ||
    message.includes("expired")
  ) {
    localStorage.removeItem("adminToken");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login"; // 
    }
  }
};

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
};

export const loginAdmin = createAsyncThunk(
  "/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${URL}/api/admin/login`,
        formData,
        { withCredentials: true }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isAuthenticated = false;
        state.isLoading = true;
        state.user = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        handleUnauthorized(action);
      });
  },
});

export const { logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
