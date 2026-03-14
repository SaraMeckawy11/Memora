'use client'
import React from 'react'

export const ShapeElement = ({ element }) => {
  let opacityValue = element.opacity !== undefined ? element.opacity : 100;
  if (opacityValue <= 1 && opacityValue > 0) opacityValue = opacityValue * 100;

  const commonStyle = {
    width: '100%',
    height: '100%',
    opacity: opacityValue / 100,
    mixBlendMode: element.options?.mixBlendMode || 'normal',
  }

  if (element.shapeType === 'line') {
    return (
      <div style={{ ...commonStyle, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', height: `${element.strokeWidth}px`, backgroundColor: element.stroke }} />
      </div>
    )
  }
  
  if (element.shapeType === 'arrow') {
    return (
      <div style={commonStyle}>
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            <marker
              id={`arrowhead-${element.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={element.stroke} />
            </marker>
          </defs>
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            markerEnd={`url(#arrowhead-${element.id})`}
          />
        </svg>
      </div>
    )
  }

  const shapeStyle = {
    ...commonStyle,
    backgroundColor: element.fill || 'transparent',
    border: (element.options?.stroke && !['triangle', 'star'].includes(element.shapeType)) 
      ? `${element.options.strokeWidth || 1}px solid ${element.options.stroke}` 
      : 'none',
    boxSizing: 'border-box',
    clipPath: element.options?.clipPath || 'none',
    filter: element.options?.filter || 'none',
    borderRadius: element.options?.borderRadius || 0,
  }

  if (element.shapeType === 'circle') {
    shapeStyle.borderRadius = '50%'
  } 
  
  // Use SVG for Triangle and Star to support strokes correctly without clipping
  if (element.shapeType === 'triangle') {
    const w = element.width || 100
    const h = element.height || 100
    const points = `${w/2},0 0,${h} ${w},${h}`
    
    return (
      <div style={commonStyle}>
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          <polygon 
            points={points}
            fill={element.fill || 'transparent'}
            stroke={element.options?.stroke || 'transparent'}
            strokeWidth={element.options?.strokeWidth || 0}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  } 
  
  if (element.shapeType === 'star') {
    const w = element.width || 100
    const h = element.height || 100
    // Points: 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
    const points = [
      [0.5, 0], [0.61, 0.35], [0.98, 0.35], [0.68, 0.57], [0.79, 0.91],
      [0.5, 0.70], [0.21, 0.91], [0.32, 0.57], [0.02, 0.35], [0.39, 0.35]
    ].map(p => `${p[0] * w},${p[1] * h}`).join(' ')

    return (
      <div style={commonStyle}>
          <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          <polygon 
            points={points}
            fill={element.fill || 'transparent'}
            stroke={element.options?.stroke || 'transparent'}
            strokeWidth={element.options?.strokeWidth || 0}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  return <div style={shapeStyle} />
}
