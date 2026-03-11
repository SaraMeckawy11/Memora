import { NextResponse } from 'next/server';
import prisma from '../../../../backend/lib/prisma';

export const dynamic = 'force-dynamic';

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
      // templateId: order.templateId, 
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
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({ orders: mappedOrders });
  } catch (error) {
    console.error('List orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
