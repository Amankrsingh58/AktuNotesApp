const mongoose = require("mongoose");
const Article = require("../models/Article");
const AnalyticsEvent = require("../models/AnalyticsEvent");
const AnalyticsSession = require("../models/AnalyticsSession");
const AnalyticsDaily = require("../models/AnalyticsDaily");
const logActivity = require("../utils/activityLogger");
const geoip = require("geoip-lite");

const DAY = 24 * 60 * 60 * 1000;
const retentionDate = () => new Date(Date.now() + 90 * DAY);
const dayStart = (value = new Date()) => new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
const clean = (value, max = 220) => typeof value === "string" ? value.trim().slice(0, max) : "";

const getClient = (req) => {
  const ua = String(req.headers["user-agent"] || "");
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobile|android|iphone/i.test(ua) ? "mobile" : ua ? "desktop" : "other";
  const browser = /edg\//i.test(ua) ? "Edge" : /firefox\//i.test(ua) ? "Firefox" : /chrome\//i.test(ua) ? "Chrome" : /safari\//i.test(ua) ? "Safari" : "Other";
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const transientIp = (forwarded || req.ip || "").replace(/^::ffff:/, "");
  const derivedCountry = geoip.lookup(transientIp)?.country;
  const countryHeader = String(req.headers["cf-ipcountry"] || req.headers["x-vercel-ip-country"] || derivedCountry || "XX").toUpperCase();
  return { device, browser, country: /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : "XX" };
};

const getSource = (referrer) => {
  if (!referrer) return { source: "direct", referrerHost: "" };
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (!host || host === "cognora.in") return { source: "direct", referrerHost: host };
    if (/google\.|bing\.|yahoo\.|duckduckgo\.|yandex\./.test(host)) return { source: "search", referrerHost: host };
    if (/facebook\.|instagram\.|linkedin\.|twitter\.|x\.com$|reddit\.|youtube\.|whatsapp\./.test(host)) return { source: "social", referrerHost: host };
    return { source: "external", referrerHost: host };
  } catch {
    return { source: "direct", referrerHost: "" };
  }
};

const getRange = (req) => {
  const allowed = { "7d": 7, "30d": 30, "90d": 90, "12m": 366 };
  const days = allowed[req.query.range] || 30;
  const end = req.query.end ? new Date(req.query.end) : new Date();
  const start = req.query.start ? new Date(req.query.start) : new Date(end.getTime() - (days - 1) * DAY);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start || end - start > 366 * DAY) {
    const error = new Error("Invalid date range"); error.status = 400; throw error;
  }
  return { start: dayStart(start), end: new Date(dayStart(end).getTime() + DAY - 1) };
};

