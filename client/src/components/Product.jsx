import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addCartItmes } from "../Slice/CartItemSlice";
import { ShoppingCart } from "lucide-react";
import { assets } from "../assets/assets";

function Product({ product }) {
  const dispatch = useDispatch();
  const backendUrl = useSelector((state) => state.backendUrl.url);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add product to cart");
      return navigate("/login");
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/addToCart`,
        { productId: product._id },
        { headers: { token } }
      );

      if (response.data.success) {
        dispatch(addCartItmes(product.productId));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const getProductImage = () => {
    switch (product.productName.toLowerCase()) {
      case "maggie":
        return assets.Maggie;
      case "chocolate":
        return assets.chocolate;
      case "kurkure":
        return assets.kurkure;
      case "biscuit":
        return assets.biscuit;
      case "chips":
        return assets.chips;
      case "juice":
        return assets.juice;
      case "bread":
        return assets.bread;
      case "butter":
        return assets.butter;
      case "cheese":
        return assets.cheese;
      case "milk":
        return assets.milk;
      case "eggs":
        return assets.egg;
      default:
        return "https://via.placeholder.com/150";
    }
  };

  return (
    <div className="w-full max-w-xs cursor-pointer bg-[#e2e0db] rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      {/* Product Image */}
      <div className="relative w-full h-40 overflow-hidden rounded-t-lg bg-gray-300">
        <img
          src={getProductImage()}
          alt={product.productName}
          className="w-full h-full object-contain object-center"
        />
        <span
          className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
            product.totalStock > 0 ? "bg-green-500" : "bg-red-600"
          } text-white`}
        >
          {product.totalStock > 0 ? "✔ In Stock" : "❌ Out of Stock"}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-semibold truncate">
          {product.productName}
        </h3>
        <p className="text-sm text-gray-600">
          <strong>🏠 Hostel:</strong> {product.hostelName}
        </p>
        <p className="text-sm text-gray-600">
          <strong>🚪 Room:</strong> {product.roomNo}
        </p>

        {/* Price Info */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-green-600 text-lg font-semibold">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Stock Info & Add to Cart Button */}
      <div className="flex justify-between items-center p-4">
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {product.totalStock} left
        </span>

        <button
  onClick={handleAddToCart}
  className={`bg-slate-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition ${
    product.totalStock === 0 ? "cursor-not-allowed opacity-50" : ""
  }`}
  disabled={product.totalStock === 0}
>
  <ShoppingCart size={16} className="text-white" />
</button>

      </div>
    </div>
  );
}

export default Product;
