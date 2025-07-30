const mongoose = require('mongoose')


const otpSchema = new mongoose.Schema({
    phone : {
        type : String,
        required : true
    },
    otp: {
        type: String,
        required: true
    },
    otpExpiration: {
        type: Date,
        default: Date.now, // not Date.now()
        get: (val) => val.getTime(), // return in timestamp in milliseconds 
        set: (val) => new Date(val) // convert millisecond in timestamp (Date to object)
    }
})


module.exports = mongoose.model('otp', otpSchema)