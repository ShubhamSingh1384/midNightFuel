import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function OrderPlaced() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    uid: "",
    roomNo: "",
    paymentMode: "COD",
  });

  const [loading, setLoading] = useState(false);

  const cartData = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const backendUrl = useSelector((state) => state.backendUrl.url);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    let method = formData.paymentMode;
    console.log(method);
    
    switch (method.toLowerCase()) {
      case "cod":
        try {
          const response = await axios.post(
            `${backendUrl}/api/user/orderplaced`,
            { address: formData, cartData },
            { headers: { token: localStorage.getItem("token") } }
          );
    
          if (response.data.success) {
            toast.success("Order placed successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            setTimeout(() => navigate("/orders"), 3000);
          }
        } catch (error) {
          toast.error("Failed to place order. Please try again!", {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setLoading(false);
        }
        break;
    
      case "online":
        try {
          const stripeResponse = await axios.post(
            `${backendUrl}/api/user/orderplaced/online`,
            { address: formData, cartData },
            { headers: { token: localStorage.getItem("token") } }
          );
    
          if (stripeResponse.data.success && stripeResponse.data.session_url) {
            window.location.replace(stripeResponse.data.session_url);
          } else {
            toast.error(stripeResponse.data.message || "Stripe session failed", {
              position: "top-right",
            });
          }
        } catch (err) {
          toast.error(err.message, {
            position: "top-right",
          });
          console.error(err);
        } finally {
          setLoading(false);
        }
        break;
    
      default:
        toast.error("Invalid payment method selected.");
        setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Place Your Order
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Left - Address Form */}
          <div className="bg-white rounded-xl p-8 shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Address Details</h2>

            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">UID</label>
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                placeholder="Enter UID"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Room Number</label>
              <input
                type="text"
                name="roomNo"
                value={formData.roomNo}
                onChange={handleChange}
                placeholder="Enter Room Number"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="bg-white rounded-xl p-8 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <p className="text-lg mb-4 text-gray-600">Total Amount</p>
              <p className="text-5xl font-bold text-green-600 mb-8">
                ₹{totalAmount}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                </Box>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default OrderPlaced;
