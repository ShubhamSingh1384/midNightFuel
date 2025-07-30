import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../store/admin/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for form values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin(formData))
      .then((data) => {
        if (data?.payload?.success) {
          console.log("login is ", data.payload.success);
          localStorage.setItem('adminToken', data.payload.token);
          toast.success(data.payload.message)
          navigate("/admin/dashboard");
        } else {
          toast.error(data?.payload?.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Invalid credentials");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-center">Admin Login</h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          Enter your credentials to continue.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your Email"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your Password"
              className="mt-1 w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
