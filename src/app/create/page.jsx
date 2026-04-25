'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useProjectStore } from '@/store/useProjectStore'

import StepSetup from '@/features/project-setup/components/StepSetup'
import StepEditor from '@/features/editor/components/StepEditor'
import StepReview from '@/features/review/components/StepReview'
import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'

import '@/styles/CreatePage.css'
import '@/styles/Loading.css'
import '@/styles/ProgressBar.css'
import '@/styles/editor/EditorBar.css'

function CreatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use Project Store (Selectors for performance)
  const step = useProjectStore(s => s.step)
  const setStep = useProjectStore(s => s.setStep)
  
  const state = useProjectStore() // Get full state for complex operations

  // Sync step with URL
  useEffect(() => {
    const s = searchParams.get('step')
    if (s) {
      const parsed = parseInt(s)
      if (parsed !== step) {
        setStep(parsed)
      }
    }
  }, [searchParams, step, setStep])

  /* ================= NAV ================= */

  const handleNext = async () => {
    if (step === 1 && state.selectedProduct && state.selectedSize) {
      router.push('/create?step=2')
    }
    else if (step === 2) {
      router.replace('/select-cover')
    }
    else if (step === 3) {
      // Store final order data before proceeding
      localStorage.setItem('orderData', JSON.stringify({
        selectedProduct: state.selectedProduct,
        selectedSize: state.selectedSize,
        pages: state.pages,
        uploadedImages: state.uploadedImages,
      }))
      router.replace('/order')
    }
  }

  const handleBack = () => {
    if (step === 1) {
      router.push('/')
    }
    else if (step === 3) {
      router.push('/select-cover')
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
          <div className="create-header-top">
            <h1>Memora</h1>
            <span className="create-step">Step {step} of 3</span>
          </div>
          <div className="header-controls-row">
            <h2>Create Your Photo Book</h2>
          </div>
        </div>
      </header>

       {/* ================= BOTTOM NAV ================= */}
      <footer className={`create-bottom-nav ${step === 1 ? 'is-step-1' : ''} ${step === 2 ? 'is-step-2' : ''}`}>
        <div className="create-bottom-inner container">
          <button type="button" onClick={handleBack} className="bottom-nav-btn bottom-nav-btn--ghost">
            {step === 1 ? 'Home' : 'Back'}
          </button>

          {step === 2 && (
            <div className="history-controls">
              <button type="button" onClick={state.undo} className="history-button" title="Undo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>
              {/* Redo can be added similarly */}
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={step === 1 && (!state.selectedProduct || !state.selectedSize)}
            className="bottom-nav-btn bottom-nav-btn--primary"
          >
            {step === 3 ? 'Complete Order' : step === 2 ? 'Select Cover' : 'Next'}
          </button>
        </div>
      </footer>

      {/* ===== CONTENT ===== */}
      <div className={`create-content step-${step}`}>
        {step === 1 && (
          <StepSetup />
        )}

        {step === 2 && (
          <StepEditor
            pages={state.pages}
            setPages={state.setPages}
            currentPageIdx={state.currentPageIdx}
            setCurrentPageIdx={state.setCurrentPageIdx}
            uploadedImages={state.uploadedImages}
            setUploadedImages={state.setUploadedImages}
            selectedSize={state.selectedSize}
            // All other editor settings are now handled inside StepEditor via store consumption
            // or passed as props if we want to keep them somewhat decoupled
          />
        )}

        {step === 3 && (
          <StepReview
            handleProceed={handleNext}
            exportToPDF={() => alert('PDF Export Coming Soon!')}
            isExporting={false}
          />
        )}
      </div>
    </main>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="loading-screen">Loading...</div>}>
      <CreatePageContent />
    </Suspense>
  )
}
