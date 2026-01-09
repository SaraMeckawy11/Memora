// Base size for all presets (matches A4 Portrait at 1.5x scale from EditorSidebar)
export const PRESET_BASE_SIZE = { width: 893, height: 1263 };

/**
 * Scales elements from base size to target canvas size
 */
export const scaleElementsToCanvas = (baseEls, targetWidth, targetHeight) => {
  const scaleX = targetWidth / PRESET_BASE_SIZE.width;
  const scaleY = targetHeight / PRESET_BASE_SIZE.height;
  const scale = Math.min(scaleX, scaleY);
  
  return baseEls.map(el => ({
    ...el,
    x: Math.round(el.x * scaleX),
    y: Math.round(el.y * scaleY),
    width: Math.round(el.width * scaleX),
    height: Math.round(el.height * scaleY),
    fontSize: el.fontSize ? Math.round(el.fontSize * scale) : el.fontSize,
  }));
};

/**
 * Converts current canvas coordinates back to base coordinates
 */
export const convertToBaseCoordinates = (el, canvasWidth, canvasHeight) => {
  const scaleX = PRESET_BASE_SIZE.width / canvasWidth;
  const scaleY = PRESET_BASE_SIZE.height / canvasHeight;
  
  return {
    ...el,
    x: Math.round(el.x * scaleX),
    y: Math.round(el.y * scaleY),
    width: Math.round(el.width * scaleX),
    height: Math.round(el.height * scaleY),
    fontSize: el.fontSize ? Math.round(el.fontSize / Math.min(canvasWidth / PRESET_BASE_SIZE.width, canvasHeight / PRESET_BASE_SIZE.height)) : el.fontSize,
  };
};
