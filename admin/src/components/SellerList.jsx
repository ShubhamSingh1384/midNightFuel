import React from 'react';
import { useDispatch } from "react-redux";
import { rejectSeller, verifySeller } from '../store/admin/controlSlice';
import { toast } from "react-toastify";

const SellerList = ({ sellerList, setSellerList}) => {
  const dispatch = useDispatch();

  const handleVerify = (sellerId)=>{
    console.log("Verify button clicked", sellerId);
    dispatch(verifySeller(sellerId))
    .then((data) =>{
      if(data?.payload?.data){
        toast.success("Seller verified successfully");
       setSellerList(sellerList.filter((seller)=>(seller._id != sellerId)));
      }
      else{
        toast.error("Failed to verify seller");
      }
    })
  }

  const handleReject = (sellerId)=>{
    dispatch(rejectSeller(sellerId))
    .then((data)=>{
      if(data?.payload?.data){
        toast.success("Seller rejected successfully");
        setSellerList(sellerList.filter((seller)=>(seller._id != sellerId)));
      }
      else{
        toast.error("Failed to reject seller");
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Seller List</h2>
      {sellerList.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">UID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Hostel</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Room</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellerList.map((seller, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100`}
              >
                <td className="border border-gray-300 px-4 py-2">{seller.name}</td>
                <td className="border border-gray-300 px-4 py-2">{seller.email}</td>
                <td className="border border-gray-300 px-4 py-2">{seller.UID}</td>
                <td className="border border-gray-300 px-4 py-2">{seller.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{seller.hostel}</td>
                <td className="border border-gray-300 px-4 py-2">{seller.room}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2"
                    onClick={() => handleVerify(seller._id)}
                  >
                    Verify
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => handleReject(seller._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No sellers available</p>
      )}
    </div>
  );
};

export default SellerList;
