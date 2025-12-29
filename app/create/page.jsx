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
  const [showPageNumbers, setShowPageNumbers] = useState(true)

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
      pageSettings: {
        margin: pageMargin,
        gutter: pageGutter,
        bgColor: pageBgColor,
        imageFitMode,
        imageBorderRadius,
        showPageNumbers,
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
    } catch {}
  }, [])

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    if (!autoSave || step < 2) return
    const t = setTimeout(saveProgress, 2000)
    return () => clearTimeout(t)
  }, [pages, uploadedImages, step, autoSave, saveProgress])

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

  const exportToPDF = async () => {
    const size = SIZES.find(s => s.id === selectedSize)
    if (!size || pages.length === 0) return

    setIsExporting(true)
    try {
      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'landscape' : 'portrait',
        unit: 'in',
        format: [size.width, size.height],
      })

      pages.forEach((_, i) => {
        if (i > 0) pdf.addPage()
        pdf.setFillColor(pageBgColor)
        pdf.rect(0, 0, size.width, size.height, 'F')
      })

      pdf.save('photobook.pdf')
      eventBus?.emit('pdf-exported', { pages: pages.length })
    } catch {
      alert('Failed to export PDF')
    }
    setIsExporting(false)
  }

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
