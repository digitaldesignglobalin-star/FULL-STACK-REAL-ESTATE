import { sendSMS } from "@/lib/sendSms";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/otp.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

  try {

    await connectDB();

    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json(
        { message:"Missing mobile" },
        { status:400 }
      );
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash OTP (IMPORTANT)
    const hashedOtp = await bcrypt.hash(otp, 10);

    // expiry 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // overwrite old OTP record
    // await Otp.findOneAndUpdate(
    //   { mobile },
    //   {
    //     otp: hashedOtp,
    //     expiresAt,
    //     attempts: 0, // reset attempts
    //   },
    //   { new:true }
    // );

    const updated = await Otp.findOneAndUpdate(
  { mobile },
  {
    otp: hashedOtp,
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


    // send SMS
    const res = await sendSMS(mobile, otp);

    if (!res.success) {
      return NextResponse.json(
        { message:"SMS failed" },
        { status:500 }
      );
    }

    return NextResponse.json({ success:true });

  } catch(err) {

    console.log(err);

    return NextResponse.json(
      { message:"Resend failed" },
      { status:500 }
    );

  }
}
