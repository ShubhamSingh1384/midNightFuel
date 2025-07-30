import React from 'react';
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className="bg-white text-black flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base">
      <div>
        <img
          className="w-12 m-auto mb-5"
          src={assets.exchange_icon}
          alt="Exchange Policy"
        />
        <p className="font-semibold text-gray-800">Effortless Exchange at Midnight</p>
        <p className="text-gray-500">Need a change? We make exchanges easy, even after hours.</p>
      </div>
      <div>
        <img
          className="w-12 m-auto mb-5"
          src={assets.quality_icon}
          alt="Quality Policy"
        />
        <p className="font-semibold text-gray-800">Night Owl Returns</p>
        <p className="text-gray-500">Returning products is a breeze—up to 7 days, no questions asked.</p>
      </div>
      <div>
        <img
          className="w-12 m-auto mb-5"
          src={assets.support_img}
          alt="Customer Support"
        />
        <p className="font-semibold text-gray-800">24/7 Customer Support</p>
        <p className="text-gray-500">Around the clock, we’ve got you covered—whenever you need us.</p>
      </div>
    </div>
  );
};

export default OurPolicy;
