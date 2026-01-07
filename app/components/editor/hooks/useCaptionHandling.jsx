export function useCaptionHandling(
  pages,
  setPages,
  currentPageIdx,
  setSelectedCaption,
  setSelectedFontSize,
  setSelectedFontColor,
  setSelectedFontFamily,
  setCaptionPosition,
  setCaptionAlignment
) {
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

  return {
    updateCaption,
    updateCaptionStyle,
  }
}
