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

  const handleTabClick = (tab) => {
    if (tab === 'draw') {
      onToggleDrawMode()
      setActiveTab(isDrawMode ? null : 'draw')
    } else {
      if (isDrawMode) onToggleDrawMode() // Turn off draw mode if switching tabs
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
      ...canvasSettings,
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
          <span className="sidebar-icon">👆</span>
          <span className="sidebar-label">Cursor</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => handleTabClick('text')}
        >
          <span className="sidebar-icon">T</span>
          <span className="sidebar-label">Text</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'shapes' ? 'active' : ''}`}
          onClick={() => handleTabClick('shapes')}
        >
          <span className="sidebar-icon">■</span>
          <span className="sidebar-label">Elements</span>
        </button>

        <button 
          className={`sidebar-btn ${isDrawMode && drawingTool.type === 'pen' ? 'active' : ''}`}
          onClick={() => {
            if (!isDrawMode || drawingTool.type !== 'pen') {
              onToggleDrawMode(true) // Ensure draw mode is on
              onUpdateDrawingTool({ ...drawingTool, type: 'pen' })
              setActiveTab('draw-pen')
            } else {
              // Toggle off if already active? Or just keep it active?
              // User wants separate options.
              // If I click pen again, maybe close the settings panel?
              setActiveTab(activeTab === 'draw-pen' ? null : 'draw-pen')
            }
          }}
        >
          <span className="sidebar-icon">🖊️</span>
          <span className="sidebar-label">Pen</span>
        </button>

        <button 
          className={`sidebar-btn ${isDrawMode && drawingTool.type === 'eraser' ? 'active' : ''}`}
          onClick={() => {
            if (!isDrawMode || drawingTool.type !== 'eraser') {
              onToggleDrawMode(true) // Ensure draw mode is on
              onUpdateDrawingTool({ ...drawingTool, type: 'eraser' })
              setActiveTab('draw-eraser')
            } else {
              setActiveTab(activeTab === 'draw-eraser' ? null : 'draw-eraser')
            }
          }}
        >
          <span className="sidebar-icon">🧹</span>
          <span className="sidebar-label">Eraser</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => handleTabClick('background')}
          title="Canvas Setup & Background"
        >
          <span className="sidebar-icon">🎨</span>
          <span className="sidebar-label">Canvas</span>
        </button>

        <label className="sidebar-btn">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          <span className="sidebar-icon">🖼️</span>
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
            {activeTab === 'draw-pen' && 'Pen Settings'}
            {activeTab === 'draw-eraser' && 'Eraser Settings'}
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
                      className={`option-card ${canvasSettings.sizeName === key ? 'selected' : ''}`}
                      onClick={() => handleResizeCanvas(key, canvasSettings.orientation || 'portrait')}
                    >
                      <span className="option-label">{size.label}</span>
                      <span className="option-desc">{size.desc}</span>
                    </button>
                  ))}
               </div>

               <h4 className="section-title">Orientation</h4>
               <div className="options-grid">
                  <button
                    className={`option-card ${canvasSettings.orientation !== 'landscape' ? 'selected' : ''}`}
                    onClick={() => handleResizeCanvas(canvasSettings.sizeName || 'A4', 'portrait')}
                  >
                    <span className="option-icon" style={{ fontSize: '20px' }}>▯</span>
                    <span className="option-label">Portrait</span>
                  </button>
                  <button
                    className={`option-card ${canvasSettings.orientation === 'landscape' ? 'selected' : ''}`}
                    onClick={() => handleResizeCanvas(canvasSettings.sizeName || 'A4', 'landscape')}
                  >
                    <span className="option-icon" style={{ fontSize: '20px', transform: 'rotate(90deg)', display: 'inline-block' }}>▯</span>
                    <span className="option-label">Landscape</span>
                  </button>
               </div>

               <h4 className="section-title">Background Color</h4>
               <div className="color-preview-large" style={{ backgroundColor: canvasSettings?.backgroundColor || '#ffffff' }}>
                  <input 
                    type="color" 
                    className="color-input-hidden"
                    value={canvasSettings?.backgroundColor || '#ffffff'}
                    onChange={(e) => {
                      onUpdateCanvas({ ...canvasSettings, backgroundColor: e.target.value });
                      if (onSetBackgroundColor) {
                        onSetBackgroundColor(e.target.value);
                      }
                    }}
                  />
                  <span className="color-value">{canvasSettings?.backgroundColor || '#ffffff'}</span>
               </div>
            </div>
          )}
          
          {activeTab === 'shapes' && (
            <div className="panel-section">
              <h4 className="section-title">Basic Shapes</h4>
              <div className="asset-grid">
                {SHAPES.map((shape, i) => (
                  <button 
                    key={i} 
                    className="asset-item"
                    onClick={() => handleAddElementAndClose('shape', { ...shape })}
                    title={shape.name}
                  >
                    {shape.shapeType === 'arrow' ? (
                      <div style={{ fontSize: '24px', color: shape.stroke, lineHeight: 1 }}>➜</div>
                    ) : (
                      <div 
                        className="shape-preview" 
                        style={{ 
                          backgroundColor: shape.shapeType === 'line' ? 'transparent' : shape.fill,
                          border: shape.shapeType === 'line' ? `2px solid ${shape.stroke}` : 'none',
                          height: shape.shapeType === 'line' ? '0px' : '32px',
                          width: '32px',
                          borderRadius: shape.shapeType === 'circle' ? '50%' : '0',
                          clipPath: shape.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                                    shape.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                        }} 
                      />
                    )}
                    <span className="asset-label">{shape.name}</span>
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

          {activeTab === 'draw-pen' && (
            <div className="draw-settings-group">
              <div className="setting-item">
                <label>Color</label>
                <div className="color-picker-wrapper">
                  <input 
                    type="color" 
                    value={drawingTool.color} 
                    onChange={(e) => onUpdateDrawingTool({ ...drawingTool, color: e.target.value })} 
                  />
                  <div className="color-preview-inner" style={{ backgroundColor: drawingTool.color }} />
                </div>
              </div>

              <div className="setting-item">
                <label>Size: {drawingTool.width}px</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={drawingTool.width} 
                  onChange={(e) => onUpdateDrawingTool({ ...drawingTool, width: parseInt(e.target.value) })}
                  className="custom-range"
                />
              </div>
              
              <div className="setting-item">
                <label>Opacity: {Math.round(drawingTool.opacity * 100)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1"
                  value={drawingTool.opacity} 
                  onChange={(e) => onUpdateDrawingTool({ ...drawingTool, opacity: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>
            </div>
          )}

          {activeTab === 'draw-eraser' && (
            <div className="draw-settings-group">
              <div className="eraser-info-box">
                
                <p>Tap on elements to erase them from the canvas.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
