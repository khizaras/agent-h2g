import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
      return NextResponse.json(
        { success: false, error: "ImageKit configuration missing" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 },
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size too large. Maximum 5MB allowed." },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `causes/${session.user.id}/${timestamp}_${file.name}`;

    // Upload to ImageKit
    const ImageKit = require('imagekit');
    const imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: '/causes/',
      tags: ['cause', 'user-upload'],
    });

    return NextResponse.json({
      success: true,
      data: {
        fileId: uploadResponse.fileId,
        url: uploadResponse.url,
        thumbnailUrl: uploadResponse.thumbnailUrl,
        name: uploadResponse.name,
        size: uploadResponse.size,
      },
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
      return NextResponse.json(
        { success: false, error: "ImageKit configuration missing" },
        { status: 500 },
      );
    }

    // Generate ImageKit authentication parameters for client-side uploads
    const ImageKit = require('imagekit');
    const imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json({
      success: true,
      data: {
        ...authenticationParameters,
        publicKey: IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: IMAGEKIT_URL_ENDPOINT,
      },
    });

  } catch (error) {
    console.error("Error generating ImageKit auth:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate authentication parameters" },
      { status: 500 },
    );
  }
}