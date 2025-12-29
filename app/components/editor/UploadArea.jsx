'use client'

export default function UploadArea({ onUpload }) {
  return (
    <div className="editor-upload-wrapper">
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
        <p className="editor-upload-sub">
          Click to browse or drag images here<br />
          Max 10MB per image
        </p>
      </label>
    </div>
  )
}
