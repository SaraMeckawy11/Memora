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
        
        // Convert pixel dimensions to millimeters (96 DPI standard)
        const pxToMm = (px) => (px * 25.4) / 96;
        const pdfWidth = pxToMm(canvas.width);
        const pdfHeight = pxToMm(canvas.height);
        
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });
        
        // Add image to fill the entire page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Use the same download mechanism as PNG and JPEG for consistency
        const blob = pdf.output('blob');
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'cover-design.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
