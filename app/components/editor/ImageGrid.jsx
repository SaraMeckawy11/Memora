'use client'

import ImageSlot from './ImageSlot'

export default function ImageGrid({
  currentPage,
  currentLayoutObj,
  pageGutter,
  maxSlots,
  uploadedImages,
  selectedSlotIdx,
  imageFitMode,
  imageBorderRadius,
  onSelectSlot,
  onRemoveImage,
}) {
  const images = currentPage?.images || []
  const t = currentLayoutObj?.template
  const splitX = currentPage?.layoutSplitX ?? 50
  const splitY = currentPage?.layoutSplitY ?? 50

  const slot = (id, idx) => (
    <ImageSlot
      key={idx}
      img={id ? uploadedImages.find(i => i.id === id) : null}
      idx={idx}
      selected={selectedSlotIdx === idx}
      imageFitMode={imageFitMode}
      imageBorderRadius={imageBorderRadius}
      onSelect={onSelectSlot}
      onRemove={onRemoveImage}
    />
  )

  if (t === '1-top-2-bottom') {
    return (
      <div className="layout-col" style={{ gap: pageGutter }}>
        <div style={{ flex: splitY }}>{slot(images[0], 0)}</div>
        <div className="layout-row" style={{ flex: 100 - splitY, gap: pageGutter }}>
          <div style={{ flex: splitX }}>{slot(images[1], 1)}</div>
          <div style={{ flex: 100 - splitX }}>{slot(images[2], 2)}</div>
        </div>
      </div>
    )
  }

  if (t === '2-top-1-bottom') {
    return (
      <div className="layout-col" style={{ gap: pageGutter }}>
        <div className="layout-row" style={{ flex: splitY, gap: pageGutter }}>
          <div style={{ flex: splitX }}>{slot(images[0], 0)}</div>
          <div style={{ flex: 100 - splitX }}>{slot(images[1], 1)}</div>
        </div>
        <div style={{ flex: 100 - splitY }}>{slot(images[2], 2)}</div>
      </div>
    )
  }

  if (t === '2-vertical') {
    return (
      <div className="layout-col" style={{ gap: pageGutter }}>
        <div style={{ flex: splitY }}>{slot(images[0], 0)}</div>
        <div style={{ flex: 100 - splitY }}>{slot(images[1], 1)}</div>
      </div>
    )
  }

  if (t === '2-horizontal') {
    return (
      <div className="layout-row" style={{ gap: pageGutter }}>
        <div style={{ flex: splitX }}>{slot(images[0], 0)}</div>
        <div style={{ flex: 100 - splitX }}>{slot(images[1], 1)}</div>
      </div>
    )
  }

  if (t === '4-grid') {
    return (
      <div className="layout-col" style={{ gap: pageGutter }}>
        <div className="layout-row" style={{ flex: splitY, gap: pageGutter }}>
          <div style={{ flex: splitX }}>{slot(images[0], 0)}</div>
          <div style={{ flex: 100 - splitX }}>{slot(images[1], 1)}</div>
        </div>
        <div className="layout-row" style={{ flex: 100 - splitY, gap: pageGutter }}>
          <div style={{ flex: splitX }}>{slot(images[2], 2)}</div>
          <div style={{ flex: 100 - splitX }}>{slot(images[3], 3)}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="layout-grid"
      style={{
        gridTemplateColumns: `repeat(${currentLayoutObj.cols},1fr)`,
        gridTemplateRows: `repeat(${currentLayoutObj.rows},1fr)`,
        gap: pageGutter,
      }}
    >
      {Array.from({ length: maxSlots }).map((_, i) => slot(images[i], i))}
    </div>
  )
}
