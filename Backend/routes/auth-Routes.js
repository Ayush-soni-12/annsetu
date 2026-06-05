const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validate, signupSchema, ngoSignupSchema, loginSchema } = require("../middlewares/validate");
const { signup, login } = require("../controllers/auth-Controllers");

router.post("/signup", validate(signupSchema), signup);          // DONOR signup
router.post("/signup/ngo", validate(ngoSignupSchema), signup);   // NGO signup
router.post("/login",  validate(loginSchema),  login);

router.get("/me", auth, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;