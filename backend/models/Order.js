import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String }, // optional, maybe same as phone
  },
  deliveryAddress: {
    street: { type: String, required: true },
    building: { type: String },
    floor: { type: String },
    apartment: { type: String },
    city: { type: String, required: true },
    governorate: { type: String, required: true },
    country: { type: String, default: 'Egypt' },
    postalCode: { type: String },
    landmark: { type: String },
  },
  bookSize: {
    type: String,
    enum: ['Square', 'Landscape', 'Portrait'], // Example sizes
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  },
  photoUrls: [{
    type: String, // Cloudinary URLs
  }],
  coverConfig: {
    type: mongoose.Schema.Types.Mixed, // flexible object for cover configuration
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
    default: 'pending',
    index: true,
  },
  payment: {
    method: { type: String, default: 'paymob' },
    paymobOrderId: { type: String },
    transactionId: { type: String },
    amountCents: { type: Number }, // Paymob uses cents
    currency: { type: String, default: 'EGP' },
    paidAt: { type: Date },
  },
  promo: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  shipping: {
    trackingNumber: { type: String },
    shippedAt: { type: Date },
    estimatedDelivery: { type: Date },
  },
}, {timestamps: true});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
