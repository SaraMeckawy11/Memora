'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/styles/select-cover/SelectCover.css'
import '@/styles/select-cover/CoverPresets.css'
import { COVER_PRESETS } from '@/app/cover/presets'
import PresetPreview from '@/app/components/cover-editor/PresetPreview'
import FontLoader from '@/app/components/cover-editor/FontLoader'
import { PRESETS } from './constants'
import DesignOptionCard from './DesignOptionCard' 

export default function SelectCoverPage() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId)
    // When a preset is selected, navigate to the main cover editor with all features
    router.push(`/cover?preset=${presetId}`)
  }

  const handleNext = (e) => {
    if (e) e.preventDefault()
    // Using replace to prevent history stack issues that can cause "toggling"
    router.replace('/create?step=3')
  }

  const handleBack = () => {
    router.push('/create?step=2')
  }

  return (
    <div className="select-cover-root">
      <FontLoader />
      <div className="select-cover-nav">
        <div className="select-cover-nav-inner">
          <button className="back-link" onClick={handleBack}>
            ← Back to Editor
          </button>
          <button 
            className="btn-next-step"
            onClick={handleNext}
          >
            Review Order →
          </button>
        </div>
      </div>
      <div className="select-cover-container">

        <div className="select-cover-header">
          <h1>Choose Your Cover</h1>
          <p>Select a professionally designed template or create your own from scratch.</p>
        </div>

        <div className="options-grid">
          <DesignOptionCard />
        </div>

        <div id="presets-section" className="presets-section">
          <h3 className="section-header">Cover Designs</h3>
          
          {[...new Set(PRESETS.map(p => p.category))].map(category => (
            <div key={category} className="category-section">
              <h4 className="category-title">{category}</h4>
              <div className="presets-grid">
                {PRESETS.filter(p => p.category === category).map((preset) => (
                  <div 
                    key={preset.id} 
                    className={`preset-item ${selectedPreset === preset.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPreset(preset.id)}
                  >
                    <div className="preset-preview-container">
                      <PresetPreview 
                        preset={COVER_PRESETS[preset.id]} 
                      />
                    </div>
                    <div className="preset-overlay">
                      <span className="preset-name">{preset.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="select-cover-footer">
          {/* Footer removed */}
        </div>
      </div>
    </div>
  )
}
