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
   Modern SVG Icons for Mobile Tabs
   ========================================= */
const TabIcons = {
  layout: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  page: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
    </svg>
  ),
  caption: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
    </svg>
  ),
  photos: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  actions: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  image: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
}

/* =========================================
   Main Component
   ========================================= */
export default function EditorSettings(props) {
  // Destructure all props for easy access
  const {
    layouts, selectedLayout, updatePageLayout,
    pageMargin, setPageMargin, pageGutter, setPageGutter, pageBgColor, setPageBgColor,
    pageMarginEffective, pageGutterEffective,
    setPageMarginForCurrentPage, setPageGutterForCurrentPage,
    clearPageMarginOverride, clearPageGutterOverride,
    imageBorderRadius, setImageBorderRadius, imageFitMode, setImageFitMode,
    showPageNumbers, setShowPageNumbers,
    selectedCaption, updateCaption, fontFamilies, selectedFontFamily, selectedFontSize, selectedFontColor, captionPosition, captionAlignment, updateCaptionStyle,
    applyToAllPages, uploadedImages, pages, currentPage, addImageToPage,
    selectedSlotIdx, openImageEditor,
    autoSave, setAutoSave, clearProgress,
    layoutSplitX, layoutSplitY, updateLayoutSplitX, updateLayoutSplitY,
  } = props

  const selectedImageId =
    selectedSlotIdx !== null && selectedSlotIdx !== undefined
      ? currentPage?.images?.[selectedSlotIdx]
      : null

  const selectedImageObj = selectedImageId
    ? uploadedImages?.find((img) => img.id === selectedImageId)
    : null

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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.5rem',
          }}
        >
          {layouts.map(layout => (
            <button
              key={layout.id}
              onClick={() => updatePageLayout(layout.id)}
              className={`layout-btn ${selectedLayout === layout.id ? 'active' : 'inactive'}`}
              title={layout.name}
            >
              <LayoutIcon
                template={layout.template}
                isSelected={selectedLayout === layout.id}
              />
              <span className="layout-name">{layout.name}</span>
            </button>
          ))}
        </div>
      </div>
  )

  const renderImageActions = () =>
    selectedImageId ? (
      <div className="editor-card">
        <h4>Selected image</h4>

        <div className="image-card">
          <div className="image-card-meta">
            <div
              className="image-card-title"
              title={selectedImageObj?.name || 'Selected image'}
            >
              {selectedImageObj?.name || 'Selected image'}
            </div>
            <div className="image-card-sub">Slot {selectedSlotIdx + 1}</div>
          </div>

          <div className="image-card-actions">
            <button
              className="btn-modern btn-modern-primary btn-edit-img"
              onClick={() => openImageEditor(selectedSlotIdx)}
              type="button"
            >
              <span className="btn-icon-glyph" aria-hidden="true">✦</span>
              Edit
            </button>
          </div>
        </div>

        <div className="hint-muted">
          Tip: drag a filled slot onto another slot to swap images.
        </div>
      </div>
    ) : null

  const renderGlobalActions = () => (
    <div className="editor-card action-card">
      {/* Apply-to-all removed per request */}

      <div className="action-row">
        <div className="action-row-left">
          <div className="action-title">Auto-save</div>
          <div className="action-subtitle">Keep your progress saved automatically.</div>
        </div>

        <label
          className={`switch ${autoSave ? 'checked' : 'unchecked'}`}
          aria-label="Auto-save"
        >
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          <span className="switch-track">
            <span className="switch-thumb" />
          </span>
        </label>
      </div>

      <div className="action-row action-danger">
        <div className="action-row-left">
          <div className="action-title">Clear saved progress</div>
          <div className="action-subtitle">This can’t be undone.</div>
        </div>

        <button
          className="btn-modern btn-modern-danger"
          onClick={clearProgress}
          type="button"
        >
          <span className="btn-icon-glyph" aria-hidden="true">⟲</span>
          Clear
        </button>
      </div>
    </div>
  )

  const renderPageSettingsSection = () => (
    <div className="editor-card">
        <h4>Page Settings</h4>

        {/* Per-page overrides (fallback to globals) */}
        <div className="control-group">
          <div className="control-subgroup">
            <div className='control-sub'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <label className="control-label">Margin (this page)</label>
                {typeof currentPage?.pageMargin === 'number' && (
                  <button
                    type="button"
                    className="btn-modern"
                    onClick={clearPageMarginOverride}
                    title="Reset per-page margin"
                  >
                    Reset
                  </button>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={typeof pageMarginEffective === 'number' ? pageMarginEffective : pageMargin}
                onChange={e => setPageMarginForCurrentPage(+e.target.value)}
                className="control-range"
              />
              <span className="control-value">{(typeof pageMarginEffective === 'number' ? pageMarginEffective : pageMargin)}px</span>
            </div>

            <div className='control-sub'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <label className="control-label">Gutter (this page)</label>
                {typeof currentPage?.pageGutter === 'number' && (
                  <button
                    type="button"
                    className="btn-modern"
                    onClick={clearPageGutterOverride}
                    title="Reset per-page gutter"
                  >
                    Reset
                  </button>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={typeof pageGutterEffective === 'number' ? pageGutterEffective : pageGutter}
                onChange={e => setPageGutterForCurrentPage(+e.target.value)}
                className="control-range"
              />
              <span className="control-value">{(typeof pageGutterEffective === 'number' ? pageGutterEffective : pageGutter)}px</span>
            </div>
          </div>
        </div>

        <div className="control-group">
          <div className="control-subgroup">
            <div className='control-sub'>
              <label className="control-label">Margin (global)</label>
              <input
                type="range"
                min="0"
                max="60"
                value={pageMargin}
                onChange={e => setPageMargin(+e.target.value)}
                className="control-range"
              />
              <span className="control-value">{pageMargin}px</span>
            </div>

            <div className='control-sub'>
              <label className="control-label">Gutter (global)</label>
              <input
                type="range"
                min="0"
                max="40"
                value={pageGutter}
                onChange={e => setPageGutter(+e.target.value)}
                className="control-range"
              />
              <span className="control-value">{pageGutter}px</span>
            </div>

          </div>

          <div className="control-group">
            <div className="control-subgroup">
              <div>
                <label>Horizontal Split</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={layoutSplitX}
                  onChange={e => updateLayoutSplitX(+e.target.value)}
                  className="control-range"
                />
                <span className="control-value">{layoutSplitX}%</span>
              </div>

              <div> 
                <label>Vertical Split</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={layoutSplitY}
                  onChange={e => updateLayoutSplitY(+e.target.value)}
                  className="control-range"
                />
                <span className="control-value">{layoutSplitY}%</span>
              </div>
            </div>
          </div>

          <div className="inline-row">
            <div className="inline-col">
              <label className="control-label">Background</label>
              <input
                type="color"
                value={pageBgColor}
                onChange={e => setPageBgColor(e.target.value)}
                className="control-color"
              />
            </div>

            <div className="inline-col">
              <label className="control-label">Corner Radius</label>
              <input
                type="number"
                min="0"
                max="100"
                value={imageBorderRadius}
                onChange={e => setImageBorderRadius(+e.target.value)}
                className="control-input"
              />
            </div>
          </div>
        </div>
      </div>

  )

  const renderCaptionSection = () => (
     <div className="editor-card">
        <h4>Caption</h4>

        <textarea
          value={selectedCaption}
          onChange={e => updateCaption(e.target.value)}
          placeholder="Add caption..."
          className="caption-textarea"
        />

        <div className="caption-grid">
          <div>
            <label className="caption-label">Font</label>
            <select
              value={selectedFontFamily}
              onChange={e => updateCaptionStyle('fontFamily', e.target.value)}
              className="caption-select"
            >
              {fontFamilies.map(font => (
                <option key={font.name} value={font.name}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="caption-label">Size</label>
            <select
              value={selectedFontSize}
              onChange={e => updateCaptionStyle('fontSize', +e.target.value)}
              className="caption-select"
            >
              {[10,12,14,16,18,20,24,28,32].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>

          <div>
            <label className="caption-label">Color</label>
            <input
              type="color"
              value={selectedFontColor}
              onChange={e => updateCaptionStyle('color', e.target.value)}
              className="caption-color"
            />
          </div>

          <div>
            <label className="caption-label">Position</label>
            <select
              value={captionPosition}
              onChange={e => updateCaptionStyle('position', e.target.value)}
              className="caption-select"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>

        <div className="caption-align-wrapper">
          <label className="caption-label">Alignment</label>
          <div className="caption-align">
            {['left', 'center', 'right'].map(align => (
              <button
                key={align}
                onClick={() => updateCaptionStyle('alignment', align)}
                className={captionAlignment === align ? 'active' : 'inactive'}
              >
                {align}
              </button>
            ))}
          </div>
        </div>
      </div>
  )

  /* =========================================
     Definitions for Mobile Tabs
     ========================================= */
  const mobileTabs = [
    { id: 'layout', label: 'Layout', icon: TabIcons.layout, content: renderLayoutSection },
    { id: 'page', label: 'Page', icon: TabIcons.page, content: renderPageSettingsSection },
    { id: 'caption', label: 'Text', icon: TabIcons.caption, content: renderCaptionSection },
    { id: 'photos', label: 'Photos', icon: TabIcons.photos, content: () => <PhotoLibrary uploadedImages={uploadedImages} pages={pages} currentPage={currentPage} addImageToPage={addImageToPage} /> },
    { id: 'actions', label: 'Actions', icon: TabIcons.actions, content: renderGlobalActions },
  ];
  
  // If an image is selected, add Image tab
  if (selectedImageId) {
    mobileTabs.splice(1, 0, { id: 'image', label: 'Edit', icon: TabIcons.image, content: renderImageActions });
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
        <PhotoLibrary uploadedImages={uploadedImages} pages={pages} currentPage={currentPage} addImageToPage={addImageToPage} />
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
