'use client'
import React from 'react'

export const TextElement = ({ element, isEditing, onChange, setIsEditing }) => {
  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={element.content}
        onChange={(e) => onChange(element.id, { content: e.target.value })}
        onBlur={() => setIsEditing(false)}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          fontSize: `${element.fontSize}px`,
          color: element.color,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          fontStyle: element.fontStyle,
          textDecoration: element.textDecoration,
          textAlign: element.textAlign,
          letterSpacing: element.letterSpacing,
          width: '100%',
          height: '100%',
          resize: 'none',
          border: 'none',
          background: 'transparent',
          outline: 'none',
          padding: 0,
          margin: 0,
          lineHeight: element.lineHeight || 1.2,
          overflow: 'hidden'
        }}
      />
    )
  }

  return (
    <div style={{
      fontSize: `${element.fontSize}px`,
      color: element.color,
      fontFamily: element.fontFamily,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textDecoration: element.textDecoration,
      textAlign: element.textAlign,
      letterSpacing: element.letterSpacing,
      width: '100%',
      height: '100%',
      whiteSpace: 'pre-wrap',
      lineHeight: element.lineHeight || 1.2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: element.textAlign === 'center' ? 'center' : (element.textAlign === 'right' ? 'flex-end' : 'flex-start'),
      justifyContent: 'center', // Always center vertically within the box
    }}>
      {element.content}
    </div>
  )
}
