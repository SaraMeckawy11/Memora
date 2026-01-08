'use client'
import React from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/GlobalActions.css';

export default function GlobalActions({ autoSave, setAutoSave, clearProgress }) {
  return (
    <div className="editor-card action-card">
      <div className="action-row">
        <div className="action-row-left">
          <div className="action-title">Auto-save</div>
          <div className="action-subtitle">Keep your progress saved automatically.</div>
        </div>

        <label
          className={`switch ${autoSave ? 'checked' : 'unchecked'}`}
          aria-label="Auto-save"
        >
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          <span className="switch-track">
            <span className="switch-thumb" />
          </span>
        </label>
      </div>

      <div className="action-row action-danger">
        <div className="action-row-left">
          <div className="action-title">Clear saved progress</div>
          <div className="action-subtitle">This can’t be undone.</div>
        </div>

        <button
          className="btn-modern btn-modern-danger"
          onClick={clearProgress}
          type="button"
        >
          <span className="btn-icon-glyph" aria-hidden="true">⟲</span>
          Clear
        </button>
      </div>
    </div>
  );
}
