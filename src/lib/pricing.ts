// Single source of truth for order pricing.
// Used by the checkout UI for display AND by /api/orders to compute the
// authoritative total — the server never trusts a client-sent price.

export const PRICING = {
  basePrice: 499, // EGP, softcover base
  hardcoverMultiplier: 1.5,
  perPage: 10, // EGP per book page
  shippingPerBook: 50, // EGP
  taxRate: 0.14,
}

const round2 = (n: number) => Math.round(n * 100) / 100

export interface OrderPricingInput {
  productName: string // 'Hardcover' | 'Softcover'
  pageCount: number
  quantity: number
}

export interface OrderPricing {
  unitPrice: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  quantity: number
}

export function computeOrderPricing({ productName, pageCount, quantity }: OrderPricingInput): OrderPricing {
  const qty = Math.min(50, Math.max(1, Math.floor(Number(quantity)) || 1))
  const pages = Math.max(0, Math.floor(Number(pageCount)) || 0)
  const multiplier = productName === 'Hardcover' ? PRICING.hardcoverMultiplier : 1
  const unitPrice = round2(PRICING.basePrice * multiplier + pages * PRICING.perPage)
  const subtotal = round2(unitPrice * qty)
  const shipping = PRICING.shippingPerBook * qty
  const tax = round2((subtotal + shipping) * PRICING.taxRate)
  const total = round2(subtotal + shipping + tax)
  return { unitPrice, subtotal, shipping, tax, total, quantity: qty }
}
