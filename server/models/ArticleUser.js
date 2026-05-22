const mongoose = require("mongoose");

const ArticleUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: { type: String },
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
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArticleUser" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArticleUser" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ArticleUser", ArticleUserSchema);
