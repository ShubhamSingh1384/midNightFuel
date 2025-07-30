import React, { useEffect, useRef, useState } from "react";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Slice/ProductSlice";
import Banner from "./Banner";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Title } from "./Title";
import NewsLetterBox from "./NewsLetterBox";
import OurPolicy from "./OurPolicy";

function Home() {
  const productRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedHostel, setSelectedHostel] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const products = useSelector((state) => state.products.items.data);
  const loading = useSelector((state) => state.products.loading);

  const hostels = ["All", "Aryabhatta", "Chanakya", "Sarabhai", "Bose", "Trisha", "Kalpana", "Gargi"];

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredData =
    selectedHostel === "All"
      ? products
      : products?.filter((product) => product.hostelName === selectedHostel);

  return (
    <>
      <Banner onShopClick={scrollToProducts} />

      <div ref={productRef} className="text-center py-8 text-3xl bg-[#d8d4d5]">
        <Title text1={"LATEST"} text2={"PRODUCTS"} />
      </div>

      <div className="min-h-screen bg-[#f7f7ff] text-white p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="relative ml-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg shadow-md text-white font-medium transition"
            >
              Filter: {selectedHostel}
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white text-black rounded-md shadow-lg w-44 z-50 right-0">
                {hostels.map((hostel) => (
                  <button
                    key={hostel}
                    onClick={() => {
                      setSelectedHostel(hostel);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {hostel}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Box sx={{ display: "flex" }}>
              <CircularProgress sx={{ color: "#fff" }} />
            </Box>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredData?.length > 0 ? (
              filteredData.map((product) => (
                <Product key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-200 text-lg">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>

      <OurPolicy />
      <NewsLetterBox />
    </>
  );
}

export default Home;
