import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser, verifyWithOTP } from "../store/seller/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const SignupCart = ({userDetails}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  console.log(userDetails)
  const initialState = {
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    googleId: userDetails?.googleId || "",
    password: "",
    phone: "",
    UID: "",
    hostel: "",
    room: "",
  }
 
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpCard, setOtpCard] = useState(false);
  const hostels = [
    "Aryabhatta", "Chanakya", "Sarabhai", "Bose",
    "Trisha", "Kalpana", "Gargi"
  ];

  const [formData, setFormData] = useState(initialState);

  const apiUrl = import.meta.env.VITE_API_URL;

  


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Merge email prefix + fixed domain
    const mergedEmail = formData.email.trim();
    if(formData.phone.length == 10){
        formData.phone = "+91" + formData.phone;
    }
    const payload = {
      ...formData,
      email: mergedEmail,
    };



      dispatch(registerUser(payload))
        .then((data) => {
          if (data?.payload?.success) {
            toast.success(data?.payload?.message);
            setOtpCard(true);
          } else {
            toast.error(data?.payload?.message);
          }
        })
        .catch((error) => {
          console.log("error in signup", error)
        });
  };

  const handleVerify_Signup = () => {
    
    const mergedEmail = formData.email.trim();

    
    const payload = {
      ...formData,
      email: mergedEmail,
    };
    const fullOtp = otp.join("");
    if (fullOtp.length === 4) {
    //   console.log("Entered OTP:", fullOtp);
      dispatch(verifyWithOTP({ formData: payload, otp: fullOtp }))
        .then((data) => {
          if (data?.payload?.success) {
            setOtpCard(false);
            setOtp(["", "", "", ""]);
            // setFormData(initialState); // Uncomment here if you want to reset after success
            navigate('/auth')
            toast.success(data.payload.message)
          }
          else {
            toast.error(data?.payload?.message);
          }
        })
        .catch((error) => {
          toast.error("error in verifyOTP")
          console.log("error in handleVerify_Signup", error);

        });
    } else {
      toast.error("Please enter the full 4-digit OTP.");
    }
  };

  const handleChange = (e, index) => {
    // console.log("curr Ind ", index);
    const value = e.target.value.replace(/\D/, ""); // Only digits
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move to previous input
      if (index > 0 && !otp[index]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl border border-gray-200">
            <h3 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Fill Details</h3>
            <p className="text-center text-base text-gray-600 mb-6">
              Fill Details to get started.
            </p>
            {/* Added max-h-96 and overflow-y-auto to the form for fixed height and scroll */}
            <form 
              className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2" 
              onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                  Email:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    // onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                  />
                  {/* <span className="text-gray-700 hide-email-postfix">.midnighseller@gmail.com</span> */}
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                //   onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1">
                    Phone:
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone"
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                  />
                </div>
                <div>
                  <label htmlFor="UID" className="block text-sm font-semibold text-gray-800 mb-1">
                    UID:
                  </label>
                  <input
                    type="number"
                    id="UID"
                    value={formData.UID}
                    onChange={handleInputChange}
                    placeholder="Enter your UID"
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hostel" className="block text-sm font-semibold text-gray-800 mb-1">
                    Hostel:
                  </label>
                  <select
                    id="hostel"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                  >
                    <option value="">Select your Hostel</option>
                    {hostels.map((hostel) => (
                      <option key={hostel} value={hostel}>
                        {hostel}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="room" className="block text-sm font-semibold text-gray-800 mb-1">
                    Room:
                  </label>
                  <input
                    type="text"
                    id="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="Enter your Room number"
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your Password"
                  className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                />
              </div>
              <div className="pb-4"> {/* Added padding bottom to account for scrollbar space */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 form-button"
                >
                  Complete Profile
                </button>
              </div>
            </form>
      </div>
      <div>
        {/* The OTP card remains outside the main form for layering */}
        {otpCard && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm space-y-7 border border-gray-200">
              <h2 className="text-3xl font-extrabold text-center text-gray-900">Enter OTP</h2>
              <div className="flex justify-center gap-3 sm:gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    maxLength="1"
                    value={otp[i]}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-14 h-16 text-center border-2 border-gray-300 rounded-lg text-2xl font-bold focus:outline-none focus:ring-3 focus:ring-blue-500 otp-input"
                  />
                ))}
              </div>
              <button
                onClick={handleVerify_Signup}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 form-button"
              >
                Verify & Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupCart;

