'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import EditorSidebar from '@/app/components/cover-editor/EditorSidebar'
import EditorCanvas from '@/app/components/cover-editor/EditorCanvas'
import EditorToolbar from '@/app/components/cover-editor/EditorToolbar'
import FontLoader from '@/app/components/cover-editor/FontLoader'

// Hooks
import { useCanvasState } from './hooks/useCanvasState'
import { useZoomPan } from './hooks/useZoomPan'
import { useExport } from './hooks/useExport'
import { useElementOperations } from './hooks/useElementOperations'
import { useProjectPersistence } from './hooks/useProjectPersistence'

// Styles
import '@/styles/cover-editor/layout.css'

export default function CoverEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wrapperRef = useRef(null)

  // -- UI STATE --
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawMode, setIsDrawMode] = useState(false)
  const [drawingTool, setDrawingTool] = useState({ type: 'pen', color: '#000000', width: 10, opacity: 1 })
  const [isInteractingWithCanvas, setIsInteractingWithCanvas] = useState(false)
  const [canvasSettings, setCanvasSettings] = useState({
    width: 893, height: 1263, sizeName: 'A4', orientation: 'portrait'
  })

  // -- CANVAS ENGINE HOOKS --
  const { 
    elements, backgroundColor, setElements, setBackgroundColor,
    handleUndo, handleRedo, historyIndex, historyLength, updateState, currentState 
  } = useCanvasState(searchParams, canvasSettings, setCanvasSettings);

  const {
    zoomLevel, handleZoom, handleZoomToFit, setIsAutoFitMode, handleManualZoomChange,
    handleMouseDown, handleMouseMove, handleMouseUp
  } = useZoomPan(wrapperRef, canvasSettings, searchParams);

  const {
    isExporting, isDownloadMenuOpen, setIsDownloadMenuOpen, handleDownload
  } = useExport(selectedId, setSelectedId, backgroundColor);

  const {
    addElement, updateElement, reorder
  } = useElementOperations(elements, setElements, setSelectedId);

  const { 
    handleSaveProject, handleLoadProject 
  } = useProjectPersistence(elements, backgroundColor, canvasSettings, updateState, setCanvasSettings);

  // -- HANDLERS --
  const handleBack = () => router.back();
  const handleSave = () => router.push('/create?step=editor');

  const handleReorderElement = (direction) => {
    if (selectedId) reorder(selectedId, direction);
  };

  // Close download dropdown on outside click
  useEffect(() => {
    const closeMenu = (e) => {
      if (isDownloadMenuOpen && !e.target.closest('.download-dropdown-container')) {
        setIsDownloadMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [isDownloadMenuOpen])

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div className="cover-editor-root">
      <FontLoader />
      <EditorSidebar 
        onAddElement={addElement} 
        isDrawMode={isDrawMode}
        onToggleDrawMode={(force) => {
          if (typeof force === 'boolean') setIsDrawMode(force)
          else setIsDrawMode(!isDrawMode)
        }}
        canvasSettings={canvasSettings}
        onUpdateCanvas={(newSettings) => {
          setCanvasSettings(newSettings);
        }}
        drawingTool={drawingTool}
        onUpdateDrawingTool={setDrawingTool}
        selectedElement={selectedElement}
        isInteractingWithCanvas={isInteractingWithCanvas}
      />
      
      <div className="editor-main">
        <div className="editor-header">
          <h3>Cover Editor</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="toolbar-btn" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">↩</button>
            <button className="toolbar-btn" onClick={handleRedo} disabled={historyIndex >= historyLength - 1} title="Redo">↪</button>
            
            <div className="download-dropdown-container" style={{ position: 'relative' }}>
              <button 
                className="save-btn secondary"
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                disabled={isExporting}
                style={{ padding: '6px 12px', fontSize: '13px', background: '#f1f5f9', color: '#334155', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                {isExporting ? 'Saving...' : 'Download'}
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>

              {isDownloadMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 200, minWidth: '140px', display: 'flex', flexDirection: 'column', padding: '4px' }}>
                  <button onClick={() => handleDownload('png')} className="dropdown-item">Download PNG</button>
                  <button onClick={() => handleDownload('jpeg')} className="dropdown-item">Download JPG</button>
                  <button onClick={() => handleDownload('pdf')} className="dropdown-item">Download PDF</button>
                </div>
              )}
            </div>

            <button className="save-btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', marginRight: '8px' }} onClick={handleBack}>Back</button>
            <button className="save-btn" onClick={handleSave}>Done</button>
          </div>
        </div>
        
        <div 
          className={`canvas-wrapper ${isDrawMode ? 'draw-mode' : ''}`}
          ref={wrapperRef}
          onMouseDown={(e) => handleMouseDown(e, isDrawMode)}
          onMouseMove={(e) => handleMouseMove(e, isDrawMode)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <EditorCanvas 
            elements={elements} 
            selectedId={selectedId} 
            onSelect={setSelectedId}
            onUpdate={updateElement}
            isDrawMode={isDrawMode}
            onAddDrawing={(drawing) => addElement('drawing', drawing)}
            canvasSettings={canvasSettings}
            drawingTool={drawingTool}
            zoomLevel={zoomLevel}
            onZoomChange={handleManualZoomChange}
            onDrawingStart={() => setIsInteractingWithCanvas(true)}
            onDrawingEnd={() => setIsInteractingWithCanvas(false)}
          />
        </div>

        <div className="zoom-controls">
          <button className="zoom-fit-btn" onClick={() => { setIsAutoFitMode(true); handleZoomToFit(true); }}>FIT</button>
          <div className="zoom-divider" />
          <button className="zoom-btn" onClick={() => handleZoom(0.1)}>+</button>
          <div className="zoom-value">{Math.round(zoomLevel * 100)}%</div>
          <button className="zoom-btn" onClick={() => handleZoom(-0.1)}>-</button>
        </div>
      </div>

      {!isDrawMode && selectedElement && (
        <EditorToolbar 
          selectedElement={selectedElement} 
          onUpdate={(updates, action) => updateElement(selectedId, updates, action)} 
          onReorder={handleReorderElement}
          onClose={() => setSelectedId(null)}
        />
      )}

      <style jsx>{`
        .dropdown-item {
          text-align: left; 
          padding: 8px 12px; 
          background: none; 
          border: none; 
          cursor: pointer; 
          borderRadius: 4px; 
          font-size: 13px; 
          color: #334155;
        }
        .dropdown-item:hover {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  )
}
