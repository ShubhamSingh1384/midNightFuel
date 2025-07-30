import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeCartItmes,
  updateCartItmes,
  uploadCartItems,
  updateTotalAmount,
} from "../Slice/CartItemSlice";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchProducts } from "../Slice/ProductSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Title } from "./Title";
import { toast } from "react-toastify";
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartData = useSelector((state) => state.cart.cartItems || []);
  const products = useSelector((state) => state.products.items?.data || []);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const backendUrl = useSelector((state) => state.backendUrl.url);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const fetchProduct = async () => {
    await dispatch(fetchProducts());
  };

  const FetchCartItems = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/user/getUserCart`,
        { headers: { token } }
      );
      

      if (response.data.success) {
        dispatch(uploadCartItems(response.data.cartData));
      } else {
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
    FetchCartItems();
  }, []);

  useEffect(() => {
    if (!products.length || !cartData.length) return;

    const updatedCartItems = [];
    let tempAmount = 0;

    cartData.forEach((item) => {
      const product = products.find((p) => p._id === item.id);
      if (product) {
        updatedCartItems.push(product);
        tempAmount += product.price * item.quantity;
      }
    });

    setCartItems(updatedCartItems);
    dispatch(updateTotalAmount(tempAmount));
  }, [cartData, products]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/user/updateCartItems`,
          { productId, quantity: newQuantity },
          { headers: { token: getToken() } }
        );
      
        if (response.data.success) {
          dispatch(updateCartItmes({ id: productId, quantity: newQuantity }));
        }
      } catch (err) {
        console.error(err);
        const errorMessage =
          err?.response?.data?.message || "Something went wrong";
        toast.error(errorMessage); // Or use alert(errorMessage)
      }
      
    }
  };

  const incrementQuantity = (productId, currentQuantity) => {
    handleQuantityChange(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(productId, currentQuantity - 1);
    }
  };

  const deleteItems = async (productId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/removeCartItems`,
        {
          headers: { token: getToken() },
          data: { productId }, // `data` must be in this format for DELETE
        }
      );      
      if (response.data.success) {
        dispatch(removeCartItmes(productId));
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black">
      {" "}
      {/* Global background applied here */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center text-2xl items-center w-full ">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>
        {cartItems.length === 0 ? (
          <p className="text-lg text-gray-400">Your cart is empty!</p>
        ) : (
          <ul className="space-y-6">
            {cartData.map((item) => {
              const productData = products.find(
                (product) => product._id === item.id
              );
              if (!productData) return null;

              return (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-200 shadow-lg rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold">
                        {productData.productName}
                      </span>
                      <span className="text-sm text-gray-800">
                        Price: ₹{productData.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <button
                      onClick={() => decrementQuantity(item.id, item.quantity)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-16 p-2 border border-gray-200 bg-gray-200 text-gray-800 rounded-md text-center"
                    />
                    <button
                      onClick={() => incrementQuantity(item.id, item.quantity)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <span className="text-lg font-semibold">
                      {item.quantity} x ₹{productData.price}
                    </span>
                    <button
                      className="text-red-400 hover:text-red-600 text-sm font-semibold"
                      onClick={() => deleteItems(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {cartItems.length > 0 && (
          <div className="mt-8 bg-gray-200 p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center">
            <span className="text-xl font-semibold">Total: ₹{totalAmount}</span>
            <NavLink
              className="bg-slate-500 text-white text-xs px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              to={"/orderplaced"}
            >
              Proceed to Checkout
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
