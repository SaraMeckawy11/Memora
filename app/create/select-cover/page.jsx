'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/styles/SelectCover.css'
import { COVER_PRESETS } from '@/app/create/cover/presets'
import PresetPreview from '@/app/components/cover-editor/PresetPreview'
import FontLoader from '@/app/components/cover-editor/FontLoader'

const PRESETS = [
  { 
    id: 'travel3', 
    name: 'Travel Adventures', 
    preview: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Travel'
  },
  { 
    id: 'travel2', 
    name: 'Vintage Wanderlust', 
    preview: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Travel'
  },
  { 
    id: 'travel', 
    name: 'Travel Adventures', 
    preview: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Travel'
  },
  { 
    id: 'summer', 
    name: 'Summer Vibes', 
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'ibiza', 
    name: 'Ibiza Night', 
    preview: 'https://images.unsplash.com/photo-1573155993874-d5d48af862ba?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Travel'
  },
  { 
    id: 'lionBirthPoster', 
    name: 'baby', 
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'memories'
  },
  { 
    id: 'baby', 
    name: 'baby', 
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'memories'
  },
  { 
    id: 'babyJournal', 
    name: 'Baby Journal', 
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'memories'
  },
  { 
    id: 'babyLove', 
    name: 'Baby Love', 
    preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'memories'
  },
  { 
    id: 'wedding', 
    name: 'Our Wedding Day', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Wedding'
  },
  { 
    id: 'wedding2', 
    name: 'Our Wedding Day', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Wedding'
  },
  { 
    id: 'wedding3', 
    name: 'Our Wedding Day', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Wedding'
  },
  { 
    id: 'wedding4', 
    name: 'Our Wedding Day', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Wedding'
  },
  { 
    id: 'MothersDay', 
    name: 'Mother\'s Day Special', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'mothersDay2', 
    name: 'Mother\'s Day Special', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'nightLove', 
    name: 'Night Love', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'tiedWithLove', 
    name: 'Tied With Love', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'ourStory', 
    name: 'Our Story', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'withLove', 
    name: 'With Love', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  },
  { 
    id: 'loveYou', 
    name: 'Love You', 
    preview: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    category: 'Seasonal'
  }
] 

export default function SelectCoverPage() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId)
    // When a preset is selected, navigate to the main cover editor with all features
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
      <FontLoader />
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
          <h3>Cover Designs</h3>
          <div className="presets-grid">
            {PRESETS.map((preset) => (
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
