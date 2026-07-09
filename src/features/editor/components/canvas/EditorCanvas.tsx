'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import '@/styles/editor/canvas.css'
import ImageGrid from './ImageGrid'
import { PhotoBookPage } from '@/types/project'
import { LayoutConfig } from '@/types/layout'

const normalizeCrop = (item) => {
  const c = item?.crop
  if (!c) return null
  const values = [c.x, c.y, c.w, c.h]
  if (!values.every(Number.isFinite)) return null
  const looksNormalized = c.w <= 1.5 && c.h <= 1.5 && c.x <= 1.5 && c.y <= 1.5
  return looksNormalized
    ? { x: c.x * 100, y: c.y * 100, w: c.w * 100, h: c.h * 100 }
    : c
}

/* ---- Reusable draggable + resizable overlay element ---- */
function OverlayElement({ overlay, pageRef, pageMargin, uploadedImages = [], onUpdate, onRemove, isSelected, onSelect, onEditPhoto, onDragMove, onDragEnd, onUpdateContent }) {
  const elRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const startRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0, ow: 0, oh: 0 })
  const inlineRef = useRef(null)
  // Auto-focus the inline editable when this text overlay becomes selected
  useEffect(() => {
    if (isSelected && overlay.type === 'text' && inlineRef.current) {
      requestAnimationFrame(() => {
        const el = inlineRef.current
        if (!el) return
        // Set content if empty or changed
        if (el.textContent !== (overlay.content || '')) {
          el.textContent = overlay.content || ''
        }
        el.focus()
        // Place cursor at end
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(el)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)
      })
    }
  }, [isSelected, overlay.type])

  const getContentSize = () => {
    const pr = pageRef.current?.getBoundingClientRect()
    if (!pr) return { cw: 1, ch: 1 }
    return { cw: pr.width - pageMargin * 2, ch: pr.height - pageMargin * 2 }
  }

  /* ---- Drag handlers ---- */
  const isInteractiveTarget = (target) => {
    return !!target?.closest?.('button, input, textarea, select, [contenteditable="true"], .overlay-resize-handle, .overlay-edit-btn, .overlay-delete-btn')
  }

  const onDragStart = (e, force = false) => {
    if (resizing) return
    e.stopPropagation()
    if (!force && isInteractiveTarget(e.target)) return
    if (e.cancelable) e.preventDefault()
    setDragging(true)
    onSelect && onSelect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    startRef.current = { mx: clientX, my: clientY, ox: overlay.x, oy: overlay.y, ow: overlay.width, oh: overlay.height }

    const onMove = (ev) => {
      if (ev.cancelable) ev.preventDefault()
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      const { cw, ch } = getContentSize()
      const dx = ((cx - startRef.current.mx) / cw) * 100
      const dy = ((cy - startRef.current.my) / ch) * 100
      let nx = startRef.current.ox + dx
      let ny = startRef.current.oy + dy
      // Clamp so element stays within canvas bounds
      nx = Math.max(0, Math.min(nx, 100 - overlay.width))
      ny = Math.max(0, Math.min(ny, 100 - overlay.height))
      onUpdate({ ...overlay, x: nx, y: ny })
      // Report center position to parent for alignment guides
      const centerX = nx + overlay.width / 2
      const centerY = ny + overlay.height / 2
      onDragMove && onDragMove(centerX, centerY)
    }

    const onUp = () => {
      setDragging(false)
      onDragEnd && onDragEnd()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('touchcancel', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    window.addEventListener('touchcancel', onUp)
  }

  /* ---- Resize handlers ---- */
  const onResizeStart = (e, handle) => {
    e.stopPropagation()
    e.preventDefault()
    setResizing(true)
    setResizeHandle(handle)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    startRef.current = { mx: clientX, my: clientY, ox: overlay.x, oy: overlay.y, ow: overlay.width, oh: overlay.height }

    const onMove = (ev) => {
      ev.preventDefault()
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      const { cw, ch } = getContentSize()
      const dx = ((cx - startRef.current.mx) / cw) * 100
      const dy = ((cy - startRef.current.my) / ch) * 100
      let { ox, oy, ow, oh } = startRef.current
      let nx = ox, ny = oy, nw = ow, nh = oh

      if (handle.includes('e')) nw = Math.max(8, ow + dx)
      if (handle.includes('w')) { nw = Math.max(8, ow - dx); nx = ox + (ow - nw) }
      if (handle.includes('s')) nh = Math.max(6, oh + dy)
      if (handle.includes('n')) { nh = Math.max(6, oh - dy); ny = oy + (oh - nh) }

      // Clamp so element stays within canvas bounds
      if (nx < 0) { nw += nx; nx = 0 }
      if (ny < 0) { nh += ny; ny = 0 }
      if (nx + nw > 100) nw = 100 - nx
      if (ny + nh > 100) nh = 100 - ny
      nw = Math.max(8, nw)
      nh = Math.max(6, nh)

      onUpdate({ ...overlay, x: nx, y: ny, width: nw, height: nh })
    }

    const onUp = () => {
      setResizing(false)
      setResizeHandle(null)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('touchcancel', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    window.addEventListener('touchcancel', onUp)
  }

  /* ---- Deselect is handled by parent ---- */
  const handleSelect = (e) => {
    e.stopPropagation()
    onSelect && onSelect()
  }

  const showControls = isSelected || dragging || resizing
  const libraryImage = overlay.imageId !== undefined
    ? uploadedImages.find((img) => String(img.id) === String(overlay.imageId))
    : null
  const photoSrc = overlay.src || libraryImage?.src
  const photoName = overlay.name || libraryImage?.name || 'photo'
  const photoFit = overlay.fit || libraryImage?.fit || 'cover'
  const photoCrop = overlay.crop || libraryImage?.crop
  const crop = normalizeCrop({ crop: photoCrop })

  return (
    <div
      ref={elRef}
      className={`canvas-overlay-element ${dragging ? 'dragging' : ''} ${showControls ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${overlay.x}%`,
        top: `${overlay.y}%`,
        width: `${overlay.width}%`,
        height: `${overlay.height}%`,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 20 : 10,
        touchAction: 'none',
      }}
      onMouseDown={(e) => { handleSelect(e); onDragStart(e) }}
      onTouchStart={(e) => { handleSelect(e); onDragStart(e) }}
    >
      {/* Content */}
      {overlay.type === 'text' ? (
        isSelected ? (
          /* Editable inline div when selected — lives inside the draggable wrapper */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: overlay.style?.textAlign === 'left' ? 'flex-start' : overlay.style?.textAlign === 'right' ? 'flex-end' : 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              ref={inlineRef}
              className="overlay-inline-editable"
              contentEditable
              suppressContentEditableWarning
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onInput={(e) => onUpdateContent && onUpdateContent(e.currentTarget.textContent)}
              data-placeholder={overlay.placeholder || 'Type here…'}
              style={{
                width: '100%',
                fontSize: overlay.style?.fontSize || 18,
                color: overlay.style?.color || '#000',
                fontFamily: overlay.style?.fontFamily || 'Inter',
                textAlign: overlay.style?.textAlign || 'center',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '6px',
                boxSizing: 'border-box',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflow: 'hidden',
                caretColor: overlay.style?.color || '#000',
                minHeight: '1em',
                pointerEvents: 'auto',
              }}
            />
          </div>
        ) : (
          <div
            className="overlay-text-content"
            style={{
              width: '100%',
              height: '100%',
              fontSize: overlay.style?.fontSize || 18,
              color: overlay.content ? (overlay.style?.color || '#000') : '#bbb',
              fontFamily: overlay.style?.fontFamily || 'Inter',
              textAlign: overlay.style?.textAlign || 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: overlay.style?.textAlign === 'left' ? 'flex-start' : overlay.style?.textAlign === 'right' ? 'flex-end' : 'center',
              padding: '6px',
              boxSizing: 'border-box',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {overlay.content || <span style={{ fontSize: '0.65em', fontStyle: 'italic' }}>{overlay.placeholder || 'Type here…'}</span>}
          </div>
        )
      ) : crop ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: overlay.style?.borderRadius ?? 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <img
            src={photoSrc}
            alt={photoName}
            draggable={false}
            style={{
              position: 'absolute',
              width: `${100 / (crop.w / 100)}%`,
              height: `${100 / (crop.h / 100)}%`,
              // Override global img { max-width: 100% } reset — the image is
              // intentionally larger than the slot so the crop region fills it
              maxWidth: 'none',
              maxHeight: 'none',
              left: `${-(crop.x / 100) * (100 / (crop.w / 100))}%`,
              top: `${-(crop.y / 100) * (100 / (crop.h / 100))}%`,
              objectFit: 'cover',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>
      ) : (
        <img
          src={photoSrc}
          alt={photoName}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: photoFit,
            borderRadius: overlay.style?.borderRadius ?? 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}

      {/* Resize handles */}
      {showControls && (
        <>
          <button
            className="overlay-move-handle"
            onMouseDown={(e) => onDragStart(e, true)}
            onTouchStart={(e) => onDragStart(e, true)}
            title="Move"
            aria-label="Move element"
            type="button"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m19 9 3 3-3 3"/><path d="m9 5 3-3 3 3"/><path d="m9 19 3 3 3-3"/></svg>
          </button>
          {['nw', 'ne', 'sw', 'se'].map(h => (
            <div
              key={h}
              className={`overlay-resize-handle overlay-resize-${h}`}
              onMouseDown={(e) => onResizeStart(e, h)}
              onTouchStart={(e) => onResizeStart(e, h)}
            />
          ))}
          {overlay.type === 'photo' && (
            <button
              className="overlay-edit-btn"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onEditPhoto && onEditPhoto() }}
              title="Edit photo"
              aria-label="Edit photo"
              type="button"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
          )}
          <button
            className="overlay-delete-btn"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            title="Remove"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </>
      )}
    </div>
  )
}

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  currentPage: PhotoBookPage;
  currentLayoutObj: LayoutConfig;
  selectedSizeObj: any;
  pageBgColor: string;
  pageMargin: number;
  pageGutter: number;
  captionPosition: string;
  captionAlignment: string;
  selectedFontSize: number;
  selectedFontColor: string;
  selectedFontFamily: string;
  showPageNumbers: boolean;
  currentPageIdx: number;
  uploadedImages: any[];
  imageGridProps: any;
  onUpdateTextPosition: (rect: any) => void;
  onUpdateOverlay: (idx: number, updated: any) => void;
  onRemoveOverlay: (idx: number) => void;
  selectedOverlayIdx: number | null;
  onSelectOverlay: (idx: number | null) => void;
  onEditOverlayPhoto: (idx: number) => void;
  onRemoveText: () => void;
  onUpdateOverlayContent: (idx: number, content: string) => void;
  onUpdateTextContent: (content: string) => void;
}

export default function EditorCanvas({
  canvasRef,
  currentPage,
  currentLayoutObj,
  selectedSizeObj,
  pageBgColor,
  pageMargin,
  pageGutter,
  captionPosition,
  captionAlignment,
  selectedFontSize,
  selectedFontColor,
  selectedFontFamily,
  showPageNumbers,
  currentPageIdx,
  uploadedImages,
  imageGridProps,
  onUpdateTextPosition,
  onUpdateOverlay,
  onRemoveOverlay,
  selectedOverlayIdx,
  onSelectOverlay,
  onEditOverlayPhoto,
  onRemoveText,
  onUpdateOverlayContent,
  onUpdateTextContent,
}: EditorCanvasProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isTextSelected, setIsTextSelected] = useState(false)
  const textRef = useRef(null)
  const rectRef = useRef(null)
  const pageElRef = useRef(null)
  const mainTextRef = useRef(null) // inline textarea for main text
  // snapshot of rect state at start of drag/resize
  const mainStartRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0, ow: 0, oh: 0 })
  // Overlay drag alignment state
  const [overlayDragPos, setOverlayDragPos] = useState(null)
  const [isOverlayDragging, setIsOverlayDragging] = useState(false)

  // Auto-focus inline editable when main text is selected
  useEffect(() => {
    if (isTextSelected && currentPage?.type === 'text' && mainTextRef.current) {
      requestAnimationFrame(() => {
        const el = mainTextRef.current
        if (!el) return
        if (el.textContent !== (currentPage.textContent || '')) {
          el.textContent = currentPage.textContent || ''
        }
        el.focus()
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(el)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)
      })
    }
  }, [isTextSelected, currentPage?.type])

  // Compute overlay alignment classes for the editor-page div
  const getOverlayAlignmentClasses = () => {
    if (!isOverlayDragging || !overlayDragPos) return ''
    const { x, y } = overlayDragPos
    let classes = ''
    if (Math.abs(x - 50) < 5) classes += ' show-vertical-center'
    if (Math.abs(y - 50) < 5) classes += ' show-horizontal-center'
    if (Math.abs(x - 25) < 5) classes += ' show-vertical-left'
    if (Math.abs(x - 75) < 5) classes += ' show-vertical-right'
    if (Math.abs(y - 25) < 5) classes += ' show-horizontal-top'
    if (Math.abs(y - 75) < 5) classes += ' show-horizontal-bottom'
    if (Math.abs(x - 50) < 2) classes += ' snap-vertical-center'
    if (Math.abs(y - 50) < 2) classes += ' snap-horizontal-center'
    return classes
  }


  // --- Helper: get content area size in px ---
  const getMainContentSize = () => {
    const pr = pageElRef.current?.getBoundingClientRect()
    if (!pr) return { cw: 1, ch: 1 }
    return { cw: pr.width - pageMargin * 2, ch: pr.height - pageMargin * 2 }
  }

  // --- Drag logic for main text rectangle (snapshot-based, matches overlay) ---
  const isMainInteractiveTarget = (target) => {
    return !!target?.closest?.('button, input, textarea, select, [contenteditable="true"], .overlay-resize-handle, .overlay-delete-btn')
  }

  const handleMouseDown = (e, force = false) => {
    if (currentPage?.type !== 'text') return
    e.stopPropagation()
    if (!force && isMainInteractiveTarget(e.target)) return
    if (e.cancelable) e.preventDefault()
    setIsDragging(true)
    setIsTextSelected(true)
    // Deselect any overlay when main text box is selected
    onSelectOverlay && onSelectOverlay(null)
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    // Snapshot current position (center-based %)
    const posX = currentPage.textPosition?.x || 50
    const posY = currentPage.textPosition?.y || 50
    const w = currentPage.textRect?.width || 50
    const h = currentPage.textRect?.height || 15
    mainStartRef.current = { mx: cx, my: cy, ox: posX, oy: posY, ow: w, oh: h }
  }

  const handleTouchStart = (e) => {
    if (currentPage?.type !== 'text') return
    handleMouseDown(e)
  }

  // --- Resize logic for main text rectangle (snapshot-based, matches overlay) ---
  const handleResizeStart = (e, handle) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeHandle(handle)
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    const posX = currentPage.textPosition?.x || 50
    const posY = currentPage.textPosition?.y || 50
    const w = currentPage.textRect?.width || 50
    const h = currentPage.textRect?.height || 15
    mainStartRef.current = { mx: cx, my: cy, ox: posX, oy: posY, ow: w, oh: h }
  }

  const handleResizeTouchStart = (e, handle) => {
    handleResizeStart(e, handle)
  }

  const handleMouseMove = (e) => {
    if (isResizing && currentPage?.type === 'text' && onUpdateTextPosition) {
      handleResize(e)
    } else if (isDragging && currentPage?.type === 'text' && onUpdateTextPosition) {
      handleDrag(e)
    }
  }

  const handleTouchMove = (e) => {
    if (isResizing && currentPage?.type === 'text' && onUpdateTextPosition) {
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      handleResize({ clientX: touch.clientX, clientY: touch.clientY })
    } else if (isDragging && currentPage?.type === 'text' && onUpdateTextPosition) {
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      handleDrag({ clientX: touch.clientX, clientY: touch.clientY })
    }
  }

  const handleDrag = (e) => {
    const { cw, ch } = getMainContentSize()
    const cx = e.clientX
    const cy = e.clientY
    const dx = ((cx - mainStartRef.current.mx) / cw) * 100
    const dy = ((cy - mainStartRef.current.my) / ch) * 100
    const w = mainStartRef.current.ow
    const h = mainStartRef.current.oh
    let nx = mainStartRef.current.ox + dx
    let ny = mainStartRef.current.oy + dy
    // Clamp center-based position so edges stay within canvas (0–100%)
    nx = Math.max(w / 2, Math.min(nx, 100 - w / 2))
    ny = Math.max(h / 2, Math.min(ny, 100 - h / 2))
    onUpdateTextPosition({ x: nx, y: ny })
  }

  const handleResize = (e) => {
    const { cw, ch } = getMainContentSize()
    const cx = e.clientX
    const cy = e.clientY
    const dx = ((cx - mainStartRef.current.mx) / cw) * 100
    const dy = ((cy - mainStartRef.current.my) / ch) * 100
    let { ox, oy, ow, oh } = mainStartRef.current
    // ox/oy are center-based; convert to top-left for resize math
    let tlx = ox - ow / 2
    let tly = oy - oh / 2
    let nw = ow, nh = oh, ntlx = tlx, ntly = tly

    const handle = resizeHandle
    if (handle.includes('e')) nw = Math.max(8, ow + dx)
    if (handle.includes('w')) { nw = Math.max(8, ow - dx); ntlx = tlx + (ow - nw) }
    if (handle.includes('s')) nh = Math.max(6, oh + dy)
    if (handle.includes('n')) { nh = Math.max(6, oh - dy); ntly = tly + (oh - nh) }

    // Clamp so element stays within canvas bounds
    if (ntlx < 0) { nw += ntlx; ntlx = 0 }
    if (ntly < 0) { nh += ntly; ntly = 0 }
    if (ntlx + nw > 100) nw = 100 - ntlx
    if (ntly + nh > 100) nh = 100 - ntly
    nw = Math.max(8, nw)
    nh = Math.max(6, nh)

    // Convert back to center-based
    const newCenterX = ntlx + nw / 2
    const newCenterY = ntly + nh / 2

    onUpdateTextPosition({ x: newCenterX, y: newCenterY, width: nw, height: nh })
  }

  const handleMouseEnter = () => {
    if (currentPage?.type === 'text') {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (currentPage?.type === 'text') {
      setIsHovering(false);
    }
  };

  const handleCanvasClick = (e) => {
    // If clicking anywhere outside an overlay element or the main text rectangle, deselect
    const clickedOverlay = e.target.closest('.canvas-overlay-element');
    if (!clickedOverlay) {
      setIsTextSelected(false);
      onSelectOverlay && onSelectOverlay(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  return (
    <div
      ref={canvasRef}
      className="editor-canvas-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
    >
      <div
        ref={pageElRef}
        className={`editor-page ${isDragging || isOverlayDragging ? 'dragging-text' : ''} ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 50) < 5 ? 'show-vertical-center' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 50) < 5 ? 'show-horizontal-center' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 25) < 5 ? 'show-vertical-left' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 75) < 5 ? 'show-vertical-right' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 25) < 5 ? 'show-horizontal-top' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 75) < 5 ? 'show-horizontal-bottom' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 50) < 2 ? 'snap-vertical-center' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 50) < 2 ? 'snap-horizontal-center' : ''
        }${getOverlayAlignmentClasses()}`}
        style={{
          aspectRatio: selectedSizeObj?.aspect,
          backgroundColor: currentPage?.type === 'text' ? (currentPage.pageBgColor || '#ffffff') : pageBgColor,
          padding: pageMargin,
        }}
      >
        {/* Visual guidelines for text positioning */}
        {currentPage?.type === 'text' && (
          <>
            <div className="editor-page-guidelines">
              <div className="quarter-line"></div>
              <div className="quarter-line"></div>
              <div className="quarter-line"></div>
              <div className="quarter-line"></div>
            </div>
            <div className="editor-page-grid"></div>
          </>
        )}
        {currentPage?.caption && captionPosition === 'top' && (
          <p
            className="editor-caption"
            style={{
              fontSize: selectedFontSize,
              color: selectedFontColor,
              fontFamily: selectedFontFamily,
              textAlign: captionAlignment as any,
              marginBottom: pageGutter,
            }}
          >
            {currentPage.caption}
          </p>
        )}

        <div className="editor-page-content">
          {currentPage?.type === 'text' ? (
            <div className="text-page-content">
              {/* Resizable Text Rectangle – styled like overlay elements */}
              {!currentPage.textBoxHidden && (
              <div
                ref={rectRef}
                className={`canvas-overlay-element ${isDragging ? 'dragging' : ''} ${isResizing ? 'dragging' : ''} ${isTextSelected ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${currentPage.textPosition?.x || 50}%`,
                  top: `${currentPage.textPosition?.y || 50}%`,
                  width: `${currentPage.textRect?.width || 50}%`,
                  height: `${currentPage.textRect?.height || 15}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  zIndex: isTextSelected ? 20 : 10,
                  touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Corner resize handles – same as overlay elements */}
                {(isDragging || isResizing || isTextSelected) && (
                  <>
                    {['nw', 'ne', 'sw', 'se'].map(h => (
                      <div
                        key={h}
                        className={`overlay-resize-handle overlay-resize-${h}`}
                        onMouseDown={(e) => handleResizeStart(e, h)}
                        onTouchStart={(e) => handleResizeTouchStart(e, h)}
                      />
                    ))}
                    <button
                      className="overlay-move-handle"
                      onMouseDown={(e) => handleMouseDown(e, true)}
                      onTouchStart={(e) => handleMouseDown(e, true)}
                      title="Move text"
                      aria-label="Move text"
                      type="button"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m19 9 3 3-3 3"/><path d="m9 5 3-3 3 3"/><path d="m9 19 3 3 3-3"/></svg>
                    </button>
                    <button
                      className="overlay-delete-btn"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); onRemoveText && onRemoveText() }}
                      title="Clear text"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </>
                )}

                {/* Text content inside rectangle */}
                {isTextSelected ? (
                  /* Editable inline div when selected */
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: currentPage.textStyle?.textAlign === 'left' ? 'flex-start' : currentPage.textStyle?.textAlign === 'right' ? 'flex-end' : 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      ref={mainTextRef}
                      className="overlay-inline-editable"
                      contentEditable
                      suppressContentEditableWarning
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onInput={(e) => onUpdateTextContent && onUpdateTextContent(e.currentTarget.textContent)}
                      data-placeholder="Type here…"
                      style={{
                        width: '100%',
                        fontSize: currentPage.textStyle?.fontSize || 11,
                        color: currentPage.textStyle?.color || '#000000',
                        fontFamily: currentPage.textStyle?.fontFamily || 'Inter',
                        textAlign: currentPage.textStyle?.textAlign || 'left',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        padding: '6px',
                        boxSizing: 'border-box',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        caretColor: currentPage.textStyle?.color || '#000000',
                        minHeight: '1em',
                        pointerEvents: 'auto',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    ref={textRef}
                    className="overlay-text-content"
                    style={{
                      width: '100%',
                      height: '100%',
                      fontSize: currentPage.textStyle?.fontSize || 11,
                      color: currentPage.textContent ? (currentPage.textStyle?.color || '#000000') : '#bbb',
                      fontFamily: currentPage.textStyle?.fontFamily || 'Inter',
                      textAlign: currentPage.textStyle?.textAlign || 'left',
                      whiteSpace: 'pre-wrap',
                      userSelect: 'none',
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: currentPage.textStyle?.textAlign === 'left' ? 'flex-start' : currentPage.textStyle?.textAlign === 'right' ? 'flex-end' : 'center',
                      padding: '6px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {currentPage.textContent || <span style={{ fontSize: '0.65em', fontStyle: 'italic' }}>Type here…</span>}
                  </div>
                )}
              </div>
              )}

              {/* ---- Overlay elements (extra text boxes + photos) ---- */}
              {currentPage.overlays && currentPage.overlays.map((overlay, idx) => (
                <OverlayElement
                  key={overlay.id}
                  overlay={overlay}
                  pageRef={pageElRef}
                  pageMargin={pageMargin}
                  uploadedImages={uploadedImages}
                  isSelected={selectedOverlayIdx === idx}
                  onSelect={() => { setIsTextSelected(false); onSelectOverlay && onSelectOverlay(idx) }}
                  onUpdate={(updated) => onUpdateOverlay && onUpdateOverlay(idx, updated)}
                  onRemove={() => onRemoveOverlay && onRemoveOverlay(idx)}
                  onEditPhoto={() => onEditOverlayPhoto && onEditOverlayPhoto(idx)}
                  onUpdateContent={(content) => onUpdateOverlayContent && onUpdateOverlayContent(idx, content)}
                  onDragMove={(cx, cy) => {
                    setIsOverlayDragging(true)
                    setOverlayDragPos({ x: cx, y: cy })
                  }}
                  onDragEnd={() => {
                    setIsOverlayDragging(false)
                    setOverlayDragPos(null)
                  }}
                />
              ))}
            </div>
          ) : (
            <ImageGrid {...imageGridProps} />
          )}
        </div>

        {currentPage?.caption && captionPosition === 'bottom' && (
          <p
            className="editor-caption"
            style={{
              fontSize: selectedFontSize,
              color: selectedFontColor,
              fontFamily: selectedFontFamily,
              textAlign: captionAlignment as any,
              marginTop: pageGutter,
            }}
          >
            {currentPage.caption}
          </p>
        )}
      </div>
    </div>
  )
}
