'use client'
import { useState } from 'react'
import '@/styles/cover-editor/toolbar.css'
import '@/styles/editor/CaptionSection.css'

import { ToolbarSection } from './toolbar-panels/ToolbarSection'
import { ShapePropertiesPanel } from './toolbar-panels/ShapePanel'
import { MobileImagePanel, DesktopImagePanel } from './toolbar-panels/ImagePanel'
import { MobileTextPanel, DesktopTextPanel } from './toolbar-panels/TextPanel'
import { MobileLayoutPanel, DesktopRotationPanel, DesktopLayeringPanel } from './toolbar-panels/LayoutPanel'
import { MobileDrawingPanel, DesktopDrawingPanel } from './toolbar-panels/DrawingPanel'

export default function EditorToolbar({ selectedElement, onUpdate, onReorder, onClose, isInteractingWithCanvas }) {
  const [activeTab, setActiveTab] = useState('adjust') // 'adjust' | 'filters' | 'layout'

  if (!selectedElement) return <div className="editor-toolbar empty">Select an element to edit</div>

  return (
    <div className={`editor-toolbar ${isInteractingWithCanvas ? 'interaction-active' : ''}`}>
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
        {/* Common Properties: Layout (Rotation) */}
        <DesktopRotationPanel selectedElement={selectedElement} onUpdate={onUpdate} />

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <DesktopTextPanel selectedElement={selectedElement} onUpdate={onUpdate} />
        )}

        {/* Layering Controls */}
        <DesktopLayeringPanel onReorder={onReorder} />

        {/* Image Properties */}
        {selectedElement.type === 'image' && (
          <DesktopImagePanel selectedElement={selectedElement} onUpdate={onUpdate} />
        )}

        {/* Shape Properties */}
        {selectedElement.type === 'shape' && (
          <ToolbarSection title="Shape Style" defaultOpen={true}>
            <ShapePropertiesPanel selectedElement={selectedElement} onUpdate={onUpdate} isMobile={false} />
          </ToolbarSection>
        )}

        {/* Drawing Properties */}
        {selectedElement.type === 'drawing' && (
          <DesktopDrawingPanel selectedElement={selectedElement} onUpdate={onUpdate} />
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
        {activeTab === 'layout' ? (
          <MobileLayoutPanel selectedElement={selectedElement} onReorder={onReorder} onUpdate={onUpdate} />
        ) : (
          <>
            {selectedElement.type === 'image' && (
              <MobileImagePanel selectedElement={selectedElement} onUpdate={onUpdate} activeTab={activeTab} />
            )}
            {selectedElement.type === 'text' && (
              <MobileTextPanel selectedElement={selectedElement} onUpdate={onUpdate} />
            )}
            {selectedElement.type === 'shape' && (
               <ShapePropertiesPanel selectedElement={selectedElement} onUpdate={onUpdate} isMobile={true} />
            )}
            {selectedElement.type === 'drawing' && (
               <MobileDrawingPanel selectedElement={selectedElement} onUpdate={onUpdate} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
