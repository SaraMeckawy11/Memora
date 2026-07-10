'use client'

import { LAYOUTS } from '@/features/editor/components/settings/LayoutSection'
import { getSlotRects } from '@/app/utils/layoutCalculations'
import { PhotoBookPage, ProjectImage } from '@/types/project'

const normalizeCrop = (crop?: { x: number; y: number; w: number; h: number }) => {
  if (!crop || ![crop.x, crop.y, crop.w, crop.h].every(Number.isFinite)) return null
  const normalized = crop.w <= 1.5 && crop.h <= 1.5 && crop.x <= 1.5 && crop.y <= 1.5
  return normalized
    ? { x: crop.x * 100, y: crop.y * 100, w: crop.w * 100, h: crop.h * 100 }
    : crop
}

function PreviewImage({ image, fit = 'cover', radius = 0 }: { image?: ProjectImage | null; fit?: string; radius?: number }) {
  if (!image?.src) return <div className="review-layout-empty" />
  const crop = normalizeCrop(image.crop)

  return (
    <div className="review-layout-image" style={{ borderRadius: radius }}>
      <img
        src={image.src}
        alt=""
        draggable={false}
        style={crop ? {
          position: 'absolute',
          width: `${100 / (crop.w / 100)}%`,
          height: `${100 / (crop.h / 100)}%`,
          maxWidth: 'none',
          maxHeight: 'none',
          left: `${-(crop.x / 100) * (100 / (crop.w / 100))}%`,
          top: `${-(crop.y / 100) * (100 / (crop.h / 100))}%`,
          objectFit: 'cover',
        } : {
          width: '100%',
          height: '100%',
          objectFit: (image.fit || fit) as any,
        }}
      />
    </div>
  )
}

interface ReviewPagePreviewProps {
  page: PhotoBookPage
  uploadedImages: ProjectImage[]
  pageAspect: number
  pageMargin: number
  pageGutter: number
  pageBgColor: string
  imageFitMode: string
  imageBorderRadius: number
}

export default function ReviewPagePreview({
  page,
  uploadedImages,
  pageAspect,
  pageMargin,
  pageGutter,
  pageBgColor,
  imageFitMode,
  imageBorderRadius,
}: ReviewPagePreviewProps) {
  const virtualWidth = 1000
  const virtualHeight = virtualWidth / Math.max(pageAspect, 0.1)
  const margin = page.pageMargin ?? pageMargin
  const gutter = page.pageGutter ?? pageGutter
  const layout = LAYOUTS.find(item => item.id === page.layout) || LAYOUTS[0]
  const rects = getSlotRects(
    layout,
    virtualWidth,
    virtualHeight,
    margin,
    gutter,
    page.layoutSplitX ?? 50,
    page.layoutSplitY ?? 50,
  )
  const findImage = (id: string | number | null | undefined) =>
    id === null || id === undefined
      ? null
      : uploadedImages.find(image => String(image.id) === String(id)) || null
  const toPercentX = (value: number) => `${(value / virtualWidth) * 100}%`
  const toPercentY = (value: number) => `${(value / virtualHeight) * 100}%`
  const contentWidth = virtualWidth - margin * 2
  const contentHeight = virtualHeight - margin * 2

  return (
    <div className="review-layout-page" style={{ backgroundColor: page.pageBgColor || pageBgColor }}>
      {page.type === 'text' ? (
        !page.textBoxHidden && (
          <div
            className="review-layout-text"
            style={{
              left: `${page.textPosition?.x ?? 50}%`,
              top: `${page.textPosition?.y ?? 50}%`,
              width: `${page.textRect?.width ?? 62}%`,
              height: `${page.textRect?.height ?? 18}%`,
              color: page.textStyle?.color || '#141414',
              fontFamily: page.textStyle?.fontFamily || 'Inter',
              textAlign: page.textStyle?.textAlign || 'center',
            }}
          >
            {page.textContent || ''}
          </div>
        )
      ) : (
        <>
          {rects.map((rect, slotIndex) => (
            <div
              key={slotIndex}
              className="review-layout-slot"
              style={{
                left: toPercentX(margin + rect.x),
                top: toPercentY(margin + rect.y),
                width: toPercentX(rect.width),
                height: toPercentY(rect.height),
              }}
            >
              <PreviewImage
                image={findImage(page.images[slotIndex])}
                fit={imageFitMode}
                radius={imageBorderRadius}
              />
            </div>
          ))}

          {page.caption && (
            <div
              className={`review-layout-caption review-layout-caption--${page.textStyle?.position || 'bottom'}`}
              style={{
                color: page.textStyle?.color || '#141414',
                fontFamily: page.textStyle?.fontFamily || 'Inter',
                textAlign: page.textStyle?.alignment || 'center',
              }}
            >
              {page.caption}
            </div>
          )}
        </>
      )}

      {page.overlays?.map(overlay => {
        const overlayImage = overlay.type === 'photo'
          ? findImage(overlay.imageId) || (overlay.src ? { id: overlay.id, src: overlay.src, crop: overlay.crop, fit: overlay.fit } : null)
          : null
        return (
          <div
            key={overlay.id}
            className={`review-layout-overlay review-layout-overlay--${overlay.type}`}
            style={{
              left: toPercentX(margin + (overlay.x / 100) * contentWidth),
              top: toPercentY(margin + (overlay.y / 100) * contentHeight),
              width: toPercentX((overlay.width / 100) * contentWidth),
              height: toPercentY((overlay.height / 100) * contentHeight),
              color: overlay.style?.color || '#141414',
              fontFamily: overlay.style?.fontFamily || 'Inter',
              textAlign: overlay.style?.textAlign || 'center',
              borderRadius: overlay.style?.borderRadius || 0,
            }}
          >
            {overlay.type === 'text'
              ? overlay.content
              : <PreviewImage image={overlayImage as ProjectImage | null} fit={overlay.fit || imageFitMode} radius={overlay.style?.borderRadius || 0} />}
          </div>
        )
      })}
    </div>
  )
}
