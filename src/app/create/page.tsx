'use client'

import { useEffect, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useProjectStore } from '@/store/useProjectStore'
import { EditorStep } from '@/types/project'

import StepSetup from '@/features/project-setup/components/StepSetup'
import StepEditor from '@/features/editor/components/StepEditor'
import StepReview from '@/features/review/components/StepReview'
import { PRODUCTS } from '@/features/project-setup/components/ProductSelection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import { LAYOUTS } from '@/features/editor/components/settings/LayoutSection'
import { usePDFExporter } from '@/features/editor/components/pdf/PDFExporter'

import '@/styles/CreatePage.css'
import '@/styles/Loading.css'
import '@/styles/ProgressBar.css'
import '@/styles/editor/EditorBar.css'

function CreatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const state = useProjectStore()
  const step = state.step as EditorStep
  const setStep = state.setStep

  const { exportToPDF, isExporting } = usePDFExporter({
    pages: state.pages,
    uploadedImages: state.uploadedImages,
    selectedSize: state.selectedSize,
    sizes: SIZES,
    layouts: LAYOUTS,
    pageMargin: state.pageMargin,
    pageGutter: state.pageGutter,
    pageBgColor: state.pageBgColor,
    imageFitMode: state.imageFitMode,
  })

  // Sync step with URL
  useEffect(() => {
    const s = searchParams.get('step')
    if (s) {
      const parsed = parseInt(s)
      // Ignore invalid values (e.g. old links with ?step=editor) — an
      // out-of-range step would render a blank page
      if ([1, 2, 3].includes(parsed) && parsed !== step) {
        setStep(parsed as EditorStep)
      }
    }
  }, [searchParams, step, setStep])

  /* ================= NAV ================= */

  const handleNext = async () => {
    if (step === 1 && state.selectedProduct && state.selectedSize) {
      // If we don't have a projectId yet, we should ideally create one in DB
      if (!state.projectId) {
        // For now, if no auth is set up, we'll just move on, 
        // but the store will try to call createProject if we had a userId.
        // We'll proceed to step 2 where project initialization will be handled.
      }
      router.push('/create?step=2')
    }
    else if (step === 2) {
      router.replace('/select-cover')
    }
    else if (step === 3) {
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
            <div className="header-meta">
              <span className="create-step">Step {step} of 3</span>
              {state.savingStatus !== 'idle' && (
                <div className={`sync-status status-${state.savingStatus}`}>
                  {state.savingStatus === 'saving' && (
                    <>
                      <span className="spinner-icon"></span>
                      Saving...
                    </>
                  )}
                  {state.savingStatus === 'saved' && 'All changes saved'}
                  {state.savingStatus === 'error' && 'Offline - Changes saved locally'}
                </div>
              )}
            </div>
          </div>
          <div className="header-controls-row">
            <h2>{state.projectId ? 'Project: Personal Photo Book' : 'Create Your Photo Book'}</h2>
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
            <>
              <button type="button" onClick={state.undo} className="history-button" title="Undo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>
              <button type="button" onClick={state.redo} className="history-button" title="Redo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                </svg>
              </button>
            </>
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
          <StepEditor />
        )}

        {step === 3 && (
          <StepReview
            handleProceed={handleNext}
            exportToPDF={() => exportToPDF('print')}
            isExporting={isExporting}
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
