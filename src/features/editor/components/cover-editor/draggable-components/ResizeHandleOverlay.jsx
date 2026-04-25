'use client'
import React from 'react'

export const ResizeHandleOverlay = ({ isSelected, isEditing, onDelete, onResizeStart }) => {
  if (!isSelected || isEditing) return null;

  return (
    <>
      {/* Delete Button (Top Right) */}
      <div 
        className="element-delete-btn"
        onClick={(e) => {
          e.stopPropagation()
          onDelete && onDelete()
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          onDelete && onDelete()
        }}
        title="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>

      <div className="resize-handle nw" onMouseDown={(e) => onResizeStart(e, 'nw')} onTouchStart={(e) => onResizeStart(e, 'nw')} />
      <div className="resize-handle n" onMouseDown={(e) => onResizeStart(e, 'n')} onTouchStart={(e) => onResizeStart(e, 'n')} />
      <div className="resize-handle ne" onMouseDown={(e) => onResizeStart(e, 'ne')} onTouchStart={(e) => onResizeStart(e, 'ne')} />
      <div className="resize-handle w" onMouseDown={(e) => onResizeStart(e, 'w')} onTouchStart={(e) => onResizeStart(e, 'w')} />
      <div className="resize-handle e" onMouseDown={(e) => onResizeStart(e, 'e')} onTouchStart={(e) => onResizeStart(e, 'e')} />
      <div className="resize-handle sw" onMouseDown={(e) => onResizeStart(e, 'sw')} onTouchStart={(e) => onResizeStart(e, 'sw')} />
      <div className="resize-handle s" onMouseDown={(e) => onResizeStart(e, 's')} onTouchStart={(e) => onResizeStart(e, 's')} />
      <div className="resize-handle se" onMouseDown={(e) => onResizeStart(e, 'se')} onTouchStart={(e) => onResizeStart(e, 'se')} />
    </>
  )
}
