'use client'
import React from 'react'
import SearchableFontSelect from '../SearchableFontSelect'
import { FONT_LIST } from '../FontLoader'
import { FONT_SIZES } from './constants'
import { ToolbarSection } from './ToolbarSection'

const FONT_FAMILIES = FONT_LIST

export const MobileTextPanel = ({ selectedElement, onUpdate }) => {
  return (
    <div className="mobile-compact-container" style={{ padding: '16px' }}>
      <textarea
        className="caption-textarea"
        value={selectedElement.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Type here..."
        style={{ marginBottom: '16px', height: 'auto', minHeight: '60px' }}
      />

      <div className="caption-controls">
        <div className="caption-row">
          <div>
            <label className="caption-label">Font</label>
            <SearchableFontSelect 
              fonts={FONT_FAMILIES}
              selectedFont={selectedElement.fontFamily}
              onChange={(font) => onUpdate({ fontFamily: font })}
            />
          </div>

          <div>
            <label className="caption-label">Size</label>
            <select
              value={selectedElement.fontSize}
              onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
              className="caption-select"
            >
              {FONT_SIZES.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>

        <div className="caption-row">
          <div>
            <label className="caption-label">Color</label>
            <div className="caption-color" style={{ position: 'relative', overflow: 'hidden' }}>
                <input 
                  type="color" 
                  value={selectedElement.color} 
                  onChange={(e) => onUpdate({ color: e.target.value })} 
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    opacity: 0, cursor: 'pointer' 
                  }} 
                />
                <div style={{ width: '100%', height: '100%', backgroundColor: selectedElement.color }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
             <button 
               className={`caption-select ${selectedElement.fontWeight === 'bold' ? 'active' : ''}`}
               onClick={() => onUpdate({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
               style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', background: selectedElement.fontWeight === 'bold' ? '#e0e0e0' : '#fff' }}
             >B</button>
             <button 
               className={`caption-select ${selectedElement.fontStyle === 'italic' ? 'active' : ''}`}
               onClick={() => onUpdate({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
               style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', background: selectedElement.fontStyle === 'italic' ? '#e0e0e0' : '#fff' }}
             >I</button>
             <button 
               className={`caption-select ${selectedElement.textDecoration === 'underline' ? 'active' : ''}`}
               onClick={() => onUpdate({ textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
               style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'underline', background: selectedElement.textDecoration === 'underline' ? '#e0e0e0' : '#fff' }}
             >U</button>
          </div>
        </div>
      </div>

      <div className="caption-align-wrapper" style={{ marginTop: '12px' }}>
        <label className="caption-label">Alignment</label>
        <div className="caption-align">
          {['left', 'center', 'right'].map(align => (
            <button
              key={align}
              onClick={() => onUpdate({ textAlign: align })}
              className={`caption-select ${selectedElement.textAlign === align ? 'active' : ''}`}
              style={{ 
                flex: 1, 
                background: selectedElement.textAlign === align ? '#e0e0e0' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

       <div className="control-group" style={{ marginTop: '16px' }}>
        <label className="caption-label">Line Spacing</label>
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
        <label className="caption-label">Letter Spacing</label>
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
      
      {/* Delete Button */}
      <button className="mobile-action-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ marginTop: '24px' }}>
        Delete Element
      </button>
    </div>
  )
}

export const DesktopTextPanel = ({ selectedElement, onUpdate }) => {
  return (
    <ToolbarSection title="Text Style" defaultOpen={true}>
      <div style={{ padding: '0 4px' }}>
        <div className="control-group">
          <textarea 
            className="caption-textarea" 
            rows={3}
            value={selectedElement.content} 
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Type here..."
            style={{ width: '100%', marginBottom: '12px' }}
          />
        </div>

        <div className="caption-row">
          <div>
            <label className="caption-label">Font</label>
            <SearchableFontSelect 
              fonts={FONT_FAMILIES}
              selectedFont={selectedElement.fontFamily}
              onChange={(font) => onUpdate({ fontFamily: font })}
            />
          </div>
          
          <div>
            <label className="caption-label">Size</label>
            <select
              value={selectedElement.fontSize}
              onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
              className="caption-select"
            >
              {FONT_SIZES.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>

        <div className="caption-row">
          <div>
            <label className="caption-label">Color</label>
            <div className="caption-color" style={{ position: 'relative', overflow: 'hidden' }}>
                <input 
                  type="color" 
                  value={selectedElement.color} 
                  onChange={(e) => onUpdate({ color: e.target.value })} 
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    opacity: 0, cursor: 'pointer' 
                  }} 
                />
                <div style={{ width: '100%', height: '100%', backgroundColor: selectedElement.color }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
             <button 
               className={`caption-select ${selectedElement.fontWeight === 'bold' ? 'active' : ''}`}
               onClick={() => onUpdate({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
               style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', background: selectedElement.fontWeight === 'bold' ? '#e0e0e0' : '#fff' }}
             >B</button>
             <button 
               className={`caption-select ${selectedElement.fontStyle === 'italic' ? 'active' : ''}`}
               onClick={() => onUpdate({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
               style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', background: selectedElement.fontStyle === 'italic' ? '#e0e0e0' : '#fff' }}
             >I</button>
             <button 
               className={`caption-select ${selectedElement.textDecoration === 'underline' ? 'active' : ''}`}
               onClick={() => onUpdate({ textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
               style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'underline', background: selectedElement.textDecoration === 'underline' ? '#e0e0e0' : '#fff' }}
             >U</button>
          </div>
        </div>

        <div className="caption-align-wrapper" style={{ marginTop: '12px' }}>
          <label className="caption-label">Alignment</label>
          <div className="caption-align">
            {['left', 'center', 'right'].map(align => (
              <button
                key={align}
                onClick={() => onUpdate({ textAlign: align })}
                className={`caption-select ${selectedElement.textAlign === align ? 'active' : ''}`}
                style={{ 
                  flex: 1, 
                  background: selectedElement.textAlign === align ? '#e0e0e0' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

         <div className="control-group" style={{ marginTop: '16px' }}>
          <label className="caption-label">Line Spacing</label>
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
          <label className="caption-label">Letter Spacing</label>
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
      </div>
    </ToolbarSection>
  )
}
