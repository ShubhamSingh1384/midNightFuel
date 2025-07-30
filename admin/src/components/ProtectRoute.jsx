import React from 'react'
import { Navigate, Outlet } from "react-router-dom";


const ProtectRoute = ()=>{
    const token = localStorage.getItem('adminToken');
    // console.log("protected Route ", token);
    if(!token){
        return <Navigate to="/login" replace={true} />
    }

    return <Outlet/>
}

export default ProtectRoute