const mongoose = require("mongoose");

const ngoProfileSchema = new mongoose.Schema(
  {
    // Linked to the User account with role: "NGO"
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Organisation identity
    orgName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    registrationNo: {
      type: String,
      trim: true,
      default: "",  // NGO registration number (for trust verification)
    },
    logoUrl: {
      type: String,
      default: "",
    },

    // Location
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    // Contact
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },

    // Capacity & preferences
    capacityMeals: {
      type: Number,
      default: 50,   // how many meals/day they can handle
    },
    // Which food types they accept
    acceptedFoodTypes: {
      type: [String],
      enum: ["Cooked Food", "Raw Ingredients", "Packaged Food"],
      default: ["Cooked Food", "Raw Ingredients", "Packaged Food"],
    },
    // Dietary restrictions
    dietaryPref: {
      type: [String],
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan"],
      default: ["Vegetarian"],
    },
    operatingHours: {
      type: String,
      default: "9AM - 6PM",
    },
    // Who they serve: "Children", "Elderly", "All", etc.
    focusArea: {
      type: String,
      default: "All",
    },

    // Admin verification — NGO is only shown publicly when verified: true
    verified: {
      type: Boolean,
      default: false,
    },

    // Stats (updated when donations are delivered)
    totalMealsReceived: {
      type: Number,
      default: 0,
    },
    totalDonationsReceived: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NgoProfile", ngoProfileSchema);
