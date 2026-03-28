import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const requiredFields = ["city", "price"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const propertyData: Record<string, unknown> = { ...body };

    if (body.price) propertyData.price = Number(body.price);
    if (body.bhk) propertyData.bhk = Number(body.bhk);
    if (body.area) propertyData.area = Number(body.area);
    if (body.pricePerSqft) propertyData.pricePerSqft = Number(body.pricePerSqft);
    if (body.deposit) propertyData.deposit = Number(body.deposit);
    if (body.maintenance) propertyData.maintenance = Number(body.maintenance);
    if (body.bed) propertyData.bed = Number(body.bed);
    if (body.bath) propertyData.bath = Number(body.bath);
    if (body.bal) propertyData.bal = Number(body.bal);

    const allowedStatus = ["new", "launched", "ready", "under-construction", "pending", "rejected"];
    if (!allowedStatus.includes(body.status)) {
      propertyData.status = "pending";
    }

    const property = await Property.create(propertyData);

    return NextResponse.json({
      success: true,
      property,
      message: "Property created successfully"
    });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create property" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const city = searchParams.get("city");

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { city: { $regex: search, $options: "i" } },
        { locality: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("postedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get properties error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
