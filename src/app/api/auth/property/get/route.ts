import { NextResponse } from "next/server";
import Property from "@/models/property.model";
import connectDB from "@/lib/db";

export async function GET() {
  await connectDB();

  const properties = await Property.find().sort({ createdAt: -1 });

  return NextResponse.json(properties);
}
