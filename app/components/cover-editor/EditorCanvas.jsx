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
  const [activeGuides, setActiveGuides] = useState([]) // Array of { type: 'horizontal'|'vertical', pos: number }

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

  // Snapping Logic
  const handleSnap = (id, updates) => {
    if (!updates || (updates.x === undefined && updates.y === undefined)) {
      // Not a position update
      setDragEnd()
      return updates
    }
    
    // If multiple items select/moved, snapping might be complex. Assuming single select drag.
    const element = elements.find(el => el.id === id)
    if (!element) return updates

    const { width: startWidth, height: startHeight } = element
    const x = updates.x !== undefined ? updates.x : element.x
    const y = updates.y !== undefined ? updates.y : element.y
    const w = updates.width !== undefined ? updates.width : startWidth
    const h = updates.height !== undefined ? updates.height : startHeight

    const SNAP_THRESHOLD = 10
    const guides = []
    
    let newX = x
    let newY = y

    // Centers
    const centerX = x + w / 2
    const centerY = y + h / 2
    
    // Canvas Centers
    const canvasW = canvasSettings?.width || 800
    const canvasH = canvasSettings?.height || 1000
    
    const canvasCenterX = canvasW / 2
    const canvasCenterY = canvasH / 2

    // Snap Horizontal (Vertical Line)
    if (Math.abs(centerX - canvasCenterX) < SNAP_THRESHOLD) {
      newX = canvasCenterX - w / 2
      guides.push({ type: 'vertical', pos: canvasCenterX })
    } else if (Math.abs(x - 0) < SNAP_THRESHOLD) {
         newX = 0
         guides.push({ type: 'vertical', pos: 0 })
    } else if (Math.abs(x + w - canvasW) < SNAP_THRESHOLD) {
         newX = canvasW - w
         guides.push({ type: 'vertical', pos: canvasW })
    } else {
        // Snap to other elements
        for (const el of elements) {
            if (el.id === id) continue
            const elCenterX = el.x + el.width / 2
            // Center to Center
            if (Math.abs(centerX - elCenterX) < SNAP_THRESHOLD) {
                newX = elCenterX - w / 2
                guides.push({ type: 'vertical', pos: elCenterX })
                break
            }
            // Edges logic could be added here
        }
    }

    // Snap Vertical (Horizontal Line)
    if (Math.abs(centerY - canvasCenterY) < SNAP_THRESHOLD) {
      newY = canvasCenterY - h / 2
      guides.push({ type: 'horizontal', pos: canvasCenterY })
    } else if (Math.abs(y - 0) < SNAP_THRESHOLD) {
         newY = 0
         guides.push({ type: 'horizontal', pos: 0 })
    } else if (Math.abs(y + h - canvasH) < SNAP_THRESHOLD) {
         newY = canvasH - h
         guides.push({ type: 'horizontal', pos: canvasH })
    } else {
        // Snap to other elements
        for (const el of elements) {
            if (el.id === id) continue
            const elCenterY = el.y + el.height / 2
            if (Math.abs(centerY - elCenterY) < SNAP_THRESHOLD) {
                newY = elCenterY - h / 2
                guides.push({ type: 'horizontal', pos: elCenterY })
                break
            }
        }
    }
    
    setActiveGuides(guides)
    return { ...updates, x: newX, y: newY }
  }

  const setDragEnd = () => {
    setActiveGuides([])
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
          // Support for grid/graph paper pattern
          ...(canvasSettings?.backgroundPattern === 'grid' && {
            backgroundImage: `
              linear-gradient(${canvasSettings?.gridColor || '#e0e0e0'} 1px, transparent 1px),
              linear-gradient(90deg, ${canvasSettings?.gridColor || '#e0e0e0'} 1px, transparent 1px)
            `,
            backgroundSize: `${canvasSettings?.gridSize || 30}px ${canvasSettings?.gridSize || 30}px`,
          }),
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
            onChange={(id, updates) => {
               // Intercept updates for snapping
               const snappedUpdates = handleSnap(id, updates)
               onUpdate(id, snappedUpdates)
            }}
            onDelete={() => onUpdate(el.id, null, 'delete')}
            onDragStart={() => {
                // Drag start logic if needed
            }}
            onDragEnd={() => setDragEnd()}
            isLocked={isDrawMode && drawingTool.type !== 'eraser'} // Lock elements while drawing (except eraser)
            isEraserActive={isDrawMode && drawingTool.type === 'eraser'}
            canvasScale={zoomLevel}
          />
        ))}
        
        {/* Alignment Guides */}
        {activeGuides.map((guide, i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    left: guide.type === 'vertical' ? guide.pos : 0,
                    top: guide.type === 'horizontal' ? guide.pos : 0,
                    width: guide.type === 'vertical' ? 1 : '100%',
                    height: guide.type === 'horizontal' ? 1 : '100%',
                    backgroundColor: '#ec4899', // Pink guide line
                    zIndex: 9999,
                    pointerEvents: 'none',
                    boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
                }}
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