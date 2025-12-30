'use client'
import { useState, useRef, useEffect } from 'react'
import '@/styles/editor/image-editor.css'

export default function ImageEditorModal({
  image,
  slot,
  onClose,
  onSave,
}) {
  const imgRef = useRef(null)

  const [fit, setFit] = useState(image.fit ?? 'cover')
  const [offset, setOffset] = useState({
    x: image.offsetX ?? 0,
    y: image.offsetY ?? 0,
  })
  const [cropMode, setCropMode] = useState(true)

  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const bounds = useRef({ x: 0, y: 0 })

  /* ---------- Compute crop bounds ---------- */
  const computeBounds = () => {
    const img = imgRef.current
    if (!img) return

    const imgRatio = img.naturalWidth / img.naturalHeight
    const slotRatio = slot.width / slot.height

    let renderedW, renderedH

    if (fit === 'cover') {
      if (imgRatio > slotRatio) {
        renderedH = slot.height
        renderedW = slot.height * imgRatio
      } else {
        renderedW = slot.width
        renderedH = slot.width / imgRatio
      }
    } else {
      if (imgRatio > slotRatio) {
        renderedW = slot.width
        renderedH = slot.width / imgRatio
      } else {
        renderedH = slot.height
        renderedW = slot.height * imgRatio
      }
    }

    bounds.current = {
      x: Math.max(0, (renderedW - slot.width) / 2),
      y: Math.max(0, (renderedH - slot.height) / 2),
    }

    setOffset(prev => ({
      x: Math.max(-bounds.current.x, Math.min(bounds.current.x, prev.x)),
      y: Math.max(-bounds.current.y, Math.min(bounds.current.y, prev.y)),
    }))
  }

  useEffect(() => {
    computeBounds()
  }, [fit])

  /* ---------- Drag logic ---------- */
  const onMouseDown = e => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
  }

  const onMouseMove = e => {
    if (!dragging.current) return

    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y

    setOffset(prev => ({
      x: Math.max(
        -bounds.current.x,
        Math.min(bounds.current.x, prev.x + dx)
      ),
      y: Math.max(
        -bounds.current.y,
        Math.min(bounds.current.y, prev.y + dy)
      ),
    }))

    last.current = { x: e.clientX, y: e.clientY }
  }

  const onMouseUp = () => (dragging.current = false)

  return (
    <div className="editor-modal-backdrop">
      <div className="editor-modal">
        <div className="editor-header">
          <h3>Edit Image</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ===== Crop Stage ===== */}
        <div className="crop-stage">

          {/* Blurred background */}
          {cropMode && (
            <img
              className="crop-bg"
              src={image.src}
              alt=""
            />
          )}

          {/* Crop viewport (slot size) */}
          <div
            className="crop-viewport"
            style={{
              width: slot.width,
              height: slot.height,
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <img
              ref={imgRef}
              src={image.src}
              draggable={false}
              onMouseDown={onMouseDown}
              onLoad={computeBounds}
              style={{
                objectFit: fit,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="editor-controls">
          <div className="control-row">
            <label>Mode</label>
            <select
              value={cropMode ? 'crop' : 'fit'}
              onChange={e => setCropMode(e.target.value === 'crop')}
            >
              <option value="crop">Crop</option>
              <option value="fit">Fit only</option>
            </select>
          </div>

          <div className="control-row">
            <label>Fit</label>
            <select value={fit} onChange={e => setFit(e.target.value)}>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>

          <p className="hint">
            Drag the image to choose the visible area
          </p>
        </div>

        <div className="editor-actions">
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={() =>
              onSave({
                ...image,
                fit,
                offsetX: offset.x,
                offsetY: offset.y,
                crop: cropMode,
              })
            }
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
