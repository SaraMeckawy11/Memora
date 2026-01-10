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
          className="nav-button"
          onClick={onPrevPage}
          disabled={currentPageIdx === 0}
          title="Previous Page"
          aria-label="Go to previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      <div className="editor-topbar-center">
        <button
          className="nav-button select-page-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Select Page"
          aria-label="Open page selector"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Pages</span>
        </button>
        <span className="editor-page-indicator" role="status" aria-live="polite">
          <span className="editor-page-number">{currentPageIdx + 1}</span>
          <span className="editor-divider-dot"></span>
          <span className="editor-total-pages">{totalPages}</span>
        </span>
      </div>
      <div className="editor-topbar-right">
        <button
          className="nav-button"
          onClick={onNextPage}
          disabled={currentPageIdx === totalPages - 1}
          title="Next Page"
          aria-label="Go to next page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
