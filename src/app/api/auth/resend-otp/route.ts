import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existingOtp = await Otp.findOne({ email: normalizedEmail });

    if (!existingOtp) {
      return NextResponse.json(
        { message: "No OTP request found" },
        { status: 400 }
      );
    }

    // 🔥 Secure random OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();;

    // 🔥 Hash new OTP
    const hashedOtp = await bcrypt.hash(newOtp, 10);

    // 🔥 Update record
    existingOtp.otp = hashedOtp;
    existingOtp.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    existingOtp.attempts = 0; // reset attempts on resend
    await existingOtp.save();

    // 🔥 Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Your New OTP Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your new OTP is:</p>
        <h1>${newOtp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "OTP resent successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { message: error.message || "Resend OTP failed" },
      { status: 500 }
    );
  }
}
