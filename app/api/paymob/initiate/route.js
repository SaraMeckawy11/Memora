import { NextResponse } from 'next/server';
import prisma from '../../../../backend/lib/prisma';
import { getPaymobToken, registerPaymobOrder, getPaymentKey, getIframeUrl } from '../../../../backend/lib/paymob';

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Check if order is already paid - Idempotency
    if (order.status === 'paid') {
       return NextResponse.json({ success: true, message: 'Order already paid', redirectProps: { success: true } });
    }

    // 1. Get Authentication Token
    const authToken = await getPaymobToken();

    // 2. Register Order
    const amountCents = Math.round(order.totalPrice * 100); 
    const merchantOrderId = order.id;
    
    // This function returns the Paymob Order ID 
    const paymobOrderId = await registerPaymobOrder(authToken, merchantOrderId, amountCents);
    
    // Save Paymob Order ID to our database
    await prisma.order.update({
        where: { id: orderId },
        data: {
            paymobOrderId: String(paymobOrderId),
            amountCents: amountCents,
        }
    });

    // 3. Get Payment Key
    const billingData = {
      email: order.customerEmail,
      firstName: order.customerName.split(' ')[0] || "Customer",
      lastName: order.customerName.split(' ').slice(1).join(' ') || "Name",
      phone: order.customerPhone,
      street: order.street,
      building: order.building || "NA",
      floor: order.floor || "NA",
      apartment: order.apartment || "NA",
      city: order.city,
      district: order.city, 
      postalCode: order.postalCode || "00000",
      country: order.country || "EG",
      state: order.governorate,
    };

    const paymentKey = await getPaymentKey(authToken, paymobOrderId, amountCents, billingData);
    const iframeUrl = getIframeUrl(paymentKey);

    return NextResponse.json({ iframeUrl });
  } catch (error) {
    console.error('Paymob initiation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
