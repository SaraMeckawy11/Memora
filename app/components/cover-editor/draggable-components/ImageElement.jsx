'use client'
import React from 'react'

export const ImageElement = ({ element }) => {
  // Exposure: Primary brightness control (like camera exposure)
  const exposure = element.exposure !== undefined ? element.exposure : 100;
  
  // Highlights: Brightens bright areas (like adjustment layer)
  const highlights = element.highlights !== undefined ? element.highlights : 100;
  
  // Shadows: Brightens dark areas (lifts shadows)
  const shadows = element.shadows !== undefined ? element.shadows : 100;
  
  // Brightness: Base brightness level
  const baseBrightness = element.brightness !== undefined ? element.brightness : 100;
  
  // Combine: Exposure primary, brightness secondary
  const finalBrightness = (exposure + baseBrightness) / 2;
  
  // Contrast: Primary contrast control
  const baseContrast = element.contrast !== undefined ? element.contrast : 100;
  
  // Brilliance: Adds to contrast (increases midtone contrast)
  const brilliance = element.brilliance !== undefined ? element.brilliance : 100;
  const finalContrast = (baseContrast + brilliance) / 2;
  
  // Black Point: Darkens shadows independently (adjusts black levels)
  const blackpoint = element.blackpoint !== undefined ? element.blackpoint : 100;
  
  // Combine saturation properties
  const baseSaturate = element.saturate !== undefined ? element.saturate : 100;
  const vibrance = element.vibrance !== undefined ? element.vibrance : 100;
  const finalSaturate = (baseSaturate + vibrance) / 2;
  
  // Warmth affects sepia
  const warmth = element.warmth !== undefined ? element.warmth : 0;
  
  // Definition enhances sharpness
  const baseSharpness = element.sharpness !== undefined ? element.sharpness : 0;
  const definition = element.definition !== undefined ? element.definition : 0;
  const finalSharpness = Math.max(baseSharpness, definition);
  
  // Build filter string with all independent properties
  // Exposure affects overall brightness, Highlights/Shadows affect tone curve
  let filterString = `brightness(${finalBrightness}%) contrast(${finalContrast}%) saturate(${finalSaturate}%) hue-rotate(${element.hueRotate || 0}deg) blur(${element.blur || 0}px)`;
  
  // Add highlights effect (increases brightness of bright areas via higher contrast)
  if (highlights !== 100) {
    filterString += ` brightness(${100 + (highlights - 100) * 0.3}%)`;
  }
  
  // Add shadows effect (lifts dark areas)
  if (shadows !== 100) {
    filterString += ` brightness(${100 + (shadows - 100) * 0.2}%)`;
  }
  
  // Add black point effect (darkens the blacks)
  if (blackpoint !== 100) {
    filterString += ` contrast(${100 + (blackpoint - 100) * 0.4}%)`;
  }
  
  // Add other effects
  filterString += ` sepia(${warmth}%) grayscale(${element.grayscale || 0}%) invert(${element.invert || 0}%)`;
  
  const sharpnessId = `sharpness-${element.id}`
  const isPolaroid = element.options?.isPolaroid;
  const polaroidPadding = element.options?.polaroidPadding || 12;
  const hasTape = element.options?.hasTape;

  // Handle opacity normalization (0-1 or 0-100)
  let opacityValue = element.opacity !== undefined ? element.opacity : 100;
  if (opacityValue <= 1 && opacityValue > 0 && element.type === 'drawing') {
    // Drawing often uses 0-1
    opacityValue = opacityValue * 100;
  }

  const imageContent = (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={sharpnessId}>
            {finalSharpness > 0 ? (
              <feConvolveMatrix 
                order="3" 
                kernelMatrix={`0 -${finalSharpness/100} 0 -${finalSharpness/100} ${1 + 4*(finalSharpness/100)} -${finalSharpness/100} 0 -${finalSharpness/100} 0`} 
              />
            ) : (
              <feColorMatrix type="identity"/>
            )}
          </filter>
        </defs>
      </svg>

      <img 
        src={element.src} 
        alt="Image" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          pointerEvents: 'none',
          filter: `${filterString} url(#${sharpnessId})`
        }} 
      />
      
      {warmth !== 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none',
          backgroundColor: warmth > 0 ? '#ff9a00' : '#009aff',
          opacity: Math.abs(warmth) / 200,
          mixBlendMode: warmth > 0 ? 'soft-light' : 'overlay'
        }} />
      )}

      {element.vignette > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none',
          background: `radial-gradient(circle, transparent ${100 - element.vignette}%, rgba(0,0,0,${element.vignette / 100}) 100%)`
        }} />
      )}

      {element.noise > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none',
          opacity: element.noise / 100,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }} />
      )}
    </>
  );

  if (isPolaroid) {
    return (
      <div style={{ 
        width: '100%', height: '100%', position: 'relative',
        backgroundColor: '#ffffff',
        padding: `${polaroidPadding}px ${polaroidPadding}px ${polaroidPadding * 3}px ${polaroidPadding}px`,
        boxSizing: 'border-box',
        boxShadow: '2px 4px 10px rgba(0,0,0,0.2)',
        opacity: opacityValue / 100,
      }}>
        {hasTape && (
          <div style={{
            position: 'absolute', top: '-10px', left: '50%', width: '30%', height: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            transform: 'translateX(-50%) rotate(2deg)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            zIndex: 25,
          }} />
        )}
        {imageContent}
      </div>
    )
  }

  return (
    <div style={{ 
      width: '100%', height: '100%', position: 'relative',
      clipPath: element.options?.clipPath || 'none',
      mixBlendMode: element.options?.mixBlendMode || 'normal',
      opacity: opacityValue / 100,
    }}>
      {imageContent}
    </div>
  )
}
