'use client'
import React, { useState } from 'react'
import { FILTERS, IMAGE_TOOLS } from './constants'
import { ToolbarSection } from './ToolbarSection'

export const MobileImagePanel = ({ selectedElement, onUpdate, activeTab }) => {
  const [activeMobileTool, setActiveMobileTool] = useState(null)

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
          Delete
        </button>
      </div>
    </div>
  )
}

export const DesktopImagePanel = ({ selectedElement, onUpdate }) => {
  return (
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
  )
}
