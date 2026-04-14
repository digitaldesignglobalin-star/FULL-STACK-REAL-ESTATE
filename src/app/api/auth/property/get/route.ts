import { NextResponse } from "next/server";
import Property from "@/models/property.model";
import connectDB from "@/lib/db";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const purpose = searchParams.get("purpose");
  const search = searchParams.get("search");
  const locality = searchParams.get("locality");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bhk = searchParams.get("bhk");
  const minArea = searchParams.get("minArea");
  const type = searchParams.get("type");
  const postedBy = searchParams.get("postedBy");
  const featured = searchParams.get("featured");

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  // Build query based on filters
  let query: any = {};

  // If status=for-rent is passed, filter for rent/PG properties
  if (status === "for-rent") {
    if (purpose === "pg") {
      query = { 
        $or: [
          { purpose: "pg" },
          { category: "pg" }
        ],
        status: { $ne: "pending" }
      };
    } else {
      query = { 
        purpose: "rent",
        status: { $ne: "pending" }
      };
    }
  } else if (status) {
    query.status = status;
  }

  // Skip pending status filter if status is set (except for-rent which already handles it)
  if (!status) {
    query.status = { $ne: "pending" };
  }

  // Add search filter
  if (search) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { city: { $regex: search, $options: "i" } },
        { locality: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ],
    });
  }

  // Add other filters
  if (locality) {
    query.locality = { $regex: locality, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (bhk) {
    query.bhk = Number(bhk);
  }

  if (minArea) {
    query.area = { $gte: Number(minArea) };
  }

  if (type) {
    query.type = { $regex: type, $options: "i" };
  }

  if (postedBy) {
    query.postedBy = postedBy;
  }

  if (featured === "true") {
    query.featured = true;
  }

  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Property.countDocuments(query);

  return NextResponse.json(
    {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
