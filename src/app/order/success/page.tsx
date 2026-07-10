'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import '@/styles/memora.css'
import '@/styles/order/order.css'

function SuccessContent() {
  const searchParams = useSearchParams()
  // Paymob redirects back with these query params
  const orderId = searchParams.get('merchant_order_id')
  const success = searchParams.get('success')

  // Paymob sends success=true/false as strings; only "false" means failure
  const failed = success === 'false'

  if (failed) {
    return (
      <div className="memora-root order-result-root">
        <div className="order-result-card">
          <div className="order-result-mark order-result-mark--error">✕</div>
          <h1 className="m-display order-result-title">Payment didn&rsquo;t go through</h1>
          <p className="m-serif order-result-text">
            Your card wasn&rsquo;t charged. You can try again whenever you&rsquo;re ready.
          </p>
          {orderId && <p className="m-mono order-result-meta">order {orderId}</p>}
          <div className="order-result-actions">
            <Link href="/order" className="m-btn-primary">
              Try again <span className="m-btn-primary__arrow">→</span>
            </Link>
            <Link href="/" className="m-btn-secondary">back home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="memora-root order-result-root">
      <div className="order-result-card">
        <div className="order-result-mark">✦</div>
        <h1 className="m-display order-result-title">Order confirmed</h1>
        <p className="m-serif order-result-text">
          Thank you — your book is on its way to the printer.
        </p>
        {orderId && <p className="m-mono order-result-meta">order {orderId}</p>}
        <div className="order-result-actions">
          <Link href="/my-books" className="m-btn-primary">
            View my books <span className="m-btn-primary__arrow">→</span>
          </Link>
          <Link href="/" className="m-btn-secondary">back home</Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<div className="memora-root order-result-root">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  )
}
