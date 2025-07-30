import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


function Verify() {
  const backendUrl = useSelector((state) => state.backendUrl.url);
  const cartData = useSelector((state) => state.cart.setCartItems);
  const navigate = useNavigate();
  const [searchParams, SetSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const verifyPayment = async () => {
    try {
        const getToken = () => localStorage.getItem("token");
        const token = getToken();
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/user/verifyStripe",
        { success },
        { headers: { token } }
      );
      if (response.data.success) {
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    verifyPayment();
  }, []);
  return <div>Verify</div>;
}

export default Verify;
