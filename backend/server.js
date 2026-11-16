
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ==================================
// IMPORT DATABASE CONNECTION
// ==================================

const connectDB = require("./config/db");

// ==================================
// IMPORT ROUTES
// ==================================

const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const galleryCategoryRoutes = require("./routes/galleryCategoryRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const popupRoutes = require("./routes/popupRoutes");

// ==================================
// INITIALIZE EXPRESS APP
// ==================================

const app = express();

// ==================================
// MIDDLEWARE
// ==================================

app.use(cors());
app.use(express.json());

// ==================================
// API ROUTES
// ==================================

// Admin Routes
app.use("/api/admin", adminRoutes);

// Course Routes
app.use("/api/courses", courseRoutes);

// Gallery Image Routes
app.use("/api/gallery", galleryRoutes);

// Gallery Category Routes
app.use("/api/gallery-categories", galleryCategoryRoutes);

// Enquiry Routes
app.use("/api/enquiries", enquiryRoutes);

// Popup Routes
app.use("/api/popups", popupRoutes);

// ==================================
// HOME ROUTE
// ==================================

app.get("/", (req, res) => {
    res.send("Radiance IAS Academy Backend is Running!");
});

// ==================================
// START SERVER
// ==================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Radiance IAS Academy Server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
