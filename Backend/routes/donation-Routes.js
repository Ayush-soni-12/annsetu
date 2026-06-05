const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validate, donationSchema } = require("../middlewares/validate");
const {
  createDonation,
  getMyDonations,
  getDonationById,
  getMyStats,
} = require("../controllers/donation-Controllers");

// All routes below require the user to be logged in
router.post("/", auth, validate(donationSchema), createDonation);
router.get("/my", auth, getMyDonations);
router.get("/stats", auth, getMyStats);    // ⚠️ must be before /:id
router.get("/:id", auth, getDonationById);

module.exports = router;
