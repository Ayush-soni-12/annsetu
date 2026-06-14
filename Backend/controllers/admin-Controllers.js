const User = require("../models/user");
const NgoProfile = require("../models/ngoProfile");
const Donation = require("../models/donation");
const { sendNgoApprovalEmail, sendDonationDeliveredEmail } = require("../services/emailService");
const controlPlane = require("../middlewares/neuralcontrol");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await controlPlane.withDbTimeout("/db/admin/users", () =>
      User.find().select("-password").sort({ createdAt: -1 })
    );
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllNgos = async (req, res) => {
  try {
    const ngos = await controlPlane.withDbTimeout("/db/admin/ngos", () =>
      NgoProfile.find().populate("user", "name email isVerified").sort({ createdAt: -1 })
    );
    return res.status(200).json({ success: true, count: ngos.length, ngos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveNgo = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const ngo = await controlPlane.withDbTimeout("/db/admin/ngos", () =>
      NgoProfile.findById(ngoId).populate("user")
    );
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    if (ngo.verified) {
      return res.status(400).json({ success: false, message: "NGO is already verified" });
    }

    // Update NgoProfile
    ngo.verified = true;
    await controlPlane.withDbTimeout("/db/admin/ngos", () => ngo.save());

    // Update User
    if (ngo.user && ngo.user._id) {
      await controlPlane.withDbTimeout("/db/users/find", () =>
        User.findByIdAndUpdate(ngo.user._id, { isVerified: true })
      );
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
    const donations = await controlPlane.withDbTimeout("/db/admin/donations", () =>
      Donation.find()
        .populate("donor", "name email")
        .populate("assignedNgo", "orgName contactPhone")
        .sort({ createdAt: -1 })
    );
    return res.status(200).json({ success: true, count: donations.length, donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    const donation = await controlPlane.withDbTimeout("/db/admin/donations", () =>
      Donation.findById(donationId)
        .populate("donor", "name email")
        .populate("assignedNgo", "orgName")
    );

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    const previousStatus = donation.status;
    donation.status = status;
    await controlPlane.withDbTimeout("/db/admin/donations", () => donation.save());

    // If status changed to DELIVERED, update NGO stats and send emails
    if (status === "DELIVERED" && previousStatus !== "DELIVERED" && donation.assignedNgo) {
      await controlPlane.withDbTimeout("/db/admin/ngos", () =>
        NgoProfile.findByIdAndUpdate(donation.assignedNgo._id, {
          $inc: { totalMealsReceived: donation.serves || 0, totalDonationsReceived: 1 }
        })
      );

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
    const user = await controlPlane.withDbTimeout("/db/admin/users", () =>
      User.findByIdAndDelete(req.params.id)
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "NGO") {
      await controlPlane.withDbTimeout("/db/admin/ngos", () =>
        NgoProfile.findOneAndDelete({ user: user._id })
      );
    }
    await controlPlane.withDbTimeout("/db/donations/find", () =>
      Donation.deleteMany({ donor: user._id })
    );

    return res.status(200).json({ success: true, message: "User and associated records deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNgo = async (req, res) => {
  try {
    const ngo = await controlPlane.withDbTimeout("/db/admin/ngos", () =>
      NgoProfile.findByIdAndDelete(req.params.id)
    );
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

    await controlPlane.withDbTimeout("/db/users/find", () =>
      User.findByIdAndDelete(ngo.user)
    );
    await controlPlane.withDbTimeout("/db/donations/find", () =>
      Donation.updateMany({ assignedNgo: ngo._id }, { $unset: { assignedNgo: "" }, status: "PENDING" })
    );

    return res.status(200).json({ success: true, message: "NGO and associated user deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await controlPlane.withDbTimeout("/db/admin/donations", () =>
      Donation.findByIdAndDelete(req.params.id)
    );
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });
    return res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
