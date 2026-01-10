'use client'

import '@/styles/editor/EditorTopbar.css';

export default function EditorTopbar({
  currentPageIdx,
  totalPages,
  onPrevPage,
  onNextPage,
  undo,
  redo,
  canUndo,
  canRedo,
}) {
  return (
    <div className="editor-topbar">
      <div className="editor-topbar-left">
        <button
          className="nav-button"
          onClick={onPrevPage}
          disabled={currentPageIdx === 0}
          title="Previous Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="editor-page-indicator">
          Page {currentPageIdx + 1} / {totalPages}
        </span>
        <button
          className="nav-button"
          onClick={onNextPage}
          disabled={currentPageIdx === totalPages - 1}
          title="Next Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="editor-topbar-right">
        <button
          className="history-button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
        <button
          className="history-button"
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
