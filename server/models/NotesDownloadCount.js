const mongoose = require("mongoose");

const NotesDownloadCountSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true }, // 1, 2, 3, 4
  downloadCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("NotesDownloadCount", NotesDownloadCountSchema);
