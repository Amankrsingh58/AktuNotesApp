const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");
const { articleUserAuth, optionalArticleAuth } = require("../middlewares/auth");

// Public routes
router.get("/", articleController.getAllArticles);
router.get("/:slug", optionalArticleAuth, articleController.getArticleBySlug);

// Protected routes (ArticleUser must be logged in)
router.post("/", articleUserAuth, articleController.createArticle);
router.put("/:id", articleUserAuth, articleController.updateArticle);
router.post("/profile", articleUserAuth, articleController.updateArticleProfile);
router.get("/profile/status", articleUserAuth, articleController.checkProfileStatus);
router.get("/user/articles", articleUserAuth, articleController.getUserArticles);
router.delete("/:id", articleUserAuth, articleController.deleteArticle);

// Interaction routes
router.post("/:id/like", articleUserAuth, articleController.toggleLikeArticle);
router.post("/:id/comments", articleUserAuth, articleController.addComment);
router.delete("/:id/comments/:commentId", articleUserAuth, articleController.deleteComment);

// Social routes
router.post("/follow/:userId", articleUserAuth, articleController.toggleFollowUser);


module.exports = router;
