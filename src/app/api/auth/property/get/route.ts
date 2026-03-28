import { NextResponse } from "next/server";
import Property from "@/models/property.model";
import connectDB from "@/lib/db";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const locality = searchParams.get("locality");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bhk = searchParams.get("bhk");
  const minArea = searchParams.get("minArea");
  const type = searchParams.get("type");
  const postedBy = searchParams.get("postedBy");

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const conditions: any[] = [];

  if (status) {
    conditions.push({ status });
  }

  if (search) {
    conditions.push({
      $or: [
        { city: { $regex: search, $options: "i" } },
        { locality: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (locality) {
    conditions.push({
      locality: { $regex: locality, $options: "i" },
    });
  }

  if (minPrice || maxPrice) {
    const priceFilter: any = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    conditions.push({ price: priceFilter });
  }

  if (bhk) {
    const parsed = Number(bhk);
    if (!isNaN(parsed)) {
      conditions.push({ bhk: parsed });
    }
  }

  if (minArea) {
    conditions.push({ area: { $gte: Number(minArea) } });
  }

  if (type) {
    conditions.push({ type: { $regex: `^${type}$`, $options: "i" } });
  }

  if (postedBy) {
    conditions.push({ postedBy: { $regex: `^${postedBy}$`, $options: "i" } });
  }

  const query = conditions.length ? { $and: conditions } : {};

  const [properties, total] = await Promise.all([
    Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Property.countDocuments(query),
  ]);

  return NextResponse.json({
    properties,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
