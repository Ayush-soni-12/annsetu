const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  getAllNgos,
  getNgoById,
  getMyProfile,
  updateMyProfile,
  getNgoDonations,
} = require("../controllers/ngo-Controllers");

// ── Public routes (no auth needed) ───────────────────────────
router.get("/", getAllNgos);               // GET /api/ngos?city=Delhi&dietaryPref=Vegetarian
// ── NGO auth-protected routes ─────────────────────────────────
router.get("/my-profile", auth, getMyProfile);          // GET  /api/ngos/my-profile
router.put("/my-profile", auth, updateMyProfile);       // PUT  /api/ngos/my-profile
router.get("/donations", auth, getNgoDonations);        // GET  /api/ngos/donations

// ── Public single profile route ────────────────────────────────
router.get("/:id", getNgoById);           // GET /api/ngos/:id


module.exports = router;
