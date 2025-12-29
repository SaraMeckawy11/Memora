'use client'

export default function ImageSlot({
  img,
  idx,
  selected,
  imageFitMode,
  imageBorderRadius,
  onSelect,
  onRemove,
}) {
  return (
    <div
      className={`editor-slot ${img ? 'has-image' : ''} ${
        selected ? 'selected' : ''
      }`}
      style={{ borderRadius: imageBorderRadius }}
      onClick={() => onSelect(idx)}
    >
      {img ? (
        <>
          <img src={img.src} alt="" style={{ objectFit: imageFitMode }} />
          <button
            className="editor-slot-remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(img.id)
            }}
          >
            ×
          </button>
        </>
      ) : (
        <span className="editor-slot-placeholder">
          {selected ? 'Select photo' : '+ Add photo'}
        </span>
      )}
    </div>
  )
}