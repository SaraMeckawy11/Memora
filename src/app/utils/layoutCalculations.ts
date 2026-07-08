import { LayoutConfig, Rect } from "@/types/layout";

/**
 * Calculate slot rectangles for a given layout configuration
 */
export function getSlotRects(
  layout: LayoutConfig,
  pageW: number,
  pageH: number,
  pageMargin: number = 0,
  pageGutter: number = 0,
  layoutSplitX: number = 50,
  layoutSplitY: number = 50
): Rect[] {
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

    case '3-horizontal': {
      const w = (innerW - pageGutter * 2) / 3
      return [
        { x: 0, y: 0, width: w, height: innerH },
        { x: w + pageGutter, y: 0, width: w, height: innerH },
        { x: (w + pageGutter) * 2, y: 0, width: w, height: innerH },
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

    case '3-vertical': {
      const h = (innerH - pageGutter * 2) / 3
      return [
        { x: 0, y: 0, width: innerW, height: h },
        { x: 0, y: h + pageGutter, width: innerW, height: h },
        { x: 0, y: (h + pageGutter) * 2, width: innerW, height: h },
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

    case '2-3-grid': {
      const w = (innerW - pageGutter) / 2
      const h = (innerH - pageGutter * 2) / 3
      return [
        { x: 0, y: 0, width: w, height: h },
        { x: w + pageGutter, y: 0, width: w, height: h },
        { x: 0, y: h + pageGutter, width: w, height: h },
        { x: w + pageGutter, y: h + pageGutter, width: w, height: h },
        { x: 0, y: (h + pageGutter) * 2, width: w, height: h },
        { x: w + pageGutter, y: (h + pageGutter) * 2, width: w, height: h },
      ]
    }

    default:
      return []
  }
}
