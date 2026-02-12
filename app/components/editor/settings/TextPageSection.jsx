'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import '@/styles/editor/CaptionSection.css'

const FONT_FAMILIES = [
  { name: 'Inter', label: 'Inter' },
  { name: 'Arial', label: 'Arial' },
  { name: 'Helvetica', label: 'Helvetica' },
  { name: 'Georgia', label: 'Georgia' },
  { name: 'Times New Roman', label: 'Times New Roman' },
  { name: 'Playfair Display', label: 'Playfair Display' },
  { name: 'Prata', label: 'Prata' },
  { name: 'Abril Fatface', label: 'Abril Fatface' },
  { name: 'Montserrat', label: 'Montserrat' },
  { name: 'Montserrat Light', label: 'Montserrat Light' },
  { name: 'Bebas Neue', label: 'Bebas Neue' },
  { name: 'Gistesy', label: 'Gistesy' },
  { name: 'Signature', label: 'Signature' },
  { name: 'Signature Font', label: 'Signature Font' },
  { name: 'California Signature', label: 'California Signature' },
  { name: 'Rogue', label: 'Rogue' },
  { name: 'Rogue Hero', label: 'Rogue Hero' },
  { name: 'Dancing Script', label: 'Dancing Script' },
  { name: 'Pacifico', label: 'Pacifico' },
  { name: 'Caveat', label: 'Caveat' },
  { name: 'Satisfy', label: 'Satisfy' },
  { name: 'Great Vibes', label: 'Great Vibes' },
  { name: 'Shadows Into Light', label: 'Shadows Into Light' },
  { name: 'Lobster', label: 'Lobster' },
  { name: 'Permanent Marker', label: 'Permanent Marker' },
]

