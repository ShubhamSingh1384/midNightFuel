import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOrders } from '../store/seller/productSlice';
import axios from 'axios';
const URL = import.meta.env.VITE_API_URL;

function Orders() {
  const [orderList, setOrderList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders()).then((data) => {
      if (data?.payload) {
        setOrderList(data?.payload.data || []);
      }
    });
  }, [dispatch]);

  const handleToggleStatus = async (orderId) => {
    try {
      const response = await axios.put(
        `${URL}/api/seller/update-order/${orderId}`,
        { orderStatus: true },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setOrderList(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, orderStatus: true } : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  const handleOpenModal = (orderId) => {
    setSelectedOrder(orderId);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (selectedOrder) {
      const order = orderList.find((order) => order._id === selectedOrder);
      if (order && !order.orderStatus) {
        handleToggleStatus(order._id);
      }
      setShowModal(false);
    }
  };

  return (
    <div className="p-4 mt-20 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Orders</h2>
      <div className="overflow-y-auto max-h-[80vh] pb-10">
        <ul className="space-y-6">
          {orderList.length > 0 ? (
            orderList.map((order) => (
              <li key={order._id} className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col md:flex-row justify-between items-center">
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Left: Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="text-lg font-semibold text-gray-800">Product: {order.productName}</div>
                    <div className="text-sm text-gray-600">Quantity: <span className="font-medium">{order.quantity}</span></div>
                    <div className="text-sm text-gray-600">Price: <span className="font-medium">₹{order.orderAmount}</span></div>
                    <div className="text-sm text-gray-600">Payment Mode: <span className="font-medium">{order.paymentMethod}</span></div>
                    <div className="text-sm text-gray-600">
                      Status:
                      <span className={order.orderStatus ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {order.orderStatus ? " Delivered" : " Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Right: User & Address Details */}
                  <div className="flex-1 space-y-2 md:text-left">
                    <div className="text-lg font-semibold text-gray-800">Customer: {order.address?.fullName || "N/A"}</div>
                    <div className="text-sm text-gray-600">User ID: {order.address?.uid || "N/A"}</div>
                    <div className="text-sm text-gray-600">Room No: {order.address?.roomNo || "N/A"}</div>
                    <div className="text-sm text-gray-600">
                      Address: <span className="font-medium">{order.address?.fullName || "N/A"}, Room {order.address?.roomNo || "N/A"}</span>
                    </div>
                  </div>

                  {/* Button: Aligned to the right */}
                  <div className="md:w-auto">
                    <button
                      className={`px-4 py-2 text-white rounded-md transition duration-300 ${order.orderStatus ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}`}
                      onClick={() => !order.orderStatus && handleOpenModal(order._id)}
                      disabled={order.orderStatus}
                    >
                      {order.orderStatus ? "Delivered" : "Deliver"}
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-600 text-center">No orders available.</li>
          )}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Action</h3>
            <p className="py-4">Are you sure you want to mark this order as Delivered?</p>
            <div className="modal-action">
              <button className="btn" onClick={handleConfirmAction}>Confirm</button>
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Orders;
