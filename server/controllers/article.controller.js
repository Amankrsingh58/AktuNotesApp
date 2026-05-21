const Article = require("../models/Article");
const User = require("../models/User");

const slugify = (text) => {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
};

// Get all published articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find({ status: "published" })
            .populate("author", "name profilePic articleProfile")
            .sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching articles", error: error.message });
    }
};

// Get single article by slug
exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
            .populate("author", "name profilePic articleProfile");
        
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // If it's a draft, only allow author or admin to see it
        if (article.status === "draft") {
            const isAuthor = req.user && req.user.id === article.author._id.toString();
            const isAdmin = req.admin; // If admin middleware was used, but here we just check if it's there
            
            if (!isAuthor && !isAdmin) {
                return res.status(404).json({ message: "Article not found" });
            }
        }

        // Increment views only for published articles
        if (article.status === "published") {
            article.views += 1;
            await article.save();
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Error fetching article", error: error.message });
    }
};

const calculateReadTime = (content) => {
    if (!content || typeof content !== "string") return 1;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

// Create article
exports.createArticle = async (req, res) => {
    try {
        const { title, content, summary, coverImage, tags, status } = req.body;

        if (!title || !content || !summary) {
            return res.status(400).json({ message: "Title, content and summary are required" });
        }

        // Generate slug and ensure uniqueness
        let baseSlug = slugify(title);
        if (!baseSlug) baseSlug = "article";
        const slug = `${baseSlug}-${Date.now()}`;

        const newArticle = new Article({
            title,
            slug,
            content,
            summary,
            coverImage: coverImage || "",
            author: req.user.id,
            tags: tags || [],
            status: status || "published",
            readTime: calculateReadTime(content)
        });

        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (error) {
        console.error("Error in createArticle:", error);
        res.status(500).json({ 
            message: "Error creating article", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Update article
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, summary, coverImage, tags, status } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Check if author
        if (article.author.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (title) article.title = title;
        if (content) {
            article.content = content;
            article.readTime = calculateReadTime(content);
        }
        if (summary) article.summary = summary;
        if (coverImage) article.coverImage = coverImage;
        if (tags) article.tags = tags;
        if (status) article.status = status;

        await article.save();
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Error updating article", error: error.message });
    }
};

// Update Article Profile
exports.updateArticleProfile = async (req, res) => {
    try {
        const { bio, socialLinks, avatar } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.articleProfile = {
            bio,
            avatar,
            socialLinks,
            isComplete: true
        };

        await user.save();
        res.status(200).json({ message: "Article profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// Check if profile is complete
exports.checkProfileStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("articleProfile");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ isComplete: user.articleProfile?.isComplete || false });
    } catch (error) {
        res.status(500).json({ message: "Error checking status", error: error.message });
    }
};
// Get user's own articles
exports.getUserArticles = async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user articles", error: error.message });
    }
};

// Toggle Like Article
exports.toggleLikeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const isLiked = article.likes.includes(req.user.id);
        if (isLiked) {
            article.likes = article.likes.filter(id => id.toString() !== req.user.id);
        } else {
            article.likes.push(req.user.id);
        }

        await article.save();
        res.status(200).json({ 
            message: isLiked ? "Unliked" : "Liked", 
            likesCount: article.likes.length,
            isLiked: !isLiked
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling like", error: error.message });
    }
};

// Add Comment
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const newComment = {
            user: req.user.id,
            text,
            createdAt: new Date()
        };

        article.comments.push(newComment);
        await article.save();

        const updatedArticle = await Article.findById(req.params.id)
            .populate("comments.user", "name profilePic");

        res.status(201).json(updatedArticle.comments[updatedArticle.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const comment = article.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Only author of article or author of comment can delete
        if (comment.user.toString() !== req.user.id && article.author.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        comment.remove();
        await article.save();

        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
};

// Toggle Follow User
exports.toggleFollowUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) return res.status(404).json({ message: "User not found" });
        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const isFollowing = currentUser.following.includes(userToFollow._id);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow._id.toString());
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser._id.toString());
        } else {
            // Follow
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
        }

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ 
            message: isFollowing ? "Unfollowed" : "Followed",
            isFollowing: !isFollowing,
            followersCount: userToFollow.followers.length,
            following: currentUser.following // Return updated following list
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling follow", error: error.message });
    }
};

// Delete Article
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        // Only author can delete
        if (article.author.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this article" });
        }

        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting article", error: error.message });
    }
};