export default function TextPageSection({
  currentPage,
  currentPageIdx,
  updateTextContent,
  updateTextStyle,
  updatePageBgColor,
  removeText,
  restoreTextBox,
  removePage,
  addOverlayElement,
  removeOverlayElement,
  uploadedImages,
  onUpdateTextPosition,
  selectedOverlayIdx,
  updateOverlayStyle,
  updateOverlayContent,
}) {
  const [fontSelectOpen, setFontSelectOpen] = useState(false)
  const [overlayFontSelectOpen, setOverlayFontSelectOpen] = useState(false)
  const [showPhotoPickerModal, setShowPhotoPickerModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState('main') // 'main' | null
  const fontSelectRef = useRef(null)
  const overlayFontSelectRef = useRef(null)
  const photoFileInputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontSelectRef.current && !fontSelectRef.current.contains(event.target)) {
        setFontSelectOpen(false)
      }
      if (overlayFontSelectRef.current && !overlayFontSelectRef.current.contains(event.target)) {
        setOverlayFontSelectOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleFontSelect = (fontName) => {
    updateTextStyle('fontFamily', fontName)
    setFontSelectOpen(false)
  }

  const handleTextChange = (e) => {
    updateTextContent(e.target.value)
  }

  const handleColorChange = (e) => {
    updateTextStyle('color', e.target.value)
  }

  /* --- Add a new text box overlay to the same page --- */
  const handleAddTextBox = () => {
    addOverlayElement({
      id: Date.now() + Math.random(),
      type: 'text',
      content: '',
      placeholder: 'Type here…',
      x: 20 + Math.random() * 20,   // randomise slightly so they don't stack
      y: 20 + Math.random() * 20,
      width: 40,
      height: 20,
      style: {
        fontSize: 18,
        color: '#000000',
        fontFamily: 'Inter',
        textAlign: 'center',
      },
    })
  }

  /* --- Add a photo overlay from file upload --- */
  const handlePhotoFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const src = URL.createObjectURL(file)
      addOverlayElement({
        id: Date.now() + Math.random(),
        type: 'photo',
        src,
        name: file.name,
        x: 25 + Math.random() * 15,
        y: 25 + Math.random() * 15,
        width: 30,
        height: 30,
      })
    })

    e.target.value = ''
    setShowPhotoPickerModal(false)
  }

  /* --- Pick a photo from the existing library --- */
  const handlePickFromLibrary = (img) => {
    addOverlayElement({
      id: Date.now() + Math.random(),
      type: 'photo',
      src: img.src,
      name: img.name || 'photo',
      x: 25 + Math.random() * 15,
      y: 25 + Math.random() * 15,
      width: 30,
      height: 30,
    })
    setShowPhotoPickerModal(false)
  }

  if (!currentPage || currentPage.type !== 'text') {
    return null
  }

  const selectedOverlay = selectedOverlayIdx !== null && selectedOverlayIdx !== undefined
    ? currentPage.overlays?.[selectedOverlayIdx]
    : null

  /* Which editing panel to show: 'main' for main text, or auto-switch to overlay */
  const showMainEdit = !selectedOverlay && expandedSection === 'main' && !currentPage.textBoxHidden

  return (
    <div className="editor-card text-page-card">
      {/* ======== Section: Page Background ======== */}
      <div className="tp-section">
        <div className="tp-row-inline">
          <label className="caption-label">Page Background</label>
          <input
            type="color"
            value={currentPage.pageBgColor || '#ffffff'}
            onChange={e => updatePageBgColor(e.target.value)}
            className="caption-color tp-color-sm"
          />
        </div>
      </div>

      <div className="tp-divider" />

      {/* ======== Section: Page Elements ======== */}
      <div className="tp-section">
        <div className="tp-section-header">
          <label className="caption-label">Page Elements</label>
          <div className="tp-add-btns">
            <button className="tp-add-btn" onClick={handleAddTextBox} title="Add Text Box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 6.1H3M21 12.1H3M15.1 18H3" />
              </svg>
            </button>
            <button className="tp-add-btn" onClick={() => setShowPhotoPickerModal(true)} title="Add Photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
          </div>
        </div>

        {/* -- Main text element row -- */}
        {currentPage.textBoxHidden ? (
          <div
            className="tp-element-item"
            onClick={() => restoreTextBox && restoreTextBox()}
            style={{ opacity: 0.6 }}
          >
            <span className="tp-element-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </span>
            <span className="tp-element-label">Restore Main Text</span>
          </div>
        ) : (
        <div
          className={`tp-element-item${showMainEdit ? ' active' : ''}`}
          onClick={() => setExpandedSection(expandedSection === 'main' ? null : 'main')}
        >
          <span className="tp-element-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3M21 12.1H3M15.1 18H3" /></svg>
          </span>
          <span className="tp-element-label">Main Text</span>
          <button
            className="tp-element-delete"
            onClick={(e) => { e.stopPropagation(); removeText() }}
            title="Remove text box"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        )}

        {/* -- Overlay element rows -- */}
        {currentPage.overlays?.map((overlay, idx) => (
          <div
            key={overlay.id}
            className={`tp-element-item${selectedOverlayIdx === idx ? ' active' : ''}`}
          >
            <span className="tp-element-icon">
              {overlay.type === 'text' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3M21 12.1H3M15.1 18H3" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              )}
            </span>
            <span className="tp-element-label">
              {overlay.type === 'text' ? 'Text Box' : (overlay.name || 'Photo')}
            </span>
            <button
              className="tp-element-delete"
              onClick={() => removeOverlayElement(idx)}
              title="Remove element"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="tp-divider" />

      {/* ======== Section: Main Text Edit ======== */}
      {showMainEdit && (
        <div className="tp-section tp-edit-section">
          <label className="tp-edit-title">Main Text</label>

          <textarea
            value={currentPage.textContent || ''}
            onChange={handleTextChange}
            placeholder="Type your text…"
            className="caption-textarea"
          />

          <div className="tp-controls-grid">
            <div>
              <label className="caption-label">Font</label>
              <div className="caption-select-wrapper" ref={fontSelectRef}>
                <div
                  className="caption-select-display"
                  onClick={() => setFontSelectOpen(!fontSelectOpen)}
                  style={{ fontFamily: currentPage.textStyle?.fontFamily || 'Inter' }}
                >
                  {FONT_FAMILIES.find(f => f.name === (currentPage.textStyle?.fontFamily || 'Inter'))?.label || currentPage.textStyle?.fontFamily || 'Inter'}
                  <span className="caption-select-arrow">{fontSelectOpen ? '▲' : '▼'}</span>
                </div>
                {fontSelectOpen && (
                  <div className="caption-options">
                    {FONT_FAMILIES.map(font => (
                      <div
                        key={font.name}
                        className="caption-option"
                        onClick={() => handleFontSelect(font.name)}
                        style={{ fontFamily: font.name }}
                      >
                        {font.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="caption-label">Size</label>
              <select
                value={currentPage.textStyle?.fontSize || 24}
                onChange={e => updateTextStyle('fontSize', +e.target.value)}
                className="caption-select"
              >
                {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>
          </div>

          <div className="tp-controls-row">
            <div>
              <label className="caption-label">Color</label>
              <input
                type="color"
                value={currentPage.textStyle?.color || '#000000'}
                onChange={handleColorChange}
                className="caption-color"
              />
            </div>
            <div>
              <label className="caption-label">Alignment</label>
              <div className="caption-align">
                {['left', 'center', 'right'].map(align => (
                  <button
                    key={align}
                    onClick={() => updateTextStyle('textAlign', align)}
                    className={currentPage.textStyle?.textAlign === align ? 'active' : 'inactive'}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== Section: Overlay Text Edit ======== */}
      {selectedOverlay?.type === 'text' && (
        <div className="tp-section tp-edit-section">
          <label className="tp-edit-title">
            Text Box
            <span className="tp-edit-badge">#{selectedOverlayIdx + 1}</span>
          </label>

          <textarea
            value={selectedOverlay.content || ''}
            onChange={(e) => updateOverlayContent(selectedOverlayIdx, e.target.value)}
            placeholder="Enter text…"
            className="caption-textarea"
          />

          <div className="tp-controls-grid">
            <div>
              <label className="caption-label">Font</label>
              <div className="caption-select-wrapper" ref={overlayFontSelectRef}>
                <div
                  className="caption-select-display"
                  onClick={() => setOverlayFontSelectOpen(!overlayFontSelectOpen)}
                  style={{ fontFamily: selectedOverlay.style?.fontFamily || 'Inter' }}
                >
                  {FONT_FAMILIES.find(f => f.name === (selectedOverlay.style?.fontFamily || 'Inter'))?.label || selectedOverlay.style?.fontFamily || 'Inter'}
                  <span className="caption-select-arrow">{overlayFontSelectOpen ? '▲' : '▼'}</span>
                </div>
                {overlayFontSelectOpen && (
                  <div className="caption-options">
                    {FONT_FAMILIES.map(font => (
                      <div
                        key={font.name}
                        className="caption-option"
                        onClick={() => {
                          updateOverlayStyle(selectedOverlayIdx, 'fontFamily', font.name)
                          setOverlayFontSelectOpen(false)
                        }}
                        style={{ fontFamily: font.name }}
                      >
                        {font.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="caption-label">Size</label>
              <select
                value={selectedOverlay.style?.fontSize || 18}
                onChange={e => updateOverlayStyle(selectedOverlayIdx, 'fontSize', +e.target.value)}
                className="caption-select"
              >
                {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>
          </div>

          <div className="tp-controls-row">
            <div>
              <label className="caption-label">Color</label>
              <input
                type="color"
                value={selectedOverlay.style?.color || '#000000'}
                onChange={e => updateOverlayStyle(selectedOverlayIdx, 'color', e.target.value)}
                className="caption-color"
              />
            </div>
            <div>
              <label className="caption-label">Alignment</label>
              <div className="caption-align">
                {['left', 'center', 'right'].map(align => (
                  <button
                    key={align}
                    onClick={() => updateOverlayStyle(selectedOverlayIdx, 'textAlign', align)}
                    className={selectedOverlay.style?.textAlign === align ? 'active' : 'inactive'}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== Section: Overlay Photo Edit ======== */}
      {selectedOverlay?.type === 'photo' && (
        <div className="tp-section tp-edit-section">
          <label className="tp-edit-title">
            Photo
            <span className="tp-edit-badge">#{selectedOverlayIdx + 1}</span>
          </label>
          <div className="overlay-photo-info">
            <div className="overlay-photo-preview">
              <img src={selectedOverlay.src} alt={selectedOverlay.name || 'Photo'} />
            </div>
            <p className="overlay-photo-hint">Click the edit button on the canvas to crop &amp; adjust.</p>
          </div>
        </div>
      )}

      <div className="tp-divider" />

      {/* ======== Section: Danger zone ======== */}
      <div className="tp-section">
        <button
          className="tp-delete-page-btn"
          onClick={() => removePage(currentPageIdx)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete Page
        </button>
      </div>

      {/* ---- Hidden file input for photo upload ---- */}
      <input
        ref={photoFileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handlePhotoFileChange}
      />

      {/* ---- Photo Picker Modal (portaled to body to avoid sidebar clipping) ---- */}
      {showPhotoPickerModal && createPortal(
        <div className="photo-picker-modal-overlay" onClick={() => setShowPhotoPickerModal(false)}>
          <div className="photo-picker-modal" onClick={e => e.stopPropagation()}>
            <div className="photo-picker-header">
              <h4>Add Photo</h4>
              <button className="photo-picker-close" onClick={() => setShowPhotoPickerModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="photo-picker-body">
              <button
                className="photo-picker-upload-btn"
                onClick={() => photoFileInputRef.current?.click()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload from device</span>
              </button>

              {uploadedImages && uploadedImages.length > 0 && (
                <div className="photo-picker-library">
                  <label className="caption-label">From your library</label>
                  <div className="photo-picker-grid">
                    {uploadedImages.map(img => (
                      <div
                        key={img.id}
                        className="photo-picker-thumb"
                        onClick={() => handlePickFromLibrary(img)}
                      >
                        <img src={img.thumbSrc || img.src} alt={img.name || 'photo'} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
