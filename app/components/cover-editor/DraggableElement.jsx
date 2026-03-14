'use client'
import { useState, useEffect, useRef } from 'react'
import '@/styles/cover-editor/canvas.css'
import { TextElement } from './draggable-components/TextElement'
import { ImageElement } from './draggable-components/ImageElement'
import { ShapeElement } from './draggable-components/ShapeElement'
import { DrawingElement } from './draggable-components/DrawingElement'
import { ResizeHandleOverlay } from './draggable-components/ResizeHandleOverlay'

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
  
  // Local state for smooth dragging without history spam
  const [localTransform, setLocalTransform] = useState(null) 

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
    
    // Initialize local transform
    setLocalTransform({ x: element.x, y: element.y, width: element.width, height: element.height })
    
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialDims({ x: element.x, y: element.y, w: element.width, h: element.height })
    if (onDragStart) onDragStart()
  }

  const handleTouchStart = (e) => {
    // Multi-touch Support: Allow 2-finger gestures to bubble up for pan/zoom
    if (e.touches && e.touches.length > 1) return;

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
    
    // Initialize local transform
    setLocalTransform({ x: element.x, y: element.y, width: element.width, height: element.height })

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
    if (onDragStart) onDragStart()
    setResizeHandle(handle)
     
    // Initialize local transform
    setLocalTransform({ x: element.x, y: element.y, width: element.width, height: element.height })
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX, y: clientY })
    setInitialDims({ x: element.x, y: element.y, w: element.width, h: element.height })
  }

  // Ref to hold the latest local transform for access in handleEnd
  const latestTransformRef = useRef(null)
  useEffect(() => {
    latestTransformRef.current = localTransform
  }, [localTransform])

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging && !isResizing) return

      const dx = (clientX - dragStart.x) / canvasScale
      const dy = (clientY - dragStart.y) / canvasScale

      if (isDragging) {
        setLocalTransform({
          x: initialDims.x + dx,
          y: initialDims.y + dy,
          width: initialDims.w,
          height: initialDims.h
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

        setLocalTransform({ x: newX, y: newY, width: newW, height: newH })
      }
    }

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 1) { handleEnd(); return; }
      if (isDragging || isResizing) { if (e.cancelable) e.preventDefault(); }
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    const handleEnd = () => {
      // Trigger drag end callback if we were dragging OR resizing
      if ((isDragging || isResizing) && onDragEnd) onDragEnd()
      
      // Commit final change to history
      if (latestTransformRef.current) {
        onChange(element.id, latestTransformRef.current)
      }

      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
      setLocalTransform(null)
      latestTransformRef.current = null
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
  }, [isDragging, isResizing, dragStart, initialDims, canvasScale, element.id, onChange, resizeHandle, onDragEnd, localTransform])

  const effectiveElement = localTransform ? { ...element, ...localTransform } : element

  const style = {
    left: `${effectiveElement.x}px`,
    top: `${effectiveElement.y}px`,
    width: `${effectiveElement.width}px`,
    height: `${effectiveElement.height}px`,
    zIndex: element.zIndex || 1,
    transform: `rotate(${element.rotation || 0}deg)`,
    // backgroundColor handled in component for shapes
    border: isSelected ? '1px dashed #3b82f6' : 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none'
  }

  const renderContent = () => {
    switch (effectiveElement.type) {
      case 'text':
        return (
          <TextElement 
            element={effectiveElement} 
            isEditing={isEditing} 
            onChange={onChange}
            setIsEditing={setIsEditing}
          />
        )
      case 'image':
        return <ImageElement element={effectiveElement} />
      case 'shape':
        return <ShapeElement element={effectiveElement} />
      case 'drawing':
        return <DrawingElement element={effectiveElement} />
      default:
        return null
    }
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
        transform: `scaleX(${effectiveElement.scaleX || 1}) scaleY(${effectiveElement.scaleY || 1})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderContent()}
      </div>
      
      <ResizeHandleOverlay 
        isSelected={isSelected}
        isEditing={isEditing}
        onDelete={onDelete}
        onResizeStart={handleResizeStart}
      />
    </div>
  )
}
