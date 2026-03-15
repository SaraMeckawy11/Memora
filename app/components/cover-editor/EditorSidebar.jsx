'use client'
import { useState, useRef, useEffect } from 'react'
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
  onSetBackgroundColor,
  drawingTool,
  onUpdateDrawingTool,
  isInteractingWithCanvas
}) {
  const [activeTab, setActiveTab] = useState(null)
  const sidebarRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (!activeTab) return;

      const sidebarElement = sidebarRef.current;
      const panelElement = panelRef.current;
      const target = event.target;
      
      const sidebarContains = sidebarElement && sidebarElement.contains(target);
      const panelContains = panelElement && panelElement.contains(target);
      
      if (!sidebarContains && !panelContains) {
        setActiveTab(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTab]);

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
    // We pass a unique trigger so useEffect in hook knows it's a new add even if props are identical
    onAddElement(type, { ...props, _trigger: Date.now() })
    setActiveTab(null) // Close the sidebar so the toolbar can be seen
  }

  return (
    <>
      <div className="editor-sidebar" ref={sidebarRef}>
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
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
               <rect x="3" y="14" width="7" height="7" rx="1" />
               <circle cx="17.5" cy="17.5" r="3.5" />
             </svg>
          </span>
          <span className="sidebar-label">Shapes</span>
        </button>

        <button 
          className={`sidebar-btn ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => handleTabClick('background')}
          title="Background Color"
        >
          <span className="sidebar-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          </span>
          <span className="sidebar-label">Background</span>
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
      <div 
        className={`asset-panel ${activeTab ? '' : 'collapsed'} ${isInteractingWithCanvas ? 'interaction-active' : ''}`}
        ref={panelRef}
      >
        <div className="panel-header">
          <div className="panel-title">
            {activeTab === 'shapes' && 'Elements'}
            {activeTab === 'text' && 'Text Options'}
            {activeTab === 'background' && 'Background'}
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
                    onClick={() => {
                      const { id, ...shapeWithoutId } = shape;
                      handleAddElementAndClose('shape', shapeWithoutId);
                    }}
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
