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
    const effectiveQuality = typeof qualityOverride === 'string' ? qualityOverride : pdfQuality
    setIsExporting(true)
    setExportProgress(0)

    try {
      const size = sizes.find(s => s.id === selectedSize)
      if (!size) return

      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [size.width, size.height],
      })

      for (let i = 0; i < pages.length; i++) {
        setExportProgress(Math.round(((i) / pages.length) * 100))
        await new Promise(resolve => setTimeout(resolve, 0))

        const page = pages[i]
        if (i > 0) pdf.addPage()

        pdf.setFillColor(pageBgColor)
        pdf.rect(0, 0, size.width, size.height, 'F')

        if (page.images?.length) {
          const layout = layouts.find(l => l.id === page.layout) || layouts[0]
          const effectiveMargin = typeof page.pageMargin === 'number' ? page.pageMargin : pageMargin
          const effectiveGutter = typeof page.pageGutter === 'number' ? page.pageGutter : pageGutter
          const marginInInches = (effectiveMargin || 0) / 96
          const gutterInInches = (effectiveGutter || 0) / 96
          
          const slotRects = getSlotRects(
            layout,
            size.width,
            size.height,
            marginInInches,
            gutterInInches,
            page.layoutSplitX ?? 50,
            page.layoutSplitY ?? 50
          )

          for (let idx = 0; idx < page.images.length; idx++) {
            const imgId = page.images[idx]
            if (!imgId) continue
            
            const imgData = uploadedImages.find(u => u.id === imgId)
            if (!imgData || !slotRects[idx]) continue

            const rect = slotRects[idx]
            const slotX = marginInInches + rect.x
            const slotY = marginInInches + rect.y
            const slotW = rect.width
            const slotH = rect.height

            const imgElement = new Image()
            imgElement.src = imgData.src
            await new Promise((resolve) => {
              imgElement.onload = resolve
              imgElement.onerror = resolve
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

        if (page.caption) {
          pdf.setFontSize(page.captionStyle?.fontSize || 12)
          pdf.setTextColor(page.captionStyle?.color || '#000000')
          pdf.text(page.caption, size.width / 2, size.height - 0.3, { align: 'center' })
        }
      }
      
      setExportProgress(100)
      await new Promise(resolve => setTimeout(resolve, 100))

      try {
        const blob = pdf.output('blob')
        const filename = 'photobook.pdf'
        
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, filename)
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 2000)
        }

      } catch (saveErr) {
        console.error('PDF Save Failed:', saveErr)
        alert('Created PDF but failed to save file. The file might be too large for your browser.')
      }

    } catch (e) {
      console.error('PDF Export Error:', e)
      alert('Failed to export PDF: ' + (e.message || 'Unknown error'))
    }

    setIsExporting(false)
    setExportProgress(0)
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
