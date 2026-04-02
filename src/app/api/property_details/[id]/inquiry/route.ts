import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/inquiry.model";
import Property from "@/models/property.model";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const { name, email, phone, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    const inquiry = await Inquiry.create({
      propertyId: id,
      name,
      email,
      phone: phone || "",
      message: message || ""
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully",
      inquiry
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}