const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Robust production detection: Render auto-sets RENDER=true
const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER;

const getCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const registerUser = async (req, res) => {
    try {
        const { name, email, password, year, college } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, year, college });
        await user.save();

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("userToken", token, getCookieOptions());

        res.status(201).json({ user: { _id: user._id, id: user._id, name, email, year, college, profilePic: user.profilePic, articleProfile: user.articleProfile, followers: user.followers, following: user.following } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("userToken", token, getCookieOptions());

        res.json({ user: { _id: user._id, id: user._id, name: user.name, email: user.email, year: user.year, college: user.college, profilePic: user.profilePic, articleProfile: user.articleProfile, followers: user.followers, following: user.following } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("userToken", getCookieOptions());
    res.json({ message: "Logged out successfully" });
};

const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ user: null, isAuthenticated: false });
        }
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user: { _id: user._id, id: user._id, name: user.name, email: user.email, year: user.year, college: user.college, profilePic: user.profilePic, articleProfile: user.articleProfile, followers: user.followers, following: user.following }, isAuthenticated: true });
    } catch (error) {
        res.json({ user: null, isAuthenticated: false });
    }
};

const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, profilePic: picture, googleId: sub, isVerified: true });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("userToken", jwtToken, getCookieOptions());

        res.json({ user: { _id: user._id, id: user._id, name: user.name, email: user.email, year: user.year, college: user.college, profilePic: user.profilePic, articleProfile: user.articleProfile, followers: user.followers, following: user.following } });
    } catch (error) {
        res.status(500).json({ message: "Google login failed" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, year, college } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (year) user.year = year;
        if (college) user.college = college;

        await user.save();
        res.json({ user: { _id: user._id, id: user._id, name: user.name, email: user.email, year: user.year, college: user.college, profilePic: user.profilePic, articleProfile: user.articleProfile, followers: user.followers, following: user.following } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        // Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, googleLogin, logoutUser, getMe, updateProfile, updatePassword };