const dailyMatch = (range) => ({ date: { $gte: range.start, $lte: range.end } });
const wordCount = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/&[a-z0-9#]+;/gi, " ").trim().split(/\s+/).filter(Boolean).length;
const unsafeHtml = (html = "") => /<\s*(script|iframe|object|embed|form|input|button|svg|math)\b|\bon\w+\s*=|javascript\s*:/i.test(html);

exports.ingest = async (req, res) => {
  try {
    const { eventId, sessionId, type, articleId, slug, targetSlug, value, referrer } = req.body || {};
    const validTypes = new Set(["view", "heartbeat", "scroll", "share", "recommendation_impression", "recommendation_click"]);
    if (!clean(eventId, 160) || !clean(sessionId, 80) || !validTypes.has(type) || !mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({ message: "Invalid analytics event" });
    }
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 3600) {
      return res.status(400).json({ message: "Invalid analytics value" });
    }
    if (type === "scroll" && ![25, 50, 75, 100].includes(numericValue)) return res.status(400).json({ message: "Invalid scroll milestone" });
    if (type === "heartbeat" && (numericValue < 1 || numericValue > 60)) return res.status(400).json({ message: "Invalid heartbeat duration" });

    const article = await Article.findById(articleId).select("slug category tags status");
    if (!article || article.status !== "published") return res.status(404).json({ message: "Article not found" });
    const client = getClient(req);
    const acquisition = getSource(clean(referrer, 500));
    const now = new Date();
    const event = {
      eventId: clean(eventId, 160), sessionId: clean(sessionId, 80), type,
      article: article._id, slug: clean(slug, 220) || article.slug, targetSlug: clean(targetSlug, 220),
      value: numericValue, ...client, ...acquisition,
      category: article.category || "Uncategorized", tags: (article.tags || []).slice(0, 12),
      occurredAt: now, expiresAt: retentionDate()
    };
    try { await AnalyticsEvent.create(event); }
    catch (error) { if (error?.code === 11000) return res.status(202).json({ accepted: true, duplicate: true }); throw error; }

    const existingSession = await AnalyticsSession.findOne({ sessionId: event.sessionId });
    const nextPageViews = (existingSession?.pageViews || 0) + (type === "view" ? 1 : 0);
    const nextActive = (existingSession?.activeSeconds || 0) + (type === "heartbeat" ? numericValue : 0);
    const wasBounce = existingSession ? existingSession.bounceQualified : false;
    const isBounce = nextPageViews === 1 && nextActive < 10;
    await AnalyticsSession.findOneAndUpdate(
      { sessionId: event.sessionId },
      { $set: { lastSeen: now, article: article._id, slug: article.slug, source: acquisition.source, ...client, expiresAt: retentionDate(), bounceQualified: isBounce },
        $setOnInsert: { startedAt: now }, $inc: { pageViews: type === "view" ? 1 : 0, activeSeconds: type === "heartbeat" ? numericValue : 0 } },
      { upsert: true, new: true }
    );

    const increments = {};
    if (type === "view") { increments.views = 1; if (isBounce) increments.bounces = 1; await Article.updateOne({ _id: article._id }, { $inc: { views: 1 } }); }
    if (type === "heartbeat") increments.activeSeconds = numericValue;
    if (type === "share") increments.shares = 1;
    if (type === "scroll" && [25, 50, 75, 100].includes(numericValue)) increments[`scroll${numericValue}`] = 1;
    if (type === "recommendation_impression") increments.recommendationImpressions = 1;
    if (type === "recommendation_click") increments.recommendationClicks = 1;
    if (wasBounce && !isBounce && existingSession?.article) {
      await AnalyticsDaily.updateOne(
        { date: dayStart(now), article: existingSession.article, source: existingSession.source, device: existingSession.device, browser: existingSession.browser, country: existingSession.country },
        { $inc: { bounces: -1 } }
      );
    }
    await AnalyticsDaily.findOneAndUpdate(
      { date: dayStart(now), article: article._id, source: acquisition.source, device: client.device, browser: client.browser, country: client.country },
      { $setOnInsert: { slug: article.slug, category: article.category || "Uncategorized", tags: article.tags || [] }, $inc: increments },
      { upsert: true }
    );
    res.status(202).json({ accepted: true });
  } catch (error) {
    console.error("Analytics ingest error:", error);
    res.status(500).json({ message: "Unable to record analytics" });
  }
};

exports.overview = async (req, res) => {
  try {
    const range = getRange(req);
    const [totals = {}, articleStats, authorStats, topArticles] = await Promise.all([
      AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: null, views: { $sum: "$views" }, activeSeconds: { $sum: "$activeSeconds" }, shares: { $sum: "$shares" }, bounces: { $sum: "$bounces" }, scroll100: { $sum: "$scroll100" }, impressions: { $sum: "$recommendationImpressions" }, clicks: { $sum: "$recommendationClicks" }, activeArticles: { $addToSet: "$article" } } }]).then(x => x[0]),
      Article.aggregate([{ $match: { status: "published" } }, { $project: { views: { $ifNull: ["$views", 0] }, likes: { $size: { $ifNull: ["$likes", []] } }, comments: { $size: { $ifNull: ["$comments", []] } } } }, { $group: { _id: null, published: { $sum: 1 }, allTimeViews: { $sum: "$views" }, likes: { $sum: "$likes" }, comments: { $sum: "$comments" } } }]).then(x => x[0] || {}),
      AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: "$article", views: { $sum: "$views" }, shares: { $sum: "$shares" } } }, { $lookup: { from: "articles", localField: "_id", foreignField: "_id", as: "article" } }, { $unwind: "$article" }, { $group: { _id: "$article.author", articles: { $sum: 1 }, views: { $sum: "$views" }, shares: { $sum: "$shares" } } }, { $lookup: { from: "articleusers", localField: "_id", foreignField: "_id", as: "author" } }, { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }, { $project: { _id: 0, authorId: "$_id", name: { $ifNull: ["$author.name", "Deleted author"] }, articles: 1, views: 1, shares: 1 } }, { $sort: { views: -1, shares: -1 } }, { $limit: 10 }]),
      AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: "$article", slug: { $first: "$slug" }, views: { $sum: "$views" }, activeSeconds: { $sum: "$activeSeconds" }, shares: { $sum: "$shares" }, completions: { $sum: "$scroll100" }, bounces: { $sum: "$bounces" } } }, { $sort: { views: -1 } }, { $limit: 12 }, { $lookup: { from: "articles", localField: "_id", foreignField: "_id", as: "article" } }, { $project: { _id: 0, articleId: "$_id", slug: 1, title: { $ifNull: [{ $arrayElemAt: ["$article.title", 0] }, "$slug"] }, views: 1, shares: 1, averageReadSeconds: { $cond: [{ $gt: ["$views", 0] }, { $round: [{ $divide: ["$activeSeconds", "$views"] }, 0] }, 0] }, completionRate: { $cond: [{ $gt: ["$views", 0] }, { $multiply: [{ $divide: ["$completions", "$views"] }, 100] }, 0] }, bounceRate: { $cond: [{ $gt: ["$views", 0] }, { $multiply: [{ $divide: ["$bounces", "$views"] }, 100] }, 0] } } }])
    ]);
    const views = totals.views || 0;
    res.json({ range, metrics: { views, allTimeViews: articleStats.allTimeViews || 0, averageReadSeconds: views ? Math.round((totals.activeSeconds || 0) / views) : 0, bounceRate: views ? Math.max(0, (totals.bounces || 0) / views * 100) : 0, completionRate: views ? (totals.scroll100 || 0) / views * 100 : 0, shares: totals.shares || 0, likes: articleStats.likes || 0, comments: articleStats.comments || 0, publishedArticles: articleStats.published || 0, activeArticles: totals.activeArticles?.length || 0, recommendationCtr: totals.impressions ? (totals.clicks || 0) / totals.impressions * 100 : 0 }, authors: authorStats, topArticles, unavailable: ["Age and gender", "Ratings", "Subscription conversions"] });
  } catch (error) { res.status(error.status || 500).json({ message: error.message }); }
};

