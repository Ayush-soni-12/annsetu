const Donation = require("../models/donation");
const NgoProfile = require("../models/ngoProfile");
const controlPlane = require("../middlewares/neuralcontrol");

exports.getGlobalStats = async (req, res) => {
  try {
    if (req.controlPlane) {
      if (req.controlPlane.isRateLimitedCustomer) return res.status(429).json({ success: false, message: "Rate limit exceeded." });
      if (req.controlPlane.isLoadShedding) return res.status(503).json({ success: false, message: "Service under heavy load." });
    }

    // Advanced Feature: Request Coalescing and DB Timeout
    const dbResult = await (req.controlPlane?.coalesce ? req.controlPlane.coalesce("global-stats", async () => {
      return await controlPlane.withDbTimeout("/db/stats/aggregate", async () => {
        const meals = await Donation.aggregate([{ $group: { _id: null, totalMeals: { $sum: "$serves" } } }]);
        const count = await NgoProfile.countDocuments({ verified: true });
        return { meals, count };
      });
    }) : (async () => {
      const meals = await Donation.aggregate([{ $group: { _id: null, totalMeals: { $sum: "$serves" } } }]);
      const count = await NgoProfile.countDocuments({ verified: true });
      return { meals, count };
    })());

    const totalMeals = dbResult.meals[0]?.totalMeals || 0;
    const ngoCount = dbResult.count;

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
