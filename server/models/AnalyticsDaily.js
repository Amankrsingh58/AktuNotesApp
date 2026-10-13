const mongoose = require("mongoose");

const AnalyticsDailySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
  slug: { type: String, required: true },
  category: { type: String, default: "Uncategorized" },
  tags: [{ type: String }],
  source: { type: String, default: "direct" },
  device: { type: String, default: "other" },
  browser: { type: String, default: "Other" },
  country: { type: String, default: "XX" },
  views: { type: Number, default: 0 },
  activeSeconds: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  scroll25: { type: Number, default: 0 },
  scroll50: { type: Number, default: 0 },
  scroll75: { type: Number, default: 0 },
  scroll100: { type: Number, default: 0 },
  recommendationImpressions: { type: Number, default: 0 },
  recommendationClicks: { type: Number, default: 0 },
  bounces: { type: Number, default: 0 }
}, { timestamps: true });

AnalyticsDailySchema.index({ date: 1, article: 1, source: 1, device: 1, browser: 1, country: 1 }, { unique: true });
AnalyticsDailySchema.index({ date: 1, category: 1 });

module.exports = mongoose.model("AnalyticsDaily", AnalyticsDailySchema);
