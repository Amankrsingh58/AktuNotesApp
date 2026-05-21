const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.js");

// Middleware to authenticate admin from HTTP-only cookie
exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token||
      req.headers.authorization?.split(" ")[1]; 

      // console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch admin from DB
    const admin = await Admin.findById(decoded.id).select("role email name canUpload");

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // attach admin info to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized" });
  }
};


// Middleware to allow only certain roles
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};


// Middleware to check if admin has upload permission
exports.checkUploadPermission = (req, res, next) => {
  if (!req.admin || !req.admin.canUpload) {
    return res.status(403).json({ message: "You do not have permission to upload." });
  }
  next();
};


// Middleware to authenticate student from HTTP-only cookie
exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (id, role) to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired, please login again" });
  }
};

// Middleware to optionally attach user info if logged in (for public routes)
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(); // Proceed without user info
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info if valid
    next();
  } catch (error) {
    // If token is invalid/expired, still allow access but without user context
    next();
  }
};


// Example usage in a route
// router.post("/some-protected-route", adminAuth, allowRoles("super_admin"), someControllerFunction);