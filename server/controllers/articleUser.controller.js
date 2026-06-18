const ArticleUser = require("../models/ArticleUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Robust production detection: Render auto-sets RENDER=true
const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER;

const getCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const registerArticleUser = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        let user = await ArticleUser.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new ArticleUser({
            name,
            email,
            password: hashedPassword,
            bio: bio || "",
            role: "articleUser"
        });
        await user.save();

        const token = jwt.sign({ id: user._id, role: "articleUser" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("articleUserToken", token, getCookieOptions());

        res.status(201).json({
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                role: user.role,
                profilePic: user.profilePic,
                articleProfile: user.articleProfile,
                followers: user.followers,
                following: user.following,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginArticleUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await ArticleUser.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("articleUserToken", token, getCookieOptions());

        res.json({
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                role: user.role,
                profilePic: user.profilePic,
                articleProfile: user.articleProfile,
                followers: user.followers,
                following: user.following,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutArticleUser = async (req, res) => {
    res.clearCookie("articleUserToken", getCookieOptions());
    res.json({ message: "Logged out successfully" });
};

const getArticleMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ user: null, isAuthenticated: false });
        }
        const user = await ArticleUser.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                role: user.role,
                profilePic: user.profilePic,
                articleProfile: user.articleProfile,
                followers: user.followers,
                following: user.following,
            },
            isAuthenticated: true,
        });
    } catch (error) {
        res.json({ user: null, isAuthenticated: false });
    }
};

module.exports = { registerArticleUser, loginArticleUser, logoutArticleUser, getArticleMe };
