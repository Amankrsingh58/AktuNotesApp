const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logActivity = require("../utils/activityLogger");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    const user = await Admin.findOne({ email }).select("+password role email name canUpload");

    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // log login activity
    await logActivity({
      adminId: user._id,
      action: 'LOGIN',
      details: `${user.name} logged in`,
      ipAddress: req.ip
    });

    // set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      role: user.role,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, canUpload } = req.body;

    // validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    // check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      canUpload: canUpload !== undefined ? canUpload : true,
    });

    await newAdmin.save();

    await logActivity({
      adminId: req.admin._id,
      action: 'CREATE_ADMIN',
      details: `Created admin account for ${name} (${email})`,
      targetId: newAdmin._id,
      targetModel: 'Admin',
      ipAddress: req.ip
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("GET ALL ADMINS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.admin._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself." });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    await logActivity({
      adminId: req.admin._id,
      action: 'DELETE_ADMIN',
      details: `Deleted admin account for ${admin.name} (${admin.email})`,
      targetId: admin._id,
      targetModel: 'Admin',
      ipAddress: req.ip
    });

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("DELETE ADMIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleUploadPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    admin.canUpload = !admin.canUpload;
    await admin.save();

    await logActivity({
      adminId: req.admin._id,
      action: 'TOGGLE_PERMISSION',
      details: `${admin.canUpload ? "Enabled" : "Disabled"} upload permission for ${admin.name}`,
      targetId: admin._id,
      targetModel: 'Admin',
      ipAddress: req.ip
    });

    res.status(200).json({
      message: `Upload permission ${admin.canUpload ? "enabled" : "disabled"} for ${admin.name}`,
      admin: {
        id: admin._id,
        canUpload: admin.canUpload,
      },
    });
  } catch (error) {
    console.error("TOGGLE PERMISSION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, year, college } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      year,
      college,
      isVerified: true
    });

    await newUser.save();

    await logActivity({
      adminId: req.admin._id,
      action: 'CREATE_USER',
      details: `Created user account for ${name} (${email})`,
      targetId: newUser._id,
      targetModel: 'User',
      ipAddress: req.ip
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        year: newUser.year,
        college: newUser.college
      }
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await logActivity({
      adminId: req.admin._id,
      action: 'DELETE_USER',
      details: `Deleted user account for ${user.name} (${user.email})`,
      targetId: user._id,
      targetModel: 'User',
      ipAddress: req.ip
    });

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllArticlesAdmin = async (req, res) => {
  try {
    const Article = require("../models/Article");
    const articles = await Article.find()
      .populate("author", "name email profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    console.error("GET ALL ARTICLES ADMIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteArticleAdmin = async (req, res) => {
  try {
    const Article = require("../models/Article");
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    await logActivity({
      adminId: req.admin._id,
      action: 'DELETE_ARTICLE',
      details: `Deleted article "${article.title}" by author ID ${article.author}`,
      targetId: article._id,
      targetModel: 'Article',
      ipAddress: req.ip
    });

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted successfully." });
  } catch (error) {
    console.error("DELETE ARTICLE ADMIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};