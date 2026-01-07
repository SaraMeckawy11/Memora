'use client'

export default function MobileNavBar({ 
  currentPageIdx, 
  totalPages, 
  onPrevPage, 
  onNextPage 
}) {
  return (
    <div className="mobile-nav-bar">
      <button 
        className="mobile-nav-btn" 
        onClick={onPrevPage} 
        disabled={currentPageIdx === 0}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Prev</span>
      </button>
      
      <span className="mobile-nav-info">
        {currentPageIdx + 1} / {totalPages}
      </span>

      <button 
        className="mobile-nav-btn" 
        onClick={onNextPage}
        disabled={currentPageIdx === totalPages - 1}
      >
        <span>Next</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  )
}
