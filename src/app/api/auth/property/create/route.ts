import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await auth();

    const data = await req.formData();

    const images = data.getAll("images");
    const video = data.get("video");

    const uploadedImages: string[] = [];

    for (const file of images as File[]) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "properties" },
          (err: any, result: any) => {
            if (err) reject(err);
            else resolve(result);
          },
        );

        stream.end(buffer);
      });

      uploadedImages.push(uploaded.secure_url);
    }

    let videoUrl = "";

    if (video && video instanceof File) {
      const bytes = await video.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video" },
          (err: any, result: any) => {
            if (err) reject(err);
            else resolve(result);
          },
        );

        stream.end(buffer);
      });

      videoUrl = uploaded.secure_url;
    }

    // ✅ SAVE ALL FIELDS
    const propertyData: any = {};

    // data.forEach((value, key) => {
    //   propertyData[key] = value;
    // });

    data.forEach((value, key) => {
      if (key !== "images" && key !== "video") {
        propertyData[key] = value.toString(); // 🔥 ALWAYS include
      }
    });

    // convert numeric fields AFTER the loop
    // ✅ FIX BHK PROPERLY
    if (propertyData.bhk) {
      const parsed = Number(propertyData.bhk);

      if (isNaN(parsed)) {
        return NextResponse.json(
          { message: "Invalid BHK value" },
          { status: 400 },
        );
      }

      propertyData.bhk = parsed;
    }

    if (propertyData.price) {
      const price = Number(propertyData.price);

      if (isNaN(price)) {
        return NextResponse.json({ message: "Invalid price" }, { status: 400 });
      }

      propertyData.price = price;
    }

    if (propertyData.area) {
      const area = Number(propertyData.area);

      if (isNaN(area)) {
        return NextResponse.json({ message: "Invalid area" }, { status: 400 });
      }

      propertyData.area = area;
    }

    if ("pricePerSqft" in propertyData) {
  const pps = Number(propertyData.pricePerSqft);

  if (!isNaN(pps)) {
    propertyData.pricePerSqft = pps;
  } else {
    delete propertyData.pricePerSqft;
  }
}

    propertyData.images = uploadedImages;
    propertyData.video = videoUrl;

    if (session?.user?.id) {
      propertyData.postedBy = session.user.id;
      propertyData.postedByRole = session.user.role;
    }

    const allowedStatus = ["new", "launched", "ready", "under-construction", "pending"];

    if (!allowedStatus.includes(propertyData.status)) {
      propertyData.status = "pending";
    }

    if (!propertyData.city || !propertyData.price) {
      return NextResponse.json(
        { message: "City and price required" },
        { status: 400 },
      );
    }

    const property = await Property.create(propertyData);

    return NextResponse.json(property);
  } catch (err) {
    console.error(err);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
