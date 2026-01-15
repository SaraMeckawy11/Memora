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
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isTextSelected, setIsTextSelected] = useState(false)
  const textRef = useRef(null)
  const rectRef = useRef(null)


  // --- Drag and resize logic for text rectangle ---
  const handleMouseDown = (e) => {
    if (currentPage?.type !== 'text') return;
    setIsDragging(true);
    setIsTextSelected(true);
    // Store the offset between mouse and rectangle center relative to page content area
    const pageElement = rectRef.current?.closest('.editor-page');
    const pageRect = pageElement?.getBoundingClientRect();
    const rectElement = rectRef.current?.getBoundingClientRect();
    if (pageRect && rectElement) {
      const rectCenterX = rectElement.left + rectElement.width / 2;
      const rectCenterY = rectElement.top + rectElement.height / 2;
      setDragStart({
        offsetX: e.clientX - rectCenterX,
        offsetY: e.clientY - rectCenterY,
      });
    } else {
      setDragStart({ offsetX: 0, offsetY: 0 });
    }
  };

  const handleTouchStart = (e) => {
    if (currentPage?.type !== 'text') return;
    e.preventDefault(); // Prevent default touch behavior
    setIsDragging(true);
    setIsTextSelected(true);
    const touch = e.touches[0];
    // Store the offset between touch and rectangle center relative to page content area
    const pageElement = rectRef.current?.closest('.editor-page');
    const pageRect = pageElement?.getBoundingClientRect();
    const rectElement = rectRef.current?.getBoundingClientRect();
    if (pageRect && rectElement) {
      const rectCenterX = rectElement.left + rectElement.width / 2;
      const rectCenterY = rectElement.top + rectElement.height / 2;
      setDragStart({
        offsetX: touch.clientX - rectCenterX,
        offsetY: touch.clientY - rectCenterY,
      });
    } else {
      setDragStart({ offsetX: 0, offsetY: 0 });
    }
  };

  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeTouchStart = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleMouseMove = (e) => {
    if (isResizing && currentPage?.type === 'text' && onUpdateTextPosition) {
      handleResize(e);
    } else if (isDragging && currentPage?.type === 'text' && onUpdateTextPosition) {
      handleDrag(e);
    }
  };

  const handleTouchMove = (e) => {
    if (isResizing && currentPage?.type === 'text' && onUpdateTextPosition) {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      handleResize({ clientX: touch.clientX, clientY: touch.clientY });
    } else if (isDragging && currentPage?.type === 'text' && onUpdateTextPosition) {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      handleDrag({ clientX: touch.clientX, clientY: touch.clientY });
    }
  };

  const handleDrag = (e) => {
    // Use the editor-page as the reference for positioning
    const pageElement = rectRef.current?.closest('.editor-page');
    const pageRect = pageElement?.getBoundingClientRect();
    const rectElement = rectRef.current?.getBoundingClientRect();
    if (!pageRect || !rectElement) return;

    // Mouse position relative to page (accounting for padding)
    let mouseX = e.clientX - pageRect.left - pageMargin - (dragStart.offsetX || 0);
    let mouseY = e.clientY - pageRect.top - pageMargin - (dragStart.offsetY || 0);

    // Convert to percent of content area (page minus padding)
    const contentWidth = pageRect.width - (pageMargin * 2);
    const contentHeight = pageRect.height - (pageMargin * 2);
    let percentX = (mouseX / contentWidth) * 100;
    let percentY = (mouseY / contentHeight) * 100;

    // Get current rectangle dimensions
    const rectWidth = currentPage.textRect?.width || 50;
    const rectHeight = currentPage.textRect?.height || 30;

    // Clamp so rectangle stays fully visible within content area
    const minX = (rectWidth / 2) / contentWidth * 100;
    const maxX = 100 - minX;
    const minY = (rectHeight / 2) / contentHeight * 100;
    const maxY = 100 - minY;
    percentX = Math.max(minX, Math.min(maxX, percentX));
    percentY = Math.max(minY, Math.min(maxY, percentY));

    onUpdateTextPosition({ x: percentX, y: percentY });
  };

  const handleResize = (e) => {
    const pageElement = rectRef.current?.closest('.editor-page');
    const pageRect = pageElement?.getBoundingClientRect();
    if (!pageRect) return;

    const contentWidth = pageRect.width - (pageMargin * 2);
    const contentHeight = pageRect.height - (pageMargin * 2);

    const deltaX = (e.clientX - dragStart.x) / 32; // Divide by 16 for slower, more controlled resize
    const deltaY = (e.clientY - dragStart.y) / 32; // Divide by 16 for slower, more controlled resize

    let newWidth = currentPage.textRect?.width || 50;
    let newHeight = currentPage.textRect?.height || 30;
    let newX = currentPage.textPosition?.x || 50;
    let newY = currentPage.textPosition?.y || 50;

    // Calculate new dimensions first
    switch (resizeHandle) {
      case 'nw':
        newWidth = Math.max(20, newWidth - deltaX / contentWidth * 100);
        newHeight = Math.max(15, newHeight - deltaY / contentHeight * 100);
        break;
      case 'n':
        newHeight = Math.max(15, newHeight - deltaY / contentHeight * 100);
        break;
      case 'ne':
        newWidth = Math.max(20, newWidth + deltaX / contentWidth * 100);
        newHeight = Math.max(15, newHeight - deltaY / contentHeight * 100);
        break;
      case 'w':
        newWidth = Math.max(20, newWidth - deltaX / contentWidth * 100);
        break;
      case 'e':
        newWidth = Math.max(20, newWidth + deltaX / contentWidth * 100);
        break;
      case 'sw':
        newWidth = Math.max(20, newWidth - deltaX / contentWidth * 100);
        newHeight = Math.max(15, newHeight + deltaY / contentHeight * 100);
        break;
      case 's':
        newHeight = Math.max(15, newHeight + deltaY / contentHeight * 100);
        break;
      case 'se':
        newWidth = Math.max(20, newWidth + deltaX / contentWidth * 100);
        newHeight = Math.max(15, newHeight + deltaY / contentHeight * 100);
        break;
    }

    // Clamp dimensions
    newWidth = Math.min(100, Math.max(20, newWidth));
    newHeight = Math.min(100, Math.max(15, newHeight));

    // Adjust position to anchor resize from edges/corners
    const oldWidth = currentPage.textRect?.width || 50;
    const oldHeight = currentPage.textRect?.height || 30;
    const widthDelta = newWidth - oldWidth;
    const heightDelta = newHeight - oldHeight;

    switch (resizeHandle) {
      case 'nw':
        // Anchor southeast corner - move northwest
        newX -= widthDelta / 2;
        newY -= heightDelta / 2;
        break;
      case 'n':
        // Anchor south edge - move north
        newY -= heightDelta / 2;
        break;
      case 'ne':
        // Anchor southwest corner - move northeast
        newX += widthDelta / 2;
        newY -= heightDelta / 2;
        break;
      case 'w':
        // Anchor east edge - move west
        newX -= widthDelta / 2;
        break;
      case 'e':
        // Anchor west edge - move east
        newX += widthDelta / 2;
        break;
      case 'sw':
        // Anchor northeast corner - move southwest
        newX -= widthDelta / 2;
        newY += heightDelta / 2;
        break;
      case 's':
        // Anchor north edge - move south
        newY += heightDelta / 2;
        break;
      case 'se':
        // Anchor northwest corner - move southeast
        newX += widthDelta / 2;
        newY += heightDelta / 2;
        break;
    }

    // Clamp position to keep rectangle within bounds
    const minX = newWidth / 2;
    const maxX = 100 - newWidth / 2;
    const minY = newHeight / 2;
    const maxY = 100 - newHeight / 2;
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    onUpdateTextPosition({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
  };

  const handleMouseEnter = () => {
    if (currentPage?.type === 'text') {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (currentPage?.type === 'text') {
      setIsHovering(false);
    }
  };

  const handleCanvasClick = (e) => {
    // If clicking on the canvas wrapper (not on the text rectangle), deselect text
    if (e.target === e.currentTarget || e.target.classList.contains('editor-page')) {
      setIsTextSelected(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  return (
    <div
      ref={canvasRef}
      className="editor-canvas-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
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
              {/* Resizable Text Rectangle */}
              <div
                ref={rectRef}
                className={`text-rectangle ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${isTextSelected ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${currentPage.textPosition?.x || 50}%`,
                  top: `${currentPage.textPosition?.y || 50}%`,
                  width: `${currentPage.textRect?.width || 50}%`,
                  height: `${currentPage.textRect?.height || 30}%`,
                  transform: 'translate(-50%, -50%)',
                  border: (isDragging || isResizing || isHovering || isTextSelected) ? '2px dashed #007bff' : 'none',
                  backgroundColor: (isDragging || isResizing || isHovering || isTextSelected) ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Resize handles - show when selected, interacting, or hovering */}
                {(isDragging || isResizing || isHovering || isTextSelected) && (
                  <>
                    <div 
                      className="resize-handle nw" 
                      onMouseDown={(e) => handleResizeStart(e, 'nw')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'nw')}
                    />
                    <div 
                      className="resize-handle n" 
                      onMouseDown={(e) => handleResizeStart(e, 'n')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'n')}
                    />
                    <div 
                      className="resize-handle ne" 
                      onMouseDown={(e) => handleResizeStart(e, 'ne')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'ne')}
                    />
                    <div 
                      className="resize-handle w" 
                      onMouseDown={(e) => handleResizeStart(e, 'w')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'w')}
                    />
                    <div 
                      className="resize-handle e" 
                      onMouseDown={(e) => handleResizeStart(e, 'e')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'e')}
                    />
                    <div 
                      className="resize-handle sw" 
                      onMouseDown={(e) => handleResizeStart(e, 'sw')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'sw')}
                    />
                    <div 
                      className="resize-handle s" 
                      onMouseDown={(e) => handleResizeStart(e, 's')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 's')}
                    />
                    <div 
                      className="resize-handle se" 
                      onMouseDown={(e) => handleResizeStart(e, 'se')} 
                      onTouchStart={(e) => handleResizeTouchStart(e, 'se')}
                    />
                  </>
                )}

                {/* Text content inside rectangle */}
                {currentPage?.textContent && (
                  <div
                    ref={textRef}
                    className="text-rectangle-content"
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      fontSize: currentPage.textStyle?.fontSize || 24,
                      color: currentPage.textStyle?.color || '#000000',
                      fontFamily: currentPage.textStyle?.fontFamily || 'Inter',
                      textAlign: currentPage.textStyle?.textAlign || 'left',
                      whiteSpace: 'pre-wrap',
                      userSelect: 'none',
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '10px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {currentPage.textContent}
                  </div>
                )}
              </div>
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
