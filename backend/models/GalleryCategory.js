
const mongoose = require("mongoose");

const galleryCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        description: {
            type: String,
            default: "",
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

const GalleryCategory = mongoose.model(
    "GalleryCategory",
    galleryCategorySchema
);

module.exports = GalleryCategory;
