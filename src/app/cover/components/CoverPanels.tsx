'use client'
import React, { useRef } from 'react'
import Link from 'next/link'

// Curated, brand-adjacent families (all loaded by FontLoader)
export const FONT_CHOICES = [
  'Playfair Display',
  'Prata',
  'Cormorant Garamond',
  'DM Serif Display',
  'Montserrat',
  'Inter',
  'Bebas Neue',
  'Dancing Script',
  'Great Vibes',
  'Caveat',
  'Pacifico',
  'Lobster',
]

/* =========================================================
   Preset mode — the layout is locked; only words can change.
   ========================================================= */

export function PresetTextPanel({
  texts,
  selectedId,
  onSelect,
  onChangeText,
}: {
  texts: any[]
  selectedId: string | number | null
  onSelect: (id: string | number | null) => void
  onChangeText: (id: string | number, value: string) => void
}) {
  return (
    <aside className="simple-panel">
      <h3 className="simple-panel-label">edit text</h3>
      <p className="simple-panel-hint">
        The layout is fixed so your cover always looks right — tap any text on
        the cover, or edit the words below.
      </p>

      {texts.length === 0 && (
        <p className="simple-empty-note">This side has no text to edit.</p>
      )}

      {texts.map((el, i) => (
        <div className="simple-field" key={el.id}>
          <label htmlFor={`cover-text-${el.id}`}>text {i + 1}</label>
          <textarea
            id={`cover-text-${el.id}`}
            rows={Math.min(3, Math.max(1, String(el.content || '').split('\n').length))}
            value={el.content || ''}
            className={selectedId === el.id ? 'highlighted' : ''}
            onFocus={() => onSelect(el.id)}
            onBlur={() => onSelect(null)}
            onChange={(e) => onChangeText(el.id, e.target.value)}
          />
        </div>
      ))}

      <div className="simple-divider" />
      <div className="simple-panel-footer">
        <Link href="/select-cover" className="simple-text-link simple-text-link--muted">
          choose a different design
        </Link>
      </div>
    </aside>
  )
}

/* =========================================================
   Custom mode — element list, like the text-page editor:
   add text boxes and photos, select one to edit, drag on the
   cover to position it.
   ========================================================= */

