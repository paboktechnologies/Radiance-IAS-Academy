
const Popup = require("../models/Popup");

// ==================================
// AUTOMATICALLY DISABLE EXPIRED POPUPS
// ==================================

const disableExpiredPopups = async () => {
    const now = new Date();

    await Popup.updateMany(
        {
            isActive: true,
            endDate: { $ne: null, $lt: now }
        },
        {
            $set: { isActive: false }
        }
    );
};

// ==================================
// CREATE POPUP (ADMIN)
// ==================================

const createPopup = async (req, res) => {
    try {
        const {
            title,
            description,
            image,
            startDate,
            endDate
        } = req.body || {};

        if (!title || !image) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and image"
            });
        }

        if (
            startDate &&
            endDate &&
            new Date(startDate) > new Date(endDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date"
            });
        }

        const popup = await Popup.create({
            title,
            description,
            image,
            startDate: startDate || null,
            endDate: endDate || null
        });

        return res.status(201).json({
            success: true,
            message: "Popup created successfully",
            popup
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create popup",
            error: error.message
        });
    }
};

// ==================================
// GET ALL ACTIVE POPUPS (PUBLIC)
// ==================================

const getActivePopup = async (req, res) => {
    try {
        await disableExpiredPopups();

        const now = new Date();

        const popups = await Popup.find({
            isActive: true,

            $and: [
                {
                    $or: [
                        { startDate: null },
                        { startDate: { $lte: now } }
                    ]
                },
                {
                    $or: [
                        { endDate: null },
                        { endDate: { $gte: now } }
                    ]
                }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: popups.length,
            popups
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch popups",
            error: error.message
        });
    }
};

// ==================================
// GET ALL POPUPS (ADMIN)
// ==================================

const getAllPopups = async (req, res) => {
    try {
        await disableExpiredPopups();

        const popups = await Popup.find().sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: popups.length,
            popups
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch popups",
            error: error.message
        });
    }
};

// ==================================
// UPDATE POPUP (ADMIN)
// ==================================

const updatePopup = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "image",
            "isActive",
            "startDate",
            "endDate"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body && req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const popup = await Popup.findById(req.params.id);

        if (!popup) {
            return res.status(404).json({
                success: false,
                message: "Popup not found"
            });
        }

        const finalStartDate =
            updateData.startDate !== undefined
                ? updateData.startDate
                : popup.startDate;

        const finalEndDate =
            updateData.endDate !== undefined
                ? updateData.endDate
                : popup.endDate;

        if (
            finalStartDate &&
            finalEndDate &&
            new Date(finalStartDate) > new Date(finalEndDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date"
            });
        }

        Object.assign(popup, updateData);

        // If end date has already passed, disable immediately
        if (popup.endDate && new Date(popup.endDate) < new Date()) {
            popup.isActive = false;
        }

        await popup.save();

        return res.status(200).json({
            success: true,
            message: "Popup updated successfully",
            popup
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update popup",
            error: error.message
        });
    }
};

// ==================================
// DELETE POPUP (ADMIN)
// ==================================

const deletePopup = async (req, res) => {
    try {
        const popup = await Popup.findByIdAndDelete(req.params.id);

        if (!popup) {
            return res.status(404).json({
                success: false,
                message: "Popup not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Popup deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete popup",
            error: error.message
        });
    }
};

// ==================================
// EXPORT CONTROLLERS
// ==================================

module.exports = {
    createPopup,
    getActivePopup,
    getAllPopups,
    updatePopup,
    deletePopup
};
