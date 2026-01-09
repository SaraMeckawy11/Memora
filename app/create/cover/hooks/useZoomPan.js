import { useState, useEffect } from 'react';

export function useZoomPan(wrapperRef, canvasSettings, searchParams) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAutoFitMode, setIsAutoFitMode] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 });

  const handleZoom = (delta) => {
    setIsAutoFitMode(false);
    setZoomLevel(prevZoom => {
      const newZoom = Math.min(Math.max(prevZoom + delta, 0.2), 3);
      
      if (wrapperRef.current) {
        const wrapper = wrapperRef.current;
        const scale = newZoom / prevZoom;
        const centerX = wrapper.scrollLeft + wrapper.clientWidth / 2;
        const centerY = wrapper.scrollTop + wrapper.clientHeight / 2;
        const newCenterX = centerX * scale;
        const newCenterY = centerY * scale;
        
        setTimeout(() => {
          if (wrapper) {
            wrapper.scrollLeft = newCenterX - wrapper.clientWidth / 2;
            wrapper.scrollTop = newCenterY - wrapper.clientHeight / 2;
          }
        }, 0);
      }
      return newZoom;
    });
  };

  const handleZoomToFit = (isForced = false) => {
    if (typeof window === 'undefined') return;
    if (!isForced && !isAutoFitMode) return;

    if (wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const padding = window.innerWidth < 768 ? 32 : 80;
      const availableWidth = wrapper.clientWidth - padding;
      const availableHeight = wrapper.clientHeight - padding;
      
      if (availableWidth <= 0 || availableHeight <= 0) return;

      const zoomX = availableWidth / canvasSettings.width;
      const zoomY = availableHeight / canvasSettings.height;
      let newZoom = Math.min(zoomX, zoomY);
      
      if (newZoom > 1.5) newZoom = 1.5;
      if (newZoom < 0.1) newZoom = 0.1
      
      setZoomLevel(newZoom);
      
      setTimeout(() => {
        if (wrapper) {
          wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
          wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) / 2;
        }
      }, 50);
    }
  };

  useEffect(() => {
    setIsAutoFitMode(true);
    const timer = setTimeout(() => handleZoomToFit(true), 150);
    return () => clearTimeout(timer);
  }, [canvasSettings.width, canvasSettings.height, searchParams.get('preset')]);

  useEffect(() => {
    const handleResize = () => {
      if (isAutoFitMode) handleZoomToFit(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAutoFitMode, canvasSettings.width, canvasSettings.height]);

  const handleMouseDown = (e, isDrawMode) => {
    if (isDrawMode) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    if (wrapperRef.current) {
      setScrollStart({ 
        left: wrapperRef.current.scrollLeft, 
        top: wrapperRef.current.scrollTop 
      });
    }
  };

  const handleMouseMove = (e, isDrawMode) => {
    if (!isPanning || isDrawMode || !wrapperRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    wrapperRef.current.scrollLeft = scrollStart.left - dx;
    wrapperRef.current.scrollTop = scrollStart.top - dy;
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return {
    zoomLevel,
    setZoomLevel,
    handleZoom,
    handleZoomToFit,
    setIsAutoFitMode,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}
