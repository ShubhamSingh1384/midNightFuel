import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./admin/authSlice";
import controlSlice from './admin/controlSlice'

export const store = configureStore({
    reducer :{
        auth : authSlice,
        control : controlSlice
    }
})
