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

export default function TextPageSection({
  currentPage,
  currentPageIdx,
  updateTextContent,
  updateTextStyle,
  updatePageBgColor,
  removePage,
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
    updateTextStyle('fontFamily', fontName);
    setFontSelectOpen(false);
  };

  if (!currentPage || currentPage.type !== 'text') return null;

  return (
    <div className="editor-card">
      <h4>Text Page</h4>

      <textarea
        value={currentPage.textContent || ''}
        onChange={e => updateTextContent(e.target.value)}
        placeholder="Enter your text here..."
        className="caption-textarea"
        style={{ minHeight: '120px' }}
      />

      <div className="caption-controls">
        <div className="caption-row">
          <div>
            <label className="caption-label">Font</label>
            <div className="caption-select-wrapper" ref={fontSelectRef}>
              <div
                className="caption-select-display"
                onClick={() => setFontSelectOpen(!fontSelectOpen)}
                style={{ fontFamily: currentPage.textStyle?.fontFamily || 'Inter' }}
              >
                {FONT_FAMILIES.find(f => f.name === (currentPage.textStyle?.fontFamily || 'Inter'))?.label || 'Inter'}
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
              onChange={e => updateTextStyle('fontSize', parseInt(e.target.value))}
              className="caption-select"
            >
              {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64].map(size => (
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
              value={currentPage.textStyle?.color || '#000000'}
              onChange={e => updateTextStyle('color', e.target.value)}
              className="caption-color"
            />
          </div>

          <div>
            <label className="caption-label">Background</label>
            <input
              type="color"
              value={currentPage.pageBgColor || '#ffffff'}
              onChange={e => updatePageBgColor(e.target.value)}
              className="caption-color"
            />
          </div>
        </div>
      </div>

      <div className="text-actions-wrapper">
        <button
          onClick={() => updateTextContent('')}
          className="remove-text-btn"
          disabled={!currentPage.textContent}
        >
          Remove Text
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this text page?')) {
              removePage(currentPageIdx);
            }
          }}
          className="remove-page-btn"
        >
          Remove Page
        </button>
      </div>
    </div>
  );
}