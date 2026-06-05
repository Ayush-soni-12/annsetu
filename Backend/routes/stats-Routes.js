const express = require("express");
const router = express.Router();
const { getGlobalStats } = require("../controllers/stats-Controllers");

router.get("/", getGlobalStats);

module.exports = router;
