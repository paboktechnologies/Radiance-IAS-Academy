
const express = require("express");

const router = express.Router();

// Import Popup Controller
const {
    createPopup,
    getActivePopup,
    getAllPopups,
    updatePopup,
    deletePopup
} = require("../controllers/popupController");

// Import Admin Authentication
const adminAuth = require("../middleware/adminAuth");

// ==================================
// PUBLIC ROUTE
// ==================================

// Website gets currently active popup
router.get("/", getActivePopup);

// ==================================
// ADMIN ROUTES
// ==================================

// Admin gets all popups
router.get("/admin/all", adminAuth, getAllPopups);

// Admin creates popup
router.post("/", adminAuth, createPopup);

// Admin updates popup
router.put("/:id", adminAuth, updatePopup);

// Admin deletes popup
router.delete("/:id", adminAuth, deletePopup);

module.exports = router;
