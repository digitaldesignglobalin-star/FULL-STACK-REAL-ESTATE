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

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existingRecent = await ResetToken.findOne({
      email: normalizedEmail,
      createdAt: { $gt: new Date(Date.now() - 30 * 1000) }, // 30 sec cooldown
    });

    if (existingRecent) {
      return NextResponse.json(
        { message: "Please wait 30 seconds before requesting again." },
        { status: 429 },
      );
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Always respond same message
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 },
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
    <div style="background-color:#f4f6f8;padding:40px 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;">
      
      <!-- Header -->
      <tr>
        <td style="background:#006AC2;padding:20px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">
            Real Estate Platform
          </h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px;">
          <h2 style="margin-top:0;color:#333;">Reset Your Password</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;">
            We received a request to reset your password. 
            Click the button below to set a new password.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${resetLink}" 
               style="
                 background-color:#006AC2;
                 color:#ffffff;
                 padding:14px 28px;
                 text-decoration:none;
                 border-radius:6px;
                 font-weight:bold;
                 display:inline-block;
                 font-size:14px;
               ">
              Reset Password
            </a>
          </div>

          <p style="color:#777;font-size:13px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p style="color:#777;font-size:13px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />

          <p style="font-size:12px;color:#999;word-break:break-all;">
            If the button doesn't work, copy and paste this link into your browser:
            <br/>
            ${resetLink}
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f4f6f8;padding:15px;text-align:center;font-size:12px;color:#888;">
          © ${new Date().getFullYear()} Real Estate Platform. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
    });

    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
