export function useElementOperations(elements, setElements, setSelectedId) {
  
  const addElement = (type, customProps = null) => {
    const newId = Date.now();
    const baseElement = {
      id: newId,
      type,
      x: 100, y: 100, width: 200, height: 100,
      rotation: 0,
      zIndex: elements.length + 1,
      color: '#000000', fontSize: 24, fontFamily: 'Arial', fontWeight: 'normal',
      textAlign: 'center', lineHeight: 1.2, fill: '#3b82f6', stroke: '#000000', strokeWidth: 0,
      brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, blur: 0, opacity: 100, sepia: 0, grayscale: 0, vignette: 0
    };

    let newElement;
    if (type === 'drawing') {
      newElement = { ...baseElement, ...(customProps || {}), type: 'drawing' };
    } else if (type === 'text') {
      newElement = { ...baseElement, content: 'New Text', x: 50, y: 50, width: 300, height: 100, ...(customProps || {}) };
    } else if (type === 'image') {
      newElement = { ...baseElement, src: 'https://via.placeholder.com/150', x: 50, y: 50, width: 150, height: 150, ...(customProps || {}) };
    } else if (type === 'shape') {
      newElement = { ...baseElement, width: 100, height: 100, ...(customProps || {}) };
    } else {
      newElement = { ...baseElement, ...(customProps || {}) };
    }

    setElements(prev => [...prev, newElement]);
    setSelectedId(newId);
  };

  const updateElement = (id, updatedProps, action) => {
    if (action === 'delete') {
      setElements(prev => prev.filter(el => el.id !== id));
      setSelectedId(null);
      return;
    }
    if (updatedProps) {
      setElements(prev => prev.map(el => el.id === id ? { ...el, ...updatedProps } : el));
    }
  };

  const reorder = (id, action) => {
    setElements(prev => {
      const idx = prev.findIndex(el => el.id === id);
      if (idx === -1) return prev;
      
      let newElements = [...prev];
      const element = newElements[idx];

      if (action === 'forward' && idx < prev.length - 1) {
        newElements[idx] = newElements[idx + 1];
        newElements[idx + 1] = element;
      } else if (action === 'backward' && idx > 0) {
        newElements[idx] = newElements[idx - 1];
        newElements[idx - 1] = element;
      } else if (action === 'front') {
        newElements = [...newElements.filter(el => el.id !== id), element];
      } else if (action === 'back') {
        newElements = [element, ...newElements.filter(el => el.id !== id)];
      }

      return newElements.map((el, i) => ({ ...el, zIndex: i + 1 }));
    });
  };

  return { addElement, updateElement, reorder };
}
