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
    const properties = await Property.find({ postedBy: session.user.id, role: "builder" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(Array.isArray(properties) ? properties : []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const property = await Property.create({ ...body, postedBy: session.user.id, role: "builder" });
    return NextResponse.json(property);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { id, ...updateData } = body;
    const property = await Property.findOneAndUpdate(
      { _id: id, postedBy: session.user.id },
      updateData,
      { new: true }
    );
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Property ID required" }, { status: 400 });
    }
    const property = await Property.findOneAndDelete({ _id: id, postedBy: session.user.id });
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Property deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}