import { NextResponse } from 'next/server';
import dbConnect from '../../../../backend/lib/db';
import Order from '../../../../backend/models/Order';
import { verifyHmac } from '../../../../backend/lib/paymob';
import { sendOrderConfirmationEmail } from '../../../../backend/lib/email'; // To be implemented

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hmac = searchParams.get('hmac');
    const body = await req.json();

    // Verify HMAC
    if (!verifyHmac(body.obj, hmac)) {
      console.error('HMAC verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const transactionData = body.obj;
    const orderId = transactionData.order.merchant_order_id;
    
    await dbConnect();
    const order = await Order.findById(orderId);

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency check
    if (order.status === 'paid') {
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    if (transactionData.success) {
      order.status = 'paid';
      order.payment = {
        ...order.payment,
        transactionId: transactionData.id,
        paidAt: new Date(),
        method: transactionData.source_data.type,
        amountCents: transactionData.amount_cents,
        currency: transactionData.currency,
      };
      await order.save();

      // Trigger Email
      await sendOrderConfirmationEmail(order);
    } else {
      order.status = 'failed';
      // Log specific failure reason if available
      console.error(`Transaction failed for order ${orderId}: ${transactionData.data.message || 'Unknown error'}`);
      await order.save();
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
