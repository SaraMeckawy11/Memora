import nodemailer from 'nodemailer';

const TRANSPORTER_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(TRANSPORTER_CONFIG);

export async function sendOrderConfirmationEmail(order) {
  try {
    const info = await transporter.sendMail({
      from: `"Memora Photobook" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
      to: order.customer.email, // list of receivers
      subject: `Order Confirmed #${order._id}`, // Subject line
      text: `Thank you for your order! Your order ID is ${order._id}. We will notify you when it ships.`, // plain text body
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order ID is <strong>${order._id}</strong>.</p>
        <p>We've received your payment of <strong>${(order.payment.amountCents / 100).toFixed(2)} ${order.payment.currency}</strong>.</p>
        <p>We will notify you when your photobook is shipped.</p>
        <p>Estimated delivery: ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>
        <br>
        <p>For any questions, please contact us on WhatsApp: <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '1234567890'}">Chat with us</a></p>
      `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

export async function sendOrderShippedEmail(order) {
  try {
    const info = await transporter.sendMail({
      from: `"Memora Photobook" <${process.env.SMTP_FROM_EMAIL}>`,
      to: order.customer.email,
      subject: `Your Order #${order._id} Has Shipped!`,
      text: `Good news! Your order #${order._id} is on its way. Tracking Number: ${order.shipping.trackingNumber}.`,
      html: `
        <h1>Your photobook is on its way!</h1>
        <p>Good news! Your order #${order._id} has been shipped.</p>
        <p>Tracking Number: <strong>${order.shipping.trackingNumber}</strong></p>
        <p>Estimated Delivery: ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>
        <br>
        <p>Track your package here: <a href="${process.env.TRACKING_URL_BASE || '#'}${order.shipping.trackingNumber}">Track Order</a></p>
      `,
    });
     console.log("Message sent: %s", info.messageId);
     return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}
