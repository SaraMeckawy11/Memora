import { NextResponse } from 'next/server';
import dbConnect from '../../../../../backend/lib/db';
import Order from '../../../../../backend/models/Order';
import { sendOrderShippedEmail } from '../../../../../backend/lib/email';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, trackingNumber } = body;

    await dbConnect();

    const order = await Order.findById(id);

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status === 'shipped') {
        if (!trackingNumber) {
            return NextResponse.json({ error: 'Tracking number required for shipped status' }, { status: 400 });
        }
        order.shipping = {
            ...order.shipping,
            trackingNumber,
            shippedAt: new Date(),
        };
        // Also update estimatedDelivery if provided, otherwise maybe leave existing or calculate
    }

    if (status) {
        order.status = status;
    }

    await order.save();

    // Trigger Shipped Email
    if (status === 'shipped') {
        try {
            await sendOrderShippedEmail(order);
        } catch (emailError) {
             console.error('Failed to send shipped email:', emailError);
             // Proceed anyway
        }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
