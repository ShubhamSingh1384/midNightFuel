import React from "react";
import bannerImg from "../assets/Image/banner.png";

function Banner({ onShopClick }) {
  return (
    <section className="relative h-[100vh] w-full">
      <img
        src={bannerImg}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Midnight Fuel
        </h1>
        <p className="mb-6 text-lg md:text-xl text-gray-300">
          Late-night cravings? We deliver snacks, maggi, and more right to your
          hostel!
        </p>
        <button
          onClick={onShopClick}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg font-medium transition duration-300"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default Banner;
