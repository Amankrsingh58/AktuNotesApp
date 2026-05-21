const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    year: { type: Number },
    college: { type: String },
    profilePic: { type: String },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    articleProfile: {
        bio: { type: String },
        avatar: { type: String },
        socialLinks: {
            twitter: { type: String },
            linkedin: { type: String },
            website: { type: String }
        },
        isComplete: { type: Boolean, default: false }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
