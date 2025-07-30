import { createSlice } from "@reduxjs/toolkit";
const apiUrl = import.meta.env.VITE_API_URL;
// const apiUrl = "http://localhost:4000";

const backendUrlSlice = createSlice({
  name: "backendUrl",
  initialState: { url: apiUrl }, // ✅ Wrap in an object
  reducers: {}
}); 

// Export the reducer to be used in the store
export default backendUrlSlice.reducer;
