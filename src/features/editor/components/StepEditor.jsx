'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { getSlotRects } from '@/app/utils/layoutCalculations'
import { LAYOUTS } from './settings/LayoutSection'
import { SIZES } from '@/features/project-setup/components/SizeSelection'

import PagesSidebar from './pages/PagesSidebar'
import EditorSettings from './settings/EditorSettings'
import EditorBar from './bar/EditorBar'
import EditorCanvas from './canvas/EditorCanvas'
import PhotoLibrary from './settings/PhotoLibrary'
import ImageEditorModal from './settings/ImageEditorModal'

import '@/styles/editor/editor.css'

export default function StepEditor() {
  const store = useProjectStore()
  
  // Local UI state (stays local because it's transient/ephemeral to this view)
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null)
  const [editingSlotIdx, setEditingSlotIdx] = useState(null)
  const [editingSlotRect, setEditingSlotRect] = useState(null)
  const [selectedOverlayIdx, setSelectedOverlayIdx] = useState(null)
  const [editingOverlayPhoto, setEditingOverlayPhoto] = useState(null)
  
  const canvasRef = useRef(null)
  const currentPage = store.pages[store.currentPageIdx]

  /* ------------------------------
     Layout helpers
  ------------------------------ */
  const currentPageLayout = currentPage?.layout || store.selectedLayout
  const currentLayoutObj = LAYOUTS.find(l => l.id === currentPageLayout) || LAYOUTS[0]
  const selectedSizeObj = SIZES.find(s => s.id === store.selectedSize) || SIZES[0]

  const effectivePageMargin = typeof currentPage?.pageMargin === 'number' ? currentPage.pageMargin : store.pageMargin
  const effectivePageGutter = typeof currentPage?.pageGutter === 'number' ? currentPage.pageGutter : store.pageGutter

  const layoutSplitX = currentPage?.layoutSplitX ?? 50
  const layoutSplitY = currentPage?.layoutSplitY ?? 50

  const getMaxImages = (layout) => {
    if (!layout) return 1
    if (layout.template === '1-top-2-bottom' || layout.template === '2-top-1-bottom') return 3
    return layout.cols * layout.rows
  }

  const maxSlots = getMaxImages(currentLayoutObj)

  /* ------------------------------
     Keyboard Navigation
  ------------------------------ */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      if (editingSlotIdx !== null) return
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        if (store.currentPageIdx < store.pages.length - 1) {
          store.setCurrentPageIdx(store.currentPageIdx + 1)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        if (store.currentPageIdx > 0) {
          store.setCurrentPageIdx(store.currentPageIdx - 1)
        }
      }
    }

    const handleAutoGenerate = (e) => {
      const generated = e.detail
      const pagesWithIds = generated.map((p, idx) => ({
        ...p,
        id: `page-gen-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        type: p.type || 'photo',
        textContent: p.textContent || '',
        textStyle: p.textStyle || {
          fontSize: store.selectedFontSize,
          color: store.selectedFontColor,
          fontFamily: store.selectedFontFamily,
        },
        pageBgColor: p.pageBgColor || store.pageBgColor,
      }))
      store.updateGlobalSettings({ pages: pagesWithIds, currentPageIdx: 0 })
      store.setIsSidebarOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('auto-generate-pages', handleAutoGenerate)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('auto-generate-pages', handleAutoGenerate)
    }
  }, [store])

  const slotRects = useMemo(() => {
    if (!selectedSizeObj) return []
    const PIXELS_PER_INCH = 96
    return getSlotRects(
      currentLayoutObj,
      selectedSizeObj.width * PIXELS_PER_INCH,
      selectedSizeObj.height * PIXELS_PER_INCH,
      effectivePageMargin,
      effectivePageGutter,
      layoutSplitX,
      layoutSplitY
    )
  }, [currentLayoutObj, selectedSizeObj, effectivePageMargin, effectivePageGutter, layoutSplitX, layoutSplitY])

  const getImageObjectForSlot = (slotIdx) => {
    const imageId = currentPage?.images?.[slotIdx]
    if (!imageId) return null
    return store.uploadedImages.find(img => String(img.id) === String(imageId)) || null
  }

  const editorSlot = useMemo(() => {
    if (editingSlotRect?.width && editingSlotRect?.height) return editingSlotRect
    if (editingSlotIdx === null || !slotRects || !slotRects[editingSlotIdx]) return null
    
    const rawSlot = slotRects[editingSlotIdx]
    const SLOT_MAX = 420
    const ratio = rawSlot.width / rawSlot.height
    return ratio >= 1 ? { width: SLOT_MAX, height: SLOT_MAX / ratio } : { height: SLOT_MAX, width: SLOT_MAX * ratio }
  }, [editingSlotIdx, slotRects, editingSlotRect])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const newImgs = await Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve({
            id: Date.now() + Math.random(),
            src: event.target.result,
            name: file.name
          })
        }
        reader.readAsDataURL(file)
      })
    }))

    store.setUploadedImages([...store.uploadedImages, ...newImgs])
  }

  return (
    <div className="step-editor">
      <div className="step-editor-grid">
        <PagesSidebar
          pages={store.pages}
          currentPageIdx={store.currentPageIdx}
          setCurrentPageIdx={store.setCurrentPageIdx}
          addPage={store.addPage}
          removePage={store.removePage}
          duplicatePage={store.duplicatePage}
          movePage={store.movePage}
          getMaxImages={getMaxImages}
          isOpen={store.isSidebarOpen}
          setIsOpen={store.setIsSidebarOpen}
          swapImages={store.swapSlots}
          undo={store.undo}
          uploadedImages={store.uploadedImages}
          selectedSize={store.selectedSize}
          sizes={SIZES}
        />

        <div className="editor-main-column">
          <EditorCanvas
            canvasRef={canvasRef}
            currentPage={currentPage}
            currentLayoutObj={currentLayoutObj}
            selectedSizeObj={selectedSizeObj}
            pageBgColor={store.pageBgColor}
            pageMargin={effectivePageMargin}
            pageGutter={effectivePageGutter}
            captionPosition={store.captionPosition}
            captionAlignment={store.captionAlignment}
            selectedFontSize={store.selectedFontSize}
            selectedFontColor={store.selectedFontColor}
            selectedFontFamily={store.selectedFontFamily}
            currentPageIdx={store.currentPageIdx}
            imageGridProps={{
              currentPage,
              currentLayoutObj,
              pageGutter: effectivePageGutter,
              maxSlots,
              uploadedImages: store.uploadedImages,
              selectedSlotIdx,
              imageFitMode: store.imageFitMode,
              imageBorderRadius: store.imageBorderRadius,
              onSelectSlot: (idx, rect) => {
                setSelectedSlotIdx(idx)
                if (rect?.width && rect?.height) setEditingSlotRect(rect)
              },
              onRemoveImage: store.removeImageFromPage,
              onSwapSlots: store.swapSlots,
            }}
            // Note: Canvas callbacks for overlays/text can be refactored next
          />
          
          <EditorBar
            currentPageIdx={store.currentPageIdx}
            totalPages={store.pages.length}
            onPrevPage={() => store.setCurrentPageIdx(Math.max(0, store.currentPageIdx - 1))}
            onNextPage={() => store.setCurrentPageIdx(Math.min(store.pages.length - 1, store.currentPageIdx + 1))}
            setIsSidebarOpen={store.setIsSidebarOpen}
            onUpload={handleUpload}
          />

          <PhotoLibrary
            uploadedImages={store.uploadedImages}
            addImageToPage={(id) => store.addImageToPage(id, selectedSlotIdx)}
            pages={store.pages}
            currentPage={currentPage}
            onUpload={handleUpload}
            setUploadedImages={store.setUploadedImages}
          />
        </div>

        <EditorSettings
          // Most settings can now be simplified by having EditorSettings consume the store
          store={store} 
          currentLayoutObj={currentLayoutObj}
          effectivePageMargin={effectivePageMargin}
          effectivePageGutter={effectivePageGutter}
          getMaxImages={getMaxImages}
        />

        {editingSlotIdx !== null && editorSlot && (
          <ImageEditorModal
            image={getImageObjectForSlot(editingSlotIdx)}
            slot={editorSlot}
            onClose={() => { setEditingSlotIdx(null); setEditingSlotRect(null); }}
            onSave={(updatedImage) => {
              store.setUploadedImages(store.uploadedImages.map(img => img.id === updatedImage.id ? updatedImage : img));
              setEditingSlotIdx(null);
            }}
          />
        )}
      </div>
    </div>
  )
}
