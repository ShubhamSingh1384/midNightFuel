const { createToken } = require("../../config/jwt");
const Seller = require("../../model/sellerModel");
const otpGenerator = require('otp-generator')
const twilio = require('twilio');
const dotenv = require('dotenv').config();
const otpModel = require('../../model/otpModel');
const { validateOTP } = require("../../helper/validateOTP");
const jwt = require('jsonwebtoken')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountAuthToken = process.env.TWILIO_AUTH_TOKEN
const accountPhoneNumber = process.env.TWILIO_PHONE_NUMBER

// console.log(accountAuthToken, accountPhoneNumber, accountSid)



const googleCallback = async (req, res) => {
  console.log("google call back called");
  // req.user = {...req.user, sellerId : req.user._id.toString()}
  console.log("request user", req.user);
  try {
    // generate token
    const token = jwt.sign({sellerId: req.user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );
    res.cookie('authToken', token, {
      httpOnly: false,         // true for better security, false if frontend reads it
      secure: false,           // true in production with HTTPS
      sameSite: 'Lax',          // or 'None' if using different domains (e.g. vercel.app)
    })
    // console.log(process.env.UI_URL)
    // console.log("emai is ", req.user)

    res.redirect(`${process.env.UI_URL}/seller/success-login`);
  } catch (error) {
    console.error("error during google callback -> ", error);
    res.status(500).json({ message: "Internal server error during login", success:false });
  }
}

const getUser = async (req, res) => {
  console.log("getUser req : ", req.user);
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized", success: false })
    }
    const email = req.user.email;
    // console.log("email is ", email);

    const sellerDetails = await Seller.findOne({ email });
    // console.log("seller" , sellerDetails);
    if (!sellerDetails) {
      return res.status(404).json({ message: "Seller not found", success: false });
    }

    let isActive = sellerDetails.varified;
    // console.log("isActive", isActive);
    res.status(200).json({
      message: "User found",
      data: sellerDetails,
      isActive,
      success: true
    })

  } catch (error) {
    console.error("error fetching user details -> ", error);
    res.status(500).json({
      message: "Internal server error fetching user details",
      data: [],
      success: false
    });
  }
}


const twilioClient = new twilio(accountSid, accountAuthToken);

