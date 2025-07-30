import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem('adminToken');
    // console.log("publicRoute is " , token);
    if (token) {
        return <Navigate to='/admin/dashboard' />
    }
  
    return <Outlet/>
}

export default PublicRoute