const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: { type: String, required: true }, // e.g., 'UPLOAD_NOTE', 'DELETE_PYQ', 'TOGGLE_PERMISSION'
    details: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    targetModel: { type: String }, // 'Notes', 'PYQ', 'Admin'
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
