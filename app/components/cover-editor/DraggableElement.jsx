'use client'
import { useState, useEffect, useRef } from 'react'
import '@/styles/cover-editor/canvas.css'

export default function DraggableElement({
  element,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  onDragStart,
  onDragEnd,
  canvasScale = 1,
  isLocked = false,
  isEraserActive = false
}) {
  const elementRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialDims, setInitialDims] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [isEditing, setIsEditing] = useState(false)

  // Handle Dragging
  const handleMouseDown = (e) => {
    if (isEraserActive) {
      e.stopPropagation()
      if (onDelete) onDelete()
      return
    }
    if (isEditing || isLocked) return
    if (e.target.classList.contains('resize-handle')) return
    e.stopPropagation()
    onSelect(element.id)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialDims({ x: element.x, y: element.y, w: element.width, h: element.height })
    if (onDragStart) onDragStart()
  }

  const handleTouchStart = (e) => {
    if (isEraserActive) {
      e.stopPropagation()
      if (onDelete) onDelete()
      return
    }
    if (isEditing || isLocked) return
    if (e.target.classList.contains('resize-handle')) return
    e.stopPropagation()
    onSelect(element.id)
    setIsDragging(true)
    const touch = e.touches[0]
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setInitialDims({ x: element.x, y: element.y, w: element.width, h: element.height })
    if (onDragStart) onDragStart()
  }

  const handleDoubleClick = () => {
    if (element.type === 'text') {
      setIsEditing(true)
    }
  }

  // Handle Resizing
  const handleResizeStart = (e, handle) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX, y: clientY })
    setInitialDims({ x: element.x, y: element.y, w: element.width, h: element.height })
  }

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging && !isResizing) return

      const dx = (clientX - dragStart.x) / canvasScale
      const dy = (clientY - dragStart.y) / canvasScale

      if (isDragging) {
        onChange(element.id, {
          x: initialDims.x + dx,
          y: initialDims.y + dy
        })
      } else if (isResizing) {
        let newX = initialDims.x
        let newY = initialDims.y
        let newW = initialDims.w
        let newH = initialDims.h

        if (resizeHandle.includes('e')) newW = Math.max(20, initialDims.w + dx)
        if (resizeHandle.includes('s')) newH = Math.max(20, initialDims.h + dy)
        if (resizeHandle.includes('w')) {
          const deltaW = Math.min(initialDims.w - 20, dx)
          newX = initialDims.x + deltaW
          newW = initialDims.w - deltaW
        }
        if (resizeHandle.includes('n')) {
          const deltaH = Math.min(initialDims.h - 20, dy)
          newY = initialDims.y + deltaH
          newH = initialDims.h - deltaH
        }

        onChange(element.id, { x: newX, y: newY, width: newW, height: newH })
      }
    }

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e) => {
      // Prevent scrolling while dragging/resizing
      if (isDragging || isResizing) {
        e.preventDefault() 
      }
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    const handleEnd = () => {
      if (isDragging && onDragEnd) onDragEnd()
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
    }

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, isResizing, dragStart, initialDims, canvasScale, element.id, onChange, resizeHandle, onDragEnd])

  const style = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    zIndex: element.zIndex || 1,
    transform: `rotate(${element.rotation || 0}deg)`,
    // backgroundColor handled in renderContent for shapes
    border: isSelected ? '1px dashed #3b82f6' : 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none'
  }

  const renderContent = () => {
    if (element.type === 'text') {
      if (isEditing) {
        return (
          <textarea
            autoFocus
            value={element.content}
            onChange={(e) => onChange(element.id, { content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              fontSize: `${element.fontSize}px`,
              color: element.color,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              textAlign: element.textAlign,
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              padding: 0,
              margin: 0,
              lineHeight: element.lineHeight || 1.2,
              overflow: 'hidden'
            }}
          />
        )
      }

      return (
        <div style={{
          fontSize: `${element.fontSize}px`,
          color: element.color,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          fontStyle: element.fontStyle,
          textDecoration: element.textDecoration,
          textAlign: element.textAlign,
          width: '100%',
          height: '100%',
          whiteSpace: 'pre-wrap',
          lineHeight: element.lineHeight || 1.2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: element.textAlign === 'center' ? 'center' : (element.textAlign === 'right' ? 'flex-end' : 'flex-start'),
          justifyContent: 'center', // Always center vertically within the box
        }}>
          {element.content}
        </div>
      )
    }

    if (element.type === 'image') {
      // Basic filters
      const filterString = `
        brightness(${element.brightness || 100}%) 
        contrast(${element.contrast || 100}%) 
        saturate(${element.saturate || 100}%) 
        hue-rotate(${element.hueRotate || 0}deg) 
        blur(${element.blur || 0}px) 
        sepia(${element.sepia || 0}%) 
        grayscale(${element.grayscale || 0}%)
        invert(${element.invert || 0}%)
      `.trim()
      
      const sharpnessId = `sharpness-${element.id}`
      const isPolaroid = element.options?.isPolaroid;
      const polaroidPadding = element.options?.polaroidPadding || 12;
      const hasTape = element.options?.hasTape;

      // Handle opacity normalization (0-1 or 0-100)
      let opacityValue = element.opacity !== undefined ? element.opacity : 100;
      if (opacityValue <= 1 && opacityValue > 0 && element.type === 'drawing') {
        // Drawing often uses 0-1
        opacityValue = opacityValue * 100;
      }

      const imageContent = (
        <>
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id={sharpnessId}>
                {element.sharpness > 0 ? (
                  <feConvolveMatrix 
                    order="3" 
                    kernelMatrix={`0 -${element.sharpness/100} 0 -${element.sharpness/100} ${1 + 4*(element.sharpness/100)} -${element.sharpness/100} 0 -${element.sharpness/100} 0`} 
                  />
                ) : (
                  <feColorMatrix type="identity"/>
                )}
              </filter>
            </defs>
          </svg>

          <img 
            src={element.src} 
            alt="Image" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              pointerEvents: 'none',
              filter: `${filterString} url(#${sharpnessId})`
            }} 
          />
          
          {element.temperature !== 0 && element.temperature != null && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              pointerEvents: 'none',
              backgroundColor: element.temperature > 0 ? '#ff9a00' : '#009aff',
              opacity: Math.abs(element.temperature) / 200,
              mixBlendMode: element.temperature > 0 ? 'soft-light' : 'overlay'
            }} />
          )}

          {element.vignette > 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              pointerEvents: 'none',
              background: `radial-gradient(circle, transparent ${100 - element.vignette}%, rgba(0,0,0,${element.vignette / 100}) 100%)`
            }} />
          )}

          {element.noise > 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              pointerEvents: 'none',
              opacity: element.noise / 100,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }} />
          )}
        </>
      );

      if (isPolaroid) {
        return (
          <div style={{ 
            width: '100%', height: '100%', position: 'relative',
            backgroundColor: '#ffffff',
            padding: `${polaroidPadding}px ${polaroidPadding}px ${polaroidPadding * 3}px ${polaroidPadding}px`,
            boxSizing: 'border-box',
            boxShadow: '2px 4px 10px rgba(0,0,0,0.2)',
            opacity: opacityValue / 100,
          }}>
            {hasTape && (
              <div style={{
                position: 'absolute', top: '-10px', left: '50%', width: '30%', height: '25px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                transform: 'translateX(-50%) rotate(2deg)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                zIndex: 25,
              }} />
            )}
            {imageContent}
          </div>
        )
      }

      return (
        <div style={{ 
          width: '100%', height: '100%', position: 'relative',
          clipPath: element.options?.clipPath || 'none',
          mixBlendMode: element.options?.mixBlendMode || 'normal',
          opacity: opacityValue / 100,
        }}>
          {imageContent}
        </div>
      )
    }

    if (element.type === 'drawing') {
      const viewBoxW = element.originalWidth || element.width
      const viewBoxH = element.originalHeight || element.height
      
      let opacityValue = element.opacity !== undefined ? element.opacity : 100;
      // Handle 0-1 range for drawings
      if (opacityValue <= 1 && opacityValue > 0) {
        opacityValue = opacityValue * 100;
      }

      return (
        <div style={{ width: '100%', height: '100%', opacity: opacityValue / 100 }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} style={{ overflow: 'visible' }}>
            <path
              d={element.path}
              stroke={element.stroke}
              strokeWidth={element.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )
    }

    if (element.type === 'shape') {
      let opacityValue = element.opacity !== undefined ? element.opacity : 100;
      if (opacityValue <= 1 && opacityValue > 0) opacityValue = opacityValue * 100;

      const commonStyle = {
        width: '100%',
        height: '100%',
        opacity: opacityValue / 100,
        mixBlendMode: element.options?.mixBlendMode || 'normal',
      }

      if (element.shapeType === 'line') {
        return (
          <div style={{ ...commonStyle, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: `${element.strokeWidth}px`, backgroundColor: element.stroke }} />
          </div>
        )
      }
      
      if (element.shapeType === 'arrow') {
        return (
          <div style={commonStyle}>
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <marker
                  id={`arrowhead-${element.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill={element.stroke} />
                </marker>
              </defs>
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                markerEnd={`url(#arrowhead-${element.id})`}
              />
            </svg>
          </div>
        )
      }

      const shapeStyle = {
        ...commonStyle,
        backgroundColor: element.fill || 'transparent',
        border: element.options?.stroke ? `${element.options.strokeWidth || 1}px solid ${element.options.stroke}` : 'none',
        boxSizing: 'border-box',
        clipPath: element.options?.clipPath || 'none',
        filter: element.options?.filter || 'none',
        borderRadius: element.options?.borderRadius || 0,
      }

      if (element.shapeType === 'circle') {
        shapeStyle.borderRadius = '50%'
      } else if (element.shapeType === 'triangle') {
        shapeStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
      } else if (element.shapeType === 'star') {
        shapeStyle.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
      }

      return <div style={shapeStyle} />
    }

    return null
  }

  return (
    <div
      ref={elementRef}
      className={`draggable-element ${isSelected ? 'selected' : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ 
        width: '100%', 
        height: '100%', 
        transform: `scaleX(${element.scaleX || 1}) scaleY(${element.scaleY || 1})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderContent()}
      </div>
      
      {isSelected && !isEditing && (
        <>
          <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} onTouchStart={(e) => handleResizeStart(e, 'nw')} />
          <div className="resize-handle n" onMouseDown={(e) => handleResizeStart(e, 'n')} onTouchStart={(e) => handleResizeStart(e, 'n')} />
          <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} onTouchStart={(e) => handleResizeStart(e, 'ne')} />
          <div className="resize-handle w" onMouseDown={(e) => handleResizeStart(e, 'w')} onTouchStart={(e) => handleResizeStart(e, 'w')} />
          <div className="resize-handle e" onMouseDown={(e) => handleResizeStart(e, 'e')} onTouchStart={(e) => handleResizeStart(e, 'e')} />
          <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} onTouchStart={(e) => handleResizeStart(e, 'sw')} />
          <div className="resize-handle s" onMouseDown={(e) => handleResizeStart(e, 's')} onTouchStart={(e) => handleResizeStart(e, 's')} />
          <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')} onTouchStart={(e) => handleResizeStart(e, 'se')} />
          {/* Rotation handle could be added here */}
        </>
      )}
    </div>
  )
}