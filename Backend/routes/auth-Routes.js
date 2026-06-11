const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validate, signupSchema, ngoSignupSchema, loginSchema } = require("../middlewares/validate");
const controlPlane = require("../middlewares/neuralcontrol");
const {
  signup,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  deleteAccount,
} = require("../controllers/auth-Controllers");

router.post("/signup", validate(signupSchema), controlPlane.middleware("/api/auth/signup", { priority: "high" }), signup);          // DONOR signup
router.post("/signup/ngo", validate(ngoSignupSchema), controlPlane.middleware("/api/auth/signup/ngo", { priority: "high" }), signup);   // NGO signup
router.post("/login",  validate(loginSchema), controlPlane.middleware("/api/auth/login", { priority: "critical" }), login);
router.post("/logout", controlPlane.middleware("/api/auth/logout", { priority: "low" }), logout);

router.get("/me", auth, controlPlane.middleware("/api/auth/me", { priority: "critical" }), getMe);
router.put("/me", auth, controlPlane.middleware("/api/auth/me", { priority: "medium" }), updateMe);
router.put("/change-password", auth, controlPlane.middleware("/api/auth/change-password", { priority: "high" }), changePassword);
router.delete("/me", auth, controlPlane.middleware("/api/auth/delete", { priority: "low" }), deleteAccount);

module.exports = router;