exports.timeseries = async (req, res) => {
  try {
    const range = getRange(req);
    const days = Math.ceil((range.end - range.start + 1) / DAY);
    const monthly = days > 90;
    const groupKey = monthly
      ? { $dateToString: { format: "%Y-%m-01", date: "$date" } }
      : "$date";
    const rows = await AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: groupKey, views: { $sum: "$views" }, activeSeconds: { $sum: "$activeSeconds" }, shares: { $sum: "$shares" }, bounces: { $sum: "$bounces" } } }, { $sort: { _id: 1 } }, { $project: { _id: 0, date: "$_id", views: 1, activeSeconds: 1, shares: 1, bounces: 1 } }]);
    res.json(rows);
  } catch (error) { res.status(error.status || 500).json({ message: error.message }); }
};

exports.breakdowns = async (req, res) => {
  try {
    const range = getRange(req);
    const group = (field, limit = 12) => AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: `$${field}`, views: { $sum: "$views" }, shares: { $sum: "$shares" } } }, { $sort: { views: -1 } }, { $limit: limit }, { $project: { _id: 0, name: { $ifNull: ["$_id", "Unknown"] }, views: 1, shares: 1 } }]);
    const [categories, sources, devices, browsers, countries, tags, categoryTrends] = await Promise.all([group("category"), group("source"), group("device"), group("browser"), group("country"), AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $unwind: "$tags" }, { $group: { _id: "$tags", views: { $sum: "$views" } } }, { $sort: { views: -1 } }, { $limit: 15 }, { $project: { _id: 0, name: "$_id", views: 1 } }]), AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: { month: { $dateToString: { format: "%Y-%m", date: "$date" } }, category: "$category" }, views: { $sum: "$views" } } }, { $sort: { "_id.month": 1, views: -1 } }, { $project: { _id: 0, month: "$_id.month", category: { $ifNull: ["$_id.category", "Uncategorized"] }, views: 1 } }])]);
    res.json({ categories, sources, devices, browsers, countries, tags, categoryTrends });
  } catch (error) { res.status(error.status || 500).json({ message: error.message }); }
};

