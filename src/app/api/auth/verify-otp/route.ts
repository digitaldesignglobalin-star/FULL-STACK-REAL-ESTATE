import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "OTP expired or not found" },
        { status: 400 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // PREVENT FORCE
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { message: "Too many attempts" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Double User Check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteMany({ email });
      return NextResponse.json(
        { message: "User already verified" },
        { status: 400 },
      );
    }

    // Create real user
    await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
    });

    // Delete OTP record
    await Otp.deleteMany({ email });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 },
    );
  }
}
