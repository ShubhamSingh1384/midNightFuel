import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getNewRequest, getSeller, getUser } from "../store/admin/controlSlice";
import { useNavigate } from "react-router-dom";
import { User, Users, FilePlus2 } from "lucide-react"; // Lucide icons

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [totalSeller, setTotalSellers] = useState([]);
  const [totalUser, setTotalUser] = useState([]);
  const [newRequest, setNewRequest] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const sellerRes = await dispatch(getSeller());
        if (sellerRes?.payload?.success) {
          setTotalSellers(sellerRes.payload.data);
        }

        const userRes = await dispatch(getUser());
        if (userRes?.payload?.success) {
          setTotalUser(userRes.payload.data);
        }

        const requestRes = await dispatch(getNewRequest());
        if (requestRes?.payload?.success) {
          setNewRequest(requestRes.payload.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [dispatch]);

  const cards = [
    {
      label: "Total Sellers",
      value: totalSeller.length,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      onClick: () => navigate("/admin/seller"),
    },
    {
      label: "Total Users",
      value: totalUser.length,
      icon: <User className="w-6 h-6 text-green-600" />,
      onClick: () => navigate("/admin/user"),
    },
    {
      label: "New Requests",
      value: newRequest.length,
      icon: <FilePlus2 className="w-6 h-6 text-purple-600" />,
      onClick: () => navigate("/admin/new-request"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 border hover:border-gray-300 ${
              card.onClick ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-full p-3">{card.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
