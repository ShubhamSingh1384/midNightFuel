import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/seller/authSlice";
import { toast } from "react-toastify";
import { FiMenu } from "react-icons/fi"; // Importing a menu icon

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  // const sellerDetails = useSelector((state)=> state.seller.user);
  // console.log("SEllerDetails" , sellerDetails);
  const handleLogout = () => {
    dispatch(logoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload.message);
        localStorage.removeItem('authToken');
        navigate("/auth");
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };

  const handleContact = () =>{
    navigate('/seller/contact')
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 w-3/4 md:w-1/4 bg-gray-800 text-white p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <h2
        className="text-2xl font-bold mb-6 mt-10 cursor-pointer">Dashboard</h2>

        {/* Navigation */}
        <div className="flex flex-col space-y-4">
          <NavLink
            to="addproduct"
            className={({ isActive }) =>
              `px-4 py-2 rounded text-left font-semibold ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
              }`
            }
          >
            Add Product
          </NavLink>
          <NavLink
            to="listitems"
            className={({ isActive }) =>
              `px-4 py-2 rounded text-left font-semibold ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
              }`
            }
          >
            List Items
          </NavLink>
          <NavLink
            to="/seller/orders"
            className={({ isActive }) =>
              `px-4 py-2 rounded text-left font-semibold ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
              }`
            }
          >
            Orders
          </NavLink>
          <button
          onClick={handleContact}
          className="px-4 py-2 rounded text-left font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
          >
            Contact Us
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded text-left font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Menu Button for Small Screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded focus:outline-none"
      >
        <FiMenu size={24} />
      </button>

      {/* Main Content */}
      <main className="w-full md:w-3/4 bg-gray-100 overflow-hidden ml-0 md:ml-auto">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </React.Suspense>
      </main>

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
        ></div>
      )}
    </div>
  );
}

export default SellerDashboard;
