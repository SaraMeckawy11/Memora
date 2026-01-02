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
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)

  const getLayoutName = (layoutId) => {
    const layout = layouts.find(l => l.id === layoutId)
    return layout ? layout.name : 'Single'
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
    </>
  )
}