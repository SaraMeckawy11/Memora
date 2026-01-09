export function useProjectPersistence(elements, backgroundColor, canvasSettings, updateState, setCanvasSettings) {
  const handleSaveProject = () => {
    const projectData = { elements, backgroundColor, canvasSettings, version: '1.0' };
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

  return { handleSaveProject, handleLoadProject };
}
