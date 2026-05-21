const express = require("express");
const router = express.Router();
const { adminAuth, allowRoles } = require("../middlewares/auth");
const dashboardController = require("../controllers/dashboard.controller");



router.get("/dashboard/stats", adminAuth, dashboardController.getDashboardStats);
router.get("/dashboard/logs", adminAuth, allowRoles('super_admin'), dashboardController.getActivityLogs);
router.put("/dashboard/updatepyqdownloadcount", dashboardController.updatePYQDownloadCount);
router.put("/dashboard/updatenotesdownloadcount", dashboardController.updateNotesDownloadCount);
router.get("/dashboard/getpyqdownloadcount", dashboardController.getPYQDownloadCounts);

module.exports = router;