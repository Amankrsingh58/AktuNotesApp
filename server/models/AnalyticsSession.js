const mongoose = require("mongoose");

const AnalyticsSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, maxlength: 80 },
  startedAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now, index: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  slug: { type: String, maxlength: 220 },
  pageViews: { type: Number, default: 0 },
  activeSeconds: { type: Number, default: 0 },
  bounceQualified: { type: Boolean, default: true },
  source: { type: String, default: "direct" },
  device: { type: String, default: "other" },
  browser: { type: String, default: "Other" },
  country: { type: String, default: "XX" },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { versionKey: false });

module.exports = mongoose.model("AnalyticsSession", AnalyticsSessionSchema);
