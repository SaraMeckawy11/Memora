export function useProjectPersistence(currentState, canvasSettings, updateState, setCanvasSettings) {
  const handleSaveProject = () => {
    const projectData = { 
      front: currentState.front, 
      back: currentState.back, 
      canvasSettings, 
      version: '1.1' 
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
        
        // Handle migration from old format
        let loadedState;
        if (projectData.version === '1.1') {
          loadedState = {
            front: projectData.front,
            back: projectData.back
          };
        } else {
          loadedState = {
            front: {
              elements: projectData.elements || [],
              backgroundColor: projectData.backgroundColor || '#ffffff'
            },
            back: {
              elements: [],
              backgroundColor: '#ffffff'
            }
          };
        }
        
        updateState(loadedState, true);
        if (projectData.canvasSettings) {
          setCanvasSettings(projectData.canvasSettings);
        }
        alert('Project loaded successfully!');
      } else {
        alert('No saved project found.');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project. Please try again.');
    }
  };

  return { handleSaveProject, handleLoadProject };
}
