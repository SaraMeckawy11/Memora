'use client'
import React from 'react'
import { ToolbarSection } from './ToolbarSection'

export const MobileDrawingPanel = ({ selectedElement, onUpdate }) => {
  return (
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
    </div>
  )
}

export const DesktopDrawingPanel = ({ selectedElement, onUpdate }) => {
  return (
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
  )
}
