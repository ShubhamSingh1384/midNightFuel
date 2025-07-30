import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteSeller, getSeller } from "../store/admin/controlSlice";
import { toast } from "react-toastify";

const Seller = () => {
  const dispatch = useDispatch();
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectDelete, setSelectDelete] = useState(null);
  // const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const allUser = await dispatch(getSeller());
        if (allUser?.payload?.data) {
          setSellers(allUser.payload.data);
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    fetchAllUser();
  }, [dispatch, sellers]);

  const handleDelete = (sellerDetails)=>{
    console.log(sellerDetails);
    dispatch(deleteSeller(sellerDetails._id))
    .then((data)=>{
      console.log(data);
      if(data?.payload?.success){
        toast.success(data.payload.message);
        setSellers((prev) => prev.filter((seller) => seller._id !== sellerDetails._id));
      }
      else{
        toast.error(data?.payload?.message);
      }
    })
    .catch((error)=>{
      console.error("Delete failed:", error);
      toast.error("Something went wrong!");
    })
    .finally(()=>{
      setSelectDelete(null);
    })
  }

  // console.log(selectDelete);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Seller List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-5 overflow-hidden"
          >
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-lg font-medium text-gray-800 truncate">{seller.name}</p>
            </div>

            <div className="mb-3">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-base text-gray-700 truncate">{seller.email}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm">UID</p>
              <p className="text-base text-gray-700 truncate">{seller.UID}</p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSelectedSeller(seller)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Detail
              </button>
              <button
                onClick={() => setSelectDelete(seller)}
                className="text-red-600 hover:underline text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedSeller && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 relative">
            <button
              onClick={() => setSelectedSeller(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Seller Details</h3>
            <p className="mb-2"><strong>Name:</strong> {selectedSeller.name}</p>
            <p className="mb-2"><strong>Email:</strong> {selectedSeller.email}</p>
            <p className="mb-2"><strong>UID:</strong> {selectedSeller.UID}</p>
            <p className="mb-2"><strong>Phone:</strong> {selectedSeller.phone || "N/A"}</p>
            <p className="mb-2"><strong>Hostel:</strong> {selectedSeller.hostel || "N/A"}</p>
            <p className="mb-2"><strong>Room No:</strong> {selectedSeller.room}</p>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {selectDelete && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-6 text-center">
              Are you sure you want to delete <strong>"{selectDelete.name}"</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="mb-4 text-sm text-gray-600">
              <div><strong>UID:</strong> {selectDelete.UID}</div>
              <div><strong>Email:</strong> {selectDelete.email}</div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectDelete(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md font-medium hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Seller;
