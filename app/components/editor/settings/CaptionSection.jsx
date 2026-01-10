'use client'
import React from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/CaptionSection.css';

export const FONT_FAMILIES = [
  { name: 'Inter', label: 'Inter (Sans)' },
  { name: 'Arial', label: 'Arial (Sans)' },
  { name: 'Helvetica', label: 'Helvetica (Sans)' },
  { name: 'Georgia', label: 'Georgia (Serif)' },
  { name: 'Times New Roman', label: 'Times New Roman (Serif)' },
  { name: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { name: 'Prata', label: 'Prata (Serif - Luxury)' },
  { name: 'Abril Fatface', label: 'Abril Fatface (Display Serif)' },
  { name: 'Montserrat', label: 'Montserrat (Sans)' },
  { name: 'Montserrat Light', label: 'Montserrat Light (Sans)' },
  { name: 'Bebas Neue', label: 'Bebas Neue (Bold Sans)' },
  { name: 'Gistesy', label: 'Gistesy (Script)' },
  { name: 'Signature', label: 'Signature (Script)' },
  { name: 'Signature Font', label: 'Signature Font (Script)' },
  { name: 'California Signature', label: 'California Signature (Script)' },
  { name: 'Rogue', label: 'Rogue (Stencil Display)' },
  { name: 'Rogue Hero', label: 'Rogue Hero (Display)' },
  { name: 'Dancing Script', label: 'Dancing Script (Script)' },
  { name: 'Pacifico', label: 'Pacifico (Handwritten)' },
  { name: 'Caveat', label: 'Caveat (Handwritten)' },
  { name: 'Satisfy', label: 'Satisfy (Script)' },
  { name: 'Great Vibes', label: 'Great Vibes (Calligraphy)' },
  { name: 'Shadows Into Light', label: 'Shadows Into Light (Handwritten)' },
  { name: 'Lobster', label: 'Lobster (Display)' },
  { name: 'Permanent Marker', label: 'Permanent Marker (Marker)' },
]

export default function CaptionSection({
  selectedCaption, updateCaption, selectedFontFamily, selectedFontSize, selectedFontColor, captionPosition, captionAlignment, updateCaptionStyle
}) {
  return (
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
            {FONT_FAMILIES.map(font => (
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
            {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
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
  );
}
