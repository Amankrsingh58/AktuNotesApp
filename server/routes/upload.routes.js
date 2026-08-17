const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { articleUserAuth } = require("../middlewares/auth");
const UploadedImage = require("../models/UploadedImage");

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// PDFs remain on the legacy filesystem route. Article images use MongoDB
// because Render's default filesystem is erased during restarts and deploys.
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files (JPG, PNG, GIF, WebP) are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (imageMimeTypes.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG, GIF, and WebP images are allowed"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const receiveImage = (req, res, next) => {
  imageUpload.single("image")(req, res, (error) => {
    if (!error) return next();
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller"
      : error.message;
    return res.status(400).json({ message });
  });
};

router.post("/image", articleUserAuth, receiveImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const image = await UploadedImage.create({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      uploadedBy: req.user.id,
    });

    const baseUrl = req.protocol + "://" + req.get("host");
    const imageUrl = `${baseUrl}/api/upload/image/${image._id}`;
    res.status(200).json({
      message: "Image uploaded successfully",
      url: imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/image/:id", async (req, res) => {
  try {
    if (!req.params.id.match(/^[a-f\d]{24}$/i)) {
      return res.status(404).end();
    }

    const image = await UploadedImage.findById(req.params.id).select(
      "contentType size data createdAt"
    );
    if (!image) return res.status(404).end();

    res.set({
      "Content-Type": image.contentType,
      "Content-Length": String(image.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    return res.send(image.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load image" });
  }
});

router.post("/pdf", upload.single("pdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Construct the URL
    const baseUrl = req.protocol + "://" + req.get("host");
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
