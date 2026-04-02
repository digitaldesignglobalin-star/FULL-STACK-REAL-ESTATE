import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";

    let data: any;
    let images: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {};
      formData.forEach((value, key) => {
        if (key === "images") {
          images.push(value as File);
        } else {
          data[key] = value.toString();
        }
      });
    } else {
      data = await req.json();
    }

    const property = await Property.findOne({
      _id: id,
      postedBy: session.user.id,
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found or unauthorized" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (data.purpose !== undefined) updateData.purpose = data.purpose;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.locality !== undefined) updateData.locality = data.locality;
    if (data.bhk !== undefined) updateData.bhk = data.bhk;
    if (data.bed !== undefined) updateData.bed = data.bed;
    if (data.bath !== undefined) updateData.bath = data.bath;
    if (data.bal !== undefined) updateData.bal = data.bal;
    if (data.area !== undefined) updateData.area = data.area;
    if (data.areaUnit !== undefined) updateData.areaUnit = data.areaUnit;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.pricePerSqft !== undefined) updateData.pricePerSqft = data.pricePerSqft;
    if (data.deposit !== undefined) updateData.deposit = data.deposit;
    if (data.maintenance !== undefined) updateData.maintenance = data.maintenance;
    if (data.maintenanceType !== undefined) updateData.maintenanceType = data.maintenanceType;
    if (data.furnish !== undefined) updateData.furnish = data.furnish;
    if (data.age !== undefined) updateData.age = data.age;
    if (data.ownership !== undefined) updateData.ownership = data.ownership;
    if (data.negotiable !== undefined) updateData.negotiable = data.negotiable;
    if (data.tenant !== undefined) updateData.tenant = data.tenant;
    if (data.broker !== undefined) updateData.broker = data.broker;
    if (data.availableFrom !== undefined) updateData.availableFrom = data.availableFrom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.existingImages !== undefined) updateData.images = JSON.parse(data.existingImages);

    // Handle new image uploads
    if (images.length > 0) {
      const uploadedImages: string[] = [];
      
      for (const file of images) {
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

      // Get existing images (from the form's existingImages)
      const existingImages = data.existingImages ? JSON.parse(data.existingImages) : property.images || [];
      updateData.images = [...existingImages, ...uploadedImages];
    }

    if (Object.keys(updateData).length > 0) {
      updateData.status = "pending";
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedProperty);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
