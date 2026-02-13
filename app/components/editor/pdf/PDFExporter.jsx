'use client'
import { useState, useCallback } from 'react'
import jsPDF from 'jspdf'
import { getSlotRects } from '@/app/utils/layoutCalculations'

export function usePDFExporter({
  pages,
  uploadedImages,
  selectedSize,
  sizes,
  layouts,
  pageMargin,
  pageGutter,
  pageBgColor,
  imageFitMode,
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [pdfQuality, setPdfQuality] = useState('print')
  const [showPdfMenu, setShowPdfMenu] = useState(false)

  const exportToPDF = useCallback(async (qualityOverride) => {
    console.log('[PDF] exportToPDF called, qualityOverride =', qualityOverride)
    console.log('[PDF] pages =', pages?.length, 'uploadedImages =', uploadedImages?.length, 'selectedSize =', selectedSize)
    console.log('[PDF] sizes =', sizes)

    const effectiveQuality = typeof qualityOverride === 'string' ? qualityOverride : pdfQuality
    setIsExporting(true)
    setExportProgress(0)

    try {
      const size = sizes.find(s => s.id === selectedSize)
      if (!size) {
        console.error('[PDF] No matching size found. selectedSize =', selectedSize, 'available sizes =', sizes?.map(s => s.id))
        alert('PDF Export failed: No matching page size. selectedSize=' + selectedSize)
        setIsExporting(false)
        setExportProgress(0)
        return
      }

      console.log('[PDF] Using size:', size.width, 'x', size.height)

      // ── Measure the actual editor-page DOM width ──
      // This is 320 px on desktop and 280 px on mobile (≤ 1024 px).
      // Every CSS-px value (margin, gutter, font-size) was authored
      // relative to this width, so we need the real number to convert
      // proportions into PDF inches exactly.
      const editorPageEl = document.querySelector('.editor-page')
      const EDITOR_BASE_W = editorPageEl ? editorPageEl.getBoundingClientRect().width : 320

      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [size.width, size.height],
      })

      for (let i = 0; i < pages.length; i++) {
        setExportProgress(Math.round(((i) / pages.length) * 100))
        await new Promise(resolve => setTimeout(resolve, 0))

        const page = pages[i]
        console.log(`[PDF] Processing page ${i + 1}/${pages.length}, type=${page.type}, images=${page.images?.length || 0}`)
        if (i > 0) pdf.addPage()

        pdf.setFillColor(page.type === 'text' ? (page.pageBgColor || '#ffffff') : pageBgColor)
        pdf.rect(0, 0, size.width, size.height, 'F')

        // Scale: CSS px → PDF inches.  Multiply any CSS-px value by this.
        const pxToIn = size.width / EDITOR_BASE_W
        // Scale: CSS px → jsPDF pt (1 in = 72 pt).
        const pxToPt = pxToIn * 72

        /* ============ TEXT PAGE — render with jsPDF native text ============ */
        if (page.type === 'text') {
          // Main text box
          if (!page.textBoxHidden && page.textContent) {
            const style = page.textStyle || {}
            const fontSize = (style.fontSize || 14) * pxToPt
            const color = style.color || '#000000'
            const align = style.textAlign || 'left'
            const fontFamily = style.fontFamily || 'Inter'

            pdf.setFontSize(fontSize)
            pdf.setTextColor(color)

            // Map to jsPDF built-in font
            let pdfFont = 'helvetica'
            const lower = fontFamily.toLowerCase()
            if (lower.includes('times') || lower.includes('georgia') || lower.includes('playfair') || lower.includes('prata')) pdfFont = 'times'
            else if (lower.includes('courier')) pdfFont = 'courier'
            pdf.setFont(pdfFont)

            // Position: textPosition is center-based %, textRect is width/height %
            const posX = (page.textPosition?.x ?? 50) / 100 * size.width
            const posY = (page.textPosition?.y ?? 50) / 100 * size.height
            const rectW = (page.textRect?.width ?? 50) / 100 * size.width
            const rectH = (page.textRect?.height ?? 30) / 100 * size.height
            const boxLeft = posX - rectW / 2
            const boxTop = posY - rectH / 2

            const jAlign = align === 'right' ? 'right' : align === 'center' ? 'center' : 'left'
            const textPad = 6 * pxToIn            // matches CSS padding: 6px
            const maxW = rectW - textPad * 2
            const lines = pdf.splitTextToSize(page.textContent, maxW > 0 ? maxW : rectW)

            let textX = boxLeft + textPad
            if (jAlign === 'center') textX = posX
            else if (jAlign === 'right') textX = boxLeft + rectW - textPad

            // Vertically center the text block within the box
            const lineH = fontSize / 72 * 1.4
            const totalTextH = lines.length * lineH
            const textY = posY - totalTextH / 2 + lineH * 0.8

            pdf.text(lines, textX, textY, { align: jAlign, maxWidth: maxW > 0 ? maxW : undefined })
          }

          // Overlay elements (text + photo)
          if (page.overlays?.length) {
            for (const overlay of page.overlays) {
              if (overlay.type === 'text' && overlay.content) {
                const s = overlay.style || {}
                const oFontSize = (s.fontSize || 18) * pxToPt
                const oColor = s.color || '#000000'
                const oAlign = s.textAlign || 'left'

                pdf.setFontSize(oFontSize)
                pdf.setTextColor(oColor)

                let oPdfFont = 'helvetica'
                const oLower = (s.fontFamily || '').toLowerCase()
                if (oLower.includes('times') || oLower.includes('georgia') || oLower.includes('playfair') || oLower.includes('prata')) oPdfFont = 'times'
                else if (oLower.includes('courier')) oPdfFont = 'courier'
                pdf.setFont(oPdfFont)

                const ox = (overlay.x / 100) * size.width
                const oy = (overlay.y / 100) * size.height
                const ow = (overlay.width / 100) * size.width
                const oh = (overlay.height / 100) * size.height

                const oJAlign = oAlign === 'right' ? 'right' : oAlign === 'center' ? 'center' : 'left'
                const oPad = 6 * pxToIn
                const oMaxW = ow - oPad * 2
                const oLines = pdf.splitTextToSize(overlay.content, oMaxW > 0 ? oMaxW : ow)

                let oTextX = ox + oPad
                if (oJAlign === 'center') oTextX = ox + ow / 2
                else if (oJAlign === 'right') oTextX = ox + ow - oPad

                const oLineH = oFontSize / 72 * 1.4
                const oTotalH = oLines.length * oLineH
                const oTextY = oy + oh / 2 - oTotalH / 2 + oLineH * 0.8

                pdf.text(oLines, oTextX, oTextY, { align: oJAlign, maxWidth: oMaxW > 0 ? oMaxW : undefined })
              } else if (overlay.type === 'photo' && overlay.src) {
                try {
                  const oImg = new Image()
                  oImg.src = overlay.src
                  await new Promise(r => { oImg.onload = r; oImg.onerror = r })
                  if (oImg.naturalWidth > 0) {
                    const ox = (overlay.x / 100) * size.width
                    const oy = (overlay.y / 100) * size.height
                    const ow = (overlay.width / 100) * size.width
                    const oh = (overlay.height / 100) * size.height
                    pdf.addImage(oImg, 'JPEG', ox, oy, ow, oh)
                  }
                } catch (e) { console.warn('Overlay photo failed', e) }
              }
            }
          }
          continue
        }

        /* ============ PHOTO PAGE — image grid logic ============ */
        {
          const effectiveMargin = typeof page.pageMargin === 'number' ? page.pageMargin : pageMargin
          const effectiveGutter = typeof page.pageGutter === 'number' ? page.pageGutter : pageGutter

          // Convert CSS px margin/gutter → PDF inches (same proportion as editor).
          const marginInInches = (effectiveMargin || 0) * pxToIn
          const gutterInInches = (effectiveGutter || 0) * pxToIn

          /* ---------- Caption metrics ---------- */
          const cs = page.captionStyle || {}
          const capFontSize = (cs.fontSize || 12) * pxToPt
          const capColor = cs.color || '#000000'
          const capFontFamily = cs.fontFamily || 'Inter'
          const capPosition = cs.position || 'bottom'   // 'top' | 'bottom'
          const capAlignment = cs.alignment || 'center'  // 'left' | 'center' | 'right'
          const hasCaption = !!page.caption

          // Map caption font to jsPDF built-in
          let capPdfFont = 'helvetica'
          const capLower = capFontFamily.toLowerCase()
          if (capLower.includes('times') || capLower.includes('georgia') || capLower.includes('playfair') || capLower.includes('prata')) capPdfFont = 'times'
          else if (capLower.includes('courier')) capPdfFont = 'courier'

          // Caption line height in inches
          const capLineH = capFontSize / 72 * 1.4
          let captionLines = []
          let captionTotalH = 0
          if (hasCaption) {
            pdf.setFontSize(capFontSize)
            pdf.setFont(capPdfFont)
            const maxCapW = size.width - marginInInches * 2
            captionLines = pdf.splitTextToSize(page.caption, maxCapW > 0 ? maxCapW : 1)
            captionTotalH = captionLines.length * capLineH
          }

          // Space caption + gutter takes away from the image area
          const captionSpace = hasCaption ? captionTotalH + gutterInInches : 0

          // Available area for images (inside margins, minus caption)
          const contentW = size.width - marginInInches * 2
          const contentH = size.height - marginInInches * 2 - captionSpace
          // Y-offset for image area depends on caption position
          const imageAreaY = marginInInches + (hasCaption && capPosition === 'top' ? captionSpace : 0)

          /* ---------- Render caption ---------- */
          if (hasCaption) {
            pdf.setFontSize(capFontSize)
            pdf.setTextColor(capColor)
            pdf.setFont(capPdfFont)

            const jAlign = capAlignment === 'right' ? 'right' : capAlignment === 'center' ? 'center' : 'left'
            let capX = marginInInches
            if (jAlign === 'center') capX = size.width / 2
            else if (jAlign === 'right') capX = size.width - marginInInches

            let capY
            if (capPosition === 'top') {
              capY = marginInInches + capLineH * 0.8
            } else {
              capY = size.height - marginInInches - captionTotalH + capLineH * 0.8
            }

            pdf.text(captionLines, capX, capY, { align: jAlign })
          }

          /* ---------- Image grid ---------- */
          if (page.images?.length) {
            const layout = layouts.find(l => l.id === page.layout) || layouts[0]

            const slotRects = getSlotRects(
              layout,
              contentW + marginInInches * 2,   // getSlotRects subtracts margin internally
              contentH + marginInInches * 2,    // so add it back — it will be subtracted again
              marginInInches,
              gutterInInches,
              page.layoutSplitX ?? 50,
              page.layoutSplitY ?? 50
            )

          for (let idx = 0; idx < page.images.length; idx++) {
            const imgId = page.images[idx]
            if (!imgId) continue
            
            const imgData = uploadedImages.find(u => u.id === imgId)
            if (!imgData || !slotRects[idx]) {
              console.warn(`[PDF] Page ${i + 1} slot ${idx}: no imgData or slotRect. imgId=${imgId}, found=${!!imgData}, slotRect=${!!slotRects[idx]}`)
              continue
            }

            console.log(`[PDF] Page ${i + 1} slot ${idx}: loading image, src type = ${imgData.src?.substring(0, 20)}...`)

            const rect = slotRects[idx]
            const slotX = marginInInches + rect.x
            const slotY = imageAreaY + rect.y
            const slotW = rect.width
            const slotH = rect.height

            const imgElement = new Image()
            imgElement.src = imgData.src
            await new Promise((resolve) => {
              imgElement.onload = () => { console.log(`[PDF] Image loaded OK: ${imgElement.naturalWidth}x${imgElement.naturalHeight}`); resolve() }
              imgElement.onerror = (err) => { console.error(`[PDF] Image FAILED to load:`, imgData.src?.substring(0, 60), err); resolve() }
            })

            const imgW = imgElement.naturalWidth || 1000
            const imgH = imgElement.naturalHeight || 1000
            const imgRatio = imgW / imgH
            const slotRatio = slotW / slotH

            const crop = imgData.crop
            const fitMode = imgData.fit || imageFitMode || 'cover'
            
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', { alpha: false })

            let dpiScale = 2
            if (effectiveQuality === 'screen') dpiScale = 1
            else if (effectiveQuality === 'print') dpiScale = 3.125
            else if (effectiveQuality === 'original') {
              const sourceDpiScale = Math.min(imgW / (slotW * 96), imgH / (slotH * 96))
              dpiScale = Math.max(3.125, Math.min(sourceDpiScale, 3.5)) 
            }

            let finalX, finalY, finalW, finalH
            let cvsW, cvsH
            let sx, sy, sw, sh

            if (crop) {
              finalX = slotX; finalY = slotY; finalW = slotW; finalH = slotH
              cvsW = slotW * 96 * dpiScale
              cvsH = slotH * 96 * dpiScale
              sx = (crop.x / 100) * imgW
              sy = (crop.y / 100) * imgH
              sw = (crop.w / 100) * imgW
              sh = (crop.h / 100) * imgH
            } 
            else if (fitMode === 'contain') {
              if (imgRatio > slotRatio) {
                finalW = slotW
                finalH = slotW / imgRatio
              } else {
                finalH = slotH
                finalW = slotH * imgRatio
              }
              finalX = slotX + (slotW - finalW) / 2
              finalY = slotY + (slotH - finalH) / 2
              cvsW = finalW * 96 * dpiScale
              cvsH = finalH * 96 * dpiScale
              sx = 0; sy = 0; sw = imgW; sh = imgH
            } 
            else {
              finalX = slotX; finalY = slotY; finalW = slotW; finalH = slotH
              cvsW = slotW * 96 * dpiScale
              cvsH = slotH * 96 * dpiScale

              if (imgRatio > slotRatio) {
                sh = imgH
                sw = imgH * slotRatio
                sx = (imgW - sw) / 2
                sy = 0
              } else {
                sw = imgW
                sh = imgW / slotRatio
                sx = 0
                sy = (imgH - sh) / 2
              }
            }

            canvas.width = Math.floor(cvsW)
            canvas.height = Math.floor(cvsH)

            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            try {
              ctx.drawImage(imgElement, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
              const format = 'image/jpeg' 
              const q = effectiveQuality === 'screen' ? 0.8 : 0.95
              const imgDataUrl = canvas.toDataURL(format, q)
              pdf.addImage(imgDataUrl, 'JPEG', finalX, finalY, finalW, finalH)
            } catch (err) {
              console.warn('Image processing failed', err)
            }

            canvas.width = 1
            canvas.height = 1
          }
        }
        }
      }
      
      console.log('[PDF] All pages processed, generating blob...')
      setExportProgress(100)
      await new Promise(resolve => setTimeout(resolve, 100))

      try {
        const blob = pdf.output('blob')
        console.log('[PDF] Blob created, size =', blob.size, 'bytes')
        const filename = 'photobook.pdf'
        
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, filename)
        } else {
          const url = URL.createObjectURL(blob)
          console.log('[PDF] Download URL created, triggering download...')
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          console.log('[PDF] link.click() called')
          
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 5000)
        }

      } catch (saveErr) {
        console.error('PDF Save Failed:', saveErr)
        alert('Created PDF but failed to save file. The file might be too large for your browser.')
      }

    } catch (e) {
      console.error('PDF Export Error:', e)
      alert('Failed to export PDF: ' + (e.message || 'Unknown error'))
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [
    pages,
    uploadedImages,
    selectedSize,
    sizes,
    layouts,
    pageMargin,
    pageGutter,
    pageBgColor,
    imageFitMode,
    pdfQuality,
  ])

  return {
    isExporting,
    exportProgress,
    pdfQuality,
    setPdfQuality,
    showPdfMenu,
    setShowPdfMenu,
    exportToPDF,
  }
}
