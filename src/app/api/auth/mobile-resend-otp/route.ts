import { sendSMS } from "@/lib/sendSms";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json(
        { message: "Missing mobile" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const updated = await Otp.findOneAndUpdate(
      { mobile },
      {
        otp: otp,
        expiresAt,
        attempts: 0,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "No OTP request found" },
        { status: 400 }
      );
    }

    await sendSMS(mobile, otp);

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { message: "Resend failed" },
      { status: 500 }
    );
  }
}
