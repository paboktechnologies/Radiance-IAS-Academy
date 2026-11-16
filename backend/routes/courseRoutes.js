
const express = require("express");

const router = express.Router();

// Import Course Controller Functions
const {
    createCourse,
    getAllCourses,
    getAdminCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

// Import Admin Authentication
const adminAuth = require("../middleware/adminAuth");


// ==================================
// PUBLIC ROUTES
// ==================================

// Get All Active Courses
router.get("/", getAllCourses);

// Get Single Active Course
router.get("/:id", getCourseById);


// ==================================
// ADMIN-ONLY ROUTES
// ==================================

// Get All Courses (Active + Inactive)
router.get("/admin/all", adminAuth, getAdminCourses);

// Add New Course
router.post("/", adminAuth, createCourse);

// Update Course
router.put("/:id", adminAuth, updateCourse);

// Delete Course
router.delete("/:id", adminAuth, deleteCourse);


module.exports = router;
