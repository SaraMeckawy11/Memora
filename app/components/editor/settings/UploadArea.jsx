'use client'

import '@/styles/editor/UploadArea.css'

export default function UploadArea({ onUpload, compact = false }) {
  const wrapperClass = compact ? "editor-upload-wrapper-compact" : "editor-upload-wrapper"
  
  return (
    <div className={wrapperClass}>
      <input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        hidden
        onChange={onUpload}
      />
      <label htmlFor="image-upload" className="editor-upload-label">
        <div className="editor-upload-icon">↑</div>
        <p className="editor-upload-title">Upload photos</p>
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
