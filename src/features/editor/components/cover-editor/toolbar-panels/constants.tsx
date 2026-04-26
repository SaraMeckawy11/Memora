import React from 'react'

export const PRESET_COLORS = [
  '#ffffff', '#000000', '#9ca3af', '#64748b', '#ef4444', '#f97316', 
  '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#d946ef', '#f43f5e'
];

export const FILTERS = [
  { name: 'None', settings: { brightness: 100, contrast: 100, saturate: 100, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: 0, vignette: 0, noise: 0, sharpness: 0 } },
  { name: 'Vivid', settings: { brightness: 110, contrast: 120, saturate: 130, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: 0, vignette: 10, noise: 0, sharpness: 20 } },
  { name: 'Warm', settings: { brightness: 105, contrast: 100, saturate: 110, sepia: 30, grayscale: 0, hueRotate: 0, blur: 0, temperature: 20, vignette: 0, noise: 0, sharpness: 0 } },
  { name: 'Cool', settings: { brightness: 100, contrast: 100, saturate: 90, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: -20, vignette: 0, noise: 0, sharpness: 0 } },
  { name: 'Dramatic', settings: { brightness: 90, contrast: 140, saturate: 90, sepia: 0, grayscale: 0, hueRotate: 0, blur: 0, temperature: 0, vignette: 40, noise: 10, sharpness: 30 } },
  { name: 'Mono', settings: { brightness: 100, contrast: 120, saturate: 0, sepia: 0, grayscale: 100, hueRotate: 0, blur: 0, temperature: 0, vignette: 20, noise: 20, sharpness: 10 } },
  { name: 'Noir', settings: { brightness: 90, contrast: 150, saturate: 0, sepia: 0, grayscale: 100, hueRotate: 0, blur: 0, temperature: 0, vignette: 60, noise: 30, sharpness: 0 } },
  { name: 'Silvertone', settings: { brightness: 110, contrast: 90, saturate: 0, sepia: 10, grayscale: 100, hueRotate: 0, blur: 0, temperature: 0, vignette: 0, noise: 0, sharpness: 0 } },
]

export const IMAGE_TOOLS = [
  { id: 'exposure', label: 'Exposure', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>, prop: 'exposure', min: 50, max: 150, default: 100 },
  { id: 'contrast', label: 'Contrast', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></svg>, prop: 'contrast', min: 50, max: 150, default: 100 },
  { id: 'saturation', label: 'Saturation', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.24 9.24a6 6 0 0 0-8.49-8.49L5 8.5a6 6 0 0 0 8.49 8.49l6.75-7.75z"/></svg>, prop: 'saturate', min: 0, max: 200, default: 100 },
  { id: 'brightness', label: 'Brightness', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M17.6 17.6l1.4 1.4M5 5l1.4 1.4M17.6 6.4l1.4-1.4M5 19l1.4-1.4"/></svg>, prop: 'brightness', min: 50, max: 150, default: 100 },
  { id: 'vignette', label: 'Vignette', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="9"/><circle cx="12" cy="12" r="4"/></svg>, prop: 'vignette', min: 0, max: 100, default: 0 },
  { id: 'blur', label: 'Blur', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, prop: 'blur', min: 0, max: 20, default: 0 },
  { id: 'sepia', label: 'Sepia', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, prop: 'sepia', min: 0, max: 100, default: 0 },
  { id: 'opacity', label: 'Opacity', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, prop: 'opacity', min: 0, max: 100, default: 100 },
  { id: 'hue', label: 'Hue', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>, prop: 'hueRotate', min: 0, max: 360, default: 0 },
]

export const FONT_SIZES = [8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 150, 200];
