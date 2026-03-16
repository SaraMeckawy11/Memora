import { NextResponse } from 'next/server';
import cloudinary from '../../../../backend/lib/cloudinary';

export async function GET() {
  try {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const folder = 'user_uploads';
    const tags = 'auto_cleanup';
    
    // Parameters to sign
    const params = {
      timestamp: timestamp,
      folder: folder,
      tags: tags
    };

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

    return NextResponse.json({
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder,
      tags
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
