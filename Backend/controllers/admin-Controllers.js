const User = require("../models/user");
const NgoProfile = require("../models/ngoProfile");
const Donation = require("../models/donation");
const { sendNgoApprovalEmail, sendDonationDeliveredEmail } = require("../services/emailService");

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

    const donation = await Donation.findById(donationId)
      .populate("donor", "name email")
      .populate("assignedNgo", "orgName");

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    const previousStatus = donation.status;
    donation.status = status;
    await donation.save();

    // If status changed to DELIVERED, update NGO stats and send emails
    if (status === "DELIVERED" && previousStatus !== "DELIVERED" && donation.assignedNgo) {
      // Update NGO Stats
      await NgoProfile.findByIdAndUpdate(donation.assignedNgo._id, {
        $inc: { 
          totalMealsReceived: donation.serves || 0,
          totalDonationsReceived: 1
        }
      });

      // Send emails to Donor (and optionally NGO)
      if (donation.donor && donation.donor.email) {
        sendDonationDeliveredEmail(
          donation.donor.email, 
          donation.donor.name, 
          donation.assignedNgo.orgName, 
          donation.foodName, 
          donation.serves
        );
      }
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

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Also delete associated NGO profile if it exists
    if (user.role === "NGO") {
      await NgoProfile.findOneAndDelete({ user: user._id });
    }

    // Optionally delete donations made by this user, but usually it's better to keep records
    // or mark them as anonymous. Let's delete them for complete cleanup.
    await Donation.deleteMany({ donor: user._id });

    return res.status(200).json({ success: true, message: "User and associated records deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNgo = async (req, res) => {
  try {
    const ngo = await NgoProfile.findByIdAndDelete(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

    // Also delete the associated User account
    await User.findByIdAndDelete(ngo.user);

    // Unassign donations assigned to this NGO
    await Donation.updateMany({ assignedNgo: ngo._id }, { $unset: { assignedNgo: "" }, status: "PENDING" });

    return res.status(200).json({ success: true, message: "NGO and associated user deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });

    return res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
