import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'kahustle/products',
          resource_type: 'auto',
          max_file_size: 5242880, // 5MB
        },
        (error, result) => {
          if (error) {
            console.error('[v0] Cloudinary upload error:', error);
            resolve(
              NextResponse.json(
                { success: false, error: 'Upload failed' },
                { status: 500 }
              )
            );
          } else {
            resolve(
              NextResponse.json({
                success: true,
                url: result?.secure_url,
                publicId: result?.public_id,
              })
            );
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('[v0] Upload endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
