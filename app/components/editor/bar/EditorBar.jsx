'use client'


import UploadArea from '../settings/UploadArea';

export default function EditorTopbar({
  currentPageIdx,
  totalPages,
  onPrevPage,
  onNextPage,
  setIsSidebarOpen,
  onUpload,
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
          className="select-page-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Select Page"
          aria-label="Open page selector"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.25rem'}}>
            <rect x="4" y="2" width="12" height="16" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
          <span>Pages</span>
        </button>
        <span className="editor-page-indicator" role="status" aria-live="polite">
          <span className="editor-page-number">{currentPageIdx + 1}</span>
          <span className="editor-divider-dot"></span>
          <span className="editor-total-pages">{totalPages}</span>
        </span>
        {/* Upload Button next to page indicator */}
        <div>
          <UploadArea onUpload={onUpload} compact={true} label="Photos" />
        </div>
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
