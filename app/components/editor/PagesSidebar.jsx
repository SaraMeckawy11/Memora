'use client'
import { useState } from 'react'
import '@/styles/editor/PagesSidebar.css'

export default function PagesSidebar({
  pages,
  currentPageIdx,
  setCurrentPageIdx,
  addPage,
  removePage,
  duplicatePage,
  movePage,
  layouts = [],
  isOpen,
  setIsOpen,
  undo,
  redo,
  canUndo,
  canRedo,
  uploadedImages = [],
  selectedSize,
  sizes = [],
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const selectedSizeObj = sizes.find(s => s.id === selectedSize)
  const aspectRatio = selectedSizeObj ? selectedSizeObj.width / selectedSizeObj.height : 1

  const getImageSrc = (imgId) => {
    if (!imgId) return null
    // If it's already a URL string (legacy or direct), return it
    if (typeof imgId === 'string' && (imgId.startsWith('http') || imgId.startsWith('data:'))) return imgId
    // Otherwise look it up
    const found = uploadedImages.find(u => u.id === imgId)
    return found ? found.src : null
  }

  const getLayoutName = (layoutId) => {
    const layout = layouts.find(l => l.id === layoutId)
    return layout ? layout.name : 'Single'
  }

  const getMiniLayoutStyles = (layoutId, imagesCount) => {
    // Default styles
    let styles = {
      display: 'grid',
      gap: '2px',
      height: '100%',
      width: '100%',
      backgroundColor: '#fff'
    }

    // Map layout IDs to grid templates
    switch (layoutId) {
      case 'single':
        styles.gridTemplateColumns = '1fr'
        styles.gridTemplateRows = '1fr'
        break
      case '2-horizontal':
        styles.gridTemplateColumns = '1fr 1fr'
        styles.gridTemplateRows = '1fr'
        break
      case '2-vertical':
        styles.gridTemplateColumns = '1fr'
        styles.gridTemplateRows = '1fr 1fr'
        break
      case '1-top-2-bottom':
        styles.gridTemplateColumns = '1fr 1fr'
        styles.gridTemplateRows = '1fr 1fr'
        // We need custom placement for the first item to span 2 cols
        styles.custom = '1-top-2-bottom'
        break
      case '2-top-1-bottom':
        styles.gridTemplateColumns = '1fr 1fr'
        styles.gridTemplateRows = '1fr 1fr'
        styles.custom = '2-top-1-bottom'
        break
      case '4-grid':
        styles.gridTemplateColumns = '1fr 1fr'
        styles.gridTemplateRows = '1fr 1fr'
        break
      case '6-grid':
        styles.gridTemplateColumns = '1fr 1fr 1fr'
        styles.gridTemplateRows = '1fr 1fr'
        break
      default:
        // Fallback based on image count if layout unknown
        styles.gridTemplateColumns = imagesCount <= 1 ? '1fr' : '1fr 1fr'
        styles.gridTemplateRows = imagesCount > 2 ? '1fr 1fr' : '1fr'
    }
    return styles
  }

  const handlePageSelect = (idx) => {
    setCurrentPageIdx(idx);
    // Auto-close drawer only on mobile devices
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  const handleDragStart = (idx) => setDraggedIndex(idx)
  const handleDragOver = (e) => e.preventDefault()
  
  const handleDrop = (idx) => {
    if (draggedIndex === null || draggedIndex === idx) return
    movePage(draggedIndex, idx - draggedIndex)
    setDraggedIndex(null)
  }

  return (
    <>
      {/* 1. Mobile Toggle Button */}
      {/* <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>
        <span>📄 Pages</span>
      </button> */}

      {/* 2. Dimmed Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'is-active' : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* 3. The Sidebar */}
      <aside className={`pages-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="pages-header">
          <h4 className="pages-title">
            Pages <span className="pages-count">({pages.length})</span>
          </h4>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="add-page-btn" onClick={() => setIsPreviewOpen(true)}>
              Preview
            </button>
            <button className="add-page-btn" onClick={addPage}>
              + Add
            </button>
            {/* Visible only on mobile */}
            <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
              Done
            </button>
          </div>
        </div>

        <div className="pages-list">
          {pages.map((page, idx) => {
            const isActive = idx === currentPageIdx
            const isDragging = idx === draggedIndex

            return (
              <div
                key={page.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(idx)}
                onClick={() => handlePageSelect(idx)}
                className={`page-item ${isActive ? 'active' : ''}`}
                style={{ opacity: isDragging ? 0.5 : 1 }}
              >
                <div className="page-top">
                  <div>
                    <div className="page-title">
                      Page {idx + 1}
                      {page.images?.length > 0 && (
                        <span className="page-photos">
                          {page.images.length} photos
                        </span>
                      )}
                    </div>

                    {page.caption && (
                      <div className="page-caption">
                        “{page.caption}”
                      </div>
                    )}
                  </div>

                  <div className="page-actions">
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicatePage(idx)
                      }}
                      title="Duplicate"
                    >
                      ⧉
                    </button>

                    {pages.length > 1 && (
                      <button
                        className="icon-btn delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          removePage(idx)
                        }}
                        title="Delete"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="page-layout">
                  Layout: {getLayoutName(page.layout)}
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      {/* 4. Preview Modal */}
      {isPreviewOpen && (
        <div className="preview-modal-overlay">
          <div className="preview-modal-content">
            <div className="preview-header">
              <h3>Page Preview</h3>
              <div className="view-toggles" style={{ display: 'flex', gap: '4px', marginRight: 'auto', marginLeft: '16px' }}>
                <button 
                  className={`preview-btn ${viewMode === 'grid' ? 'primary' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  style={{ padding: '4px 8px' }}
                >
                  ⊞ Grid
                </button>
                <button 
                  className={`preview-btn ${viewMode === 'list' ? 'primary' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  style={{ padding: '4px 8px' }}
                >
                  ☰ List
                </button>
              </div>
              <div className="preview-actions">
                <button className="preview-btn" onClick={undo} disabled={!canUndo}>Undo</button>
                <button className="preview-btn" onClick={redo} disabled={!canRedo}>Redo</button>
                <button className="preview-btn primary" onClick={() => setIsPreviewOpen(false)}>Done</button>
              </div>
            </div>
            
            <div className={`preview-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {pages.map((page, idx) => (
                <div 
                  key={page.id} 
                  className={`preview-card ${idx === currentPageIdx ? 'active' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  onClick={() => setCurrentPageIdx(idx)}
                >
                  <div className="preview-card-header">
                    <span>Page {idx + 1}</span>
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
                  </div>
                  <div className="preview-card-body">
                    <div 
                      className="preview-page-container"
                      style={{
                        aspectRatio: `${aspectRatio}`,
                        width: aspectRatio >= 1 ? '100%' : 'auto',
                        height: aspectRatio < 1 ? '100%' : 'auto',
                        maxHeight: '100%',
                        maxWidth: '100%',
                        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                        backgroundColor: '#fff'
                      }}
                    >
                    {page.images && page.images.some(id => id) ? (
                      <div className="mini-page-content" style={getMiniLayoutStyles(page.layout, page.images.length)}>
                        {page.images.map((imgId, imgIdx) => {
                          const src = getImageSrc(imgId)
                          const layoutStyles = getMiniLayoutStyles(page.layout, page.images.length)
                          
                          let itemStyle = {
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }

                          // Apply custom spans
                          if (layoutStyles.custom === '1-top-2-bottom' && imgIdx === 0) {
                            itemStyle.gridColumn = 'span 2'
                          }
                          if (layoutStyles.custom === '2-top-1-bottom' && imgIdx === 2) {
                            itemStyle.gridColumn = 'span 2'
                          }

                          return (
                            <div key={imgIdx} className="mini-img-wrapper" style={itemStyle}>
                              {src ? (
                                <img 
                                  src={src} 
                                  alt="" 
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                  }}
                                />
                              ) : (
                                <span style={{ fontSize: '10px', color: '#ccc' }}>+</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="mini-layout" style={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <span>Empty</span>
                        <span style={{fontSize: '0.7em'}}>{getLayoutName(page.layout)}</span>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}