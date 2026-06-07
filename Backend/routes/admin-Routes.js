const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");
const {
  getAllUsers,
  getAllNgos,
  approveNgo,
  getAllDonations,
  updateDonationStatus
} = require("../controllers/admin-Controllers");

// Apply auth and isAdmin middleware to all admin routes
router.use(auth, isAdmin);

// Users
router.get("/users", getAllUsers);

// NGOs
router.get("/ngos", getAllNgos);
router.put("/ngos/:ngoId/approve", approveNgo);

// Donations
router.get("/donations", getAllDonations);
router.put("/donations/:donationId/status", updateDonationStatus);

module.exports = router;
