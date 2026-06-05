const Donation = require("../models/donation");

// POST /api/donations — Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const {
      donorName,
      phone,
      foodName,
      foodType,
      foodCategory,
      quantity,
      serves,
      pickupTime,
      address,
      instructions,
      foodImageUrl,
      assignedNgo,
    } = req.body;

    const donation = await Donation.create({
      donor: req.user.id, // comes from auth middleware (JWT)
      donorName,
      phone,
      foodName,
      foodType,
      foodCategory,
      quantity,
      serves: Number(serves),
      pickupTime: new Date(pickupTime),
      address,
      instructions: instructions || "",
      ...(foodImageUrl && { foodImageUrl }),
      ...(assignedNgo && { 
        assignedNgo, 
        status: "ASSIGNED" // Automatically move to ASSIGNED if directly given to an NGO
      }),
    });

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
    const donations = await Donation.find({ donor: req.user.id })
      .populate("assignedNgo", "orgName logoUrl contactPhone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
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
    const donation = await Donation.findById(req.params.id).populate(
      "donor",
      "name email"
    );

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
    const donations = await Donation.find({ donor: req.user.id });

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
