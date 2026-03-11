import { NextResponse } from 'next/server';
import dbConnect from '../../../../backend/lib/db';
import Order from '../../../../backend/models/Order';
import { getPaymobToken, registerPaymobOrder, getPaymentKey, getIframeUrl } from '../../../../backend/lib/paymob';

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.findById(orderId);

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
    const amountCents = order.totalPrice * 100; // Paymob uses cents
    const merchantOrderId = order._id.toString();
    const paymobOrderId = await registerPaymobOrder(authToken, merchantOrderId, amountCents);
    
    // Save Paymob Order ID to our database
    order.payment = { 
        ...order.payment, 
        paymobOrderId: paymobOrderId,
        amountCents: amountCents
    };
    await order.save();

    // 3. Get Payment Key
    const billingData = {
      email: order.customer.email,
      firstName: order.customer.name.split(' ')[0] || "Customer",
      lastName: order.customer.name.split(' ').slice(1).join(' ') || "Name",
      phone: order.customer.phone,
      street: order.deliveryAddress.street,
      building: order.deliveryAddress.building,
      floor: order.deliveryAddress.floor,
      apartment: order.deliveryAddress.apartment,
      city: order.deliveryAddress.city,
      district: order.deliveryAddress.district,
      postalCode: order.deliveryAddress.postalCode,
      country: order.deliveryAddress.country || "EG",
      state: order.deliveryAddress.governorate,
    };

    const paymentKey = await getPaymentKey(authToken, paymobOrderId, amountCents, billingData);
    const iframeUrl = getIframeUrl(paymentKey);

    return NextResponse.json({ iframeUrl });
  } catch (error) {
    console.error('Paymob initiation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
