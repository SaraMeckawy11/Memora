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
      style={{
        borderRadius: imageBorderRadius,
        overflow: 'hidden',
      }}
      onClick={() => onSelect(idx)}
    >
      {img ? (
        <>
          {/* ================= REAL IMAGE RENDERING ================= */}
          {img.crop ? (
            <div
              className="editor-slot-image"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                src={img.src}
                draggable={false}
                alt=""
                style={{
                  position: 'absolute',

                  /*  scale image so crop fills slot */
                  width: `${100 / img.crop.w}%`,
                  height: `${100 / img.crop.h}%`,

                  /*  shift image so crop aligns */
                  left: `${-img.crop.x * (100 / img.crop.w)}%`,
                  top: `${-img.crop.y * (100 / img.crop.h)}%`,

                  objectFit: 'cover', // important
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ) : (

            // Fallback (no crop yet)
            <img
              src={img.src}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: img.fit || imageFitMode
              }}
            />
          )}

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
