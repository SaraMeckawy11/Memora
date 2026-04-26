'use client'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/useProjectStore'

import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'

export default function OrderPage() {
  const router = useRouter()
  const store = useProjectStore()
  
  const selectedProductObj = PRODUCTS.find(p => p.id === store.selectedProduct)
  const selectedSizeObj = SIZES.find(s => s.id === store.selectedSize)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState(null)
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
    country: 'Egypt'
  })

  // Calculate pricing
  const basePrice = 499 
  const productMultiplier = selectedProductObj?.name === 'Hardcover' ? 1.5 : 1
  const pagePrice = store.pages.length * 10
  const subtotal = (basePrice * productMultiplier + pagePrice) * quantity
  const shipping = quantity * 50
  const tax = (subtotal + shipping) * 0.14
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const handleCheckout = async () => {
    const required = ['name', 'email', 'phone', 'street', 'city', 'governorate'];
    for (const field of required) {
        if (!shippingInfo[field]) {
            showNotification(`Please fill in ${field}`, 'error');
            return;
        }
    }
    
    setIsProcessing(true);

    try {
        const orderPayload = {
            sessionId: `session_${Date.now()}`,
            customer: { ...shippingInfo },
            bookSize: selectedSizeObj?.name,
            photoUrls: store.uploadedImages.map(img => img.src), 
            coverConfig: { product: selectedProductObj?.name },
            totalPrice: total,
            pages: store.pages
        };

        const createRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
        });

        if (!createRes.ok) throw new Error('Failed to create order');
        const { orderId } = await createRes.json();

        const payRes = await fetch('/api/paymob/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });

        if (!payRes.ok) throw new Error('Failed to initiate payment');
        const { iframeUrl } = await payRes.json();
        window.location.href = iframeUrl;

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
        setIsProcessing(false);
    }
  }

  return (
    <div className="order-page-root">
       {/* UI code simplified for brevity but matching original structure */}
       <header className="checkout-header">
           <button onClick={() => router.push('/create')}>← Back to Editor</button>
           <h2>Review & Order</h2>
       </header>

       <main className="checkout-main">
           <section className="summary">
                <h3>Summary</h3>
                <p>{selectedProductObj?.name} - {selectedSizeObj?.name}</p>
                <p>{store.pages.length} Pages</p>
                <div className="quantity">
                    <button onClick={() => setQuantity(Math.max(1, quantity-1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity+1)}>+</button>
                </div>
           </section>

           <section className="shipping-form">
               {/* Form inputs mapping to shippingInfo... */}
               <input name="name" value={shippingInfo.name} onChange={handleInputChange} placeholder="Name" />
               <input name="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="Email" />
               {/* ... other inputs ... */}
           </section>

           <aside className="totals">
               <div className="total-row"><span>Total</span><span>{total.toFixed(2)} EGP</span></div>
               <button onClick={handleCheckout} disabled={isProcessing}>
                   {isProcessing ? 'Processing...' : 'Pay Now'}
               </button>
           </aside>
       </main>
       
       <style jsx>{`
           .order-page-root { font-family: Inter, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; }
           .checkout-header { display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
           .checkout-main { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; margin-top: 2rem; }
           .summary, .shipping-form { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
           .totals { background: #f8fafc; padding: 1.5rem; border-radius: 12px; height: fit-content; }
           .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem; }
           input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
           button { cursor: pointer; padding: 0.75rem 1.5rem; border-radius: 8px; transition: all 0.2s; }
           .btn-primary { background: #0ea5a9; color: white; border: none; }
       `}</style>
    </div>
  )
}
