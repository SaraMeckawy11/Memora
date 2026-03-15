import { NextResponse } from 'next/server';
import cloudinary from '../../../../backend/lib/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a stream
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'auto', 
              folder: 'user_uploads',
              // Optimize for quality and size automatically
              fetch_format: 'auto',
              quality: 'auto'
            }, 
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });

    return NextResponse.json({ 
        success: true, 
        secure_url: result.secure_url, 
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
