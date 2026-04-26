'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { LAYOUTS } from './settings/LayoutSection'
import { getSlotRects } from '@/app/utils/layoutCalculations'
import PagesSidebar from './pages/PagesSidebar'
import EditorCanvas from './canvas/EditorCanvas'
import EditorBar from './bar/EditorBar'
import PhotoLibrary from './settings/PhotoLibrary'
import EditorSettings from './settings/EditorSettings'
import ImageEditorModal from './settings/ImageEditorModal'
import '@/styles/editor/editor.css'
import { ProjectImage, PhotoBookPage } from '@/types/project'

const SIZES = [
  { id: 1, name: '8x8', label: '8" x 8" Square', aspect: '1/1', width: 8, height: 8, popular: true },
  { id: 2, name: '10x10', label: '10" x 10" Square', aspect: '1/1', width: 10, height: 10 },
  { id: 3, name: '8x11', label: '8.5" x 11" Portrait', aspect: '8.5/11', width: 8.5, height: 11 },
  { id: 4, name: '11x8', label: '11" x 8.5" Landscape', aspect: '11/8.5', width: 11, height: 8.5 },
]

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
  
  const layoutSplitX = currentPage?.layoutSplitX ?? 0.5
  const layoutSplitY = currentPage?.layoutSplitY ?? 0.5
  const effectivePageMargin = currentPage?.pageMargin ?? store.pageMargin
  const effectivePageGutter = currentPage?.pageGutter ?? store.pageGutter

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
