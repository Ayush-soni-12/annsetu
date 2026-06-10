const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  avatarUrl: {
    type: String,
    trim: true,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  // DONOR = regular food donor, NGO = organisation, ADMIN = platform admin
  role: {
    type: String,
    enum: ["DONOR", "NGO", "ADMIN"],
    default: "DONOR",
  },
  // NGOs start unverified — admin flips this to true after review
  isVerified: {
    type: Boolean,
    default: true,   // DONORs are auto-verified; NGOs get set to false on creation
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
