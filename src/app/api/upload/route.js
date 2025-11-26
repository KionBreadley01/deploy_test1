import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "gymgg",
  api_key: process.env.CLOUDINARY_API_KEY || "664889547226734",
  api_secret: process.env.CLOUDINARY_API_SECRET || "0elwoQUffmpg0RW2cNztlLpfrns",
});

export async function POST(request) {
  try {
    const data = await request.formData();
    const image = data.get("image");

    if (!image) {
      return NextResponse.json({ message: "no se ha subido ninguna imagen" }, { status: 400 });
    }

    // Convert uploaded File to Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload as data URI to Cloudinary (avoids writing to disk)
    const mime = image.type || "application/octet-stream";
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mime};base64,${base64}`;

    const response = await cloudinary.uploader.upload(dataUri, {
      folder: "uploads", // optional
    });

    console.log("Uploaded to Cloudinary:", response.secure_url);

    return NextResponse.json({
      message: "imagen subida",
      url: response.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
