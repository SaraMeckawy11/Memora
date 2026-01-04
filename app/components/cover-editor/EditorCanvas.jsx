'use client'
import { useRef, useState, useEffect } from 'react'
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
  zoomLevel = 1,
  onZoomChange,
  onDrawingStart,
  onDrawingEnd
}) {
  const canvasRef = useRef(null)
  const [currentPath, setCurrentPath] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)

  // Ref to track gesture state (Pan & Zoom)
  const gestureRef = useRef({
    isPanning: false,
    startDist: 0,
    startZoom: 1,
    startPan: { x: 0, y: 0 },
    startScroll: { left: 0, top: 0 }
  })

  // Ref to hold current props for event handlers
  const stateRef = useRef({
    isDrawMode,
    zoomLevel,
    drawingTool,
    isDrawing,
    currentPath,
    onZoomChange,
    onDrawingStart,
    onDrawingEnd
  })

  // Update stateRef whenever props change
  useEffect(() => {
    stateRef.current = { isDrawMode, zoomLevel, drawingTool, isDrawing, currentPath, onZoomChange, onDrawingStart, onDrawingEnd }
  }, [isDrawMode, zoomLevel, drawingTool, isDrawing, currentPath, onZoomChange, onDrawingStart, onDrawingEnd])

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    // Adjust for zoom level
    return {
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel
    }
  }

  // --- Mouse Handlers (Desktop) ---
  const handleMouseDown = (e) => {
    if (isDrawMode) {
      setIsDrawing(true)
      if (onDrawingStart) onDrawingStart()
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
      if (onDrawingEnd) onDrawingEnd()
      finishDrawing()
    }
  }

  const finishDrawing = () => {
    // Use the path from ref if available, otherwise fallback to state
    const path = stateRef.current.currentPath.length > 0 ? stateRef.current.currentPath : currentPath
    
    if (path.length > 1) {
      // Convert path to SVG path string
      const d = `M ${path.map(p => `${p.x} ${p.y}`).join(' L ')}`
      
      // Calculate bounding box to normalize coordinates
      const xs = path.map(p => p.x)
      const ys = path.map(p => p.y)
      const minX = Math.min(...xs)
      const minY = Math.min(...ys)
      const maxX = Math.max(...xs)
      const maxY = Math.max(...ys)
      const width = maxX - minX
      const height = maxY - minY

      // Normalize path relative to 0,0
      const normalizedPath = path.map(p => ({ x: p.x - minX, y: p.y - minY }))
      const normalizedD = `M ${normalizedPath.map(p => `${p.x} ${p.y}`).join(' L ')}`

      // Get latest tool settings from ref
      const tool = stateRef.current.drawingTool

      onAddDrawing({
        type: 'drawing',
        path: normalizedD,
        x: minX,
        y: minY,
        width: width || 10, // Prevent 0 width
        height: height || 10,
        originalWidth: width || 10, // Store original dimensions for scaling
        originalHeight: height || 10,
        stroke: tool.stroke || tool.color || '#000000',
        strokeWidth: tool.strokeWidth || tool.width || 3,
        opacity: tool.opacity || 1,
        fill: 'transparent'
      })
    }
    setCurrentPath([])
  }

  // --- Touch & Wheel Handlers (Attached via Ref for non-passive control) ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onTouchStart = (e) => {
      const { isDrawMode, zoomLevel, drawingTool, onDrawingStart } = stateRef.current
      
      // Handle 2-finger pan/zoom (Works in both Draw and Cursor modes)
      if (e.touches.length === 2) {
        // Prevent default to stop browser native zoom/scroll
        if (e.cancelable) e.preventDefault()
        
        setIsDrawing(false)
        setCurrentPath([]) // Clear any accidental drawing
        
        const t1 = e.touches[0]
        const t2 = e.touches[1]
        
        // Calculate distance for zoom
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
        
        // Calculate center for pan
        const cx = (t1.clientX + t2.clientX) / 2
        const cy = (t1.clientY + t2.clientY) / 2
        
        const wrapper = canvas.closest('.canvas-wrapper')
        
        gestureRef.current = {
          isPanning: true,
          startDist: dist,
          startZoom: zoomLevel,
          startPan: { x: cx, y: cy },
          startScroll: { 
            left: wrapper ? wrapper.scrollLeft : 0, 
            top: wrapper ? wrapper.scrollTop : 0 
          }
        }
        return
      }

      if (isDrawMode) {
        // If Eraser, don't start drawing path. Let the event bubble to elements.
        if (drawingTool.type === 'eraser') return

        // If more than 2 fingers, ignore
        if (e.touches.length > 2) return

        // 1 finger = Draw
        // IMPORTANT: Prevent default to stop browser scrolling/refresh
        if (e.cancelable) e.preventDefault() 
        
        setIsDrawing(true)
        if (onDrawingStart) onDrawingStart()
        const touch = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        const x = (touch.clientX - rect.left) / zoomLevel
        const y = (touch.clientY - rect.top) / zoomLevel
        setCurrentPath([{ x, y }])
      } else if (e.target === canvas) {
        onSelect(null)
      }
    }

    const onTouchMove = (e) => {
      const { isDrawMode, zoomLevel, isDrawing, onZoomChange } = stateRef.current

      // Handle 2-finger pan/zoom
      if (e.touches.length === 2) {
        if (e.cancelable) e.preventDefault() // Prevent browser gestures
        
        const t1 = e.touches[0]
        const t2 = e.touches[1]
        
        // 1. Handle Pan
        const cx = (t1.clientX + t2.clientX) / 2
        const cy = (t1.clientY + t2.clientY) / 2
        
        const dx = cx - gestureRef.current.startPan.x
        const dy = cy - gestureRef.current.startPan.y
        
        const wrapper = canvas.closest('.canvas-wrapper')
        if (wrapper && gestureRef.current.isPanning) {
          // Apply 1:1 movement (Natural scrolling)
          wrapper.scrollLeft = gestureRef.current.startScroll.left - dx
          wrapper.scrollTop = gestureRef.current.startScroll.top - dy
        }
        
        // 2. Handle Zoom (if onZoomChange provided)
        if (onZoomChange && gestureRef.current.startDist > 0) {
          const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
          const rawScale = dist / gestureRef.current.startDist
          // Apply a slight multiplier for responsiveness, but keep it controlled
          const scale = 1 + (rawScale - 1) * 1.5
          
          const newZoom = Math.min(Math.max(gestureRef.current.startZoom * scale, 0.2), 3)
          onZoomChange(newZoom)
        }
        
        return
      }

      if (isDrawMode && isDrawing) {
        // If user adds a second finger, stop drawing
        if (e.touches.length > 1) {
          setIsDrawing(false)
          setCurrentPath([])
          return
        }

        if (e.cancelable) e.preventDefault()
        const touch = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        const x = (touch.clientX - rect.left) / zoomLevel
        const y = (touch.clientY - rect.top) / zoomLevel
        setCurrentPath(prev => [...prev, { x, y }])
      }
    }

    const onTouchEnd = (e) => {
      const { isDrawMode, isDrawing, onDrawingEnd } = stateRef.current
      
      if (isDrawMode) {
        if (isDrawing) {
          if (e.cancelable) e.preventDefault()
          setIsDrawing(false)
          if (onDrawingEnd) onDrawingEnd()
          finishDrawing()
        }
      }
      // Reset gesture if fingers lifted
      if (e.touches.length < 2) {
        gestureRef.current.isPanning = false
      }
    }

    // Attach listeners with { passive: false } to allow preventDefault
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [onAddDrawing]) // Re-bind only if callbacks change

  // ...existing code...

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