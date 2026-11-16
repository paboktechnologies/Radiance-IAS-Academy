
const express = require("express");

const router = express.Router();

// Import controller functions
const {
    adminLogin,
    getAdminProfile
} = require("../controllers/adminController");

// Import authentication middleware
const adminAuth = require("../middleware/adminAuth");

// Admin Login (Public API)
router.post("/login", adminLogin);

// Admin Profile (Protected API)
router.get("/profile", adminAuth, getAdminProfile);

module.exports = router;
