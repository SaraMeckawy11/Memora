'use client'
import Link from 'next/link'
import '@/styles/memora.css'
import '@/styles/order/order.css'

export default function OrderFailed() {
  return (
    <div className="memora-root order-result-root">
      <div className="order-result-card">
        <div className="order-result-mark order-result-mark--error">✕</div>
        <h1 className="m-display order-result-title">Payment failed</h1>
        <p className="m-serif order-result-text">
          Something went wrong with your transaction. Your card wasn&rsquo;t charged.
        </p>
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
