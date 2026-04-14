import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Otp from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/sendSms";
import { authRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rateLimit";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "builder", "dealer"]).optional().default("user"),
  subRole: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitResult = authRateLimit(ip);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(
        rateLimitResult.limit,
        rateLimitResult.remaining,
        rateLimitResult.reset
      );
    }

    await connectDB();
    
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, mobile, password, role, subRole } = validation.data;

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

    const safeSubRole = role === "builder" || role === "dealer" ? subRole : undefined;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await Otp.deleteOne({ mobile });

    await Otp.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
      subRole: safeSubRole,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendSMS(mobile, otp);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
