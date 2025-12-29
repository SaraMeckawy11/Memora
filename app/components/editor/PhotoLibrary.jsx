'use client'
import { useState, useEffect } from 'react'
import '@/styles/editor/PhotoLibrary.css'

/* ======================================================
   AUTO GENERATION — BOOK-QUALITY LOGIC
   ====================================================== */

const LAYOUTS = {
  single: { id: 'single', slots: 1 },
  two: { id: '2-horizontal', slots: 2 },
  threeA: { id: '1-top-2-bottom', slots: 3 },
  threeB: { id: '2-top-1-bottom', slots: 3 },
  four: { id: '4-grid', slots: 4 },
}

const chooseLayoutForPage = (pageIndex, totalPages, prevSlots) => {
  const progress = pageIndex / totalPages

  if (progress < 0.2) {
    return Math.random() < 0.7 ? LAYOUTS.single : LAYOUTS.two
  }

  if (progress > 0.85) {
    return Math.random() < 0.6 ? LAYOUTS.single : LAYOUTS.two
  }

  const options = [
    LAYOUTS.two,
    LAYOUTS.threeA,
    LAYOUTS.threeB,
    LAYOUTS.four,
  ]

  let choice
  do {
    choice = options[Math.floor(Math.random() * options.length)]
  } while (prevSlots >= 4 && choice.slots >= 4)

  return choice
}

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

  const autoGenerate = () => {
    if (!images.length) {
      setInfoMessage('Upload photos first to generate your book.')
      return
    }

    const imageIds = images.map((img) => img.id)
    const MIN_PAGES = 25

    let cursor = 0
    let prevSlots = 0
    const pages = []

    while (pages.length < MIN_PAGES || cursor < imageIds.length) {
      const layout = chooseLayoutForPage(
        pages.length,
        Math.max(MIN_PAGES, Math.ceil(imageIds.length / 2)),
        prevSlots
      )

      const pageImages = Array(layout.slots).fill(null)
      for (let i = 0; i < layout.slots && cursor < imageIds.length; i++) {
        pageImages[i] = imageIds[cursor]
        cursor++
      }

      pages.push({ layout: layout.id, images: pageImages })
      prevSlots = layout.slots
    }

    setInfoMessage(`Auto-generated ${pages.length} pages with balanced layouts.`)

    window.dispatchEvent(
      new CustomEvent('auto-generate-pages', { detail: pages })
    )
  }

  return (
    <div className="photo-library">
      {/* Header */}
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

      {/* Info */}
      {infoMessage && (
        <div className="photo-library-info">
          {infoMessage}
        </div>
      )}

      {/* Grid */}
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
