/**
 * Calculate slot rectangles for a given layout configuration
 * @param {Object} layout - Layout object with template type
 * @param {number} pageW - Page width
 * @param {number} pageH - Page height
 * @param {number} pageMargin - Page margin (in pixels or inches depending on context)
 * @param {number} pageGutter - Gutter between slots (in pixels or inches)
 * @param {number} layoutSplitX - Horizontal split percentage (0-100)
 * @param {number} layoutSplitY - Vertical split percentage (0-100)
 * @returns {Array} Array of slot rectangles with {x, y, width, height}
 */
export function getSlotRects(
  layout,
  pageW,
  pageH,
  pageMargin = 0,
  pageGutter = 0,
  layoutSplitX = 50,
  layoutSplitY = 50
) {
  const innerW = pageW - pageMargin * 2
  const innerH = pageH - pageMargin * 2
  const splitX = layoutSplitX / 100
  const splitY = layoutSplitY / 100

  switch (layout.template) {
    case 'single':
      return [{ x: 0, y: 0, width: innerW, height: innerH }]

    case '2-horizontal': {
      const w1 = (innerW - pageGutter) * splitX
      const w2 = (innerW - pageGutter) * (1 - splitX)
      return [
        { x: 0, y: 0, width: w1, height: innerH },
        { x: w1 + pageGutter, y: 0, width: w2, height: innerH },
      ]
    }

    case '2-vertical': {
      const h1 = (innerH - pageGutter) * splitY
      const h2 = (innerH - pageGutter) * (1 - splitY)
      return [
        { x: 0, y: 0, width: innerW, height: h1 },
        { x: 0, y: h1 + pageGutter, width: innerW, height: h2 },
      ]
    }

    case '1-top-2-bottom': {
      const topH = innerH * splitY
      const bottomH = innerH - topH - pageGutter
      const w = (innerW - pageGutter) / 2
      return [
        { x: 0, y: 0, width: innerW, height: topH },
        { x: 0, y: topH + pageGutter, width: w, height: bottomH },
        { x: w + pageGutter, y: topH + pageGutter, width: w, height: bottomH },
      ]
    }

    case '2-top-1-bottom': {
      const bottomH = innerH * (1 - splitY)
      const topH = innerH - bottomH - pageGutter
      const w = (innerW - pageGutter) / 2
      return [
        { x: 0, y: 0, width: w, height: topH },
        { x: w + pageGutter, y: 0, width: w, height: topH },
        { x: 0, y: topH + pageGutter, width: innerW, height: bottomH },
      ]
    }

    case '4-grid': {
      const w = (innerW - pageGutter) / 2
      const h = (innerH - pageGutter) / 2
      return [
        { x: 0, y: 0, width: w, height: h },
        { x: w + pageGutter, y: 0, width: w, height: h },
        { x: 0, y: h + pageGutter, width: w, height: h },
        { x: w + pageGutter, y: h + pageGutter, width: w, height: h },
      ]
    }

    case '6-grid': {
      const w = (innerW - pageGutter * 2) / 3
      const h = (innerH - pageGutter) / 2
      return [
        { x: 0, y: 0, width: w, height: h },
        { x: w + pageGutter, y: 0, width: w, height: h },
        { x: (w + pageGutter) * 2, y: 0, width: w, height: h },
        { x: 0, y: h + pageGutter, width: w, height: h },
        { x: w + pageGutter, y: h + pageGutter, width: w, height: h },
        { x: (w + pageGutter) * 2, y: h + pageGutter, width: w, height: h },
      ]
    }

    default:
      return []
  }
}
