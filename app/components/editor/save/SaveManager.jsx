'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { saveProject, loadProject, clearProject } from '@/app/utils/storage'

export function useSaveManager({
  step,
  pages,
  uploadedImages,
  selectedProduct,
  selectedSize,
  coverImage,
  coverText,
  coverTheme,
  pageMargin,
  pageGutter,
  pageBgColor,
  imageFitMode,
  imageBorderRadius,
  showPageNumbers,
  layoutSplitX,
  layoutSplitY,
  selectedLayout,
  selectedFontFamily,
  selectedFontSize,
  selectedFontColor,
  captionPosition,
  captionAlignment,
  autoSave,
  setPages,
  setUploadedImages,
  setSelectedProduct,
  setSelectedSize,
  setCoverImage,
  setCoverText,
  setCoverTheme,
  setPageMargin,
  setPageGutter,
  setPageBgColor,
  setImageFitMode,
  setImageBorderRadius,
  setShowPageNumbers,
  setLayoutSplitX,
  setLayoutSplitY,
  setSelectedLayout,
  setSelectedFontFamily,
  setSelectedFontSize,
  setSelectedFontColor,
  setCaptionPosition,
  setCaptionAlignment,
  setAutoSave,
  setStep,
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize history with first state if not loaded
  useEffect(() => {
    if (pages.length > 0 && history.length === 0) {
      setHistory([pages])
      setHistoryIndex(0)
    }
  }, [pages, history.length])

  const setPagesWithHistory = (newPagesOrFn) => {
    let newPages
    if (typeof newPagesOrFn === 'function') {
      newPages = newPagesOrFn(pages)
    } else {
      newPages = newPagesOrFn
    }

    if (newPages === pages) return

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newPages)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setPages(newPages)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setPages(history[newIndex])
      setHistoryIndex(newIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setPages(history[newIndex])
      setHistoryIndex(newIndex)
    }
  }

  const saveProgress = useCallback(async () => {
    setIsSaving(true)

    try {
      const imagesToSave = await Promise.all(uploadedImages.map(async (img) => {
        if (img.src && img.src.startsWith('blob:')) {
          try {
            const response = await fetch(img.src)
            const blob = await response.blob()
            return { ...img, src: null, blob }
          } catch (e) {
            console.error('Failed to fetch blob for saving', e)
            return img
          }
        }
        return img
      }))

      const draft = {
        step,
        pages: pages.map(p => ({ ...p })),
        uploadedImages: imagesToSave,
        selectedProduct,
        selectedSize,
        coverImage,
        coverText,
        coverTheme,
        settings: {
          pageMargin,
          pageGutter,
          pageBgColor,
          imageFitMode,
          imageBorderRadius,
          showPageNumbers,
          selectedLayout,
          captionDefaults: {
            fontFamily: selectedFontFamily,
            fontSize: selectedFontSize,
            color: selectedFontColor,
            position: captionPosition,
            alignment: captionAlignment,
          },
          autoSave,
          layoutSplitX,
          layoutSplitY,
        },
        history,
        historyIndex,
        lastSaved: new Date().toISOString(),
      }

      await saveProject(draft)
      setLastSaved(draft.lastSaved)
    } catch (e) {
      console.error('Failed to save project', e)
    } finally {
      setTimeout(() => setIsSaving(false), 400)
    }
  }, [
    step,
    pages,
    uploadedImages,
    selectedProduct,
    selectedSize,
    coverImage,
    coverText,
    coverTheme,
    pageMargin,
    pageGutter,
    pageBgColor,
    imageFitMode,
    imageBorderRadius,
    showPageNumbers,
    layoutSplitX,
    layoutSplitY,
    selectedLayout,
    selectedFontFamily,
    selectedFontSize,
    selectedFontColor,
    captionPosition,
    captionAlignment,
    autoSave,
    history,
    historyIndex,
  ])

  const loadProgress = useCallback(async () => {
    try {
      const d = await loadProject()
      if (!d) return

      const restoredImages = (d.uploadedImages || []).map(img => {
        if (img.blob instanceof Blob) {
          return { ...img, src: URL.createObjectURL(img.blob) }
        }
        return img
      })

      setPages(Array.isArray(d.pages) ? d.pages.map(p => ({ ...p, pageMargin: 16, pageGutter: 16 })) : [])
      setUploadedImages(restoredImages)
      
      setSelectedProduct(d.selectedProduct ?? null)
      setSelectedSize(d.selectedSize ?? null)
      setCoverImage(d.coverImage ?? null)
      setCoverText(d.coverText ?? '')
      setCoverTheme(d.coverTheme ?? 'classic')
      setLastSaved(d.lastSaved ?? null)

      // Restore history
      setHistory(d.history ?? [])
      setHistoryIndex(d.historyIndex ?? -1)

      const s = d.settings || {}
      setPageMargin(16)
      setPageGutter(16)
      setPageBgColor(s.pageBgColor ?? '#ffffff')
      setImageFitMode(s.imageFitMode ?? 'cover')
      setImageBorderRadius(s.imageBorderRadius ?? 0)
      setShowPageNumbers(s.showPageNumbers ?? false)
      setLayoutSplitX(s.layoutSplitX ?? 50)
      setLayoutSplitY(s.layoutSplitY ?? 50)
      setSelectedLayout(s.selectedLayout ?? 'single')

      if (s.captionDefaults) {
        setSelectedFontFamily(s.captionDefaults.fontFamily ?? 'Inter')
        setSelectedFontSize(s.captionDefaults.fontSize ?? 16)
        setSelectedFontColor(s.captionDefaults.color ?? '#000000')
        setCaptionPosition(s.captionDefaults.position ?? 'bottom')
        setCaptionAlignment(s.captionDefaults.alignment ?? 'center')
      }

      setAutoSave(s.autoSave ?? true)
    } catch (err) {
      console.error('Failed to load draft', err)
    }
  }, [
    setPages,
    setUploadedImages,
    setSelectedProduct,
    setSelectedSize,
    setCoverImage,
    setCoverText,
    setCoverTheme,
    setPageMargin,
    setPageGutter,
    setPageBgColor,
    setImageFitMode,
    setImageBorderRadius,
    setShowPageNumbers,
    setLayoutSplitX,
    setLayoutSplitY,
    setSelectedLayout,
    setSelectedFontFamily,
    setSelectedFontSize,
    setSelectedFontColor,
    setCaptionPosition,
    setCaptionAlignment,
    setAutoSave,
  ])

  const clearProgress = async () => {
    if (!confirm('Clear all saved progress?')) return

    await clearProject()

    setPages([])
    setUploadedImages([])
    setSelectedProduct(null)
    setSelectedSize(null)
    setCoverImage(null)
    setCoverText('')
    setCoverTheme('classic')
    setStep(1)
    setLastSaved(null)

    setPageMargin(16)
    setPageGutter(16)
    setPageBgColor('#ffffff')
    setImageFitMode('cover')
    setImageBorderRadius(0)
    setShowPageNumbers(false)
    setLayoutSplitX(50)
    setLayoutSplitY(50)
    setSelectedLayout('single')
    setSelectedFontFamily('Inter')
    setSelectedFontSize(16)
    setSelectedFontColor('#000000')
    setCaptionPosition('bottom')
    setCaptionAlignment('center')
    setAutoSave(true)

    // Reset history
    setHistory([])
    setHistoryIndex(-1)
  }

  const applyCaptionStyleToAllPages = useCallback(() => {
    setPages(p =>
      p.map(pg => ({
        ...pg,
        captionStyle: {
          fontSize: selectedFontSize,
          color: selectedFontColor,
          fontFamily: selectedFontFamily,
          position: captionPosition,
          alignment: captionAlignment,
        },
      }))
    )
  }, [
    selectedFontSize,
    selectedFontColor,
    selectedFontFamily,
    captionPosition,
    captionAlignment,
    setPages,
  ])

  const applyPageSettingsToAllPages = useCallback(() => {
    setPages(p =>
      p.map(pg => ({
        ...pg,
        layout: selectedLayout,
      }))
    )
  }, [selectedLayout, setPages])

  // Autosave
  useEffect(() => {
    if (!autoSave || step < 2) return
    const t = setTimeout(saveProgress, 2000)
    return () => clearTimeout(t)
  }, [
    pages,
    pageMargin,
    pageGutter,
    pageBgColor,
    imageFitMode,
    imageBorderRadius,
    layoutSplitX,
    layoutSplitY,
    selectedLayout,
    selectedFontFamily,
    selectedFontSize,
    selectedFontColor,
    captionPosition,
    captionAlignment,
    autoSave,
    step,
    saveProgress,
    history,
    historyIndex,
  ])

  return {
    isSaving,
    lastSaved,
    history,
    historyIndex,
    setPagesWithHistory,
    undo,
    redo,
    saveProgress,
    loadProgress,
    clearProgress,
    applyCaptionStyleToAllPages,
    applyPageSettingsToAllPages,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }
}
