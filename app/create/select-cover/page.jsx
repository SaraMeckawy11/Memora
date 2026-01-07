'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/styles/SelectCover.css'

const PRESETS = [
  { id: 'minimal', name: 'Minimalist White', preview: '#ffffff' },
  { id: 'classic', name: 'Classic Black', preview: '#1a1a1a' },
  { id: 'vintage', name: 'Vintage Paper', preview: '#f4ecd8' },
  { id: 'modern', name: 'Modern Blue', preview: '#1e3a8a' }
]

export default function SelectCoverPage() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handleSelectPreset = (presetId) => {
    // In a real app, this would update the photobook state with the preset
    setSelectedPreset(presetId)
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
      <div className="select-cover-container">
        <button className="back-link" onClick={handleBack}>
          ← Back to Editor
        </button>

        <div className="select-cover-header">
          <h1>Choose Your Cover</h1>
          <p>Select a professionally designed template or create your own from scratch.</p>
        </div>

        <div className="options-grid">
          {/* Option 1: Design Your Own */}
          <div className="option-card" onClick={() => router.push('/create/cover')}>
            <div className="option-icon">🎨</div>
            <h2>Design My Own</h2>
            <p>Use our powerful editor to create a fully custom cover with photos, shapes, and personalized text.</p>
            <div className="btn-select btn-primary-option">Start Designing</div>
          </div>

          {/* Option 2: Choose a Template */}
          <div className="option-card" onClick={() => setSelectedPreset(PRESETS[0].id)}>
            <div className="option-icon">✨</div>
            <h2>Quick Templates</h2>
            <p>Choose from our curated collection of beautiful, ready-to-use cover layouts.</p>
            <div className="btn-select btn-secondary-option">Browse Presets</div>
          </div>
        </div>

        <div className="presets-section">
          <h3>Featured Templates</h3>
          <div className="presets-grid">
            {PRESETS.map((preset) => (
              <div 
                key={preset.id} 
                className={`preset-item ${selectedPreset === preset.id ? 'selected' : ''}`}
                onClick={() => handleSelectPreset(preset.id)}
              >
                <div 
                  className="preset-preview" 
                  style={{ backgroundColor: preset.preview }} 
                />
                <div className="preset-overlay">{preset.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="select-cover-footer">
          <button 
            className="btn-next-step"
            onClick={handleNext}
          >
            Next: Review Order →
          </button>
        </div>
      </div>
    </div>
  )
}
