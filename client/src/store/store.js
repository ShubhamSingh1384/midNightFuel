import { configureStore, createSlice } from "@reduxjs/toolkit";
import productReducer from "../Slice/ProductSlice.js";
import cartReducer from "../Slice/CartItemSlice.js";
import setBackendUrl from "../Slice/backendUrlSlice.js";



const tokenSlice = createSlice({
  name: "token",
  initialState:'', // Default token value
  reducers: {
    setToken: (state, action) => action.payload, // Update token state with the new value
  },
});

export const store = configureStore({
  reducer: {
    products: productReducer, // Register the products reducer
    cart: cartReducer,
    backendUrl: setBackendUrl,
    token: tokenSlice.reducer
  },
});

export const { setToken } = tokenSlice.actions;
