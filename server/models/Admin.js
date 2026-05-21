const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["admin", "super_admin"], required: true },
    password: { type: String, required: true, select: false, },
    canUpload: { type: Boolean, default: true },

});

module.exports = mongoose.model("Admin", AdminSchema);