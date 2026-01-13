'use client'
import { useState, useEffect, useMemo } from 'react'
// import UploadArea from './UploadArea'
import '@/styles/editor/PhotoLibrary.css'

/* ======================================================
   LAYOUT DEFINITIONS
   ====================================================== */

const LAYOUTS = {
  single: { id: 'single', slots: 1 },
  two: { id: '2-vertical', slots: 2 },
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
  if (ratio >= 1.05) return 'landscape'
  if (ratio <= 0.95) return 'portrait'
  return 'square'
}

/* ======================================================
   COMPONENT
   ====================================================== */

export default function PhotoLibrary({
  uploadedImages = [],
  addImageToPage,
  pages = [],
  onUpload,
  setUploadedImages,
}) {
  const [images, setImages] = useState(uploadedImages)
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setImages(uploadedImages)
  }, [uploadedImages])

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
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
    if (selectedImageId === imageId) setSelectedImageId(null)
  }

  /* ======================================================
     AUTO GENERATE
     ====================================================== */

  const handleGenerationRequest = (mode) => {
    setShowModal(false)
    if (!images.length) {
      setInfoMessage('Upload photos first to generate your book.')
      return
    }

    let generatedPages = []
    let stats = { single: 0, two: 0, three: 0, four: 0 }

    if (mode === 'singleOnly') {
      generatedPages = images.map((img) => ({
        layout: 'single',
        images: [img.id],
      }))
      stats.single = generatedPages.length
    } else if (mode === 'twoSlotsOnly') {
      const pool = [...images]
      while (pool.length > 0) {
        const pageImages = pool.splice(0, 2).map((img) => img.id)
        generatedPages.push({
          layout: '2-vertical',
          images: pageImages,
        })
        stats.two++
      }
    } else if (mode === 'smartGrid') {
      // This is the existing complex logic
      const prepared = images.map((img) => ({ ...img, orientation: getOrientation(img) }))
      const pool = [...prepared]
      const pickImage = (preferred, strict = false) => {
        if (!pool.length) return null
        let idx = pool.slice(0, 10).findIndex((i) => i.orientation === preferred)
        if (idx === -1 && preferred !== 'square') {
          idx = pool.slice(0, 10).findIndex((i) => i.orientation === 'square')
        }
        if (strict && idx === -1) return null
        if (idx === -1) idx = 0
        return pool.splice(idx, 1)[0] || null
      }

      const chooseLayout = () => {
        // Prioritize a 2-slot layout if the next two images are landscapes
        if (
          pool.length >= 2 &&
          pool[0].orientation === 'landscape' &&
          pool[1].orientation === 'landscape'
        ) {
          return LAYOUTS.two
        }

        const nextBatch = pool.slice(0, 6)
        const orientations = nextBatch.map((i) => i.orientation)
        const pCount = orientations.filter((o) => o === 'portrait' || o === 'square').length
        const hasActualLandscape = pool
          .slice(0, 10)
          .some((img) => img.orientation === 'landscape' || img.orientation === 'square')

        if (pCount >= 4 && pool.length >= 4) return LAYOUTS.four
        if (hasActualLandscape && pCount >= 2 && pool.length >= 3) {
          return Math.random() > 0.5 ? LAYOUTS.threeA : LAYOUTS.threeB
        }
        if (pool.length >= 4 && pCount >= 4) return LAYOUTS.four
        if (pool.length >= 3 && hasActualLandscape) return LAYOUTS.threeA
        // Fallback to a 3 or 4 slot layout if possible, otherwise single
        if (pool.length >= 4) return LAYOUTS.four
        if (pool.length >= 3) return LAYOUTS.threeA
        return LAYOUTS.single // Fallback for remaining images
      }

      while (pool.length > 0) {
        const layout = chooseLayout()
        const pageImages = []
        if (layout.id === 'single') {
          pageImages.push(pickImage('portrait')?.id)
          stats.single++
        } else if (layout.id === '2-vertical') {
          pageImages.push(pickImage('landscape')?.id, pickImage('landscape')?.id)
          stats.two++
        } else if (layout.slots === 3) {
          const lImg = pickImage('landscape', true)
          const p1 = pickImage('portrait')
          const p2 = pickImage('portrait')
          if (layout.id === '1-top-2-bottom') {
            pageImages.push(lImg?.id, p1?.id, p2?.id)
          } else {
            pageImages.push(p1?.id, p2?.id, lImg?.id)
          }
          stats.three++
        } else if (layout.slots === 4) {
          for (let i = 0; i < 4; i++) pageImages.push(pickImage('portrait')?.id)
          stats.four++
        }
        generatedPages.push({ layout: layout.id, images: pageImages.filter(Boolean) })
      }
    }

    setInfoMessage(
      `Auto-generated ${generatedPages.length} pages · ` +
        `1-img:${stats.single}, 2-img:${stats.two}, 3-img:${stats.three}, 4-img:${stats.four}`,
    )
    window.dispatchEvent(new CustomEvent('auto-generate-pages', { detail: generatedPages }))
  }

  /* ======================================================
     JSX
     ====================================================== */

  return (
    <div className={`photo-library ${images.length === 0 ? 'empty' : 'has-images'}`}>
      <div className="photo-library-header">
        <h4 className="photo-library-title">
          Photos ({images.length})
          <span className="photo-library-counts">
            Used {usedCount}/{images.length}
          </span>
        </h4>
        <button onClick={() => setShowModal(true)} className="photo-library-auto-btn">
          ✨ Auto generate
        </button>
      </div>

      {infoMessage && <div className="photo-library-info">{infoMessage}</div>}



      {showModal && (
        <div className="photo-library-modal-backdrop">
          <div className="photo-library-modal">
            <h3>Auto Generate Book</h3>
            <p className="modal-subtitle">Choose a style for your book layout.</p>
            <div className="modal-options vertical">
              <button className="modal-choice-btn" onClick={() => handleGenerationRequest('singleOnly')}>
                <strong>Full Page Photos</strong>
                <small>Showcase each photo on its own dedicated page.</small>
              </button>
              <button className="modal-choice-btn" onClick={() => handleGenerationRequest('twoSlotsOnly')}>
                <strong>Paired Layout</strong>
                <small>Place two photos per page. Ideal for landscape shots.</small>
              </button>
              <button className="modal-choice-btn" onClick={() => handleGenerationRequest('smartGrid')}>
                <strong>Smart Collage</strong>
                <small>Creates dynamic pages with a mix of 2, 3, and 4 photo layouts.</small>
              </button>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="photo-library-grid">
        {images.map((img) => {
          const used = isUsed(img.id)
          const selected = selectedImageId === img.id
          return (
            <div
              key={img.id}
              className={`photo-library-item ${selected ? 'selected' : ''} ${used ? 'used' : ''}`}
              onClick={() => {
                setSelectedImageId(img.id)
                addImageToPage?.(img.id)
              }}
            >
              <img src={img.thumbSrc || img.src} alt="" draggable={false} className="photo-library-img" loading="lazy" />
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
