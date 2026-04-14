import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

const EMPLOYEE_CONFIG = {
  name: "Employee",
  email: "employee@estate.com",
  password: "employee123",
  role: "employee" as const,
  isApproved: true,
  isBlocked: false,
};

async function createEmployee() {
  try {
    const mongoUri = process.env.MONGODB_URL;
    
    if (!mongoUri) {
      console.error("MONGODB_URL not found in environment variables");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    const dns = await import("node:dns/promises");
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const existingEmployee = await User.findOne({ email: EMPLOYEE_CONFIG.email });
    
    if (existingEmployee) {
      console.log("\nEmployee user already exists!");
      console.log(`Email: ${existingEmployee.email}`);
      console.log(`Role: ${existingEmployee.role}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(EMPLOYEE_CONFIG.password, salt);

    const employeeUser = new User({
      name: EMPLOYEE_CONFIG.name,
      email: EMPLOYEE_CONFIG.email,
      password: hashedPassword,
      role: EMPLOYEE_CONFIG.role,
      isApproved: EMPLOYEE_CONFIG.isApproved,
      isBlocked: EMPLOYEE_CONFIG.isBlocked,
    });

    await employeeUser.save();

    console.log("\nEmployee user created successfully!");
    console.log("-----------------------------------");
    console.log(`Name:  ${EMPLOYEE_CONFIG.name}`);
    console.log(`Email: ${EMPLOYEE_CONFIG.email}`);
    console.log(`Role:  ${EMPLOYEE_CONFIG.role}`);
    console.log("-----------------------------------");
    console.log("\nChange the password after first login!");

  } catch (error) {
    console.error("\nError creating employee user:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

createEmployee();
