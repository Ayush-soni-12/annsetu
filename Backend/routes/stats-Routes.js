const express = require("express");
const router = express.Router();
const { getGlobalStats } = require("../controllers/stats-Controllers");
const controlPlane = require("../middlewares/neuralcontrol");

router.get("/", controlPlane.middleware("/api/stats", { priority: "medium" }), getGlobalStats);

module.exports = router;
