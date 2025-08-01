const { transporter } = require("../../config/Email/emailConfig.js");
const { Seller_Welcome_Email, Seller_Rejection_Email } = require("../../config/Email/emailTemplate.js");
const senderMail = process.env.EMAIL_USER;


const sendSellerRejectMail=async(email, name)=>{
    try {
        // console.log(senderMail);
        const response = await transporter.sendMail({
            from: `"MidNightFuel" <${senderMail}>`,

            to: email, // list of receivers
            subject: "Seller Request Rejected", // Subject line
            text: "Seller Request Rejected", // plain text body
            html: Seller_Rejection_Email.replace("{name}",name)
        })
        // console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}

const sendSellerVerifiedMail=async(email,name)=>{
    try {
     const response = await transporter.sendMail({
            from: `"MidNightFuel" <${senderMail}>`,

            to: email, // list of receivers
            subject: "Welcome Your Seller Request Approved", // Subject line
            text: "Welcome Your Seller Request Approved", // plain text body
            html: Seller_Welcome_Email.replace("{name}",name)
        })
        // console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Send Welcome Mail Error : - ',error)
    }
}

module.exports = { sendSellerRejectMail, sendSellerVerifiedMail };