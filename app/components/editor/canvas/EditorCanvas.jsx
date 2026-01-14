'use client'

import { useState, useRef } from 'react'
import '@/styles/editor/canvas.css'
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
  onUpdateTextPosition,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const textRef = useRef(null)


  // --- Drag logic for text page ---
  const handleMouseDown = (e) => {
    if (currentPage?.type !== 'text') return;
    setIsDragging(true);
    // Store the offset between mouse and text center relative to page content area
    const pageElement = textRef.current?.closest('.editor-page');
    const pageRect = pageElement?.getBoundingClientRect();
    const textRect = textRef.current?.getBoundingClientRect();
    if (pageRect && textRect) {
      const textCenterX = textRect.left + textRect.width / 2;
      const textCenterY = textRect.top + textRect.height / 2;
      setDragStart({
        offsetX: e.clientX - textCenterX,
        offsetY: e.clientY - textCenterY,
      });
    } else {
      setDragStart({ offsetX: 0, offsetY: 0 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || currentPage?.type !== 'text' || !onUpdateTextPosition) return;
    // Use the editor-page as the reference for positioning
    const pageElement = textRef.current?.closest('.editor-page');
    const pageRect = pageElement?.getBoundingClientRect();
    const textRect = textRef.current?.getBoundingClientRect();
    if (!pageRect || !textRect) return;

    // Mouse position relative to page (accounting for padding)
    let mouseX = e.clientX - pageRect.left - pageMargin - (dragStart.offsetX || 0);
    let mouseY = e.clientY - pageRect.top - pageMargin - (dragStart.offsetY || 0);

    // Convert to percent of content area (page minus padding)
    const contentWidth = pageRect.width - (pageMargin * 2);
    const contentHeight = pageRect.height - (pageMargin * 2);
    let percentX = (mouseX / contentWidth) * 100;
    let percentY = (mouseY / contentHeight) * 100;

    // Clamp so text stays fully visible within content area
    const textW = textRect.width;
    const textH = textRect.height;
    const minX = (textW / 2) / contentWidth * 100;
    const maxX = 100 - minX;
    const minY = (textH / 2) / contentHeight * 100;
    const maxY = 100 - minY;
    percentX = Math.max(minX, Math.min(maxX, percentX));
    percentY = Math.max(minY, Math.min(maxY, percentY));

    onUpdateTextPosition({ x: percentX, y: percentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={canvasRef}
      className="editor-canvas-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`editor-page ${isDragging ? 'dragging-text' : ''} ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 50) < 5 ? 'show-vertical-center' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 50) < 5 ? 'show-horizontal-center' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 25) < 5 ? 'show-vertical-left' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 75) < 5 ? 'show-vertical-right' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 25) < 5 ? 'show-horizontal-top' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 75) < 5 ? 'show-horizontal-bottom' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.x || 50) - 50) < 2 ? 'snap-vertical-center' : ''
        } ${
          currentPage?.type === 'text' && 
          Math.abs((currentPage.textPosition?.y || 50) - 50) < 2 ? 'snap-horizontal-center' : ''
        }`}
        style={{
          aspectRatio: selectedSizeObj?.aspect,
          backgroundColor: currentPage?.type === 'text' ? (currentPage.pageBgColor || '#ffffff') : pageBgColor,
          padding: pageMargin,
        }}
      >
        {/* Visual guidelines for text positioning */}
        {currentPage?.type === 'text' && (
          <>
            <div className="editor-page-guidelines">
              <div className="quarter-line"></div>
              <div className="quarter-line"></div>
              <div className="quarter-line"></div>
              <div className="quarter-line"></div>
            </div>
            <div className="editor-page-grid"></div>
          </>
        )}
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
          {currentPage?.type === 'text' ? (
            <div className="text-page-content">
              {currentPage?.textContent && (
                <div
                  ref={textRef}
                  className="text-page-text"
                  style={{
                    position: 'absolute',
                    left: `${currentPage.textPosition?.x || 50}%`,
                    top: `${currentPage.textPosition?.y || 50}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: currentPage.textStyle?.fontSize || 24,
                    color: currentPage.textStyle?.color || '#000000',
                    fontFamily: currentPage.textStyle?.fontFamily || 'Inter',
                    whiteSpace: 'pre-wrap',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    transition: isDragging ? 'none' : 'left 0.1s ease, top 0.1s ease',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {currentPage.textContent}
                </div>
              )}
            </div>
          ) : (
            <ImageGrid {...imageGridProps} />
          )}
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
      </div>
    </div>
  )
}
