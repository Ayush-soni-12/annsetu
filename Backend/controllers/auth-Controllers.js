const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Note: Zod middleware already validated fields before we get here

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token so frontend can auto-login after signup
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        user.password = undefined;

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
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
                name: user.name
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"  // 7 days — user stays logged in
            }
        );

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};