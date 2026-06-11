const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validate, donationSchema } = require("../middlewares/validate");
const controlPlane = require("../middlewares/neuralcontrol");
const {
  createDonation,
  getMyDonations,
  getDonationById,
  getMyStats,
} = require("../controllers/donation-Controllers");

// All routes below require the user to be logged in
router.post("/", auth, validate(donationSchema), controlPlane.middleware("/api/donations", { priority: "critical" }), createDonation);
router.get("/my", auth, controlPlane.middleware("/api/donations/my", { priority: "medium" }), getMyDonations);
router.get("/stats", auth, controlPlane.middleware("/api/donations/stats", { priority: "medium" }), getMyStats);    // ⚠️ must be before /:id
router.get("/:id", auth, controlPlane.middleware("/api/donations/:id", { priority: "high" }), getDonationById);

module.exports = router;
