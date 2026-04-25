import { NextResponse } from 'next/server';
import prisma from '../../../../backend/lib/prisma';
import { verifyHmac } from '../../../../backend/lib/paymob';
import { sendOrderConfirmationEmail } from '../../../../backend/lib/email'; 

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
    
    // Find order by merchant_order_id 
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency check
    if (order.status === 'paid') {
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    if (transactionData.success) {
      await prisma.order.update({
          where: { id: orderId },
          data: {
              status: 'paid',
              transactionId: String(transactionData.id),
              paidAt: new Date(),
              paymentMethod: transactionData.source_data.type,
              amountCents: transactionData.amount_cents,
              currency: transactionData.currency,
          }
      });
      
      // Fetch updated order for email
      const updatedOrder = await prisma.order.findUnique({ where: { id: orderId } });
      
      const emailOrderObj = {
          _id: updatedOrder.id,
          id: updatedOrder.id,
          customer: {
              name: updatedOrder.customerName,
              email: updatedOrder.customerEmail,
          },
          totalPrice: updatedOrder.totalPrice,
          payment: {
              amountCents: updatedOrder.amountCents,
              currency: updatedOrder.currency,
          },
          shipping: {
              estimatedDelivery: updatedOrder.estimatedDelivery,
          }
      };

      // Trigger Email
      await sendOrderConfirmationEmail(emailOrderObj);
    } else {
      await prisma.order.update({
          where: { id: orderId },
          data: { status: 'failed' }
      });
      console.error(`Transaction failed for order ${orderId}: ${transactionData.data.message || 'Unknown error'}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
