
const mongoose = require("mongoose");

// ==================================
// POPUP SCHEMA
// ==================================

const popupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        image: {
            type: String,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        startDate: {
            type: Date,
            default: null
        },

        endDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// ==================================
// POPUP MODEL
// ==================================

const Popup = mongoose.model("Popup", popupSchema);

module.exports = Popup;
