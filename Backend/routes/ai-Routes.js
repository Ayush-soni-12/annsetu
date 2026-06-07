const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai-Controllers");
const { auth } = require("../middlewares/auth");

// Note: Using auth so only logged in users can use the AI (prevents spam/abuse)
router.post("/food-safety", auth, aiController.analyzeFoodSafety);

module.exports = router;
