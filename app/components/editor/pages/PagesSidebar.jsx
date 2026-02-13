'use client'
import { useState, useRef } from 'react'
import '@/styles/editor/PagesSidebar.css'
import { LAYOUTS } from '../settings/LayoutSection'

export default function PagesSidebar({
  pages,
  currentPageIdx,
  setCurrentPageIdx,
  addPage,
  removePage,
  duplicatePage,
  movePage,
  isOpen,
  setIsOpen,
  undo,
  redo,
  canUndo,
  canRedo,
  uploadedImages = [],
  selectedSize,
  sizes = [],
  swapImages,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const scrollContainerRef = useRef(null)
  const touchTimer = useRef(null)
  
  // Swap Selection State
  const [swapSelection, setSwapSelection] = useState([]) // Array of { pageIdx, imgIdx }

  // Floating Drag State
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [draggedCardDims, setDraggedCardDims] = useState({ width: 0, height: 0 })

  const selectedSizeObj = sizes.find(s => s.id === selectedSize)
  const aspectRatio = selectedSizeObj ? selectedSizeObj.width / selectedSizeObj.height : 1

  const getImageSrc = (imgId) => {
    if (!imgId) return null
    // If it's already a URL string (legacy or direct), return it
    if (typeof imgId === 'string' && (imgId.startsWith('http') || imgId.startsWith('data:'))) return imgId
    // Otherwise look it up
    const found = uploadedImages.find(u => u.id === imgId)
    return found ? (found.thumbSrc || found.src) : null
  }

  const getLayoutName = (layoutId) => {
    const layout = LAYOUTS.find(l => l.id === layoutId)
    return layout ? layout.name : 'Single'
  }

  const handlePageSelect = (idx) => {
    setCurrentPageIdx(idx);
    // Auto-close drawer only on mobile devices
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  // --- Desktop Drag & Drop (Live Swap) ---
  const handleDragStart = (e, idx) => {
    setDraggedIndex(idx)
    // Required for some browsers to allow drag
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      // Optional: set a custom drag image if needed
    }
  }

  const handleDragEnter = (e, targetIdx) => {
    e.preventDefault()
    if (draggedIndex === null) return
    if (draggedIndex !== targetIdx) {
      // Swap immediately
      movePage(draggedIndex, targetIdx - draggedIndex)
      setDraggedIndex(targetIdx)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault() // Allow drop

    // Auto-scroll logic for desktop drag
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const { top, bottom } = container.getBoundingClientRect()
      const scrollZoneHeight = 155 // Increased zone
      const scrollSpeed = 30 // Increased speed

      if (e.clientY < top + scrollZoneHeight) {
        // Scroll up
        container.scrollTop -= scrollSpeed
      } else if (e.clientY > bottom - scrollZoneHeight) {
        // Scroll down
        container.scrollTop += scrollSpeed
      }
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setDraggedIndex(null)
  }

  // --- Mobile Touch Drag & Drop (Live Swap + Floating Card) ---
  const handleTouchStart = (e, idx) => {
    const touch = e.touches[0]
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    // Long press to start drag (200ms) to distinguish from scroll
    touchTimer.current = setTimeout(() => {
      setDraggedIndex(idx)
      setIsTouchDragging(true)
      setDragOffset({ x: offsetX, y: offsetY })
      setDragPosition({ 
        x: touch.clientX - offsetX, 
        y: touch.clientY - offsetY 
      })
      setDraggedCardDims({ width: rect.width, height: rect.height })
      
      // Vibrate if supported for feedback
      if (navigator.vibrate) navigator.vibrate(50)
    }, 200)
  }

  const handleTouchMove = (e) => {
    // If we haven't started dragging yet, this is a scroll
    if (draggedIndex === null) {
      if (touchTimer.current) {
        clearTimeout(touchTimer.current)
        touchTimer.current = null
      }
      return
    }

    // We are dragging, prevent scroll
    if (e.cancelable) e.preventDefault()

    const touch = e.touches[0]
    
    // Update floating card position
    setDragPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y
    })

    // Auto-scroll for touch
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const { top, bottom } = container.getBoundingClientRect()
      const scrollZoneHeight = 100 // Increased zone
      const scrollSpeed = 20 // Increased speed

      if (touch.clientY < top + scrollZoneHeight) {
        container.scrollTop -= scrollSpeed
      } else if (touch.clientY > bottom - scrollZoneHeight) {
        container.scrollTop += scrollSpeed
      }
    }

    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!target) return

    const card = target.closest('.preview-card')
    if (card) {
      const targetIdx = parseInt(card.dataset.index)
      if (!isNaN(targetIdx) && targetIdx !== draggedIndex) {
        movePage(draggedIndex, targetIdx - draggedIndex)
        setDraggedIndex(targetIdx)
        // Vibrate on swap
        if (navigator.vibrate) navigator.vibrate(20)
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current)
    setDraggedIndex(null)
    setIsTouchDragging(false)
  }

  const handleSwapSelect = (pageIdx, imgIdx) => {
    if (!isPreviewOpen) return

    setSwapSelection(prev => {
      // Check if already selected
      const exists = prev.find(s => s.pageIdx === pageIdx && s.imgIdx === imgIdx)
      if (exists) {
        // Deselect
        return prev.filter(s => s !== exists)
      }
      
      // If 2 selected, replace the second one (or reset?)
      // Let's allow max 2. If 2 are selected, clicking a 3rd replaces the 2nd.
      if (prev.length >= 2) {
        return [prev[0], { pageIdx, imgIdx }]
      }
      
      return [...prev, { pageIdx, imgIdx }]
    })
  }

  const handleExecuteSwap = () => {
    if (swapSelection.length !== 2) return
    const [s1, s2] = swapSelection
    swapImages(s1.pageIdx, s1.imgIdx, s2.pageIdx, s2.imgIdx)
    setSwapSelection([]) // Clear selection after swap
  }

  const getSlotCount = (layoutId) => {
    switch (layoutId) {
      case 'single': return 1
      case '2-horizontal': return 2
      case '2-vertical': return 2
      case '1-top-2-bottom': return 3
      case '2-top-1-bottom': return 3
      case '4-grid': return 4
      case '6-grid': return 6
      default: return 1
    }
  }

  const renderCardContent = (page, idx) => {
    const slotCount = getSlotCount(page.layout)
    const images = page.images || []

    return (
    <>
      <div className="preview-card-header">
        <span>Page {idx + 1}</span>
        {!isTouchDragging && (
          <input 
            type="number" 
            className="page-pos-input"
            defaultValue={idx + 1}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = parseInt(e.target.value)
                if (!isNaN(val) && val >= 1 && val <= pages.length && val !== idx + 1) {
                  movePage(idx, (val - 1) - idx)
                  e.target.blur()
                } else {
                  e.target.value = idx + 1
                }
              }
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value)
              if (!isNaN(val) && val >= 1 && val <= pages.length && val !== idx + 1) {
                movePage(idx, (val - 1) - idx)
              } else {
                e.target.value = idx + 1
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
      <div className="preview-card-body">
        <div 
          className={`preview-page-container ${aspectRatio >= 1 ? 'portrait' : 'landscape'}`}
          style={{ aspectRatio }}
        >
          <div className="mini-page-content" data-layout={page.layout}>
            {page.type === 'text' ? (
              <div className="mini-text-content">
                {page.textContent ? (
                  <div
                    style={{
                      fontSize: Math.max(8, (page.textStyle?.fontSize || 11) * 0.15),
                      color: page.textStyle?.color || '#000000',
                      fontFamily: page.textStyle?.fontFamily || 'Inter',
                      textAlign: page.textStyle?.textAlign || 'center',
                      backgroundColor: page.pageBgColor || '#ffffff',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      maxHeight: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-word',
                      lineHeight: '1.2',
                    }}>
                      {page.textContent.length > 50 ? page.textContent.substring(0, 50) + '...' : page.textContent}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: page.pageBgColor || '#ffffff',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '10px',
                  }}>
                    Text Page
                  </div>
                )}
              </div>
            ) : (
              <>
                {Array.from({ length: slotCount }).map((_, imgIdx) => {
                  const imgId = images[imgIdx] || null
                  const src = getImageSrc(imgId)
                  const isSelectedForSwap = swapSelection.some(s => s.pageIdx === idx && s.imgIdx === imgIdx)
                  
                  const shouldSpan = 
                    (page.layout === '1-top-2-bottom' && imgIdx === 0) ||
                    (page.layout === '2-top-1-bottom' && imgIdx === 2)

                  return (
                    <div 
                      key={imgIdx} 
                      className={`mini-img-wrapper ${isSelectedForSwap ? 'swap-selected' : ''} ${shouldSpan ? 'span-2-cols' : ''}`}
                      onClick={(e) => {
                        if (isPreviewOpen) {
                          e.stopPropagation()
                          handleSwapSelect(idx, imgIdx)
                        }
                      }}
                    >
                      {src ? (
                        <img src={src} alt="" />
                      ) : (
                        <span className="empty-slot">+</span>
                      )}
                      {isSelectedForSwap && (
                        <div className="swap-overlay">
                          <span>Selected</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )}

  return (
    <>
      {/* Mobile Toggle Button */}
      {/* <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>
        <span>📄 Pages</span>
      </button> */}

      {/* Dimmed Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'is-active' : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* The Sidebar */}
      <aside className={`pages-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="pages-header">
          <h4 className="pages-title">Pages ({pages.length})</h4>
          <div className="pages-actions">
            <button className="add-page-btn" onClick={addPage}>+ Add</button>
            <button 
              className="add-page-btn preview-btn" 
              onClick={() => setIsPreviewOpen(true)} 
              title="Preview & Organize"
            >
              Preview
            </button>
          </div>
        </div>

        <div className="pages-list">
          {pages.map((page, idx) => (
            <div 
              key={page.id} 
              className={`page-item ${idx === currentPageIdx ? 'active' : ''} ${draggedIndex === idx ? 'is-dragging' : ''}`}
              onClick={() => handlePageSelect(idx)}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnter={(e) => handleDragEnter(e, idx)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="page-top">
                <span className="page-title">Page {idx + 1}</span>
                <div className="page-controls">
                  <button 
                    className="control-btn" 
                    title="Insert Page Before"
                    onClick={(e) => { e.stopPropagation(); addPage(idx); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="15" width="18" height="2" rx="1" opacity="0.5"/>
                      <path d="M12 3v10M7 8h10" />
                    </svg>
                  </button>
                  <button 
                    className="control-btn" 
                    title="Insert Page After"
                    onClick={(e) => { e.stopPropagation(); addPage(idx + 1); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="7" width="18" height="2" rx="1" opacity="0.5"/>
                      <path d="M12 11v10M7 16h10" />
                    </svg>
                  </button>
                  <div className="control-divider"></div>
                  <button 
                    className="control-btn delete" 
                    title="Delete Page"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(confirm('Are you sure you want to delete this page completely?')) removePage(idx); 
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="page-layout">{getLayoutName(page.layout)}</div>
              <div className="page-caption">
                {page.images && page.images.length > 0 ? `${page.images.length} photos` : 'Empty'}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* The Preview Modal */}
      {isPreviewOpen && (
        <div className="preview-modal-overlay">
          <div className="preview-modal-content">
            <div className="preview-header">
              <h3>Page Preview</h3>
              <div className="preview-actions">
                {swapSelection.length > 0 && (
                  <div className="swap-controls">
                    <span style={{ fontSize: '0.8rem', marginRight: '8px' }}>
                      {swapSelection.length === 1 ? 'Select another to swap' : 'Ready to swap'}
                    </span>
                    <button 
                      className="preview-btn primary" 
                      onClick={handleExecuteSwap}
                      disabled={swapSelection.length !== 2}
                      style={{ background: swapSelection.length === 2 ? '#2196F3' : '#ccc', borderColor: 'transparent' }}
                    >
                      Swap Images
                    </button>
                    <button 
                      className="preview-btn" 
                      onClick={() => setSwapSelection([])}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <button className="preview-btn" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                  {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </button>
                <button className="preview-btn" onClick={undo} disabled={!canUndo}>Undo</button>
                <button className="preview-btn" onClick={redo} disabled={!canRedo}>Redo</button>
                <button className="preview-btn primary" onClick={() => setIsPreviewOpen(false)}>Done</button>
              </div>
            </div>
            
            <div 
              className={`preview-grid ${viewMode === 'list' ? 'list-view' : ''}`}
              ref={scrollContainerRef}
            >
              {pages.map((page, idx) => (
                <div 
                  key={page.id} 
                  data-index={idx}
                  className={`preview-card ${idx === currentPageIdx ? 'active' : ''} ${draggedIndex === idx ? 'is-dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onTouchStart={(e) => handleTouchStart(e, idx)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setCurrentPageIdx(idx)}
                >
                  {renderCardContent(page, idx)}
                </div>
              ))}
            </div>

            {/* Floating Drag Card (Mobile) */}
            {isTouchDragging && draggedIndex !== null && pages[draggedIndex] && (
              <div 
                className={`floating-drag-card ${viewMode === 'list' ? 'list-mode' : 'grid-mode'}`}
                style={{
                  left: dragPosition.x,
                  top: dragPosition.y,
                  width: draggedCardDims.width,
                  height: draggedCardDims.height,
                }}
              >
                {renderCardContent(pages[draggedIndex], draggedIndex)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}