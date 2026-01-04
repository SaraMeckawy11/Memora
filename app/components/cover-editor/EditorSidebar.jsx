'use client'
import { useState } from 'react'
import '@/styles/cover-editor/sidebar.css'

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
  drawingTool,
  onUpdateDrawingTool
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
          className={`sidebar-btn ${isDrawMode ? 'active' : ''}`}
          onClick={() => handleTabClick('draw')}
        >
          <span className="sidebar-icon">✏️</span>
          <span className="sidebar-label">Draw</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => handleTabClick('background')}
        >
          <span className="sidebar-icon">🎨</span>
          <span className="sidebar-label">Bg Color</span>
        </button>

        <label className="sidebar-btn">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          <span className="sidebar-icon">🖼️</span>
          <span className="sidebar-label">Upload</span>
        </label>
      </div>

      {/* Asset Panel */}
      <div className={`asset-panel ${activeTab || (isDrawMode && activeTab === 'draw') ? '' : 'collapsed'}`}>
        <div className="panel-header">
          <div style={{ flex: 1 }}>
            {activeTab === 'shapes' && 'Elements'}
            {activeTab === 'text' && 'Text Options'}
            {activeTab === 'background' && 'Background'}
            {activeTab === 'draw' && 'Drawing Tools'}
          </div>
          <button 
            className="close-panel-btn"
            onClick={() => setActiveTab(null)}
          >
            ×
          </button>
        </div>
        <div className="panel-content">
          {activeTab === 'text' && (
            <div className="asset-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="text-preset-btn heading" onClick={() => handleAddElementAndClose('text', { content: 'Add Heading', fontSize: 32, fontWeight: 'bold', fontFamily: 'Inter, sans-serif' })}>
                Add Heading
              </button>
              <button className="text-preset-btn subheading" onClick={() => handleAddElementAndClose('text', { content: 'Add Subheading', fontSize: 24, fontWeight: '600', fontFamily: 'Inter, sans-serif' })}>
                Add Subheading
              </button>
              <button className="text-preset-btn body" onClick={() => handleAddElementAndClose('text', { content: 'Add body text', fontSize: 16, fontFamily: 'Inter, sans-serif' })}>
                Add body text
              </button>
            </div>
          )}

          {activeTab === 'shapes' && (
            <div className="asset-grid">
              {SHAPES.map((shape, i) => (
                <div 
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
                        height: shape.shapeType === 'line' ? '0px' : '30px',
                        width: '30px',
                        borderRadius: shape.shapeType === 'circle' ? '50%' : '0',
                        clipPath: shape.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                                  shape.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                      }} 
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'background' && (
            <div className="asset-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Background Color</label>
                <div className="color-picker-wrapper" style={{ width: '100%', height: '40px' }}>
                  <input 
                    type="color" 
                    value={canvasSettings.backgroundColor} 
                    onChange={(e) => onUpdateCanvas({ ...canvasSettings, backgroundColor: e.target.value })} 
                  />
                  <div style={{ width: '100%', height: '100%', backgroundColor: canvasSettings.backgroundColor, borderRadius: '4px' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#fee2e2', '#fef3c7', '#dcfce7', '#dbeafe', '#f3e8ff'].map(color => (
                  <div 
                    key={color}
                    onClick={() => onUpdateCanvas({ ...canvasSettings, backgroundColor: color })}
                    style={{ 
                      backgroundColor: color, 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="asset-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`toolbar-btn ${drawingTool.type === 'pen' ? 'active' : ''}`}
                  onClick={() => onUpdateDrawingTool({ ...drawingTool, type: 'pen' })}
                  style={{ flexDirection: 'column', padding: '10px', height: 'auto' }}
                >
                  <span style={{ fontSize: '1.2rem', marginBottom: '5px' }}>🖊️</span>
                  <span style={{ fontSize: '0.8rem' }}>Pen</span>
                </button>
                <button
                  className={`toolbar-btn ${drawingTool.type === 'eraser' ? 'active' : ''}`}
                  onClick={() => onUpdateDrawingTool({ ...drawingTool, type: 'eraser' })}
                  style={{ flexDirection: 'column', padding: '10px', height: 'auto' }}
                >
                  <span style={{ fontSize: '1.2rem', marginBottom: '5px' }}>🧹</span>
                  <span style={{ fontSize: '0.8rem' }}>Eraser</span>
                </button>
              </div>

              {drawingTool.type !== 'eraser' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Color</label>
                  <div className="color-picker-wrapper" style={{ width: '100%', height: '40px' }}>
                    <input 
                      type="color" 
                      value={drawingTool.color} 
                      onChange={(e) => onUpdateDrawingTool({ ...drawingTool, color: e.target.value })} 
                    />
                    <div style={{ width: '100%', height: '100%', backgroundColor: drawingTool.color, borderRadius: '4px' }} />
                  </div>
                </div>
              )}

              {drawingTool.type !== 'eraser' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Size: {drawingTool.width}px</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={drawingTool.width} 
                    onChange={(e) => onUpdateDrawingTool({ ...drawingTool, width: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}