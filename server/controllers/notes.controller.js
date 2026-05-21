const mongoose = require("mongoose");
const Notes = require("../models/Notes");
const logActivity = require("../utils/activityLogger");


exports.createNotes = async (req, res) => {
    try {
        const { year, Unit, semester, subject, pdfUrl } = req.body;

        if (!year || !Unit || !subject || !pdfUrl) {
            return res.status(400).json({ message: "Year, Academic Year, Subject, and PDF URL are required." });
        }

        const newNotes = new Notes({ year, Unit, semester:year, subject, pdfUrl,  createdBy: req.admin._id });
        await newNotes.save();

        await logActivity({
          adminId: req.admin._id,
          action: 'UPLOAD_NOTE',
          details: `Uploaded note for ${subject} (Year ${year}, Unit ${Unit})`,
          targetId: newNotes._id,
          targetModel: 'Notes',
          ipAddress: req.ip
        });

        res.status(201).json(newNotes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Notes.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.getDashboardNotes = async (req, res) => {
    try {
    let filter = {};

    // admin sees only their own data
    if (req.admin.role === "admin") {
      filter.createdBy = req.admin._id;
    }

    const notes = await Notes.find(filter).populate("createdBy", "name role");
    res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

exports.updateNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedNotes = await Notes.findByIdAndUpdate(id, updates, { new: true });
        
        await logActivity({
          adminId: req.admin._id,
          action: 'UPDATE_NOTE',
          details: `Updated note for ${updatedNotes.subject}`,
          targetId: updatedNotes._id,
          targetModel: 'Notes',
          ipAddress: req.ip
        });

        res.json(updatedNotes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Notes.findById(id);
        await Notes.findByIdAndDelete(id);

        await logActivity({
          adminId: req.admin._id,
          action: 'DELETE_NOTE',
          details: `Deleted note for ${note?.subject || 'unknown'}`,
          targetId: id,
          targetModel: 'Notes',
          ipAddress: req.ip
        });

        res.json({ message: "Notes deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};