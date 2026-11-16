
const GalleryCategory = require("../models/GalleryCategory");
const Gallery = require("../models/Gallery");

// ==================================
// CREATE NEW CATEGORY
// ==================================

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const categoryName = name.trim();

        // Check duplicate category name
        const existingCategory = await GalleryCategory.findOne({
            name: categoryName
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "This category already exists"
            });
        }

        const category = await GalleryCategory.create({
            name: categoryName,
            description: description || ""
        });

        res.status(201).json({
            success: true,
            message: "Gallery category created successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==================================
// GET ALL CATEGORIES (ADMIN)
// ==================================

const getAllCategories = async (req, res) => {
    try {
        const categories = await GalleryCategory.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==================================
// GET ACTIVE CATEGORIES (PUBLIC)
// ==================================

const getActiveCategories = async (req, res) => {
    try {
        const categories = await GalleryCategory.find({
            isActive: true
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==================================
// UPDATE CATEGORY
// ==================================

const updateCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        const category = await GalleryCategory.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Gallery category not found"
            });
        }

        // Update category name
        if (name !== undefined) {

            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Category name cannot be empty"
                });
            }

            const categoryName = name.trim();

            // Check duplicate name
            const duplicate = await GalleryCategory.findOne({
                name: categoryName,
                _id: { $ne: req.params.id }
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "This category name already exists"
                });
            }

            // Update associated gallery images too
            if (category.name !== categoryName) {
                await Gallery.updateMany(
                    { category: category.name },
                    { $set: { category: categoryName } }
                );
            }

            category.name = categoryName;
        }

        // Update description
        if (description !== undefined) {
            category.description = description;
        }

        // Update active status
        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Gallery category updated successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==================================
// DELETE CATEGORY
// ==================================

const deleteCategory = async (req, res) => {
    try {
        const category = await GalleryCategory.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Gallery category not found"
            });
        }

        // Check whether gallery images exist
        const existingImages = await Gallery.findOne({
            category: category.name
        });

        // Prevent deletion if images exist
        if (existingImages) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this category because gallery images are assigned to it. Delete or move those images first."
            });
        }

        // Delete category only when no images exist
        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: "Gallery category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==================================
// EXPORT CONTROLLERS
// ==================================

module.exports = {
    createCategory,
    getAllCategories,
    getActiveCategories,
    updateCategory,
    deleteCategory
};
