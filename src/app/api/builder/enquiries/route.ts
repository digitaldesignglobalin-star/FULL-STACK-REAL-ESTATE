import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/inquiry.model";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const inquiries = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(Array.isArray(inquiries) ? inquiries : []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}