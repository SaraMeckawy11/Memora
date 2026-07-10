'use client'
import React, { useRef, useState, useEffect } from 'react'

// Opacity is stored as 0-100 by presets and 0-1 by some legacy tooling
const normalizeOpacity = (value?: number) => {
  if (value === undefined || value === null) return 1
  const v = Number(value)
  if (!Number.isFinite(v)) return 1
  return v > 1 ? Math.min(100, v) / 100 : Math.max(0, v)
}

interface CoverCanvasProps {
  side: 'front' | 'back'
  elements: any[]
  backgroundColor: string
  canvasSettings: { width: number; height: number }
  /** When true, text elements are clickable (preset text-edit mode) */
  selectableText?: boolean
  /** When true, ALL elements are selectable and draggable (custom mode) */
  interactive?: boolean
  selectedId?: string | number | null
  onSelectText?: (id: string | number) => void
  onSelectElement?: (id: string | number | null) => void
  onMoveElement?: (id: string | number, x: number, y: number) => void
  maxHeight?: number
}

/**
 * Scale-to-fit cover renderer. The inner .editor-canvas is laid out at full
 * canvas resolution (so html2canvas exports stay print-quality) and scaled
 * down with a CSS transform for display.
 *
 * Preset mode: layout locked, text clickable for editing words only.
 * Custom mode (interactive): elements can be selected and dragged to move.
 */
export default function CoverCanvas({
  side,
  elements,
  backgroundColor,
  canvasSettings,
  selectableText = false,
  interactive = false,
  selectedId = null,
  onSelectText,
  onSelectElement,
  onMoveElement,
  maxHeight = 560,
}: CoverCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.2)
  const scaleRef = useRef(scale)
  scaleRef.current = scale
  const dragRef = useRef<{ id: any; startX: number; startY: number; elX: number; elY: number } | null>(null)

  const W = canvasSettings?.width || 794
  const H = canvasSettings?.height || 1123

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return
      const cw = wrapRef.current.clientWidth
      if (cw > 0) setScale(Math.min(cw / W, maxHeight / H))
    }
    update()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    if (ro && wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [W, H, maxHeight])

  const startDrag = (e: React.PointerEvent, el: any) => {
    if (!interactive) return
    e.preventDefault()
    e.stopPropagation()
    onSelectElement?.(el.id)
    dragRef.current = { id: el.id, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y }

    const move = (ev: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      ev.preventDefault()
      const s = scaleRef.current || 1
      const nx = d.elX + (ev.clientX - d.startX) / s
      const ny = d.elY + (ev.clientY - d.startY) / s
      // Keep at least a fifth of the element on the canvas
      const minX = -(el.width || 0) * 0.8
      const maxX = W - (el.width || 0) * 0.2
      const minY = -(el.height || 0) * 0.8
      const maxY = H - (el.height || 0) * 0.2
      onMoveElement?.(d.id, Math.max(minX, Math.min(maxX, nx)), Math.max(minY, Math.min(maxY, ny)))
    }
    const up = () => {
      dragRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const renderElement = (el: any) => {
    const isSelected = selectedId === el.id
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      transform: `rotate(${el.rotation || 0}deg) scaleX(${el.scaleX || 1}) scaleY(${el.scaleY || 1})`,
      zIndex: el.zIndex || 0,
      opacity: normalizeOpacity(el.opacity),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: interactive ? 'auto' : 'none',
      touchAction: interactive ? 'none' : undefined,
      cursor: interactive ? 'grab' : undefined,
    }

    const interactiveProps = interactive
      ? {
          onPointerDown: (e: React.PointerEvent) => startDrag(e, el),
        }
      : {}
    const interactiveClass = interactive ? ` cover-el-interactive${isSelected ? ' selected' : ''}` : ''

    if (el.type === 'text') {
      const presetClickable = !interactive && selectableText && onSelectText
      return (
        <div
          key={el.id}
          className={`cover-el-text${presetClickable ? ' selectable' : ''}${!interactive && isSelected ? ' selected' : ''}${interactiveClass}`}
          onClick={presetClickable ? () => onSelectText(el.id) : undefined}
          {...interactiveProps}
          style={{
            ...baseStyle,
            pointerEvents: interactive || presetClickable ? 'auto' : 'none',
            color: el.color || '#000',
            fontSize: el.fontSize || 16,
            fontFamily: el.fontFamily || 'serif',
            textAlign: (el.textAlign || 'left') as any,
            fontWeight: el.fontWeight || 'normal',
            fontStyle: el.fontStyle || 'normal',
            letterSpacing: el.letterSpacing,
            lineHeight: el.lineHeight || 1.2,
            whiteSpace: 'pre-wrap',
          }}
        >
          {el.content}
        </div>
      )
    }

    if (el.type === 'image') {
      return (
        <div key={el.id} className={interactiveClass.trim() || undefined} {...interactiveProps} style={baseStyle}>
          <img
            src={el.src}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: 'none',
              maxHeight: 'none',
              objectFit: el.options?.objectFit || 'cover',
              borderRadius: el.options?.borderRadius || 0,
              filter: el.options?.filter || 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      )
    }

    if (el.type === 'shape') {
      const shapeStyle: React.CSSProperties = {
        ...baseStyle,
        backgroundColor: el.fill || 'transparent',
        border: el.options?.stroke
          ? `${el.options.strokeWidth || 1}px solid ${el.options.stroke}`
          : 'none',
        borderRadius: el.options?.borderRadius || 0,
        clipPath: el.options?.clipPath || 'none',
      }
      if (el.shapeType === 'circle') shapeStyle.borderRadius = '50%'
      if (el.shapeType === 'triangle') shapeStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
      return <div key={el.id} className={interactiveClass.trim() || undefined} {...interactiveProps} style={shapeStyle} />
    }

    if (el.type === 'drawing') {
      const viewBoxW = el.originalWidth || el.width
      const viewBoxH = el.originalHeight || el.height
      return (
        <div key={el.id} className={interactiveClass.trim() || undefined} {...interactiveProps} style={baseStyle}>
          <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <path
              d={el.path}
              stroke={el.stroke}
              strokeWidth={el.strokeWidth}
              fill={el.fill || 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )
    }

    return null
  }

  return (
    <div ref={wrapRef} className="cover-canvas-wrap">
      <div
        id={`canvas-${side}`}
        className="cover-canvas-outer"
        style={{ width: W * scale, height: H * scale }}
      >
        <div
          className="editor-canvas cover-canvas"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor,
          }}
          onPointerDown={
            interactive
              ? (e) => {
                  // Clicking empty canvas deselects
                  if (e.target === e.currentTarget) onSelectElement?.(null)
                }
              : undefined
          }
        >
          {elements.map(renderElement)}
        </div>
      </div>
    </div>
  )
}
