'use client'
import SetupHeader from './SetupHeader'
import ProductSelection from './ProductSelection'
import SizeSelection from './SizeSelection'
import CoverThemeSelection from './CoverThemeSelection'
import '@/styles/setup/step-setup.css'

export default function StepSetup() {
  return (
    <div className="setup-container">
      <div className="setup-intro">
        <span className="setup-eyebrow">
          <span className="setup-eyebrow__dot" aria-hidden="true" />
          step 1 · the basics
        </span>
        <h2 className="setup-title">Let's set up your book.</h2>
        <p className="setup-subtitle">
          Pick a book type and a size to start with — you can change
          everything later in the editor.
        </p>
      </div>

      <ProductSelection />

      <SizeSelection />
{/*
      <CoverThemeSelection
        coverTheme={coverTheme}
        setCoverTheme={setCoverTheme}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      /> */}
    </div>
  )
}