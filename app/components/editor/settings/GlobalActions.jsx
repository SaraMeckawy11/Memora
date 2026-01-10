'use client'
import React from 'react';
import PDFExportButton from '@/app/components/editor/pdf/PDFExportButton';
import { SIZES } from '@/app/components/setup/SizeSelection'
import { LAYOUTS } from '@/app/components/editor/settings/LayoutSection'
import '@/styles/editor/common.css';
import '@/styles/editor/GlobalActions.css';

const IconSave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);

const IconAutoSave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4-4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
);

const IconPDF = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
);

const IconClear = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

export default function GlobalActions({ 
  autoSave, 
  setAutoSave, 
  clearProgress,
  saveProgress,
  pages,
  uploadedImages,
  selectedSize,
  pageMargin,
  pageGutter,
  pageBgColor,
  imageFitMode
}) {
  return (
    <div className="editor-card global-actions-card">
      <div className="action-row">
        <div className="action-info">
          <span className="action-icon"><IconAutoSave /></span>
          <div className="action-text">
            <span className="action-title">Auto-save</span>
            <span className="action-subtitle">Sync progress instantly</span>
          </div>
        </div>

        <label className={`switch-modern ${autoSave ? 'checked' : 'unchecked'}`}>
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          <span className="switch-slider" />
        </label>
      </div>

      <div className="action-row">
        <div className="action-info">
          <span className="action-icon"><IconSave /></span>
          <div className="action-text">
            <span className="action-title">Save Progress</span>
            <span className="action-subtitle">Commit changes locally</span>
          </div>
        </div>

        <button
          type="button"
          onClick={saveProgress}
          className="btn-action-primary"
        >
          Save
        </button>
      </div>

      <div className="action-row">
        <div className="action-info">
          <span className="action-icon"><IconPDF /></span>
          <div className="action-text">
            <span className="action-title">Export PDF</span>
            <span className="action-subtitle">High-quality print file</span>
          </div>
        </div>

        <PDFExportButton
          pages={pages}
          uploadedImages={uploadedImages}
          selectedSize={selectedSize}
          sizes={SIZES}
          layouts={LAYOUTS}
          pageMargin={pageMargin}
          pageGutter={pageGutter}
          pageBgColor={pageBgColor}
          imageFitMode={imageFitMode}
        />
      </div>

      <div className="action-row action-row-danger">
        <div className="action-info">
          <span className="action-icon icon-danger"><IconClear /></span>
          <div className="action-text">
            <span className="action-title title-danger">Reset Progress</span>
            <span className="action-subtitle">Clear all drafts</span>
          </div>
        </div>

        <button
          className="btn-action-danger"
          onClick={clearProgress}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
