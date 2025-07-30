import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUser, getUser } from "../store/admin/controlSlice";
import { toast } from "react-toastify";

const User = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectDelete, setSelectDelete] = useState(null);

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const allUser = await dispatch(getUser());
        if (allUser?.payload?.data) {
          setUsers(allUser.payload.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAllUser();
  }, [dispatch, users]);

  const handleDelete = (userDetails) => {
    // console.log(userDetails);
    dispatch(deleteUser(userDetails._id))
      .then((data) => {
        console.log(data);
        if (data?.payload?.success) {
          toast.success(data.payload.message);
          setUsers((prev) => prev.filter((seller) => seller._id !== userDetails._id));
        }
        else {
          toast.error(data?.payload?.message);
        }
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        toast.error("Something went wrong!");
      })
      .finally(() => {
        setSelectDelete(null);
      })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6"
          >
            <div className="mb-4">
              <p className="text-gray-500 text-sm mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="text-base text-gray-700">{user.email}</p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="text-blue-600 hover:underline text-sm font-medium"
                onClick={() => setSelectedUser(user)}
              >
                Detail
              </button>
              <button
                onClick={() => setSelectDelete(user)}
                className="text-red-600 hover:underline text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none px-4">
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">User Details</h3>
            <p className="mb-3"><strong>Name:</strong> {selectedUser.name}</p>
            <p className="mb-3"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="mb-3"><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
            <p className="mb-3"><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
            {/* <p className="mb-1"><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p> */}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {selectDelete && (
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none px-4">
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-6 text-center">
              Are you sure you want to delete <strong>"{selectDelete.name}"</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="mb-4 text-sm text-gray-600">
              <div><strong>Email:</strong> {selectDelete.email}</div>
              <div><strong>Phone:</strong> {selectDelete.phone}</div>
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

export default User;
