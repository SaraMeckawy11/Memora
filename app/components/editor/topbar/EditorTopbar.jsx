'use client'

import '@/styles/editor/EditorTopbar.css';

export default function EditorTopbar({
  currentPageIdx,
  totalPages,
  onPrevPage,
  onNextPage,
  setIsSidebarOpen,
}) {
  return (
    <div className="editor-topbar">
      <div className="editor-topbar-left">
        <button
          className="bottom-nav-btn bottom-nav-btn--ghost select-page-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Select Page"
        >
          Select Page
        </button>
      </div>

      <div className="editor-topbar-right">
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
    </div>
  )
}
