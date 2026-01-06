'use client'

import { usePhotoBook } from '@/app/components/editor/PhotoBookProvider'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

import StepSetup from '@/app/components/StepSetup'
import StepEditor from '@/app/components/editor/StepEditor'
import StepReview from '@/app/components/StepReview'
import { saveProject, loadProject, clearProject } from '@/app/utils/storage'

import '@/styles/CreatePage.css'

/* ================= CONSTANTS ================= */

const PRODUCTS = [
  { id: 1, name: 'Hardcover', icon: '📕', description: 'Premium hardcover with dust jacket', price: 29.99 },
  { id: 2, name: 'Softcover', icon: '📔', description: 'Flexible softcover binding', price: 19.99 },
]

const SIZES = [
  {
    id: 1,
    name: 'A4 Portrait',
    label: '210 × 297 mm',
    aspect: (8.27 / 11.69).toFixed(2), // ≈ 0.71
    width: 8.27,     // inches
    height: 11.69,   // inches
    popular: true,
  },
  {
    id: 2,
    name: 'A4 Landscape',
    label: '297 × 210 mm',
    aspect: (11.69 / 8.27).toFixed(2), // ≈ 1.41
    width: 11.69,    // inches
    height: 8.27,    // inches
  },
  {
    id: 3,
    name: 'B5 Portrait',
    label: '176 × 250 mm',
    aspect: (6.93 / 9.84).toFixed(2), // ≈ 0.70
    width: 6.93,     // inches
    height: 9.84,    // inches
  },
  {
    id: 4,
    name: 'B5 Landscape',
    label: '250 × 176 mm',
    aspect: (9.84 / 6.93).toFixed(2), // ≈ 1.42
    width: 9.84,     // inches
    height: 6.93,    // inches
  },
]

const LAYOUTS = [
  { id: 'single', name: 'Full Page', cols: 1, rows: 1, template: 'single' },
  { id: '2-horizontal', name: 'Side by Side', cols: 2, rows: 1, template: '2-horizontal' },
  { id: '2-vertical', name: 'Stacked', cols: 1, rows: 2, template: '2-vertical' },
  { id: '1-top-2-bottom', name: '1 Top + 2 Bottom', cols: 2, rows: 2, template: '1-top-2-bottom' },
  { id: '2-top-1-bottom', name: '2 Top + 1 Bottom', cols: 2, rows: 2, template: '2-top-1-bottom' },
  { id: '4-grid', name: '2×2 Grid', cols: 2, rows: 2, template: '4-grid' },
  { id: '6-grid', name: '3×2 Grid', cols: 3, rows: 2, template: '6-grid' },
]

