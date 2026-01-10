'use client'
import React from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/PageSettingsSection.css';

export default function PageSettingsSection({
  pageMargin, setPageMargin, pageGutter, setPageGutter, pageBgColor, setPageBgColor,
  pageMarginEffective, pageGutterEffective,
  setPageMarginForCurrentPage, setPageGutterForCurrentPage,
  clearPageMarginOverride, clearPageGutterOverride,
  imageBorderRadius, setImageBorderRadius,
  layoutSplitX, layoutSplitY, updateLayoutSplitX, updateLayoutSplitY,
  currentPage
}) {
  return (
    <div className="editor-card">
      <h4>Page Settings</h4>

      <div className="control-group">
        <div className="control-subgroup">
          <div className='control-sub'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <label className="control-label">Page Margin</label>
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
              <label className="control-label">Page Gutter</label>
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
              max="60"
              value={typeof pageGutterEffective === 'number' ? pageGutterEffective : pageGutter}
              onChange={e => setPageGutterForCurrentPage(+e.target.value)}
              className="control-range"
            />
            <span className="control-value">{(typeof pageGutterEffective === 'number' ? pageGutterEffective : pageGutter)}px</span>
          </div>

          <div className='control-sub'>
            <label className="control-label">Horizontal Split</label>
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

          <div className='control-sub'>
            <label className="control-label">Vertical Split</label>
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

      <div className="control-group">
        <div className="control-subgroup">
          <div className='control-sub'>
            <label className="control-label">Global Margin</label>
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
            <label className="control-label">Global Gutter</label>
            <input
              type="range"
              min="0"
              max="60"
              value={pageGutter}
              onChange={e => setPageGutter(+e.target.value)}
              className="control-range"
            />
            <span className="control-value">{pageGutter}px</span>
          </div>
        </div>
      </div>

      <div className="control-group">
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
  );
}
