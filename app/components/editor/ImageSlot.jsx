'use client'

import { useState } from 'react'

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
          {img.crop ? (
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
                  width: `${100 / img.crop.w}%`,
                  height: `${100 / img.crop.h}%`,

                  /*  shift image so crop aligns */
                  left: `${-img.crop.x * (100 / img.crop.w)}%`,
                  top: `${-img.crop.y * (100 / img.crop.h)}%`,

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
