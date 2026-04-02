/**
 * Script to create an admin user in the database
 * Run this script once to create the initial admin user
 * 
 * Usage: npm run create-admin
 */

import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Import the User model
import User from "../models/user.model";

// Admin user configuration
const ADMIN_CONFIG = {
  name: "Admin",
  email: "admin@estate.com",
  password: "admin123", // Change this password after first login!
  role: "admin" as const,
  isApproved: true,
  isBlocked: false,
};

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URL;
    
    if (!mongoUri) {
      console.error("❌ MONGODB_URL not found in environment variables");
      console.log("Please make sure .env.local has MONGODB_URL defined");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    console.log("MongoDB URI:", mongoUri.replace(/\/\/.*:.*@/, "//****:****@"));

    // Use DNS override to bypass SRV issues
    const dns = await import("node:dns/promises");
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      console.log("\n⚠️  Admin user already exists!");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log("\nNo changes made.");
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, salt);

    // Create admin user
    const adminUser = new User({
      name: ADMIN_CONFIG.name,
      email: ADMIN_CONFIG.email,
      password: hashedPassword,
      role: ADMIN_CONFIG.role,
      isApproved: ADMIN_CONFIG.isApproved,
      isBlocked: ADMIN_CONFIG.isBlocked,
    });

    // Save to database
    await adminUser.save();

    console.log("\n✅ Admin user created successfully!");
    console.log("-----------------------------------");
    console.log(`   Name:  ${ADMIN_CONFIG.name}`);
    console.log(`   Email: ${ADMIN_CONFIG.email}`);
    console.log(`   Role:  ${ADMIN_CONFIG.role}`);
    console.log("-----------------------------------");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    console.error(error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the script
createAdmin();
