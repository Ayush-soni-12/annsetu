const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
    try {

        const token =
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            });
        }

        try {

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            req.user = decoded;

        } catch (error) {

            return res.status(401).json({
                success: false,
                message: "Token Invalid"
            });

        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Authentication Failed"
        });

    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};