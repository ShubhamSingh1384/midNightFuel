import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reference = searchParams.get("reference");

    if (reference) {
      toast.success("Request submitted");

      const timer = setTimeout(() => {
        navigate("/auth");
      }, 5000);

      return () => clearTimeout(timer); // cleanup if component unmounts
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you for your payment!</h2>
      <p className="text-lg text-gray-700">
        Your request has been submitted to the admin. You’ll be redirected shortly...
      </p>
    </div>
  );
};

export default SuccessPayment;
