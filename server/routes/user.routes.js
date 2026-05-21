const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleLogin, logoutUser, getMe, updateProfile, updatePassword } = require("../controllers/user.controller");
const { userAuth } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/logout", logoutUser);
router.get("/me", userAuth, getMe);

// Protected student routes
router.put("/update-profile", userAuth, updateProfile);
router.put("/update-password", userAuth, updatePassword);

module.exports = router;
