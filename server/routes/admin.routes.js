const express = require("express");
const { 
  login, 
  createAdmin, 
  logout, 
  getAllAdmins, 
  deleteAdmin, 
  toggleUploadPermission,
  getAllUsers,
  createUser,
  deleteUser,
  getAllArticlesAdmin,
  deleteArticleAdmin
} = require("../controllers/admin.controller");
const { adminAuth, allowRoles } = require("../middlewares/auth");
const router = express.Router();

router.post("/login", login);

router.post("/create-admin", adminAuth, allowRoles("super_admin"), createAdmin);
router.post("/logout", adminAuth, logout);

// Super Admin Only Routes
router.get("/all-admins", adminAuth, allowRoles("super_admin"), getAllAdmins);
router.delete("/:id", adminAuth, allowRoles("super_admin"), deleteAdmin);
router.patch("/toggle-upload/:id", adminAuth, allowRoles("super_admin"), toggleUploadPermission);

// User Management Routes (Super Admin Only)
router.get("/users", adminAuth, allowRoles("super_admin"), getAllUsers);
router.post("/create-user", adminAuth, allowRoles("super_admin"), createUser);
router.delete("/user/:id", adminAuth, allowRoles("super_admin"), deleteUser);

// Article Management Routes (Super Admin Only)
router.get("/articles", adminAuth, allowRoles("super_admin"), getAllArticlesAdmin);
router.delete("/article/:id", adminAuth, allowRoles("super_admin"), deleteArticleAdmin);


// GET /api/auth/me
router.get("/me", adminAuth, (req, res) => {
  try {
    if (!req.admin) {
      return res.json({ isAuthenticated: false });
    }
    
    const admin = req.admin;

    res.json({
      user: {
        id: admin._id,
        email: admin.email || null, 
        name: admin.name || null, 
        canUpload: admin.canUpload,
      },
      isAuthenticated: true,
      role: admin.role,
    });
  } catch (err) {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;