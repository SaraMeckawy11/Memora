'use client'

export default function EditorTopbar({
  currentPageIdx,
  currentLayoutObj,
  imageCount,
  maxSlots,
  undo,
  redo,
  canUndo,
  canRedo,
}) {
  return (
    <div className="editor-topbar">
      <div className="editor-topbar-left">
        <span className="editor-page-number">
          Page {currentPageIdx + 1}
        </span>
        <span className="editor-divider-dot" />
        <span className="editor-layout-chip">
          {currentLayoutObj?.icon}
          {currentLayoutObj?.name}
        </span>
      </div>

      <div className="editor-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="editor-history-controls" style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              opacity: canUndo ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => canUndo && (e.currentTarget.style.background = '#f5f5f5')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
            style={{
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              opacity: canRedo ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => canRedo && (e.currentTarget.style.background = '#f5f5f5')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7" />
            </svg>
          </button>
        </div>

        <span className={`editor-photo-count ${imageCount >= maxSlots ? 'full' : ''}`}>
          {imageCount} / {maxSlots} photos
        </span>
      </div>
    </div>
  )
}
