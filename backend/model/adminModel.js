const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, default: "Admin" }
})

module.exports = mongoose.model('admin', AdminSchema)