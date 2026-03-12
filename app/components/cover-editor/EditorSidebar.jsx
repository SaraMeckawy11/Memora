'use client'
import { useState } from 'react'
import '@/styles/cover-editor/sidebar.css'

const PAPER_SIZES = {
  A4: { width: 595, height: 842, label: 'A4', desc: 'Print Standard' }, 
  A5: { width: 420, height: 595, label: 'A5', desc: 'Compact' },
  B5: { width: 498, height: 708, label: 'B5', desc: 'Trade Book' },
}

const PIXEL_SCALE = 1.5 // Multiplier for screen editing resolution (e.g. A4 becomes ~900x1260)

const SHAPES = [
  { id: 'square', type: 'shape', shapeType: 'rect', fill: '#10b981', name: 'Square', width: 100, height: 100 },
  { id: 'circle', type: 'shape', shapeType: 'circle', fill: '#ef4444', name: 'Circle' },
  { id: 'triangle', type: 'shape', shapeType: 'triangle', fill: '#f59e0b', name: 'Triangle' },
  { id: 'star', type: 'shape', shapeType: 'star', fill: '#8b5cf6', name: 'Star' },
  { id: 'line', type: 'shape', shapeType: 'line', stroke: '#000000', strokeWidth: 4, name: 'Line' },
  { id: 'arrow', type: 'shape', shapeType: 'arrow', stroke: '#000000', strokeWidth: 4, name: 'Arrow' },
]

