'use client'
import { useState, useEffect } from 'react'
import '@/styles/editor/PhotoLibrary.css'

/* ======================================================
   AUTO GENERATION CONFIG — EDIT ONLY HERE
   ====================================================== */

// Minimum number of pages regardless of image count
const AUTO_MIN_PAGES = 25

// Safety limits
const MAX_IMAGES = 400
const MAX_PAGES = 180

// Hard caps
const MAX_SINGLE_PAGES = 4          // 1-image pages
const MAX_TWO_PAGES = 10            // total 2-image pages (H + V)

// Outro rule
const OUTRO_TWO_VERTICAL_PAGES = 2  // last N pages forced to 2-vertical

// Distribution ratios (3 vs 4 images)
const THREE_IMAGE_RATIO = 0.45
const FOUR_IMAGE_RATIO  = 0.55

// 2-image orientation ratio (non-outro)
const TWO_HORIZONTAL_RATIO = 0.6
const TWO_VERTICAL_RATIO   = 0.4

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
   COMPONENT
   ====================================================== */

export default function PhotoLibrary({
  uploadedImages = [],
  currentPage,
  addImageToPage,
}) {
  const [images, setImages] = useState(uploadedImages)
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    setImages(uploadedImages)
  }, [uploadedImages])

  const isUsed = (id) => currentPage?.images?.includes(id)

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
    if (selectedImageId === imageId) setSelectedImageId(null)
  }

  /* ======================================================
     AUTO GENERATE
     ====================================================== */

  const autoGenerate = () => {
    if (!images.length) {
      setInfoMessage('Upload photos first to generate your book.')
      return
    }

    const imageIds = images
      .slice(0, MAX_IMAGES)
      .map((img) => img.id)

    let cursor = 0
    const pages = []

    const layoutCounts = {
      single: 0,
      two: 0,
      three: 0,
      four: 0,
    }

    const chooseLayout = () => {
      const remainingImages = imageIds.length - cursor
      const remainingPagesEstimate = Math.ceil(remainingImages / 3)

      /* =============================
         OUTRO — FORCE 2 VERTICAL
         ============================= */
      if (remainingPagesEstimate <= OUTRO_TWO_VERTICAL_PAGES) {
        return LAYOUTS.twoV
      }

      /* =============================
         NORMAL FLOW
         ============================= */

      // 1️⃣ Single-image pages
      if (layoutCounts.single < MAX_SINGLE_PAGES) {
        return LAYOUTS.single
      }

      // 2️⃣ Two-image pages
      if (layoutCounts.two < MAX_TWO_PAGES) {
        return Math.random() < TWO_HORIZONTAL_RATIO
          ? LAYOUTS.twoH
          : LAYOUTS.twoV
      }

      // 3️⃣ Three vs Four balance
      const totalDense = layoutCounts.three + layoutCounts.four || 1
      const currentThreeRatio = layoutCounts.three / totalDense

      if (currentThreeRatio < THREE_IMAGE_RATIO) {
        return layoutCounts.three % 2 === 0
          ? LAYOUTS.threeA
          : LAYOUTS.threeB
      }

      return LAYOUTS.four
    }

    while (
      (pages.length < AUTO_MIN_PAGES || cursor < imageIds.length) &&
      pages.length < MAX_PAGES
    ) {
      const layout = chooseLayout()

      const pageImages = Array(layout.slots).fill(null)
      for (let i = 0; i < layout.slots && cursor < imageIds.length; i++) {
        pageImages[i] = imageIds[cursor]
        cursor++
      }

      pages.push({
        layout: layout.id,
        images: pageImages,
      })

      // Track counts
      if (layout.slots === 1) layoutCounts.single++
      else if (layout.slots === 2) layoutCounts.two++
      else if (layout.slots === 3) layoutCounts.three++
      else if (layout.slots === 4) layoutCounts.four++
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
     JSX
     ====================================================== */

  return (
    <div className="photo-library">
      <div className="photo-library-header">
        <h4 className="photo-library-title">
          Photos ({images.length})
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
                src={img.src}
                alt=""
                draggable={false}
                className="photo-library-img"
              />

              {used && (
                <div className="photo-library-used">
                  Used
                </div>
              )}

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
