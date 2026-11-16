
const Gallery = require("../models/Gallery");
const GalleryCategory = require("../models/GalleryCategory");

// ==================================
// ADD NEW GALLERY IMAGE (ADMIN)
// ==================================

const createGallery = async (req, res) => {
    try {
        const { image, category, isActive } = req.body;

        // Validate required fields
        if (
            typeof image !== "string" ||
            !image.trim() ||
            typeof category !== "string" ||
            !category.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide image URL and category"
            });
        }

        // Find active category
        const existingCategory = await GalleryCategory.findOne({
            name: category.trim(),
            isActive: true
        });

        if (!existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Selected category does not exist or is inactive"
            });
        }

        // Create gallery image
        const gallery = await Gallery.create({
            image: image.trim(),
            category: existingCategory.name,
            ...(typeof isActive === "boolean" ? { isActive } : {})
        });

        return res.status(201).json({
            success: true,
            message: "Gallery image added successfully",
            gallery
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add gallery image",
            error: error.message
        });
    }
};


// ==================================
// GET ALL ACTIVE GALLERY (PUBLIC)
// ==================================

const getAllGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: gallery.length,
            gallery
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch gallery",
            error: error.message
        });
    }
};


// ==================================
// GET ALL GALLERY (ADMIN)
// ==================================

const getAdminGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: gallery.length,
            gallery
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin gallery",
            error: error.message
        });
    }
};


// ==================================
// GET SINGLE ACTIVE GALLERY IMAGE
// ==================================

const getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found or inactive"
            });
        }

        return res.status(200).json({
            success: true,
            gallery
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch gallery image",
            error: error.message
        });
    }
};


// ==================================
// UPDATE GALLERY IMAGE (ADMIN)
// ==================================

const updateGallery = async (req, res) => {
    try {
        const allowedFields = [
            "image",
            "category",
            "isActive"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body && req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Validate image URL
        if (
            updateData.image !== undefined &&
            (
                typeof updateData.image !== "string" ||
                !updateData.image.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Gallery image URL cannot be empty"
            });
        }

        if (updateData.image !== undefined) {
            updateData.image = updateData.image.trim();
        }

        // Validate category
        if (updateData.category !== undefined) {
            if (
                typeof updateData.category !== "string" ||
                !updateData.category.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please select a valid category"
                });
            }

            const existingCategory = await GalleryCategory.findOne({
                name: updateData.category.trim(),
                isActive: true
            });

            if (!existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Selected category does not exist or is inactive"
                });
            }

            updateData.category = existingCategory.name;
        }

        // Validate active status
        if (
            updateData.isActive !== undefined &&
            typeof updateData.isActive !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid gallery status"
            });
        }

        const gallery = await Gallery.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Gallery image updated successfully",
            gallery
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update gallery image",
            error: error.message
        });
    }
};


// ==================================
// DELETE GALLERY IMAGE (ADMIN)
// ==================================

const deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndDelete(
            req.params.id
        );

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Gallery image deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete gallery image",
            error: error.message
        });
    }
};


// ==================================
// EXPORT FUNCTIONS
// ==================================

module.exports = {
    createGallery,
    getAllGallery,
    getAdminGallery,
    getGalleryById,
    updateGallery,
    deleteGallery
};
