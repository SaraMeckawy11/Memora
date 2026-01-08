'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/styles/SelectCover.css'

const PRESETS = [
  { 
    id: 'travel', 
    name: 'Travel Adventures', 
    preview: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Travel'
  },
  { 
    id: 'wedding', 
    name: 'Our Wedding Day', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Wedding'
  },
  { 
    id: 'birthday', 
    name: 'Birthday Memories', 
    preview: 'https://images.unsplash.com/photo-1576866209830-58f4c00a5814?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Celebration'
  },
  { 
    id: 'friends', 
    name: 'Good Times', 
    preview: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Friends & Family'
  },
  { 
    id: 'engagement', 
    name: 'Our Engagement', 
    preview: 'https://images.unsplash.com/photo-1532712938310-34cb39825785?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Wedding'
  },
  { 
    id: 'family', 
    name: 'Family Moments', 
    preview: 'https://images.unsplash.com/photo-1580130379626-6e213c819529?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Friends & Family'
  }
]

export default function SelectCoverPage() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId)
    // When a preset is selected, navigate to the main cover editor with the preset ID
    router.push(`/create/cover?preset=${presetId}`)
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
          <div className="option-card" onClick={() => document.getElementById('presets-section').scrollIntoView({ behavior: 'smooth' })}>
            <div className="option-icon">✨</div>
            <h2>Quick Templates</h2>
            <p>Choose from our curated collection of beautiful, ready-to-use cover layouts.</p>
            <div className="btn-select btn-secondary-option">Browse Presets</div>
          </div>
        </div>

        <div id="presets-section" className="presets-section">
          <h3>Featured Templates</h3>
          <div className="presets-grid">
            {PRESETS.map((preset) => (
              <div 
                key={preset.id} 
                className={`preset-item ${selectedPreset === preset.id ? 'selected' : ''}`}
                onClick={() => handleSelectPreset(preset.id)}
              >
                <img 
                  src={preset.preview}
                  alt={preset.name}
                  className="preset-preview" 
                />
                <div className="preset-overlay">
                  <span className="preset-category">{preset.category}</span>
                  <span className="preset-name">{preset.name}</span>
                </div>
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
