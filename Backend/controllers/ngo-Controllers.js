const NgoProfile = require("../models/ngoProfile");

// GET /api/ngos — Public: list all admin-verified NGOs
exports.getAllNgos = async (req, res) => {
  try {
    const { city, dietaryPref, foodType } = req.query;

    const filter = { verified: true };
    if (city) filter.city = new RegExp(city, "i");
    if (dietaryPref) filter.dietaryPref = { $in: [dietaryPref] };
    if (foodType) filter.acceptedFoodTypes = { $in: [foodType] };

    const ngos = await NgoProfile.find(filter)
      .populate("user", "name email")   // attach contact person name
      .sort({ totalMealsReceived: -1 }) // highest impact first
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: ngos.length,
      ngos,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ngos/:id — Public: get a single NGO by its profile ID
exports.getNgoById = async (req, res) => {
  try {
    const ngo = await NgoProfile.findById(req.params.id)
      .populate("user", "name email")
      .select("-__v");

    if (!ngo || !ngo.verified) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    return res.status(200).json({ success: true, ngo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ngos/my-profile — NGO: get own profile (auth required, role: NGO)
exports.getMyProfile = async (req, res) => {
  try {
    const ngo = await NgoProfile.findOne({ user: req.user.id }).select("-__v");

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO profile not found for this account",
      });
    }

    return res.status(200).json({ success: true, ngo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/ngos/my-profile — NGO: update own profile
exports.updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "orgName", "description", "address", "city", "state", "pincode",
      "contactPhone", "website", "capacityMeals", "acceptedFoodTypes",
      "dietaryPref", "operatingHours", "focusArea", "logoUrl", "registrationNo",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const ngo = await NgoProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      ngo,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ngos/donations — NGO: get donations assigned to this NGO
const Donation = require("../models/donation");
exports.getNgoDonations = async (req, res) => {
  try {
    const ngo = await NgoProfile.findOne({ user: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    const donations = await Donation.find({ assignedNgo: ngo._id })
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
