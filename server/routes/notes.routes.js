const express = require("express");
const router = express.Router();
const { adminAuth, allowRoles, checkUploadPermission } = require("../middlewares/auth");
const notesController = require("../controllers/notes.controller");

router.post("/createnotes", adminAuth, allowRoles("admin", "super_admin"), checkUploadPermission, notesController.createNotes);
router.get("/getnotes", notesController.getNotes); 
router.get("/getdashboardnotes", adminAuth, allowRoles("admin", "super_admin"), notesController.getDashboardNotes);
router.put("/updatenotes/:id", adminAuth,  allowRoles("admin", "super_admin"), notesController.updateNotes);
router.delete("/deletenotes/:id", adminAuth, allowRoles("admin", "super_admin"), notesController.deleteNotes);
module.exports = router;