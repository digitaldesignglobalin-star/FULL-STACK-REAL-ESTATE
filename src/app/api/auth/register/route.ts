import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Otp from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
// import { resend } from "@/lib/resend";
import { transporter } from "@/lib/mailer";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existUser = await User.findOne({ email });

    if (existUser) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // 🔥 Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔥 Hash password before storing temporarily
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOtp = await bcrypt.hash(otp, 10);


    // 🔥 Delete old OTP for same email
    await Otp.deleteMany({ email });

    // 🔥 Store OTP record
    await Otp.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // TEMP: Print OTP in terminal (for testing)
    console.log("OTP:", otp);

  //   await resend.emails.send({
  //     from: "no-reply@yourrealestateapp.com", // dev-safe sender
  //     to: email,
  //     subject: "Your OTP Code",
  //     html: `
  //   <h2>Email Verification</h2>
  //   <p>Your OTP is:</p>
  //   <h1>${otp}</h1>
  //   <p>This OTP expires in 5 minutes.</p>
  // `,
  //   });


  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Your OTP Code",
  html: `
    <h2>Email Verification</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP expires in 5 minutes.</p>
  `,
});


    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Register error" }, { status: 500 });
  }
}
