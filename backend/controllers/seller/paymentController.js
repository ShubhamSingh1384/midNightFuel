const { instance } = require('../../config/razorpay')
require('dotenv').config();
const crypto = require('crypto')

const UI_URL = process.env.UI_URL

const processPayment = async (req, res) => {
    console.log(req.body);
    // console.log(instance.orders);
    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR"
        }

        const order = await instance.orders.create(options)

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,

        })
    }
}

const getKey = async (req, res) => {
    try {
        res.status(200).json({
            key: process.env.Razorpay_KEY_ID
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,

        })
    }
}


const paymentVerification = async (req, res) => {
  console.log("paymentVerification called");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log("Received from Razorpay:", razorpay_order_id, razorpay_payment_id, razorpay_signature);

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthenticatePayment = expectedSignature === razorpay_signature;

    console.log("isAuthenticatePayment:", isAuthenticatePayment);

    if (isAuthenticatePayment) {
      // Save to DB (optional)

      return res.redirect(`${process.env.UI_URL}/seller/payment-success?reference=${razorpay_payment_id}`);
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};


module.exports = { processPayment, getKey, paymentVerification }