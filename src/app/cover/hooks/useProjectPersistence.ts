import { useState, useEffect, useCallback, useRef } from 'react';
import { COVER_STORAGE_KEY, COVER_MODE_KEY } from '../coverStorage';

export function useProjectPersistence(currentState, canvasSettings, updateState, setCanvasSettings, mode = null) {
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  // Default to FALSE to prevent overwriting saved data with initial defaults
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
  
  // Ref to debounce auto-saves
  const timeoutRef = useRef(null);
  const firstRender = useRef(true);

  const saveToStorage = useCallback((state, settings) => {
    try {
      setIsAutoSaving(true);
      const projectData = { 
        front: state.front, 
        back: state.back, 
        canvasSettings: settings, 
        version: '1.2',
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(COVER_STORAGE_KEY, JSON.stringify(projectData));
      // Record which editor mode produced this save (written ONLY here so a
      // double-run of the page's init effect can't corrupt the load decision)
      if (mode) localStorage.setItem(COVER_MODE_KEY, mode);
      setLastSaved(new Date());
      setIsAutoSaving(false);
    } catch (error) {
      console.error('Error auto-saving project:', error);
      setIsAutoSaving(false);
    }
  }, [mode]);

  // Auto-save effect
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (isAutoSaveEnabled) {
      setIsAutoSaving(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        saveToStorage(currentState, canvasSettings);
      }, 2000); // 2 second debounce
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentState, canvasSettings, isAutoSaveEnabled, saveToStorage]);

  const handleSaveProject = () => {
    saveToStorage(currentState, canvasSettings);
    alert('Project saved successfully!');
  };

  // Immediate save (no alert) — used before navigating away so a pending
  // 2s-debounced autosave can't be lost
  const flushSave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    saveToStorage(currentState, canvasSettings);
  }, [currentState, canvasSettings, saveToStorage]);

  const handleLoadProject = useCallback(() => {
    try {
      const savedData = localStorage.getItem(COVER_STORAGE_KEY);
      if (savedData) {
        const projectData = JSON.parse(savedData);
        
        // Handle migration from old format
        let loadedState;
        if (projectData.version === '1.2' || projectData.version === '1.1') {
          loadedState = {
            front: projectData.front, 
            back: projectData.back
          };
        } else {
          // Legacy migration
          loadedState = {
            front: {
              elements: projectData.elements || [],
               backgroundColor: projectData.backgroundColor || '#ffffff'
            },
            back: { elements: [], backgroundColor: '#ffffff' }
          };
        }
        
        // We set second param to TRUE to add to history if needed, or FALSE if initial load
        // CRITICAL FIX: Delay the state update slightly to allow canvas resizing/initialization to settle first.
        // This prevents useCanvasState's internal effects (triggered by setCanvasSettings) from overwriting our loaded data.
        setTimeout(() => {
          updateState(loadedState, true); // true = force rewrite/add to history
          console.log("Project state restored.");
        }, 100);

        if (projectData.canvasSettings) {
           setCanvasSettings(projectData.canvasSettings);
        }
        setLastSaved(projectData.updatedAt ? new Date(projectData.updatedAt) : new Date());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading project:', error);
      return false;
    }
  }, [updateState, setCanvasSettings]);

  const handleResetProject = () => {
    if (window.confirm('Are you sure you want to reset your project? This will clear all your work.')) {
      localStorage.removeItem(COVER_STORAGE_KEY);
      
      const emptyState = {
        front: { elements: [], backgroundColor: '#ffffff' },
        back: { elements: [], backgroundColor: '#ffffff' }
      };
      
      // We pass a flag to indicate this is a hard reset if the updateState supports it
      // For now assuming updateState handles resetting correctly
      updateState(emptyState, false); 
      setLastSaved(null);
    }
  };

  return {
    handleSaveProject,
    handleLoadProject,
    handleResetProject,
    flushSave,
    lastSaved,
    isAutoSaving,
    isAutoSaveEnabled,
    setIsAutoSaveEnabled
  };
}
