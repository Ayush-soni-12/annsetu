const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validate, signupSchema, ngoSignupSchema, loginSchema } = require("../middlewares/validate");
const {
  signup,
  login,
  logout,
  getMe,
  updateMe,
} = require("../controllers/auth-Controllers");

router.post("/signup", validate(signupSchema), signup);          // DONOR signup
router.post("/signup/ngo", validate(ngoSignupSchema), signup);   // NGO signup
router.post("/login",  validate(loginSchema),  login);
router.post("/logout", logout);

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);

module.exports = router;
