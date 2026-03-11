import { NextResponse } from 'next/server';
import dbConnect from '../../../../backend/lib/db';
import Order from '../../../../backend/models/Order';

export async function GET(req) {
  try {
    // Middleware should protect this route with /admin/*
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = status ? { status } : {};
    
    // Use select to optimize if needed, but "all orders sorted by date" is requested
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('List orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
