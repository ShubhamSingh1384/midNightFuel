import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
    const token = localStorage.getItem('authToken');
    const authGoogleToken = localStorage.getItem('authGoogleToken');
    if (token) {
        return <Navigate to='/seller/listitems' />
    }
  
    return <Outlet/>
}

export default PublicRoutes