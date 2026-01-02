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
}) {
  const canvasRef = useRef(null)
  const currentPage = pages[currentPageIdx]
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null)
  const [editingSlotIdx, setEditingSlotIdx] = useState(null)
  

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

  const layoutSplitX = currentPage?.layoutSplitX ?? 50
  const layoutSplitY = currentPage?.layoutSplitY ?? 50

  const getSlotRects = () => {
    const pageW = selectedSizeObj.width
    const pageH = selectedSizeObj.height

    const innerW = pageW - pageMargin * 2
    const innerH = pageH - pageMargin * 2

    const splitX = (layoutSplitX ?? 50) / 100
    const splitY = (layoutSplitY ?? 50) / 100

    switch (currentLayoutObj.template) {
      case 'single':
        return [{ x: 0, y: 0, width: innerW, height: innerH }]

      case '2-horizontal': {
        const h = (innerH - pageGutter) / 2
        return [
          { x: 0, y: 0, width: innerW, height: h },
          { x: 0, y: h + pageGutter, width: innerW, height: h },
        ]
      }

      case '2-vertical': {
        const w = (innerW - pageGutter) / 2
        return [
          { x: 0, y: 0, width: w, height: innerH },
          { x: w + pageGutter, y: 0, width: w, height: innerH },
        ]
      }

      case '1-top-2-bottom': {
        const topH = innerH * splitY
        const bottomH = innerH - topH - pageGutter
        const w = (innerW - pageGutter) / 2
        return [
          { x: 0, y: 0, width: innerW, height: topH },
          { x: 0, y: topH + pageGutter, width: w, height: bottomH },
          { x: w + pageGutter, y: topH + pageGutter, width: w, height: bottomH },
        ]
      }

      // add others as needed
      default:
        return []
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

  const maxSlots = getMaxImages(currentLayoutObj)

  if (currentPage?.layout && currentPage.layout !== selectedLayout) {
    setSelectedLayout(currentPage.layout)
  }

  /* ------------------------------
     Image handling
  ------------------------------ */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) return
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = ev =>
        setUploadedImages(prev => [
          ...prev,
          { id: Date.now() + Math.random(), src: ev.target.result, name: file.name },
        ])
      reader.readAsDataURL(file)
    })
  }

  const addImageToPage = (imageId) => {
    if (selectedSlotIdx === null) return

    const newPages = [...pages]
    const page = newPages[currentPageIdx]
    const max = getMaxImages(currentLayoutObj)

    const imgs = [...(page.images || [])]
    while (imgs.length < max) imgs.push(null)

    imgs[selectedSlotIdx] = imageId
    page.images = imgs

    setPages(newPages)
    setSelectedSlotIdx(null)
  }

  const removeImageFromPage = (imageId) => {
    const newPages = [...pages]
    const imgs = [...newPages[currentPageIdx].images]
    const idx = imgs.indexOf(imageId)
    if (idx !== -1) imgs[idx] = null
    newPages[currentPageIdx].images = imgs
    setPages(newPages)
    setSelectedSlotIdx(null)
  }

  /* ------------------------------
     Page + layout updates
  ------------------------------ */
  const updatePageLayout = (layoutId) => {
    setSelectedLayout(layoutId)
    const newPages = [...pages]
    const layout = layouts.find(l => l.id === layoutId) || layouts[0]
    const max = getMaxImages(layout)

    newPages[currentPageIdx] = {
      ...newPages[currentPageIdx],
      layout: layoutId,
      images: newPages[currentPageIdx].images.slice(0, max),
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

    const newPages = pages.map(p => ({
      ...p,
      captionStyle: { ...style },
      layout: selectedLayout,
      images: p.images.slice(0, max),
    }))

    setPages(newPages)
  }

  /* ------------------------------
     Page operations
  ------------------------------ */
  const addPage = () => {
    setPages([
      ...pages,
      {
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
      },
    ])
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
  if (
    editingSlotIdx === null ||
    editingSlotIdx === undefined ||
    !slotRects ||
    !slotRects[editingSlotIdx]
  ) {
    return null
  }

  const rawSlot = slotRects[editingSlotIdx]

  // Final safety (never hurts)
  if (!rawSlot.width || !rawSlot.height) return null

  const SLOT_MAX = 420
  const ratio = rawSlot.width / rawSlot.height

  return ratio >= 1
    ? { width: SLOT_MAX, height: SLOT_MAX / ratio }
    : { height: SLOT_MAX, width: SLOT_MAX * ratio }
}, [editingSlotIdx, slotRects])


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
        />

        <div>
          <EditorTopbar
            currentPageIdx={currentPageIdx}
            currentLayoutObj={currentLayoutObj}
            imageCount={currentPage?.images?.length || 0}
            maxSlots={maxSlots}
          />

          <EditorCanvas
            canvasRef={canvasRef}
            currentPage={currentPage}
            currentLayoutObj={currentLayoutObj}
            selectedSizeObj={selectedSizeObj}
            pageBgColor={pageBgColor}
            pageMargin={pageMargin}
            pageGutter={pageGutter}
            captionPosition={captionPosition}
            captionAlignment={captionAlignment}
            selectedFontSize={selectedFontSize}
            selectedFontColor={selectedFontColor}
            selectedFontFamily={selectedFontFamily}
            showPageNumbers={showPageNumbers}
            currentPageIdx={currentPageIdx}
            imageGridProps={{
              currentPage,
              currentLayoutObj,
              pageGutter,
              maxSlots,
              uploadedImages,
              selectedSlotIdx,
              imageFitMode,
              imageBorderRadius,
              onSelectSlot: setSelectedSlotIdx,
              onRemoveImage: removeImageFromPage,
            }}
          />

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
            onClose={() => setEditingSlotIdx(null)}
            onSave={(updatedImage) => {
              updateImageInSlot(editingSlotIdx, updatedImage)
              setEditingSlotIdx(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
