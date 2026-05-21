const mongoose = require("mongoose");

const PYQSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    semester: { type: Number },
    AcademicYear: { type: String, required: true },
    subject: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy:{type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PYQ", PYQSchema);