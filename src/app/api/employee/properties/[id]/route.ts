import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    
    if (!token?.email || token?.role !== "employee") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const property = await Property.findById(id).populate("postedBy", "name email");

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    
    if (!token?.email || token?.role !== "employee") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const allowedUpdates = [
      "status",
      "purpose",
      "category",
      "type",
      "city",
      "locality",
      "price",
      "bhk",
      "area",
      "furnish",
      "featured",
    ];
    const updates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const property = await Property.findByIdAndUpdate(id, updates, { new: true });

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update property" },
      { status: 500 }
    );
  }
}
