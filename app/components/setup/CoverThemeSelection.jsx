'use client'
import { useRef } from 'react'
import '@/styles/setup/step-setup.css'

const COVER_THEMES = [
  { id: 'classic', name: 'Classic', bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', textColor: '#1e293b', desc: 'Timeless elegance' },
  { id: 'modern', name: 'Modern', bg: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', textColor: '#fff', desc: 'Bold & vibrant' },
  { id: 'elegant', name: 'Elegant', bg: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', textColor: '#333', desc: 'Refined simplicity' },
  { id: 'minimal', name: 'Minimal', bg: '#ffffff', border: '1px solid #e2e8f0', textColor: '#333', desc: 'Clean & airy' },
  { id: 'bold', name: 'Bold', bg: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', textColor: '#1e293b', desc: 'Fresh energy' },
  { id: 'soft', name: 'Soft', bg: 'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)', textColor: '#4a044e', desc: 'Gentle warmth' },
  { id: 'dark', name: 'Midnight', bg: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)', textColor: '#fff', desc: 'Deep & mysterious' },
  { id: 'nature', name: 'Nature', bg: 'linear-gradient(to top, #96fbc4 0%, #f9f586 100%)', textColor: '#14532d', desc: 'Organic tones' },
]

export default function CoverThemeSelection({ coverTheme, setCoverTheme, coverImage, setCoverImage }) {
  const fileInputRef = useRef(null);

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Max 10MB allowed.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage({
        id: Date.now(),
        src: event.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="section-header">
        <h3 className="section-title">Choose a Theme</h3>
        <p className="section-subtitle">Select a starting style for your book cover</p>
      </div>
      
      <div className="theme-grid">
        {/* Upload Cover Photo as a card */}
        <label
          className={`theme-card upload-card ${!coverImage && !coverTheme ? 'selected' : ''}`}
          tabIndex={0}
          htmlFor="cover-upload"
          onClick={() => setCoverTheme('')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setCoverTheme('');
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: 'none' }}
            id="cover-upload"
          />
          <div className="theme-preview upload-preview">
            <div className="upload-icon-circle">
              <span className="upload-icon">+</span>
            </div>
          </div>
          <div className="theme-info">
            <div className="theme-name">Upload Photo</div>
            <div className="theme-desc">Use your own image</div>
          </div>
        </label>

        {/* Design Custom Cover */}
        <button
          type="button"
          onClick={() => window.open('/create/cover', '_blank')}
          className="theme-card design-card"
        >
          <div className="theme-preview design-preview">
            <span className="design-icon">✨</span>
          </div>
          <div className="theme-info">
            <div className="theme-name">Custom Design</div>
            <div className="theme-desc">Create from scratch</div>
          </div>
        </button>

        {/* Theme cards */}
        {COVER_THEMES.map(theme => (
          <button
            key={theme.id}
            type="button"
            className={`theme-card ${coverTheme === theme.id ? 'selected' : ''}`}
            onClick={() => {
              setCoverTheme(theme.id);
              setCoverImage(null);
            }}
          >
            <div 
              className="theme-preview" 
              style={{ 
                background: theme.bg,
                border: theme.border || 'none',
                color: theme.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textShadow: theme.textColor === '#fff' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <span style={{ opacity: 0.8 }}>Aa</span>
            </div>
            <div className="theme-info">
              <div className="theme-name">{theme.name}</div>
              <div className="theme-desc">{theme.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}