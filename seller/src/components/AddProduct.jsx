import React, { useState } from "react";
import { productName } from "./allProductName";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../store/seller/productSlice";
import { toast } from "react-toastify";

const initialSate = {
  name: "",
  price: "",
  quantity: "",
};

function AddProduct() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(initialSate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await dispatch(addProduct(product));
      if (data?.payload?.success) {
        toast.success(data.payload.message);
        setProduct(initialSate);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to add product.");
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full mx-auto mt-6 sm:mt-10 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
          Add Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <select
              name="name"
              value={product.name}
              onChange={handleChange}
              className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-400 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {productName.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-400 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-400 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 sm:py-3 text-sm sm:text-base bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>

        {/* Error Message (Optional) */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
