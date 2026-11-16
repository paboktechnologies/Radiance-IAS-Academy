
const Course = require("../models/Course");

// ==================================
// ADD NEW COURSE (ADMIN)
// ==================================

const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            image,
            eligibility
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Please provide course title and description"
            });
        }

        const course = await Course.create({
            title,
            description,
            image,
            eligibility
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        });
    }
};


// ==================================
// GET ALL ACTIVE COURSES (PUBLIC)
// ==================================

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message
        });
    }
};


// ==================================
// GET ALL COURSES (ADMIN)
// ==================================

const getAdminCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin courses",
            error: error.message
        });
    }
};


// ==================================
// GET SINGLE ACTIVE COURSE (PUBLIC)
// ==================================

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found or inactive"
            });
        }

        return res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course",
            error: error.message
        });
    }
};


// ==================================
// UPDATE COURSE (ADMIN)
// ==================================

const updateCourse = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "image",
            "eligibility",
            "isActive"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message
        });
    }
};


// ==================================
// DELETE COURSE (ADMIN)
// ==================================

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message
        });
    }
};


// ==================================
// EXPORT FUNCTIONS
// ==================================

module.exports = {
    createCourse,
    getAllCourses,
    getAdminCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};
