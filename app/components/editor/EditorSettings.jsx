'use client'
import { useState, useEffect } from 'react'
import PhotoLibrary from './PhotoLibrary'
import '@/styles/editor/editor-settings.css'

/* =========================================
   Helper: Visual layout icon component
   ========================================= */
function LayoutIcon({ template, isSelected }) {
  const boxClass = `layout-icon-box ${isSelected ? 'active' : 'inactive'}`
  const icons = {
    single: <div className="layout-icon single"><div className={boxClass} /></div>,
    '2-horizontal': <div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div>,
    '2-vertical': <div className="layout-icon rows-2"><div className={boxClass} /><div className={boxClass} /></div>,
    '1-top-2-bottom': (
      <div className="layout-icon rows-2"><div className={boxClass} /><div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div></div>
    ),
    '2-top-1-bottom': (
      <div className="layout-icon rows-2"><div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div><div className={boxClass} /></div>
    ),
    '4-grid': <div className="layout-icon grid-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
    '6-grid': <div className="layout-icon grid-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
  }
  return icons[template] || icons.single
}

/* =========================================
   Main Component
   ========================================= */
export default function EditorSettings(props) {
  // Destructure all props for easy access
  const {
    layouts, selectedLayout, updatePageLayout,
    pageMargin, setPageMargin, pageGutter, setPageGutter, pageBgColor, setPageBgColor,
    imageBorderRadius, setImageBorderRadius, imageFitMode, setImageFitMode,
    showPageNumbers, setShowPageNumbers,
    selectedCaption, updateCaption, fontFamilies, selectedFontFamily, selectedFontSize, selectedFontColor, captionPosition, captionAlignment, updateCaptionStyle,
    applyToAllPages, uploadedImages, currentPage, addImageToPage,
    selectedSlotIdx, openImageEditor,
    autoSave, setAutoSave, clearProgress,
    layoutSplitX, layoutSplitY, updateLayoutSplitX, updateLayoutSplitY,
  } = props

  const selectedImage = selectedSlotIdx !== null && currentPage?.images?.[selectedSlotIdx]

  // STATE: Track which tab is open on mobile
  const [activeMobileTab, setActiveMobileTab] = useState(null)

  // Close mobile drawer when clicking outside (optional safety)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setActiveMobileTab(null)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* RENDERERS: We define these as functions so we can 
     render them in the Sidebar (Desktop) OR the Drawer (Mobile) 
  */

  const renderLayoutSection = () => (
    <div className="editor-card">
      <h4>Layout</h4>
      <div className="layout-grid-container">
        {layouts.map(layout => (
          <button
            key={layout.id}
            onClick={() => updatePageLayout(layout.id)}
            className={`layout-btn ${selectedLayout === layout.id ? 'active' : 'inactive'}`}
            title={layout.name}
          >
            <LayoutIcon template={layout.template} isSelected={selectedLayout === layout.id} />
            <span className="layout-name">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderPageSettingsSection = () => (
    <div className="editor-card">
      <h4>Page Settings</h4>
      <div className="control-group">
        {/* Sliders */}
        <div>
          <label className="control-label">Margin & Gutter</label>
          <div className="inline-row">
            <input type="range" min="0" max="60" value={pageMargin} onChange={e => setPageMargin(+e.target.value)} className="control-range" title="Margin" />
            <input type="range" min="0" max="40" value={pageGutter} onChange={e => setPageGutter(+e.target.value)} className="control-range" title="Gutter" />
          </div>
        </div>

        {/* Split Controls */}
        <div className="control-group">
          <label className="control-label">Split Adjustments (H/V)</label>
          <div className="inline-row">
            <input type="range" min="20" max="80" value={layoutSplitX} onChange={e => updateLayoutSplitX(+e.target.value)} className="control-range" />
            <input type="range" min="20" max="80" value={layoutSplitY} onChange={e => updateLayoutSplitY(+e.target.value)} className="control-range" />
          </div>
        </div>

        <div className="inline-row">
          <div className="inline-col">
            <label className="control-label">Bg Color</label>
            <input type="color" value={pageBgColor} onChange={e => setPageBgColor(e.target.value)} className="control-color" />
          </div>
          <div className="inline-col">
            <label className="control-label">Radius</label>
            <input type="number" min="0" max="20" value={imageBorderRadius} onChange={e => setImageBorderRadius(+e.target.value)} className="control-input" />
          </div>
        </div>

        <div>
          <label className="control-label">Image Fit</label>
          <select value={imageFitMode} onChange={e => setImageFitMode(e.target.value)} className="control-input">
            <option value="cover">Cover (Fill)</option>
            <option value="contain">Contain (Fit)</option>
            <option value="fill">Stretch</option>
          </select>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" checked={showPageNumbers} onChange={e => setShowPageNumbers(e.target.checked)} />
          <label className="checkbox-label">Show page numbers</label>
        </div>
      </div>
    </div>
  )

  const renderCaptionSection = () => (
    <div className="editor-card">
      <h4>Caption</h4>
      <textarea value={selectedCaption} onChange={e => updateCaption(e.target.value)} placeholder="Add caption..." className="caption-textarea" />
      <div className="caption-grid">
        <div>
          <label className="caption-label">Font</label>
          <select value={selectedFontFamily} onChange={e => updateCaptionStyle('fontFamily', e.target.value)} className="caption-select">
            {fontFamilies.map(font => <option key={font.name} value={font.name}>{font.label}</option>)}
          </select>
        </div>
        <div>
          <label className="caption-label">Size</label>
          <select value={selectedFontSize} onChange={e => updateCaptionStyle('fontSize', +e.target.value)} className="caption-select">
            {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => <option key={size} value={size}>{size}px</option>)}
          </select>
        </div>
        <div>
          <label className="caption-label">Color</label>
          <input type="color" value={selectedFontColor} onChange={e => updateCaptionStyle('color', e.target.value)} className="caption-color" />
        </div>
        <div>
          <label className="caption-label">Position</label>
          <select value={captionPosition} onChange={e => updateCaptionStyle('position', e.target.value)} className="caption-select">
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>
      <div className="caption-align-wrapper">
        <label className="caption-label">Alignment</label>
        <div className="caption-align">
          {['left', 'center', 'right'].map(align => (
            <button key={align} onClick={() => updateCaptionStyle('alignment', align)} className={captionAlignment === align ? 'active' : 'inactive'}>
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderImageActions = () => selectedImage && (
    <div className="editor-card">
      <h4>Image Options</h4>
      <button className="btn-secondary" onClick={() => openImageEditor(selectedSlotIdx)}>Edit selected image</button>
    </div>
  )

  const renderGlobalActions = () => (
    <div className="editor-card action-card">
      <button className="apply-btn" onClick={applyToAllPages}>Apply to all pages</button>
      <div className="auto-save">
        <span className="auto-save-label">Auto-save</span>
        <label className={`switch ${autoSave ? 'checked' : 'unchecked'}`}>
          <input type="checkbox" checked={autoSave} onChange={e => setAutoSave(e.target.checked)} />
          <span className="switch-track"><span className="switch-thumb" /></span>
        </label>
      </div>
      <button className="clear-btn" onClick={clearProgress}>Clear All</button>
    </div>
  )

  /* =========================================
     Definitions for Mobile Tabs
     ========================================= */
  const mobileTabs = [
    { id: 'layout', label: 'Layout', icon: '⊞', content: renderLayoutSection },
    { id: 'page', label: 'Page', icon: '⚙️', content: renderPageSettingsSection },
    { id: 'caption', label: 'Text', icon: 'Aa', content: renderCaptionSection },
    { id: 'photos', label: 'Photos', icon: '🖼️', content: () => <PhotoLibrary uploadedImages={uploadedImages} currentPage={currentPage} addImageToPage={addImageToPage} /> },
    { id: 'actions', label: 'Actions', icon: '💾', content: renderGlobalActions },
  ]
  
  // If an image is selected, add Image tab
  if (selectedImage) {
    mobileTabs.splice(1, 0, { id: 'image', label: 'Edit Img', icon: '🎨', content: renderImageActions })
  }

  return (
    <>
      {/* ================= DESKTOP VIEW (Stacked Sidebar) ================= */}
      <div className="editor-settings desktop-view">
        {renderLayoutSection()}
        {renderPageSettingsSection()}
        {renderImageActions()}
        {renderCaptionSection()}
        {renderGlobalActions()}
        <PhotoLibrary uploadedImages={uploadedImages} currentPage={currentPage} addImageToPage={addImageToPage} />
      </div>

      {/* ================= MOBILE VIEW (Bottom Bar + Drawer) ================= */}
      <div className="mobile-interface">
        
        {/* 1. The Drawer (Slide Up Content) */}
        <div className={`mobile-drawer ${activeMobileTab ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <h4>{mobileTabs.find(t => t.id === activeMobileTab)?.label}</h4>
            <button className="close-drawer" onClick={() => setActiveMobileTab(null)}>×</button>
          </div>
          <div className="mobile-drawer-content">
            {mobileTabs.find(t => t.id === activeMobileTab)?.content()}
          </div>
        </div>

        {/* 2. The Bottom Navigation Bar */}
        <div className="mobile-bottom-bar">
          {mobileTabs.map(tab => (
            <button 
              key={tab.id} 
              className={`mobile-tab-btn ${activeMobileTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveMobileTab(activeMobileTab === tab.id ? null : tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. Backdrop (Darken background when drawer open) */}
        {activeMobileTab && <div className="mobile-backdrop" onClick={() => setActiveMobileTab(null)} />}
      </div>
    </>
  )
}