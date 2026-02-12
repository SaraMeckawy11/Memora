'use client'
import { useState, useEffect } from 'react'
import LayoutSection from './LayoutSection'
import ImageActions from './ImageActions'
import GlobalActions from './GlobalActions'
import PageSettingsSection from './PageSettingsSection'
import CaptionSection from './CaptionSection'
import TextPageSection from './TextPageSection'
import MobileView, { TabIcons } from './MobileView'
import '@/styles/editor/common.css'
import '@/styles/editor/EditorSettings.css'

/* =========================================
   Main Component
   ========================================= */
export default function EditorSettings(props) {
  // Destructure all props for easy access
  const {
    step,
    selectedLayout, updatePageLayout,
    pageMargin, setPageMargin, pageGutter, setPageGutter, pageBgColor, setPageBgColor,
    pageMarginEffective, pageGutterEffective,
    setPageMarginForCurrentPage, setPageGutterForCurrentPage,
    clearPageMarginOverride, clearPageGutterOverride,
    imageBorderRadius, setImageBorderRadius, imageFitMode, setImageFitMode,
    showPageNumbers, setShowPageNumbers,
    selectedCaption, updateCaption, selectedFontFamily, selectedFontSize, selectedFontColor, captionPosition, captionAlignment, updateCaptionStyle,
    applyToAllPages, uploadedImages, pages, setPages, currentPage, addImageToPage,
    selectedSlotIdx, openImageEditor,
    autoSave, setAutoSave, clearProgress,
    saveProgress, selectedSize,
    layoutSplitX, layoutSplitY, updateLayoutSplitX, updateLayoutSplitY,
    onUpload, currentPageIdx, addTextPage, removePage,
    selectedOverlayIdx, updateOverlayStyle, updateOverlayContent,
  } = props

  const selectedImageId =
    selectedSlotIdx !== null && selectedSlotIdx !== undefined
      ? currentPage?.images?.[selectedSlotIdx]
      : null

  const selectedImageObj = selectedImageId
    ? uploadedImages?.find((img) => img.id === selectedImageId)
    : null

  // STATE: Track which tab is open on mobile
  const [activeMobileTab, setActiveMobileTab] = useState(null)

  // Close mobile drawer when clicking outside (optional safety)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setActiveMobileTab(null)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderLayoutSection = () => (
    <LayoutSection 
      selectedLayout={selectedLayout}
      updatePageLayout={updatePageLayout}
    />
  )

  const renderImageActions = () => (
    <ImageActions
      selectedImageId={selectedImageId}
      selectedImageObj={selectedImageObj}
      selectedSlotIdx={selectedSlotIdx}
      openImageEditor={openImageEditor}
    />
  )

  const renderGlobalActions = () => (
    <GlobalActions
      autoSave={autoSave}
      setAutoSave={setAutoSave}
      clearProgress={clearProgress}
      saveProgress={saveProgress}
      pages={pages}
      uploadedImages={uploadedImages}
      selectedSize={selectedSize}
      pageMargin={pageMargin}
      pageGutter={pageGutter}
      pageBgColor={pageBgColor}
      imageFitMode={imageFitMode}
    />
  )

  const renderPageSettingsSection = () => (
    <PageSettingsSection
      pageMargin={pageMargin}
      setPageMargin={setPageMargin}
      pageGutter={pageGutter}
      setPageGutter={setPageGutter}
      pageBgColor={pageBgColor}
      setPageBgColor={setPageBgColor}
      pageMarginEffective={pageMarginEffective}
      pageGutterEffective={pageGutterEffective}
      setPageMarginForCurrentPage={setPageMarginForCurrentPage}
      setPageGutterForCurrentPage={setPageGutterForCurrentPage}
      clearPageMarginOverride={clearPageMarginOverride}
      clearPageGutterOverride={clearPageGutterOverride}
      imageBorderRadius={imageBorderRadius}
      setImageBorderRadius={setImageBorderRadius}
      layoutSplitX={layoutSplitX}
      layoutSplitY={layoutSplitY}
      updateLayoutSplitX={updateLayoutSplitX}
      updateLayoutSplitY={updateLayoutSplitY}
      currentPage={currentPage}
    />
  )

  const renderCaptionSection = () => {
    // If current page is a text page, show text editing options
    if (currentPage?.type === 'text') {
      return (
        <TextPageSection
          currentPage={currentPage}
          currentPageIdx={currentPageIdx}
          uploadedImages={uploadedImages}
          addOverlayElement={(overlay) => {
            const newPages = [...pages]
            const page = newPages[currentPageIdx]
            page.overlays = [...(page.overlays || []), overlay]
            setPages(newPages)
          }}
          removeOverlayElement={(overlayIdx) => {
            const newPages = [...pages]
            const page = newPages[currentPageIdx]
            page.overlays = (page.overlays || []).filter((_, i) => i !== overlayIdx)
            setPages(newPages)
          }}
          updateTextContent={(text) => {
            const newPages = [...pages]
            newPages[currentPageIdx].textContent = text
            setPages(newPages)
          }}
          updateTextStyle={(key, value) => {
            const newPages = [...pages]
            newPages[currentPageIdx].textStyle = {
              ...newPages[currentPageIdx].textStyle,
              [key]: value,
            }
            setPages(newPages)
          }}
          updatePageBgColor={(color) => {
            const newPages = [...pages]
            newPages[currentPageIdx].pageBgColor = color
            setPages(newPages)
          }}
          removeText={() => {
            const newPages = [...pages]
            newPages[currentPageIdx].textContent = ''
            setPages(newPages)
          }}
          removePage={removePage}
          selectedOverlayIdx={selectedOverlayIdx}
          updateOverlayStyle={updateOverlayStyle}
          updateOverlayContent={updateOverlayContent}
        />
      )
    }

    // Otherwise show regular caption section
    return (
      <CaptionSection
        selectedCaption={selectedCaption}
        updateCaption={updateCaption}
        selectedFontFamily={selectedFontFamily}
        selectedFontSize={selectedFontSize}
        selectedFontColor={selectedFontColor}
        captionPosition={captionPosition}
        captionAlignment={captionAlignment}
        updateCaptionStyle={updateCaptionStyle}
        currentPageIdx={currentPageIdx}
        addTextPage={addTextPage}
      />
    )
  }

  const renderTextPageSection = () => (
    <TextPageSection
      currentPage={currentPage}
      currentPageIdx={currentPageIdx}
      uploadedImages={uploadedImages}
      addOverlayElement={(overlay) => {
        const newPages = [...pages]
        const page = newPages[currentPageIdx]
        page.overlays = [...(page.overlays || []), overlay]
        setPages(newPages)
      }}
      removeOverlayElement={(overlayIdx) => {
        const newPages = [...pages]
        const page = newPages[currentPageIdx]
        page.overlays = (page.overlays || []).filter((_, i) => i !== overlayIdx)
        setPages(newPages)
      }}
      updateTextContent={(text) => {
        const newPages = [...pages]
        newPages[currentPageIdx].textContent = text
        setPages(newPages)
      }}
      updateTextStyle={(key, value) => {
        const newPages = [...pages]
        newPages[currentPageIdx].textStyle = {
          ...newPages[currentPageIdx].textStyle,
          [key]: value,
        }
        setPages(newPages)
      }}
      onUpdateTextPosition={(positionData) => {
        const newPages = [...pages]
        const page = newPages[currentPageIdx]
        
        // Update position
        if (positionData.x !== undefined) {
          page.textPosition = {
            ...page.textPosition,
            x: positionData.x,
            y: positionData.y,
          }
        }
        
        // Update rectangle dimensions
        if (positionData.width !== undefined) {
          page.textRect = {
            ...page.textRect,
            width: positionData.width,
            height: positionData.height,
          }
        }
        
        setPages(newPages)
      }}
      updatePageBgColor={(color) => {
        const newPages = [...pages]
        newPages[currentPageIdx].pageBgColor = color
        setPages(newPages)
      }}
      removeText={() => {
        const newPages = [...pages]
        newPages[currentPageIdx].textContent = ''
        setPages(newPages)
      }}
      removePage={removePage}
      selectedOverlayIdx={selectedOverlayIdx}
      updateOverlayStyle={updateOverlayStyle}
      updateOverlayContent={updateOverlayContent}
    />
  )

  /* =========================================
     Definitions for Mobile Tabs
     ========================================= */
  const mobileTabs = [
    { id: 'layout', label: 'Layout', icon: TabIcons.layout, content: renderLayoutSection },
    { id: 'page', label: 'Margin', icon: TabIcons.page, content: renderPageSettingsSection },
    { id: 'text', label: 'Text', icon: TabIcons.caption, content: currentPage?.type === 'text' ? renderTextPageSection : renderCaptionSection },
    { id: 'actions', label: 'Actions', icon: TabIcons.actions, content: renderGlobalActions },
  ];
  
  // If an image is selected, add Image tab
  if (selectedImageId) {
    mobileTabs.splice(1, 0, { id: 'image', label: 'Edit', icon: TabIcons.image, content: renderImageActions });
  }

  return (
    <>
      {/* ================= DESKTOP VIEW (Stacked Sidebar) ================= */}
      <div className="editor-settings desktop-view">
        {renderLayoutSection()}
        <div className="page-settings-desktop-card">
          {renderPageSettingsSection()}
        </div>
        {renderImageActions()}
        {currentPage?.type === 'text' ? renderTextPageSection() : renderCaptionSection()}
        {renderGlobalActions()}
      </div>

      {/* ================= MOBILE VIEW (Bottom Bar + Drawer) ================= */}
      <MobileView 
        step={step}
        activeMobileTab={activeMobileTab}
        setActiveMobileTab={setActiveMobileTab}
        mobileTabs={mobileTabs}
      />
    </>
  )
}
