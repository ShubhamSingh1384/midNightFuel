import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getNewRequest, rejectSeller, verifySeller } from '../store/admin/controlSlice';
import { toast } from 'react-toastify';

const NewRequest = () => {
  const dispatch = useDispatch();
  const [newRequest, setNewRequest] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchNewRequests = async () => {
      try {
        const response = await dispatch(getNewRequest());
        if (response?.payload?.data) {
          setNewRequest(response.payload.data);
        }
      } catch (error) {
        console.error("Error in New Request Seller:", error);
      }
    };

    fetchNewRequests();
  }, [dispatch, refetch]);

  const handleVerify = async (id) => {
    const res = await dispatch(verifySeller(id));
    if (res?.payload?.success) {
      toast.success(res.payload.message);
      setRefetch(prev => !prev);
    }
  };

  const handleReject = async (id) => {
    const res = await dispatch(rejectSeller(id));
    if (res?.payload?.success) {
      toast.success(res.payload.message);
      setRefetch(prev => !prev);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">New Seller Requests</h2>

      {newRequest.length === 0 ? (
        <p className="text-gray-600">No new requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newRequest.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div>
                <p className="text-gray-700 font-medium"><span className="text-gray-500">Name:</span> {user.name}</p>
                <p className="text-gray-700 font-medium truncate"><span className="text-gray-500">Email:</span> {user.email}</p>
                <p className="text-gray-700 font-medium"><span className="text-gray-500">UID:</span> {user.UID}</p>
                <p className="text-gray-700 font-medium"><span className="text-gray-500">Phone:</span> {user.phone}</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                >
                  View Detail
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(user._id)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 text-sm"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] sm:w-[500px] p-6 rounded-lg shadow-xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Seller Details</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>UID:</strong> {selectedUser.UID}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Room:</strong> {selectedUser.room}</p>
            <p><strong>Hostel:</strong> {selectedUser.hostel}</p>
            {/* <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRequest;
