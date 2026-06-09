const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");
const {
  getAllUsers,
  getAllNgos,
  approveNgo,
  getAllDonations,
  updateDonationStatus,
  deleteUser,
  deleteNgo,
  deleteDonation
} = require("../controllers/admin-Controllers");

// Apply auth and isAdmin middleware to all admin routes
router.use(auth, isAdmin);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// NGOs
router.get("/ngos", getAllNgos);
router.put("/ngos/:ngoId/approve", approveNgo);
router.delete("/ngos/:id", deleteNgo);

// Donations
router.get("/donations", getAllDonations);
router.put("/donations/:donationId/status", updateDonationStatus);
router.delete("/donations/:id", deleteDonation);

module.exports = router;
