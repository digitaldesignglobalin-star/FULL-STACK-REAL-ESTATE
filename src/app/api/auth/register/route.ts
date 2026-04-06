import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Otp from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/sendSms";
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with mobile number, email and password. Sends an OTP to verify the mobile number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, builder]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Mobile already registered or missing requirements
 *       500:
 *         description: Register error
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, mobile, password, role, subRole } = await req.json();

    const allowedRoles = ["user", "builder", "dealer"];
    const safeRole = allowedRoles.includes(role) ? role : "user";
    const safeSubRole =
      role === "builder" || role === "dealer" ? subRole : undefined;

    const existUser = await User.findOne({ email });
    const existUserByMobile = await User.findOne({ mobile });

    if (existUser) {
      return NextResponse.json(
        { message: "User already registered with this email!", type: "email" },
        { status: 400 },
      );
    }

    if (existUserByMobile) {
      return NextResponse.json(
        { message: "User already exists with this mobile number!", type: "mobile" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await Otp.deleteOne({ mobile });

    await Otp.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: safeRole,
      subRole: safeSubRole,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendSMS(mobile, otp);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
