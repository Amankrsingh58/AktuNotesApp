const mongoose = require("mongoose");

const AnalyticsEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, maxlength: 160 },
  sessionId: { type: String, required: true, index: true, maxlength: 80 },
  type: {
    type: String,
    required: true,
    enum: ["view", "heartbeat", "scroll", "share", "recommendation_impression", "recommendation_click"]
  },
  article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", index: true },
  slug: { type: String, maxlength: 220 },
  targetSlug: { type: String, maxlength: 220 },
  value: { type: Number, min: 0, max: 3600, default: 0 },
  source: { type: String, enum: ["direct", "search", "social", "external"], default: "direct" },
  referrerHost: { type: String, maxlength: 180, default: "" },
  device: { type: String, enum: ["desktop", "mobile", "tablet", "other"], default: "other" },
  browser: { type: String, maxlength: 40, default: "Other" },
  country: { type: String, maxlength: 2, default: "XX" },
  category: { type: String, maxlength: 80, default: "Uncategorized" },
  tags: [{ type: String, maxlength: 60 }],
  occurredAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { versionKey: false });

AnalyticsEventSchema.index({ occurredAt: 1, type: 1, article: 1 });

module.exports = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
