
const express = require("express");

const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getActiveCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/galleryCategoryController");

const adminAuth = require("../middleware/adminAuth");

// ==================================
// PUBLIC ROUTE
// ==================================

// Get Active Categories
router.get("/", getActiveCategories);


// ==================================
// ADMIN ROUTES
// ==================================

// Get All Categories
router.get("/admin/all", adminAuth, getAllCategories);

// Create Category
router.post("/", adminAuth, createCategory);

// Update Category
router.put("/:id", adminAuth, updateCategory);

// Delete Category
router.delete("/:id", adminAuth, deleteCategory);


module.exports = router;