export default function EditorSidebar({ 
  onAddElement, 
  onToggleDrawMode, 
  isDrawMode,
  canvasSettings,
  onUpdateCanvas,
  onSetBackgroundColor,
  drawingTool,
  onUpdateDrawingTool,
  isInteractingWithCanvas
}) {
  const [activeTab, setActiveTab] = useState(null)
  
  // Safe access to canvas settings
  const safeCanvasSettings = canvasSettings || { 
    sizeName: 'A4', 
    orientation: 'portrait', 
    backgroundColor: '#ffffff',
    width: 595, 
    height: 842 
  }

  const handleTabClick = (tab) => {
    if (tab === 'draw') {
      if (onToggleDrawMode) onToggleDrawMode()
      setActiveTab(isDrawMode ? null : 'draw')
    } else {
      if (isDrawMode && onToggleDrawMode) onToggleDrawMode() // Turn off draw mode if switching tabs
      setActiveTab(activeTab === tab ? null : tab)
    }
  }

  const handleResizeCanvas = (sizeName, orientation) => {
    const baseSize = PAPER_SIZES[sizeName]
    if (!baseSize) return

    let width = baseSize.width * PIXEL_SCALE
    let height = baseSize.height * PIXEL_SCALE

    if (orientation === 'landscape') {
      [width, height] = [height, width]
    }

    const newSettings = {
      ...safeCanvasSettings,
      width: Math.round(width),
      height: Math.round(height),
      sizeName,
      orientation
    }
    
    console.log('📐 Button clicked: Resizing to', sizeName, orientation, '→', newSettings.width, 'x', newSettings.height);
    onUpdateCanvas(newSettings)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        handleAddElementAndClose('image', { src: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddElementAndClose = (type, props) => {
    onAddElement(type, props)
    setActiveTab(null) // Close the sidebar so the toolbar can be seen
  }

  return (
    <>
      <div className="editor-sidebar">
        <button 
          className={`sidebar-btn ${!isDrawMode && !activeTab ? 'active' : ''}`}
          onClick={() => {
            if (isDrawMode) onToggleDrawMode()
            setActiveTab(null)
          }}
          title="Cursor / Select"
        >
          <span className="sidebar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
          </span>
          <span className="sidebar-label">Select</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => handleTabClick('text')}
        >
          <span className="sidebar-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
          </span>
          <span className="sidebar-label">Text</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'shapes' ? 'active' : ''}`}
          onClick={() => handleTabClick('shapes')}
        >
          <span className="sidebar-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M3 3h18v18H3z" stroke="none" fill="none"/></svg>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', opacity: 0}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
             <div style={{ display: 'flex', gap: 2 }}>
                <div style={{ width: 10, height: 10, border: '2px solid currentColor', borderRadius: 2 }}></div>
                <div style={{ width: 10, height: 10, border: '2px solid currentColor', borderRadius: '50%' }}></div>
             </div>
          </span>
          <span className="sidebar-label">Shapes</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => handleTabClick('background')}
          title="Canvas Setup & Background"
        >
          <span className="sidebar-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          </span>
          <span className="sidebar-label">Layout</span>
        </button>

        <label className="sidebar-btn" style={{ cursor: 'pointer' }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          <span className="sidebar-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </span>
          <span className="sidebar-label">Upload</span>
        </label>
      </div>

      {/* Asset Panel */}
      <div className={`asset-panel ${activeTab && !isInteractingWithCanvas ? '' : 'collapsed'}`}>
        <div className="panel-header">
          <div className="panel-title">
            {activeTab === 'shapes' && 'Elements'}
            {activeTab === 'text' && 'Text Options'}
            {activeTab === 'background' && 'Canvas Setup'}
          </div>
          
          <button 
            className="mobile-done-btn"
            onClick={() => setActiveTab(null)}
          >
            Done
          </button>
          
          <button 
            className="close-panel-btn desktop-close-btn"
            onClick={() => setActiveTab(null)}
          >
            ×
          </button>
        </div>
        <div className="panel-content">
          {activeTab === 'background' && (
            <div className="panel-section">
               <h4 className="section-title">Canvas Size</h4>
               <div className="options-grid">
                  {Object.entries(PAPER_SIZES).map(([key, size]) => (
                    <button
                      key={key}
                      className={`option-card ${safeCanvasSettings.sizeName === key ? 'selected' : ''}`}
                      onClick={() => handleResizeCanvas(key, safeCanvasSettings.orientation || 'portrait')}
                    >
                      <span className="option-label">{size.label}</span>
                      <span className="option-desc">{size.desc}</span>
                    </button>
                  ))}
               </div>

               <h4 className="section-title">Orientation</h4>
               <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    className={`option-card ${safeCanvasSettings.orientation !== 'landscape' ? 'selected' : ''}`}
                    onClick={() => handleResizeCanvas(safeCanvasSettings.sizeName || 'A4', 'portrait')}
                  >
                    <span className="option-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="12" height="16" rx="2"/></svg>
                    </span>
                    <span className="option-label">Portrait</span>
                  </button>
                  <button
                    className={`option-card ${safeCanvasSettings.orientation === 'landscape' ? 'selected' : ''}`}
                    onClick={() => handleResizeCanvas(safeCanvasSettings.sizeName || 'A4', 'landscape')}
                  >
                    <span className="option-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="6" width="16" height="12" rx="2"/></svg>
                    </span>
                    <span className="option-label">Landscape</span>
                  </button>
               </div>

               <h4 className="section-title">Background Color</h4>
               <div className="color-preview-large" style={{ backgroundColor: safeCanvasSettings?.backgroundColor || '#ffffff' }}>
                  <input 
                    type="color" 
                    className="color-input-hidden"
                    value={safeCanvasSettings?.backgroundColor || '#ffffff'}
                    onChange={(e) => {
                      onUpdateCanvas({ ...safeCanvasSettings, backgroundColor: e.target.value });
                      if (onSetBackgroundColor) {
                        onSetBackgroundColor(e.target.value);
                      }
                    }}
                  />
                  <span className="color-value">{safeCanvasSettings?.backgroundColor || '#ffffff'}</span>
               </div>
            </div>
          )}
          
          {activeTab === 'shapes' && (
            <div className="panel-section">
              <h4 className="section-title">Basic Shapes</h4>
              <div className="compact-shape-grid">
                {SHAPES.map((shape, i) => (
                  <button 
                    key={i} 
                    className="compact-shape-btn"
                    onClick={() => handleAddElementAndClose('shape', { ...shape })}
                    title={`Add ${shape.name}`}
                  >
                    {shape.shapeType === 'rect' && (
                      <div style={{ width: '20px', height: '20px', border: '2px solid currentColor', borderRadius: '4px' }}></div>
                    )}
                    {shape.shapeType === 'circle' && (
                      <div style={{ width: '22px', height: '22px', border: '2px solid currentColor', borderRadius: '50%' }}></div>
                    )}
                    {shape.shapeType === 'triangle' && (
                      <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid currentColor' }}></div>
                    )}
                    {shape.shapeType === 'star' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    )}
                    {shape.shapeType === 'line' && (
                      <div style={{ width: '22px', height: '3px', background: 'currentColor', borderRadius: '2px', transform: 'rotate(-45deg)' }}></div>
                    )}
                    {shape.shapeType === 'arrow' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="panel-section">
              <h4 className="section-title">Typography</h4>
              <div className="text-presets-list">
                <button className="text-preset-card heading" onClick={() => handleAddElementAndClose('text', { content: 'Add Heading', fontSize: 32, fontWeight: 'bold', fontFamily: 'Inter, sans-serif' })}>
                  <span className="preset-preview" style={{ fontSize: '24px', fontWeight: '800' }}>Ag</span>
                  <div className="preset-info">
                    <span className="preset-name">Add Heading</span>
                    <span className="preset-desc">Large, bold title</span>
                  </div>
                </button>
                <button className="text-preset-card subheading" onClick={() => handleAddElementAndClose('text', { content: 'Add Subheading', fontSize: 24, fontWeight: '600', fontFamily: 'Inter, sans-serif' })}>
                  <span className="preset-preview" style={{ fontSize: '18px', fontWeight: '600' }}>Ag</span>
                  <div className="preset-info">
                    <span className="preset-name">Add Subheading</span>
                    <span className="preset-desc">Medium section title</span>
                  </div>
                </button>
                <button className="text-preset-card body" onClick={() => handleAddElementAndClose('text', { content: 'Add body text', fontSize: 16, fontFamily: 'Inter, sans-serif' })}>
                  <span className="preset-preview" style={{ fontSize: '14px', fontWeight: '400' }}>Ag</span>
                  <div className="preset-info">
                    <span className="preset-name">Add Body Text</span>
                    <span className="preset-desc">Regular paragraph text</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
