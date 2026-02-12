import connectDB from "@/lib/db";
import ResetToken from "@/models/resetToken.model";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, token, newPassword } = await req.json();

    const record = await ResetToken.findOne({ email });

    if (!record) {
      return NextResponse.json(
        { message: "Invalid or expired link" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(token, record.token);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid or expired link" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Link expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    await ResetToken.deleteMany({ email });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Reset failed" },
      { status: 500 }
    );
  }
}
