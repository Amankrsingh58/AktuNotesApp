const mongoose = require("mongoose");
const PYQ = require("../models/PYQ");
const logActivity = require("../utils/activityLogger");


exports.createPYQ = async (req, res) => {
    try {
        const { year, AcademicYear, semester, subject, pdfUrl } = req.body;

        if (!year || !AcademicYear || !subject || !pdfUrl) {
            return res.status(400).json({ message: "Year, Academic Year, Subject, and PDF URL are required." });
        }

        const newPYQ = new PYQ({ year, AcademicYear, semester:year, subject, pdfUrl,  createdBy: req.admin._id });
        await newPYQ.save();

        await logActivity({
          adminId: req.admin._id,
          action: 'UPLOAD_PYQ',
          details: `Uploaded PYQ for ${subject} (Year ${year}, Academic Year ${AcademicYear})`,
          targetId: newPYQ._id,
          targetModel: 'PYQ',
          ipAddress: req.ip
        });

        res.status(201).json(newPYQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPYQS = async (req, res) => {
    try {
        const pyqs = await PYQ.find();
        res.json(pyqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.getDashboardPYQs = async (req, res) => {
    try {
    let filter = {};

    // admin sees only their own data
    if (req.admin.role === "admin") {
      filter.createdBy = req.admin._id;
    }

    const pyqs = await PYQ.find(filter).populate("createdBy", "name role");
    res.json(pyqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

exports.updatePYQ = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedPYQ = await PYQ.findByIdAndUpdate(id, updates, { new: true });
        
        await logActivity({
          adminId: req.admin._id,
          action: 'UPDATE_PYQ',
          details: `Updated PYQ for ${updatedPYQ.subject}`,
          targetId: updatedPYQ._id,
          targetModel: 'PYQ',
          ipAddress: req.ip
        });

        res.json(updatedPYQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePYQ = async (req, res) => {
    try {
        const { id } = req.params;
        const pyq = await PYQ.findById(id);
        await PYQ.findByIdAndDelete(id);

        await logActivity({
          adminId: req.admin._id,
          action: 'DELETE_PYQ',
          details: `Deleted PYQ for ${pyq?.subject || 'unknown'}`,
          targetId: id,
          targetModel: 'PYQ',
          ipAddress: req.ip
        });

        res.json({ message: "PYQ deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};