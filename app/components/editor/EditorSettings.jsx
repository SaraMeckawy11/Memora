'use client'
import PhotoLibrary from './PhotoLibrary'
import '@/styles/editor/editor-settings.css'

/* Visual layout icon component */
function LayoutIcon({ template, isSelected }) {
  const boxClass = `layout-icon-box ${isSelected ? 'active' : 'inactive'}`

  const icons = {
    single: (
      <div className="layout-icon single">
        <div className={boxClass} />
      </div>
    ),
    '2-horizontal': (
      <div className="layout-icon cols-2">
        <div className={boxClass} />
        <div className={boxClass} />
      </div>
    ),
    '2-vertical': (
      <div className="layout-icon rows-2">
        <div className={boxClass} />
        <div className={boxClass} />
      </div>
    ),
    '1-top-2-bottom': (
      <div className="layout-icon rows-2">
        <div className={boxClass} />
        <div className="layout-icon cols-2">
          <div className={boxClass} />
          <div className={boxClass} />
        </div>
      </div>
    ),
    '2-top-1-bottom': (
      <div className="layout-icon rows-2">
        <div className="layout-icon cols-2">
          <div className={boxClass} />
          <div className={boxClass} />
        </div>
        <div className={boxClass} />
      </div>
    ),
    '4-grid': (
      <div className="layout-icon grid-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={boxClass} />
        ))}
      </div>
    ),
    '6-grid': (
      <div className="layout-icon grid-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={boxClass} />
        ))}
      </div>
    ),
  }

  return icons[template] || icons.single
}

export default function EditorSettings({
  layouts,
  selectedLayout,
  updatePageLayout,

  pageMargin,
  setPageMargin,
  pageGutter,
  setPageGutter,
  pageBgColor,
  setPageBgColor,

  imageBorderRadius,
  setImageBorderRadius,
  imageFitMode,
  setImageFitMode,

  showPageNumbers,
  setShowPageNumbers,

  selectedCaption,
  updateCaption,
  fontFamilies,
  selectedFontFamily,
  selectedFontSize,
  selectedFontColor,
  captionPosition,
  captionAlignment,
  updateCaptionStyle,

  applyToAllPages,

  uploadedImages,
  currentPage,
  addImageToPage,

  /* 🔴 ADDED */
  selectedSlotIdx,
  openImageEditor,
  updateImageInSlot,

  autoSave,
  setAutoSave,
  clearProgress,

  layoutSplitX,
  layoutSplitY,
  updateLayoutSplitX,
  updateLayoutSplitY,
}) {

  /* 🔴 ADDED */
  const selectedImage =
    selectedSlotIdx !== null &&
    currentPage?.images?.[selectedSlotIdx]

  return (
    <div className="editor-settings">

      {/* Layout */}
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

      {/* Page Settings */}
      <div className="editor-card">
        <h4>Page Settings</h4>

        <div className="control-group">
          <div>
            <label className="control-label">Margin (px)</label>
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

          <div>
            <label className="control-label">Gutter (px)</label>
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

          <div className="control-group">
            <label>Horizontal Split</label>
            <input
              type="range"
              min="20"
              max="80"
              value={layoutSplitX}
              onChange={e => updateLayoutSplitX(+e.target.value)}
            />
            <span>{layoutSplitX}%</span>

            <label>Vertical Split</label>
            <input
              type="range"
              min="20"
              max="80"
              value={layoutSplitY}
              onChange={e => updateLayoutSplitY(+e.target.value)}
            />
            <span>{layoutSplitY}%</span>
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
                max="20"
                value={imageBorderRadius}
                onChange={e => setImageBorderRadius(+e.target.value)}
                className="control-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= IMAGE (NEW – THIS IS WHAT YOU WERE MISSING) ================= */}
      {selectedImage && (
        <div className="editor-card">
          <h4>Image</h4>

          <button
            className="btn-secondary"
            onClick={() => openImageEditor(selectedSlotIdx)}
          >
            Edit selected image
          </button>

        </div>
      )}

      {/* Caption */}
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

      <button className="apply-btn" onClick={applyToAllPages}>
        Apply settings to all pages
      </button>

      <PhotoLibrary
        uploadedImages={uploadedImages}
        currentPage={currentPage}
        addImageToPage={addImageToPage}
      />

      <div className="auto-save">
        <span className="auto-save-label">💾 Auto-save</span>
        <label className={`switch ${autoSave ? 'checked' : 'unchecked'}`}>
          <input
            type="checkbox"
            checked={autoSave}
            onChange={e => setAutoSave(e.target.checked)}
          />
          <span className="switch-track">
            <span className="switch-thumb" />
          </span>
        </label>
      </div>

      <button className="clear-btn" onClick={clearProgress}>
        Clear saved progress
      </button>
    </div>
  )
}
