'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { LAYOUTS } from './settings/LayoutSection'
import { getSlotRects } from '@/app/utils/layoutCalculations'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import PagesSidebar from './pages/PagesSidebar'
import EditorCanvas from './canvas/EditorCanvas'
import EditorBar from './bar/EditorBar'
import PhotoLibrary from './settings/PhotoLibrary'
import EditorSettings from './settings/EditorSettings'
import ImageEditorModal from './settings/ImageEditorModal'
import '@/styles/editor/editor.css'
import { ProjectImage, PhotoBookPage } from '@/types/project'

export default function StepEditor() {
  const store = useProjectStore()
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null)
  const [editingSlotRect, setEditingSlotRect] = useState<any>(null)
  const [selectedOverlayIdx, setSelectedOverlayIdx] = useState<number | null>(null)

  const currentPage = store.pages[store.currentPageIdx] || null
  const currentLayoutObj = LAYOUTS.find(l => l.id === (currentPage?.layout || 'single')) || LAYOUTS[0]
  const selectedSizeObj = SIZES.find(s => s.id === store.selectedSize) || SIZES[0]
  const maxSlots = currentLayoutObj.slots
  
  const layoutSplitX = currentPage?.layoutSplitX ?? 50
  const layoutSplitY = currentPage?.layoutSplitY ?? 50
  const effectivePageMargin = currentPage?.pageMargin ?? store.pageMargin
  const effectivePageGutter = currentPage?.pageGutter ?? store.pageGutter

  useEffect(() => {
    if (store.step !== 2 || store.pages.length > 0) return

    const createdAt = Date.now()
    const initialPages: PhotoBookPage[] = Array.from({ length: store.pageCount || 10 }, (_, idx) => ({
      id: `page-${createdAt}-${idx}`,
      type: 'photo',
      images: [],
      textContent: '',
      textStyle: {
        fontSize: store.selectedFontSize,
        color: store.selectedFontColor,
        fontFamily: store.selectedFontFamily,
        position: store.captionPosition,
        alignment: store.captionAlignment,
      },
      layout: store.selectedLayout || 'single',
      overlays: [],
      textBoxHidden: false,
      pageBgColor: store.pageBgColor,
      pageMargin: store.pageMargin,
      pageGutter: store.pageGutter,
      layoutSplitX: 50,
      layoutSplitY: 50,
    }))

    store.updateGlobalSettings({ pages: initialPages, currentPageIdx: 0 })
  }, [
    store.step,
    store.pages.length,
    store.pageCount,
    store.selectedFontSize,
    store.selectedFontColor,
    store.selectedFontFamily,
    store.captionPosition,
    store.captionAlignment,
    store.selectedLayout,
    store.pageBgColor,
    store.pageMargin,
    store.pageGutter,
    store.updateGlobalSettings,
  ])

  useEffect(() => {
    if (store.pages.length > 0 && store.currentPageIdx >= store.pages.length) {
      store.setCurrentPageIdx(0)
    }
  }, [store.pages.length, store.currentPageIdx, store.setCurrentPageIdx])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) store.redo()
        else store.undo()
      }
    }

    const handleAutoGenerate = (e: any) => {
      const generatedPages = e.detail || []
      const pagesWithIds: PhotoBookPage[] = generatedPages.map((p: any) => ({
        ...p,
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: p.type || 'photo',
        images: p.images || [],
        textStyle: p.textStyle || {
          fontSize: store.selectedFontSize,
          color: store.selectedFontColor,
          fontFamily: store.selectedFontFamily,
          position: store.captionPosition,
          alignment: store.captionAlignment,
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

  const getImageObjectForSlot = (slotIdx: number) => {
    const imageId = currentPage?.images?.[slotIdx]
    if (!imageId) return null
    return store.uploadedImages.find(img => String(img.id) === String(imageId)) || null
  }

  const editorSlot = useMemo(() => {
    if (editingSlotRect?.width && editingSlotRect?.height) return editingSlotRect
    const editingIdx = store.editingSlotIdx;
    if (editingIdx === null || !slotRects || !slotRects[editingIdx]) return null
    
    const rawSlot = slotRects[editingIdx]
    const SLOT_MAX = 420
    const ratio = rawSlot.width / rawSlot.height
    return ratio >= 1 ? { width: SLOT_MAX, height: SLOT_MAX / ratio } : { height: SLOT_MAX, width: SLOT_MAX * ratio }
  }, [store.editingSlotIdx, slotRects, editingSlotRect])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    if (!files.length) return

    const newImgs = await Promise.all(files.map((file: File) => {
      return new Promise<ProjectImage>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event: any) => {
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

  const imageGridProps = {
    currentPage,
    currentLayoutObj,
    pageGutter: effectivePageGutter,
    maxSlots,
    uploadedImages: store.uploadedImages,
    selectedSlotIdx,
    imageFitMode: store.imageFitMode,
    imageBorderRadius: store.imageBorderRadius,
    onSelectSlot: (idx: number, rect: any) => {
      setSelectedSlotIdx(idx)
      store.setSelectedSlotIdx(idx)
      if (rect?.width && rect?.height) setEditingSlotRect(rect)
    },
    onRemoveImage: store.removeImageFromPage,
    onSwapSlots: store.swapSlots,
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
          isOpen={store.isSidebarOpen}
          setIsOpen={store.setIsSidebarOpen}
          swapImages={store.swapImages}
          undo={store.undo}
          redo={store.redo}
          canUndo={true} 
          canRedo={true} 
          uploadedImages={store.uploadedImages}
          selectedSize={store.selectedSize}
          sizes={SIZES}
        />

        <div className="editor-main-column">
          {currentPage && (
            <EditorCanvas
              canvasRef={canvasRef}
              currentPage={currentPage}
              currentLayoutObj={currentLayoutObj}
              selectedSizeObj={selectedSizeObj}
              pageBgColor={currentPage.pageBgColor || '#ffffff'}
              pageMargin={effectivePageMargin}
              pageGutter={effectivePageGutter}
              captionPosition={store.captionPosition}
              captionAlignment={store.captionAlignment}
              selectedFontSize={store.selectedFontSize}
              selectedFontColor={store.selectedFontColor}
              selectedFontFamily={store.selectedFontFamily}
              showPageNumbers={store.showPageNumbers}
              currentPageIdx={store.currentPageIdx}
              imageGridProps={imageGridProps}
              onUpdateTextPosition={(rect) => store.updateCurrentPageSettings({ textPosition: { x: rect.x, y: rect.y }, textRect: { width: rect.width, height: rect.height } })}
              onUpdateOverlay={(idx, updated) => store.updateOverlay(idx, updated)}
              onRemoveOverlay={(idx) => store.removeOverlay(idx)}
              selectedOverlayIdx={store.selectedOverlayIdx}
              onSelectOverlay={(idx) => store.setSelectedOverlayIdx(idx)}
              onEditOverlayPhoto={(idx) => store.setEditingSlotIdx(idx + currentLayoutObj.slots)}
              onRemoveText={() => store.updateCurrentPageSettings({ textContent: '' })}
              onUpdateOverlayContent={(idx, content) => store.updateOverlay(idx, { content })}
              onUpdateTextContent={(content) => store.updateCurrentPageSettings({ textContent: content })}
            />
          )}

          <EditorBar
            currentPageIdx={store.currentPageIdx}
            totalPages={store.pages.length}
            onPrevPage={() => store.setCurrentPageIdx(Math.max(0, store.currentPageIdx - 1))}
            onNextPage={() => store.setCurrentPageIdx(Math.min(store.pages.length - 1, store.currentPageIdx + 1))}
            setIsSidebarOpen={store.setIsSidebarOpen}
            onUpload={handleUpload}
            onAddPage={() => store.addPage()}
            onUndo={store.undo}
            onRedo={store.redo}
            onPreview={() => {}}
          />
          
          <PhotoLibrary
            uploadedImages={store.uploadedImages}
            addImageToPage={(id) => store.addImageToPage(id, selectedSlotIdx || 0)}
            pages={store.pages}
            onUpload={handleUpload}
            setUploadedImages={store.setUploadedImages}
          />
        </div>

        <div>
          <EditorSettings />
        </div>
      </div>

      {store.editingSlotIdx !== null && (
        <ImageEditorModal
          image={getImageObjectForSlot(store.editingSlotIdx)}
          slot={editorSlot}
          onClose={() => store.setEditingSlotIdx(null)}
          onSave={(updated) => {
            if (store.editingSlotIdx !== null) {
              store.updateImageInSlot(store.editingSlotIdx, updated)
            }
            store.setEditingSlotIdx(null)
          }}
        />
      )}
    </div>
  )
}
