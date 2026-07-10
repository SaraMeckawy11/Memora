'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/useProjectStore'
import { computeOrderPricing, formatPrice } from '@/lib/pricing'
import { loadCoverDesign } from '@/app/cover/coverStorage'
import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import '@/styles/memora.css'
import '@/styles/order/order.css'

const REQUIRED_FIELDS = [
  ['name', 'Full name'], ['email', 'Email'], ['phone', 'Phone'], ['street', 'Street address'],
  ['city', 'City'], ['governorate', 'Governorate'],
] as const

const FIELDS = [
  ['name', 'Full name', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['phone', 'Phone', 'tel', 'tel'],
  ['street', 'Street address', 'text', 'street-address'], ['building', 'Building', 'text', 'address-line2'],
  ['floor', 'Floor', 'text', 'off'], ['apartment', 'Apartment', 'text', 'off'],
  ['city', 'City', 'text', 'address-level2'], ['governorate', 'Governorate', 'text', 'address-level1'],
  ['postalCode', 'Postal code', 'text', 'postal-code'],
] as const

export default function OrderPage() {
  const router = useRouter()
  const store = useProjectStore()
  const selectedProductObj = PRODUCTS.find(product => product.id === store.selectedProduct)
  const selectedSizeObj = SIZES.find(size => size.id === store.selectedSize)
  const [isProcessing, setIsProcessing] = useState(false)
  const processingRef = useRef(false)
  const sessionRef = useRef(`checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [coverReady, setCoverReady] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    name: '', email: '', phone: '', street: '', building: '', floor: '', apartment: '',
    city: '', governorate: '', postalCode: '', country: 'Egypt',
  })

  const productName = selectedProductObj?.name || 'Softcover'
  const hasBookContent = store.pages.some(page => page.images.some(Boolean) || Boolean(page.textContent?.trim()) || Boolean(page.overlays?.length))
  const canPlaceOrder = Boolean(selectedProductObj && selectedSizeObj && store.pages.length > 0 && hasBookContent && coverReady)
  const pricing = computeOrderPricing({
    productName,
    pageCount: store.pages.length,
    quantity,
    sizeName: selectedSizeObj?.name,
  })

  const showNotification = useCallback((message: string, type = 'success') => {
    setNotification({ message, type })
    window.setTimeout(() => setNotification(null), 3500)
  }, [])

  useEffect(() => {
    const design = loadCoverDesign()
    setCoverReady(Boolean(design && ((design.front?.elements?.length || 0) > 0 || (design.back?.elements?.length || 0) > 0)))
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setShippingInfo(previous => ({ ...previous, [name]: value }))
    setFieldErrors(previous => ({ ...previous, [name]: '' }))
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    for (const [field, label] of REQUIRED_FIELDS) {
      if (!shippingInfo[field].trim()) errors[field] = `${label} is required`
    }
    if (shippingInfo.email && !/^\S+@\S+\.\S+$/.test(shippingInfo.email)) errors.email = 'Enter a valid email address'
    if (shippingInfo.phone && !/^[+\d][\d\s()-]{7,}$/.test(shippingInfo.phone)) errors.phone = 'Enter a valid phone number'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCheckout = async () => {
    if (!canPlaceOrder) {
      showNotification('Return to review and finish your book first', 'error')
      return
    }
    if (!validate()) {
      showNotification('Check the highlighted delivery details', 'error')
      return
    }
    if (processingRef.current) return
    processingRef.current = true
    setIsProcessing(true)

    try {
      const orderPayload = {
        sessionId: sessionRef.current,
        customer: { name: shippingInfo.name.trim(), email: shippingInfo.email.trim(), phone: shippingInfo.phone.trim() },
        deliveryAddress: {
          street: shippingInfo.street.trim(), building: shippingInfo.building.trim(), floor: shippingInfo.floor.trim(),
          apartment: shippingInfo.apartment.trim(), city: shippingInfo.city.trim(), governorate: shippingInfo.governorate.trim(),
          postalCode: shippingInfo.postalCode.trim(), country: shippingInfo.country,
        },
        bookSize: selectedSizeObj?.name,
        photoUrls: store.uploadedImages.map(image => image.src),
        coverConfig: { product: productName, quantity, coverDesign: loadCoverDesign() },
        product: productName,
        pageCount: store.pages.length,
        quantity,
        pages: store.pages,
      }

      const createResponse = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload),
      })
      const createData = await createResponse.json().catch(() => null)
      if (!createResponse.ok) throw new Error(createData?.error || 'Failed to create order')

      const paymentResponse = await fetch('/api/paymob/initiate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: createData.orderId }),
      })
      const paymentData = await paymentResponse.json().catch(() => null)
      if (!paymentResponse.ok) throw new Error(paymentData?.error || 'Failed to initiate payment')

      if (paymentData.iframeUrl) window.location.assign(paymentData.iframeUrl)
      else if (paymentData.success) router.push(`/order/success?merchant_order_id=${createData.orderId}&success=true`)
      else throw new Error('Payment could not be started')
    } catch (error) {
      console.error('Checkout error:', error)
      showNotification('Something went wrong. Please try again.', 'error')
      processingRef.current = false
      setIsProcessing(false)
    }
  }

  return (
    <div className="memora-root order-root">
      {notification && <div className={`order-toast ${notification.type === 'error' ? 'order-toast--error' : ''}`} role="alert">{notification.message}</div>}
      <header className="order-header">
        <button className="m-btn-secondary" onClick={() => router.push('/create?step=3')} type="button">&larr; back to review</button>
        <h1 className="m-display order-title">Checkout</h1>
        <span className="m-pill">secure checkout</span>
      </header>

      <main className="order-main">
        <section className="order-card order-summary">
          <h2 className="m-mono order-card-label">your book</h2>
          <div className="order-summary-row"><span>{productName} &middot; {selectedSizeObj?.name || 'Size not selected'}</span><span className="m-mono">{store.pages.length} pages</span></div>
          <div className="order-summary-row order-qty-row">
            <span>Quantity</span>
            <div className="order-qty" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity">&minus;</button>
              <span className="m-mono" aria-live="polite">{quantity}</span>
              <button type="button" onClick={() => setQuantity(value => Math.min(50, value + 1))} aria-label="Increase quantity">+</button>
            </div>
          </div>
        </section>

        <section className="order-card order-form">
          <h2 className="m-mono order-card-label">delivery details</h2>
          <div className="order-form-grid">
            {FIELDS.map(([name, label, type, autoComplete]) => {
              const required = REQUIRED_FIELDS.some(([field]) => field === name)
              return (
                <label key={name} className={`order-field ${name === 'street' ? 'order-input-wide' : ''}`}>
                  <span>{label}{required ? ' *' : ''}</span>
                  <input name={name} type={type} value={shippingInfo[name]} onChange={handleInputChange} autoComplete={autoComplete} aria-invalid={Boolean(fieldErrors[name])} aria-describedby={fieldErrors[name] ? `${name}-error` : undefined} />
                  {fieldErrors[name] && <small id={`${name}-error`}>{fieldErrors[name]}</small>}
                </label>
              )
            })}
          </div>
          <p className="order-form-hint m-serif">* required &mdash; we deliver across Egypt.</p>
        </section>

        <aside className="order-card order-totals">
          <h2 className="m-mono order-card-label">order total</h2>
          <div className="order-total-row"><span>Subtotal</span><span className="m-mono">{formatPrice(pricing.subtotal)}</span></div>
          <div className="order-total-row"><span>Shipping</span><span className="m-mono">{formatPrice(pricing.shipping)}</span></div>
          {pricing.tax > 0 && <div className="order-total-row"><span>Tax</span><span className="m-mono">{formatPrice(pricing.tax)}</span></div>}
          <div className="order-total-row order-total-final"><span>Total</span><span className="m-mono">{formatPrice(pricing.total)}</span></div>
          <p className="order-secure-note">Your order details are checked again securely before confirmation.</p>
          {!canPlaceOrder && <p className="order-readiness">Your book is not ready yet. Return to review to add page content and a cover.</p>}
          <button className="m-btn-primary order-pay-btn" onClick={handleCheckout} disabled={isProcessing || !canPlaceOrder} type="button">
            {isProcessing ? 'Processing…' : pricing.total > 0 ? 'Pay securely' : 'Place order'}
            {!isProcessing && <span className="m-btn-primary__arrow">&rarr;</span>}
          </button>
        </aside>
      </main>
    </div>
  )
}
