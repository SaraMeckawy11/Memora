'use client'
import React from 'react'

export const DrawingElement = ({ element }) => {
  const viewBoxW = element.originalWidth || element.width
  const viewBoxH = element.originalHeight || element.height
  
  let opacityValue = element.opacity !== undefined ? element.opacity : 100;
  // Handle 0-1 range for drawings
  if (opacityValue <= 1 && opacityValue > 0) {
    opacityValue = opacityValue * 100;
  }

  return (
    <div style={{ width: '100%', height: '100%', opacity: opacityValue / 100 }}>
      {element.path && (
        <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} style={{ overflow: 'visible' }}>
          <path
            d={element.path}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            fill={element.fill || "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  )
}
