'use client'
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/CaptionSection.css';

export const FONT_FAMILIES = [
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

export default function CaptionSection({
  selectedCaption, updateCaption, selectedFontFamily, selectedFontSize, selectedFontColor, captionPosition, captionAlignment, updateCaptionStyle
}) {
  const [fontSelectOpen, setFontSelectOpen] = useState(false);
  const fontSelectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontSelectRef.current && !fontSelectRef.current.contains(event.target)) {
        setFontSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFontSelect = (fontName) => {
    updateCaptionStyle('fontFamily', fontName);
    setFontSelectOpen(false);
  };

  return (
    <div className="editor-card">
      <h4>Caption</h4>

      <textarea
        value={selectedCaption}
        onChange={e => updateCaption(e.target.value)}
        placeholder="Add caption..."
        className="caption-textarea"
      />

      <div className="caption-controls">
        <div className="caption-row">
          <div>
            <label className="caption-label">Font</label>
            <div className="caption-select-wrapper" ref={fontSelectRef}>
              <div
                className="caption-select-display"
                onClick={() => setFontSelectOpen(!fontSelectOpen)}
                style={{ fontFamily: selectedFontFamily }}
              >
                {FONT_FAMILIES.find(f => f.name === selectedFontFamily)?.label || selectedFontFamily}
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
              value={selectedFontSize}
              onChange={e => updateCaptionStyle('fontSize', +e.target.value)}
              className="caption-select"
            >
              {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>

        <div className="caption-row">
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