const FONT_FAMILIES = [
  { name: 'Inter', label: 'Inter (Sans-serif)' },
  { name: 'Arial', label: 'Arial (Sans-serif)' },
  { name: 'Helvetica', label: 'Helvetica (Sans-serif)' },
  { name: 'Georgia', label: 'Georgia (Serif)' },
  { name: 'Times New Roman', label: 'Times New Roman (Serif)' },
  { name: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { name: 'Pacifico', label: 'Pacifico (Handwritten)' },
  { name: 'Dancing Script', label: 'Dancing Script (Script)' },
  { name: 'Caveat', label: 'Caveat (Handwritten)' },
  { name: 'Satisfy', label: 'Satisfy (Script)' },
  { name: 'Great Vibes', label: 'Great Vibes (Calligraphy)' },
  { name: 'Shadows Into Light', label: 'Shadows Into Light (Handwritten)' },
  { name: 'Lobster', label: 'Lobster (Display)' },
  { name: 'Permanent Marker', label: 'Permanent Marker (Marker)' },
]

/* ================= PAGE ================= */

export default function CreatePage() {
  const router = useRouter()
  const { state, eventBus, isLoaded } = usePhotoBook()

  const [step, setStep] = useState(1)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [pageCount] = useState(20)

  const [coverImage, setCoverImage] = useState(null)
  const [coverText, setCoverText] = useState('')
  const [coverTheme, setCoverTheme] = useState('classic')

  const [pages, setPages] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(0)
  const [uploadedImages, setUploadedImages] = useState([])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [selectedCaption, setSelectedCaption] = useState('')
  const [selectedFontSize, setSelectedFontSize] = useState(16)
  const [selectedFontColor, setSelectedFontColor] = useState('#000000')
  const [selectedFontFamily, setSelectedFontFamily] = useState('Inter')
  const [captionPosition, setCaptionPosition] = useState('bottom')
  const [captionAlignment, setCaptionAlignment] = useState('center')

  const [selectedLayout, setSelectedLayout] = useState('single')

  const [pageMargin, setPageMargin] = useState(8)
  const [pageGutter, setPageGutter] = useState(8)
  const [pageBgColor, setPageBgColor] = useState('#ffffff')
  const [imageFitMode, setImageFitMode] = useState('cover')
  const [imageBorderRadius, setImageBorderRadius] = useState(0)
  const [showPageNumbers, setShowPageNumbers] = useState(false)

  /* ================= Layout Split ================= */

  const [layoutSplitX, setLayoutSplitX] = useState(50)
  const [layoutSplitY, setLayoutSplitY] = useState(50)

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [autoSave, setAutoSave] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [pdfQuality, setPdfQuality] = useState('print') // 'screen' | 'print' | 'original'
  const [showPdfMenu, setShowPdfMenu] = useState(false)

  const isStep1Valid = selectedProduct && selectedSize

  /* ================= History (Undo/Redo) ================= */
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize history with first state
  useEffect(() => {
    if (pages.length > 0 && history.length === 0) {
      setHistory([pages])
      setHistoryIndex(0)
    }
  }, [pages, history.length])

  const setPagesWithHistory = (newPagesOrFn) => {
    let newPages
    if (typeof newPagesOrFn === 'function') {
      newPages = newPagesOrFn(pages)
    } else {
      newPages = newPagesOrFn
    }

    if (newPages === pages) return

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newPages)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setPages(newPages)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setPages(history[newIndex])
      setHistoryIndex(newIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setPages(history[newIndex])
      setHistoryIndex(newIndex)
    }
  }

  /* ================= SAVE ================= */

  const saveProgress = useCallback(async () => {
    setIsSaving(true)

    try {
      // Convert blob URLs to Blobs for storage
      const imagesToSave = await Promise.all(uploadedImages.map(async (img) => {
        if (img.src && img.src.startsWith('blob:')) {
          try {
            const response = await fetch(img.src)
            const blob = await response.blob()
            // Store blob, clear src (it will be regenerated on load)
            return { ...img, src: null, blob }
          } catch (e) {
            console.error('Failed to fetch blob for saving', e)
            return img
          }
        }
        return img
      }))

      const draft = {
        step,
        pages: pages.map(p => ({
          ...p,
          // Ensure we save all properties needed
        })),
        uploadedImages: imagesToSave,
        selectedProduct,
        selectedSize,
        coverImage,
        coverText,
        coverTheme,
        settings: {
          pageMargin,
          pageGutter,
          pageBgColor,
          imageFitMode,
          imageBorderRadius,
          showPageNumbers,
          selectedLayout,
          captionDefaults: {
            fontFamily: selectedFontFamily,
            fontSize: selectedFontSize,
            color: selectedFontColor,
            position: captionPosition,
            alignment: captionAlignment,
          },
          autoSave,
          layoutSplitX,
          layoutSplitY,
        },
        lastSaved: new Date().toISOString(),
      }

      await saveProject(draft)
      setLastSaved(draft.lastSaved)
    } catch (e) {
      console.error('Failed to save project', e)
    } finally {
      setTimeout(() => setIsSaving(false), 400)
    }
  }, [
    step,
    pages,
    uploadedImages,
    selectedProduct,
    selectedSize,
    coverImage,
    coverText,
    coverTheme,
    pageMargin,
    pageGutter,
    pageBgColor,
    imageFitMode,
    imageBorderRadius,
    showPageNumbers,
    layoutSplitX,
    layoutSplitY,
    selectedLayout,
    selectedFontFamily,
    selectedFontSize,
    selectedFontColor,
    captionPosition,
    captionAlignment,
    autoSave,
  ])

  /* ================= LOAD ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const d = await loadProject()
        if (!d) return

        // Restore Blobs to Blob URLs
        const restoredImages = (d.uploadedImages || []).map(img => {
          if (img.blob instanceof Blob) {
            return { ...img, src: URL.createObjectURL(img.blob) }
          }
          return img
        })

        setStep(d.step || 1)
        setPages(Array.isArray(d.pages) ? d.pages : [])
        setUploadedImages(restoredImages)
        
        setSelectedProduct(d.selectedProduct ?? null)
        setSelectedSize(d.selectedSize ?? null)
        setCoverImage(d.coverImage ?? null)
        setCoverText(d.coverText ?? '')
        setCoverTheme(d.coverTheme ?? 'classic')
        setLastSaved(d.lastSaved ?? null)

        /* ✅ RESTORE SETTINGS */
        const s = d.settings || {}

        setPageMargin(s.pageMargin ?? 8)
        setPageGutter(s.pageGutter ?? 8)
        setPageBgColor(s.pageBgColor ?? '#ffffff')
        setImageFitMode(s.imageFitMode ?? 'cover')
        setImageBorderRadius(s.imageBorderRadius ?? 0)
        setShowPageNumbers(s.showPageNumbers ?? false)

        setLayoutSplitX(s.layoutSplitX ?? 50)
        setLayoutSplitY(s.layoutSplitY ?? 50)

        setSelectedLayout(s.selectedLayout ?? 'single')

        if (s.captionDefaults) {
          setSelectedFontFamily(s.captionDefaults.fontFamily ?? 'Inter')
          setSelectedFontSize(s.captionDefaults.fontSize ?? 16)
          setSelectedFontColor(s.captionDefaults.color ?? '#000000')
          setCaptionPosition(s.captionDefaults.position ?? 'bottom')
          setCaptionAlignment(s.captionDefaults.alignment ?? 'center')
        }

        setAutoSave(s.autoSave ?? true)

      } catch (err) {
        console.error('Failed to load draft', err)
      }
    }
    load()
  }, [])

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    if (!autoSave || step < 2) return
    const t = setTimeout(saveProgress, 2000)
    return () => clearTimeout(t)
  }, [
    pages,
    // uploadedImages,
    pageMargin,
    pageGutter,
    pageBgColor,
    imageFitMode,
    imageBorderRadius,

    layoutSplitX,
    layoutSplitY,

    selectedLayout,

    selectedFontFamily,
    selectedFontSize,
    selectedFontColor,
    captionPosition,
    captionAlignment,

    autoSave,
    step,
  ])

  /* ================= CLEAR SAVED PROGRESS ================= */

  const clearProgress = async () => {
    if (!confirm('Clear all saved progress?')) return

    await clearProject()

    setPages([])
    setUploadedImages([])
    setSelectedProduct(null)
    setSelectedSize(null)
    setCoverImage(null)
    setCoverText('')
    setCoverTheme('classic')
    setStep(1)
    setLastSaved(null)

    /* reset settings */
    setPageMargin(8)
    setPageGutter(8)
    setPageBgColor('#ffffff')
    setImageFitMode('cover')
    setImageBorderRadius(0)
    setShowPageNumbers(false)

    setLayoutSplitX(50)
    setLayoutSplitY(50)

    setSelectedLayout('single')

    setSelectedFontFamily('Inter')
    setSelectedFontSize(16)
    setSelectedFontColor('#000000')
    setCaptionPosition('bottom')
    setCaptionAlignment('center')

    setAutoSave(true)
  }

  /* ================= apply to all pages ================= */
  const applyCaptionStyleToAllPages = useCallback(() => {
    setPages(p =>
      p.map(pg => ({
        ...pg,
        captionStyle: {
          fontSize: selectedFontSize,
          color: selectedFontColor,
          fontFamily: selectedFontFamily,
          position: captionPosition,
          alignment: captionAlignment,
        },
      }))
    )
  }, [
    selectedFontSize,
    selectedFontColor,
    selectedFontFamily,
    captionPosition,
    captionAlignment,
  ])

  const applyPageSettingsToAllPages = useCallback(() => {
    setPages(p =>
      p.map(pg => ({
        ...pg,
        layout: selectedLayout,
      }))
    )
  }, [selectedLayout])

  /* ================= INIT PAGES ================= */

  useEffect(() => {
    if (step === 2 && pages.length === 0) {
      setPages(
        Array.from({ length: pageCount }, (_, i) => ({
          id: i,
          images: [],
          caption: '',
          captionStyle: {
            fontSize: selectedFontSize,
            color: selectedFontColor,
            fontFamily: selectedFontFamily,
            position: captionPosition,
            alignment: captionAlignment,
          },
          layout: 'single',
        }))
      )
    }
  }, [step])

  /* ================= PDF ================= */

  const getSlotRectsInInches = (layout, size, pageMargin, pageGutter, layoutSplitX, layoutSplitY) => {
    const pageW = size.width
    const pageH = size.height
    const marginInInches = pageMargin / 25.4  // Assuming pageMargin is in mm
    const gutterInInches = pageGutter / 25.4
    const innerW = pageW - marginInInches * 2
    const innerH = pageH - marginInInches * 2
    const splitX = (layoutSplitX ?? 50) / 100
    const splitY = (layoutSplitY ?? 50) / 100

    switch (layout.template) {
      case 'single':
        return [{ x: 0, y: 0, width: innerW, height: innerH }]

      case '2-horizontal': {
        // Side by Side - images next to each other (left | right)
        const w1 = (innerW - gutterInInches) * splitX
        const w2 = (innerW - gutterInInches) * (1 - splitX)
        return [
          { x: 0, y: 0, width: w1, height: innerH },
          { x: w1 + gutterInInches, y: 0, width: w2, height: innerH },
        ]
      }

      case '2-vertical': {
        // Stacked - images on top of each other (top / bottom)
        const h1 = (innerH - gutterInInches) * splitY
        const h2 = (innerH - gutterInInches) * (1 - splitY)
        return [
          { x: 0, y: 0, width: innerW, height: h1 },
          { x: 0, y: h1 + gutterInInches, width: innerW, height: h2 },
        ]
      }

      case '1-top-2-bottom': {
        const topH = innerH * splitY
        const bottomH = innerH - topH - gutterInInches
        const w = (innerW - gutterInInches) / 2
        return [
          { x: 0, y: 0, width: innerW, height: topH },
          { x: 0, y: topH + gutterInInches, width: w, height: bottomH },
          { x: w + gutterInInches, y: topH + gutterInInches, width: w, height: bottomH },
        ]
      }

      case '2-top-1-bottom': {
        const bottomH = innerH * (1 - splitY)
        const topH = innerH - bottomH - gutterInInches
        const w = (innerW - gutterInInches) / 2
        return [
          { x: 0, y: 0, width: w, height: topH },
          { x: w + gutterInInches, y: 0, width: w, height: topH },
          { x: 0, y: topH + gutterInInches, width: innerW, height: bottomH },
        ]
      }

      case '4-grid': {
        const w = (innerW - gutterInInches) / 2
        const h = (innerH - gutterInInches) / 2
        return [
          { x: 0, y: 0, width: w, height: h },
          { x: w + gutterInInches, y: 0, width: w, height: h },
          { x: 0, y: h + gutterInInches, width: w, height: h },
          { x: w + gutterInInches, y: h + gutterInInches, width: w, height: h },
        ]
      }

      case '6-grid': {
        const w = (innerW - gutterInInches * 2) / 3
        const h = (innerH - gutterInInches) / 2
        return [
          { x: 0, y: 0, width: w, height: h },
          { x: w + gutterInInches, y: 0, width: w, height: h },
          { x: (w + gutterInInches) * 2, y: 0, width: w, height: h },
          { x: 0, y: h + gutterInInches, width: w, height: h },
          { x: w + gutterInInches, y: h + gutterInInches, width: w, height: h },
          { x: (w + gutterInInches) * 2, y: h + gutterInInches, width: w, height: h },
        ]
      }

      default:
        return []
    }
  }

  const exportToPDF = useCallback(async (qualityOverride) => {
    const effectiveQuality = typeof qualityOverride === 'string' ? qualityOverride : pdfQuality
    setIsExporting(true)
    setExportProgress(0)

    try {
      const size = SIZES.find(s => s.id === selectedSize)
      if (!size) return

      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [size.width, size.height],
      })

      for (let i = 0; i < pages.length; i++) {
        setExportProgress(Math.round(((i) / pages.length) * 100))
        // Yield to allow UI update
        await new Promise(resolve => setTimeout(resolve, 0))

        const page = pages[i]
        if (i > 0) pdf.addPage()

        pdf.setFillColor(pageBgColor)
        pdf.rect(0, 0, size.width, size.height, 'F')

        if (page.images?.length) {
          const layout = LAYOUTS.find(l => l.id === page.layout) || LAYOUTS[0]
          const slotRects = getSlotRectsInInches(layout, size, pageMargin, pageGutter, page.layoutSplitX ?? 50, page.layoutSplitY ?? 50)

          for (let idx = 0; idx < page.images.length; idx++) {
            const imgId = page.images[idx]
            if (!imgId) continue
            
            const imgData = uploadedImages.find(u => u.id === imgId)
            if (!imgData || !slotRects[idx]) continue

            const rect = slotRects[idx]
            const slotX = (pageMargin / 25.4) + rect.x
            const slotY = (pageMargin / 25.4) + rect.y
            const slotW = rect.width
            const slotH = rect.height

            // Load image to get natural dimensions
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

            // Calculate fit/crop dimensions
            const crop = imgData.crop
            const fitMode = imgData.fit || imageFitMode || 'cover'

            // --- OPTIMIZED IMAGE RENDERING (Prevents OOM) ---
            // Always pipe through canvas to:
            // 1. Resize/Crop correctly
            // 2. Convert to JPEG (memory efficient)
            // 3. Control DPI
            
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', { alpha: false }) // No alpha channel needed for JPEG

            // Determine Target DPI Scale
            let dpiScale = 2 // default (approx 192 DPI)
            if (effectiveQuality === 'screen') dpiScale = 1 // 96 DPI
            else if (effectiveQuality === 'print') dpiScale = 3.125 // 300 DPI
            else if (effectiveQuality === 'original') {
              const sourceDpiScale = Math.min(imgW / (slotW * 96), imgH / (slotH * 96))
              // Cap at 3.5 (~336 DPI) to be safer on memory for large books
              dpiScale = Math.max(3.125, Math.min(sourceDpiScale, 3.5)) 
            }

            let finalX, finalY, finalW, finalH // Position on PDF
            let cvsW, cvsH // Canvas pixel size
            let sx, sy, sw, sh // Source crop

            if (crop) {
              // Custom Editor Crop -> Fills the slot
              finalX = slotX; finalY = slotY; finalW = slotW; finalH = slotH
              
              cvsW = slotW * 96 * dpiScale
              cvsH = slotH * 96 * dpiScale
              
              sx = (crop.x / 100) * imgW
              sy = (crop.y / 100) * imgH
              sw = (crop.w / 100) * imgW
              sh = (crop.h / 100) * imgH
            } 
            else if (fitMode === 'contain') {
              // Contain -> Fit inside slot, maintain aspect ratio
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
              // Cover (Default) -> Fill slot, crop excess
              finalX = slotX; finalY = slotY; finalW = slotW; finalH = slotH

              cvsW = slotW * 96 * dpiScale
              cvsH = slotH * 96 * dpiScale

              if (imgRatio > slotRatio) {
                // Image wider -> crop sides
                sh = imgH
                sw = imgH * slotRatio
                sx = (imgW - sw) / 2
                sy = 0
              } else {
                // Image taller -> crop top/bottom
                sw = imgW
                sh = imgW / slotRatio
                sx = 0
                sy = (imgH - sh) / 2
              }
            }

            // Set canvas size
            canvas.width = Math.floor(cvsW)
            canvas.height = Math.floor(cvsH)

            // Fill white background (handles transparency in PNGs converting to JPEG)
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // High Quality Scaling
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            try {
              ctx.drawImage(imgElement, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
              
              // Compress to JPEG
              const format = 'image/jpeg' 
              // 0.95 is visually indistinguishable from 1.0 but significantly smaller file size
              const q = effectiveQuality === 'screen' ? 0.8 : 0.95
              
              const imgDataUrl = canvas.toDataURL(format, q)
              pdf.addImage(imgDataUrl, 'JPEG', finalX, finalY, finalW, finalH)
            } catch (err) {
              console.warn('Image processing failed', err)
              // Fallback?
            }

            // Explicit cleanup
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

      // pdf.save() can crash on large files in some browsers due to string limits.
      // We use the Blob API directly for better stability.
      try {
        const blob = pdf.output('blob')
        const filename = 'photobook.pdf'
        
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // IE11 compatibility
          window.navigator.msSaveOrOpenBlob(blob, filename)
        } else {
          // Modern browsers
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 2000)
        }

        eventBus?.emit('pdf-exported', { pageCount: pages.length })
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
    pageMargin,
    pageGutter,
    pageBgColor,
    showPageNumbers,
    imageFitMode,
    pdfQuality,
  ])

  /* ================= NAV ================= */

  const handleNext = () => {
    if (step === 1 && selectedProduct && selectedSize) setStep(2)
    else if (step === 2) setStep(3)
    else {
      state.set('selectedProduct', selectedProduct)
      state.set('selectedSize', selectedSize)
      state.set('pages', pages)
      state.set('uploadedImages', uploadedImages)
      router.push('/order')
    }
  }

  const handleBack = () => {
    if (step === 1) router.push('/')
    else setStep(step - 1)
  }

  if (!isLoaded) return null

  return (
    <main className="create-root">
      {/* ===== HEADER ===== */}
      <header className="create-header">
        <div className="container create-header-inner">
          
          {/* TOP ROW */}
          <div className="create-header-top">
            <h1>Create Your Photo Book</h1>
            <span className="create-step">Step {step} of 3</span>
          </div>

          {/* BOTTOM ROW */}
         {step >= 2 && (
          <div className="header-controls-row">
            {/* Saved status */}
            {lastSaved && (
              <span className="header-saved-status">
                {isSaving
                  ? 'Saving…'
                  : `Saved ${new Date(lastSaved).toLocaleTimeString()}`}
              </span>
            )}

            {/* Buttons */}
            <div className="header-actions">
              <button
                type="button"
                onClick={saveProgress}
                className="btn-header-save"
              >
                Save
              </button>

              <div className="pdf-export-container">
                <button
                  type="button"
                  onClick={() => setShowPdfMenu(!showPdfMenu)}
                  className="btn-pdf-trigger"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                      <span style={{ fontSize: '0.7rem', marginBottom: '2px', color: '#fff' }}>{exportProgress}%</span>
                       <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${exportProgress}%`, 
                          height: '100%', 
                          background: '#fff', 
                          transition: 'width 0.2s ease' 
                        }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>PDF</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
                    </>
                  )}
                </button>

                {showPdfMenu && !isExporting && (
                  <div className="pdf-dropdown-menu">
                    <button
                      type="button"
                      className="pdf-dropdown-item"
                      onClick={() => {
                        setPdfQuality('screen')
                        setShowPdfMenu(false)
                        exportToPDF('screen')
                      }}
                    >
                      low (72 DPI)
                    </button>
                    <button
                      type="button"
                      className="pdf-dropdown-item"
                      onClick={() => {
                        setPdfQuality('print')
                        setShowPdfMenu(false)
                        exportToPDF('print')
                      }}
                    >
                      medium (300 DPI)
                    </button>
                    <button
                      type="button"
                      className="pdf-dropdown-item"
                      onClick={() => {
                        setPdfQuality('original')
                        setShowPdfMenu(false)
                        exportToPDF('original')
                      }}
                    >
                      High Resolution
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </header>

      {/* ===== PROGRESS ===== */}
      <div className="create-progress">
        <div className="create-progress-bar">
          {[1, 2, 3].map(s => (
            <div key={s} className={`create-progress-step ${s <= step ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="create-content">
        {step === 1 && (
          <StepSetup
            products={PRODUCTS}
            sizes={SIZES}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            coverText={coverText}
            setCoverText={setCoverText}
            coverTheme={coverTheme}
            setCoverTheme={setCoverTheme}
          />
        )}

        {step === 2 && (
          <StepEditor
            pages={pages}
            setPages={setPagesWithHistory}
            undo={undo}
            redo={redo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            currentPageIdx={currentPageIdx}
            setCurrentPageIdx={setCurrentPageIdx}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            sizes={SIZES}
            selectedSize={selectedSize}
            layouts={LAYOUTS}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            selectedCaption={selectedCaption}
            setSelectedCaption={setSelectedCaption}
            selectedFontSize={selectedFontSize}
            setSelectedFontSize={setSelectedFontSize}
            selectedFontColor={selectedFontColor}
            setSelectedFontColor={setSelectedFontColor}
            selectedFontFamily={selectedFontFamily}
            setSelectedFontFamily={setSelectedFontFamily}
            captionPosition={captionPosition}
            setCaptionPosition={setCaptionPosition}
            captionAlignment={captionAlignment}
            setCaptionAlignment={setCaptionAlignment}
            pageMargin={pageMargin}
            setPageMargin={setPageMargin}
            pageGutter={pageGutter}
            setPageGutter={setPageGutter}
            pageBgColor={pageBgColor}
            setPageBgColor={setPageBgColor}
            imageFitMode={imageFitMode}
            setImageFitMode={setImageFitMode}
            imageBorderRadius={imageBorderRadius}
            setImageBorderRadius={setImageBorderRadius}
            showPageNumbers={showPageNumbers}
            setShowPageNumbers={setShowPageNumbers}
            saveProgress={saveProgress}
            autoSave={autoSave}
            setAutoSave={setAutoSave}
            fontFamilies={FONT_FAMILIES}
            applyCaptionStyleToAllPages={applyCaptionStyleToAllPages}
            applyPageSettingsToAllPages={applyPageSettingsToAllPages}
            clearProgress={clearProgress}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}

        {step === 3 && (
          <StepReview
            pages={pages}
            uploadedImages={uploadedImages}
            selectedProduct={selectedProduct}
            selectedSize={selectedSize}
            products={PRODUCTS}
            sizes={SIZES}
            exportToPDF={exportToPDF}
            isExporting={isExporting}
          />
        )}
      </div>

      {/* ================= BOTTOM NAV ================= */}
      <footer className="create-bottom-nav">
        <div
          className="create-bottom-inner container"
          style={{
            display: 'flex',
            alignItems: 'center',          // 🔥 same baseline
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Back / Home */}
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',

              height: '44px',
              padding: '0 1.5rem',
              lineHeight: 1,
              boxSizing: 'border-box',

              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 500,

              background: '#f5f5f5',
              color: '#222',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            {step === 1 ? 'Home' : 'Back'}
          </button>

          {/* Pages Button - only show in step 2 */}
         {step === 2 && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="select-page-btn"
            >
              📄 Select Page
            </button>
          )}

          {/* Next / Complete */}
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 1 && !isStep1Valid}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',

              height: '44px',
              padding: '0 1.5rem',
              lineHeight: 1,
              boxSizing: 'border-box',

              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 500,

              background: 'linear-gradient(135deg, #1e293b, #0ea5e9)',
              color: '#fff',
              border: 'none',
              cursor:
                step === 1 && !isStep1Valid ? 'not-allowed' : 'pointer',
              opacity: step === 1 && !isStep1Valid ? 0.6 : 1,
            }}
          >
            {step === 3 ? 'Complete Order' : 'Next'}
          </button>
        </div>
      </footer>

    </main>
  )
}