/**
 * Edit this file when Memora's prices are finalized.
 *
 * CHECKOUT_PRICING is the single source of truth used by both the browser and
 * the order API. Keep these values numeric and in EGP. They intentionally all
 * start at zero so test orders never reach a payment gateway with a fake cost.
 * LANDING_STARTING_PRICE is marketing copy only and is not used at checkout.
 */
export const LANDING_STARTING_PRICE = 900

export const CHECKOUT_PRICING = {
  currency: 'EGP',
  includedPages: 20,
  covers: {
    hardcover: 0,
    softcover: 0,
  },
  extraPage: 0,
  sizes: {
    'A4 Portrait': 0,
    'B5 Portrait': 0,
  },
  shippingPerBook: 0,
  taxRate: 0,
} as const

const round2 = (value: number) => Math.round(value * 100) / 100

export interface OrderPricingInput {
  productName: string
  pageCount: number
  quantity: number
  sizeName?: string
}

export interface OrderPricing {
  basePrice: number
  extraPages: number
  extraPagesPrice: number
  sizePrice: number
  unitPrice: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  quantity: number
  currency: typeof CHECKOUT_PRICING.currency
}

export function computeOrderPricing({ productName, pageCount, quantity, sizeName }: OrderPricingInput): OrderPricing {
  const qty = Math.min(50, Math.max(1, Math.floor(Number(quantity)) || 1))
  const pages = Math.max(0, Math.floor(Number(pageCount)) || 0)
  const coverKey = productName.toLowerCase().includes('hard') ? 'hardcover' : 'softcover'
  const basePrice = CHECKOUT_PRICING.covers[coverKey]
  const extraPages = Math.max(0, pages - CHECKOUT_PRICING.includedPages)
  const extraPagesPrice = round2(extraPages * CHECKOUT_PRICING.extraPage)
  const sizePrice = sizeName && sizeName in CHECKOUT_PRICING.sizes
    ? CHECKOUT_PRICING.sizes[sizeName as keyof typeof CHECKOUT_PRICING.sizes]
    : 0
  const unitPrice = round2(basePrice + extraPagesPrice + sizePrice)
  const subtotal = round2(unitPrice * qty)
  const shipping = round2(CHECKOUT_PRICING.shippingPerBook * qty)
  const tax = round2((subtotal + shipping) * CHECKOUT_PRICING.taxRate)
  const total = round2(subtotal + shipping + tax)

  return {
    basePrice,
    extraPages,
    extraPagesPrice,
    sizePrice,
    unitPrice,
    subtotal,
    shipping,
    tax,
    total,
    quantity: qty,
    currency: CHECKOUT_PRICING.currency,
  }
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${CHECKOUT_PRICING.currency}`
}
