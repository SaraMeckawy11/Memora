'use client'

import ImageGrid from './ImageGrid'

export default function EditorCanvas({
  canvasRef,
  currentPage,
  currentLayoutObj,
  selectedSizeObj,
  pageBgColor,
  pageMargin,
  pageGutter,
  captionPosition,
  captionAlignment,
  selectedFontSize,
  selectedFontColor,
  selectedFontFamily,
  showPageNumbers,
  currentPageIdx,
  imageGridProps,
}) {
  return (
    <div ref={canvasRef} className="editor-canvas-wrapper">
      <div
        className="editor-page"
        style={{
          aspectRatio: selectedSizeObj?.aspect,
          backgroundColor: pageBgColor,
          padding: pageMargin,
        }}
      >
        {currentPage?.caption && captionPosition === 'top' && (
          <p
            className="editor-caption"
            style={{
              fontSize: selectedFontSize,
              color: selectedFontColor,
              fontFamily: selectedFontFamily,
              textAlign: captionAlignment,
              marginBottom: pageGutter,
            }}
          >
            {currentPage.caption}
          </p>
        )}

        <div className="editor-page-content">
          <ImageGrid {...imageGridProps} />
        </div>

        {currentPage?.caption && captionPosition === 'bottom' && (
          <p
            className="editor-caption"
            style={{
              fontSize: selectedFontSize,
              color: selectedFontColor,
              fontFamily: selectedFontFamily,
              textAlign: captionAlignment,
              marginTop: pageGutter,
            }}
          >
            {currentPage.caption}
          </p>
        )}

        {showPageNumbers && (
          <div className="editor-page-number-indicator">
            {currentPageIdx + 1}
          </div>
        )}
      </div>
    </div>
  )
}
