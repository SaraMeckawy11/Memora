import { NextResponse } from 'next/server';
import prisma from '../../../../../backend/lib/prisma';
import { sendOrderShippedEmail } from '../../../../../backend/lib/email';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    const order = await prisma.order.findUnique({
        where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Map to nested
    const mappedOrder = {
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
    };

    return NextResponse.json({ order: mappedOrder });
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

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData = {};

    if (status === 'shipped') {
        if (!trackingNumber) {
            return NextResponse.json({ error: 'Tracking number required for shipped status' }, { status: 400 });
        }
        updateData.status = 'shipped';
        updateData.trackingNumber = trackingNumber;
        updateData.shippedAt = new Date();
    } else if (status) {
        updateData.status = status;
    }

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
    });

    const emailOrderObj = {
         customer: {
             name: updatedOrder.customerName,
             email: updatedOrder.customerEmail,
         },
         id: updatedOrder.id,
         shipping: {
             trackingNumber: updatedOrder.trackingNumber,
         }
    };

    if (status === 'shipped') {
        try {
            await sendOrderShippedEmail(emailOrderObj);
        } catch (emailError) {
             console.error('Failed to send shipped email:', emailError);
        }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
