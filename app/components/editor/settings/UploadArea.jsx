'use client'

import '@/styles/editor/UploadArea.css'

export default function UploadArea({ onUpload, compact = false, label = "Photos" }) {
  // Use a unique id for the input to avoid collisions if multiple UploadAreas exist
  const inputId = 'image-upload-topbar';
  return (
    <div className={compact ? "editor-upload-btn-topbar" : "editor-upload-wrapper"}>
      <input
        type="file"
        id={inputId}
        multiple
        accept="image/*"
        hidden
        onChange={onUpload}
      />
      <label htmlFor={inputId} className={compact ? "select-page-btn upload-photos-btn" : "editor-upload-label"} style={compact ? {display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer'} : {}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.25rem'}}>
          <path d="M12 5v14m7-7H5" />
        </svg>
        <span>{label}</span>
        {!compact && (
          <p className="editor-upload-sub">
            Click to browse or drag images here<br />
            Max 50MB per image
          </p>
        )}
      </label>
    </div>
  )
}
