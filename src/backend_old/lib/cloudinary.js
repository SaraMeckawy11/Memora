import { v2 as cloudinary } from 'cloudinary';

// Check if CLOUDINARY_URL is provided (Standard method)
if (process.env.CLOUDINARY_URL) {
    // The SDK automatically picks up CLOUDINARY_URL context
    cloudinary.config({
      secure: true
    });
} else {
    // Fallback to individual variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
      api_key: process.env.CLOUDINARY_API_KEY?.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
      secure: true,
    });
}

export default cloudinary;
