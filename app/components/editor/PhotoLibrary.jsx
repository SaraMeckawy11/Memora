'use client'
import { useState, useEffect, useMemo } from 'react'
import '@/styles/editor/PhotoLibrary.css'

/* ======================================================
   AUTO GENERATION CONFIG — EDIT ONLY HERE
   ====================================================== */

const MAX_SINGLE_PAGES = 4
const MAX_TWO_PAGES = 10

/* ======================================================
   LAYOUT DEFINITIONS
   ====================================================== */

const LAYOUTS = {
  single: { id: 'single', slots: 1 },
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
  // Use slightly more standard thresholds
  if (ratio >= 1.05) return 'landscape'
  if (ratio <= 0.95) return 'portrait'
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

    /* ---------- classify images (preserve original order) ---------- */
    const prepared = images
      .map((img) => ({
        ...img,
        orientation: getOrientation(img),
      }))

    // pool preserves original order; pickImage will remove items from pool
    const pool = prepared.slice()

    // Small scale reordering: Look-ahead to find best orientation match
    const pickImage = (preferred, strict = false) => {
      if (!pool.length) return null
      
      // 1. Try to find the exact preferred orientation in look-ahead
      let idx = pool.slice(0, 10).findIndex(i => i.orientation === preferred)
      
      // 2. If not found, try square
      if (idx === -1 && preferred !== 'square') {
        idx = pool.slice(0, 10).findIndex(i => i.orientation === 'square')
      }

      // 3. If strict is true and we found nothing, return null (don't force a wrong orientation)
      if (strict && idx === -1) return null

      // 4. Default to first if not strict
      if (idx === -1) idx = 0 
      
      return pool.splice(idx, 1)[0] || null
    }

    const remainingCount = () => pool.length

    const pages = []
    const layoutCounts = { single: 0, two: 0, three: 0, four: 0 }

    /* ---------- layout chooser ---------- */
    const chooseLayout = () => {
      const nextBatch = pool.slice(0, 6)
      const orientations = nextBatch.map(i => i.orientation)
      
      const pCount = orientations.filter(o => o === 'portrait' || o === 'square').length
      const lCount = orientations.filter(o => o === 'landscape' || o === 'square').length

      /* ✅ FORCE FIRST 2 PAGES TO BE SINGLE */
      if (pages.length < 2) return LAYOUTS.single

      // Use 4-grid ONLY if 4 portraits/squares are available
      if (pCount >= 4 && pool.length >= 4) return LAYOUTS.four

      // Use 3-slots ONLY if we have at least 1 landscape specifically
      const hasActualLandscape = pool.slice(0, 10).some(img => img.orientation === 'landscape' || img.orientation === 'square')
      if (hasActualLandscape && pCount >= 2 && pool.length >= 3) {
        return Math.random() > 0.5 ? LAYOUTS.threeA : LAYOUTS.threeB
      }

      // Respect specified user limits for 1 and 2 slot layouts
      if (layoutCounts.single < MAX_SINGLE_PAGES && (orientations[0] === 'portrait' || orientations[0] === 'square')) {
        return LAYOUTS.single
      }

      // Vertical only for 2-slot
      if (layoutCounts.two < MAX_TWO_PAGES && pool.length >= 2 && pCount >= 2) {
        return LAYOUTS.twoV
      }

      // Default fallbacks prioritize multi-image layouts to keep book compact
      if (pool.length >= 4 && pCount >= 4) return LAYOUTS.four
      if (pool.length >= 3 && hasActualLandscape) return LAYOUTS.threeA
      if (pool.length >= 2) return LAYOUTS.twoV
      return LAYOUTS.single
    }

    /* ---------- page loop ---------- */
    while (remainingCount() > 0) {
      const layout = chooseLayout()
      const pageImages = []

      if (layout.id === 'single') {
        pageImages.push(pickImage('portrait')?.id)
        layoutCounts.single++
      } 
      else if (layout.id === '2-vertical') {
        pageImages.push(pickImage('portrait')?.id, pickImage('portrait')?.id)
        layoutCounts.two++
      } 
      else if (layout.slots === 3) {
        // Enforce landscape slot getting a landscape/square image
        const lImg = pickImage('landscape', true) // strict mode
        const p1 = pickImage('portrait')
        const p2 = pickImage('portrait')

        if (layout.id === '1-top-2-bottom') {
          // Slot 0 is Top (Landscape), Slots 1 & 2 are Bottom (Portrait)
          pageImages.push(lImg?.id, p1?.id, p2?.id)
        } else {
          // Layout is '2-top-1-bottom': Slots 0 & 1 are Top (Portrait), Slot 2 is Bottom (Landscape)
          pageImages.push(p1?.id, p2?.id, lImg?.id)
        }
        layoutCounts.three++
      } 
      else if (layout.slots === 4) {
        for (let i = 0; i < 4; i++) {
          pageImages.push(pickImage('portrait')?.id)
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
