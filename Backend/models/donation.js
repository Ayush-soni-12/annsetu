const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Who donated (linked to logged-in user)
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },

    // Contact details (in case donor is donating on behalf of someone)
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Food details
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    foodType: {
      type: String,
      required: true,
      enum: ["Cooked Food", "Raw Ingredients", "Packaged Food"],
    },
    foodCategory: {
      type: String,
      required: true,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan"],
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    serves: {
      type: Number,
      required: true,
    },

    // Logistics
    pickupTime: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
      default: "",
    },

    // Image — placeholder for now, Cloudinary URL later
    foodImageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    },

    // Lifecycle status
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "PICKED_UP", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    // Link to NGO (optional until assigned)
    assignedNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NgoProfile",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
