import React from 'react';

const NewsLetterBox = () => {
  const onSubmitHandle = (event) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white text-black text-center py-20">
      <p className="text-2xl font-medium text-gray-900">
        Subscribe and get 20% off
      </p>
      <p className="text-gray-600 mt-3">
        Stay updated with our latest offers and news.
      </p>
      <form
        onSubmit={onSubmitHandle}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 bg-gray-100 rounded-lg"
      >
        <input
          type="email"
          className="w-full sm:flex-1 outline-none px-4 py-2 bg-white text-black rounded-lg"
          placeholder="Enter Your Mail"
          required
        />
        <button className="bg-slate-500 text-white text-xs px-10 py-4 rounded-lg hover:bg-gray-800 transition">
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
