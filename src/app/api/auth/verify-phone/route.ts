import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";
import User from "@/models/user.model";
import { authRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rateLimit";
import { z } from "zod";

const verifyPhoneSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
  otp: z.string().length(6, "OTP must be 6 digits"),
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
    const validation = verifyPhoneSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { mobile, otp } = validation.data;

    const tempUser = await Otp.findOne({ mobile });

    if (!tempUser) {
      return NextResponse.json(
        { message: "No OTP found. Please register again." },
        { status: 400 }
      );
    }

    if (tempUser.attempts >= 5) {
      await Otp.deleteOne({ mobile });
      return NextResponse.json(
        { message: "Too many attempts. Please request new OTP." },
        { status: 400 }
      );
    }

    if (tempUser.expiresAt < new Date()) {
      await Otp.deleteOne({ mobile });
      return NextResponse.json(
        { message: "OTP has expired. Please request new OTP." },
        { status: 400 }
      );
    }

    if (otp.trim() !== tempUser.otp.trim()) {
      tempUser.attempts += 1;
      await tempUser.save();

      return NextResponse.json(
        { message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email: tempUser.email });

    if (exists) {
      await User.findByIdAndUpdate(exists._id, {
        mobile: tempUser.mobile,
        role: tempUser.role || "user",
        isApproved: tempUser.role === "user" ? true : false,
      });
      await Otp.deleteOne({ mobile });

      return NextResponse.json({
        success: true,
        message: "Phone verified successfully!",
        role: tempUser.role,
      });
    }

    const isBuilderOrDealer = tempUser.role === "builder" || tempUser.role === "dealer";

    await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      mobile: tempUser.mobile,
      role: tempUser.role || "user",
      subRole: tempUser.subRole,
      isApproved: !isBuilderOrDealer,
    });

    await Otp.deleteOne({ mobile });

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      role: tempUser.role,
    });

  } catch (err) {
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
