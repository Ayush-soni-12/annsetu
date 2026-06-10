const User = require("../models/user");
const NgoProfile = require("../models/ngoProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendNgoWelcomeEmail } = require("../services/emailService");

// Helper function to set cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = "DONOR", ...ngoFields } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // NGOs start unverified — admin must approve before they appear in directory
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: role === "NGO" ? false : true,
    });

    // If registering as NGO, also create the profile document
    if (role === "NGO") {
      await NgoProfile.create({
        user: user._id,
        orgName: ngoFields.orgName,
        description: ngoFields.description || "",
        registrationNo: ngoFields.registrationNo || "",
        address: ngoFields.address,
        city: ngoFields.city,
        state: ngoFields.state || "",
        pincode: ngoFields.pincode || "",
        contactPhone: ngoFields.contactPhone,
        website: ngoFields.website || "",
        capacityMeals: ngoFields.capacityMeals || 50,
        acceptedFoodTypes: ngoFields.acceptedFoodTypes || ["Cooked Food", "Raw Ingredients", "Packaged Food"],
        dietaryPref: ngoFields.dietaryPref || ["Vegetarian"],
        operatingHours: ngoFields.operatingHours || "9AM - 6PM",
        focusArea: ngoFields.focusArea || "All",
        verified: false,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Send async email notification (fire-and-forget)
    if (role === "NGO") {
      sendNgoWelcomeEmail(user.email, ngoFields.orgName);
    } else {
      sendWelcomeEmail(user.email, user.name);
    }

    user.password = undefined;

    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message:
        role === "NGO"
          ? "NGO registered! Your profile is under review. We'll notify you once approved."
          : "Account created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Note: Zod middleware already validated fields before we get here

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"  // 7 days — user stays logged in
            }
        );

        user.password = undefined;

        setTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "location", "avatarUrl"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        updates[field] = req.body[field].trim();
      }
    });

    if (!updates.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
