import { NextResponse } from 'next/server';
import prisma from '../../../backend/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.customer || !body.deliveryAddress || !body.bookSize || !body.totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Map nested structure to flat Prisma model
    const orderData = {
      sessionId: body.sessionId || 'guest',
      
      // Customer
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      
      // Address
      street: body.deliveryAddress.street,
      building: body.deliveryAddress.building,
      floor: body.deliveryAddress.floor,
      apartment: body.deliveryAddress.apartment,
      city: body.deliveryAddress.city,
      governorate: body.deliveryAddress.governorate,
      country: body.deliveryAddress.country || 'Egypt',
      postalCode: body.deliveryAddress.postalCode,
      
      // Order Details
      bookSize: body.bookSize,
      templateId: body.templateId,
      photoUrls: JSON.stringify(body.photoUrls || []),
      coverConfig: JSON.stringify(body.coverConfig || {}),
      
      status: body.status || 'pending',
      
      // Payment (initial)
      paymentMethod: body.payment?.method || 'paymob',
      totalPrice: body.totalPrice,
      
      // Promo
      promoCode: body.promo?.code,
      discountAmount: body.promo?.discountAmount || 0,
    };

    const order = await prisma.order.create({
      data: orderData,
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const where = {};
    if (status) where.status = status;
    
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const mappedOrders = orders.map(order => ({
      _id: order.id, 
      id: order.id,
      sessionId: order.sessionId,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      deliveryAddress: {
        street: order.street,
        building: order.building,
        floor: order.floor,
        apartment: order.apartment,
        city: order.city,
        governorate: order.governorate,
        country: order.country,
        postalCode: order.postalCode,
      },
      bookSize: order.bookSize,
      templateId: order.templateId,
      photoUrls: JSON.parse(order.photoUrls || '[]'),
      coverConfig: JSON.parse(order.coverConfig || '{}'),
      status: order.status,
      payment: {
        method: order.paymentMethod,
        paymobOrderId: order.paymobOrderId,
        transactionId: order.transactionId,
        amountCents: order.amountCents,
        currency: order.currency,
        paidAt: order.paidAt,
      },
      promo: {
        code: order.promoCode,
        discountAmount: order.discountAmount,
      },
      totalPrice: order.totalPrice,
      shipping: {
        trackingNumber: order.trackingNumber,
        shippedAt: order.shippedAt,
        estimatedDelivery: order.estimatedDelivery,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({ orders: mappedOrders }, { status: 200 });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
