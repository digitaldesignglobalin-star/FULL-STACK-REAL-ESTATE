import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export async function POST(req: Request) {
  await connectDB();

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

  // const property = await Property.create({
  //   city: data.get("city"),
  //   locality: data.get("locality"),
  //   price: data.get("price"),
  //   purpose: data.get("purpose"),
  //   type: data.get("type"),
  //   bhk: data.get("bhk"),
  //   description: data.get("description"),
  //   images: uploadedImages,
  //   video: videoUrl,
  //   status: data.get("status"),
  // });

  const propertyData: any = {};

data.forEach((value, key) => {
  propertyData[key] = value;
});

propertyData.images = uploadedImages;
propertyData.video = videoUrl;

const property = await Property.create(propertyData);

  return NextResponse.json(property);
}
