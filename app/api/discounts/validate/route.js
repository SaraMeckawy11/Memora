import { NextResponse } from 'next/server';
import dbConnect from '../../../../backend/lib/db';
import DiscountCode from '../../../../backend/models/DiscountCode';

export async function POST(req) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Code required' }, { status: 400 });
    }

    await dbConnect();

    const discount = await DiscountCode.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!discount) {
      return NextResponse.json({ valid: false, message: 'Invalid code' }, { status: 404 });
    }

    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return NextResponse.json({ valid: false, message: 'Code expired' }, { status: 400 });
    }

    if (discount.usageLimit !== undefined && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json({ valid: false, message: 'Usage limit reached' }, { status: 400 });
    }

    if (orderTotal !== undefined && discount.minOrderAmount > orderTotal) {
        return NextResponse.json({ valid: false, message: `Minimum order amount is ${discount.minOrderAmount}` }, { status: 400 });
    }

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (orderTotal * discount.value) / 100;
      if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
        discountAmount = discount.maxDiscountAmount;
      }
    } else {
      discountAmount = discount.value;
    }

    return NextResponse.json({ 
      valid: true, 
      discountAmount, 
      code: discount.code,
      type: discount.type,
      value: discount.value 
    });

  } catch (error) {
    console.error('Discount validation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
