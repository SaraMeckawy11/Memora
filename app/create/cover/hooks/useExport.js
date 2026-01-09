import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function useExport(selectedId, setSelectedId, backgroundColor, activeSide) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  const handleDownload = async (format) => {
    setIsExporting(true);
    try {
      const containerSelector = activeSide ? `#canvas-${activeSide}` : '.canvas-container';
      const element = document.querySelector(`${containerSelector} .editor-canvas`);
      if (!element) throw new Error('Canvas element not found');

      // Deselect any selected element before capturing
      setSelectedId(null);
      await new Promise(resolve => setTimeout(resolve, 100));

      // We use the element itself, html2canvas will find the content
      const canvasElement = element;

      if (format === 'png') {
        const dataUrl = await html2canvas(canvasElement, {
          backgroundColor: backgroundColor,
          scale: 2,
          useCORS: true,
          logging: false
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
      console.error('Export failed:', error);
      alert(`Failed to save cover: ${error.message}`);
    } finally {
      setIsExporting(false);
      setIsDownloadMenuOpen(false);
    }
  };

  return {
    isExporting,
    isDownloadMenuOpen,
    setIsDownloadMenuOpen,
    handleDownload
  };
}
