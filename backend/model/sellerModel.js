const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true  // allows multiple users without Google ID
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    role: { type: String, default: 'seller' },
    password: { type: String }, // not required for Google users
    phone: { type: String },
    UID: { type: Number },
    hostel: { type: String },
    room: { type: String },
    varified: { type: Boolean, default: false }
});


const userModel = new mongoose.model('Sellers', userSchema);
module.exports = userModel;