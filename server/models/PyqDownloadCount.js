const mongoose = require("mongoose");
const PyqDownloadCountSchema = new mongoose.Schema({
    year: { type: Number, required: true, unique: true },
    downloadCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("PyqDownloadCount", PyqDownloadCountSchema);