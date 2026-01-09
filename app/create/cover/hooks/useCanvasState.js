import { useState, useEffect } from 'react';
import { convertToBaseCoordinates, scaleElementsToCanvas } from '../utils';
import { COVER_PRESETS } from '../presets';

export function useCanvasState(searchParams, canvasSettings, setCanvasSettings) {
  const [baseElements, setBaseElements] = useState([]);
  const [history, setHistory] = useState([{ elements: [], backgroundColor: '#ffffff' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex];
  const { elements, backgroundColor } = currentState;

  // Load preset data on initial render or preset change
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId && COVER_PRESETS[presetId]) {
      const preset = COVER_PRESETS[presetId];
      
      const baseEls = preset.elements.map(el => ({
        ...el,
        id: el.id || (Date.now() + Math.random()),
      }));
      setBaseElements(baseEls);
      
      const scaledElements = scaleElementsToCanvas(baseEls, canvasSettings.width, canvasSettings.height);
      
      const initialState = {
        elements: scaledElements,
        backgroundColor: preset.backgroundColor,
      };
      
      setHistory([initialState]);
      setHistoryIndex(0);
      
      if (preset.backgroundPattern) {
        setCanvasSettings(prev => ({
          ...prev,
          backgroundColor: preset.backgroundColor,
          backgroundPattern: preset.backgroundPattern,
          gridColor: preset.gridColor,
          gridSize: preset.gridSize,
        }));
      }
    }
  }, [searchParams.get('preset')]);

  // Effect to rescale elements when canvas size changes
  useEffect(() => {
    if (baseElements.length > 0) {
      const scaledElements = scaleElementsToCanvas(baseElements, canvasSettings.width, canvasSettings.height);
      const newState = { ...currentState, elements: scaledElements };
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
    const newElements = typeof updater === 'function' ? updater(elements) : updater;
    updateState({ ...currentState, elements: newElements });
    
    const newBaseElements = newElements.map(el => 
      convertToBaseCoordinates(el, canvasSettings.width, canvasSettings.height)
    );
    setBaseElements(newBaseElements);
  };

  const setBackgroundColor = (newColor) => {
    updateState({ ...currentState, backgroundColor: newColor });
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  return {
    elements,
    backgroundColor,
    baseElements,
    setElements,
    setBackgroundColor,
    handleUndo,
    handleRedo,
    historyIndex,
    historyLength: history.length,
    currentState
  };
}
