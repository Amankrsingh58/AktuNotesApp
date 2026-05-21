const mongoose = require("mongoose");
const PyqDownloadCount = require("../models/PyqDownloadCount");
const NotesDownloadCount = require("../models/NotesDownloadCount");
const Admin = require("../models/Admin");
const Notes = require("../models/Notes");
const PYQ = require("../models/PYQ");

const ActivityLog = require("../models/ActivityLog");

exports.getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('admin', 'name email');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [adminCount, notesCount, pyqCount, pyqDownloads, noteDownloads, recentNotes, recentPyqs] = await Promise.all([
            Admin.countDocuments(),
            Notes.countDocuments(),
            PYQ.countDocuments(),
            PyqDownloadCount.find(),
            NotesDownloadCount.find(),
            Notes.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email'),
            PYQ.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email')
        ]);

        const totalPyqDownloads = pyqDownloads.reduce((acc, curr) => acc + curr.downloadCount, 0);
        const totalNoteDownloads = noteDownloads.reduce((acc, curr) => acc + curr.downloadCount, 0);

        // Combine and sort recent activities
        const activities = [
            ...recentNotes.map(n => ({ ...n._doc, type: 'note' })),
            ...recentPyqs.map(p => ({ ...p._doc, type: 'pyq' }))
        ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

        res.json({
            admins: adminCount,
            notes: notesCount,
            pyqs: pyqCount,
            totalDownloads: totalPyqDownloads + totalNoteDownloads,
            pyqDownloadBreakdown: pyqDownloads,
            noteDownloadBreakdown: noteDownloads,
            recentActivity: activities
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPYQDownloadCounts = async (req, res) => {
    try {
        const counts = await PyqDownloadCount.find();
        res.json(counts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.updatePYQDownloadCount = async (req, res) => {
  try {
    let { year } = req.body;
    year = Number(year)
    if (![1, 2, 3, 4].includes(year)) {
      return res.status(400).json({ message: "Invalid year" });
    }

    await PyqDownloadCount.findOneAndUpdate(
      { year },
      { $inc: { downloadCount: 1 } },
      { upsert: true, new: true }
    );

    res.json({ message: "PYQ Download count updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNotesDownloadCount = async (req, res) => {
    try {
      let { year } = req.body;
      year = Number(year)
      if (![1, 2, 3, 4].includes(year)) {
        return res.status(400).json({ message: "Invalid year" });
      }
  
      await NotesDownloadCount.findOneAndUpdate(
        { year },
        { $inc: { downloadCount: 1 } },
        { upsert: true, new: true }
      );
  
      res.json({ message: "Notes Download count updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
