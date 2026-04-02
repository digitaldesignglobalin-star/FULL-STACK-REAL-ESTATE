import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/inquiry.model";
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
      .select("_id")
      .sort({ createdAt: -1 })
      .lean();

    const propertyIds = properties.map((p: any) => p._id);

    const inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } })
      .sort({ createdAt: -1 })
      .lean();

    const propertyMap = new Map();
    properties.forEach((p: any) => {
      propertyMap.set(p._id.toString(), p);
    });

    const enrichedInquiries = await Promise.all(
      inquiries.map(async (inquiry: any) => {
        const prop = propertyMap.get(inquiry.propertyId.toString());
        if (prop) {
          const fullProperty = await Property.findById(inquiry.propertyId)
            .select("type locality city price")
            .lean();
          return {
            ...inquiry,
            propertyType: fullProperty?.type,
            propertyLocality: fullProperty?.locality,
            propertyCity: fullProperty?.city,
            propertyPrice: fullProperty?.price
          };
        }
        return inquiry;
      })
    );

    return NextResponse.json({ inquiries: enrichedInquiries });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}