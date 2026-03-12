'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadProject } from '@/app/utils/storage'
import { SIZES } from '@/app/components/setup/SizeSelection'
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

function CoverEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wrapperRef = useRef(null)

  // -- UI STATE --
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawMode, setIsDrawMode] = useState(false)
  const [drawingTool, setDrawingTool] = useState({ type: 'pen', color: '#000000', width: 10, opacity: 1 })
  const [isInteractingWithCanvas, setIsInteractingWithCanvas] = useState(false)
  const [canvasSettings, setCanvasSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDebug, setShowDebug] = useState(true)

  // Hide debug overlay after 3 seconds once loaded
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowDebug(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  // Load layout from create page selection
  useEffect(() => {
    const initLayout = async () => {
      try {
        const project = await loadProject()
        console.log('Cover Editor: Loaded project from DB:', project)
        
        let sizeData = project?.selectedSize
        
        // If stored as ID (number/string), find the full object from SIZES constant
        if (typeof sizeData === 'number' || typeof sizeData === 'string') {
           const found = SIZES.find(s => s.id == sizeData)
           if (found) sizeData = found
        }
        
        if (sizeData && sizeData.width && sizeData.height) {
          console.log('Cover Editor: specific size data:', sizeData)
          const { width, height, name } = sizeData
          // Match standard web DPI (96) used in StepEditor
          const pxScale = 96
          
          setCanvasSettings({
            width: Math.round(width * pxScale),
            height: Math.round(height * pxScale),
            sizeName: name || 'Custom',
            orientation: width > height ? 'landscape' : 'portrait'
          })
        } else {
             console.log('Cover Editor: No valid selectedSize in project, using defaults (A4 Portrait)')
             setCanvasSettings({
                width: 794, height: 1123, sizeName: 'A4', orientation: 'portrait'
             })
        }
      } catch (err) {
        console.error('Failed to load project layout:', err)
        setCanvasSettings({
            width: 794, height: 1123, sizeName: 'A4', orientation: 'portrait'
         })
      } finally {
        setLoading(false)
      }
    }
    initLayout()
  }, [])

  // -- DEBUG OVERLAY --
  const debugInfo = canvasSettings ? 
    `Size: ${canvasSettings.sizeName} (${canvasSettings.width}x${canvasSettings.height})` : 
    'Loading Layout...';


  // -- CANVAS ENGINE HOOKS --
  // Use default or loaded settings. If loading, use default to init hooks but don't render content yet?
  // Actually hook initialization must be unconditional.
  const effectiveCanvasSettings = canvasSettings || { width: 794, height: 1123, sizeName: 'A4', orientation: 'portrait' }

  const { 
    front, back, activeSide, setActiveSide,
    elements, backgroundColor, setElements, setBackgroundColor,
    handleUndo, handleRedo, historyIndex, historyLength, updateState, currentState 
  } = useCanvasState(searchParams, effectiveCanvasSettings, setCanvasSettings);

  const {
    zoomLevel, handleZoom, handleZoomToFit, setIsAutoFitMode, handleManualZoomChange,
    handleMouseDown, handleMouseMove, handleMouseUp, handleWheel
  } = useZoomPan(wrapperRef, effectiveCanvasSettings, searchParams);

  const {
    isExporting, isDownloadMenuOpen, setIsDownloadMenuOpen, handleDownload
  } = useExport(selectedId, setSelectedId, backgroundColor, activeSide);

  const {
    addElement, updateElement, reorder
  } = useElementOperations(elements, setElements, setSelectedId);

  const { 
    handleSaveProject, handleLoadProject 
  } = useProjectPersistence(currentState, effectiveCanvasSettings, updateState, setCanvasSettings);


  // -- HANDLERS --
  const handleBack = () => router.back();
  const handleSave = () => router.push('/create?step=3');

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

  const CoverSwitcher = () => (
    <div className="cover-side-switcher">
      <button 
        className={`switcher-btn ${activeSide === 'back' ? 'active' : ''}`}
        onClick={() => setActiveSide('back')}
      >
        <span>Back<span className="hide-mobile"> Cover</span></span>
      </button>
      <button 
        className={`switcher-btn ${activeSide === 'front' ? 'active' : ''}`}
        onClick={() => setActiveSide('front')}
      >
        <span>Front<span className="hide-mobile"> Cover</span></span>
      </button>
    </div>
  )

  return (
    <div className="cover-editor-root">
      {/* 
         DEBUG OVERLAY: Remove this after confirming layout is correct.
      */}
      <div style={{
          position: 'fixed', 
          top: 60, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '4px 12px', 
          borderRadius: 4, 
          zIndex: 99999, 
          fontSize: 12,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          opacity: showDebug ? 1 : 0,
          transition: 'opacity 0.5s ease-out'
      }}>
        {debugInfo}
      </div>
      <FontLoader />
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>🎨</div>
          <div>Loading your canvas...</div>
        </div>
      ) : (
      <>
      <EditorSidebar 
        onAddElement={addElement} 
        isDrawMode={isDrawMode}
        onToggleDrawMode={(force) => {
          if (typeof force === 'boolean') setIsDrawMode(force)
          else setIsDrawMode(!isDrawMode)
        }}
        canvasSettings={effectiveCanvasSettings}
        onUpdateCanvas={(newSettings) => {
          setCanvasSettings(newSettings);
        }}
        onSetBackgroundColor={setBackgroundColor}
        drawingTool={drawingTool}
        onUpdateDrawingTool={setDrawingTool}
        selectedElement={selectedElement}
        isInteractingWithCanvas={isInteractingWithCanvas}
      />
      
      <div className="editor-main">
        <div className="editor-header">
          <div className="header-left">
            <h3>Cover Editor</h3>
          </div>

          <div className="header-center">
            <CoverSwitcher />
          </div>
          
          <div className="header-right">
            <div className="history-controls">
              <button className="header-icon-btn" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              </button>
              <button className="header-icon-btn" onClick={handleRedo} disabled={historyIndex >= historyLength - 1} title="Redo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"/></svg>
              </button>
            </div>
            
            <div className="header-divider hide-mobile" />

            <div className="download-dropdown-container" style={{ position: 'relative' }}>
              <button 
                className={`header-btn secondary dropdown-trigger ${isDownloadMenuOpen ? 'active' : ''}`}
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                disabled={isExporting}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span className="hide-mobile">{isExporting ? 'Exporting...' : 'Download'}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron ${isDownloadMenuOpen ? 'rotate' : ''}`} style={{ opacity: 0.5 }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {isDownloadMenuOpen && (
                <div className="header-dropdown-menu">
                  <div className="dropdown-label">Download Format</div>
                  <button onClick={() => handleDownload('png')} className="dropdown-item">
                    <span className="file-icon png">P</span>
                    <div className="dropdown-text">
                      <span className="main-text">PNG Image</span>
                      <span className="sub-text">Best for social media</span>
                    </div>
                  </button>
                  <button onClick={() => handleDownload('jpeg')} className="dropdown-item">
                    <span className="file-icon jpg">J</span>
                    <div className="dropdown-text">
                      <span className="main-text">JPG Image</span>
                      <span className="sub-text">Smaller file size</span>
                    </div>
                  </button>
                  <button onClick={() => handleDownload('pdf')} className="dropdown-item">
                    <span className="file-icon pdf">D</span>
                    <div className="dropdown-text">
                      <span className="main-text">PDF Document</span>
                      <span className="sub-text">Print ready</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button className="header-btn secondary" onClick={handleBack}>
              <span className="hide-mobile">Close</span>
              <span className="show-mobile"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
            </button>
            <button className="header-btn primary" onClick={handleSave}>Done</button>
          </div>
        </div>
        
        <div 
          className={`canvas-wrapper ${isDrawMode ? 'draw-mode' : ''}`}
          ref={wrapperRef}
          onMouseDown={(e) => handleMouseDown(e, isDrawMode)}
          onMouseMove={(e) => handleMouseMove(e, isDrawMode)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div className="single-canvas-container">
            {activeSide === 'back' ? (
              <div className="cover-container active">
                <EditorCanvas 
                  key={(effectiveCanvasSettings?.sizeName || 'A4') + '-back'}
                  id="canvas-back"
                  elements={back.elements} 
                  selectedId={selectedId} 
                  onSelect={setSelectedId}
                  onUpdate={updateElement}
                  isDrawMode={isDrawMode}
                  onAddDrawing={(drawing) => addElement('drawing', drawing)}
                  canvasSettings={{ ...effectiveCanvasSettings, backgroundColor: back.backgroundColor }}
                  drawingTool={drawingTool}
                  zoomLevel={zoomLevel}
                  onZoomChange={handleManualZoomChange}
                  onDrawingStart={() => setIsInteractingWithCanvas(true)}
                  onDrawingEnd={() => setIsInteractingWithCanvas(false)}
                />
              </div>
            ) : (
              <div className="cover-container active">
                <EditorCanvas 
                  key={(effectiveCanvasSettings?.sizeName || 'A4') + '-front'}
                  id="canvas-front"
                  elements={front.elements} 
                  selectedId={selectedId} 
                  onSelect={setSelectedId}
                  onUpdate={updateElement}
                  isDrawMode={isDrawMode}
                  onAddDrawing={(drawing) => addElement('drawing', drawing)}
                  canvasSettings={{ ...effectiveCanvasSettings, backgroundColor: front.backgroundColor }}
                  drawingTool={drawingTool}
                  zoomLevel={zoomLevel}
                  onZoomChange={handleManualZoomChange}
                  onDrawingStart={() => setIsInteractingWithCanvas(true)}
                  onDrawingEnd={() => setIsInteractingWithCanvas(false)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mobile-switcher-dock">
          <CoverSwitcher />
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
      </>
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

export default function CoverEditorPage() {
  return (
    <Suspense fallback={<div className="loading-screen">Loading Editor...</div>}>
      <CoverEditorContent />
    </Suspense>
  )
}
