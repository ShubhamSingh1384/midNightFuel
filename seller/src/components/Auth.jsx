import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, verifyWithOTP } from "../store/seller/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';



const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  UID: "",
  hostel: "",
  room: "",
}

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpCard, setOtpCard] = useState(false);
  const hostels = [
    "Aryabhatta", "Chanakya", "Sarabhai", "Bose",
    "Trisha", "Kalpana", "Gargi"
  ];

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const toggleForm = () => setIsLogin(!isLogin);


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
    let updateNumber = formData.phone.trim();
    if(updateNumber.length == 10){
      updateNumber = "+91" + updateNumber
    }

    // Create payload with merged email
    const payload = {
      ...formData,
      email: mergedEmail,
      phone: updateNumber,
    };

    if (isLogin) {
      dispatch(loginUser(payload))
        .then((data) => {
          if (data?.payload?.success === "true") {
            localStorage.setItem("authToken", JSON.stringify(data.payload.token));
            toast.success(data?.payload?.message);
            navigate("/seller/orders");
          } else {
            toast.error(data?.payload?.message);
          }
        })
        .catch((error) => {
          console.log("error in signup", error);
          toast.error("Invalid credentials");
        });
    } else {
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
    }
  };

  const handlePaymentProcess = async (sellerDetails) => {
    console.log("seller Details  ", sellerDetails);
    try {
      const amount = 50;
      console.log("Payment process called from frontend");
      const razorpay_key = await axios.get(`${apiUrl}/api/seller/getkey`);
      //   console.log("razorpay" , razorpay_key.data);
      const res = await axios.post(`${apiUrl}/api/seller/payment-process`, {
        amount: Number(amount),
      });

      const orderID = res.data.order.id;
      console.log("res is ", res);

      const options = {
        key: razorpay_key?.data?.key,
        amount,
        currency: 'INR',
        name: sellerDetails.name,
        description: 'One time payment',
        order_id: orderID,
        callback_url: `${apiUrl}/api/seller/payment-verification`, // Your success URL
        prefill: {
          name: 'Shubham Singh',
          email: 'shubham@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Error in payment:", error.response?.data || error.message);
    }
  };

  const handleVerify_Signup = () => {
    // Merge email prefix + fixed domain
    const mergedEmail = formData.email.trim();
    let phoneUpdate = formData.phone.trim();
    if(phoneUpdate.length == 10){
      phoneUpdate = "+91" + phoneUpdate;
    }
    // Create payload with merged email
    const payload = {
      ...formData,
      email: mergedEmail,
      phone: phoneUpdate,
    };
    const fullOtp = otp.join("");
    if (fullOtp.length === 4) {
      console.log("Entered OTP:", fullOtp);
      dispatch(verifyWithOTP({ formData: payload, otp: fullOtp }))
        .then((data) => {
          console.log("data payload is ", data.payload);
          if (data?.payload?.success) {
            setOtpCard(false);
            setOtp(["", "", "", ""]);
            // setFormData(initialState); // Uncomment here if you want to reset after success
            
            handlePaymentProcess(data.payload.data);
            setIsLogin(true);
            // toast.success(data.payload.message)
          }
          else {
            toast.error(data?.payload?.message);
          }
        })
        .catch((error) => {
          toast.error("Invalid OTP")
          console.log("error in handleVerify_Signup", error);

        });
    } else {
      toast.error("Please enter the full 4-digit OTP.");
    }
  };

  const handleResetPassword = () => {
    navigate("/seller/resetpassword");
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

  const handleGoogleLogin = () => {
    try {
      setIsLoading(true);
      const googleLoginUrl = `${apiUrl}/api/seller/auth/google`;
      window.location.href = googleLoginUrl;
    
    } catch (error) {
      console.error('error login with google', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        {isLogin ? (
          <>
            <h3 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Login</h3>
            <p className="text-center text-base text-gray-600 mb-6">
              Enter your credentials to continue.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                  Email:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                  />
                  {/* <span className="text-gray-700 hide-email-postfix">.midnighseller@gmail.com</span> */}
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                  Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your Password"
                  className="mt-1 w-full py-2.5 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-base form-input-field"
                />
                <p
                  className="text-sm text-pink-600 hover:underline cursor-pointer mt-2 link-button"
                  onClick={handleResetPassword}
                >
                  Forget Password?
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 form-button"
                >
                  Login
                </button>
              </div>

              {/* Google Sign-in Button */}
            </form>
            <div className='mt-2'>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className='w-full flex items-center justify-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
              >
                <div className='mr-3 flex items-center justify-center'>
                  <div className='relative h-6 w-6'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <span className='flex h-full w-full items-center justify-center rounded-full bg-white'>
                        <span className='h-4 w-4 rounded-full border-2 border-t-blue-500 border-r-red-500 border-b-yellow-500 border-l-green-500 animate-spin-custom'>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                Sign in with Google
              </button>
            </div>
            <p className="text-center mt-6 text-gray-700">
              Don't have an account?{" "}
              <button onClick={toggleForm} className="text-pink-600 hover:text-pink-700 font-semibold link-button">
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Sign Up</h3>
            <p className="text-center text-base text-gray-600 mb-6">
              Create a new account to get started.
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
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  Sign Up
                </button>
              </div>
            </form>
            <p className="text-center mt-6 text-gray-700">
              Already have an account?{" "}
              <button onClick={toggleForm} className="text-pink-600 hover:text-pink-700 font-semibold link-button">
                Login
              </button>
            </p>
          </>
        )}
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
                Process to Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;



// return (
//   <div className="flex justify-center items-center h-screen bg-white">
//     <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//       {isLogin ? (
//         <>
//           <h3 className="text-xl font-bold text-center text-gray-800">Login</h3>
//           <p className="text-center text-sm text-gray-600 mb-4">
//             Enter your credentials to continue.
//           </p>
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-800">
//                 Email:
//               </label>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   id="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email prefix"
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//                 />
//                 <span className="text-gray-700">.midnighseller@gmail.com</span>
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-800">
//                 Password:
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Enter your Password"
//                 className="mt-1 w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//               />
//               <p
//                 className="text-sm text-pink-600 hover:underline cursor-pointer mt-1"
//                 onClick={handleResetPassword}
//               >
//                 Forget Password?
//               </p>
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
//               >
//                 Login
//               </button>
//             </div>
//           </form>
//           <p className="text-center mt-4 text-gray-700">
//             Don't have an account?{" "}
//             <button onClick={toggleForm} className="text-pink-600 hover:text-pink-700 font-medium">
//               Sign up
//             </button>
//           </p>
//         </>
//       ) : (
//         <>
//           <h3 className="text-xl font-bold text-center text-gray-800">Sign Up</h3>
//           <p className="text-center text-sm text-gray-600 mb-4">
//             Create a new account to get started.
//           </p>
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-800">
//                 Email:
//               </label>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   id="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email prefix"
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//                 />
//                 <span className="text-gray-700">.midnighseller@gmail.com</span>
//               </div>
//             </div>
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-800">
//                 Name:
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter your name"
//                 className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//               />
//             </div>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-800">
//                   Phone:
//                 </label>
//                 <input
//                   type="text"
//                   id="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="Enter your phone"
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="UID" className="block text-sm font-medium text-gray-800">
//                   UID:
//                 </label>
//                 <input
//                   type="number"
//                   id="UID"
//                   value={formData.UID}
//                   onChange={handleInputChange}
//                   placeholder="Enter your UID"
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="hostel" className="block text-sm font-medium text-gray-800">
//                   Hostel:
//                 </label>
//                 <select
//                   id="hostel"
//                   value={formData.hostel}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//                 >
//                   <option value="">Select your Hostel</option>
//                   {hostels.map((hostel) => (
//                     <option key={hostel} value={hostel}>
//                       {hostel}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="room" className="block text-sm font-medium text-gray-800">
//                   Room:
//                 </label>
//                 <input
//                   type="text"
//                   id="room"
//                   value={formData.room}
//                   onChange={handleInputChange}
//                   placeholder="Enter your Room number"
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-800">
//                 Password:
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Enter your Password"
//                 className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
//               >
//                 Sign Up
//               </button>
//             </div>
//           </form>
//           <p className="text-center mt-4 text-gray-700">
//             Already have an account?{" "}
//             <button onClick={toggleForm} className="text-pink-600 hover:text-pink-700 font-medium">
//               Login
//             </button>
//           </p>
//         </>
//       )}
//     </div>
//     <div>
//       <div>
//         {otpCard && (
//           <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
//             <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-6">
//               <h2 className="text-2xl font-semibold text-center">Enter OTP</h2>

//               <div className="flex justify-center gap-4">
//                 {[0, 1, 2, 3].map((i) => (
//                   <input
//                     key={i}
//                     ref={(el) => (inputRefs.current[i] = el)}
//                     type="text"
//                     maxLength="1"
//                     value={otp[i]}
//                     onChange={(e) => handleChange(e, i)}
//                     onKeyDown={(e) => handleKeyDown(e, i)}
//                     className="w-12 h-14 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 ))}
//               </div>

//               <button
//                 onClick={handleVerify_Signup}
//                 className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
//               >
//                 Verify & Sign Up
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//     <div className='p-6'>

//       <div className='mt-6'>
//         <button
//           onClick={handleGoogleLogin}
//           disabled={isLoading}
//           className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition'
//         >

//           <div className='mr-2 flex items-center justify-center'>
//             <div className='relative h-5 w-5'>
//               <div className='absolute inset-0 flex items-center justify-center'>
//                 <span className='flex h-full w-full items-center justify-center rounded-full bg-white'>
//                   <span className='h-3.5 w-3.5 rounded-full border-2 border-t-blue-500 border-r-red-500 border-b-yellow-500 border-l-green-500'>

//                   </span>
//                 </span>

//               </div>

//             </div>

//           </div>
//           Sign in with Google
//         </button>
//       </div>

//     </div>
//   </div>
// );
