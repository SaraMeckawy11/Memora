'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/useProjectStore'
import { computeOrderPricing } from '@/lib/pricing'
import { loadCoverDesign } from '@/app/cover/coverStorage'

import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import '@/styles/memora.css'
import '@/styles/order/order.css'

const REQUIRED_FIELDS = [
  ['name', 'Full name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['street', 'Street address'],
  ['city', 'City'],
  ['governorate', 'Governorate'],
] as const

export default function OrderPage() {
  const router = useRouter()
  const store = useProjectStore()

  const selectedProductObj = PRODUCTS.find(p => p.id === store.selectedProduct)
  const selectedSizeObj = SIZES.find(s => s.id === store.selectedSize)

  const [isProcessing, setIsProcessing] = useState(false)
  const processingRef = useRef(false)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [quantity, setQuantity] = useState(1)

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    city: '',
    governorate: '',
    postalCode: '',
    country: 'Egypt',
  })

  const productName = selectedProductObj?.name || 'Softcover'
  const pricing = computeOrderPricing({
    productName,
    pageCount: store.pages.length,
    quantity,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const showNotification = useCallback((message: string, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3500)
  }, [])

  const handleCheckout = async () => {
    for (const [field, label] of REQUIRED_FIELDS) {
      if (!shippingInfo[field].trim()) {
        showNotification(`Please fill in ${label.toLowerCase()}`, 'error')
        return
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      showNotification('Please enter a valid email', 'error')
      return
    }

    // Synchronous guard: state alone can't stop a double-click before re-render
    if (processingRef.current) return
    processingRef.current = true
    setIsProcessing(true)

    try {
      const orderPayload = {
        sessionId: `session_${Date.now()}`,
        customer: {
          name: shippingInfo.name.trim(),
          email: shippingInfo.email.trim(),
          phone: shippingInfo.phone.trim(),
        },
        deliveryAddress: {
          street: shippingInfo.street.trim(),
          building: shippingInfo.building.trim(),
          floor: shippingInfo.floor.trim(),
          apartment: shippingInfo.apartment.trim(),
          city: shippingInfo.city.trim(),
          governorate: shippingInfo.governorate.trim(),
          postalCode: shippingInfo.postalCode.trim(),
          country: shippingInfo.country,
        },
        bookSize: selectedSizeObj?.name,
        photoUrls: store.uploadedImages.map(img => img.src),
        // Include the designed cover so fulfillment can reproduce it
        coverConfig: { product: productName, quantity, coverDesign: loadCoverDesign() },
        // The server recomputes the price from these — it never trusts a total
        product: productName,
        pageCount: store.pages.length,
        quantity,
        pages: store.pages,
      }

      const createRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      if (!createRes.ok) throw new Error('Failed to create order')
      const { orderId } = await createRes.json()

      const payRes = await fetch('/api/paymob/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!payRes.ok) throw new Error('Failed to initiate payment')
      const payData = await payRes.json()

      if (payData.iframeUrl) {
        window.location.href = payData.iframeUrl
      } else if (payData.success) {
        // Order was already paid — skip the gateway
        router.push(`/order/success?merchant_order_id=${orderId}&success=true`)
      } else {
        throw new Error('Payment could not be started')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      showNotification('Something went wrong. Please try again.', 'error')
      processingRef.current = false
      setIsProcessing(false)
    }
  }

  return (
    <div className="memora-root order-root">
      {notification && (
        <div className={`order-toast ${notification.type === 'error' ? 'order-toast--error' : ''}`} role="alert">
          {notification.message}
        </div>
      )}

      <header className="order-header">
        <button className="m-btn-secondary" onClick={() => router.push('/create?step=3')} type="button">
          ← back to review
        </button>
        <h1 className="m-display order-title">Checkout</h1>
        <span className="m-pill">secure checkout</span>
      </header>

      <main className="order-main">
        <section className="order-card order-summary">
          <h2 className="m-mono order-card-label">your book</h2>
          <div className="order-summary-row">
            <span>{productName} · {selectedSizeObj?.name || 'A4 Portrait'}</span>
            <span className="m-mono">{store.pages.length} pages</span>
          </div>
          <div className="order-summary-row order-qty-row">
            <span>Quantity</span>
            <div className="order-qty" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span className="m-mono">{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => Math.min(50, q + 1))} aria-label="Increase quantity">+</button>
            </div>
          </div>
        </section>

        <section className="order-card order-form">
          <h2 className="m-mono order-card-label">shipping details</h2>
          <div className="order-form-grid">
            <input name="name" value={shippingInfo.name} onChange={handleInputChange} placeholder="Full name *" autoComplete="name" />
            <input name="email" type="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="Email *" autoComplete="email" />
            <input name="phone" type="tel" value={shippingInfo.phone} onChange={handleInputChange} placeholder="Phone *" autoComplete="tel" />
            <input name="street" value={shippingInfo.street} onChange={handleInputChange} placeholder="Street address *" autoComplete="street-address" className="order-input-wide" />
            <input name="building" value={shippingInfo.building} onChange={handleInputChange} placeholder="Building" />
            <input name="floor" value={shippingInfo.floor} onChange={handleInputChange} placeholder="Floor" />
            <input name="apartment" value={shippingInfo.apartment} onChange={handleInputChange} placeholder="Apartment" />
            <input name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="City *" autoComplete="address-level2" />
            <input name="governorate" value={shippingInfo.governorate} onChange={handleInputChange} placeholder="Governorate *" autoComplete="address-level1" />
            <input name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} placeholder="Postal code" autoComplete="postal-code" />
          </div>
          <p className="order-form-hint m-serif">* required — we deliver across Egypt.</p>
        </section>

        <aside className="order-card order-totals">
          <h2 className="m-mono order-card-label">total</h2>
          <div className="order-total-row"><span>Subtotal</span><span className="m-mono">{pricing.subtotal.toFixed(2)} EGP</span></div>
          <div className="order-total-row"><span>Shipping</span><span className="m-mono">{pricing.shipping.toFixed(2)} EGP</span></div>
          <div className="order-total-row"><span>Tax (14%)</span><span className="m-mono">{pricing.tax.toFixed(2)} EGP</span></div>
          <div className="order-total-row order-total-final">
            <span>Total</span><span className="m-mono">{pricing.total.toFixed(2)} EGP</span>
          </div>
          <button className="m-btn-primary order-pay-btn" onClick={handleCheckout} disabled={isProcessing} type="button">
            {isProcessing ? 'Processing…' : 'Pay now'}
            {!isProcessing && <span className="m-btn-primary__arrow">→</span>}
          </button>
        </aside>
      </main>
    </div>
  )
}
