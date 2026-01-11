'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import StepSetup from '@/app/components/setup/StepSetup'
import StepEditor from '@/app/components/editor/StepEditor'
import StepReview from '@/app/components/StepReview'
import { PRODUCTS } from '@/app/components/setup/ProductSelection'
import { SIZES } from '@/app/components/setup/SizeSelection'
import { LAYOUTS } from '@/app/components/editor/settings/LayoutSection'
import { FONT_FAMILIES } from '@/app/components/editor/settings/CaptionSection'
import { useSaveManager } from '@/app/components/editor/save/SaveManager'

import '@/styles/CreatePage.css'
import '@/styles/Loading.css'
import '@/styles/ProgressBar.css'
import '@/styles/editor/EditorTopbar.css'

/* ================= PAGE ================= */

export default function CreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)

  // Use a ref to track if we've already initialized the step from the URL or draft
  const hasInitializedStep = useRef(false)

  useEffect(() => {
    const s = searchParams.get('step')
    if (s) {
      const parsed = parseInt(s)
      if (parsed !== step) {
        setStep(parsed)
        hasInitializedStep.current = true
      }
    }
  }, [searchParams, step])

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

  const [pageMargin, setPageMargin] = useState(16)
  const [pageGutter, setPageGutter] = useState(16)
  const [pageBgColor, setPageBgColor] = useState('#ffffff')
  const [imageFitMode, setImageFitMode] = useState('cover')
  const [imageBorderRadius, setImageBorderRadius] = useState(0)
  const [showPageNumbers, setShowPageNumbers] = useState(false)

  /* ================= Layout Split ================= */

  const [layoutSplitX, setLayoutSplitX] = useState(50)
  const [layoutSplitY, setLayoutSplitY] = useState(50)

  const [autoSave, setAutoSave] = useState(true)

  const isStep1Valid = selectedProduct && selectedSize

  // Use Save Manager Hook
  const {
    isSaving,
    lastSaved,
    setPagesWithHistory,
    undo,
    redo,
    saveProgress,
    loadProgress,
    clearProgress,
    applyCaptionStyleToAllPages,
    applyPageSettingsToAllPages,
    canUndo,
    canRedo,
  } = useSaveManager({
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
    setPages,
    setUploadedImages,
    setSelectedProduct,
    setSelectedSize,
    setCoverImage,
    setCoverText,
    setCoverTheme,
    setPageMargin,
    setPageGutter,
    setPageBgColor,
    setImageFitMode,
    setImageBorderRadius,
    setShowPageNumbers,
    setLayoutSplitX,
    setLayoutSplitY,
    setSelectedLayout,
    setSelectedFontFamily,
    setSelectedFontSize,
    setSelectedFontColor,
    setCaptionPosition,
    setCaptionAlignment,
    setAutoSave,
    setStep,
  })

  // Load progress on mount
  useEffect(() => {
    loadProgress()
  }, [loadProgress])

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
          pageMargin: 16,
          pageGutter: 16,
        }))
      )
    }
  }, [step, pageCount, selectedFontSize, selectedFontColor, selectedFontFamily, captionPosition, captionAlignment, setPages])

  /* ================= NAV ================= */

  const handleNext = () => {
    if (step === 1 && selectedProduct && selectedSize) {
      router.push('/create?step=2')
    }
    else if (step === 2) {
      // Instead of going to step 3, go to the cover selection page
      router.replace('/create/select-cover')
    }
    else if (step === 3) {
      // Store order data in localStorage for order page
      localStorage.setItem('orderData', JSON.stringify({
        selectedProduct,
        selectedSize,
        pages,
        uploadedImages,
      }))
      router.replace('/order')
    }
  }

  const handleBack = () => {
    if (step === 1) {
      router.push('/')
    }
    else if (step === 3) {
      router.push('/create/select-cover')
    }
    else {
      const prevStep = step - 1
      router.push(`/create?step=${prevStep}`)
    }
  }

  return (
    <main className="create-root">
      {/* ===== HEADER ===== */}
      <header className="create-header">
        <div className="container create-header-inner">
          
          {/* TOP ROW */}
          <div className="create-header-top">
            <h1>Memora</h1>
            <span className="create-step">Step {step} of 3</span>
          </div>

          {/* BOTTOM ROW */}
          <div className="header-controls-row">
            <h2>Create Your Photo Book</h2>
            {/* Saved status */}
            {lastSaved && (
              <span className="header-saved-status">
                {isSaving
                  ? 'Saving…'
                  : `Saved ${new Date(lastSaved).toLocaleTimeString()}`}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ===== PROGRESS ===== */}
      {/* <div className="create-progress">
        <div className="create-progress-bar">
          {[1, 2, 3].map(s => (
            <div key={s} className={`create-progress-step ${s <= step ? 'active' : ''}`} />
          ))}
        </div>
      </div> */}

       {/* ================= BOTTOM NAV ================= */}
      <footer className={`create-bottom-nav ${step === 1 ? 'is-step-1' : ''} ${step === 2 ? 'is-step-2' : ''}`}>
        <div
          className="create-bottom-inner container"
        >
          {/* Back / Home */}
          <button
            type="button"
            onClick={handleBack}
            className="bottom-nav-btn bottom-nav-btn--ghost"
          >
            {step === 1 ? 'Home' : 'Back'}
          </button>

          {/* Undo/Redo Buttons - only show in step 2 */}
          {step === 2 && (
            <>
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="history-button"
                title="Undo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="history-button"
                title="Redo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7" />
                </svg>
              </button>
            </>
          )}

          {/* Next / Complete */}
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 1 && !isStep1Valid}
            className="bottom-nav-btn bottom-nav-btn--primary"
          >
            {step === 3 ? 'Complete Order' : step === 2 ? 'Select Cover' : 'Next'}
          </button>
        </div>
      </footer>


      {/* ===== CONTENT ===== */}
      <div className={`create-content step-${step}`}>
        {step === 1 && (
          <StepSetup
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
            canUndo={canUndo}
            canRedo={canRedo}
            currentPageIdx={currentPageIdx}
            setCurrentPageIdx={setCurrentPageIdx}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            sizes={SIZES}
            selectedSize={selectedSize}
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
          />
        )}
      </div>

     
    </main>
  )
}