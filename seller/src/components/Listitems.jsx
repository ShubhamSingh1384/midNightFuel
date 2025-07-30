import React, { useEffect, useState } from "react";
import { deleteProduct, fetchProduct, updateProduct } from "../store/seller/productSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function Listitems() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchProduct())
    .then((data) => {
      if (data?.payload?.data) {
        setProducts(data?.payload?.data);
      }
    });
  }, [dispatch]);

  const handleInputChange = (event, index, key) => {
    const value = event.target.value;

    const updatedProducts = [...products];
    // console.log("Updating product at index:", index, "with key:", key, "and value:", value);
    // console.log("Current products state:", updatedProducts);
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: value,
    };
    setProducts(updatedProducts);
  };

  const handleUpdate = (index) => {
    if (editIndex == null) setEditIndex(index);
    else {
      dispatch(
        updateProduct({
          productId: products[index]._id,
          price: products[index].price,
          quantity: products[index].totalStock,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          setEditIndex(null);
        }
      });
    }
  };

  const handleDelete = (index) => {
    dispatch(deleteProduct(products[index]._id)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setProducts(products.filter((product, i) => i !== index));
      }
    });
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-white rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 mt-10">
        Product List
      </h2>

      {/* Scrollable container for products */}
      <div className="w-full max-h-[70vh] overflow-y-auto border-t border-gray-200">
        {/* Column headers */}
        <div className="flex items-center justify-between font-semibold text-lg md:text-xl py-4 border-b border-gray-300 text-gray-800">
          <div className="flex-1 min-w-[120px] text-center">Product</div>
          <div className="flex-1 min-w-[120px] text-center">Quantity</div>
          <div className="flex-1 min-w-[120px] text-center">Price</div>
          <div className="flex-1 min-w-[160px] text-center">Actions</div>
        </div>

        {/* Container for each product */}
        {products?.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-300 py-4 text-lg md:text-xl min-w-[480px] bg-white"
          >
            <div className="flex-1 min-w-[120px] text-center">
              <span className="font-medium text-gray-800">{product?.productName}</span>
            </div>

            <div className="flex-1 min-w-[120px] text-center">
              {editIndex === index ? (
                <input
                  type="number"
                  value={product?.totalStock}
                  onChange={(e) => handleInputChange(e, index, "totalStock")}
                  className="border border-gray-300 p-2 w-20 md:w-24 text-base md:text-lg focus:outline-none bg-transparent text-gray-800"
                />
              ) : (
                <span className="text-gray-800">{product?.totalStock}</span>
              )}
            </div>

            <div className="flex-1 min-w-[120px] text-center">
              {editIndex === index ? (
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleInputChange(e, index, "price")}
                  className="border border-gray-300 p-2 w-24 md:w-32 text-base md:text-lg focus:outline-none bg-transparent text-gray-800"
                />
              ) : (
                <span className="text-gray-800">{`₹${product?.price} /-`}</span>
              )}
            </div>

            <div className="flex flex-1 min-w-[160px] justify-center space-x-4 md:space-x-6">
              <button
                onClick={() => handleUpdate(index)}
                className={`px-4 py-2 text-base md:text-lg ${
                  editIndex === index ? "bg-green-500" : "bg-yellow-500"
                } text-white rounded-lg hover:${
                  editIndex === index ? "bg-green-600" : "bg-yellow-600"
                } focus:outline-none`}
              >
                {editIndex === index ? "Save" : "Edit"}
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-4 py-2 text-base md:text-lg bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listitems;
