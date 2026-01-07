'use client'

import PagesSidebar from './PagesSidebar'
import EditorSettings from './EditorSettings'
import EditorTopbar from './EditorTopbar'
import EditorCanvas from './EditorCanvas'
import UploadArea from './UploadArea'
import { useState, useEffect, useRef, useMemo } from 'react'
import '@/styles/editor/editor.css'
import ImageEditorModal from './ImageEditorModal'

export default function StepEditor({
  pages,
  setPages,
  currentPageIdx,
  setCurrentPageIdx,
  uploadedImages,
  setUploadedImages,
  selectedSize,
  sizes,
  layouts,
  selectedLayout,
  setSelectedLayout,
  selectedCaption,
  setSelectedCaption,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontColor,
  setSelectedFontColor,
  selectedFontFamily,
  setSelectedFontFamily,
  captionPosition,
  setCaptionPosition,
  captionAlignment,
  setCaptionAlignment,
  pageMargin,
  setPageMargin,
  pageGutter,
  setPageGutter,
  pageBgColor,
  setPageBgColor,
  imageFitMode,
  setImageFitMode,
  imageBorderRadius,
  setImageBorderRadius,
  showPageNumbers,
  setShowPageNumbers,
  autoSave,
  setAutoSave,
  clearProgress,
  fontFamilies,
  isSidebarOpen,
  setIsSidebarOpen,
  undo,
  redo,
  canUndo,
  canRedo,
}) {
  const canvasRef = useRef(null)
  const currentPage = pages[currentPageIdx]
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null)
  const [editingSlotIdx, setEditingSlotIdx] = useState(null)
  const [editingSlotRect, setEditingSlotRect] = useState(null)
  

  /* ------------------------------
     Layout helpers
  ------------------------------ */
  const currentPageLayout = currentPage?.layout || selectedLayout
  const currentLayoutObj =
    layouts.find(l => l.id === currentPageLayout) || layouts[0]

  useEffect(() => {
    const handler = (e) => setPages(e.detail)
    window.addEventListener('auto-generate-pages', handler)
    return () => window.removeEventListener('auto-generate-pages', handler)
  }, [setPages])

  /* ------------------------------
     Keyboard Navigation
  ------------------------------ */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      // Ignore if modal is open (editingSlotIdx is not null)
      if (editingSlotIdx !== null) return
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        if (currentPageIdx < pages.length - 1) {
          setCurrentPageIdx(currentPageIdx + 1)
          
          // Scroll sidebar to show active page
          const sidebar = document.querySelector('.pages-sidebar')
          if (sidebar) {
            const activeItem = sidebar.children[1]?.children[currentPageIdx + 1] // pages-list is 2nd child
            // A better query might be needed
            setTimeout(() => {
               const active = document.querySelector('.page-item.active')
               if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 0)
          }
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentPageIdx > 0) {
          setCurrentPageIdx(currentPageIdx - 1)
          setTimeout(() => {
               const active = document.querySelector('.page-item.active')
               if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 0)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPageIdx, pages.length, setCurrentPageIdx, editingSlotIdx])

  const openImageEditor = (slotIdx) => {
    setEditingSlotIdx(slotIdx)
  }

  const updateImageInSlot = (slotIdx, updatedImage) => {
    setUploadedImages(prev =>
      prev.map(img =>
        img.id === updatedImage.id ? updatedImage : img
      )
    )
  }
  
  const selectedSizeObj = sizes.find(s => s.id === selectedSize)

  // Per-page overrides (fallback to global defaults)
  const effectivePageMargin =
    typeof currentPage?.pageMargin === 'number' ? currentPage.pageMargin : pageMargin
  const effectivePageGutter =
    typeof currentPage?.pageGutter === 'number' ? currentPage.pageGutter : pageGutter

  const layoutSplitX = currentPage?.layoutSplitX ?? 50
  const layoutSplitY = currentPage?.layoutSplitY ?? 50

  const getSlotRects = () => {
    if (!selectedSizeObj) return []
    const PIXELS_PER_INCH = 96; // Assuming 96 DPI for preview; adjust if needed for higher quality
    const pageW = selectedSizeObj.width * PIXELS_PER_INCH;
    const pageH = selectedSizeObj.height * PIXELS_PER_INCH;
  const innerW = pageW - effectivePageMargin * 2; // margin assumed in pixels
  const innerH = pageH - effectivePageMargin * 2;
    const splitX = (layoutSplitX ?? 50) / 100;
    const splitY = (layoutSplitY ?? 50) / 100;

    switch (currentLayoutObj.template) {
      case 'single':
        return [{ x: 0, y: 0, width: innerW, height: innerH }];

      case '2-horizontal': {
        const h = (innerH - effectivePageGutter) / 2;
        return [
          { x: 0, y: 0, width: innerW, height: h },
          { x: 0, y: h + effectivePageGutter, width: innerW, height: h },
        ];
      }

      case '2-vertical': {
        const w = (innerW - effectivePageGutter) / 2;
        return [
          { x: 0, y: 0, width: w, height: innerH },
          { x: w + effectivePageGutter, y: 0, width: w, height: innerH },
        ];
      }

      case '1-top-2-bottom': {
        const topH = innerH * splitY;
        const bottomH = innerH - topH - effectivePageGutter;
        const w = (innerW - effectivePageGutter) / 2;
        return [
          { x: 0, y: 0, width: innerW, height: topH },
          { x: 0, y: topH + effectivePageGutter, width: w, height: bottomH },
          { x: w + effectivePageGutter, y: topH + effectivePageGutter, width: w, height: bottomH },
        ];
      }

      case '2-top-1-bottom': {
        const bottomH = innerH * (1 - splitY);
        const topH = innerH - bottomH - effectivePageGutter;
        const w = (innerW - effectivePageGutter) / 2;
        return [
          { x: 0, y: 0, width: w, height: topH },
          { x: w + effectivePageGutter, y: 0, width: w, height: topH },
          { x: 0, y: topH + effectivePageGutter, width: innerW, height: bottomH },
        ];
      }

      case '4-grid': {
        const w = (innerW - effectivePageGutter) / 2;
        const h = (innerH - effectivePageGutter) / 2;
        return [
          { x: 0, y: 0, width: w, height: h },
          { x: w + effectivePageGutter, y: 0, width: w, height: h },
          { x: 0, y: h + effectivePageGutter, width: w, height: h },
          { x: w + effectivePageGutter, y: h + effectivePageGutter, width: w, height: h },
        ];
      }

      case '6-grid': {
        const w = (innerW - effectivePageGutter * 2) / 3;
        const h = (innerH - effectivePageGutter) / 2;
        return [
          { x: 0, y: 0, width: w, height: h },
          { x: w + effectivePageGutter, y: 0, width: w, height: h },
          { x: (w + effectivePageGutter) * 2, y: 0, width: w, height: h },
          { x: 0, y: h + effectivePageGutter, width: w, height: h },
          { x: w + effectivePageGutter, y: h + effectivePageGutter, width: w, height: h },
          { x: (w + effectivePageGutter) * 2, y: h + effectivePageGutter, width: w, height: h },
        ];
      }

      default:
        return [];
    }
  }

  const slotRects = getSlotRects()

  const getImageObjectForSlot = (slotIdx) => {
    const imageId = currentPage?.images?.[slotIdx]
    if (!imageId) return null
    return uploadedImages.find(img => img.id === imageId) || null
  }

  const getMaxImages = (layout) => {
    if (!layout) return 1
    if (
      layout.template === '1-top-2-bottom' ||
      layout.template === '2-top-1-bottom'
    ) return 3
    return layout.cols * layout.rows
  }

  // --- Mobile Navigation helpers ---
   const goToPrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1)
      setTimeout(() => {
        const active = document.querySelector('.page-item.active')
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 0)
    }
  }

  const goToNextPage = () => {
    if (currentPageIdx < pages.length - 1) {
      setCurrentPageIdx(currentPageIdx + 1)
      setTimeout(() => {
        const active = document.querySelector('.page-item.active')
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 0)
    }
  }

  const maxSlots = getMaxImages(currentLayoutObj)

  if (currentPage?.layout && currentPage.layout !== selectedLayout) {
    setSelectedLayout(currentPage.layout)
  }

  /* ------------------------------
     Image handling
  ------------------------------ */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // Upload limit (keep in sync with the UI text in `UploadArea.jsx`).
    const MAX_FILE_MB = 50
    const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

    // Create a small thumbnail for fast grids/sidebars.
    // Keep the full image as a blob: URL so the editor stays responsive.
    const createThumbnail = (file, maxSize = 256) =>
      new Promise((resolve) => {
        const img = new Image()
        const tmpUrl = URL.createObjectURL(file)

        img.onload = () => {
          const w = img.naturalWidth || 0
          const h = img.naturalHeight || 0
          const scale = Math.min(1, maxSize / Math.max(w || 1, h || 1))
          const tw = Math.max(1, Math.round(w * scale))
          const th = Math.max(1, Math.round(h * scale))

          const canvas = document.createElement('canvas')
          canvas.width = tw
          canvas.height = th
          const ctx = canvas.getContext('2d')
          if (ctx) ctx.drawImage(img, 0, 0, tw, th)

          URL.revokeObjectURL(tmpUrl)
          resolve({
            thumbSrc: ctx ? canvas.toDataURL('image/jpeg', 0.72) : null,
            width: w,
            height: h,
          })
        }

        img.onerror = () => {
          URL.revokeObjectURL(tmpUrl)
          resolve({ thumbSrc: null, width: null, height: null })
        }

        img.src = tmpUrl
      })

    const BATCH_SIZE = 10

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)

      const prepared = await Promise.all(
        batch.map(async (file) => {
          if (file.size > MAX_FILE_BYTES) return null
          if (!file.type.startsWith('image/')) return null

          const src = URL.createObjectURL(file) // blob:
          const { thumbSrc, width, height } = await createThumbnail(file, 256)

          return {
            id: Date.now() + Math.random(),
            src,
            thumbSrc,
            width,
            height,
            name: file.name,
          }
        })
      )

      const cleaned = prepared.filter(Boolean)
      if (cleaned.length) {
        setUploadedImages(prev => [...prev, ...cleaned])
      }

      // Yield so the UI stays responsive with 100s of photos.
      await new Promise(r => setTimeout(r, 0))
    }

    // allow re-uploading same file
    e.target.value = ''
  }

  const addImageToPage = (imageId) => {
    if (selectedSlotIdx === null) return

    const newPages = [...pages]
    const page = newPages[currentPageIdx] || {}
    const max = getMaxImages(currentLayoutObj)

    const imgs = [...(Array.isArray(page.images) ? page.images : [])]
    while (imgs.length < max) imgs.push(null)

    imgs[selectedSlotIdx] = imageId
    newPages[currentPageIdx] = { ...page, images: imgs }

    setPages(newPages)
    setSelectedSlotIdx(null)
  }

  const removeImageFromPage = (imageId) => {
    const newPages = [...pages]
    const page = newPages[currentPageIdx] || {}
    const imgs = [...(Array.isArray(page.images) ? page.images : [])]
    const idx = imgs.indexOf(imageId)
    if (idx !== -1) imgs[idx] = null
    newPages[currentPageIdx] = { ...page, images: imgs }
    setPages(newPages)
    setSelectedSlotIdx(null)
  }

  const swapSlots = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return

    const max = getMaxImages(currentLayoutObj)
    const newPages = [...pages]
    const page = { ...(newPages[currentPageIdx] || {}) }
    const imgs = [...(Array.isArray(page.images) ? page.images : [])]
    while (imgs.length < max) imgs.push(null)

    const tmp = imgs[fromIdx]
    imgs[fromIdx] = imgs[toIdx]
    imgs[toIdx] = tmp

    page.images = imgs
    newPages[currentPageIdx] = page
    setPages(newPages)

    if (selectedSlotIdx === fromIdx) setSelectedSlotIdx(toIdx)
    else if (selectedSlotIdx === toIdx) setSelectedSlotIdx(fromIdx)
  }

  /* ------------------------------
     Page + layout updates
  ------------------------------ */
  const updatePageLayout = (layoutId) => {
    setSelectedLayout(layoutId)
    const newPages = [...pages]
    const layout = layouts.find(l => l.id === layoutId) || layouts[0]
    const max = getMaxImages(layout)

    const current = newPages[currentPageIdx] || {}
    const currentImages = Array.isArray(current.images) ? current.images : []

    newPages[currentPageIdx] = {
      ...current,
      layout: layoutId,
      images: currentImages.slice(0, max),
      layoutSplitX: 50,
      layoutSplitY: 50,
    }

    setPages(newPages)
  }

  const updateCaption = (text) => {
    setSelectedCaption(text)
    const newPages = [...pages]
    newPages[currentPageIdx].caption = text
    setPages(newPages)
  }

  const updateCaptionStyle = (key, value) => {
    if (key === 'fontSize') setSelectedFontSize(value)
    if (key === 'color') setSelectedFontColor(value)
    if (key === 'fontFamily') setSelectedFontFamily(value)
    if (key === 'position') setCaptionPosition(value)
    if (key === 'alignment') setCaptionAlignment(value)

    const newPages = [...pages]
    newPages[currentPageIdx].captionStyle = {
      ...newPages[currentPageIdx].captionStyle,
      [key]: value,
    }
    setPages(newPages)
  }

  const applyToAllPages = () => {
    const style = pages[currentPageIdx]?.captionStyle
    const layout = layouts.find(l => l.id === selectedLayout) || layouts[0]
    const max = getMaxImages(layout)

    const newPages = pages.map(p => {
      const imgs = Array.isArray(p.images) ? p.images : []
      return {
        ...p,
        captionStyle: { ...style },
        layout: selectedLayout,
        images: imgs.slice(0, max),
      }
    })

    setPages(newPages)
  }

  /* ------------------------------
     Page operations
  ------------------------------ */
  const addPage = (insertAtIndex = null) => {
    const newPage = {
      id: Date.now(),
      images: [],
      caption: '',
      captionStyle: {
        fontSize: selectedFontSize,
        color: selectedFontColor,
        fontFamily: selectedFontFamily,
        position: captionPosition,
        alignment: captionAlignment,
      },
      layout: selectedLayout,
      layoutSplitX: 50,
      layoutSplitY: 50,
    }

    if (typeof insertAtIndex === 'number') {
      const newPages = [...pages]
      newPages.splice(insertAtIndex, 0, newPage)
      setPages(newPages)
    } else {
      setPages([...pages, newPage])
    }
  }

  const duplicatePage = (idx) => {
    const page = pages[idx]
    const copy = {
      ...page,
      id: Date.now(),
      images: [...page.images],
      captionStyle: { ...page.captionStyle },
    }
    const newPages = [...pages]
    newPages.splice(idx + 1, 0, copy)
    setPages(newPages)
  }

  const removePage = (idx) => {
    if (pages.length <= 1) return
    const newPages = pages.filter((_, i) => i !== idx)
    setPages(newPages)
    if (currentPageIdx >= newPages.length) {
      setCurrentPageIdx(newPages.length - 1)
    }
  }

  const movePage = (idx, dir) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= pages.length) return
    const newPages = [...pages]
    const [p] = newPages.splice(idx, 1)
    newPages.splice(newIdx, 0, p)
    setPages(newPages)
    setCurrentPageIdx(newIdx)
  }
  const editorSlot = useMemo(() => {
    // Prefer the real DOM-measured slot size (exact match to what the user sees)
    if (editingSlotRect?.width && editingSlotRect?.height) return editingSlotRect

    // Fallback: keep previous behavior (aspect-ratio only) if we don't have a DOM rect
    if (
      editingSlotIdx === null ||
      editingSlotIdx === undefined ||
      !slotRects ||
      !slotRects[editingSlotIdx]
    ) {
      return null
    }

    const rawSlot = slotRects[editingSlotIdx]
    if (!rawSlot.width || !rawSlot.height) return null

    const SLOT_MAX = 420
    const ratio = rawSlot.width / rawSlot.height

    return ratio >= 1
      ? { width: SLOT_MAX, height: SLOT_MAX / ratio }
      : { height: SLOT_MAX, width: SLOT_MAX * ratio }
  }, [editingSlotIdx, slotRects, editingSlotRect])

  const swapImages = (pageIdx1, imgIdx1, pageIdx2, imgIdx2) => {
    const newPages = [...pages]
    
    // Ensure images arrays exist and are long enough
    const ensureImages = (pIdx, iIdx) => {
      if (!newPages[pIdx].images) newPages[pIdx].images = []
      while (newPages[pIdx].images.length <= iIdx) {
        newPages[pIdx].images.push(null)
      }
    }

    ensureImages(pageIdx1, imgIdx1)
    ensureImages(pageIdx2, imgIdx2)

    const img1 = newPages[pageIdx1].images[imgIdx1]
    const img2 = newPages[pageIdx2].images[imgIdx2]

    newPages[pageIdx1].images[imgIdx1] = img2
    newPages[pageIdx2].images[imgIdx2] = img1

    setPages(newPages)
  }

  /* ------------------------------
     JSX
  ------------------------------ */
  return (
    <div className="step-editor">
      <div className="step-editor-grid">
        <PagesSidebar
          pages={pages}
          currentPageIdx={currentPageIdx}
          setCurrentPageIdx={setCurrentPageIdx}
          addPage={addPage}
          removePage={removePage}
          duplicatePage={duplicatePage}
          movePage={movePage}
          layouts={layouts}
          getMaxImages={getMaxImages}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          swapImages={swapImages}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          uploadedImages={uploadedImages}
          selectedSize={selectedSize}
          sizes={sizes}
        />

        <div>
          <EditorTopbar
            currentPageIdx={currentPageIdx}
            currentLayoutObj={currentLayoutObj}
            imageCount={currentPage?.images?.length || 0}
            maxSlots={maxSlots}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <EditorCanvas
            canvasRef={canvasRef}
            currentPage={currentPage}
            currentLayoutObj={currentLayoutObj}
            selectedSizeObj={selectedSizeObj}
            pageBgColor={pageBgColor}
            pageMargin={effectivePageMargin}
            pageGutter={effectivePageGutter}
            captionPosition={captionPosition}
            captionAlignment={captionAlignment}
            selectedFontSize={selectedFontSize}
            selectedFontColor={selectedFontColor}
            selectedFontFamily={selectedFontFamily}
            // showPageNumbers={showPageNumbers}
            currentPageIdx={currentPageIdx}
            imageGridProps={{
              currentPage,
              currentLayoutObj,
              pageGutter: effectivePageGutter,
              maxSlots,
              uploadedImages,
              selectedSlotIdx,
              imageFitMode,
              imageBorderRadius,
              onSelectSlot: (idx, rect) => {
                setSelectedSlotIdx(idx)
                if (rect?.width && rect?.height) setEditingSlotRect(rect)
              },
              onRemoveImage: removeImageFromPage,
              onSwapSlots: swapSlots,
            }}
          />

          {/* Mobile Navigation Controls */}
          <div className="mobile-nav-bar">
            <button 
              className="mobile-nav-btn" 
              onClick={goToPrevPage} 
              disabled={currentPageIdx === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Prev</span>
            </button>
            
            <span className="mobile-nav-info">
              {currentPageIdx + 1} / {pages.length}
            </span>

            <button 
              className="mobile-nav-btn" 
              onClick={goToNextPage}
              disabled={currentPageIdx === pages.length - 1}
            >
              <span>Next</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <UploadArea onUpload={handleImageUpload} />
        </div>

        <EditorSettings
          layouts={layouts}
          selectedLayout={currentPageLayout}
          updatePageLayout={updatePageLayout}
          pageMargin={pageMargin}
          setPageMargin={setPageMargin}
          pageGutter={pageGutter}
          setPageGutter={setPageGutter}
          pageMarginEffective={effectivePageMargin}
          pageGutterEffective={effectivePageGutter}
          setPageMarginForCurrentPage={(v) => {
            const newPages = [...pages]
            const oldPage = newPages[currentPageIdx] || {}
            newPages[currentPageIdx] = { ...oldPage, pageMargin: v }
            setPages(newPages)
          }}
          setPageGutterForCurrentPage={(v) => {
            const newPages = [...pages]
            const oldPage = newPages[currentPageIdx] || {}
            newPages[currentPageIdx] = { ...oldPage, pageGutter: v }
            setPages(newPages)
          }}
          clearPageMarginOverride={() => {
            const newPages = [...pages]
            const oldPage = newPages[currentPageIdx] || {}
            const { pageMargin: _pm, ...rest } = oldPage
            newPages[currentPageIdx] = rest
            setPages(newPages)
          }}
          clearPageGutterOverride={() => {
            const newPages = [...pages]
            const oldPage = newPages[currentPageIdx] || {}
            const { pageGutter: _pg, ...rest } = oldPage
            newPages[currentPageIdx] = rest
            setPages(newPages)
          }}
          pageBgColor={pageBgColor}
          setPageBgColor={setPageBgColor}
          imageBorderRadius={imageBorderRadius}
          setImageBorderRadius={setImageBorderRadius}
          imageFitMode={imageFitMode}
          setImageFitMode={setImageFitMode}
          showPageNumbers={showPageNumbers}
          setShowPageNumbers={setShowPageNumbers}
          selectedCaption={selectedCaption}
          updateCaption={updateCaption}
          fontFamilies={fontFamilies}
          selectedFontFamily={selectedFontFamily}
          selectedFontSize={selectedFontSize}
          selectedFontColor={selectedFontColor}
          captionPosition={captionPosition}
          captionAlignment={captionAlignment}
          updateCaptionStyle={updateCaptionStyle}
          applyToAllPages={applyToAllPages}
          uploadedImages={uploadedImages}
          pages={pages}
          currentPage={currentPage}
          addImageToPage={addImageToPage}
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          clearProgress={clearProgress}
          getMaxImages={getMaxImages}
          layoutSplitX={currentPage?.layoutSplitX ?? 50}
          layoutSplitY={currentPage?.layoutSplitY ?? 50}
          updateLayoutSplitX={(v) => {
            const newPages = [...pages]
            newPages[currentPageIdx].layoutSplitX = v
            setPages(newPages)
          }}
          updateLayoutSplitY={(v) => {
            const newPages = [...pages]
            newPages[currentPageIdx].layoutSplitY = v
            setPages(newPages)
          }}
          selectedSlotIdx={selectedSlotIdx}
          openImageEditor={openImageEditor}
          updateImageInSlot={updateImageInSlot}
        />
        {editingSlotIdx !== null && editorSlot && (
          <ImageEditorModal
            image={getImageObjectForSlot(editingSlotIdx)}
            slot={editorSlot}
            onClose={() => {
              setEditingSlotIdx(null)
              setEditingSlotRect(null)
            }}
            onSave={(updatedImage) => {
              updateImageInSlot(editingSlotIdx, updatedImage)
              setEditingSlotIdx(null)
              setEditingSlotRect(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
