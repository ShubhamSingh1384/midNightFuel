import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const ProtectRoutes = () => {
  // Get the token from cookies
  // const token = getCookie("authToken");
  const token = localStorage.getItem('authToken')
  const authGoogleToken = localStorage.getItem('authGoogleToken')
  // console.log("private route" , token);
  // console.log("private google route" , authGoogleToken);

  if (!token && !authGoogleToken) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
