const express = require("express");
const app = express();
const cors = require("cors")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");


dotenv.config();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "https://aktu-notes-app-1t4n.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.aktunotes.site"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || 
                      /^http:\/\/192\.168\.\d+\.\d+:5173$/.test(origin) || 
                      /^http:\/\/10\.\d+\.\d+\.\d+:5173$/.test(origin) || 
                      /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:5173$/.test(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Static folder for uploaded files
app.use("/uploads", express.static(uploadDir));


//DB connection
const connectDB = require("./config/db");
connectDB();

//pyq Routes
const pyqRoutes = require("./routes/pyq.routes");
app.use("/api", pyqRoutes);

//Notes Routes
const notesRoutes = require("./routes/notes.routes");
app.use("/api/notes", notesRoutes);

//Auth routes
const adminRoutes = require("./routes/admin.routes");
app.use("/api/auth", adminRoutes);

// User Auth routes
const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);

//Dashboard routes
const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api", dashboardRoutes);

// Upload routes
const uploadRoutes = require("./routes/upload.routes");
app.use("/api/upload", uploadRoutes);

// Payment routes
const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payment", paymentRoutes);

// Article routes
const articleRoutes = require("./routes/article.routes");
app.use("/api/articles", articleRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
