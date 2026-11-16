
const mongoose = require("mongoose");

// ==================================
// ENQUIRY SCHEMA
// ==================================

const enquirySchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        interestedCourse: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["New", "Contacted", "Completed"],
            default: "New"
        }
    },
    {
        timestamps: true
    }
);

// ==================================
// ENQUIRY MODEL
// ==================================

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;
