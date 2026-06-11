const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const controlPlane = require("../middlewares/neuralcontrol");
const {
  getAllNgos,
  getNgoById,
  getMyProfile,
  updateMyProfile,
  getNgoDonations,
} = require("../controllers/ngo-Controllers");

// ── Public routes (no auth needed) ───────────────────────────
router.get("/", controlPlane.middleware("/api/ngos", { priority: "medium" }), getAllNgos);               // GET /api/ngos?city=Delhi&dietaryPref=Vegetarian
// ── NGO auth-protected routes ─────────────────────────────────
router.get("/my-profile", auth, controlPlane.middleware("/api/ngos/my-profile", { priority: "high" }), getMyProfile);          // GET  /api/ngos/my-profile
router.put("/my-profile", auth, controlPlane.middleware("/api/ngos/my-profile", { priority: "high" }), updateMyProfile);       // PUT  /api/ngos/my-profile
router.get("/donations", auth, controlPlane.middleware("/api/ngos/donations", { priority: "high" }), getNgoDonations);        // GET  /api/ngos/donations

// ── Public single profile route ────────────────────────────────
router.get("/:id", controlPlane.middleware("/api/ngos/:id", { priority: "low" }), getNgoById);           // GET /api/ngos/:id


module.exports = router;
