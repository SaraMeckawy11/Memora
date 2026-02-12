import { useState, useEffect } from 'react';
import { convertToBaseCoordinates, scaleElementsToCanvas } from '../utils';
import { COVER_PRESETS } from '../presets';

export function useCanvasState(searchParams, canvasSettings, setCanvasSettings) {
  const [activeSide, setActiveSide] = useState('front');
  const [baseElements, setBaseElements] = useState({
    front: [],
    back: []
  });

  const [history, setHistory] = useState([{ 
    front: { elements: [], backgroundColor: '#ffffff' },
    back: { elements: [], backgroundColor: '#ffffff' }
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex];

  // Load preset data on initial render or preset change - always apply to front cover
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
      
      const scaledFrontElements = scaleElementsToCanvas(frontBaseEls, canvasSettings.width, canvasSettings.height);
      const scaledBackElements = scaleElementsToCanvas(backBaseEls, canvasSettings.width, canvasSettings.height);
      
      const initialState = {
        front: {
          elements: scaledFrontElements,
          backgroundColor: frontPreset.backgroundColor || '#ffffff',
        },
        back: {
          elements: scaledBackElements,
          backgroundColor: backPreset ? backPreset.backgroundColor || '#ffffff' : '#ffffff'
        }
      };

      setBaseElements({
        front: frontBaseEls,
        back: backBaseEls
      });
      
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
  }, [searchParams.get('preset')]);

  // Effect to rescale elements when canvas size changes
  useEffect(() => {
    if (baseElements.front.length > 0 || baseElements.back.length > 0) {
      console.log('🔄 Rescaling', baseElements.front.length, 'front and', baseElements.back.length, 'back elements to', canvasSettings.width, 'x', canvasSettings.height);
      
      const scaledFront = scaleElementsToCanvas(baseElements.front, canvasSettings.width, canvasSettings.height);
      const scaledBack = scaleElementsToCanvas(baseElements.back, canvasSettings.width, canvasSettings.height);
      
      // Use the latest state from history 
      const latestState = history.length > 0 ? history[history.length - 1] : currentState;
      
      const newState = { 
        front: { ...latestState.front, elements: scaledFront },
        back: { ...latestState.back, elements: scaledBack }
      };
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, newState]);
      setHistoryIndex(newHistory.length);
    }
  }, [canvasSettings.width, canvasSettings.height, canvasSettings.orientation]);

  const updateState = (newState, overwrite = false) => {
    const newHistory = overwrite ? [] : history.slice(0, historyIndex + 1);
    const finalHistory = [...newHistory, newState];
    setHistory(finalHistory);
    setHistoryIndex(finalHistory.length - 1);
  };

  const setElements = (updater) => {
    const currentSideElements = currentState[activeSide].elements;
    const newElements = typeof updater === 'function' ? updater(currentSideElements) : updater;
    
    const newState = {
      ...currentState,
      [activeSide]: { ...currentState[activeSide], elements: newElements }
    };
    updateState(newState);
    
    const newBaseElementsForSide = newElements.map(el => 
      convertToBaseCoordinates(el, canvasSettings.width, canvasSettings.height)
    );
    
    setBaseElements(prev => ({
      ...prev,
      [activeSide]: newBaseElementsForSide
    }));
  };

  const setBackgroundColor = (newColor) => {
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

