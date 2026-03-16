import { NextResponse } from 'next/server';
import cloudinary from '../../../../backend/lib/cloudinary';

export async function POST(req) {
  try {
    // --- DEBUGGING CREDENTIALS ---
    // This log helps confirm if the .env file is loaded correctly.
    // We mask the secret for security.
    console.log('Cloudinary Upload Request:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
    });

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
              // Add tag for cleanup job (expires in 7 days)
              tags: ['auto_cleanup'],
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
