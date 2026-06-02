const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validate, signupSchema, loginSchema } = require("../middlewares/validate");
const { signup, login } = require("../controllers/auth-Controllers");

router.post("/signup", validate(signupSchema), signup);
router.post("/login",  validate(loginSchema),  login);

router.get("/me", auth, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;