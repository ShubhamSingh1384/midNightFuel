import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = import.meta.env.VITE_API_URL;

const initialState = {
  sellers: [],
  users: [],
};

// Utility function to handle unauthorized access
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


// Thunks
export const getUser = createAsyncThunk("admin/getUser", async (_, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/get-users`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const getSeller = createAsyncThunk("admin/getSeller", async (_, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/get-sellers`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const getNewRequest = createAsyncThunk("admin/getNewRequest", async (_, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/get-newRequest`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const verifySeller = createAsyncThunk("admin/verifySeller", async (sellerId, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/verify-seller/${sellerId}`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const deleteSeller = createAsyncThunk("admin/deleteSeller", async (sellerId, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/delete-seller/${sellerId}`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/delete-user/${userId}`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const rejectSeller = createAsyncThunk("admin/rejectSeller", async (sellerId, thunkAPI) => {
  try {
    const response = await axios.post(
      `${URL}/api/admin/reject-seller/${sellerId}`,
      {},
      {
        headers: {
          adminToken: localStorage.getItem("adminToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    handleUnauthorized(error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

// Slice
const controlSlice = createSlice({
  name: "controlSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.users = [];
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.users = action.payload?.data || [];
      })
      .addCase(getUser.rejected, (state) => {
        state.users = [];
      })
      .addCase(getSeller.pending, (state) => {
        state.sellers = [];
      })
      .addCase(getSeller.fulfilled, (state, action) => {
        state.sellers = action.payload?.data || [];
      })
      .addCase(getSeller.rejected, (state) => {
        state.sellers = [];
      });

    // You can add more .addCase for other async thunks as needed
  },
});

export default controlSlice.reducer;
