import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setToken } from "../store/store";
import { toast } from "react-toastify";
import { uploadCartItems } from "../Slice/CartItemSlice";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backendUrl = useSelector((state) => state.backendUrl.url);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();



  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(email,password);
    try {
      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });
      // console.log(response.data);
      if (response.data.success) {
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", response.data.token);

        dispatch(uploadCartItems(response.data.data.cart));
        // console.log(token,"e");
        toast.success("Login SuccessFully!");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-700">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-500 bg-slate-600 text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-500 bg-slate-600 text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
