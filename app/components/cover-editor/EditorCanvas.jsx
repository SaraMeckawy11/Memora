'use client'
import { useRef, useState } from 'react'
import DraggableElement from './DraggableElement'
import '@/styles/cover-editor/canvas.css'

export default function EditorCanvas({ 
  elements, 
  selectedId, 
  onSelect, 
  onUpdate, 
  isDrawMode, 
  onAddDrawing,
  canvasSettings,
  drawingTool,
  zoomLevel = 1
}) {
  const canvasRef = useRef(null)
  const [currentPath, setCurrentPath] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    // Adjust for zoom level
    return {
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel
    }
  }

  const handleMouseDown = (e) => {
    if (isDrawMode) {
      setIsDrawing(true)
      const pos = getMousePos(e)
      setCurrentPath([{ x: pos.x, y: pos.y }])
    } else if (e.target === canvasRef.current) {
      onSelect(null)
    }
  }

  const handleMouseMove = (e) => {
    if (isDrawMode && isDrawing) {
      const pos = getMousePos(e)
      setCurrentPath(prev => [...prev, { x: pos.x, y: pos.y }])
    }
  }

  const handleMouseUp = () => {
    if (isDrawMode && isDrawing) {
      setIsDrawing(false)
      if (currentPath.length > 1) {
        // Convert path to SVG path string
        const d = `M ${currentPath.map(p => `${p.x} ${p.y}`).join(' L ')}`
        
        // Calculate bounding box to normalize coordinates
        const xs = currentPath.map(p => p.x)
        const ys = currentPath.map(p => p.y)
        const minX = Math.min(...xs)
        const minY = Math.min(...ys)
        const maxX = Math.max(...xs)
        const maxY = Math.max(...ys)
        const width = maxX - minX
        const height = maxY - minY

        // Normalize path relative to 0,0
        const normalizedPath = currentPath.map(p => ({ x: p.x - minX, y: p.y - minY }))
        const normalizedD = `M ${normalizedPath.map(p => `${p.x} ${p.y}`).join(' L ')}`

        onAddDrawing({
          type: 'drawing',
          path: normalizedD,
          x: minX,
          y: minY,
          width: width || 10, // Prevent 0 width
          height: height || 10,
          originalWidth: width || 10, // Store original dimensions for scaling
          originalHeight: height || 10,
          stroke: drawingTool.stroke || drawingTool.color || '#000000',
          strokeWidth: drawingTool.strokeWidth || drawingTool.width || 3,
          opacity: drawingTool.opacity || 1,
          fill: 'transparent'
        })
      }
      setCurrentPath([])
    }
  }

  // Touch Handlers for Drawing
  const handleTouchStart = (e) => {
    if (isDrawMode) {
      e.preventDefault() // Prevent scrolling while drawing
      setIsDrawing(true)
      const touch = e.touches[0]
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (touch.clientX - rect.left) / zoomLevel
      const y = (touch.clientY - rect.top) / zoomLevel
      setCurrentPath([{ x, y }])
    } else if (e.target === canvasRef.current) {
      onSelect(null)
    }
  }

  const handleTouchMove = (e) => {
    if (isDrawMode && isDrawing) {
      e.preventDefault() // Prevent scrolling
      const touch = e.touches[0]
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (touch.clientX - rect.left) / zoomLevel
      const y = (touch.clientY - rect.top) / zoomLevel
      setCurrentPath(prev => [...prev, { x, y }])
    }
  }

  const handleTouchEnd = (e) => {
    if (isDrawMode && isDrawing) {
      e.preventDefault()
      handleMouseUp()
    }
  }

  const width = canvasSettings?.width || 800
  const height = canvasSettings?.height || 1000
  
  // Calculate container size to accommodate the scaled canvas
  // Using top-left origin ensures the element takes up the correct layout space for scrolling
  const scaledWidth = width * zoomLevel
  const scaledHeight = height * zoomLevel

  const containerStyle = {
    width: scaledWidth,
    height: scaledHeight,
    // Center the container in the wrapper if it's smaller than the viewport
    margin: 'auto',
    // Ensure it doesn't shrink
    flexShrink: 0,
    // Reset conflicting CSS
    display: 'block',
    minWidth: 0,
    minHeight: 0
  }

  return (
    <div className="canvas-container" style={containerStyle}>
      <div 
        ref={canvasRef}
        className={`editor-canvas ${isDrawMode ? 'draw-cursor' : ''}`}
        style={{
          width: width,
          height: height,
          backgroundColor: canvasSettings?.backgroundColor || '#ffffff',
          transform: `scale(${zoomLevel})`,
          transformOrigin: '0 0', // Top Left origin prevents clipping issues
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {elements.map(el => (
          <DraggableElement
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            onSelect={onSelect}
            onChange={onUpdate}
            onDelete={() => onUpdate(el.id, null, 'delete')}
            isLocked={isDrawMode && drawingTool.type !== 'eraser'} // Lock elements while drawing (except eraser)
            isEraserActive={isDrawMode && drawingTool.type === 'eraser'}
            canvasScale={zoomLevel}
          />
        ))}
        
        {/* Current drawing path */}
        {isDrawing && currentPath.length > 0 && (
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
            <path
              d={`M ${currentPath.map(p => `${p.x} ${p.y}`).join(' L ')}`}
              stroke={drawingTool?.color || "#000000"}
              strokeWidth={drawingTool?.width || 3}
              strokeOpacity={drawingTool?.opacity || 1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  )
}