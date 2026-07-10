'use client'
import React, { useRef, useState, useEffect } from 'react'

export default function PresetPreview({ preset, width, height }: { preset: any; width?: number; height?: number }) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(0.1) // Lower default to prevent large flash before mount

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width: currentWidth } = containerRef.current.getBoundingClientRect()
        const baseWidth = 893
        setScale(currentWidth / baseWidth)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [width, height]) // Recalculate if dimensions change

  if (!preset) return null

  const backgroundColor = preset.backgroundColor || '#ffffff'
  const elements = preset.elements || []

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: backgroundColor,
        position: 'relative',
        overflow: 'hidden',
        transform: 'translateZ(0)'
      }}
    >
      {elements.map((el, elIdx) => {
        // Some preset data ships duplicate element ids -- key by id + index
        const elKey = `${el.id}-${elIdx}`
        const style = {
          position: 'absolute',
          left: el.x * scale,
          top: el.y * scale,
          width: el.width * scale,
          height: el.height * scale,
          transform: `rotate(${el.rotation || 0}deg) scaleX(${el.scaleX || 1}) scaleY(${el.scaleY || 1})`,
          zIndex: el.zIndex || 0,
          opacity: (el.opacity !== undefined ? el.opacity : 100) / 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none' as const,
        } as React.CSSProperties

        if (el.type === 'text') {
          return (
            <div key={elKey} style={{
              ...style,
              color: el.color || '#000',
              fontSize: (el.fontSize || 16) * scale,
              fontFamily: el.fontFamily || 'serif',
              textAlign: (el.textAlign || 'left') as any,
              fontWeight: el.fontWeight || 'normal',
              fontStyle: el.fontStyle || 'normal',
              letterSpacing: el.letterSpacing,
              lineHeight: el.lineHeight || 1.2,
              whiteSpace: 'pre-wrap',
            }}>
              {el.content}
            </div>
          )
        }

        if (el.type === 'image') {
          return (
            <div key={elKey} style={style}>
              <img 
                src={el.src} 
                alt="" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: el.options?.objectFit || 'cover',
                  borderRadius: (el.options?.borderRadius || 0) * scale,
                  filter: el.options?.filter || 'none',
                }} 
              />
            </div>
          )
        }

        if (el.type === 'shape') {
          const shapeStyle = {
            ...style,
            backgroundColor: el.fill || 'transparent',
            border: el.options?.stroke ? `${(el.options.strokeWidth || 1) * scale}px solid ${el.options.stroke}` : 'none',
            borderRadius: (el.options?.borderRadius || 0) * scale,
            clipPath: el.options?.clipPath || 'none',
          }
          if (el.shapeType === 'circle') (shapeStyle as any).borderRadius = '50%'
          if (el.shapeType === 'triangle') (shapeStyle as any).clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
          
          return <div key={elKey} style={shapeStyle as React.CSSProperties} />
        }

        if (el.type === 'drawing') {
          const viewBoxW = el.originalWidth || el.width
          const viewBoxH = el.originalHeight || el.height
          return (
            <div key={elKey} style={style}>
              <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} style={{ overflow: 'visible' }}>
                <path
                  d={el.path}
                  stroke={el.stroke}
                  strokeWidth={el.strokeWidth}
                  fill={el.fill || "none"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