exports.realtime = async (_req, res) => {
  try {
    const since = new Date(Date.now() - 60 * 1000);
    const [activeVisitors, articles] = await Promise.all([
      AnalyticsSession.countDocuments({ lastSeen: { $gte: since } }),
      AnalyticsSession.aggregate([{ $match: { lastSeen: { $gte: since }, article: { $ne: null } } }, { $group: { _id: "$article", slug: { $first: "$slug" }, readers: { $sum: 1 } } }, { $sort: { readers: -1 } }, { $limit: 10 }, { $lookup: { from: "articles", localField: "_id", foreignField: "_id", as: "article" } }, { $project: { _id: 0, articleId: "$_id", slug: 1, readers: 1, title: { $ifNull: [{ $arrayElemAt: ["$article.title", 0] }, "$slug"] } } }])
    ]);
    res.json({ activeVisitors, articles, updatedAt: new Date() });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.historical = async (req, res) => {
  try {
    const range = getRange(req);
    const [monthly, lifecycle] = await Promise.all([
      AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, views: { $sum: "$views" }, shares: { $sum: "$shares" }, activeSeconds: { $sum: "$activeSeconds" } } }, { $sort: { _id: 1 } }, { $project: { _id: 0, month: "$_id", views: 1, shares: 1, activeSeconds: 1 } }]),
      AnalyticsDaily.aggregate([{ $match: dailyMatch(range) }, { $lookup: { from: "articles", localField: "article", foreignField: "_id", as: "articleDoc" } }, { $set: { publishedAt: { $arrayElemAt: ["$articleDoc.createdAt", 0] } } }, { $set: { ageDays: { $dateDiff: { startDate: { $ifNull: ["$publishedAt", "$date"] }, endDate: "$date", unit: "day" } } } }, { $set: { stage: { $switch: { branches: [{ case: { $lt: ["$ageDays", 7] }, then: "First 7 days" }, { case: { $lt: ["$ageDays", 30] }, then: "8–30 days" }, { case: { $lt: ["$ageDays", 90] }, then: "31–90 days" }], default: "90+ days" } } } }, { $group: { _id: "$stage", views: { $sum: "$views" }, articles: { $addToSet: "$article" } } }, { $project: { _id: 0, stage: "$_id", views: 1, articleCount: { $size: "$articles" } } }])
    ]);
    const currentYear = new Date().getUTCFullYear();
    const current = monthly.filter(row => row.month.startsWith(String(currentYear))).reduce((sum, row) => sum + row.views, 0);
    const previous = monthly.filter(row => row.month.startsWith(String(currentYear - 1))).reduce((sum, row) => sum + row.views, 0);
    res.json({ monthly, lifecycle, yearOverYear: { currentYear, current, previousYear: currentYear - 1, previous, growthPercent: previous ? (current - previous) / previous * 100 : null } });
  } catch (error) { res.status(error.status || 500).json({ message: error.message }); }
};

exports.articles = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(50, Math.max(10, Number(req.query.limit) || 20));
    const search = clean(req.query.search, 80), status = clean(req.query.status, 20);
    const filter = {};
    if (search) filter.$or = [{ title: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }, { slug: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }];
    if (["draft", "published"].includes(status)) filter.status = status;
    const [items, total] = await Promise.all([Article.find(filter).populate("author", "name email profilePic").sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Article.countDocuments(filter)]);
    res.json({ items: items.map(a => ({ ...a, category: a.category || "Uncategorized", likesCount: a.likes?.length || 0, commentsCount: a.comments?.length || 0, engagement: (a.likes?.length || 0) + (a.comments?.length || 0) })), page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateArticle = async (req, res) => {
  try {
    const allowed = ["title", "summary", "content", "coverImage", "seoTitle", "seoDescription", "status"];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    if (req.body.category !== undefined) updates.category = clean(req.body.category, 80) || "Uncategorized";
    if (req.body.tags !== undefined) updates.tags = Array.isArray(req.body.tags) ? req.body.tags.map(x => clean(x, 60)).filter(Boolean).slice(0, 12) : [];
    if (updates.status && !["draft", "published"].includes(updates.status)) return res.status(400).json({ message: "Invalid status" });
    const current = await Article.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Article not found" });
    const next = { title: updates.title ?? current.title, summary: updates.summary ?? current.summary, content: updates.content ?? current.content, status: updates.status ?? current.status };
    if (unsafeHtml(next.content)) return res.status(400).json({ message: "Article content contains unsupported or unsafe markup" });
    if (next.status === "published" && (String(next.title).trim().length < 12 || String(next.summary).trim().length < 60 || wordCount(next.content) < 300)) {
      return res.status(400).json({ message: "Published articles require a 12-character title, 60-character summary, and at least 300 meaningful words" });
    }
    if (updates.content !== undefined) updates.readTime = Math.max(1, Math.ceil(wordCount(updates.content) / 200));
    const article = await Article.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    await logActivity({ adminId: req.admin._id, action: "UPDATE_ARTICLE", details: `Updated Cognora article \"${article.title}\"`, targetId: article._id, targetModel: "Article", ipAddress: req.ip });
    res.json(article);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    await logActivity({ adminId: req.admin._id, action: "DELETE_ARTICLE", details: `Deleted Cognora article \"${article.title}\"`, targetId: article._id, targetModel: "Article", ipAddress: req.ip });
    await article.deleteOne();
    res.json({ message: "Article deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports._test = { getSource, dayStart, wordCount, unsafeHtml };
