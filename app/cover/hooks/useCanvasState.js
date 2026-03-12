import { useState, useEffect, useRef } from 'react';
import { convertToBaseCoordinates, scaleElementsToCanvas } from '../utils';
import { COVER_PRESETS } from '../presets';

export function useCanvasState(searchParams, canvasSettings, setCanvasSettings) {
  const [activeSide, setActiveSide] = useState('front');
  
  // Store "base" (normalized) elements
  const [baseElements, setBaseElements] = useState({
    front: [],
    back: []
  });

  // History stores the *rendered* state (in pixels)
  const [history, setHistory] = useState([{ 
    front: { elements: [], backgroundColor: '#ffffff' },
    back: { elements: [], backgroundColor: '#ffffff' }
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Track previous dimensions to trigger resize logic only when needed
  const prevSizeRef = useRef({ width: 0, height: 0 });

  const currentState = history[historyIndex] || { 
    front: { elements: [], backgroundColor: '#ffffff' },
    back: { elements: [], backgroundColor: '#ffffff' }
  };

  const updateState = (newState, overwrite = false) => {
    let newHistory;
    
    if (overwrite === true) {
      // Hard reset (load project) - specific case for project loading
      newHistory = [];
    } else if (overwrite === 'replace') {
      // Replace tip (drag update) - keep previous history but replace current state
      newHistory = history.slice(0, historyIndex);
    } else {
      // Normal push - keep up to current index
      newHistory = history.slice(0, historyIndex + 1);
    }

    const finalHistory = [...newHistory, newState];
    setHistory(finalHistory);
    setHistoryIndex(finalHistory.length - 1);
  };

  // 1. Initial Load / Preset Change
  useEffect(() => {
    const presetId = searchParams.get('preset');
    
    if (presetId && COVER_PRESETS[presetId]) {
       const frontPreset = COVER_PRESETS[presetId];
       const backPresetId = presetId + 'Back';
       const backPreset = COVER_PRESETS[backPresetId];

       const frontBaseEls = frontPreset.elements.map(el => ({
         ...el,
         id: el.id || (Date.now() + Math.random()),
       }));
       const backBaseEls = backPreset ? backPreset.elements.map(el => ({
         ...el,
         id: el.id || (Date.now() + Math.random()),
       })) : [];

       setBaseElements({
         front: frontBaseEls,
         back: backBaseEls
       });

       // Use current settings or default
       const w = canvasSettings?.width || 800;
       const h = canvasSettings?.height || 1000;
       
       // Update ref to avoid immediate re-trigger of resize effect
       prevSizeRef.current = { width: w, height: h };

       const scaledFront = scaleElementsToCanvas(frontBaseEls, w, h);
       const scaledBack = scaleElementsToCanvas(backBaseEls, w, h);
       
       const initialState = {
         front: {
           elements: scaledFront,
           backgroundColor: frontPreset.backgroundColor || '#ffffff',
         },
         back: {
           elements: scaledBack,
           backgroundColor: backPreset ? backPreset.backgroundColor || '#ffffff' : '#ffffff'
         }
       };
       
       setHistory([initialState]);
       setHistoryIndex(0);

       if (frontPreset.backgroundPattern) {
         setCanvasSettings(prev => ({
           ...prev,
           backgroundColor: frontPreset.backgroundColor,
           backgroundPattern: frontPreset.backgroundPattern,
           gridColor: frontPreset.gridColor,
           gridSize: frontPreset.gridSize,
         }));
       }
    }
  }, [searchParams]); // Run when URL search params change (preset selection)

  // 2. Handle Canvas Resize (e.g. Loading from DB)
  useEffect(() => {
    const w = canvasSettings?.width;
    const h = canvasSettings?.height;

    if (!w || !h) return;

    // Only run if dimensions actually changed
    if (w !== prevSizeRef.current.width || h !== prevSizeRef.current.height) {
        prevSizeRef.current = { width: w, height: h };

        // Scale based on BASE elements
        const scaledFront = scaleElementsToCanvas(baseElements.front, w, h);
        const scaledBack = scaleElementsToCanvas(baseElements.back, w, h);

        setHistory(prev => {
            if (!prev.length) return prev;
            const current = prev[historyIndex];
            
            const updatedState = {
                ...current,
                front: { ...current.front, elements: scaledFront },
                back: { ...current.back, elements: scaledBack }
            };
            
            // Replace current history entry
            const newHistory = [...prev];
            newHistory[historyIndex] = updatedState;
            return newHistory;
        });
    }
  }, [canvasSettings?.width, canvasSettings?.height, baseElements, historyIndex]);

  // Actions

  const setElements = (updater, options = {}) => {
    if (!currentState) return;
    
    const currentSideElements = currentState[activeSide].elements;
    const newElements = typeof updater === 'function' ? updater(currentSideElements) : updater;
    
    // Update visible state
    const newState = {
      ...currentState,
      [activeSide]: { ...currentState[activeSide], elements: newElements }
    };

    const historyVal = options.historyMode === 'replace' ? 'replace' : false;
    updateState(newState, historyVal);
    
    // Update base elements (normalized)
    if(canvasSettings?.width && canvasSettings?.height) {
        const newBaseElementsForSide = newElements.map(el => 
            convertToBaseCoordinates(el, canvasSettings.width, canvasSettings.height)
        );
        
        setBaseElements(prev => ({
            ...prev,
            [activeSide]: newBaseElementsForSide
        }));
    }
  };

  const setBackgroundColor = (newColor) => {
    if (!currentState) return;
    const newState = {
      ...currentState,
      [activeSide]: { ...currentState[activeSide], backgroundColor: newColor }
    };
    updateState(newState);
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  return {
    front: currentState.front,
    back: currentState.back,
    activeSide,
    setActiveSide,
    elements: currentState[activeSide].elements,
    backgroundColor: currentState[activeSide].backgroundColor,
    setElements,
    setBackgroundColor,
    handleUndo,
    handleRedo,
    historyIndex,
    historyLength: history.length,
    updateState,
    currentState
  };
}
