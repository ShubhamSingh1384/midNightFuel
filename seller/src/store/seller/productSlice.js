import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  productsList: [],
  ordersList: [],
};

// ✅ Centralized unauthorized error handler
const handleUnauthorized = (action) => {
    const rawMessage = action?.payload?.message;
    const message = typeof rawMessage === "string" ? rawMessage.toLowerCase() : "";
    // typeof rawMessage === "string" ? rawMessage.toLowerCase() : "";
  if (
    message?.includes("unauthorized") ||
    message?.includes("unauthorised") ||
    message?.includes("expired")
  ) {
    if (!window.location.pathname.includes("/auth")) {
      localStorage.removeItem("authToken");
      window.location.href = "/auth";
      setTimeout(() => {
      }, 100);
    }
  }
};

// ✅ Fetch all seller products
export const fetchProduct = createAsyncThunk(
  "/get-product",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}/api/seller/get-products`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Fetch product failed" }
      );
    }
  }
);

// ✅ Add new product
export const addProduct = createAsyncThunk(
  "/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/api/seller/add`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Add product failed" }
      );
    }
  }
);

// ✅ Edit product
export const editProduct = createAsyncThunk(
  "/edit-product",
  async ({ formData, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${URL}/api/seller/${productId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Edit product failed" }
      );
    }
  }
);

// ✅ Update product (price & quantity)
export const updateProduct = createAsyncThunk(
  "/update-product",
  async ({ productId, price, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${URL}/api/seller/edit/${productId}`, {
        price,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Update product failed" }
      );
    }
  }
);

// ✅ Delete product
export const deleteProduct = createAsyncThunk(
  "/delete-product",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${URL}/api/seller/delete/${productId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Delete product failed" }
      );
    }
  }
);

// ✅ Fetch all orders
export const fetchOrders = createAsyncThunk(
  "/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}/api/seller/get-orders`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Fetch orders failed" }
      );
    }
  }
);

// ✅ Slice
const sellerProductSlice = createSlice({
  name: "sellerProductSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsList = action.payload.data;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        handleUnauthorized(action);
        state.productsList = [];
      })

      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsList = action.payload.data;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        handleUnauthorized(action);
        state.productsList = [];
      })

      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersList = action.payload.data;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        handleUnauthorized(action);
        state.ordersList = [];
      })

      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsList = state.productsList.filter(
          (product) => product.id !== action.payload.id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        handleUnauthorized(action);
      });
  },
});

export default sellerProductSlice.reducer;
