import { createHmac, timingSafeEqual } from 'crypto';

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const assertConfigured = (...values) => {
  if (values.some(value => !value)) throw new Error('Payment provider is not configured');
};

async function parsePaymobResponse(response, action) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Paymob ${action} failed (${response.status})`);
  return data;
}

export async function getPaymobToken() {
  assertConfigured(PAYMOB_API_KEY);
  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });
  const data = await parsePaymobResponse(response, 'authentication');
  if (!data.token) throw new Error('Paymob authentication returned no token');
  return data.token;
}

export async function registerPaymobOrder(authToken, merchantOrderId, amountCents) {
  const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [], // Optional: add items details
    }),
  });
  const data = await parsePaymobResponse(response, 'order registration');
  if (!data.id) throw new Error('Paymob order registration returned no order ID');
  return data.id;
}

export async function getPaymentKey(authToken, paymobOrderId, amountCents, billingData) {
  assertConfigured(PAYMOB_INTEGRATION_ID);
  const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: {
        apartment: billingData.apartment || "NA",
        email: billingData.email,
        floor: billingData.floor || "NA",
        first_name: billingData.firstName,
        street: billingData.street,
        building: billingData.building || "NA",
        phone_number: billingData.phone,
        shipping_method: "NA",
        postal_code: billingData.postalCode || "NA",
        city: billingData.city,
        country: billingData.country || "EG",
        last_name: billingData.lastName,
        state: billingData.state || "NA",
      },
      currency: "EGP",
      integration_id: PAYMOB_INTEGRATION_ID,
      lock_order_when_paid: "false",
    }),
  });
  const data = await parsePaymobResponse(response, 'payment-key creation');
  if (!data.token) throw new Error('Paymob returned no payment key');
  return data.token;
}

export function getIframeUrl(paymentKey) {
  assertConfigured(PAYMOB_IFRAME_ID, paymentKey);
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

export function verifyHmac(data, hmac) {
    const secret = process.env.PAYMOB_HMAC_SECRET;
    if (!secret || !data || !hmac) return false;
    
    // Pick the fields required for HMAC calculation sorted by key
    // Paymob documentation specifies the order of fields for concatenation
    // This is crucial: amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, order, owner, pending, source_data.pan, source_data.sub_type, source_data.type, success
    
    const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order,
        owner,
        pending,
        source_data,
        success,
    } = data;

    const concatenatedString = [
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order.id, 
        owner,
        pending,
        source_data?.pan,
        source_data?.sub_type,
        source_data?.type,
        success,
    ].join('');

    const calculatedHmac = createHmac('sha512', secret).update(concatenatedString).digest('hex');
    const expected = Buffer.from(calculatedHmac, 'utf8');
    const received = Buffer.from(String(hmac), 'utf8');
    return expected.length === received.length && timingSafeEqual(expected, received);
}
