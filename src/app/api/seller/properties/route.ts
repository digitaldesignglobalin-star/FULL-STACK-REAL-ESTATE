import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const properties = await Property.find({ postedBy: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ properties });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
