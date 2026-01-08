'use client'
import React from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/CaptionSection.css';

export default function CaptionSection({
  selectedCaption, updateCaption, fontFamilies, selectedFontFamily, selectedFontSize, selectedFontColor, captionPosition, captionAlignment, updateCaptionStyle
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
