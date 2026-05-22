const express = require("express");
const router = express.Router();
const { registerArticleUser, loginArticleUser, logoutArticleUser, getArticleMe } = require("../controllers/articleUser.controller");
const { articleUserAuth } = require("../middlewares/auth");

router.post("/register", registerArticleUser);
router.post("/login", loginArticleUser);
router.post("/logout", logoutArticleUser);
router.get("/me", articleUserAuth, getArticleMe);

module.exports = router;
