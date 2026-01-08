'use client'

import { useState } from 'react'
import '@/styles/editor/ImageSlot.css'

export default function ImageSlot({
  img,
  idx,
  selected,
  imageFitMode,
  imageBorderRadius,
  onSelect,
  onRemove,
  onSwap,
}) {
  const hasImage = Boolean(img)
  const [isDragOver, setIsDragOver] = useState(false)

  // `app/create/page.jsx` expects crop in percent (0-100).
  // Some older saved states may have crop in 0..1; normalize for rendering.
  const crop = (() => {
    const c = img?.crop
    if (!c) return null
    const numsOk = [c.x, c.y, c.w, c.h].every(v => Number.isFinite(v))
    if (!numsOk) return null
    const looksNormalized = c.w <= 1.5 && c.h <= 1.5 && c.x <= 1.5 && c.y <= 1.5
    if (looksNormalized) {
      return { x: c.x * 100, y: c.y * 100, w: c.w * 100, h: c.h * 100 }
    }
    return c
  })()

  return (
    <div
      className={`editor-slot ${img ? 'has-image' : ''} ${
        selected ? 'selected' : ''
      }${isDragOver ? ' drag-over' : ''}`}
      style={{
        borderRadius: imageBorderRadius,
        overflow: 'hidden',
      }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        onSelect(idx, { width: r.width, height: r.height })
      }}
      draggable={hasImage}
      onDragStart={(e) => {
        if (!hasImage) return
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(idx))
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (!isDragOver) setIsDragOver(true)
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const fromIdx = Number(e.dataTransfer.getData('text/plain'))
        const toIdx = idx
        if (Number.isNaN(fromIdx) || fromIdx === toIdx) return
        onSwap?.(fromIdx, toIdx)
      }}
    >
      {img ? (
        <>
          {/* ================= REAL IMAGE RENDERING ================= */}
          {crop ? (
            <div
              className="editor-slot-image"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                src={img.src}
                draggable={false}
                alt=""
                style={{
                  position: 'absolute',

                  /*  scale image so crop fills slot */
                  width: `${100 / (crop.w / 100)}%`,
                  height: `${100 / (crop.h / 100)}%`,

                  /*  shift image so crop aligns */
                  left: `${-(crop.x / 100) * (100 / (crop.w / 100))}%`,
                  top: `${-(crop.y / 100) * (100 / (crop.h / 100))}%`,

                  objectFit: 'cover', // important
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ) : (

            // Fallback (no crop yet)
            <img
              src={img.src}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: img.fit || imageFitMode
              }}
            />
          )}

          <button
            className="editor-slot-remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(img.id)
            }}
          >
            ×
          </button>
        </>
      ) : (
        <span className="editor-slot-placeholder">
          {selected ? 'Select photo' : '+ Add photo'}
        </span>
      )}
    </div>
  )
}
