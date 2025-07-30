import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// let URL = "https://midnight-fuel.onrender.com";
// let URL = "http://localhost:4000";
const URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
};

export const googleVerification = createAsyncThunk(
  'auth/googleVerification',
  async()=>{
    const response = await axios.post(`${URL}/api/seller/google-verification`,
      {},
      {withCredentials:true}
    )
    console.log("response data ", response.data);
    return response.data;
  }
  // async (_, thunkAPI) => {
  //   try {
  //     const response = await axios.post(
  //       `${URL}/api/seller/google-verification`,{},
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     console.log("response data", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Google verification failed:", error);
  //     return thunkAPI.rejectWithValue(
  //       error.response?.data || { message: 'Something went wrong' }
  //     );
  //   }
  // }
);

export const registerUser = createAsyncThunk(
  "/generateOTP/register/user",
  async (formData) => {
    try {

      // console.log(formData);
      const response = await axios.post(
        `${URL}/api/seller/generate-otp`,
        formData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const verifyWithOTP = createAsyncThunk("/verify-register/user",
  async ({ formData, otp }) => {
    console.log("form AuthSlice ", formData);
    console.log("otp is ", otp);
    try {
      const response = await axios.post(`${URL}/api/seller/signup`, { formData, otp },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
)


export const loginUser = createAsyncThunk("/login/seller", async (formData) => {
  try {
    // console.log(formData, "s");
    const response = await axios.post(
      `${URL}/api/seller/login`,
      formData,
      { withCredentials: true }
    );

    //console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("ERROR", error);
  }
});

export const logoutUser = createAsyncThunk("/logout/seller", async () => {
  const response = await axios.get(`${URL}/api/seller/logout`);

  return response.data;
});

export const resetPassword = createAsyncThunk(
  "/resetPassword",
  async (formData) => {
    const response = await axios.post(
      `${URL}/api/seller/reset-password`,
      formData
    );

    return response?.data;
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyWithOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyWithOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(verifyWithOTP.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
    // .addCase(googleVerification.pending, (state)=>{
    //   state.isLoading = true;
    // })
  },
});

export default authSlice.reducer;
