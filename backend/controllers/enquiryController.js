
const Enquiry = require("../models/Enquiry");

// ==================================
// CREATE NEW ENQUIRY (PUBLIC)
// ==================================

const createEnquiry = async (req, res) => {
    try {
        const {
            studentName,
            mobile,
            email,
            interestedCourse,
            message
        } = req.body || {};

        // Validate required fields
        if (
            !studentName ||
            !mobile ||
            !email ||
            !interestedCourse ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Validate mobile number
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number"
            });
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Save enquiry in MongoDB
        const enquiry = await Enquiry.create({
            studentName,
            mobile,
            email,
            interestedCourse,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            enquiry
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to submit enquiry",
            error: error.message
        });
    }
};

// ==================================
// GET ALL ENQUIRIES (ADMIN)
// ==================================

const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: enquiries.length,
            enquiries
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enquiries",
            error: error.message
        });
    }
};

// ==================================
// UPDATE ENQUIRY STATUS (ADMIN)
// ==================================

const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body || {};

        const allowedStatuses = [
            "New",
            "Contacted",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry status"
            });
        }

        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enquiry status updated successfully",
            enquiry
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update enquiry status",
            error: error.message
        });
    }
};

module.exports = {
    createEnquiry,
    getAllEnquiries,
    updateEnquiryStatus
};
