import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Orders() {
  const backendUrl = useSelector((state) => state.backendUrl.url);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Optional: in case it's not set earlier
        const response = await axios.get(`${backendUrl}/api/user/orders`, {
          headers: { token: localStorage.getItem("token") },
        });
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders.reverse());
        } else {
          setError("No orders found");
        }
      } catch (error) {
        setError("Failed to fetch orders. Please try again.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrders();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Box sx={{ display: "flex" }}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      </div>
    );
  }

  return (
    <div  className="min-h-screen bg-gradient-to-br  from-gray-900 to-gray-800 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Your Orders
        </h1>

        {error ? (
          <p className="text-center text-red-400 text-lg">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            You have no orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg text-white"
              >
                <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
                  <span className="text-sm">Order ID: {order._id}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus
                        ? "bg-green-500"
                        : "bg-yellow-400 text-gray-900"
                    }`}
                  >
                    {order.orderStatus ? "Order Received" : "Order Placed"}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {order.address.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">UID:</span>{" "}
                      {order.address.uid}
                    </p>
                    <p>
                      <span className="font-semibold">Room No:</span>{" "}
                      {order.address.roomNo}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">Product:</span>{" "}
                      {order.productName}
                    </p>
                    <p>
                      <span className="font-semibold">Quantity:</span>{" "}
                      {order.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Amount:</span> ₹
                      {order.orderAmount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-300">
                  Payment Mode: {order.address.paymentMode}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
