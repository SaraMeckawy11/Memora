'use client'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderPage() {
  const router = useRouter()
  const [format, setFormat] = useState('pdf')
  const [exporting, setExporting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
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
    country: 'Egypt'
  })
  const [quantity, setQuantity] = useState(1)
  const [notification, setNotification] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPageSize, setSelectedPageSize] = useState('8×10 Portrait')
  const [selectedProduct, setSelectedProduct] = useState('Hardcover')
  const [selectedTheme, setSelectedTheme] = useState('Classic')
  const [photoUrls, setPhotoUrls] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('photobook_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.pages) setPages(draft.pages)
        if (draft.selectedSize?.name) setSelectedPageSize(draft.selectedSize.name)
        if (draft.selectedProduct?.name) setSelectedProduct(draft.selectedProduct.name)
        if (draft.coverTheme) setSelectedTheme(draft.coverTheme)
        // Assuming draft might have photoUrls if they were uploaded
        if (draft.photoUrls) setPhotoUrls(draft.photoUrls) 
      } catch (e) {
        console.warn('Failed to load draft:', e)
      }
    }
  }, [])

  // Calculate pricing
  const basePrice = 499 // Changed to EGP logical price
  const productMultiplier = { 'Hardcover': 1.5, 'Softcover': 1 }[selectedProduct] || 1
  const pagePrice = pages.length * 10 // 10 EGP per page
  const subtotal = (basePrice * productMultiplier + pagePrice) * quantity
  const shipping = quantity * 50 // 50 EGP shipping
  const tax = (subtotal + shipping) * 0.14 // 14% VAT
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleBackToEditor = () => {
    // Set step to 2 before navigating back
    localStorage.setItem('photobook-step', '2')
    router.push('/create')
  }

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const handleCheckout = useCallback(async () => {
    // Validation
    const required = ['name', 'email', 'phone', 'street', 'city', 'governorate'];
    for (const field of required) {
        if (!shippingInfo[field]) {
            showNotification(`Please fill in ${field}`, 'error');
            return;
        }
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      showNotification('Please enter a valid email address', 'error')
      return
    }

    setIsProcessing(true);

    try {
        // 1. Create Order
        const orderPayload = {
            sessionId: `session_${Date.now()}`, // Or get from auth/cookie
            customer: {
                name: shippingInfo.name,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
            },
            deliveryAddress: {
                street: shippingInfo.street,
                building: shippingInfo.building,
                floor: shippingInfo.floor,
                apartment: shippingInfo.apartment,
                city: shippingInfo.city,
                governorate: shippingInfo.governorate,
                postalCode: shippingInfo.postalCode,
                country: shippingInfo.country,
            },
            bookSize: selectedPageSize,
            photoUrls: photoUrls, 
            coverConfig: { theme: selectedTheme, product: selectedProduct },
            totalPrice: total,
        };

        const createRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
        });

        if (!createRes.ok) {
            throw new Error('Failed to create order');
        }

        const { orderId } = await createRes.json();

        // 2. Initiate Payment
        const payRes = await fetch('/api/paymob/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });

        if (!payRes.ok) {
            throw new Error('Failed to initiate payment');
        }

        const { iframeUrl } = await payRes.json();

        // 3. Redirect
        window.location.href = iframeUrl;

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
        setIsProcessing(false);
    }
  }, [shippingInfo, photoUrls, selectedPageSize, selectedTheme, selectedProduct, total, showNotification])

  return (
    <>
      {/* Toolbar */}
      <div style={{ padding: '16px 0', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleBackToEditor} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', color: '#666', fontWeight: 500, padding: '0.5rem 0', fontSize: '1rem' }}>← Back</button>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#e0e0e0' }} />
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>📦 Review & Order</h2>
          </div>
          {pages.length > 0 && <span style={{ fontSize: '0.9rem', color: '#999' }}>{pages.length} pages • {quantity}x copies</span>}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '24px',
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="container" style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="layout-grid">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Order Summary */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>📖 Order Summary</h3>
              </div>

              <div className="summary-grid" style={{ gap: '24px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '10px', borderLeft: '3px solid #6d28d9' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Product Type</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{selectedProduct}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '10px', borderLeft: '3px solid #06b6d4' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Page Size</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{selectedPageSize}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '10px', borderLeft: '3px solid #0ea5a3' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Total Pages</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{pages.length} pages</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '10px', borderLeft: '3px solid #8b5cf6' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>Theme</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{selectedTheme}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div style={{ padding: '16px', backgroundColor: 'rgba(14, 165, 163, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 600, color: '#333' }}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '32px', height: '32px', border: 'none', backgroundColor: '#f5f5f5', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>−</button>
                  <span style={{ fontSize: '1rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ width: '32px', height: '32px', border: 'none', backgroundColor: '#f5f5f5', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>+</button>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.15rem' }}>🚚 Delivery Details</h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  className="form-input"
                />

                <div className="input-grid-2" style={{ gap: '16px' }}>
                    <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="form-input"
                    />
                    <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    />
                </div>

                <input
                  type="text"
                  name="street"
                  placeholder="Street Address *"
                  value={shippingInfo.street}
                  onChange={handleInputChange}
                  className="form-input"
                />

                <div className="input-grid-3" style={{ gap: '12px' }}>
                    <input
                        type="text"
                        name="building"
                        placeholder="Building"
                        value={shippingInfo.building}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="floor"
                        placeholder="Floor"
                        value={shippingInfo.floor}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="apartment"
                        placeholder="Apartment"
                        value={shippingInfo.apartment}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>

                <div className="input-grid-2" style={{ gap: '12px' }}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="form-input"
                  />

                  <input
                    type="text"
                    name="governorate"
                    placeholder="Governorate/State *"
                    value={shippingInfo.governorate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                 <div className="input-grid-2" style={{ gap: '12px' }}>
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={shippingInfo.country}
                        disabled
                        className="form-input bg-gray-100 text-gray-500"
                    />
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ height: 'fit-content', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Pricing */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}>💰 Price Breakdown</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>{selectedProduct} ({selectedPageSize})</span>
                <span style={{ fontWeight: 600 }}>{(basePrice * productMultiplier).toFixed(2)} EGP</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>{pages.length} pages × ${(10).toFixed(2)} EGP</span>
                <span style={{ fontWeight: 600 }}>{pagePrice.toFixed(2)} EGP</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>Subtotal (×{quantity})</span>
                <span style={{ fontWeight: 600 }}>{subtotal.toFixed(2)} EGP</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600 }}>{shipping.toFixed(2)} EGP</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '2px solid #ddd' }}>
                <span>VAT (14%)</span>
                <span style={{ fontWeight: 600 }}>{tax.toFixed(2)} EGP</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#0ea5a3', marginBottom: '20px' }}>
                <span>Total</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '8px', fontSize: '1rem', fontWeight: 600, opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'wait' : 'pointer' }}
              >
                {isProcessing ? 'Processing...' : '✓ Pay Now'}
              </button>

              <button onClick={handleBackToEditor} className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
                ← Back to Editor
              </button>
            </div>

            {/* Info Card */}
            <div style={{ backgroundColor: 'rgba(14, 165, 163, 0.1)', borderRadius: '14px', padding: '16px', borderLeft: '4px solid #0ea5a3' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#333', fontWeight: 500 }}>
                💡 <strong>Secure Payment</strong> via Paymob. Your photobook will arrive in 5-7 business days.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .form-input {
            padding: 12px 14px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 0.95rem;
            font-family: Inter, sans-serif;
            transition: all 0.22s;
            outline: none;
            width: 100%;
        }
        .form-input:focus {
            border-color: #0ea5a3;
            box-shadow: 0 0 0 2px rgba(14, 165, 163, 0.1);
        }
        
        .layout-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 32px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .input-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .input-grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .layout-grid {
             grid-template-columns: 1fr; /* Stack columns */
          }

          /* Ensure sidebar stays at bottom (natural order) and doesn't stick */
          .layout-grid > aside {
             position: static !important;
             width: 100%;
          }
        }

        @media (max-width: 640px) {
          .summary-grid {
            grid-template-columns: 1fr; /* Stack summary items on mobile */
          }
          
          .input-grid-2, .input-grid-3 {
             grid-template-columns: 1fr; /* Stack inputs on mobile */
          }

          .container {
             padding: 16px !important;
          }
        }
      `}</style>
    </>
  )
}
