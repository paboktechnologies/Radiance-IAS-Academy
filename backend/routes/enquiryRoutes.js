
const express = require("express");

const router = express.Router();

// Import Enquiry Controller
const {
    createEnquiry,
    getAllEnquiries,
    updateEnquiryStatus
} = require("../controllers/enquiryController");

// Import Admin Authentication
const adminAuth = require("../middleware/adminAuth");

// ==================================
// PUBLIC ROUTE
// ==================================

// Student submits enquiry
router.post("/", createEnquiry);

// ==================================
// ADMIN ROUTES
// ==================================

// Admin views all enquiries
router.get("/admin/all", adminAuth, getAllEnquiries);

// Admin updates enquiry status
router.put("/admin/:id/status", adminAuth, updateEnquiryStatus);

module.exports = router;
