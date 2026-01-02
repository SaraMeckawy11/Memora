'use client'

import { usePhotoBook } from '@/app/components/editor/PhotoBookProvider'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

import StepSetup from '@/app/components/StepSetup'
import StepEditor from '@/app/components/editor/StepEditor'
import StepReview from '@/app/components/StepReview'

import '@/styles/CreatePage.css'

/* ================= CONSTANTS ================= */

const PRODUCTS = [
  { id: 1, name: 'Hardcover', icon: '📕', description: 'Premium hardcover with dust jacket', price: 29.99 },
  { id: 2, name: 'Softcover', icon: '📔', description: 'Flexible softcover binding', price: 19.99 },
]

const SIZES = [
  { id: 1, name: '8×10 Portrait', label: 'Classic Portrait', aspect: '0.8', width: 8, height: 10, popular: true },
  { id: 2, name: '8×8 Square', label: 'Square', aspect: '1', width: 8, height: 8 },
  { id: 3, name: '10×10 Square', label: 'Large Square', aspect: '1', width: 10, height: 10 },
  { id: 4, name: '11×8.5 Landscape', label: 'Landscape', aspect: '1.29', width: 11, height: 8.5 },
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

  const [selectedCaption, setSelectedCaption] = useState('')
  const [selectedFontSize, setSelectedFontSize] = useState(16)
  const [selectedFontColor, setSelectedFontColor] = useState('#000000')
  const [selectedFontFamily, setSelectedFontFamily] = useState('Inter')
  const [captionPosition, setCaptionPosition] = useState('bottom')
  const [captionAlignment, setCaptionAlignment] = useState('center')

  const [selectedLayout, setSelectedLayout] = useState('single')

  const [pageMargin, setPageMargin] = useState(20)
  const [pageGutter, setPageGutter] = useState(10)
  const [pageBgColor, setPageBgColor] = useState('#ffffff')
  const [imageFitMode, setImageFitMode] = useState('cover')
  const [imageBorderRadius, setImageBorderRadius] = useState(4)
  const [showPageNumbers, setShowPageNumbers] = useState(false)

  /* ================= Layout Split ================= */

  const [layoutSplitX, setLayoutSplitX] = useState(50)
  const [layoutSplitY, setLayoutSplitY] = useState(50)

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [autoSave, setAutoSave] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const isStep1Valid = Boolean(selectedProduct && selectedSize)

 /* ================= SAVE ================= */

  const saveProgress = useCallback(() => {
    setIsSaving(true)

    const draft = {
      step,
      pages,
      uploadedImages,
      selectedProduct,
      selectedSize,
      coverImage,
      coverText,
      coverTheme,

      /* ✅ SAVE ALL SETTINGS IN ONE PLACE */
      settings: {
        pageMargin,
        pageGutter,
        pageBgColor,
        imageFitMode,
        imageBorderRadius,
        showPageNumbers,

        layoutSplitX,
        layoutSplitY,

        selectedLayout,

        captionDefaults: {
          fontFamily: selectedFontFamily,
          fontSize: selectedFontSize,
          color: selectedFontColor,
          position: captionPosition,
          alignment: captionAlignment,
        },

        autoSave,
      },

      lastSaved: new Date().toISOString(),
    }

    localStorage.setItem('photobook_draft', JSON.stringify(draft))
    setLastSaved(draft.lastSaved)

    setTimeout(() => setIsSaving(false), 400)
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
    const saved = localStorage.getItem('photobook_draft')
    if (!saved) return

    try {
      const d = JSON.parse(saved)

      setStep(d.step || 1)
      setPages(Array.isArray(d.pages) ? d.pages : [])
      setUploadedImages(Array.isArray(d.uploadedImages) ? d.uploadedImages : [])
      setSelectedProduct(d.selectedProduct ?? null)
      setSelectedSize(d.selectedSize ?? null)
      setCoverImage(d.coverImage ?? null)
      setCoverText(d.coverText ?? '')
      setCoverTheme(d.coverTheme ?? 'classic')
      setLastSaved(d.lastSaved ?? null)

      /* ✅ RESTORE SETTINGS */
      const s = d.settings || {}

      setPageMargin(s.pageMargin ?? 20)
      setPageGutter(s.pageGutter ?? 10)
      setPageBgColor(s.pageBgColor ?? '#ffffff')
      setImageFitMode(s.imageFitMode ?? 'cover')
      setImageBorderRadius(s.imageBorderRadius ?? 4)
      setShowPageNumbers(s.showPageNumbers ?? true)

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
  }, [])

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    if (!autoSave || step < 2) return
    const t = setTimeout(saveProgress, 2000)
    return () => clearTimeout(t)
  }, [
    pages,
    uploadedImages,

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
    step,
  ])

  /* ================= CLEAR SAVED PROGRESS ================= */

  const clearProgress = () => {
    if (!confirm('Clear all saved progress?')) return

    localStorage.removeItem('photobook_draft')

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
    setPageMargin(20)
    setPageGutter(10)
    setPageBgColor('#ffffff')
    setImageFitMode('cover')
    setImageBorderRadius(4)
    setShowPageNumbers(true)

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
        const h = (innerH - gutterInInches) / 2
        return [
          { x: 0, y: 0, width: innerW, height: h },
          { x: 0, y: h + gutterInInches, width: innerW, height: h },
        ]
      }

      case '2-vertical': {
        const w = (innerW - gutterInInches) / 2
        return [
          { x: 0, y: 0, width: w, height: innerH },
          { x: w + gutterInInches, y: 0, width: w, height: innerH },
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

  const exportToPDF = useCallback(async () => {
    setIsExporting(true)

    try {
      const size = SIZES.find(s => s.id === selectedSize)
      if (!size) return

      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [size.width, size.height],
      })

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        if (i > 0) pdf.addPage()

        pdf.setFillColor(pageBgColor)
        pdf.rect(0, 0, size.width, size.height, 'F')

        if (page.images?.length) {
          const layout = LAYOUTS.find(l => l.id === page.layout) || LAYOUTS[0]
          const slotRects = getSlotRectsInInches(layout, size, pageMargin, pageGutter, page.layoutSplitX ?? 50, page.layoutSplitY ?? 50)

          page.images.forEach((imgId, idx) => {
            const img = uploadedImages.find(u => u.id === imgId)
            if (!img || !slotRects[idx]) return

            const rect = slotRects[idx]
            const x = (pageMargin / 25.4) + rect.x
            const y = (pageMargin / 25.4) + rect.y
            pdf.addImage(img.src, 'JPEG', x, y, rect.width, rect.height)
          })
        }

        if (page.caption) {
          pdf.setFontSize(page.captionStyle?.fontSize || 12)
          pdf.setTextColor(page.captionStyle?.color || '#000000')
          pdf.text(page.caption, size.width / 2, size.height - 0.3, { align: 'center' })
        }

        if (showPageNumbers) {
          pdf.setFontSize(10)
          pdf.setTextColor('#999')
          pdf.text(`${i + 1}`, size.width / 2, size.height - 0.15, { align: 'center' })
        }
      }

      pdf.save('photobook.pdf')
      eventBus?.emit('pdf-exported', { pageCount: pages.length })
    } catch (e) {
      alert('Failed to export PDF')
    }

    setIsExporting(false)
  }, [
    pages,
    uploadedImages,
    selectedSize,
    pageMargin,
    pageGutter,
    pageBgColor,
    showPageNumbers,
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
        <div className="create-header-inner">
          <div>
            <h1 className="create-title">Create Your Photo Book</h1>
            <p className="create-subtitle">Step {step} of 3</p>
          </div>

          <div className="create-header-actions">
            {lastSaved && (
              <span className="create-saved">
                {isSaving ? '💾 Saving…' : `Saved ${new Date(lastSaved).toLocaleTimeString()}`}
              </span>
            )}

            {step >= 2 && (
              <>
                <button className="btn-secondary" onClick={saveProgress}>💾 Save</button>
                <button className="btn-primary" onClick={exportToPDF} disabled={isExporting}>
                  {isExporting ? '⏳ Exporting…' : '📄 Download PDF'}
                </button>
              </>
            )}
          </div>
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
            setPages={setPages}
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
        <div className="create-bottom-inner container">
          <button
            className="btn-secondary"
            onClick={handleBack}
          >
            {step === 1 ? '← Home' : '← Back'}
          </button>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={step === 1 && !isStep1Valid}
          >
            {step === 3 ? 'Complete Order →' : 'Next →'}
          </button>
        </div>
      </footer>

    </main>
  )
}
