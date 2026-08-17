const mongoose = require("mongoose");

const UploadedImageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleUser",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadedImage", UploadedImageSchema);
