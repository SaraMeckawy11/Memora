'use client'
import { usePDFExporter } from './PDFExporter'

export default function PDFExportButton({
  pages,
  uploadedImages,
  selectedSize,
  sizes,
  layouts,
  pageMargin,
  pageGutter,
  pageBgColor,
  imageFitMode,
}) {
  const {
    isExporting,
    exportProgress,
    pdfQuality,
    setPdfQuality,
    showPdfMenu,
    setShowPdfMenu,
    exportToPDF,
  } = usePDFExporter({
    pages,
    uploadedImages,
    selectedSize,
    sizes,
    layouts,
    pageMargin,
    pageGutter,
    pageBgColor,
    imageFitMode,
  })

  return (
    <div className="pdf-export-container">
      <button
        type="button"
        onClick={() => setShowPdfMenu(!showPdfMenu)}
        className="btn-pdf-trigger"
        disabled={isExporting}
      >
        {isExporting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <span style={{ fontSize: '0.7rem', marginBottom: '2px', color: '#fff' }}>{exportProgress}%</span>
            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${exportProgress}%`, 
                height: '100%', 
                background: '#fff', 
                transition: 'width 0.2s ease' 
              }} />
            </div>
          </div>
        ) : (
          <>
            <span>PDF</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </>
        )}
      </button>

      {showPdfMenu && !isExporting && (
        <div className="pdf-dropdown-menu">
          <button
            type="button"
            className="pdf-dropdown-item"
            onClick={() => {
              setPdfQuality('screen')
              setShowPdfMenu(false)
              exportToPDF('screen')
            }}
          >
            low (72 DPI)
          </button>
          <button
            type="button"
            className="pdf-dropdown-item"
            onClick={() => {
              setPdfQuality('print')
              setShowPdfMenu(false)
              exportToPDF('print')
            }}
          >
            medium (300 DPI)
          </button>
          <button
            type="button"
            className="pdf-dropdown-item"
            onClick={() => {
              setPdfQuality('original')
              setShowPdfMenu(false)
              exportToPDF('original')
            }}
          >
            High Resolution
          </button>
        </div>
      )}
    </div>
  )
}
