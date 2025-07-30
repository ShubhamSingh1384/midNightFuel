import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [], // Store the list of products
    loading: false, // Track loading state
    error: null, // Track error state
  },
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.items = action.payload; // Update items with fetched products
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload; // Store the error
    },
  },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = productSlice.actions;

// ✅ Fetch products function (Get backendUrl inside fetchProducts)
export const fetchProducts = () => async (dispatch, getState) => {
  dispatch(fetchProductsStart()); // Set loading to true
  try {
    const backendUrl = getState().backendUrl.url; // ✅ Get backendUrl from Redux store
    const response = await axios.get(`${backendUrl}/api/seller/get-allproducts`);
    
    dispatch(fetchProductsSuccess(response.data)); // Dispatch success with data
  } catch (error) {
    console.log(error);
    dispatch(fetchProductsFailure(error.response?.data || 'Failed to fetch products')); // Dispatch failure with error
  }
};

export default productSlice.reducer;
