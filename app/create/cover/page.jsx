'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import EditorSidebar from '@/app/components/cover-editor/EditorSidebar'
import EditorCanvas from '@/app/components/cover-editor/EditorCanvas'
import EditorToolbar from '@/app/components/cover-editor/EditorToolbar'
import FontLoader from '@/app/components/cover-editor/FontLoader'
import '@/styles/cover-editor/layout.css'

const COVER_PRESETS = {
  travel: {
    backgroundColor: '#fdfbf7',
    elements: [
      // --- IMAGES (Polaroids) ---
      {
        id: 'polaroid1', type: 'image', x: 50, y: 250, width: 140, height: 170,
        src: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=300&q=80',
        rotation: -5, zIndex: 12,
        // Custom styling to mimic polaroid
        options: {
          isPolaroid: true,
          polaroidPadding: 10,
          polaroidCaption: '',
          filter: 'sepia(20%) contrast(110%)',
        }
      },
      {
        id: 'polaroid2', type: 'image', x: 275, y: 290, width: 150, height: 180,
        src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80',
        rotation: 8, zIndex: 13,
        options: { isPolaroid: true, polaroidPadding: 10, filter: 'sepia(20%) contrast(110%)' }
      },
      {
        id: 'polaroid3', type: 'image', x: 150, y: 410, width: 160, height: 190,
        src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80',
        rotation: -3, zIndex: 14,
        options: { isPolaroid: true, polaroidPadding: 10, filter: 'sepia(20%) contrast(110%)' }
      },

      // --- DECORATIVE ELEMENTS (as images) ---
      {
        id: 'map', type: 'image', x: 380, y: 0, width: 120, height: 120,
        src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80',
        rotation: 0, zIndex: 11,
        options: {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 20% 90%, 0 60%)',
          opacity: 0.9,
        }
      },
      {
        id: 'airplane', type: 'image', x: 30, y: 40, width: 120, height: 120,
        src: 'https://cdn-icons-png.flaticon.com/512/723/723955.png',
        rotation: -15, zIndex: 20,
        options: { opacity: 0.8, filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))' }
      },
      {
        id: 'building', type: 'image', x: 20, y: 860, width: 120, height: 120,
        src: 'https://images.unsplash.com/photo-1555663731-893323719d8c?auto=format&fit=crop&w=200&q=80',
        rotation: 0, zIndex: 15,
        options: {
          clipPath: 'polygon(10% 0, 90% 10%, 100% 100%, 0 100%)',
          mixBlendMode: 'multiply',
          opacity: 0.9,
        }
      },
      {
        id: 'statue', type: 'image', x: 360, y: 860, width: 120, height: 120,
        src: 'https://images.unsplash.com/photo-1543864032-132d78d2b77a?auto=format&fit=crop&w=200&q=80',
        rotation: 0, zIndex: 15,
        options: {
          clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)',
          mixBlendMode: 'multiply',
          opacity: 0.9,
        }
      },

      // --- TEXT ELEMENTS ---
      {
        id: 'title', type: 'text', x: 40, y: 150, width: 420, height: 100,
        text: 'The Ultimate Travel Journal',
        rotation: -2, zIndex: 15,
        color: '#2a2a72', fontSize: 56, fontFamily: 'Permanent Marker', fontWeight: '400', textAlign: 'center', lineHeight: 0.9,
        textTransform: 'uppercase',
      },
      {
        id: 'author', type: 'text', x: 0, y: 750, width: 500, height: 100,
        text: 'Reese Miller',
        rotation: -5, zIndex: 20,
        color: '#2a2a72', fontSize: 64, fontFamily: 'Sacramento', fontWeight: '400', textAlign: 'center',
      },
      
      // --- BACKGROUND ELEMENTS (as shapes) ---
      {
        id: 'border-top', type: 'shape', shapeType: 'rect', x: 0, y: 0, width: 500, height: 50,
        fill: '#dcbfa0', zIndex: 10,
        options: {
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 95% 80%, 90% 65%, 85% 85%, 80% 70%, 75% 85%, 70% 65%, 65% 85%, 60% 70%, 55% 85%, 50% 65%, 45% 85%, 40% 70%, 35% 85%, 30% 65%, 25% 85%, 20% 70%, 15% 85%, 10% 65%, 5% 85%, 0 70%)',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
        }
      },
      {
        id: 'border-bottom', type: 'shape', shapeType: 'rect', x: 0, y: 940, width: 500, height: 60,
        fill: '#dcbfa0', zIndex: 10,
        options: {
          clipPath: 'polygon(0 100%, 100% 100%, 100% 30%, 95% 15%, 90% 35%, 85% 15%, 80% 35%, 75% 15%, 70% 35%, 65% 15%, 60% 35%, 55% 15%, 50% 35%, 45% 15%, 40% 35%, 35% 15%, 30% 35%, 25% 15%, 20% 35%, 15% 15%, 10% 35%, 5% 15%, 0 30%)',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
        }
      },
      {
        id: 'border-left', type: 'shape', shapeType: 'rect', x: 0, y: 0, width: 40, height: 1000,
        fill: '#dcbfa0', zIndex: 10,
        options: {
          clipPath: 'polygon(0 0, 100% 0, 85% 5%, 95% 10%, 80% 15%, 90% 20%, 85% 25%, 95% 30%, 80% 35%, 90% 40%, 85% 45%, 95% 50%, 80% 55%, 90% 60%, 85% 65%, 95% 70%, 80% 75%, 90% 80%, 85% 85%, 95% 90%, 80% 95%, 100% 100%, 0 100%)',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
        }
      },
      {
        id: 'border-right', type: 'shape', shapeType: 'rect', x: 460, y: 0, width: 40, height: 1000,
        fill: '#dcbfa0', zIndex: 10,
        options: {
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 5% 95%, 20% 90%, 5% 85%, 20% 80%, 5% 75%, 20% 70%, 5% 65%, 20% 60%, 5% 55%, 20% 50%, 5% 45%, 20% 40%, 5% 35%, 20% 30%, 5% 25%, 20% 20%, 5% 15%, 20% 10%, 5% 5%)',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
        }
      },
    ]
  },
  wedding: {
    backgroundColor: '#FDF2F8',
    elements: [
      {
        id: 1, type: 'text', x: 100, y: 150, width: 600, height: 120,
        text: 'Sarah & Tom', rotation: 0, zIndex: 1,
        color: '#831843', fontSize: 96, fontFamily: 'Great Vibes', fontWeight: '400', textAlign: 'center', lineHeight: 1.1,
      },
      {
        id: 2, type: 'text', x: 100, y: 300, width: 600, height: 50,
        text: 'JUNE 18, 2025', rotation: 0, zIndex: 2,
        color: '#9D174D', fontSize: 20, fontFamily: 'Inter', fontWeight: '600', textAlign: 'center', lineHeight: 1.5, letterSpacing: '0.2em',
      },
      {
        id: 3, type: 'image', x: 250, y: 400, width: 300, height: 450,
        src: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
        rotation: 0, zIndex: 3,
        // filters
        brightness: 105, contrast: 100, saturate: 90, hueRotate: 0, blur: 0, opacity: 100, sepia: 10, grayscale: 0, vignette: 15,
      }
    ]
  },
  birthday: {
    backgroundColor: '#F0F9FF',
    elements: [
      {
        id: 1, type: 'text', x: 50, y: 80, width: 700, height: 150,
        text: "HAPPY 30TH!", rotation: -3, zIndex: 2,
        color: '#1D4ED8', fontSize: 120, fontFamily: 'Permanent Marker', fontWeight: '400', textAlign: 'center', lineHeight: 1.2,
      },
      {
        id: 2, type: 'image', x: 200, y: 250, width: 400, height: 500,
        src: 'https://images.unsplash.com/photo-1576866209830-58f4c00a5814?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
        rotation: 5, zIndex: 1,
        // filters
        brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, blur: 0, opacity: 100, sepia: 0, grayscale: 0, vignette: 0,
      },
      {
        id: 3, type: 'text', x: 100, y: 800, width: 600, height: 50,
        text: 'A decade of fun', rotation: 0, zIndex: 3,
        color: '#64748B', fontSize: 28, fontFamily: 'Caveat', fontWeight: '700', textAlign: 'center', lineHeight: 1.5,
      },
    ]
  },
  friends: {
    backgroundColor: '#FFFBEB',
    elements: [
      {
        id: 1, type: 'image', x: 50, y: 50, width: 325, height: 400,
        src: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
        rotation: -4, zIndex: 1,
      },
      {
        id: 2, type: 'image', x: 425, y: 100, width: 325, height: 400,
        src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
        rotation: 3, zIndex: 2,
      },
      {
        id: 3, type: 'text', x: 100, y: 550, width: 600, height: 100,
        text: 'Good Times & Crazy Friends', rotation: 0, zIndex: 3,
        color: '#CA8A04', fontSize: 56, fontFamily: 'Pacifico', fontWeight: '400', textAlign: 'center', lineHeight: 1.4,
      },
      {
        id: 4, type: 'image', x: 200, y: 650, width: 400, height: 300,
        src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
        rotation: -2, zIndex: 4,
      },
    ]
  },
  engagement: {
    backgroundColor: '#F5F3FF',
    elements: [
       {
        id: 1, type: 'text', x: 100, y: 100, width: 600, height: 80,
        text: 'She said Yes!', rotation: 0, zIndex: 2,
        color: '#5B21B6', fontSize: 64, fontFamily: 'Dancing Script', fontWeight: '700', textAlign: 'center', lineHeight: 1.2,
      },
      {
        id: 2, type: 'image', x: 150, y: 220, width: 500, height: 600,
        src: 'https://images.unsplash.com/photo-1532712938310-34cb39825785?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
        rotation: 0, zIndex: 1,
        // filters
        brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, blur: 0, opacity: 100, sepia: 0, grayscale: 0, vignette: 25,
      },
      {
        id: 3, type: 'text', x: 100, y: 850, width: 600, height: 50,
        text: '2025', rotation: 0, zIndex: 3,
        color: '#7C3AED', fontSize: 24, fontFamily: 'Inter', fontWeight: '500', textAlign: 'center', lineHeight: 1.5,
      },
    ]
  },
  family: {
    backgroundColor: '#F0F9F9',
    elements: [
      {
        id: 1, type: 'text', x: 50, y: 50, width: 700, height: 100,
        text: 'The Miller Family', rotation: 0, zIndex: 2,
        color: '#0F766E', fontSize: 64, fontFamily: 'Lora', fontWeight: '600', textAlign: 'center', lineHeight: 1.3,
      },
      {
        id: 2, type: 'image', x: 50, y: 180, width: 700, height: 500,
        src: 'https://images.unsplash.com/photo-1580130379626-6e213c819529?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
        rotation: 0, zIndex: 1,
      },
      {
        id: 3, type: 'text', x: 50, y: 720, width: 700, height: 50,
        text: 'Making memories together', rotation: 0, zIndex: 3,
        color: '#14B8A6', fontSize: 28, fontFamily: 'Satisfy', fontWeight: '400', textAlign: 'center', lineHeight: 1.5,
      },
    ]
  }
};

