const User = require("../models/user");
const NgoProfile = require("../models/ngoProfile");
const Donation = require("../models/donation");
const { sendNgoApprovalEmail } = require("../services/emailService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllNgos = async (req, res) => {
  try {
    const ngos = await NgoProfile.find()
      .populate("user", "name email isVerified")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: ngos.length, ngos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveNgo = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const ngo = await NgoProfile.findById(ngoId).populate("user");
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    if (ngo.verified) {
      return res.status(400).json({ success: false, message: "NGO is already verified" });
    }

    // Update NgoProfile
    ngo.verified = true;
    await ngo.save();

    // Update User
    if (ngo.user && ngo.user._id) {
      await User.findByIdAndUpdate(ngo.user._id, { isVerified: true });
      // Send email notification
      sendNgoApprovalEmail(ngo.user.email, ngo.orgName);
    }

    return res.status(200).json({
      success: true,
      message: "NGO approved successfully",
      ngo
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email")
      .populate("assignedNgo", "orgName contactPhone")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: donations.length, donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    const previousStatus = donation.status;
    donation.status = status;
    await donation.save();

    // If status changed to DELIVERED, update NGO stats
    if (status === "DELIVERED" && previousStatus !== "DELIVERED" && donation.assignedNgo) {
      await NgoProfile.findByIdAndUpdate(donation.assignedNgo, {
        $inc: { 
          totalMealsReceived: donation.serves || 0,
          totalDonationsReceived: 1
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: `Donation status updated to ${status}`,
      donation
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
