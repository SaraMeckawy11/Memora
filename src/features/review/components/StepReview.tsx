'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProjectStore } from '@/store/useProjectStore'
import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import { computeOrderPricing } from '@/lib/pricing'
import { hasCoverDesign } from '@/app/cover/coverStorage'
import '@/styles/review/review.css'

interface StepReviewProps {
  handleProceed: () => void;
  exportToPDF: () => void;
  isExporting: boolean;
}

export default function StepReview({
  handleProceed,
  exportToPDF,
  isExporting,
}: StepReviewProps) {
  const store = useProjectStore()
  const { pages, uploadedImages, selectedProduct, selectedSize, pageBgColor } = store

  const selectedProductObj = PRODUCTS.find(p => p.id === selectedProduct)
  const selectedSizeObj = SIZES.find(s => s.id === selectedSize)
  const filledPages = pages.filter(p => p.images.some(Boolean)).length

  // Cover design lives in localStorage — read after mount to avoid SSR mismatch
  const [coverDesigned, setCoverDesigned] = useState(false)
  useEffect(() => setCoverDesigned(hasCoverDesign()), [])

  const pricing = computeOrderPricing({
    productName: selectedProductObj?.name || 'Softcover',
    pageCount: pages.length,
    quantity: 1,
  })

  const firstPhotoSrc = (() => {
    for (const page of pages) {
      const imageId = page.images.find(Boolean)
      if (imageId === undefined) continue
      const img = uploadedImages.find(i => String(i.id) === String(imageId))
      if (img?.src) return img.src
    }
    return null
  })()

  return (
    <div className="review-root">
      <h2 className="review-title">Review Your Photo Book</h2>
      <p className="review-subtitle">
        Everything looks perfect? Let&rsquo;s finalize your order!
      </p>

      <div className="review-grid">
        <div className="review-card review-book-card">
          <div className="review-book-mock" style={{ backgroundColor: pageBgColor }}>
            {firstPhotoSrc ? (
              <img src={firstPhotoSrc} alt="First page of your book" />
            ) : (
              <span className="placeholder">Your Book</span>
            )}
          </div>
          <p className="review-book-meta">
            {filledPages} of {pages.length} pages filled
          </p>
          <p className="review-book-meta small">
            {uploadedImages.length} photos uploaded
          </p>
        </div>

        <div className="review-card">
          <h3 className="review-summary-title">order summary</h3>

          <div className="review-row">
            <span className="label">Book type</span>
            <span className="value">{selectedProductObj?.name || '—'}</span>
          </div>
          <div className="review-row">
            <span className="label">Size</span>
            <span className="value">{selectedSizeObj?.name || '—'}</span>
          </div>
          <div className="review-row">
            <span className="label">Pages</span>
            <span className="value">{pages.length}</span>
          </div>
          <div className="review-row">
            <span className="label">Cover</span>
            <span className="value">
              {coverDesigned ? (
                <>Designed ✓ <Link href="/cover">edit</Link></>
              ) : (
                <Link href="/select-cover">Design your cover →</Link>
              )}
            </span>
          </div>

          <div className="review-divider" />

          <div className="review-row">
            <span className="label">Subtotal</span>
            <span className="value">{pricing.subtotal.toFixed(2)} EGP</span>
          </div>
          <div className="review-row">
            <span className="label">Shipping + tax</span>
            <span className="value">{(pricing.shipping + pricing.tax).toFixed(2)} EGP</span>
          </div>
          <div className="review-total-row">
            <span>Total</span>
            <span>{pricing.total.toFixed(2)} EGP</span>
          </div>

          <div className="review-actions">
            <button
              className="review-btn review-btn--primary"
              onClick={handleProceed}
              type="button"
            >
              Proceed to Checkout →
            </button>
            <button
              className="review-btn review-btn--ghost"
              onClick={exportToPDF}
              disabled={isExporting}
              type="button"
            >
              {isExporting ? 'Exporting…' : 'Download PDF preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="review-card review-pages-card">
        <h3 className="review-summary-title">all pages</h3>
        <div className="review-pages-grid">
          {pages.map((page, idx) => {
            const imageId = page.images.find(Boolean)
            const img = imageId !== undefined
              ? uploadedImages.find(i => String(i.id) === String(imageId))
              : null
            return (
              <div
                key={page.id}
                className="review-page-thumb"
                style={{ backgroundColor: pageBgColor }}
              >
                {img?.src ? (
                  <img src={img.src} alt={`Page ${idx + 1}`} />
                ) : (
                  <span>{page.type === 'text' ? 'Text' : `Page ${idx + 1}`}</span>
                )}
                <div className="review-page-num">{idx + 1}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