export default function CoverEditorPage() {
  const router = useRouter()
  const wrapperRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawMode, setIsDrawMode] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 })
  const [canvasSettings, setCanvasSettings] = useState({
    width: 800,
    height: 1000
  })
  const [drawingTool, setDrawingTool] = useState({
    type: 'pen', // pen, marker, highlighter
    color: '#000000',
    width: 10,
    opacity: 1
  })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isInteractingWithCanvas, setIsInteractingWithCanvas] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false)

  // History State
  const [history, setHistory] = useState([{ elements: [], backgroundColor: '#ffffff' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const searchParams = useSearchParams();

  const currentState = history[historyIndex];
  const { elements, backgroundColor } = currentState;

  // Load preset data on initial render
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId && COVER_PRESETS[presetId] && historyIndex === 0 && elements.length === 0) {
      const preset = COVER_PRESETS[presetId];
      const initialState = {
        elements: preset.elements.map(el => ({ ...el, id: Date.now() + Math.random() })),
        backgroundColor: preset.backgroundColor,
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [searchParams, historyIndex, elements.length]);


  const updateState = (newState, overwrite = false) => {
    const newHistory = overwrite ? [] : history.slice(0, historyIndex + 1);
    const finalHistory = [...newHistory, newState];
    setHistory(finalHistory);
    setHistoryIndex(finalHistory.length - 1);
  };

  const setElements = (updater) => {
    const newElements = typeof updater === 'function' ? updater(elements) : updater;
    updateState({ ...currentState, elements: newElements });
  };

  const setBackgroundColor = (newColor) => {
    updateState({ ...currentState, backgroundColor: newColor });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    router.push('/create?step=editor');
  };

  const addElement = (type) => {
    let newElement;
    const newId = Date.now();
    newElement = {
      id: newId,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      zIndex: elements.length + 1,
      // Defaults
      color: '#000000',
      fontSize: 24,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      textAlign: 'center',
      lineHeight: 1.2,
      fill: '#3b82f6',
      stroke: '#000000',
      strokeWidth: 0,
      // Image Filters
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hueRotate: 0,
      blur: 0,
      opacity: 100,
      sepia: 0,
      grayscale: 0,
      vignette: 0
    };

    if (type === 'text') {
      newElement.text = 'New Text';
      newElement.x = 50;
      newElement.y = 50;
      newElement.width = 300;
      newElement.height = 100;
    } else if (type === 'image') {
      newElement.src = 'https://via.placeholder.com/150';
      newElement.x = 50;
      newElement.y = 50;
      newElement.width = 150;
      newElement.height = 150;
    }

    setElements(prev => [...prev, newElement]);
    setSelectedId(newId);
  };

  const updateElement = (id, updatedProps) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updatedProps } : el)
    );
  };

  const bringForward = (id) => {
    setElements(prev => {
      const elementIndex = prev.findIndex(el => el.id === id);
      if (elementIndex === -1) return prev;

      const element = prev[elementIndex];
      const otherElements = prev.filter((_, index) => index !== elementIndex);
      const newZIndex = Math.min(255, element.zIndex + 1);
      return [...otherElements, { ...element, zIndex: newZIndex }].sort((a, b) => a.zIndex - b.zIndex);
    });
  };

  const sendBackward = (id) => {
    setElements(prev => {
      const elementIndex = prev.findIndex(el => el.id === id);
      if (elementIndex === -1) return prev;

      const element = prev[elementIndex];
      const otherElements = prev.filter((_, index) => index !== elementIndex);
      const newZIndex = Math.max(0, element.zIndex - 1);
      return [...otherElements, { ...element, zIndex: newZIndex }].sort((a, b) => a.zIndex - b.zIndex);
    });
  };

  const handleReorderElement = (direction) => {
    if (!selectedId) return;
    if (direction === 'forward') {
      bringForward(selectedId);
    } else if (direction === 'backward') {
      sendBackward(selectedId);
    }
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleCanvasClick = (e) => {
    if (isDrawMode) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Deselect if clicking on empty space
    if (selectedId && !elements.find(el => el.id === selectedId && el.type !== 'drawing')) {
      setSelectedId(null);
    }
  };

  const handleDownload = async (format) => {
    setIsExporting(true)
    try {
      // Find the element
      const element = document.querySelector('.editor-canvas')
      if (!element) {
        throw new Error('Canvas element not found')
      }

      // Deselect any selected element before capturing (to remove selection boxes)
      const prevSelection = selectedId
      setSelectedId(null)
      
      // Wait for React to render the removal of selection indicators
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvasElement = document.querySelector('.editor-canvas canvas');
      if (!canvasElement) throw new Error('Failed to find canvas element for export.');

      if (format === 'png') {
        const dataUrl = await html2canvas(canvasElement, {
          backgroundColor: backgroundColor,
          scale: 2,
        }).then(canvas => canvas.toDataURL('image/png'));
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'cover-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'jpeg') {
        const dataUrl = await html2canvas(canvasElement, {
          backgroundColor: backgroundColor,
          scale: 2,
        }).then(canvas => canvas.toDataURL('image/jpeg', 0.95));
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'cover-design.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        const canvas = await html2canvas(canvasElement, {
          scale: 2,
          backgroundColor: backgroundColor,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: imgData.width > imgData.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [imgData.width, imgData.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('cover-design.pdf');
      }

    } catch (error) {
      console.error('Export failed:', error)
      alert(`Failed to save cover: ${error.message}`)
    } finally {
      setIsExporting(false)
      setIsDownloadMenuOpen(false)
    }
  }

  const handleSaveProject = () => {
    const projectData = {
      elements,
      backgroundColor,
      canvasSettings,
      version: '1.0'
    };
    try {
      localStorage.setItem('memoraCoverProject', JSON.stringify(projectData));
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleLoadProject = () => {
    try {
      const savedData = localStorage.getItem('memoraCoverProject');
      if (savedData) {
        const projectData = JSON.parse(savedData);
        const loadedState = {
          elements: projectData.elements || [],
          backgroundColor: projectData.backgroundColor || '#ffffff'
        };
        // Overwrite history with loaded state
        updateState(loadedState, true);
        setCanvasSettings(projectData.canvasSettings || { width: 800, height: 1000 });
        alert('Project loaded successfully!');
      } else {
        alert('No saved project found.');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project. Please try again.');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (isDownloadMenuOpen && !e.target.closest('.download-dropdown-container')) {
        setIsDownloadMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [isDownloadMenuOpen])

  // Panning Handlers
  const handleMouseDown = (e) => {
    if (isDrawMode) return
    // Only pan if clicking on the wrapper or the canvas background (not elements)
    // We rely on event bubbling. Elements stop propagation, so this only fires for background.
    setIsPanning(true)
    setPanStart({ x: e.clientX, y: e.clientY })
    if (wrapperRef.current) {
      setScrollStart({ 
        left: wrapperRef.current.scrollLeft, 
        top: wrapperRef.current.scrollTop 
      })
    }
  }

  const handleMouseMove = (e) => {
    if (!isPanning || isDrawMode || !wrapperRef.current) return
    e.preventDefault()
    const dx = e.clientX - panStart.x
    const dy = e.clientY - panStart.y
    wrapperRef.current.scrollLeft = scrollStart.left - dx
    wrapperRef.current.scrollTop = scrollStart.top - dy
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleZoom = (delta) => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.min(Math.max(prevZoom + delta, 0.2), 3)
      
      // Center the zoom
      if (wrapperRef.current) {
        const wrapper = wrapperRef.current
        const scale = newZoom / prevZoom
        
        // Calculate center point
        const centerX = wrapper.scrollLeft + wrapper.clientWidth / 2
        const centerY = wrapper.scrollTop + wrapper.clientHeight / 2
        
        // New center point
        const newCenterX = centerX * scale
        const newCenterY = centerY * scale
        
        // Scroll to new center
        // Use setTimeout to allow render to update scrollHeight/Width first
        setTimeout(() => {
          wrapper.scrollLeft = newCenterX - wrapper.clientWidth / 2
          wrapper.scrollTop = newCenterY - wrapper.clientHeight / 2
        }, 0)
      }
      
      return newZoom
    })
  }

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div className="cover-editor-root">
      <FontLoader />
      <EditorSidebar 
        onAddElement={addElement} 
        isDrawMode={isDrawMode}
        onToggleDrawMode={(force) => {
          if (typeof force === 'boolean') setIsDrawMode(force)
          else setIsDrawMode(!isDrawMode)
        }}
        canvasSettings={canvasSettings}
        onUpdateCanvas={setCanvasSettings}
        drawingTool={drawingTool}
        onUpdateDrawingTool={setDrawingTool}
        selectedElement={selectedElement}
        isInteractingWithCanvas={isInteractingWithCanvas}
      />
      
      <div className="editor-main">
        <div className="editor-header">
          <h3>Cover Editor</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="toolbar-btn" 
              onClick={handleUndo} 
              disabled={historyIndex <= 0}
              title="Undo"
            >
              ↩
            </button>
            <button 
              className="toolbar-btn" 
              onClick={handleRedo} 
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              ↪
            </button>
            
            <div className="download-dropdown-container" style={{ position: 'relative' }}>
              <button 
                className="save-btn secondary"
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                disabled={isExporting}
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '13px', 
                  background: '#f1f5f9', 
                  color: '#334155',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center'
                }}
              >
                {isExporting ? 'Saving...' : 'Download'}
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>

              {isDownloadMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 200,
                  minWidth: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4px'
                }}>
                  <button 
                    onClick={() => handleDownload('png')} 
                    style={{ textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', color: '#334155' }}
                    onMouseEnter={e => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                  >
                    Download PNG
                  </button>
                  <button 
                    onClick={() => handleDownload('jpeg')} 
                    style={{ textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', color: '#334155' }}
                    onMouseEnter={e => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                  >
                    Download JPG
                  </button>
                  <button 
                    onClick={() => handleDownload('pdf')} 
                    style={{ textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '13px', color: '#334155' }}
                    onMouseEnter={e => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            <button className="save-btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', marginRight: '8px' }} onClick={handleBack}>Back</button>
            <button className="save-btn" onClick={handleSave}>Done</button>
          </div>
        </div>
        
        <div 
          className={`canvas-wrapper ${isDrawMode ? 'draw-mode' : ''}`}
          ref={wrapperRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <EditorCanvas 
            elements={elements} 
            selectedId={selectedId} 
            onSelect={setSelectedId}
            onUpdate={updateElement}
            isDrawMode={isDrawMode}
            onAddDrawing={(drawing) => addElement('drawing', drawing)}
            canvasSettings={canvasSettings}
            drawingTool={drawingTool}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            onDrawingStart={() => setIsInteractingWithCanvas(true)}
            onDrawingEnd={() => setIsInteractingWithCanvas(false)}
          />
        </div>

        <div className="zoom-controls">
          <button 
            onClick={() => handleZoom(0.1)}
            style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            +
          </button>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#64748b', minWidth: '40px', justifyContent: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </div>
          <button 
            onClick={() => handleZoom(-0.1)}
            style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            -
          </button>
        </div>
      </div>

      {/* Only show toolbar if NOT in draw mode AND an element is selected */}
      {!isDrawMode && selectedElement && (
        <EditorToolbar 
          selectedElement={selectedElement} 
          onUpdate={(updates, action) => updateElement(selectedId, updates, action)} 
          onReorder={handleReorderElement}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
