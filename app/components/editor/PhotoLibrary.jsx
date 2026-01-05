'use client'
import { useState, useEffect, useMemo } from 'react'
import '@/styles/editor/PhotoLibrary.css'

/* ======================================================
   AUTO GENERATION CONFIG — EDIT ONLY HERE
   ====================================================== */

const AUTO_MIN_PAGES = 25
const MAX_IMAGES = 400
const MAX_PAGES = 180

const MAX_SINGLE_PAGES = 4
const MAX_TWO_PAGES = 10

const OUTRO_TWO_VERTICAL_PAGES = 2

const THREE_IMAGE_RATIO = 0.45
const FOUR_IMAGE_RATIO  = 0.55

const TWO_HORIZONTAL_RATIO = 0
const TWO_VERTICAL_RATIO   = 1

/* ======================================================
   LAYOUT DEFINITIONS
   ====================================================== */

const LAYOUTS = {
  single: { id: 'single', slots: 1 },
  twoH: { id: '2-horizontal', slots: 2 },
  twoV: { id: '2-vertical', slots: 2 },
  threeA: { id: '1-top-2-bottom', slots: 3 },
  threeB: { id: '2-top-1-bottom', slots: 3 },
  four: { id: '4-grid', slots: 4 },
}

/* ======================================================
   IMAGE ORIENTATION UTILS
   ====================================================== */

const getOrientation = (img) => {
  if (!img.width || !img.height) return 'square'
  const ratio = img.width / img.height
  if (ratio > 1.15) return 'landscape'
  if (ratio < 0.85) return 'portrait'
  return 'square'
}

/* ======================================================
   COMPONENT
   ====================================================== */

