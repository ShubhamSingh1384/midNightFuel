const Seller = require('../../model/sellerModel')
const User = require('../../model/userModel');
const { sendSellerVerifiedMail, sendSellerRejectMail } = require('../seller/emailController');


const getSeller = async(req, res)=>{
    try {
        const sellers = await Seller.find({varified : true});
        if(sellers.length == 0){
            return res.status(404).json({
                message: "No sellers found",
                data: [],
                success: true
            })
        }
        res.status(200).json({
            message: "Sellers found",
            data: sellers,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            data: [],
            success: false
        })
    }
}

const getUser = async(req, res)=>{
    try {
        const users = await User.find({});
        if(users.length == 0){
            return res.status(200).json({
                message: "No users found",
                data: [],
                success: true
            })
        }
        res.status(200).json({
            message: "Users found",
            data: users,
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",   
            data: [],
            success: false
        })
    }
}

const NewSellerRequest = async (req, res) => {

    // console.log("New Seller Request Called");
  
    try {
      
      const newRequest = await Seller.find({ varified: false });
  
      if (newRequest.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "No New Request Found",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: newRequest,
        message: "All Seller Request List",
      });
  
    } catch (error) {
      console.error("error in Total Seller ", error);
  
      return res.status(200).json({
        success: false,
        message: "Error in Fetching all Seller Request List",
      });
    }
  };
  

const verifySeller = async(req, res)=>{

    try {
        const {sellerId} = req.params;
        const existSeller = await Seller.findOne({_id : sellerId});
        if(!existSeller){
            return res.status(200).json({
                message: "Seller not found",
                success: false,
                data:[]
            })
        }
        existSeller.varified = true;
        console.log(existSeller);
        await existSeller.save();

        await sendSellerVerifiedMail(existSeller.email, existSeller.name)

        res.status(200).json({
            message: "Seller verified",
            success: true,
            data: existSeller
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",   
            data: [],
            success: false
        })
    }
}

//Reject Seller
const rejectSeller = async(req, res)=>{
    try {
        const {sellerId} = req.params;
        const existSeller = await Seller.findOne({_id : sellerId});
        if(!existSeller){
            return res.status(200).json({
                message: "Seller not found",
                success: false,
                data:[]
            })
        }

        // console.log("from the reject part", existSeller);
        await sendSellerRejectMail(existSeller.email, existSeller.name);
        await Seller.deleteOne({_id : sellerId})
        return res.status(200).json({
            message: "Seller rejected",
            success: true,
            data: existSeller
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",   
            data: [],
            success: false
        })
    }

}

//Delete Seller
const deleteSeller = async(req, res)=>{
    try {
        const {sellerId} = req.params;
        const existSeller = await Seller.deleteOne({_id : sellerId})
        if(!existSeller){
            return res.status(200).json({
                message : "seller does not exist",
                data : [],
                success : false
            })
        }

        return res.status(200).json({
            message : "Seller Successfully Deleted",
            data : existSeller,
            success : true
        })

    } catch (error) {
        console.log("error in deleteSeller", error);
        res.status(500).json({
            message: "Internal Server Error",   
            data: [],
            success: false
        })
    }
}

const deleteUser = async(req, res)=>{
    try {
        const {userId} = req.params;
        const existUser = await User.deleteOne({_id : userId});
        if(!existUser){
            return res.status(200).json({
                message : "User Not Found",
                data : [],
                success : false
            })
        }

        return res.status(200).json({
            message : "User Deleted Successfully",
            data : existUser,
            success : true
        })

    } catch (error) {
        console.log("error in deleteUser", error);
        res.status(500).json({
            message: "Internal Server Error",   
            data: [],
            success: false
        })
    }
}

module.exports = {
    getSeller, 
    getUser, 
    NewSellerRequest, 
    verifySeller, 
    rejectSeller,
    deleteSeller,
    deleteUser
}