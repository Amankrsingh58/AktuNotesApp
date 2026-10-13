const express = require("express");
const crypto = require("crypto");
const controller = require("../controllers/analytics.controller");
const { adminAuth, allowRoles } = require("../middlewares/auth");

const router = express.Router();
const attempts = new Map();
const rateLimit = (req, res, next) => {
  const key = crypto.createHash("sha256").update(req.ip || "unknown").digest("hex"), now = Date.now();
  const entry = attempts.get(key) || { start: now, count: 0 };
  if (now - entry.start > 60_000) { entry.start = now; entry.count = 0; }
  entry.count += 1; attempts.set(key, entry);
  if (attempts.size > 10_000) attempts.clear();
  if (entry.count > 180) return res.status(429).json({ message: "Too many analytics events" });
  next();
};

router.post("/events", rateLimit, controller.ingest);
router.get("/overview", adminAuth, allowRoles("super_admin"), controller.overview);
router.get("/timeseries", adminAuth, allowRoles("super_admin"), controller.timeseries);
router.get("/breakdowns", adminAuth, allowRoles("super_admin"), controller.breakdowns);
router.get("/realtime", adminAuth, allowRoles("super_admin"), controller.realtime);
router.get("/historical", adminAuth, allowRoles("super_admin"), controller.historical);
router.get("/articles", adminAuth, allowRoles("super_admin"), controller.articles);
router.patch("/articles/:id", adminAuth, allowRoles("super_admin"), controller.updateArticle);
router.delete("/articles/:id", adminAuth, allowRoles("super_admin"), controller.deleteArticle);

module.exports = router;
