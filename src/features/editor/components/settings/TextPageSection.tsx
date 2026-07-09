'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useProjectStore } from '@/store/useProjectStore'
import '@/styles/editor/CaptionSection.css'

const FONT_FAMILIES = [
  { name: 'Inter', label: 'Inter' },
  { name: 'Georgia', label: 'Georgia' },
  { name: 'Times New Roman', label: 'Times New Roman' },
  { name: 'Playfair Display', label: 'Playfair Display' },
  { name: 'Prata', label: 'Prata' },
  { name: 'Montserrat', label: 'Montserrat' },
  { name: 'Bebas Neue', label: 'Bebas Neue' },
  { name: 'Dancing Script', label: 'Dancing Script' },
  { name: 'Pacifico', label: 'Pacifico' },
  { name: 'Caveat', label: 'Caveat' },
  { name: 'Great Vibes', label: 'Great Vibes' },
]

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56]
const ALIGNMENTS = ['left', 'center', 'right'] as const

export default function TextPageSection() {
  const store = useProjectStore()
  const currentPage = store.pages[store.currentPageIdx]
  const [showPhotoPickerModal, setShowPhotoPickerModal] = useState(false)
  const [replacingPhotoIdx, setReplacingPhotoIdx] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const firstFieldRef = useRef<HTMLTextAreaElement | null>(null)

  const selectedOverlayIdx = store.selectedOverlayIdx
  const selectedOverlay = selectedOverlayIdx !== null ? currentPage?.overlays?.[selectedOverlayIdx] : null
  const selectedOverlayImage = selectedOverlay?.type === 'photo' && selectedOverlay.imageId !== undefined
    ? store.uploadedImages.find((img) => String(img.id) === String(selectedOverlay.imageId))
    : null
  const selectedOverlaySrc = selectedOverlay?.type === 'photo'
    ? selectedOverlay.src || selectedOverlayImage?.src
    : undefined
  const canEditMain = !selectedOverlay && !currentPage?.textBoxHidden

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (firstFieldRef.current) firstFieldRef.current.focus()
  }, [selectedOverlayIdx, currentPage?.id])

  if (!currentPage || currentPage.type !== 'text') return null

  const overlays = currentPage.overlays || []

  const updateMainStyle = (key: string, value: any) => {
    store.updateCurrentPageSettings({
      textStyle: {
        ...currentPage.textStyle,
        [key]: value,
      },
    })
  }

  const updateOverlay = (idx: number, next: any) => {
    const nextOverlays = [...overlays]
    nextOverlays[idx] = { ...nextOverlays[idx], ...next }
    store.updateCurrentPageSettings({ overlays: nextOverlays })
  }

  const updateOverlayStyle = (idx: number, key: string, value: any) => {
    const overlay = overlays[idx]
    if (!overlay) return
    updateOverlay(idx, {
      style: {
        ...overlay.style,
        [key]: value,
      },
    })
  }

  const addTextBox = () => {
    const nextIdx = overlays.length
    store.updateCurrentPageSettings({
      overlays: [
        ...overlays,
        {
          id: `text-${Date.now()}`,
          type: 'text',
          content: 'New text',
          x: 24,
          y: 24,
          width: 52,
          height: 14,
          style: {
            fontSize: 18,
            fontFamily: currentPage.textStyle?.fontFamily || store.selectedFontFamily || 'Inter',
            color: currentPage.textStyle?.color || '#000000',
            textAlign: 'center',
          },
        },
      ],
    })
    store.setSelectedOverlayIdx(nextIdx)
  }

  const closePhotoPicker = () => {
    setShowPhotoPickerModal(false)
    setReplacingPhotoIdx(null)
  }

  const choosePhoto = (img: any) => {
    const nextPhoto = {
      imageId: img.id,
      src: img.src,
      name: img.name || 'Photo',
      originalSrc: img.originalSrc || img.src,
      fit: img.fit || 'cover',
      crop: img.crop,
    }

    if (replacingPhotoIdx !== null && overlays[replacingPhotoIdx]?.type === 'photo') {
      updateOverlay(replacingPhotoIdx, nextPhoto)
      store.setSelectedOverlayIdx(replacingPhotoIdx)
      closePhotoPicker()
      return
    }

    const nextIdx = overlays.length
    store.updateCurrentPageSettings({
      overlays: [
        ...overlays,
        {
          id: `photo-${Date.now()}`,
          type: 'photo',
          ...nextPhoto,
          x: 24,
          y: 24,
          width: 42,
          height: 32,
          style: { borderRadius: 0 },
        },
      ],
    })
    store.setSelectedOverlayIdx(nextIdx)
    closePhotoPicker()
  }

  const removeOverlay = (idx: number) => {
    const nextOverlays = overlays.filter((_, i) => i !== idx)
    store.updateCurrentPageSettings({ overlays: nextOverlays })
    store.setSelectedOverlayIdx(null)
  }

  const renderFontSelect = (value: string, onChange: (value: string) => void) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="caption-select">
      {FONT_FAMILIES.map((font) => (
        <option key={font.name} value={font.name}>
          {font.label}
        </option>
      ))}
    </select>
  )

  const renderSizeSelect = (value: number, onChange: (value: number) => void) => (
    <select value={value} onChange={(e) => onChange(+e.target.value)} className="caption-select">
      {FONT_SIZES.map((size) => (
        <option key={size} value={size}>
          {size}px
        </option>
      ))}
    </select>
  )

  const renderAlignment = (value: string, onChange: (value: string) => void) => (
    <div className="tp-align-group" role="group" aria-label="Text alignment">
      {ALIGNMENTS.map((align) => (
        <button
          key={align}
          type="button"
          className={`tp-align-btn ${value === align ? 'active' : ''}`}
          onClick={() => onChange(align)}
        >
          {align[0].toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <div className="editor-card text-page-card">
      <div className="tp-card-head">
        <div>
          <h4>Text Page</h4>
          <p>Pick an element, then edit its words and style.</p>
        </div>
        <input
          type="color"
          value={currentPage.pageBgColor || '#ffffff'}
          onChange={(e) => store.updateCurrentPageSettings({ pageBgColor: e.target.value })}
          className="caption-color tp-color-sm"
          title="Page background"
          aria-label="Page background"
        />
      </div>

      <div className="tp-section tp-element-section">
        <div className="tp-section-header">
          <label className="caption-label">Elements</label>
          <div className="tp-add-btns">
            <button className="tp-add-btn" type="button" onClick={addTextBox}>+ Text</button>
            <button
              className="tp-add-btn"
              type="button"
              onClick={() => {
                setReplacingPhotoIdx(null)
                setShowPhotoPickerModal(true)
              }}
            >
              + Photo
            </button>
          </div>
        </div>

        {!currentPage.textBoxHidden ? (
          <div
            role="button"
            tabIndex={0}
            className={`tp-element-item ${canEditMain ? 'active' : ''}`}
            onClick={() => store.setSelectedOverlayIdx(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') store.setSelectedOverlayIdx(null)
            }}
          >
            <span className="tp-element-icon">T</span>
            <span className="tp-element-label">Main page text</span>
            <button
              type="button"
              className="tp-element-delete"
              onClick={(e) => {
                e.stopPropagation()
                store.updateCurrentPageSettings({ textBoxHidden: true })
              }}
            >
              x
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="tp-restore-btn"
            onClick={() => {
              store.updateCurrentPageSettings({ textBoxHidden: false })
              store.setSelectedOverlayIdx(null)
            }}
          >
            Restore main text
          </button>
        )}

        {overlays.map((overlay, idx) => (
          <div
            key={overlay.id}
            role="button"
            tabIndex={0}
            className={`tp-element-item ${selectedOverlayIdx === idx ? 'active' : ''}`}
            onClick={() => store.setSelectedOverlayIdx(idx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') store.setSelectedOverlayIdx(idx)
            }}
          >
            <span className="tp-element-icon">{overlay.type === 'text' ? 'T' : 'P'}</span>
            <span className="tp-element-label">
              {overlay.type === 'text' ? (overlay.content || `Text box ${idx + 1}`) : (overlay.name || `Photo ${idx + 1}`)}
            </span>
            <button
              type="button"
              className="tp-element-delete"
              onClick={(e) => {
                e.stopPropagation()
                removeOverlay(idx)
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="tp-divider" />

      {canEditMain && (
        <div className="tp-section tp-edit-section">
          <div className="tp-edit-title">Main Text <span className="tp-edit-badge">default</span></div>
          <textarea
            ref={firstFieldRef}
            value={currentPage.textContent || ''}
            onChange={(e) => store.updateCurrentPageSettings({ textContent: e.target.value })}
            className="caption-textarea tp-textarea"
            placeholder="Write the story for this page..."
          />

          <div className="tp-controls-grid">
            <div>
              <label className="caption-label">Font</label>
              {renderFontSelect(currentPage.textStyle?.fontFamily || 'Inter', (value) => updateMainStyle('fontFamily', value))}
            </div>
            <div>
              <label className="caption-label">Size</label>
              {renderSizeSelect(currentPage.textStyle?.fontSize || 18, (value) => updateMainStyle('fontSize', value))}
            </div>
          </div>

          <div className="tp-style-row">
            <div className="tp-style-item">
              <label className="caption-label">Color</label>
              <input
                type="color"
                value={currentPage.textStyle?.color || '#000000'}
                onChange={(e) => updateMainStyle('color', e.target.value)}
                className="tp-color-input"
              />
            </div>
            <div className="tp-style-item tp-style-grow">
              <label className="caption-label">Alignment</label>
              {renderAlignment(currentPage.textStyle?.textAlign || 'center', (value) => updateMainStyle('textAlign', value))}
            </div>
          </div>
        </div>
      )}

      {selectedOverlay?.type === 'text' && selectedOverlayIdx !== null && (
        <div className="tp-section tp-edit-section">
          <div className="tp-edit-title">Text Box <span className="tp-edit-badge">movable</span></div>
          <textarea
            ref={firstFieldRef}
            value={selectedOverlay.content || ''}
            onChange={(e) => updateOverlay(selectedOverlayIdx, { content: e.target.value })}
            className="caption-textarea tp-textarea"
            placeholder="Type text..."
          />

          <div className="tp-controls-grid">
            <div>
              <label className="caption-label">Font</label>
              {renderFontSelect(selectedOverlay.style?.fontFamily || 'Inter', (value) => updateOverlayStyle(selectedOverlayIdx, 'fontFamily', value))}
            </div>
            <div>
              <label className="caption-label">Size</label>
              {renderSizeSelect(selectedOverlay.style?.fontSize || 18, (value) => updateOverlayStyle(selectedOverlayIdx, 'fontSize', value))}
            </div>
          </div>

          <div className="tp-style-row">
            <div className="tp-style-item">
              <label className="caption-label">Color</label>
              <input
                type="color"
                value={selectedOverlay.style?.color || '#000000'}
                onChange={(e) => updateOverlayStyle(selectedOverlayIdx, 'color', e.target.value)}
                className="tp-color-input"
              />
            </div>
            <div className="tp-style-item tp-style-grow">
              <label className="caption-label">Alignment</label>
              {renderAlignment(selectedOverlay.style?.textAlign || 'center', (value) => updateOverlayStyle(selectedOverlayIdx, 'textAlign', value))}
            </div>
          </div>
        </div>
      )}

      {selectedOverlay?.type === 'photo' && selectedOverlayIdx !== null && (
        <div className="tp-section tp-edit-section">
          <div className="tp-edit-title">Photo Block <span className="tp-edit-badge">drag on page</span></div>
          <div className="overlay-photo-info">
            <div className="overlay-photo-preview">
              <img
                src={selectedOverlaySrc}
                alt={selectedOverlay.name || 'Selected photo'}
                style={{ borderRadius: selectedOverlay.style?.borderRadius || 0 }}
              />
            </div>
            <p className="overlay-photo-name">{selectedOverlay.name || 'Selected photo'}</p>
          </div>
          <div className="photo-edit-actions">
            <button
              type="button"
              className="photo-edit-action primary"
              onClick={() => store.setEditingSlotIdx(selectedOverlayIdx + 1)}
            >
              Crop & fit
            </button>
            <button
              type="button"
              className="photo-edit-action"
              onClick={() => {
                setReplacingPhotoIdx(selectedOverlayIdx)
                setShowPhotoPickerModal(true)
              }}
            >
              Replace
            </button>
          </div>
          <div className="photo-edit-control">
            <div className="photo-edit-control-header">
              <label className="caption-label">Corner Radius</label>
              <span className="photo-edit-value">{selectedOverlay.style?.borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={selectedOverlay.style?.borderRadius || 0}
              onChange={(e) => updateOverlayStyle(selectedOverlayIdx, 'borderRadius', +e.target.value)}
              className="photo-edit-slider"
            />
          </div>
        </div>
      )}

      <div className="tp-divider" />
      <button className="tp-delete-page-btn" type="button" onClick={() => store.removePage(store.currentPageIdx)}>
        Delete text page
      </button>

      {mounted && showPhotoPickerModal && createPortal(
        <div className="photo-picker-modal-overlay" onClick={closePhotoPicker}>
          <div className="photo-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="photo-picker-header">
              <h4>{replacingPhotoIdx !== null ? 'Replace photo' : 'Choose a photo'}</h4>
              <button className="photo-picker-close" type="button" onClick={closePhotoPicker}>x</button>
            </div>

            {store.uploadedImages.length ? (
              <div className="photo-picker-grid">
                {store.uploadedImages.map((img) => (
                  <button key={img.id} type="button" className="photo-picker-thumb" onClick={() => choosePhoto(img)}>
                    <img src={img.thumbSrc || img.src} alt={img.name || 'Photo'} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="photo-picker-empty">Upload photos from the editor toolbar first.</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
