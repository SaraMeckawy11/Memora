'use client'
import { useState } from 'react'
import '@/styles/cover-editor/toolbar.css'

export const ToolbarSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="toolbar-section">
      <button 
        className={`toolbar-section-header ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="section-title">{title}</span>
        <span className="section-arrow">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4"/></svg>
        </span>
      </button>
      {isOpen && (
        <div className="toolbar-section-content">
          {children}
        </div>
      )}
    </div>
  )
}
