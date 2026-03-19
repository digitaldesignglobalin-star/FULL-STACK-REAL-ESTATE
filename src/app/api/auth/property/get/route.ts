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

  const conditions: any[] = [];

  // STATUS
  if (status) {
    conditions.push({ status });
  }

  // SEARCH (city, locality, type)
  if (search) {
    conditions.push({
      $or: [
        { city: { $regex: search, $options: "i" } },
        { locality: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ],
    });
  }

  // LOCALITY
  if (locality) {
    conditions.push({
      locality: { $regex: locality, $options: "i" },
    });
  }

  // PRICE
  if (minPrice || maxPrice) {
    const priceFilter: any = {};

    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);

    conditions.push({ price: priceFilter });
  }

  // BHK
  // BHK
  if (bhk) {
  const parsed = Number(bhk);

  if (!isNaN(parsed)) {
    conditions.push({ bhk: parsed });
  }
}
  // AREA
  if (minArea) {
    conditions.push({ area: { $gte: Number(minArea) } });
  }

  // TYPE
  if (type) {
    conditions.push({ type: { $regex: `^${type}$`, $options: "i" } });
  }

  // POSTED BY
  if (postedBy) {
    conditions.push({ postedBy: { $regex: `^${postedBy}$`, $options: "i" } });
  }

  const query = conditions.length ? { $and: conditions } : {};

  console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

  const properties = await Property.find(query).sort({ createdAt: -1 });

  return NextResponse.json(properties);
}
