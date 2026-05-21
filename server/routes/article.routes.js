const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");
const { userAuth, optionalAuth } = require("../middlewares/auth");

// Public routes
router.get("/", articleController.getAllArticles);
router.get("/:slug", optionalAuth, articleController.getArticleBySlug);

// Protected routes (User must be logged in)
router.post("/", userAuth, articleController.createArticle);
router.put("/:id", userAuth, articleController.updateArticle);
router.post("/profile", userAuth, articleController.updateArticleProfile);
router.get("/profile/status", userAuth, articleController.checkProfileStatus);
router.get("/user/articles", userAuth, articleController.getUserArticles);
router.delete("/:id", userAuth, articleController.deleteArticle);

// Interaction routes
router.post("/:id/like", userAuth, articleController.toggleLikeArticle);
router.post("/:id/comments", userAuth, articleController.addComment);
router.delete("/:id/comments/:commentId", userAuth, articleController.deleteComment);

// Social routes
router.post("/follow/:userId", userAuth, articleController.toggleFollowUser);


module.exports = router;
