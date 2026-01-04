'use client'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '@/styles/cover-editor/font-select.css'

export default function SearchableFontSelect({ fonts, selectedFont, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const dropdownRef = useRef(null)
  const dropdownContentRef = useRef(null)
  const inputRef = useRef(null)

  const filteredFonts = fonts.filter(font => 
    font.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the trigger (dropdownRef) and the content (dropdownContentRef)
      const isOutsideTrigger = dropdownRef.current && !dropdownRef.current.contains(event.target)
      const isOutsideContent = dropdownContentRef.current && !dropdownContentRef.current.contains(event.target)

      if (isOutsideTrigger && isOutsideContent) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside) // Handle touch outside
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small timeout to ensure render is complete and transition has started
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Calculate position for desktop
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const updatePosition = () => {
        // Only apply custom positioning for desktop (>1024px)
        // Mobile/Tablet styles are handled by CSS (fixed centering)
        if (window.innerWidth > 1024) {
          const rect = dropdownRef.current.getBoundingClientRect()
          setDropdownStyle({
            position: 'fixed',
            top: `${rect.bottom}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            zIndex: 1000
          })
        } else {
          setDropdownStyle({})
        }
      }

      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true) // Capture scroll from any container
      
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  }, [isOpen])

  const dropdownContent = (
    <div 
      className="font-select-dropdown" 
      ref={dropdownContentRef}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      style={dropdownStyle}
    >
      <div className="font-select-header">
        <span className="font-select-title">Select Font</span>
        <button className="font-select-close" onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}>✕</button>
      </div>
      <div className="font-search-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="font-search-input"
          placeholder="Search fonts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="font-list">
        {filteredFonts.map(font => (
          <div
            key={font}
            className={`font-option ${selectedFont === font ? 'selected' : ''}`}
            onClick={() => {
              onChange(font)
              setIsOpen(false)
              setSearch('')
            }}
            style={{ fontFamily: font }}
          >
            {font}
          </div>
        ))}
        {filteredFonts.length === 0 && (
          <div className="font-option no-results">No fonts found</div>
        )}
      </div>
    </div>
  )

  return (
    <div className="font-select-container" ref={dropdownRef}>
      <button 
        className="font-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: selectedFont }}
      >
        {selectedFont}
        <span className="arrow">▼</span>
      </button>

      {isOpen && mounted && createPortal(dropdownContent, document.body)}
    </div>
  )
}
