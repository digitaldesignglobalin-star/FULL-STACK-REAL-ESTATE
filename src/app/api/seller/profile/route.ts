import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(session.user.id).select("-password");
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          name: data.name,
          mobile: data.mobile,
        },
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
