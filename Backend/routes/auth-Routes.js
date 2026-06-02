const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const { signup , login } = require("../controllers/auth-Controllers");

router.post("/signup", signup);
router.post("/login" , login);

router.get("/me", auth, (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user
    }); 
});

module.exports = router;