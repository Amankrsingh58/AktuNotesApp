const express = require("express");
const router = express.Router();
const pyqController = require("../controllers/pyq.controller");
const { adminAuth, allowRoles, checkUploadPermission } = require("../middlewares/auth");

router.post("/createpyqs", adminAuth, allowRoles("admin", "super_admin"), checkUploadPermission, pyqController.createPYQ);
router.get("/getpyqs", pyqController.getPYQS); 
router.get("/getdashboardpyqs", adminAuth, allowRoles("admin", "super_admin"), pyqController.getDashboardPYQs);
router.put("/updatepyqs/:id", adminAuth,  allowRoles("admin", "super_admin"), pyqController.updatePYQ);
router.delete("/deletepyqs/:id", adminAuth, allowRoles("admin", "super_admin"), pyqController.deletePYQ);

module.exports = router;