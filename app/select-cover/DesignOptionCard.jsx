'use client'
import { useRouter } from 'next/navigation'
import '@/styles/select-cover/DesignOptionCard.css'

export default function DesignOptionCard() {

  const router = useRouter()

  return (
    <div className="design-option-wrapper">
      <button className="btn-select" onClick={() => router.push('/cover')}>
        Create Custom Cover
        <svg className="icon-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>

      <div className="divider-container">
        <div className="divider-line"></div>
        <div className="divider-text">OR</div>
        <div className="divider-line"></div>
      </div>
    </div>
  )
}
