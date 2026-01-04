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
          
          <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ color: '#ef4444' }}>
            <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>🗑️</span>
            <span className="tool-label">Delete</span>
          </button>
        </div>
      </div>
    )
  }

  const renderMobileTextTools = () => (
    <div className="mobile-tools-container">
      {/* Font Family & Size Row */}
      <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Font</div>
          <SearchableFontSelect 
            fonts={FONT_FAMILIES}
            selectedFont={selectedElement.fontFamily}
            onChange={(font) => onUpdate({ fontFamily: font })}
          />
        </div>
        <div style={{ width: '80px' }}>
          <div className="tool-header" style={{ marginBottom: '0.25rem' }}>Size</div>
          <input 
            type="number" 
            className="toolbar-input" 
            value={selectedElement.fontSize} 
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            style={{ padding: '0.4rem' }}
          />
        </div>
      </div>

      {/* Size Slider */}
      <div className="mobile-active-tool-slider" style={{ paddingTop: 0 }}>
        <input 
          type="range" 
          min="10" 
          max="200" 
          value={selectedElement.fontSize} 
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
        />
      </div>

      {/* Style Buttons Row */}
      <div className="mobile-tools-scroll">
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
      
      {/* Layering & Delete */}
      <div className="mobile-tools-scroll" style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.5rem' }}>
        <button className="mobile-tool-btn" onClick={() => onReorder('front')}>
          <span className="tool-icon">↑</span>
          <span className="tool-label">To Front</span>
        </button>
        <button className="mobile-tool-btn" onClick={() => onReorder('back')}>
          <span className="tool-icon">↓</span>
          <span className="tool-label">To Back</span>
        </button>
        <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ marginLeft: 'auto', color: '#ef4444' }}>
          <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>🗑️</span>
          <span className="tool-label">Delete</span>
        </button>
      </div>
    </div>
  )

  const renderMobileShapeTools = () => (
    <div className="mobile-tools-container">
       <div className="mobile-tools-scroll">
        <div className="color-picker-wrapper mobile-tool-btn">
           <input 
              type="color" 
              value={selectedElement.fill || selectedElement.stroke} 
              onChange={(e) => onUpdate(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow' ? { stroke: e.target.value } : { fill: e.target.value })} 
            />
            <span className="tool-icon" style={{backgroundColor: selectedElement.fill || selectedElement.stroke}}></span>
            <span className="tool-label">Color</span>
        </div>
        
        <button className="mobile-tool-btn" onClick={() => onReorder('front')}>
          <span className="tool-icon">↑</span>
          <span className="tool-label">To Front</span>
        </button>
        <button className="mobile-tool-btn" onClick={() => onReorder('back')}>
          <span className="tool-icon">↓</span>
          <span className="tool-label">To Back</span>
        </button>
        <button className="mobile-tool-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ marginLeft: 'auto', color: '#ef4444' }}>
          <span className="tool-icon" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>🗑️</span>
          <span className="tool-label">Delete</span>
        </button>
      </div>
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
        {selectedElement.type === 'image' && renderMobileImageTools()}
        {selectedElement.type === 'text' && renderMobileTextTools()}
        {selectedElement.type === 'shape' && renderMobileShapeTools()}
        {selectedElement.type === 'drawing' && (
           <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
            Drawing properties are set in the sidebar
          </div>
        )}
      </div>
    </div>
  )
}