const mongoose = require('mongoose');

const ordersSchema=mongoose.Schema({
    productName:String,
    productId:String,
    quantity:Number,
    userId:String,
    sellerId:String,
    address:Object,
    orderStatus:{
        type:Boolean,
        default:false
    },
    orderAmount:Number,
    paymentMethod:String,  
    
    orderDate:{
        type:Date,
        default:new Date(Date.now()).toLocaleDateString("en-GB")
    },
})
const ordersModel=mongoose.model('orders',ordersSchema);
module.exports=ordersModel;