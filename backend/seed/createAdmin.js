
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected!");

        // Check existing admin
        const existingAdmin = await Admin.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            console.log("Admin account already exists!");
            return;
        }

        // Admin details from environment variables
        const adminName = process.env.ADMIN_NAME;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminName || !adminEmail || !adminPassword) {
            throw new Error("Admin environment variables are missing!");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create admin
        const admin = await Admin.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin Created Successfully!");
        console.log("Admin Email:", admin.email);

    } catch (error) {
        console.error("Admin Creation Failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
