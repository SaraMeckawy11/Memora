'use client'
import { useRouter } from 'next/navigation'
import '@/styles/select-cover/DesignOptionCard.css'

export default function DesignOptionCard() {

  const router = useRouter()

  return (
    <div className="option-card" onClick={() => router.push('/cover')}>
      <div className="option-card-bg-glow" />
      <div className="option-icon-wrapper">
      </div>
      <div className="option-card-content">
        <div className="option-card-header">
          <h2>Design My Own</h2>
          <span className="option-badge">Most Flexible</span>
        </div>
        <p>Start from a blank canvas. Add your photos, text, and shapes to create a truly unique memory book cover.</p>
        <div className="btn-select btn-primary-option">
          Start Designing
          <svg className="icon-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  )
}
