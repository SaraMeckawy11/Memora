'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import '@/styles/editor/image-editor.css'

export default function ImageEditorModal({ image, slot, onClose, onSave }) {
  /* ---------- GUARD ---------- */
  if (!image?.src || !slot ) {
    return null
  }

  /* ---------- CONSTANTS ---------- */
  const MAX_PREVIEW_SIZE = 360

  /* ---------- PREVIEW SCALE ---------- */
  const scale = useMemo(() => {
    return Math.min(
      MAX_PREVIEW_SIZE / slot.width,
      MAX_PREVIEW_SIZE / slot.height,
      1
    )
  }, [slot.width, slot.height])

  const previewSlot = useMemo(
    () => ({
      width: slot.width * scale,
      height: slot.height * scale,
    }),
    [slot.width, slot.height, scale]
  )

  /* ---------- STATE ---------- */
  const [fit, setFit] = useState(image.fit || 'cover')
  const cropMode = true

  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const [rendered, setRendered] = useState({
    width: previewSlot.width,
    height: previewSlot.height,
  })

  /* ---------- REFS ---------- */
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const bounds = useRef({ x: 0, y: 0 })

  /* ---------- HELPERS ---------- */
  const clamp = (value, axis) =>
    Math.max(-bounds.current[axis], Math.min(bounds.current[axis], value))

  /* ---------- COMPUTE IMAGE SIZE ---------- */
  useEffect(() => {
    const img = new Image()

    img.onload = () => {
      const imgRatio = img.naturalWidth / img.naturalHeight
      const slotRatio = previewSlot.width / previewSlot.height

      let width, height

      if (fit === 'cover') {
        if (imgRatio > slotRatio) {
          height = previewSlot.height
          width = height * imgRatio
        } else {
          width = previewSlot.width
          height = width / imgRatio
        }
      } else {
        // ✅ TRUE CONTAIN
        if (imgRatio > slotRatio) {
          width = previewSlot.width
          height = width / imgRatio
        } else {
          height = previewSlot.height
          width = height * imgRatio
        }
      }

      setRendered({ width, height })

      // ✅ bounds only exist for cover + crop
      bounds.current =
        fit === 'cover' && cropMode
          ? {
              x: Math.max(0, (width - previewSlot.width) / 2),
              y: Math.max(0, (height - previewSlot.height) / 2),
            }
          : { x: 0, y: 0 }

      // ✅ contain is always centered
      setOffset({ x: 0, y: 0 })
    }

    img.src = image.src
  }, [image.src, fit, cropMode, previewSlot.width, previewSlot.height])

  /* ---------- POINTER HANDLERS ---------- */
  const onPointerDown = (e) => {
    if (!cropMode || fit !== 'cover') return
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    e.target.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return

    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y

    setOffset(prev => ({
      x: clamp(prev.x + dx, 'x'),
      y: clamp(prev.y + dy, 'y'),
    }))

    last.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e) => {
    dragging.current = false
    e.target.releasePointerCapture?.(e.pointerId)
  }

  /* ---------- APPLY ---------- */
  const applyChanges = () => {
    // ✅ ONLY save crop when it actually makes sense
    if (fit === 'cover' && cropMode) {
      const cropX = (bounds.current.x - offset.x) / rendered.width
      const cropY = (bounds.current.y - offset.y) / rendered.height
      const cropW = previewSlot.width / rendered.width
      const cropH = previewSlot.height / rendered.height

      onSave({
        ...image,
        fit,
        crop: {
          x: Math.max(0, Math.min(1, cropX)),
          y: Math.max(0, Math.min(1, cropY)),
          w: Math.min(1, cropW),
          h: Math.min(1, cropH),
        },
      })
    } else {
      // ✅ contain = no crop
      onSave({
        ...image,
        fit,
        crop: undefined,
      })
    }
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="editor-modal-backdrop">
      <div className="editor-modal">
        {/* HEADER */}
        <div className="editor-header">
          <h3>Edit Image</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* STAGE */}
        <div
          className="crop-stage"
          style={{
            position: 'relative',
            minHeight: MAX_PREVIEW_SIZE,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* DIMMED IMAGE */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: rendered.width,
              height: rendered.height,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <img
              src={image.src}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                filter: cropMode ? 'brightness(0.45)' : 'none',
                userSelect: 'none',
              }}
            />
          </div>

          {/* SLOT */}
          <div
            className="crop-viewport"
            style={{
              width: previewSlot.width,
              height: previewSlot.height,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 20,
              background: '#fff',
              borderRadius: 6,
              touchAction: 'none',
            }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img
              src={image.src}
              draggable={false}
              onPointerDown={onPointerDown}
              style={{
                position: 'absolute',
                left: `calc(50% - ${rendered.width / 2}px)`,
                top: `calc(50% - ${rendered.height / 2}px)`,
                width: rendered.width,
                height: rendered.height,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                cursor:
                  cropMode && fit === 'cover' ? 'grab' : 'default',
                userSelect: 'none',
                touchAction: 'none',
              }}
            />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="editor-controls">

          <div className="control-row">
            <label>Fit</label>
            <select
              value={fit}
              onChange={(e) => setFit(e.target.value)}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="editor-actions">
          <button className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" onClick={applyChanges}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