export default function PhotoLibrary({
  uploadedImages = [],
  currentPage,
  addImageToPage,
  pages = [],
}) {
  const [images, setImages] = useState(uploadedImages)
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    setImages(uploadedImages)
  }, [uploadedImages])

  // Used images should be detected across the whole book (all pages), not only the current page.
  const usedIds = useMemo(() => {
    const set = new Set()
    for (const p of pages || []) {
      for (const id of p?.images || []) set.add(id)
    }
    return set
  }, [pages])

  const usedCount = useMemo(() => {
    let count = 0
    for (const img of images) {
      if (usedIds.has(img.id)) count++
    }
    return count
  }, [images, usedIds])

  const isUsed = (id) => usedIds.has(id)

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
    if (selectedImageId === imageId) setSelectedImageId(null)
  }

  /* ======================================================
     AUTO GENERATE (WITH FORCED INTRO PAGES)
     ====================================================== */

  const autoGenerate = () => {
    if (!images.length) {
      setInfoMessage('Upload photos first to generate your book.')
      return
    }

    /* ---------- classify images ---------- */
    const prepared = images
      .slice(0, MAX_IMAGES)
      .map((img) => ({
        ...img,
        orientation: getOrientation(img),
      }))

    const portraits   = prepared.filter(i => i.orientation === 'portrait')
    const landscapes  = prepared.filter(i => i.orientation === 'landscape')
    const squares     = prepared.filter(i => i.orientation === 'square')

    const pickImage = (preferred) => {
      if (preferred === 'portrait' && portraits.length) return portraits.shift()
      if (preferred === 'landscape' && landscapes.length) return landscapes.shift()
      if (preferred === 'square' && squares.length) return squares.shift()
      return portraits.shift() || landscapes.shift() || squares.shift() || null
    }

    const remainingCount = () =>
      portraits.length + landscapes.length + squares.length

    const pages = []
    const layoutCounts = { single: 0, two: 0, three: 0, four: 0 }

    /* ---------- layout chooser ---------- */
    const chooseLayout = () => {
      const remainingImages = remainingCount()
      const remainingPagesEstimate = Math.ceil(remainingImages / 3)

      /* ✅ FORCE FIRST 2 PAGES TO BE SINGLE */
      if (pages.length < 2) {
        return LAYOUTS.single
      }

      /* ---------- outro ---------- */
      if (remainingPagesEstimate <= OUTRO_TWO_VERTICAL_PAGES && portraits.length >= 2) {
        return LAYOUTS.twoV
      }

      /* ---------- single image ---------- */
      if (layoutCounts.single < MAX_SINGLE_PAGES && portraits.length) {
        return LAYOUTS.single
      }

      /* ---------- two images ---------- */
      if (layoutCounts.two < MAX_TWO_PAGES) {
        if (portraits.length >= 2) return LAYOUTS.twoV
        if (landscapes.length >= 2) return LAYOUTS.twoH
        return Math.random() < TWO_HORIZONTAL_RATIO
          ? LAYOUTS.twoH
          : LAYOUTS.twoV
      }

      /* ---------- three vs four ---------- */
      const totalDense = layoutCounts.three + layoutCounts.four || 1
      const currentThreeRatio = layoutCounts.three / totalDense

      if (currentThreeRatio < THREE_IMAGE_RATIO) {
        return layoutCounts.three % 2 === 0
          ? LAYOUTS.threeA
          : LAYOUTS.threeB
      }

      return LAYOUTS.four
    }

    /* ---------- page loop ---------- */
    while (
      (pages.length < AUTO_MIN_PAGES || remainingCount() > 0) &&
      pages.length < MAX_PAGES
    ) {
      const layout = chooseLayout()
      const pageImages = Array(layout.slots).fill(null)

      if (layout.id === 'single') {
        pageImages[0] = pickImage('portrait')?.id
        layoutCounts.single++
      }

      else if (layout.id === '2-vertical') {
        pageImages[0] = pickImage('portrait')?.id
        pageImages[1] = pickImage('portrait')?.id
        layoutCounts.two++
      }

      else if (layout.id === '2-horizontal') {
        pageImages[0] = pickImage('landscape')?.id
        pageImages[1] = pickImage('landscape')?.id
        layoutCounts.two++
      }

      else if (layout.slots === 3) {
        pageImages[0] = pickImage('landscape')?.id
        pageImages[1] = pickImage('portrait')?.id
        pageImages[2] = pickImage('portrait')?.id
        layoutCounts.three++
      }

      else if (layout.slots === 4) {
        for (let i = 0; i < 4; i++) {
          pageImages[i] = pickImage('square')?.id
        }
        layoutCounts.four++
      }

      pages.push({
        layout: layout.id,
        images: pageImages.filter(Boolean),
      })
    }

    setInfoMessage(
      `Auto-generated ${pages.length} pages · ` +
      `1-img:${layoutCounts.single}, ` +
      `2-img:${layoutCounts.two}, ` +
      `3-img:${layoutCounts.three}, ` +
      `4-img:${layoutCounts.four}`
    )

    window.dispatchEvent(
      new CustomEvent('auto-generate-pages', { detail: pages })
    )
  }

  /* ======================================================
     JSX (UNCHANGED)
     ====================================================== */

  return (
    <div className="photo-library">
      <div className="photo-library-header">
        <h4 className="photo-library-title">
          Photos ({images.length})
          <span className="photo-library-counts">
            Used {usedCount}/{images.length}
          </span>
        </h4>

        <button
          onClick={autoGenerate}
          className="photo-library-auto-btn"
        >
          ✨ Auto generate
        </button>
      </div>

      {infoMessage && (
        <div className="photo-library-info">
          {infoMessage}
        </div>
      )}

      <div className="photo-library-grid">
        {images.map((img) => {
          const used = isUsed(img.id)
          const selected = selectedImageId === img.id

          return (
            <div
              key={img.id}
              className={`photo-library-item
                ${selected ? 'selected' : ''}
                ${used ? 'used' : ''}
              `}
              onClick={() => {
                setSelectedImageId(img.id)
                addImageToPage?.(img.id)
              }}
            >
              <img
                src={img.thumbSrc || img.src}
                alt=""
                draggable={false}
                className="photo-library-img"
                loading="lazy"
              />

              {used && <div className="photo-library-used">Used</div>}

              <button
                className="photo-library-remove"
                title="Remove photo"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(img.id)
                }}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
