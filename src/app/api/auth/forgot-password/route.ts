import connectDB from "@/lib/db";
import User from "@/models/user.model";
import ResetToken from "@/models/resetToken.model";
import { transporter } from "@/lib/mailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Always respond same message
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(rawToken, 10);

    await ResetToken.deleteMany({ email: normalizedEmail });

    await ResetToken.create({
      email: normalizedEmail,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${rawToken}&email=${normalizedEmail}`;

    console.log("Reset link:", resetLink);


    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: normalizedEmail,
  subject: "Reset Your Password",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password:</p>

      <a href="${resetLink}" 
         style="
           display:inline-block;
           padding:12px 20px;
           background-color:#006AC2;
           color:white;
           text-decoration:none;
           border-radius:6px;
           font-weight:bold;
         ">
        Reset Password
      </a>

      <p style="margin-top:15px;">
        Or copy and paste this link into your browser:
      </p>
      <p>${resetLink}</p>

      <p>This link expires in 15 minutes.</p>
    </div>
  `,
});


    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
