import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../store/admin/authSlice";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthentication } = useSelector((state) => state.auth);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    try {
      // dispatch(logoutAdmin());
      setTimeout(() => {
        toast.success("Admin successfully logged out");
        localStorage.removeItem('adminToken');
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  // ✅ Redirect if not authenticated (Fixes warning)
  // useEffect(() => {
  //   if (!isAuthentication) {
  //     navigate("/login");
  //   }
  // }, [isAuthentication]); // Runs only when authentication state changes

  return (
    <div className="flex h-screen font-sans">
      {/* Hamburger Menu for Small Devices */}
      <button
        className="bg-gray-800 text-white p-2 fixed top-4 left-4 z-50 sm:hidden"
        onClick={toggleMobileMenu}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } sm:block bg-gray-800 text-white w-64 h-full fixed sm:relative z-40`}
      >
        <ul className="mt-4 space-y-2">
          <li
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          >
            Dashboard
          </li>
          <li
            onClick={() => navigate("/admin/seller")}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          >
            Seller
          </li>
          <li
            onClick={() => navigate("/admin/user")}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          >
            User
          </li>
          <li
            onClick={() => navigate("/admin/new-request")}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          >
            New Request
          </li>
          <li
            onClick={handleLogout}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded"
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 mt-10 sm:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
