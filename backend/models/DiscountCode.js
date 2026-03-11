import mongoose from 'mongoose';

const DiscountCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscountAmount: {
    type: Number, // Useful for percentage discounts cap
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  usageLimit: {
    type: Number, // Total times can be used
  },
  usedCount: {
    type: Number,
    default: 0,
  },
}, {timestamps: true});

export default mongoose.models.DiscountCode || mongoose.model('DiscountCode', DiscountCodeSchema);
