const Donation = require("../models/donation");
const User = require("../models/user"); // needed to fetch donor email
const { sendDonationConfirmation } = require("../services/emailService");
const redisClient = require("../config/redis");
const controlPlane = require("../middlewares/neuralcontrol");

// POST /api/donations — Create a new donation
exports.createDonation = async (req, res) => {
  try {
    if (req.controlPlane) {
      if (req.controlPlane.isRateLimitedCustomer) return res.status(429).json({ success: false, message: "Rate limit exceeded." });
      if (req.controlPlane.isLoadShedding) return res.status(503).json({ success: false, message: "Service under heavy load." });
    }
    const span = req.controlPlane?.startSpan?.("db:createDonation");
    const donation = await controlPlane.withDbTimeout("/db/donations/create", () => Donation.create({
      donor: req.user.id,
      donorName, phone, foodName, foodType, foodCategory,
      quantity, serves: Number(serves),
      pickupTime: new Date(pickupTime),
      address,
      instructions: instructions || "",
      ...(foodImageUrl && { foodImageUrl }),
      ...(assignedNgo && { assignedNgo, status: "ASSIGNED" }),
      ...(safetyScore && { safetyScore }),
      ...(safetyVerdict && { safetyVerdict }),
      ...(safetyNotes && { safetyNotes }),
    }));

    // Fetch the donor to get their email address
    const donorUser = await controlPlane.withDbTimeout("/db/users/find", () => User.findById(req.user.id));
    if (donorUser) {
      sendDonationConfirmation(donorUser.email, donorName, foodName, serves);
    }
    span?.end?.({ donationId: donation._id.toString() });

    return res.status(201).json({
      success: true,
      message: "Donation submitted successfully! Our team will contact you soon.",
      donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/donations/my — Get all donations by the logged-in user
exports.getMyDonations = async (req, res) => {
  try {
    if (req.controlPlane) {
      if (req.controlPlane.isRateLimitedCustomer) return res.status(429).json({ success: false, message: "Rate limit exceeded." });
      if (req.controlPlane.isLoadShedding) return res.status(503).json({ success: false, message: "Service under heavy load." });
      
      if (req.controlPlane.shouldCache) {
        try {
          const cachedData = await redisClient.get(`myDonations:${req.user.id}`);
          if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
          }
        } catch (cacheErr) {
          console.error("Redis cache error:", cacheErr);
        }
      }
    }
    const span = req.controlPlane?.startSpan?.("db:getMyDonations");
    const donations = await controlPlane.withDbTimeout("/db/donations/find", () =>
      Donation.find({ donor: req.user.id })
        .populate("assignedNgo", "orgName logoUrl contactPhone")
        .sort({ createdAt: -1 })
    );
    span?.end?.({ count: donations.length });

    const result = {
      success: true,
      count: donations.length,
      donations,
    };
    if (req.controlPlane?.shouldCache) {
      try {
        await redisClient.setEx(`myDonations:${req.user.id}`, 60, JSON.stringify(result));
      } catch (cacheErr) {
        console.error("Redis set error:", cacheErr);
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/donations/:id — Get a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    if (req.controlPlane) {
      if (req.controlPlane.isRateLimitedCustomer) return res.status(429).json({ success: false, message: "Rate limit exceeded." });
      if (req.controlPlane.isLoadShedding) return res.status(503).json({ success: false, message: "Service under heavy load." });
    }
    const span = req.controlPlane?.startSpan?.("db:getDonationById");
    const donation = await controlPlane.withDbTimeout("/db/donations/find", () =>
      Donation.findById(req.params.id).populate("donor", "name email")
    );
    span?.end?.();

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Only the donor can view their own donation (for now)
    if (donation.donor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/donations/stats — Get personal impact stats for the logged-in donor
exports.getMyStats = async (req, res) => {
  try {
    if (req.controlPlane) {
      if (req.controlPlane.isRateLimitedCustomer) return res.status(429).json({ success: false, message: "Rate limit exceeded." });
      if (req.controlPlane.isLoadShedding) return res.status(503).json({ success: false, message: "Service under heavy load." });
    }
    const span = req.controlPlane?.startSpan?.("db:getMyStats");
    const donations = await controlPlane.withDbTimeout("/db/donations/find", () =>
      Donation.find({ donor: req.user.id })
    );
    span?.end?.({ count: donations.length });

    const totalDonations = donations.length;

    // Sum up all meals across every donation
    const totalMeals = donations.reduce((sum, d) => sum + (d.serves || 0), 0);

    // Count only donations that have been fully delivered
    const deliveredCount = donations.filter(
      (d) => d.status === "DELIVERED"
    ).length;

    // Environmental impact: ~2.5 kg CO₂ saved per meal rescued from waste
    const co2Saved = parseFloat((totalMeals * 2.5).toFixed(1));

    return res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        totalMeals,
        deliveredCount,
        co2Saved,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