const generateOTP_SignupSeller = async (req, res) => {
  const { name, email, password, phone, UID, hostel, room } = req.body;
  // console.log(name, email, password, phone, UID, hostel, room)
  // console.log("shubham");
  try {
    if (!name || !email || !password || !phone || !UID || !hostel || !room) {
      return res.status(200).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const existingSeller = await Seller.findOne({ email, UID });

    if (existingSeller) {
      // console.log(existingSeller);
      return res.status(200).json({
        success: false,
        message: "Seller already exists",
      });
    }

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    // console.log("otp is " ,otp);
    const currDate = new Date();
    // console.log("phone is ", phone);
    const userDetail = await otpModel.findOneAndUpdate(
      { phone },
      { otp, otpExpiration: new Date(currDate.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }

    )

    const otpDetail = await twilioClient.messages.create({
      body: `Dear Seller, Your OTP is : ${otp}`,
      to: phone,
      from: accountPhoneNumber
    })

    res.status(200).json({
      message: "opt send successfully",
      data: otp,
      success: true
    })

  } catch (error) {
    console.log("Error in sentOPT ", error);
    res.status(500).json({
      message: "error in sending OTP",
      success: false
    })
  }

}

const verifyOTP_SignupSeller = async (req, res) => {
  // console.log("verifyOPT called");
  // console.log("reqboyd" , req.body);
  const { name, email, password, phone, UID, hostel, room } = req.body.formData;
  const otp = req.body.otp;
  console.log("otp is ", otp, name, email, password, phone, UID, hostel, room, otp);
  try {
    if (!name || !email || !password || !phone || !UID || !hostel || !room) {
      return res.status(200).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    if (!otp) {
      return res.status(200).json({
        message: "Please enter OTP",
        success: false,
      });
    }
    const otpDetail = await otpModel.findOne({ phone, otp });
    // console.log("optDetails, ", otpDetail);
    if (!otpDetail) {
      return res.status(200).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    const isValidate = await validateOTP(otpDetail.otpExpiration);

    if (!isValidate) {
      return res.status(200).json({
        message: "OTP expired",
        success: false,
      });
    }

    const updatedSeller = await Seller.findOneAndUpdate(
      { email }, // search by email
      {
        $set: {
          name,
          password,
          phone,
          UID,
          hostel,
          room,
        },
      },
      {
        new: true,   // return the updated document
        upsert: true, // create a new one if not found
      }
    );


    res.status(201).json({
      success: "true",
      data: updatedSeller,
      message: "Request sent to Admin",
    });

  } catch (error) {
    console.log("Error in verifyOTP ", error);
    res.status(500).json({
      message: "error in verifyOTP",
      success: false
    })
  }
}

// async function signupSeller(req, res) {
//   // console.log("signupSeller");
//   const { name, email, password, phone, UID, hostel, room } = req.body;

//   // console.log(typeOf (hostel), typeOf (room));
//   try {
//     if (!name || !email || !password || !phone || !UID || !hostel || !room) {
//       return res.status(200).json({
//         message: "Please fill all the fields",
//         success: false,
//       });
//     }
//     const existingSeller = await Seller.findOne({ email });
//     if (existingSeller) {
//       // console.log(existingSeller);
//       return res.status(200).json({
//         success: false,
//         message: "Seller already exists",
//       });
//     }
//     let seller = new Seller({
//       name,
//       email,
//       password,
//       phone,
//       UID,
//       hostel,
//       room,
//     });
//     const sellerSaved = await seller.save();

//     res.status(201).json({
//       success: "true",
//       data: sellerSaved,
//       message: "Request sent to Admin",
//     });
//   } catch (err) {
//     console.log("eror is ", err);
//     res.status(200).json({
//       success: "false",
//       message: err,
//     });
//   }
// }

async function loginSeller(req, res) {
  const { email, password } = req.body;
  // console.log('login', email, password)
  try {
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Email and password are required",
      });
    }
    let seller = await Seller.findOne({ email, password });
    if (!seller) {
      return res.status(200).json({
        success: "false",
        message: "Invalid credentials",
      });
    }
    if (!seller.varified) {
      return res.status(200).json({
        success: false,
        message: "Seller is not varified Please wait...",
      });
    }
    const token = createToken({ email, sellerId: seller._id });
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    req.user = { sellerId: seller._id };
    console.log("req.user : ", req.user);
    res.status(200).json({
      success: "true",
      data: seller,
      token,
    });
  } catch (err) {
    console.log("eror is ", err);
    res.status(200).json({
      success: "false",
      message: err,
    });
  }
}

async function logoutSeller(req, res) {
  try {
    const cookieOptions = {
      // httpOnly: true,
      secure: false, // ✅ set to true in production over HTTPS
      sameSite: 'Lax', // match how the cookie was originally set
    };

    // Clear both cookies with appropriate options
    // res.clearCookie('token', cookieOptions);
    res.clearCookie('authToken', { ...cookieOptions, sameSite: 'Strict' });

    return res.status(200).json({
      message: "Logout Successfully",
      success: true,
    });
  } catch (error) {
    console.error("logout seller: ", error);
    return res.status(500).json({
      message: "Logout failed",
      success: false,
    });
  }
}


async function resetPassword(req, res) {
  const { email, UID, newPassword } = req.body;
  console.log("reset called : ", email, UID, newPassword);
  try {
    if (!email || !UID || !newPassword) {
      return res.status(200).json({
        success: false,
        message: "insufficient Data",
      });
    }

    const userData = await Seller.findOne({ email, UID });
    if (!userData) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    userData.password = newPassword;
    await userData.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log("logout seller: ", error);
    res.status(200).json({
      success: false,
    });
  }
}

module.exports = { generateOTP_SignupSeller, verifyOTP_SignupSeller, loginSeller, logoutSeller, resetPassword, googleCallback, getUser };
