'use client'

export default function EditorTopbar({
  currentPageIdx,
  currentLayoutObj,
  imageCount,
  maxSlots,
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

      <span className={`editor-photo-count ${imageCount >= maxSlots ? 'full' : ''}`}>
        {imageCount} / {maxSlots} photos
      </span>
    </div>
  )
}
