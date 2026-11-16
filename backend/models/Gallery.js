
const mongoose = require("mongoose");

// ==================================
// GALLERY SCHEMA
// ==================================

const gallerySchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// ==================================
// GALLERY MODEL
// ==================================

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
