
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ==================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ==================================

const adminAuth = async (req, res, next) => {
    try {
        // Step 1: Get token from request header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login."
            });
        }

        // Step 2: Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing."
            });
        }

        // Step 3: Check JWT Secret
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        // Step 4: Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded Admin ID:", decoded.id);

        // Step 5: Find Admin in MongoDB
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin account not found."
            });
        }

        // Step 6: Check Admin role
        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access denied."
            });
        }

        // Step 7: Store admin details in request
        req.admin = admin;

        // Step 8: Continue to next middleware/controller
        next();

    } catch (error) {
        console.log("ADMIN AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
            error: error.message
        });
    }
};

// ==================================
// EXPORT MIDDLEWARE
// ==================================

module.exports = adminAuth;
