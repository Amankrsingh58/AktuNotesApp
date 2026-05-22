const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true
    },
    content: { 
        type: String, 
        required: true 
    },
    summary: { 
        type: String,
        required: true
    },
    coverImage: { 
        type: String 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ArticleUser",
        required: true 
    },
    tags: [{ 
        type: String 
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArticleUser"
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "ArticleUser" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    seoTitle: { 
        type: String 
    },
    seoDescription: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ["draft", "published"], 
        default: "published" 
    },
    views: { 
        type: Number, 
        default: 0 
    },
    readTime: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

// Pre-save hook to generate SEO title if not provided
ArticleSchema.pre("save", async function() {
    if (!this.seoTitle) {
        this.seoTitle = this.title;
    }
    if (!this.seoDescription) {
        this.seoDescription = this.summary;
    }
});

module.exports = mongoose.model("Article", ArticleSchema);