export function CustomCoverPanel({
  side,
  elements,
  selectedId,
  onSelect,
  onAddText,
  onAddPhoto,
  onReplacePhoto,
  onRemoveElement,
  onPatchElement,
  backgroundColor,
  onBackground,
  onReset,
  canvasWidth,
}: {
  side: 'front' | 'back'
  elements: any[]
  selectedId: string | number | null
  onSelect: (id: string | number | null) => void
  onAddText: () => void
  onAddPhoto: (file: File) => void
  onReplacePhoto: (id: string | number, file: File) => void
  onRemoveElement: (id: string | number) => void
  onPatchElement: (id: string | number, patch: any, sessionKey: string) => void
  backgroundColor: string
  onBackground: (color: string) => void
  onReset: () => void
  canvasWidth: number
}) {
  const addPhotoRef = useRef<HTMLInputElement>(null)
  const replacePhotoRef = useRef<HTMLInputElement>(null)

  const selected = elements.find((el) => el.id === selectedId) || null
  const photoCount = { n: 0 }

  const labelFor = (el: any) => {
    if (el.type === 'text') return (el.content || 'Text').split('\n')[0].slice(0, 24) || 'Text'
    photoCount.n += 1
    return `Photo ${photoCount.n}`
  }

  return (
    <aside className="simple-panel">
      <h3 className="simple-panel-label">custom cover · {side}</h3>
      <p className="simple-panel-hint">
        Add text and photos, then drag them on the cover to place them.
      </p>

      {/* Hidden file inputs */}
      <input
        ref={addPhotoRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onAddPhoto(file)
          e.target.value = ''
        }}
      />
      <input
        ref={replacePhotoRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && selectedId !== null) onReplacePhoto(selectedId, file)
          e.target.value = ''
        }}
      />

      <div className="simple-field">
        <div className="simple-elements-header">
          <label>elements</label>
          <div className="simple-add-btns">
            <button type="button" className="simple-add-btn" onClick={onAddText}>+ Text</button>
            <button type="button" className="simple-add-btn" onClick={() => addPhotoRef.current?.click()}>+ Photo</button>
          </div>
        </div>

        {elements.length === 0 ? (
          <p className="simple-empty-note">Nothing here yet — add a photo or some text.</p>
        ) : (
          <div className="simple-element-list">
            {elements.map((el) => (
              <div
                key={el.id}
                role="button"
                tabIndex={0}
                className={`simple-element-item${selectedId === el.id ? ' active' : ''}`}
                onClick={() => onSelect(el.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelect(el.id)
                }}
              >
                <span className="icon">{el.type === 'text' ? 'T' : 'P'}</span>
                <span className="label">{labelFor(el)}</span>
                <button
                  type="button"
                  className="delete"
                  aria-label="Delete element"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveElement(el.id)
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <>
          <div className="simple-divider" />
          {selected.type === 'text' ? (
            <div className="simple-field">
              <label htmlFor="custom-el-text">text</label>
              <textarea
                id="custom-el-text"
                rows={2}
                value={selected.content || ''}
                onChange={(e) => onPatchElement(selected.id, { content: e.target.value }, `content-${selected.id}`)}
              />
              <div className="simple-field-row">
                <select
                  aria-label="Font"
                  value={selected.fontFamily || 'Playfair Display'}
                  onChange={(e) => onPatchElement(selected.id, { fontFamily: e.target.value }, `font-${selected.id}`)}
                  style={{ fontFamily: selected.fontFamily || 'Playfair Display' }}
                >
                  {FONT_CHOICES.map((f) => (
                    <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                  ))}
                </select>
                <input
                  type="color"
                  aria-label="Text color"
                  value={selected.color || '#141414'}
                  onChange={(e) => onPatchElement(selected.id, { color: e.target.value }, `color-${selected.id}`)}
                />
              </div>
              <div className="simple-field-row">
                <input
                  type="range"
                  aria-label="Text size"
                  min={14}
                  max={130}
                  value={selected.fontSize || 36}
                  onChange={(e) => onPatchElement(selected.id, { fontSize: Number(e.target.value) }, `size-${selected.id}`)}
                />
                <span className="simple-size-value">{selected.fontSize || 36}px</span>
              </div>
            </div>
          ) : (
            <div className="simple-field">
              <label>photo</label>
              <div className="simple-photo-row">
                <img src={selected.src} alt="Selected" className="simple-photo-thumb" />
                <span className="name">Drag it on the cover to move it</span>
              </div>
              <div className="simple-field-row">
                <input
                  type="range"
                  aria-label="Photo size"
                  min={10}
                  max={100}
                  value={Math.round(((selected.width || 1) / (canvasWidth || 1)) * 100)}
                  onChange={(e) => {
                    const pct = Number(e.target.value)
                    const newWidth = ((canvasWidth || 1) * pct) / 100
                    const aspect = (selected.height || 1) / (selected.width || 1)
                    onPatchElement(
                      selected.id,
                      { width: newWidth, height: newWidth * aspect },
                      `photosize-${selected.id}`,
                    )
                  }}
                />
                <span className="simple-size-value">
                  {Math.round(((selected.width || 1) / (canvasWidth || 1)) * 100)}%
                </span>
              </div>
              <div className="simple-field-row">
                <button
                  type="button"
                  className="simple-text-link simple-text-link--muted"
                  onClick={() => replacePhotoRef.current?.click()}
                >
                  replace photo
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="simple-divider" />

      <div className="simple-field">
        <label htmlFor="custom-bg-input">background</label>
        <div className="simple-field-row">
          <input
            id="custom-bg-input"
            type="color"
            value={backgroundColor || '#faf8f5'}
            onChange={(e) => onBackground(e.target.value)}
          />
          <span className="simple-panel-hint" style={{ margin: 0 }}>
            the color behind your elements
          </span>
        </div>
      </div>

      <div className="simple-divider" />
      <div className="simple-panel-footer">
        <Link href="/select-cover" className="simple-text-link simple-text-link--muted">
          browse designs instead
        </Link>
        <button type="button" className="simple-text-link" onClick={onReset}>
          start over
        </button>
      </div>
    </aside>
  )
}
