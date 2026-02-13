'use client'

import PagesSidebar from './pages/PagesSidebar'
import EditorSettings from './settings/EditorSettings'
import EditorBar from './bar/EditorBar'
import EditorCanvas from './canvas/EditorCanvas'
import UploadArea from './settings/UploadArea'
import PhotoLibrary from './settings/PhotoLibrary'
import { useState, useEffect, useRef, useMemo } from 'react'
import '@/styles/editor/editor.css'
import ImageEditorModal from './settings/ImageEditorModal'
import { getSlotRects } from '@/app/utils/layoutCalculations'
import { useImageHandling } from './hooks/useImageHandling'
import { usePageOperations } from './hooks/usePageOperations'
import { useCaptionHandling } from './hooks/useCaptionHandling'
import { LAYOUTS } from './settings/LayoutSection'

export default function StepEditor({
  step,
  pages,
  setPages,
  currentPageIdx,
  setCurrentPageIdx,
  uploadedImages,
  setUploadedImages,
  selectedSize,
  sizes,
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
  saveProgress,
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
  const [selectedOverlayIdx, setSelectedOverlayIdx] = useState(null)
  const [editingOverlayPhoto, setEditingOverlayPhoto] = useState(null)
  

  /* ------------------------------
     Layout helpers
  ------------------------------ */
  const currentPageLayout = currentPage?.layout || selectedLayout
  const currentLayoutObj =
    LAYOUTS.find(l => l.id === currentPageLayout) || LAYOUTS[0]

  const selectedSizeObj = sizes.find(s => s.id === selectedSize) || sizes[0]

  const effectivePageMargin =
    typeof currentPage?.pageMargin === 'number' ? currentPage.pageMargin : pageMargin
  const effectivePageGutter =
    typeof currentPage?.pageGutter === 'number' ? currentPage.pageGutter : pageGutter

  const layoutSplitX = currentPage?.layoutSplitX ?? 50
  const layoutSplitY = currentPage?.layoutSplitY ?? 50

  const getMaxImages = (layout) => {
    if (!layout) return 1
    if (
      layout.template === '1-top-2-bottom' ||
      layout.template === '2-top-1-bottom'
    ) return 3
    return layout.cols * layout.rows
  }

  const maxSlots = getMaxImages(currentLayoutObj)

  /* ------------------------------
     Custom Hooks
  ------------------------------ */
  const imageHandling = useImageHandling(
    pages,
    setPages,
    currentPageIdx,
    setUploadedImages,
    currentLayoutObj,
    getMaxImages,
    setSelectedSlotIdx
  )

  const pageOperations = usePageOperations(
    pages,
    setPages,
    currentPageIdx,
    setCurrentPageIdx,
    selectedLayout,
    selectedFontSize,
    selectedFontColor,
    selectedFontFamily,
    captionPosition,
    captionAlignment,
    LAYOUTS,
    getMaxImages
  )

  const captionHandling = useCaptionHandling(
    pages,
    setPages,
    currentPageIdx,
    setSelectedCaption,
    setSelectedFontSize,
    setSelectedFontColor,
    setSelectedFontFamily,
    setCaptionPosition,
    setCaptionAlignment
  )

  /* ------------------------------
     Effects
  ------------------------------ */

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

  /* ------------------------------
     Helper Functions
  ------------------------------ */
  const getSlotRectsForEditor = () => {
    if (!selectedSizeObj) return []
    const PIXELS_PER_INCH = 96
    const pageW = selectedSizeObj.width * PIXELS_PER_INCH
    const pageH = selectedSizeObj.height * PIXELS_PER_INCH
    
    return getSlotRects(
      currentLayoutObj,
      pageW,
      pageH,
      effectivePageMargin,
      effectivePageGutter,
      layoutSplitX,
      layoutSplitY
    )
  }

  const slotRects = getSlotRectsForEditor()

  const getImageObjectForSlot = (slotIdx) => {
    const imageId = currentPage?.images?.[slotIdx]
    if (!imageId) return null
    return uploadedImages.find(img => img.id === imageId) || null
  }

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

  if (currentPage?.layout && currentPage.layout !== selectedLayout) {
    setSelectedLayout(currentPage.layout)
  }

  const editorSlot = useMemo(() => {
    if (editingSlotRect?.width && editingSlotRect?.height) return editingSlotRect

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
          addPage={pageOperations.addPage}
          removePage={pageOperations.removePage}
          duplicatePage={pageOperations.duplicatePage}
          movePage={pageOperations.movePage}
          getMaxImages={getMaxImages}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          swapImages={pageOperations.swapImages}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          uploadedImages={uploadedImages}
          selectedSize={selectedSize}
          sizes={sizes}
        />

        <div className="editor-main-column">


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
            currentPageIdx={currentPageIdx}
            onUpdateTextPosition={(positionData) => {
              const newPages = [...pages]
              const page = newPages[currentPageIdx]
              
              // Update position
              if (positionData.x !== undefined) {
                page.textPosition = {
                  ...page.textPosition,
                  x: positionData.x,
                  y: positionData.y,
                }
              }
              
              // Update rectangle dimensions
              if (positionData.width !== undefined) {
                page.textRect = {
                  ...page.textRect,
                  width: positionData.width,
                  height: positionData.height,
                }
              }
              
              setPages(newPages)
            }}
            onUpdateOverlay={(overlayIdx, updatedOverlay) => {
              const newPages = [...pages]
              const page = newPages[currentPageIdx]
              const overlays = [...(page.overlays || [])]
              overlays[overlayIdx] = updatedOverlay
              page.overlays = overlays
              setPages(newPages)
            }}
            onRemoveOverlay={(overlayIdx) => {
              const newPages = [...pages]
              const page = newPages[currentPageIdx]
              page.overlays = (page.overlays || []).filter((_, i) => i !== overlayIdx)
              setPages(newPages)
              if (selectedOverlayIdx === overlayIdx) setSelectedOverlayIdx(null)
            }}
            selectedOverlayIdx={selectedOverlayIdx}
            onSelectOverlay={(idx) => setSelectedOverlayIdx(idx)}
            onRemoveText={() => {
              const newPages = [...pages]
              newPages[currentPageIdx].textBoxHidden = true
              newPages[currentPageIdx].textContent = ''
              setPages(newPages)
            }}
            onEditOverlayPhoto={(overlayIdx) => {
              // Read the *live* overlay from pages so we always get the latest
              // src/originalSrc after previous edits.
              const overlay = pages[currentPageIdx]?.overlays?.[overlayIdx]
              if (overlay?.type === 'photo') {
                setEditingOverlayPhoto({ overlayIdx, overlay: { ...overlay } })
              }
            }}
            onUpdateOverlayContent={(overlayIdx, content) => {
              const newPages = [...pages]
              const page = newPages[currentPageIdx]
              const overlays = [...(page.overlays || [])]
              overlays[overlayIdx] = { ...overlays[overlayIdx], content }
              page.overlays = overlays
              setPages(newPages)
            }}
            onUpdateTextContent={(text) => {
              const newPages = [...pages]
              newPages[currentPageIdx].textContent = text
              setPages(newPages)
            }}
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
              onRemoveImage: imageHandling.removeImageFromPage,
              onSwapSlots: imageHandling.swapSlots,
            }}
          />
          
          <EditorBar
            currentPageIdx={currentPageIdx}
            totalPages={pages.length}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            setIsSidebarOpen={setIsSidebarOpen}
            onUpload={imageHandling.handleImageUpload}
          />

          <PhotoLibrary
            uploadedImages={uploadedImages}
            addImageToPage={(id) => imageHandling.addImageToPage(id, selectedSlotIdx)}
            pages={pages}
            currentPage={currentPage}
            onUpload={imageHandling.handleImageUpload}
            setUploadedImages={setUploadedImages}
          />

        </div>

        <EditorSettings
          step={step}
          selectedLayout={currentPageLayout}
          updatePageLayout={(layoutId) => pageOperations.updatePageLayout(layoutId, setSelectedLayout)}
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
          updateCaption={captionHandling.updateCaption}
          selectedFontFamily={selectedFontFamily}
          selectedFontSize={selectedFontSize}
          selectedFontColor={selectedFontColor}
          captionPosition={captionPosition}
          captionAlignment={captionAlignment}
          updateCaptionStyle={captionHandling.updateCaptionStyle}
          applyToAllPages={pageOperations.applyToAllPages}
          uploadedImages={uploadedImages}
          pages={pages}
          setPages={setPages}
          currentPage={currentPage}
          addImageToPage={(imageId) => imageHandling.addImageToPage(imageId, selectedSlotIdx)}
          onUpload={imageHandling.handleImageUpload}
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          clearProgress={clearProgress}
          saveProgress={saveProgress}
          selectedSize={selectedSize}
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
          currentPageIdx={currentPageIdx}
          addTextPage={pageOperations.addTextPage}
          removePage={pageOperations.removePage}
          selectedOverlayIdx={selectedOverlayIdx}
          onSelectOverlay={(idx) => setSelectedOverlayIdx(idx)}
          updateOverlayStyle={(overlayIdx, key, value) => {
            const newPages = [...pages]
            const page = newPages[currentPageIdx]
            const overlays = [...(page.overlays || [])]
            const overlay = { ...overlays[overlayIdx] }
            overlay.style = { ...(overlay.style || {}), [key]: value }
            overlays[overlayIdx] = overlay
            page.overlays = overlays
            setPages(newPages)
          }}
          updateOverlayContent={(overlayIdx, content) => {
            const newPages = [...pages]
            const page = newPages[currentPageIdx]
            const overlays = [...(page.overlays || [])]
            overlays[overlayIdx] = { ...overlays[overlayIdx], content }
            page.overlays = overlays
            setPages(newPages)
          }}
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
        {editingOverlayPhoto && (() => {
          const ov = editingOverlayPhoto.overlay
          // Compute the actual slot aspect ratio from the overlay's
          // percentage-based width/height and the page dimensions.
          const pageW = (selectedSizeObj?.width || 8) * 96   // inches → px
          const pageH = (selectedSizeObj?.height || 10) * 96
          const ovW = ((ov.width || 30) / 100) * pageW
          const ovH = ((ov.height || 30) / 100) * pageH
          const SLOT_MAX = 420
          const ratio = ovW / ovH
          const overlaySlot = ratio >= 1
            ? { width: SLOT_MAX, height: SLOT_MAX / ratio }
            : { height: SLOT_MAX, width: SLOT_MAX * ratio }

          // Always open the modal with the original (full) image when
          // available so the user can re-crop / re-position from scratch.
          // The modal's "Revert" and crop tools work against this source.
          const modalSrc = ov.originalSrc || ov.src

          return (
            <ImageEditorModal
              image={{
                id: ov.id,
                src: modalSrc,
                name: ov.name,
                originalSrc: ov.originalSrc,
                fit: 'cover',
              }}
              slot={overlaySlot}
              onClose={() => setEditingOverlayPhoto(null)}
              onSave={(updatedImage) => {
                const idx = editingOverlayPhoto.overlayIdx
                const newPages = [...pages]
                const page = newPages[currentPageIdx]
                const overlays = [...(page.overlays || [])]

                // Determine the original source to keep for future reverts
                const keepOriginal = ov.originalSrc || ov.src

                if (updatedImage.crop) {
                  // Cover-mode pan — bake the visible portion into src
                  const img = new window.Image()
                  img.onload = () => {
                    const c = updatedImage.crop
                    const sx = (c.x / 100) * img.naturalWidth
                    const sy = (c.y / 100) * img.naturalHeight
                    const sw = (c.w / 100) * img.naturalWidth
                    const sh = (c.h / 100) * img.naturalHeight
                    const canvas = document.createElement('canvas')
                    canvas.width = Math.max(1, Math.round(sw))
                    canvas.height = Math.max(1, Math.round(sh))
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
                    const bakedSrc = canvas.toDataURL('image/jpeg', 0.95)
                    overlays[idx] = {
                      ...overlays[idx],
                      src: bakedSrc,
                      originalSrc: keepOriginal,
                    }
                    page.overlays = overlays
                    setPages([...newPages])
                    setEditingOverlayPhoto(null)
                  }
                  img.onerror = () => setEditingOverlayPhoto(null)
                  img.src = updatedImage.src
                } else if (!updatedImage.originalSrc && updatedImage.src === keepOriginal) {
                  // Reverted to original
                  overlays[idx] = {
                    ...overlays[idx],
                    src: updatedImage.src,
                    originalSrc: undefined,
                  }
                  page.overlays = overlays
                  setPages(newPages)
                  setEditingOverlayPhoto(null)
                } else {
                  // Freeform crop — src is already a baked data URL
                  overlays[idx] = {
                    ...overlays[idx],
                    src: updatedImage.src,
                    originalSrc: updatedImage.originalSrc || keepOriginal,
                  }
                  page.overlays = overlays
                  setPages(newPages)
                  setEditingOverlayPhoto(null)
                }
              }}
            />
          )
        })()}
      </div>
    </div>
  )
}
