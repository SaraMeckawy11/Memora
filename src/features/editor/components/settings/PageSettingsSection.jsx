'use client'
import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import '@/styles/editor/common.css';
import '@/styles/editor/PageSettingsSection.css';

export default function PageSettingsSection() {
  const store = useProjectStore();
  const currentPage = store.pages[store.currentPageIdx];

  const pageMarginEffective = typeof currentPage?.pageMargin === 'number' ? currentPage.pageMargin : store.pageMargin;
  const pageGutterEffective = typeof currentPage?.pageGutter === 'number' ? currentPage.pageGutter : store.pageGutter;
  const layoutSplitX = currentPage?.layoutSplitX ?? 50;
  const layoutSplitY = currentPage?.layoutSplitY ?? 50;

  return (
    <div className="editor-card">
      <h4>Page Settings</h4>

      <div className="control-group">
        <div className="control-subgroup">
          <div className='control-sub'>
            <label className="control-label">Current Page Margin</label>
            <input
              type="range"
              min="0"
              max="60"
              value={pageMarginEffective}
              onChange={e => store.updateCurrentPageSettings({ pageMargin: +e.target.value })}
              className="control-range"
            />
            <span className="control-value">{pageMarginEffective}px</span>
          </div>

          <div className='control-sub'>
            <label className="control-label">Current Page Gutter</label>
            <input
              type="range"
              min="0"
              max="60"
              value={pageGutterEffective}
              onChange={e => store.updateCurrentPageSettings({ pageGutter: +e.target.value })}
              className="control-range"
            />
            <span className="control-value">{pageGutterEffective}px</span>
          </div>

          <div className='control-sub'>
            <label className="control-label">Horizontal Split</label>
            <input
              type="range"
              min="20"
              max="80"
              value={layoutSplitX}
              onChange={e => store.updateCurrentPageSettings({ layoutSplitX: +e.target.value })}
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
              onChange={e => store.updateCurrentPageSettings({ layoutSplitY: +e.target.value })}
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
              value={store.pageMargin}
              onChange={e => store.updateGlobalSettings({ pageMargin: +e.target.value })}
              className="control-range"
            />
            <span className="control-value">{store.pageMargin}px</span>
          </div>

          <div className='control-sub'>
            <label className="control-label">Global Gutter</label>
            <input
              type="range"
              min="0"
              max="60"
              value={store.pageGutter}
              onChange={e => store.updateGlobalSettings({ pageGutter: +e.target.value })}
              className="control-range"
            />
            <span className="control-value">{store.pageGutter}px</span>
          </div>
        </div>
      </div>

      <div className="control-group">
        <div className="inline-row">
          <div className="inline-col">
            <label className="control-label">Background</label>
            <input
              type="color"
              value={store.pageBgColor}
              onChange={e => store.updateGlobalSettings({ pageBgColor: e.target.value })}
              className="control-color"
            />
          </div>

          <div className="inline-col">
            <label className="control-label">Corner Radius</label>
            <input
              type="number"
              min="0"
              max="100"
              value={store.imageBorderRadius}
              onChange={e => store.updateGlobalSettings({ imageBorderRadius: +e.target.value })}
              className="control-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
