'use client'
import React from 'react'
import { ToolbarSection } from './ToolbarSection'

export const MobileLayoutPanel = ({ selectedElement, onReorder, onUpdate }) => {
  return (
    <div className="mobile-compact-container">
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
}

export const DesktopRotationPanel = ({ selectedElement, onUpdate }) => {
  return (
    <ToolbarSection title="Rotation" defaultOpen={true}>
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
  )
}

export const DesktopLayeringPanel = ({ onReorder }) => {
  return (
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
  )
}
