'use client'
import { useState } from 'react'
import { FONT_LIST } from './FontLoader'
import SearchableFontSelect from './SearchableFontSelect'
import '@/styles/cover-editor/toolbar.css'

const FONT_FAMILIES = FONT_LIST

const FILTERS = [
  { name: 'None', settings: { brightness: 100, contrast: 100, saturate: 100, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: 0, vignette: 0, noise: 0, sharpness: 0 } },
  { name: 'Vivid', settings: { brightness: 110, contrast: 120, saturate: 130, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: 0, vignette: 10, noise: 0, sharpness: 20 } },
  { name: 'Warm', settings: { brightness: 105, contrast: 100, saturate: 110, sepia: 30, grayscale: 0, hueRotate: 0, blur: 0, temperature: 20, vignette: 0, noise: 0, sharpness: 0 } },
  { name: 'Cool', settings: { brightness: 100, contrast: 100, saturate: 90, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: -20, vignette: 0, noise: 0, sharpness: 0 } },
  { name: 'Dramatic', settings: { brightness: 90, contrast: 140, saturate: 90, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: 0, vignette: 40, noise: 10, sharpness: 30 } },
  { name: 'Mono', settings: { brightness: 100, contrast: 120, saturate: 0, sepia: 0, grayscale: 100, hueRotate: 0, blur: 0, temperature: 0, vignette: 20, noise: 20, sharpness: 10 } },
  { name: 'Noir', settings: { brightness: 90, contrast: 150, saturate: 0, sepia: 0, grayscale: 100, hueRotate: 0, blur: 0, temperature: 0, vignette: 60, noise: 30, sharpness: 0 } },
  { name: 'Silvertone', settings: { brightness: 110, contrast: 90, saturate: 0, sepia: 10, grayscale: 100, hueRotate: 0, blur: 0, temperature: 0, vignette: 0, noise: 0, sharpness: 0 } },
]

const IMAGE_TOOLS = [
  { id: 'exposure', label: 'Exposure', icon: '☀', prop: 'brightness', min: 50, max: 150, default: 100 },
  { id: 'brilliance', label: 'Brilliance', icon: '✨', prop: 'contrast', min: 50, max: 150, default: 100 }, // Simplified mapping
  { id: 'highlights', label: 'Highlights', icon: '⚪', prop: 'brightness', min: 50, max: 150, default: 100 }, // Simplified
  { id: 'shadows', label: 'Shadows', icon: '⚫', prop: 'brightness', min: 50, max: 150, default: 100 }, // Simplified
  { id: 'contrast', label: 'Contrast', icon: '◑', prop: 'contrast', min: 50, max: 150, default: 100 },
  { id: 'brightness', label: 'Brightness', icon: '🔆', prop: 'brightness', min: 50, max: 150, default: 100 },
  { id: 'blackpoint', label: 'Black Point', icon: '🌑', prop: 'contrast', min: 50, max: 150, default: 100 }, // Simplified
  { id: 'saturation', label: 'Saturation', icon: '🌈', prop: 'saturate', min: 0, max: 200, default: 100 },
  { id: 'vibrance', label: 'Vibrance', icon: '🌺', prop: 'saturate', min: 0, max: 200, default: 100 }, // Simplified
  { id: 'warmth', label: 'Warmth', icon: '🌡', prop: 'sepia', min: 0, max: 100, default: 0 },
  { id: 'tint', label: 'Tint', icon: '🎨', prop: 'hueRotate', min: 0, max: 360, default: 0 },
  { id: 'sharpness', label: 'Sharpness', icon: '📐', prop: 'sharpness', min: 0, max: 100, default: 0 },
  { id: 'definition', label: 'Definition', icon: '💎', prop: 'sharpness', min: 0, max: 100, default: 0 }, // Simplified
  { id: 'noise', label: 'Noise', icon: '🌫', prop: 'noise', min: 0, max: 100, default: 0 },
  { id: 'vignette', label: 'Vignette', icon: '⭕', prop: 'vignette', min: 0, max: 100, default: 0 },
  { id: 'blur', label: 'Blur', icon: '💧', prop: 'blur', min: 0, max: 20, default: 0 },
  { id: 'opacity', label: 'Opacity', icon: '👁', prop: 'opacity', min: 0, max: 100, default: 100 },
]

const ToolbarSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="toolbar-section">
      <button 
        className={`toolbar-section-header ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="section-title">{title}</span>
        <span className="section-arrow">▼</span>
      </button>
      {isOpen && (
        <div className="toolbar-section-content">
          {children}
        </div>
      )}
    </div>
  )
}

export default function EditorToolbar({ selectedElement, onUpdate, onReorder, onClose }) {
  const [activeMobileTool, setActiveMobileTool] = useState(null)
  const [activeTab, setActiveTab] = useState('adjust') // 'adjust' | 'filters'

  if (!selectedElement) return <div className="editor-toolbar empty">Select an element to edit</div>

  // Mobile View for Image Editing
  const renderMobileImageTools = () => {
    if (activeTab === 'filters') {
      return (
        <div className="mobile-filters-scroll">
          {FILTERS.map((filter) => (
            <button 
              key={filter.name}
              className="mobile-filter-btn"
              onClick={() => onUpdate(filter.settings)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="mobile-tools-container">
        {/* Active Tool Slider (Floating above) */}
        {activeMobileTool && (
          <div className="mobile-active-tool-slider">
            <div className="tool-header">
              <span>{activeMobileTool.label}</span>
              <span>{selectedElement[activeMobileTool.prop] || activeMobileTool.default}</span>
            </div>
            <input 
              type="range" 
              min={activeMobileTool.min} 
              max={activeMobileTool.max} 
              value={selectedElement[activeMobileTool.prop] !== undefined ? selectedElement[activeMobileTool.prop] : activeMobileTool.default} 
              onChange={(e) => onUpdate({ [activeMobileTool.prop]: Number(e.target.value) })}
            />
          </div>
        )}

        {/* Tool Icons Strip */}
        <div className="mobile-tools-scroll">
          {IMAGE_TOOLS.map((tool) => (
            <button 
              key={tool.id}
              className={`mobile-tool-btn ${activeMobileTool?.id === tool.id ? 'active' : ''}`}
              onClick={() => setActiveMobileTool(tool)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
          
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
          
          <label className="mobile-tool-btn" style={{ cursor: 'pointer' }}>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onUpdate({ src: event.target.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <span className="tool-icon">📷</span>
            <span className="tool-label">Replace</span>
          </label>
          
          <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ color: '#ef4444' }}>
            <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>🗑️</span>
            <span className="tool-label">Delete</span>
          </button>
        </div>
      </div>
    )
  }

  const renderMobileTextTools = () => (
    <div className="mobile-tools-container" style={{ padding: '1rem', overflowY: 'auto' }}>
      {/* Font & Size Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Font</div>
          <SearchableFontSelect 
            fonts={FONT_FAMILIES}
            selectedFont={selectedElement.fontFamily}
            onChange={(font) => onUpdate({ fontFamily: font })}
          />
        </div>
        <div>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Size</div>
          <input 
            type="number" 
            className="toolbar-input" 
            value={selectedElement.fontSize} 
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      </div>

      {/* Size Slider */}
      <div style={{ marginBottom: '1rem' }}>
         <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Size</div>
         <input 
          type="range" 
          min="10" 
          max="200" 
          value={selectedElement.fontSize} 
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Letter Spacing Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
         <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Letter Spacing: {parseFloat(selectedElement.letterSpacing) || 0}em</div>
         <input 
          type="range" 
          min="-0.1" 
          max="1.0" 
          step="0.01"
          value={parseFloat(selectedElement.letterSpacing) || 0} 
          onChange={(e) => onUpdate({ letterSpacing: `${e.target.value}em` })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Style & Alignment */}
      <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Style</div>
      <div className="mobile-tools-scroll" style={{ marginBottom: '1.5rem' }}>
        <div className="color-picker-wrapper mobile-tool-btn">
           <input 
              type="color" 
              value={selectedElement.color} 
              onChange={(e) => onUpdate({ color: e.target.value })} 
            />
            <span className="tool-icon" style={{backgroundColor: selectedElement.color}}></span>
            <span className="tool-label">Color</span>
        </div>
        
        <button className={`mobile-tool-btn ${selectedElement.fontWeight === 'bold' ? 'active' : ''}`} onClick={() => onUpdate({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}>
          <span className="tool-icon">B</span>
          <span className="tool-label">Bold</span>
        </button>
        
        <button className={`mobile-tool-btn ${selectedElement.fontStyle === 'italic' ? 'active' : ''}`} onClick={() => onUpdate({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}>
          <span className="tool-icon">I</span>
          <span className="tool-label">Italic</span>
        </button>

        <button className={`mobile-tool-btn ${selectedElement.textDecoration === 'underline' ? 'active' : ''}`} onClick={() => onUpdate({ textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}>
          <span className="tool-icon">U</span>
          <span className="tool-label">Underline</span>
        </button>

        <div style={{ width: '1px', height: '40px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>

        <button className={`mobile-tool-btn ${selectedElement.textAlign === 'left' ? 'active' : ''}`} onClick={() => onUpdate({ textAlign: 'left' })}>
          <span className="tool-icon">⇤</span>
          <span className="tool-label">Left</span>
        </button>

        <button className={`mobile-tool-btn ${selectedElement.textAlign === 'center' ? 'active' : ''}`} onClick={() => onUpdate({ textAlign: 'center' })}>
          <span className="tool-icon">↔</span>
          <span className="tool-label">Center</span>
        </button>

        <button className={`mobile-tool-btn ${selectedElement.textAlign === 'right' ? 'active' : ''}`} onClick={() => onUpdate({ textAlign: 'right' })}>
          <span className="tool-icon">⇥</span>
          <span className="tool-label">Right</span>
        </button>
      </div>
      
      {/* Delete Button */}
      <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ width: '100%', justifyContent: 'center', color: '#ef4444', background: '#fef2f2', borderColor: '#fee2e2' }}>
        <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fff' }}>🗑️</span>
        <span className="tool-label">Delete Element</span>
      </button>
    </div>
  )

  // Mobile View for Layout (Position, Size, Layering)
  const renderMobileLayoutTools = () => (
    <div className="mobile-tools-container" style={{ padding: '1rem', overflowY: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>X Position</div>
          <input 
            type="number" 
            className="toolbar-input" 
            value={Math.round(selectedElement.x)} 
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Y Position</div>
          <input 
            type="number" 
            className="toolbar-input" 
            value={Math.round(selectedElement.y)} 
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Width</div>
          <input 
            type="number" 
            className="toolbar-input" 
            value={Math.round(selectedElement.width)} 
            onChange={(e) => onUpdate({ width: Number(e.target.value) })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Height</div>
          <input 
            type="number" 
            className="toolbar-input" 
            value={Math.round(selectedElement.height)} 
            onChange={(e) => onUpdate({ height: Number(e.target.value) })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Rotation: {Math.round(selectedElement.rotation || 0)}°</div>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={selectedElement.rotation || 0} 
          onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Layering</div>
      <div className="mobile-tools-scroll" style={{ justifyContent: 'space-between', paddingBottom: '1rem' }}>
        <button className="mobile-tool-btn" onClick={() => onReorder('front')}>
          <span className="tool-icon">↑</span>
          <span className="tool-label">To Front</span>
        </button>
        <button className="mobile-tool-btn" onClick={() => onReorder('forward')}>
          <span className="tool-icon">↗</span>
          <span className="tool-label">Forward</span>
        </button>
        <button className="mobile-tool-btn" onClick={() => onReorder('backward')}>
          <span className="tool-icon">↙</span>
          <span className="tool-label">Backward</span>
        </button>
        <button className="mobile-tool-btn" onClick={() => onReorder('back')}>
          <span className="tool-icon">↓</span>
          <span className="tool-label">To Back</span>
        </button>
      </div>
    </div>
  )

  const renderMobileShapeTools = () => (
    <div className="mobile-tools-container" style={{ padding: '1rem', overflowY: 'auto' }}>
       <div style={{ marginBottom: '1.5rem' }}>
          <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Color</div>
          <div className="color-picker-wrapper" style={{ width: '100%', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
             <input 
                type="color" 
                value={selectedElement.fill || selectedElement.stroke} 
                onChange={(e) => onUpdate(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow' ? { stroke: e.target.value } : { fill: e.target.value })} 
                style={{ width: '100%', height: '100%', padding: 0, border: 'none', cursor: 'pointer' }}
              />
          </div>
       </div>

       {(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') && (
         <div style={{ marginBottom: '1.5rem' }}>
            <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Thickness: {selectedElement.strokeWidth}px</div>
            <input 
              type="range" 
              min="1" max="20" 
              value={selectedElement.strokeWidth} 
              onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
         </div>
       )}
        
        <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ width: '100%', justifyContent: 'center', color: '#ef4444', background: '#fef2f2', borderColor: '#fee2e2' }}>
          <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fff' }}>🗑️</span>
          <span className="tool-label">Delete Element</span>
        </button>
    </div>
  )

  // Mobile View for Drawing (Stroke) Properties
  const renderMobileDrawingTools = () => (
    <div className="mobile-tools-container" style={{ padding: '1rem', overflowY: 'auto' }}>
       <div style={{ marginBottom: '1.5rem' }}>
          <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Color</div>
          <div className="color-picker-wrapper" style={{ width: '100%', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
             <input 
                type="color" 
                value={selectedElement.stroke} 
                onChange={(e) => onUpdate({ stroke: e.target.value })} 
                style={{ width: '100%', height: '100%', padding: 0, border: 'none', cursor: 'pointer' }}
              />
          </div>
       </div>

       <div style={{ marginBottom: '1.5rem' }}>
          <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Thickness: {selectedElement.strokeWidth}px</div>
          <input 
            type="range" 
            min="1" max="50" 
            value={selectedElement.strokeWidth} 
            onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
       </div>

       <div style={{ marginBottom: '1.5rem' }}>
          <div className="tool-header" style={{ marginBottom: '0.5rem' }}>Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</div>
          <input 
            type="range" 
            min="0.1" max="1" step="0.1"
            value={selectedElement.opacity || 1} 
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
       </div>
        
        <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ width: '100%', justifyContent: 'center', color: '#ef4444', background: '#fef2f2', borderColor: '#fee2e2' }}>
          <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fff' }}>🗑️</span>
          <span className="tool-label">Delete Element</span>
        </button>
    </div>
  )

  return (
    <div className="editor-toolbar">
      {/* Mobile Close Handle */}
      <div className="mobile-close-handle" onClick={onClose} />
      
      <div className="toolbar-header-mobile">
        <div className="mobile-tabs">
          <button 
            className={`mobile-tab-btn ${activeTab === 'adjust' ? 'active' : ''}`}
            onClick={() => setActiveTab('adjust')}
          >
            Adjust
          </button>
          <button 
            className={`mobile-tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </button>
          {selectedElement.type === 'image' && (
            <button 
              className={`mobile-tab-btn ${activeTab === 'filters' ? 'active' : ''}`}
              onClick={() => setActiveTab('filters')}
            >
              Filters
            </button>
          )}
        </div>
        <button className="close-btn-mobile" onClick={onClose}>Done</button>
      </div>

      {/* Desktop View (Standard List) - Hidden on Mobile via CSS */}
      <div className="desktop-toolbar-content">
        {/* Common Properties: Position & Size */}
        <ToolbarSection title="Position & Size" defaultOpen={true}>
          <div className="input-row">
            <span className="input-label">X</span>
            <input 
              type="number" 
              className="toolbar-input" 
              value={Math.round(selectedElement.x)} 
              onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            />
          </div>
          <div className="input-row">
            <span className="input-label">Y</span>
            <input 
              type="number" 
              className="toolbar-input" 
              value={Math.round(selectedElement.y)} 
              onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            />
          </div>
          <div className="input-row">
            <span className="input-label">W</span>
            <input 
              type="number" 
              className="toolbar-input" 
              value={Math.round(selectedElement.width)} 
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
            />
          </div>
          <div className="input-row">
            <span className="input-label">H</span>
            <input 
              type="number" 
              className="toolbar-input" 
              value={Math.round(selectedElement.height)} 
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
            />
          </div>
          <div className="input-row">
            <span className="input-label">R</span>
            <input 
              type="number" 
              className="toolbar-input" 
              value={Math.round(selectedElement.rotation || 0)} 
              onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            />
          </div>
        </ToolbarSection>

        {/* Layering Controls */}
        <ToolbarSection title="Layering">
          <div className="toolbar-row grid-2">
            <button className="toolbar-btn" onClick={() => onReorder('front')} title="Bring to Front">
              Bring to Front
            </button>
            <button className="toolbar-btn" onClick={() => onReorder('back')} title="Send to Back">
              Send to Back
            </button>
            <button className="toolbar-btn" onClick={() => onReorder('forward')} title="Bring Forward">
              Bring Forward
            </button>
            <button className="toolbar-btn" onClick={() => onReorder('backward')} title="Send Backward">
              Send Backward
            </button>
          </div>
        </ToolbarSection>

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <ToolbarSection title="Text Style" defaultOpen={true}>
            <div className="control-group">
              <label className="control-label">Font Family</label>
              <SearchableFontSelect 
                fonts={FONT_FAMILIES}
                selectedFont={selectedElement.fontFamily}
                onChange={(font) => onUpdate({ fontFamily: font })}
              />
            </div>
            
            <div className="control-group">
              <label className="control-label">Font Size</label>
              <input 
                type="number" 
                className="toolbar-input" 
                value={selectedElement.fontSize} 
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <label className="control-label">Line Spacing</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0.5" 
                  max="3.0" 
                  step="0.1"
                  value={selectedElement.lineHeight || 1.2} 
                  onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '12px', width: '24px' }}>{selectedElement.lineHeight || 1.2}</span>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Letter Spacing</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="-0.1" 
                  max="1.0" 
                  step="0.01"
                  value={parseFloat(selectedElement.letterSpacing) || 0} 
                  onChange={(e) => onUpdate({ letterSpacing: `${e.target.value}em` })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '12px', width: '24px' }}>{parseFloat(selectedElement.letterSpacing) || 0}</span>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Color</label>
              <div className="color-picker-wrapper">
                <input 
                  type="color" 
                  value={selectedElement.color} 
                  onChange={(e) => onUpdate({ color: e.target.value })} 
                />
                <div className="color-preview" style={{ backgroundColor: selectedElement.color }} />
              </div>
            </div>

            <div className="toolbar-row grid-3">
              <button 
                className={`toolbar-btn ${selectedElement.fontWeight === 'bold' ? 'active' : ''}`}
                onClick={() => onUpdate({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
              >
                B
              </button>
              <button 
                className={`toolbar-btn ${selectedElement.fontStyle === 'italic' ? 'active' : ''}`}
                onClick={() => onUpdate({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
              >
                I
              </button>
              <button 
                className={`toolbar-btn ${selectedElement.textDecoration === 'underline' ? 'active' : ''}`}
                onClick={() => onUpdate({ textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
              >
                U
              </button>
            </div>

            <div className="toolbar-row grid-3">
              <button 
                className={`toolbar-btn ${selectedElement.textAlign === 'left' ? 'active' : ''}`}
                onClick={() => onUpdate({ textAlign: 'left' })}
              >
                Left
              </button>
              <button 
                className={`toolbar-btn ${selectedElement.textAlign === 'center' ? 'active' : ''}`}
                onClick={() => onUpdate({ textAlign: 'center' })}
              >
                Center
              </button>
              <button 
                className={`toolbar-btn ${selectedElement.textAlign === 'right' ? 'active' : ''}`}
                onClick={() => onUpdate({ textAlign: 'right' })}
              >
                Right
              </button>
            </div>
            
            <div className="control-group">
              <label className="control-label">Content</label>
              <textarea 
                className="toolbar-textarea" 
                rows={3}
                value={selectedElement.content} 
                onChange={(e) => onUpdate({ content: e.target.value })}
              />
            </div>
          </ToolbarSection>
        )}

        {/* Image Properties */}
        {selectedElement.type === 'image' && (
          <>
            <ToolbarSection title="Replace Image" defaultOpen={true}>
              <label className="replace-image-btn" style={{ display: 'block', padding: '12px 16px', background: '#4f46e5', color: 'white', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', marginBottom: '8px', fontWeight: '500' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        onUpdate({ src: event.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                📷 Choose New Image
              </label>
            </ToolbarSection>

            <ToolbarSection title="Filters" defaultOpen={true}>
              <div className="filter-grid">
                {FILTERS.map(filter => (
                  <button 
                    key={filter.name}
                    className="filter-btn"
                    onClick={() => onUpdate(filter.settings)}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </ToolbarSection>

            <ToolbarSection title="Adjustments" defaultOpen={true}>
              {IMAGE_TOOLS.map(tool => (
                <div className="control-group" key={tool.id}>
                  <div className="filter-label">
                    <span>{tool.label}</span>
                    <span>{selectedElement[tool.prop] || tool.default}</span>
                  </div>
                  <input 
                    type="range" 
                    min={tool.min} max={tool.max} 
                    value={selectedElement[tool.prop] !== undefined ? selectedElement[tool.prop] : tool.default} 
                    onChange={(e) => onUpdate({ [tool.prop]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </ToolbarSection>
          </>
        )}

        {/* Shape Properties */}
        {selectedElement.type === 'shape' && (
          <ToolbarSection title="Shape Style" defaultOpen={true}>
            {selectedElement.shapeType !== 'line' && selectedElement.shapeType !== 'arrow' && (
              <div className="control-group">
                <label className="control-label">Fill Color</label>
                <div className="color-picker-wrapper">
                  <input 
                    type="color" 
                    value={selectedElement.fill} 
                    onChange={(e) => onUpdate({ fill: e.target.value })} 
                  />
                  <div className="color-preview" style={{ backgroundColor: selectedElement.fill }} />
                </div>
              </div>
            )}
            
            {(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') && (
              <>
                <div className="control-group">
                  <label className="control-label">Stroke Color</label>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={selectedElement.stroke} 
                      onChange={(e) => onUpdate({ stroke: e.target.value })} 
                    />
                    <div className="color-preview" style={{ backgroundColor: selectedElement.stroke }} />
                  </div>
                </div>
                <div className="control-group">
                  <label className="control-label">Thickness</label>
                  <input 
                    type="range" 
                    min="1" max="20" 
                    value={selectedElement.strokeWidth} 
                    onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
                  />
                </div>
              </>
            )}
          </ToolbarSection>
        )}

        {/* Drawing Properties */}
        {selectedElement.type === 'drawing' && (
          <ToolbarSection title="Drawing Style" defaultOpen={true}>
            <div className="control-group">
              <label className="control-label">Stroke Color</label>
              <div className="color-picker-wrapper">
                <input 
                  type="color" 
                  value={selectedElement.stroke} 
                  onChange={(e) => onUpdate({ stroke: e.target.value })} 
                />
                <div className="color-preview" style={{ backgroundColor: selectedElement.stroke }} />
              </div>
            </div>
            <div className="control-group">
              <label className="control-label">Thickness</label>
              <input 
                type="range" 
                min="1" max="50" 
                value={selectedElement.strokeWidth} 
                onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
              />
            </div>
          </ToolbarSection>
        )}

        {/* Actions */}
        <div className="toolbar-group" style={{ border: 'none', marginTop: 'auto' }}>
          <button 
            className="toolbar-btn delete" 
            onClick={() => onUpdate(null, 'delete')}
          >
            Delete Element
          </button>
        </div>
      </div>

      {/* Mobile Content Render */}
      <div className="mobile-toolbar-content">
        {activeTab === 'layout' ? renderMobileLayoutTools() : (
          <>
            {selectedElement.type === 'image' && renderMobileImageTools()}
            {selectedElement.type === 'text' && renderMobileTextTools()}
            {selectedElement.type === 'shape' && renderMobileShapeTools()}
            {selectedElement.type === 'drawing' && renderMobileDrawingTools()}
          </>
        )}
      </div>
    </div>
  )
}