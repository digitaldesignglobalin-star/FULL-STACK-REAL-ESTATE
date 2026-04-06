import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";
import User from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { message: "Mobile and OTP are required" },
        { status: 400 }
      );
    }

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
      await Otp.deleteOne({ mobile });
      return NextResponse.json(
        { message: "User already exists. Please login." },
        { status: 400 }
      );
    }

    await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      mobile: tempUser.mobile,
      role: tempUser.role || "user",
      subRole: tempUser.subRole,
    });

    await Otp.deleteOne({ mobile });

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
    });

  } catch (err) {
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
