import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET(req) {
  // Optional: Check for CRON_SECRET if you set it up in Vercel/environment
  // const authHeader = req.headers.get('authorization');
  // if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // 1. Calculate the date 7 days ago
    // Actually, Cloudinary search supports relative dates like '7d'.
    // Expression: created_at < 7d AND tags:auto_cleanup
    
    const searchExpression = 'tags:auto_cleanup AND created_at < 7d';
    
    // Search for resources matching the criteria
    // Note: The Search API is rate limited but this runs once a day typically.
    const searchResult = await cloudinary.search
      .expression(searchExpression)
      .max_results(500) // Adjust if expecting high volume
      .execute();

    const resources = searchResult.resources;
    
    if (resources.length === 0) {
      return NextResponse.json({ message: 'No images found to cleanup', count: 0 });
    }

    const publicIds = resources.map(resource => resource.public_id);

    // 2. Delete the found resources
    // api.delete_resources accepts an array of public_ids
    const deleteResult = await cloudinary.api.delete_resources(publicIds, {
        invalidate: true,  // Clear CDN cache
        type: 'upload',     // Default type
        resource_type: 'image'
    });

    console.log(`Cleanup run: Deleted ${publicIds.length} images.`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${publicIds.length} images`,
      deleted_ids: publicIds,
      details: deleteResult
    });

  } catch (error) {
    console.error('Cleanup Cron Job Error:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup', details: error.message },
      { status: 500 }
    );
  }
}
