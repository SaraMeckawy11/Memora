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
  { id: 'exposure', label: 'Exposure', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>, prop: 'exposure', min: 50, max: 150, default: 100 },
  { id: 'contrast', label: 'Contrast', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></svg>, prop: 'contrast', min: 50, max: 150, default: 100 },
  { id: 'saturation', label: 'Saturation', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.24 9.24a6 6 0 0 0-8.49-8.49L5 8.5a6 6 0 0 0 8.49 8.49l6.75-7.75z"/></svg>, prop: 'saturate', min: 0, max: 200, default: 100 },
  { id: 'brightness', label: 'Brightness', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M17.6 17.6l1.4 1.4M5 5l1.4 1.4M17.6 6.4l1.4-1.4M5 19l1.4-1.4"/></svg>, prop: 'brightness', min: 50, max: 150, default: 100 },
  { id: 'vignette', label: 'Vignette', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="9"/><circle cx="12" cy="12" r="4"/></svg>, prop: 'vignette', min: 0, max: 100, default: 0 },
  { id: 'blur', label: 'Blur', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, prop: 'blur', min: 0, max: 20, default: 0 },
  { id: 'sepia', label: 'Sepia', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, prop: 'sepia', min: 0, max: 100, default: 0 },
  { id: 'opacity', label: 'Opacity', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, prop: 'opacity', min: 0, max: 100, default: 100 },
  { id: 'hue', label: 'Hue', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>, prop: 'hueRotate', min: 0, max: 360, default: 0 },
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
        <span className="section-arrow">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4"/></svg>
        </span>
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
      <div className="mobile-compact-container">
        {/* Active Tool Slider */}
        {activeMobileTool && (
          <div className="mobile-slider-group" style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
            <div className="mobile-label-sm">
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
        <div className="mobile-tools-scroll" style={{ padding: '4px 0', gap: '8px' }}>
          {IMAGE_TOOLS.map((tool) => (
            <button 
              key={tool.id}
              className={`mobile-tool-btn ${activeMobileTool?.id === tool.id ? 'active' : ''}`}
              onClick={() => setActiveMobileTool(tool)}
              style={{ minWidth: '60px', flexDirection: 'column', gap: '4px', padding: '8px 4px' }}
            >
              <span className="tool-icon" style={{ marginBottom: 0 }}>{tool.icon}</span>
              <span className="tool-label" style={{ fontSize: '10px' }}>{tool.label}</span>
            </button>
          ))}
        </div>

        <div className="mobile-control-row" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
           <label className="mobile-action-btn secondary" style={{ cursor: 'pointer', flex: 1 }}>
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
            <span>📷 Replace</span>
          </label>
          
          <button className="mobile-action-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ flex: 1 }}>
            🗑️ Delete
          </button>
        </div>
      </div>
    )
  }

  const renderMobileTextTools = () => (
    <div className="mobile-compact-container">
      {/* Content Input */}
      <div className="mobile-control-row">
        <textarea
          className="mobile-textarea"
          value={selectedElement.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Type here..."
          rows={3}
          style={{ height: '70px' }}
        />
      </div>

      {/* Font Selection */}
      <div className="mobile-slider-group">
        <div className="mobile-label-sm">Font</div>
        <SearchableFontSelect 
          fonts={FONT_FAMILIES}
          selectedFont={selectedElement.fontFamily}
          onChange={(font) => onUpdate({ fontFamily: font })}
        />
      </div>

      {/* Formatting Row (Color, B, I, U, Align) */}
      <div className="mobile-control-row" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        <div className="mobile-color-preview" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
           <input 
              type="color" 
              className="mobile-color-input-hidden"
              value={selectedElement.color} 
              onChange={(e) => onUpdate({ color: e.target.value })} 
            />
            <div style={{ backgroundColor: selectedElement.color, width: '100%', height: '100%' }} />
        </div>

        <div style={{ width: '1px', height: '24px', background: '#E5E7EB', margin: '0 4px' }}></div>

        <button 
          className="mobile-tool-btn" 
          onClick={() => onUpdate({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
          style={{ background: selectedElement.fontWeight === 'bold' ? '#F3F4F6' : '#fff', width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
        >
          <span style={{ fontWeight: 800 }}>B</span>
        </button>
        <button 
          className="mobile-tool-btn" 
          onClick={() => onUpdate({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
          style={{ background: selectedElement.fontStyle === 'italic' ? '#F3F4F6' : '#fff', width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
        >
          <span style={{ fontStyle: 'italic' }}>I</span>
        </button>
        <button 
          className="mobile-tool-btn" 
          onClick={() => onUpdate({ textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
          style={{ background: selectedElement.textDecoration === 'underline' ? '#F3F4F6' : '#fff', width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>

         <div style={{ width: '1px', height: '24px', background: '#E5E7EB', margin: '0 4px' }}></div>

         {['left', 'center', 'right'].map(align => (
           <button 
            key={align}
            className="mobile-tool-btn" 
            onClick={() => onUpdate({ textAlign: align })}
            style={{ background: selectedElement.textAlign === align ? '#F3F4F6' : '#fff', width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
          >
            {align === 'left' && <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>}
            {align === 'center' && <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>}
            {align === 'right' && <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>}
          </button>
         ))}
      </div>

      {/* Sliders Grid */}
      <div className="mobile-control-grid">
         <div className="mobile-slider-group">
          <div className="mobile-label-sm">
            <span>Size</span>
            <span>{selectedElement.fontSize}</span>
          </div>
          <input 
            type="range" 
            min="10" max="200" 
            value={selectedElement.fontSize} 
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          />
        </div>
        <div className="mobile-slider-group">
           <div className="mobile-label-sm">
             <span>Space</span>
             <span>{(parseFloat(selectedElement.letterSpacing) || 0).toFixed(2)}</span>
           </div>
           <input 
            type="range" 
            min="-0.1" max="1.0" step="0.01"
            value={parseFloat(selectedElement.letterSpacing) || 0} 
            onChange={(e) => onUpdate({ letterSpacing: `${e.target.value}em` })}
          />
        </div>
      </div>
      
      {/* Delete Button */}
      <button className="mobile-action-btn delete" onClick={() => onUpdate(null, 'delete')}>
        🗑️ Delete Element
      </button>
    </div>
  )

  // Mobile View for Layout (Position, Size, Layering)
  const renderMobileLayoutTools = () => (
    <div className="mobile-compact-container">
      {/* Position/Dimensions Grid */}
      <div className="mobile-control-grid">
        <div>
          <div className="mobile-label-sm">X Pos</div>
          <input 
            type="number" 
            className="mobile-input-compact" 
            value={Math.round(selectedElement.x)} 
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
          />
        </div>
        <div>
          <div className="mobile-label-sm">Y Pos</div>
          <input 
            type="number" 
            className="mobile-input-compact" 
            value={Math.round(selectedElement.y)} 
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
          />
        </div>
        <div>
          <div className="mobile-label-sm">Width</div>
          <input 
            type="number" 
            className="mobile-input-compact" 
            value={Math.round(selectedElement.width)} 
            onChange={(e) => onUpdate({ width: Number(e.target.value) })}
          />
        </div>
        <div>
          <div className="mobile-label-sm">Height</div>
          <input 
            type="number" 
            className="mobile-input-compact" 
            value={Math.round(selectedElement.height)} 
            onChange={(e) => onUpdate({ height: Number(e.target.value) })}
          />
        </div>
      </div>
      
      {/* Rotation */}
      <div className="mobile-slider-group">
        <div className="mobile-label-sm">
          <span>Rotation</span>
          <span>{Math.round(selectedElement.rotation || 0)}°</span>
        </div>
        <input 
          type="range" 
          min="0" max="360" 
          value={selectedElement.rotation || 0} 
          onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
        />
      </div>

      {/* Layering Actions */}
      <div className="mobile-control-row">
         <button className="mobile-action-btn secondary" onClick={() => onReorder('forward')}>
           ↑ Forward
         </button>
         <button className="mobile-action-btn secondary" onClick={() => onReorder('backward')}>
           ↓ Backward
         </button>
      </div>

       <div className="mobile-control-row">
         <button className="mobile-action-btn secondary" onClick={() => onReorder('front')}>
           ⇈ To Front
         </button>
         <button className="mobile-action-btn secondary" onClick={() => onReorder('back')}>
           ⇊ To Back
         </button>
      </div>
    </div>
  )

  // Mobile View for Shape Properties
  const renderMobileShapeTools = () => {
    const isLine = selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow';
    
    return (
    <div className="mobile-compact-container">
       {/* Shape Type Selector */}
       {!isLine && (
         <div className="mobile-control-row" style={{ justifyContent: 'space-around', marginBottom: '12px', background: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
            {['rect', 'circle', 'triangle', 'star'].map(type => (
              <button 
                key={type}
                className={`mobile-tool-btn ${(!selectedElement.shapeType && type === 'rect') || selectedElement.shapeType === type ? 'active' : ''}`}
                onClick={() => onUpdate({ shapeType: type === 'rect' ? null : type })}
                style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent' }}
                title={type}
              >
                {type === 'rect' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
                )}
                {type === 'circle' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/></svg>
                )}
                {type === 'triangle' && (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3l10 18H2L12 3z" strokeLinejoin="round"/></svg>
                )}
                {type === 'star' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round"/></svg>
                )}
              </button>
            ))}
         </div>
       )}

       {/* Fill Color */}
       <div className="mobile-control-row">
          <div className="mobile-label-sm">Fill</div>
          <div className="mobile-color-preview" style={{ width: '100%', height: '40px' }}>
             <input 
                type="color" 
                className="mobile-color-input-hidden"
                value={selectedElement.fill || selectedElement.stroke || '#000000'} 
                onChange={(e) => isLine 
                  ? onUpdate({ stroke: e.target.value }) 
                  : onUpdate({ fill: e.target.value })
                } 
              />
              <div style={{ backgroundColor: selectedElement.fill || selectedElement.stroke, width: '100%', height: '100%', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
          </div>
       </div>

       {/* Border Controls */}
       <div className="mobile-subheader" style={{ marginTop: '12px', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Border</div>
       <div className="mobile-control-row">
          <div className="mobile-color-preview" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
             <input 
                type="color" 
                className="mobile-color-input-hidden"
                value={isLine ? selectedElement.stroke : (selectedElement.options?.stroke || '#000000')} 
                onChange={(e) => isLine 
                  ? onUpdate({ stroke: e.target.value }) 
                  : onUpdate({ options: { ...selectedElement.options, stroke: e.target.value } })
                } 
              />
              <div 
                style={{ 
                  backgroundColor: !isLine ? (selectedElement.options?.stroke || 'transparent') : selectedElement.stroke, 
                  width: '100%', height: '100%', borderRadius: '6px', border: '1px solid #e5e7eb', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}
              >
                 {(!isLine && !selectedElement.options?.stroke) && <div style={{ width: '2px', height: '100%', background: 'red', transform: 'rotate(45deg)' }}></div>}
              </div>
          </div>
           
          <div className="mobile-slider-group" style={{ flex: 1, marginLeft: '12px' }}>
             <div className="mobile-label-sm">
                <span>Thickness</span>
                <span>{isLine ? selectedElement.strokeWidth : (selectedElement.options?.strokeWidth || 0)}px</span>
             </div>
             <input 
                type="range" 
                min="0" max="20" 
                value={isLine ? selectedElement.strokeWidth : (selectedElement.options?.strokeWidth || 0)} 
                onChange={(e) => isLine
                  ? onUpdate({ strokeWidth: Number(e.target.value) })
                  : onUpdate({ options: { ...selectedElement.options, strokeWidth: Number(e.target.value) } })
                }
              />
          </div>
       </div>

       {/* Radius & Opacity Grid */}
       <div className="mobile-control-grid" style={{ marginTop: '12px' }}>
         {(!selectedElement.shapeType || selectedElement.shapeType === 'rect') && !isLine && (
            <div className="mobile-slider-group">
                <div className="mobile-label-sm">Radius</div>
                <input 
                  type="range" 
                  min="0" max="50" 
                  value={selectedElement.options?.borderRadius || 0} 
                  onChange={(e) => onUpdate({ options: { ...selectedElement.options, borderRadius: Number(e.target.value) } })}
                />
            </div>
         )}
         
         <div className="mobile-slider-group">
            <div className="mobile-label-sm">Opacity</div>
            <input 
              type="range" 
              min="0" max="100" 
              value={selectedElement.opacity !== undefined ? (selectedElement.opacity <= 1 ? selectedElement.opacity * 100 : selectedElement.opacity) : 100} 
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) / 100 })}
            />
         </div>
       </div>

        <button className="mobile-action-btn delete" onClick={() => onUpdate(null, 'delete')}>
          🗑️ Delete Shape
        </button>
    </div>
  )}

  // Mobile View for Drawing (Stroke) Properties
  const renderMobileDrawingTools = () => (
    <div className="mobile-compact-container">
       <div className="mobile-control-row">
          <div className="mobile-label-sm">Color</div>
          <div className="mobile-color-preview" style={{ width: '100%', maxWidth: '200px' }}>
             <input 
                type="color" 
                className="mobile-color-input-hidden"
                value={selectedElement.stroke} 
                onChange={(e) => onUpdate({ stroke: e.target.value })} 
              />
              <div style={{ backgroundColor: selectedElement.stroke, width: '100%', height: '100%' }} />
          </div>
       </div>

       <div className="mobile-slider-group">
          <div className="mobile-label-sm">
            <span>Thickness</span>
            <span>{selectedElement.strokeWidth}px</span>
          </div>
          <input 
            type="range" 
            min="1" max="50" 
            value={selectedElement.strokeWidth} 
            onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
          />
       </div>

       <div className="mobile-slider-group">
          <div className="mobile-label-sm">
            <span>Opacity</span>
            <span>{Math.round((selectedElement.opacity || 1) * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0.1" max="1" step="0.1"
            value={selectedElement.opacity || 1} 
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
          />
       </div>
        
        <button className="mobile-action-btn delete" onClick={() => onUpdate(null, 'delete')}>
          🗑️ Delete Drawing
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
            {/* Shape Switcher */}
            {(selectedElement.shapeType !== 'line' && selectedElement.shapeType !== 'arrow') && (
              <div className="control-group">
                <label className="control-label">Shape Type</label>
                <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['rect', 'circle', 'triangle', 'star'].map(type => (
                    <button 
                      key={type}
                      className={`toolbar-btn icon-only ${(!selectedElement.shapeType && type === 'rect') || selectedElement.shapeType === type ? 'active' : ''}`}
                      onClick={() => onUpdate({ shapeType: type === 'rect' ? null : type })}
                      title={type.charAt(0).toUpperCase() + type.slice(1)}
                      style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {type === 'rect' && <div style={{width:'14px', height:'14px', border:'2px solid currentColor', borderRadius:'2px'}}></div>}
                      {type === 'circle' && <div style={{width:'16px', height:'16px', border:'2px solid currentColor', borderRadius:'50%'}}></div>}
                      {type === 'triangle' && <div style={{width:0, height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderBottom:'12px solid currentColor'}}></div>}
                      {type === 'star' && <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fill Color */}
            {(selectedElement.shapeType !== 'line' && selectedElement.shapeType !== 'arrow') && (
              <div className="control-group">
                <label className="control-label">Fill Color</label>
                <div className="color-picker-wrapper">
                  <input 
                    type="color" 
                    value={selectedElement.fill || '#000000'} 
                    onChange={(e) => onUpdate({ fill: e.target.value })} 
                  />
                  <div className="color-preview" style={{ backgroundColor: selectedElement.fill || 'transparent', border: !selectedElement.fill ? '1px dashed #ccc' : 'none' }} />
                  <span className="color-value">{selectedElement.fill || 'None'}</span>
                </div>
              </div>
            )}
            
            {/* Border / Stroke Controls (Compact Group) */}
            <div className="control-group">
              <label className="control-label">
                {(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') ? 'Line Style' : 'Border Style'}
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Color Picker */}
                <div className="color-picker-wrapper" style={{ width: '42px', flexShrink: 0 }} title="Border Color">
                  <input 
                    type="color" 
                    value={
                      (selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') 
                      ? selectedElement.stroke 
                      : (selectedElement.options?.stroke || '#000000')
                    } 
                    onChange={(e) => (selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') 
                      ? onUpdate({ stroke: e.target.value }) 
                      : onUpdate({ options: { ...selectedElement.options, stroke: e.target.value } })
                    } 
                  />
                  <div 
                    className="color-preview" 
                    style={{ 
                      backgroundColor: (selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') 
                        ? selectedElement.stroke 
                        : (selectedElement.options?.stroke || 'transparent'),
                      border: '1px solid #e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '100%', height: '100%'
                    }} 
                  >
                     {(!(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') && !selectedElement.options?.stroke) && (
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/></svg>
                     )}
                  </div>
                </div>

                {/* Thickness Slider */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>
                      <span>Thickness</span>
                      <span>{(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') ? selectedElement.strokeWidth : (selectedElement.options?.strokeWidth || 0)}px</span>
                   </div>
                   <input 
                      type="range" 
                      min="0" max="20" 
                      className="toolbar-slider"
                      value={(selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow') ? selectedElement.strokeWidth : (selectedElement.options?.strokeWidth || 0)} 
                      onChange={(e) => (selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow')
                        ? onUpdate({ strokeWidth: Number(e.target.value) })
                        : onUpdate({ options: { ...selectedElement.options, strokeWidth: Number(e.target.value) } })
                      }
                      style={{ width: '100%', height: '4px', accentColor: '#3b82f6' }}
                    />
                </div>
              </div>
            </div>

            {/* Radius (Rect Only) */}
            {(!selectedElement.shapeType || selectedElement.shapeType === 'rect') && (
              <div className="control-group">
                <label className="control-label">
                  <span>Corner Radius</span>
                  <span>{selectedElement.options?.borderRadius || 0}px</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={selectedElement.options?.borderRadius || 0} 
                  onChange={(e) => onUpdate({ options: { ...selectedElement.options, borderRadius: Number(e.target.value) } })}
                />
              </div>
            )}

            {/* Opacity */}
            <div className="control-group">
              <label className="control-label">
                <span>Opacity</span>
                <span>{Math.round((selectedElement.opacity !== undefined ? (selectedElement.opacity <= 1 ? selectedElement.opacity : selectedElement.opacity/100) : 1) * 100)}%</span>
              </label>
              <input 
                type="range" 
                min="0" max="100" 
                value={selectedElement.opacity !== undefined ? (selectedElement.opacity <= 1 ? selectedElement.opacity * 100 : selectedElement.opacity) : 100} 
                onChange={(e) => onUpdate({ opacity: Number(e.target.value) / 100 })}
              />
            </div>
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