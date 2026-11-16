
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==================================
// ADMIN LOGIN
// ==================================

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check empty fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({
            email: email.toLowerCase().trim(),
            role: "admin"
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check JWT Secret
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send response
        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin login failed",
            error: error.message
        });
    }
};


// ==================================
// GET ADMIN PROFILE
// ==================================

const getAdminProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Admin profile fetched successfully",
            admin: req.admin
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch admin profile"
        });
    }
};


// ==================================
// EXPORT CONTROLLERS
// ==================================

module.exports = {
    adminLogin,
    getAdminProfile
};
