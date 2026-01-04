'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import EditorSidebar from './EditorSidebar'
import EditorCanvas from './EditorCanvas'
import EditorToolbar from './EditorToolbar'
import FontLoader from './FontLoader'
import '@/styles/cover-editor/layout.css'

export default function CoverEditor() {
  const router = useRouter()
  const wrapperRef = useRef(null)
  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawMode, setIsDrawMode] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 })
  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: '#ffffff',
    width: 800,
    height: 1000
  })
  const [drawingTool, setDrawingTool] = useState({
    type: 'pen', // pen, marker, highlighter
    color: '#000000',
    width: 10,
    opacity: 1
  })
  const [zoomLevel, setZoomLevel] = useState(1)
  
  // History State
  const [history, setHistory] = useState([[]])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Initialize zoom based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoomLevel(window.innerWidth < 400 ? 0.45 : 0.55)
      } else {
        setZoomLevel(1)
      }
    }
    
    handleResize() // Initial call
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const addToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const handleAddElement = (type, props) => {
    const newElement = {
      id: Date.now(),
      type,
      x: 100,
      y: 100,
      width: props.width || (type === 'text' ? 200 : 100),
      height: props.height || (type === 'text' ? 50 : 100),
      rotation: 0,
      zIndex: elements.length + 1,
      ...props,
      // Defaults
      color: props.color || '#000000',
      fontSize: props.fontSize || 24,
      fontFamily: props.fontFamily || 'Arial',
      fontWeight: props.fontWeight || 'normal',
      textAlign: props.textAlign || 'center',
      fill: props.fill || '#3b82f6',
      stroke: props.stroke || '#000000',
      strokeWidth: props.strokeWidth || 0,
      // Image Filters
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hueRotate: 0,
      blur: 0,
      opacity: 100,
      sepia: 0,
      grayscale: 0,
      vignette: 0
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    addToHistory(newElements)
    setSelectedId(newElement.id)
    
    // Only exit draw mode if we added a non-drawing element
    if (type !== 'drawing') {
      setIsDrawMode(false)
    }
  }

  const handleUpdateElement = (id, updates, action) => {
    // If id is not provided, update selected
    const targetId = id || selectedId

    if (action === 'delete') {
      if (!targetId) return
      const newElements = elements.filter(el => el.id !== targetId)
      setElements(newElements)
      addToHistory(newElements)
      if (selectedId === targetId) setSelectedId(null)
      return
    }

    if (!targetId) return

    const newElements = elements.map(el => 
      el.id === targetId ? { ...el, ...updates } : el
    )
    setElements(newElements)
    addToHistory(newElements)
  }

  const handleReorderElement = (action) => {
    if (!selectedId) return
    
    const currentIndex = elements.findIndex(el => el.id === selectedId)
    if (currentIndex === -1) return

    let newElements = [...elements]
    const element = newElements[currentIndex]

    // Remove element from current position
    newElements.splice(currentIndex, 1)

    if (action === 'front') {
      newElements.push(element)
    } else if (action === 'back') {
      newElements.unshift(element)
    } else if (action === 'forward') {
      const newIndex = Math.min(currentIndex + 1, elements.length - 1)
      newElements.splice(newIndex, 0, element)
    } else if (action === 'backward') {
      const newIndex = Math.max(currentIndex - 1, 0)
      newElements.splice(newIndex, 0, element)
    }

    // Re-assign zIndex based on new order
    newElements = newElements.map((el, index) => ({
      ...el,
      zIndex: index + 1
    }))

    setElements(newElements)
    addToHistory(newElements)
  }

  const handleSave = () => {
    // In a real app, we would export the canvas to an image or JSON
    // For now, we'll just go back
    alert('Cover design saved! (Mock)')
    router.back()
  }

  // Panning Handlers
  const handleMouseDown = (e) => {
    if (isDrawMode) return
    // Only pan if clicking on the wrapper or the canvas background (not elements)
    // We rely on event bubbling. Elements stop propagation, so this only fires for background.
    setIsPanning(true)
    setPanStart({ x: e.clientX, y: e.clientY })
    if (wrapperRef.current) {
      setScrollStart({ 
        left: wrapperRef.current.scrollLeft, 
        top: wrapperRef.current.scrollTop 
      })
    }
  }

  const handleMouseMove = (e) => {
    if (!isPanning || isDrawMode || !wrapperRef.current) return
    e.preventDefault()
    const dx = e.clientX - panStart.x
    const dy = e.clientY - panStart.y
    wrapperRef.current.scrollLeft = scrollStart.left - dx
    wrapperRef.current.scrollTop = scrollStart.top - dy
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div className="cover-editor-root">
      <FontLoader />
      <EditorSidebar 
        onAddElement={handleAddElement} 
        isDrawMode={isDrawMode}
        onToggleDrawMode={() => setIsDrawMode(!isDrawMode)}
        canvasSettings={canvasSettings}
        onUpdateCanvas={setCanvasSettings}
        drawingTool={drawingTool}
        onUpdateDrawingTool={setDrawingTool}
      />
      
      <div className="editor-main">
        <div className="editor-header">
          <h3>Cover Editor</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="toolbar-btn" 
              onClick={handleUndo} 
              disabled={historyIndex <= 0}
              title="Undo"
            >
              ↩
            </button>
            <button 
              className="toolbar-btn" 
              onClick={handleRedo} 
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              ↪
            </button>
            <button className="save-btn" onClick={handleSave}>Save Cover</button>
          </div>
        </div>
        
        <div 
          className={`canvas-wrapper ${isDrawMode ? 'draw-mode' : ''}`}
          ref={wrapperRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <EditorCanvas 
            elements={elements} 
            selectedId={selectedId} 
            onSelect={setSelectedId}
            onUpdate={handleUpdateElement}
            isDrawMode={isDrawMode}
            onAddDrawing={(drawing) => handleAddElement('drawing', drawing)}
            canvasSettings={canvasSettings}
            drawingTool={drawingTool}
            zoomLevel={zoomLevel}
          />
        </div>

        <div className="zoom-controls" style={{
          position: 'absolute',
          bottom: '80px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'white',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <button 
            onClick={() => setZoomLevel(z => Math.min(z + 0.1, 2))}
            style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', fontSize: '18px', cursor: 'pointer' }}
          >
            +
          </button>
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
            {Math.round(zoomLevel * 100)}%
          </div>
          <button 
            onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.2))}
            style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', fontSize: '18px', cursor: 'pointer' }}
          >
            -
          </button>
        </div>
      </div>

      <EditorToolbar 
        selectedElement={selectedElement} 
        onUpdate={(updates, action) => handleUpdateElement(selectedId, updates, action)} 
        onReorder={handleReorderElement}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}