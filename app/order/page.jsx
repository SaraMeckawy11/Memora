'use client'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderPage() {
  const router = useRouter()
  const [format, setFormat] = useState('pdf')
  const [exporting, setExporting] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'USA'
  })
  const [quantity, setQuantity] = useState(1)
  const [notification, setNotification] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPageSize, setSelectedPageSize] = useState('8×10 Portrait')
  const [selectedProduct, setSelectedProduct] = useState('Hardcover')

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('photobook_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.pages) setPages(draft.pages)
        if (draft.selectedSize?.name) setSelectedPageSize(draft.selectedSize.name)
        if (draft.selectedProduct?.name) setSelectedProduct(draft.selectedProduct.name)
      } catch (e) {
        console.warn('Failed to load draft:', e)
      }
    }
  }, [])

  // Calculate pricing
  const basePrice = 19.99
  const productMultiplier = { 'Hardcover': 1.5, 'Softcover': 1 }[selectedProduct] || 1
  const pagePrice = pages.length * 0.50
  const subtotal = (basePrice * productMultiplier + pagePrice) * quantity
  const shipping = quantity * 5.00
  const tax = (subtotal + shipping) * 0.08
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

  const handleExport = useCallback(async (fmt) => {
    setExporting(true)
    try {
      const exportData = {
        format: fmt,
        pages: pages.length,
        product: selectedProduct,
        size: selectedPageSize,
        timestamp: new Date().toISOString()
      }
      console.log('📥 Exporting:', exportData)
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `photobook-export.${fmt === 'pdf' ? 'pdf' : fmt === 'png' ? 'zip' : 'docx'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showNotification(`✓ Exported as ${fmt.toUpperCase()}`, 'success')
    } catch (error) {
      console.error('Export error:', error)
      showNotification('Failed to export', 'error')
    } finally {
      setExporting(false)
    }
  }, [format, pages.length, selectedProduct, selectedPageSize, showNotification])

  const handleCheckout = useCallback(() => {
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      showNotification('Please fill in all required fields', 'error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      showNotification('Please enter a valid email address', 'error')
      return
    }
    const orderData = {
      id: `order_${Date.now()}`,
      pages: pages.length,
      quantity,
      product: selectedProduct,
      size: selectedPageSize,
      pricing: { subtotal, shipping, tax, total },
      shipping: shippingInfo,
      timestamp: new Date().toISOString()
    }
    console.log('📦 Order created:', orderData)
    showNotification(`✓ Order placed! (Order #${orderData.id.substring(0, 12)})`, 'success')
    try {
      const orders = JSON.parse(localStorage.getItem('photobook_orders') || '[]')
      orders.push(orderData)
      localStorage.setItem('photobook_orders', JSON.stringify(orders))
    } catch (e) {
      console.warn('Failed to save order:', e)
    }
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }, [shippingInfo, quantity, pages.length, selectedProduct, selectedPageSize, subtotal, shipping, tax, total, showNotification])

  return (
    <>
      {/* Toolbar */}
      <div style={{ padding: '16px 0', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px' }}>
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
      <div className="container" style={{ padding: '32px 24px', maxWidth: '1400px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Order Summary */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>📖 Order Summary</h3>
                <span style={{ backgroundColor: 'rgba(109, 40, 217, 0.1)', color: '#6d28d9', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Step 4 of 4</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
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

            {/* Export Options */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.15rem' }}>📥 Export Your Book</h3>
              <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '0.95rem' }}>Download your photo book as a digital file before ordering physical copies</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {['pdf', 'png', 'docx'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    style={{
                      padding: '16px',
                      border: format === fmt ? '2px solid #0ea5a3' : '1px solid #ddd',
                      borderRadius: '10px',
                      backgroundColor: format === fmt ? 'rgba(14, 165, 163, 0.05)' : '#fff',
                      cursor: 'pointer',
                      fontWeight: format === fmt ? 600 : 400,
                      fontSize: '0.95rem',
                      transition: 'all 0.22s',
                      color: format === fmt ? '#0ea5a3' : '#333'
                    }}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleExport(format)}
                disabled={exporting || pages.length === 0}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  opacity: exporting || pages.length === 0 ? 0.6 : 1,
                  cursor: exporting ? 'not-allowed' : 'pointer'
                }}
              >
                {exporting ? '⏳ Exporting...' : `📥 Download as ${format.toUpperCase()}`}
              </button>
            </div>

            {/* Shipping Details */}
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.15rem' }}>🚚 Shipping Details</h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.22s',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0ea5a3'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.22s',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0ea5a3'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address *"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.22s',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0ea5a3'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    style={{
                      padding: '12px 14px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.22s',
                      outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0ea5a3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code *"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    style={{
                      padding: '12px 14px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.22s',
                      outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0ea5a3'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </div>

                <select
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.22s',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option>USA</option>
                  <option>Canada</option>
                  <option>UK</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
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
                <span style={{ fontWeight: 600 }}>${(basePrice * productMultiplier).toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>{pages.length} pages × ${(0.50).toFixed(2)}</span>
                <span style={{ fontWeight: 600 }}>${pagePrice.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>Subtotal (×{quantity})</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600 }}>${shipping.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px solid #ddd' }}>
                <span>Tax (8%)</span>
                <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#0ea5a3', marginBottom: '20px' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '8px', fontSize: '1rem', fontWeight: 600 }}
              >
                ✓ Place Order
              </button>

              <button onClick={handleBackToEditor} className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
                ← Back to Editor
              </button>
            </div>

            {/* Info Card */}
            <div style={{ backgroundColor: 'rgba(14, 165, 163, 0.1)', borderRadius: '14px', padding: '16px', borderLeft: '4px solid #0ea5a3' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#333', fontWeight: 500 }}>
                💡 <strong>Free delivery</strong> on orders over $50. Your photo book will arrive in 5-7 business days.
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
      `}</style>
    </>
  )
}