'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProjectStore } from '@/store/useProjectStore'
import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import { computeOrderPricing, formatPrice } from '@/lib/pricing'
import { loadCoverDesign, SavedCoverDesign } from '@/app/cover/coverStorage'
import CoverCanvas from '@/app/cover/components/CoverCanvas'
import ReviewPagePreview from './ReviewPagePreview'
import '@/styles/review/review.css'

interface StepReviewProps {
  handleProceed: () => void
  exportToPDF: () => void
  isExporting: boolean
}

export default function StepReview({ handleProceed, exportToPDF, isExporting }: StepReviewProps) {
  const store = useProjectStore()
  const {
    pages, uploadedImages, selectedProduct, selectedSize, pageBgColor,
    pageMargin, pageGutter, imageFitMode, imageBorderRadius,
  } = store
  const selectedProductObj = PRODUCTS.find(product => product.id === selectedProduct)
  const selectedSizeObj = SIZES.find(size => size.id === selectedSize)
  const filledPages = pages.filter(page => page.images.some(Boolean)).length
  const [coverDesign, setCoverDesign] = useState<SavedCoverDesign | null>(null)

  useEffect(() => setCoverDesign(loadCoverDesign()), [])

  const coverDesigned = Boolean(
    coverDesign && ((coverDesign.front?.elements?.length ?? 0) > 0 || (coverDesign.back?.elements?.length ?? 0) > 0),
  )
  const hasBookContent = filledPages > 0 || pages.some(page => Boolean(page.textContent?.trim()) || Boolean(page.overlays?.length))
  const canCheckout = Boolean(selectedProductObj && selectedSizeObj && pages.length > 0 && hasBookContent && coverDesigned)
  const pricing = computeOrderPricing({
    productName: selectedProductObj?.name || 'Softcover',
    pageCount: pages.length,
    quantity: 1,
    sizeName: selectedSizeObj?.name,
  })
  const pageAspect = selectedSizeObj ? selectedSizeObj.width / selectedSizeObj.height : 0.75

  const firstPhotoSrc = pages.reduce<string | null>((found, page) => {
    if (found) return found
    const imageId = page.images.find(Boolean)
    return uploadedImages.find(image => String(image.id) === String(imageId))?.src || null
  }, null)

  return (
    <div className="review-root">
      <div className="review-kicker">final check</div>
      <h2 className="review-title">Review your photo book</h2>
      <p className="review-subtitle">Check the cover, pages, and book details before checkout.</p>

      <div className="review-grid">
        <div className="review-card review-book-card">
          <div className="review-book-mock" style={{ backgroundColor: pageBgColor }}>
            {coverDesign?.front ? (
              <CoverCanvas
                side="front"
                elements={coverDesign.front.elements || []}
                backgroundColor={coverDesign.front.backgroundColor || '#faf8f5'}
                canvasSettings={coverDesign.canvasSettings || { width: 794, height: 1123 }}
                maxHeight={300}
              />
            ) : firstPhotoSrc ? (
              <img src={firstPhotoSrc} alt="First page of your book" />
            ) : (
              <span className="placeholder">Your book</span>
            )}
          </div>
          <p className="review-book-meta">{coverDesigned ? 'Cover design ready' : 'Cover design needed'}</p>
          <p className="review-book-meta small">
            {filledPages} of {pages.length} pages filled &middot; {uploadedImages.length} photos
          </p>
          <Link className="review-edit-link" href={coverDesigned ? '/cover' : '/select-cover'}>
            {coverDesigned ? 'Edit cover' : 'Choose a cover'}
          </Link>
        </div>

        <div className="review-card">
          <h3 className="review-summary-title">order summary</h3>
          <div className="review-row"><span className="label">Book type</span><span className="value">{selectedProductObj?.name || 'Not selected'}</span></div>
          <div className="review-row"><span className="label">Size</span><span className="value">{selectedSizeObj?.name || 'Not selected'}</span></div>
          <div className="review-row"><span className="label">Pages</span><span className="value">{pages.length}</span></div>
          <div className="review-row">
            <span className="label">Cover</span>
            <span className="value">
              <span className={coverDesigned ? 'review-status review-status--ready' : 'review-status review-status--needed'}>
                {coverDesigned ? 'Ready' : 'Needed'}
              </span>
            </span>
          </div>

          <div className="review-divider" />
          <div className="review-row"><span className="label">Subtotal</span><span className="value">{formatPrice(pricing.subtotal)}</span></div>
          <div className="review-row"><span className="label">Shipping</span><span className="value">{formatPrice(pricing.shipping)}</span></div>
          <div className="review-total-row"><span>Total</span><span>{formatPrice(pricing.total)}</span></div>

          {!canCheckout && (
            <div className="review-readiness" role="status">
              <strong>Finish your book first</strong>
              <span>{!hasBookContent ? 'Add content to at least one page. ' : ''}{!coverDesigned ? 'Choose or create a cover.' : ''}</span>
            </div>
          )}

          <div className="review-actions">
            <button className="review-btn review-btn--primary" onClick={handleProceed} disabled={!canCheckout} type="button">
              Continue to checkout <span aria-hidden="true">&rarr;</span>
            </button>
            <button className="review-btn review-btn--ghost" onClick={exportToPDF} disabled={isExporting} type="button">
              {isExporting ? 'Exporting…' : 'Download PDF preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="review-card review-pages-card">
        <div className="review-pages-head">
          <h3 className="review-summary-title">all pages</h3>
          <Link href="/create?step=2">Edit pages</Link>
        </div>
        <div className="review-pages-grid">
          {pages.map((page, index) => (
              <div key={page.id} className="review-page-thumb" style={{ aspectRatio: `${pageAspect}` }} aria-label={`Page ${index + 1} preview`}>
                <ReviewPagePreview
                  page={page}
                  uploadedImages={uploadedImages}
                  pageAspect={pageAspect}
                  pageMargin={pageMargin}
                  pageGutter={pageGutter}
                  pageBgColor={pageBgColor}
                  imageFitMode={imageFitMode}
                  imageBorderRadius={imageBorderRadius}
                />
                <div className="review-page-num">{index + 1}</div>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}
