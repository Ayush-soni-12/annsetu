const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai-Controllers");
const { auth } = require("../middlewares/auth");
const controlPlane = require("../middlewares/neuralcontrol");

// Note: Using auth so only logged in users can use the AI (prevents spam/abuse)
router.post("/food-safety", auth, controlPlane.middleware("/api/ai/food-safety", { priority: "medium" }), aiController.analyzeFoodSafety);
router.post("/match-donation", auth, controlPlane.middleware("/api/ai/match-donation", { priority: "high" }), aiController.matchDonation);
router.post("/chat", auth, controlPlane.middleware("/api/ai/chat", { priority: "critical" }), aiController.annaChat);

module.exports = router;
