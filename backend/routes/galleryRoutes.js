
const express = require("express");

const router = express.Router();

// Import Gallery Controller Functions
const {
    createGallery,
    getAllGallery,
    getAdminGallery,
    getGalleryById,
    updateGallery,
    deleteGallery
} = require("../controllers/galleryController");

// Import Admin Authentication
const adminAuth = require("../middleware/adminAuth");


// ==================================
// PUBLIC ROUTES
// ==================================

// Get All Active Gallery Images
router.get("/", getAllGallery);

// Get Single Active Gallery Image
router.get("/:id", getGalleryById);


// ==================================
// ADMIN-ONLY ROUTES
// ==================================

// Get All Gallery Images (Active + Inactive)
router.get("/admin/all", adminAuth, getAdminGallery);

// Add Gallery Image
router.post("/", adminAuth, createGallery);

// Update Gallery Image
router.put("/:id", adminAuth, updateGallery);

// Delete Gallery Image
router.delete("/:id", adminAuth, deleteGallery);


module.exports = router;
