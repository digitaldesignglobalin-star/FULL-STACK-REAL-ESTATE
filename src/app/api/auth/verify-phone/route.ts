import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {

    await connectDB();

    const { mobile, otp } = await req.json();

    // validate input
    if (!mobile || !otp) {
      return NextResponse.json(
        { message: "Missing data" },
        { status: 400 }
      );
    }

    const tempUser = await Otp.findOne({ mobile });

    if (!tempUser) {
      return NextResponse.json(
        { message: "OTP request not found" },
        { status: 400 }
      );
    }

    // 🔥 attempt limit MUST be here
    if (tempUser.attempts >= 5) {
      await Otp.deleteOne({ mobile });
      return NextResponse.json(
        { message: "Too many attempts. Request new OTP." },
        { status: 400 }
      );
    }

    // expiry check
    if (tempUser.expiresAt < new Date()) {
      await Otp.deleteOne({ mobile });
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    // compare OTP
    const isMatch = await bcrypt.compare(otp, tempUser.otp);

    if (!isMatch) {

      tempUser.attempts += 1;
      await tempUser.save();

      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // prevent duplicate user
    const exists = await User.findOne({ mobile });

    if (exists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // create user
    await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      mobile: tempUser.mobile,
    });

    // delete OTP
    await Otp.deleteOne({ mobile });

    return NextResponse.json({
      success: true,
      message: "Phone verified & user created",
    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );

  }
}

