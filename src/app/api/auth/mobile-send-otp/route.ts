import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Otp from "@/models/otp.model";
import { sendSMS } from "@/lib/sendSms";
import { authRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rateLimit";
import { z } from "zod";

const mobileSendOtpSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  role: z.string().optional(),
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
    const validation = mobileSendOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { mobile, email, name, role } = validation.data;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please login again." },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndDelete({ mobile });

    await Otp.create({
      email,
      name: name || user.name,
      mobile,
      role: role || "user",
      otp,
      expiresAt,
      attempts: 0,
    });

    await sendSMS(mobile, otp);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );

  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
