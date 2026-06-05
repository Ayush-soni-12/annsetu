const Donation = require("../models/donation");
const NgoProfile = require("../models/ngoProfile");

exports.getGlobalStats = async (req, res) => {
  try {
    // 1. Total meals donated (sum of serves for all donations)
    const mealsResult = await Donation.aggregate([
      { $group: { _id: null, totalMeals: { $sum: "$serves" } } },
    ]);
    const totalMeals = mealsResult[0]?.totalMeals || 0;

    // 2. Number of NGO partners
    const ngoCount = await NgoProfile.countDocuments({ verified: true });

    // 3. People helped (roughly equal to total meals for now)
    const peopleHelped = totalMeals;

    // 4. Food Waste Prevented (Rough estimate: 0.3 kg per meal)
    const wastePreventedKg = totalMeals * 0.3;
    const wastePreventedStr =
      wastePreventedKg > 1000
        ? (wastePreventedKg / 1000).toFixed(1) + " Tons"
        : Math.round(wastePreventedKg) + " Kg";

    return res.status(200).json({
      success: true,
      stats: {
        mealsDonated: totalMeals,
        ngoPartners: ngoCount,
        peopleHelped: peopleHelped,
        wastePrevented: wastePreventedStr,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
