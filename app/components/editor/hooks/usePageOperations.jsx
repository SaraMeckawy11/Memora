export function usePageOperations(
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
  layouts,
  getMaxImages
) {
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

  const addTextPage = (insertAtIndex = null) => {
    const newPage = {
      id: Date.now(),
      type: 'text', // New page type
      images: [],
      caption: '',
      captionStyle: {
        fontSize: selectedFontSize,
        color: selectedFontColor,
        fontFamily: selectedFontFamily,
        position: captionPosition,
        alignment: captionAlignment,
      },
      layout: 'text', // Special layout for text pages
      pageBgColor: '#ffffff', // Default white background
      textContent: '', // The main text content
      textPosition: { x: 50, y: 50 }, // Center position (percentage)
      textRect: { width: 50, height: 30 }, // Rectangle dimensions (percentage)
      textStyle: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Inter',
        textAlign: 'center',
      },
      layoutSplitX: 50,
      layoutSplitY: 50,
    }

    if (typeof insertAtIndex === 'number') {
      const newPages = [...pages]
      newPages.splice(insertAtIndex, 0, newPage)
      setPages(newPages)
      setCurrentPageIdx(insertAtIndex)
    } else {
      setPages([...pages, newPage])
      setCurrentPageIdx(pages.length)
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

  const updatePageLayout = (layoutId, setSelectedLayout) => {
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

  const swapImages = (pageIdx1, imgIdx1, pageIdx2, imgIdx2) => {
    const newPages = [...pages]
    
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

  return {
    addPage,
    addTextPage,
    duplicatePage,
    removePage,
    movePage,
    updatePageLayout,
    applyToAllPages,
    swapImages,
  }
}
