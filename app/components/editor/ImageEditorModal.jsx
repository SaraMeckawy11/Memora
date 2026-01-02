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
  const MIN_CROP_SIZE = 10 // Minimum crop size in pixels

  /* ---------- STATE ---------- */
  const [fit, setFit] = useState(image.fit || 'cover')
  const [isCropping, setIsCropping] = useState(false)
  const [naturalSize, setNaturalSize] = useState({ width: slot.width, height: slot.height })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  // Use slot size for initial rendered/cropRect, will be updated after image load
  const [rendered, setRendered] = useState({
    width: slot.width,
    height: slot.height,
  })
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: slot.width, h: slot.height })
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  /* ---------- PREVIEW SCALE ---------- */
  // When cropping, scale image to fit MAX_PREVIEW_SIZE (not slot)
  const scale = useMemo(() => {
    if (isCropping) {
      return Math.min(
        MAX_PREVIEW_SIZE / naturalSize.width,
        MAX_PREVIEW_SIZE / naturalSize.height,
        1
      )
    }
    return Math.min(
      MAX_PREVIEW_SIZE / slot.width,
      MAX_PREVIEW_SIZE / slot.height,
      1
    )
  }, [slot.width, slot.height, isCropping, naturalSize.width, naturalSize.height])

  const previewSlot = useMemo(
    () => ({
      width: isCropping ? naturalSize.width * scale : slot.width * scale,
      height: isCropping ? naturalSize.height * scale : slot.height * scale,
    }),
    [slot.width, slot.height, scale, isCropping, naturalSize.width, naturalSize.height]
  )

  /* ---------- REFS ---------- */
  const bounds = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  /* ---------- HELPERS ---------- */
  const clamp = (value, axis) =>
    Math.max(-bounds.current[axis], Math.min(bounds.current[axis], value))

  // New helper: Clamp crop rect to image bounds
  const clampCropRect = (rect) => ({
    x: Math.max(0, Math.min(rendered.width - rect.w, rect.x)),
    y: Math.max(0, Math.min(rendered.height - rect.h, rect.y)),
    w: Math.max(MIN_CROP_SIZE, Math.min(rendered.width - rect.x, rect.w)),
    h: Math.max(MIN_CROP_SIZE, Math.min(rendered.height - rect.y, rect.h)),
  })

  /* ---------- COMPUTE IMAGE SIZE ---------- */
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
      let width, height
      if (isCropping) {
        // Always fit the whole image in the preview area when cropping
        const scale = Math.min(
          MAX_PREVIEW_SIZE / img.naturalWidth,
          MAX_PREVIEW_SIZE / img.naturalHeight,
          1
        )
        width = img.naturalWidth * scale
        height = img.naturalHeight * scale
        setRendered({ width, height })
        setCropRect({ x: 0, y: 0, w: width, h: height })
      } else {
        const imgRatio = img.naturalWidth / img.naturalHeight
        const slotRatio = previewSlot.width / previewSlot.height
        if (fit === 'cover') {
          if (imgRatio > slotRatio) {
            height = previewSlot.height
            width = height * imgRatio
          } else {
            width = previewSlot.width
            height = width / imgRatio
          }
        } else if (fit === 'contain') {
          if (imgRatio > slotRatio) {
            width = previewSlot.width
            height = width / imgRatio
          } else {
            height = previewSlot.height
            width = height * imgRatio
          }
        }
        setRendered({ width, height })
        bounds.current =
          fit === 'cover'
            ? {
                x: Math.max(0, (width - previewSlot.width) / 2),
                y: Math.max(0, (height - previewSlot.height) / 2),
              }
            : { x: 0, y: 0 }
        setOffset({ x: 0, y: 0 })
      }
    }
    img.src = image.src
  }, [image.src, fit, isCropping, previewSlot.width, previewSlot.height])

  /* ---------- POINTER HANDLERS ---------- */
  const onPointerDown = (e) => {
    if (isCropping) {
      setDragStart({ x: e.clientX, y: e.clientY })
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check for resize handles (corners and edges)
      const handles = [
        { name: 'nw', x: cropRect.x, y: cropRect.y, cursor: 'nw-resize' },
        { name: 'ne', x: cropRect.x + cropRect.w, y: cropRect.y, cursor: 'ne-resize' },
        { name: 'sw', x: cropRect.x, y: cropRect.y + cropRect.h, cursor: 'sw-resize' },
        { name: 'se', x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h, cursor: 'se-resize' },
        { name: 'n', x: cropRect.x + cropRect.w / 2, y: cropRect.y, cursor: 'n-resize' },
        { name: 's', x: cropRect.x + cropRect.w / 2, y: cropRect.y + cropRect.h, cursor: 's-resize' },
        { name: 'w', x: cropRect.x, y: cropRect.y + cropRect.h / 2, cursor: 'w-resize' },
        { name: 'e', x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h / 2, cursor: 'e-resize' },
      ]

      const handle = handles.find(h => Math.abs(x - h.x) < 10 && Math.abs(y - h.y) < 10)
      if (handle) {
        setResizing(true)
        setResizeHandle(handle.name)
      } else if (x >= cropRect.x && x <= cropRect.x + cropRect.w && y >= cropRect.y && y <= cropRect.y + cropRect.h) {
        setDragging(true)
      }
      e.target.setPointerCapture?.(e.pointerId)
    } else if (fit === 'cover') {
      setDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      e.target.setPointerCapture?.(e.pointerId)
    }
  }

  const onPointerMove = (e) => {
    if (isCropping) {
      if (dragging) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y
        setCropRect(prev => clampCropRect({
          ...prev,
          x: prev.x + dx,
          y: prev.y + dy
        }))
        setDragStart({ x: e.clientX, y: e.clientY })
      } else if (resizing) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y
        setCropRect(prev => {
          let newRect = { ...prev }
          switch (resizeHandle) {
            case 'nw':
              newRect.x += dx
              newRect.y += dy
              newRect.w -= dx
              newRect.h -= dy
              break
            case 'ne':
              newRect.y += dy
              newRect.w += dx
              newRect.h -= dy
              break
            case 'sw':
              newRect.x += dx
              newRect.w -= dx
              newRect.h += dy
              break
            case 'se':
              newRect.w += dx
              newRect.h += dy
              break
            case 'n':
              newRect.y += dy
              newRect.h -= dy
              break
            case 's':
              newRect.h += dy
              break
            case 'w':
              newRect.x += dx
              newRect.w -= dx
              break
            case 'e':
              newRect.w += dx
              break
          }
          return clampCropRect(newRect)
        })
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    } else if (fit === 'cover' && dragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setOffset(prev => ({
        x: clamp(prev.x + dx, 'x'),
        y: clamp(prev.y + dy, 'y'),
      }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const onPointerUp = (e) => {
    setDragging(false)
    setResizing(false)
    setResizeHandle(null)
    e.target.releasePointerCapture?.(e.pointerId)
  }

  /* ---------- CROP APPLY ---------- */
  const applyCrop = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      const scaleX = rendered.width / img.naturalWidth
      const scaleY = rendered.height / img.naturalHeight
      const scale = Math.min(scaleX, scaleY)
      const cropX = cropRect.x / scale
      const cropY = cropRect.y / scale
      const cropW = cropRect.w / scale
      const cropH = cropRect.h / scale
      canvas.width = cropW
      canvas.height = cropH
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
      const croppedSrc = canvas.toDataURL()
      onSave({
        ...image,
        src: croppedSrc,
        fit: 'cover', // Default to cover after cropping
        crop: undefined,
      })
      setIsCropping(false)
    }
    img.src = image.src
  }

  /* ---------- APPLY ---------- */
  const applyChanges = () => {
    if (fit === 'cover') {
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
        style={{ minHeight: MAX_PREVIEW_SIZE }}
      >
        {isCropping ? (
          <div
            ref={containerRef}
            className="crop-cropper-container"
            style={{
              width: rendered.width,
              height: rendered.height,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img
              src={image.src}
              draggable={false}
              className="crop-cropper-image"
            />
            <div
              className={`crop-cropper-rect${dragging ? ' dragging' : ''}`}
              style={{
                left: cropRect.x,
                top: cropRect.y,
                width: cropRect.w,
                height: cropRect.h,
              }}
            >
              {/* Resize handles */}
              {[
                { name: 'nw', class: 'handle-nw' },
                { name: 'ne', class: 'handle-ne' },
                { name: 'sw', class: 'handle-sw' },
                { name: 'se', class: 'handle-se' },
                { name: 'n', class: 'handle-n' },
                { name: 's', class: 'handle-s' },
                { name: 'w', class: 'handle-w' },
                { name: 'e', class: 'handle-e' },
              ].map(handle => (
                <div
                  key={handle.name}
                  className={`crop-cropper-handle ${handle.class}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* DIMMED IMAGE */}
            <div
              aria-hidden
              className="crop-dimmed-bg"
              style={{
                width: rendered.width,
                height: rendered.height,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            >
              <img
                src={image.src}
                draggable={false}
                className="crop-dimmed-img"
              />
            </div>

            {/* SLOT */}
            <div
              className="crop-viewport"
              style={{
                width: previewSlot.width,
                height: previewSlot.height,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <img
                src={image.src}
                draggable={false}
                className={`crop-viewport-img ${fit}`}
                style={{
                  left: `calc(50% - ${rendered.width / 2}px)`,
                  top: `calc(50% - ${rendered.height / 2}px)`,
                  width: rendered.width,
                  height: rendered.height,
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* CONTROLS */}
      <div className="editor-controls">
        <div className="control-row">
          <button
            className={`editor-btn secondary${isCropping ? ' disabled' : ''}`}
            onClick={() => setIsCropping(true)}
            disabled={isCropping}
            type="button"
          >
            Crop Image
          </button>
        </div>
        {isCropping ? (
          <div className="control-row crop-action-row">
            <button
              className="editor-btn ghost"
              onClick={() => setIsCropping(false)}
              type="button"
            >
              Cancel Crop
            </button>
            <button
              className="editor-btn primary"
              onClick={applyCrop}
              type="button"
            >
              Apply Crop
            </button>
          </div>
        ) : (
          <div className="control-row">
            <label>Mode</label>
            <select
              value={fit}
              onChange={(e) => setFit(e.target.value)}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="editor-actions">
        <button className="ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="primary" onClick={applyChanges} disabled={isCropping}>
          Apply
        </button>
      </div>
    </div>
  </div>
)
}