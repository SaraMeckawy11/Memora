'use client'
import { useState, useEffect } from 'react'
import PhotoLibrary from './PhotoLibrary'
import LayoutSection from './LayoutSection'
import ImageActions from './ImageActions'
import GlobalActions from './GlobalActions'
import PageSettingsSection from './PageSettingsSection'
import CaptionSection from './CaptionSection'
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
    applyToAllPages, uploadedImages, pages, currentPage, addImageToPage,
    selectedSlotIdx, openImageEditor,
    autoSave, setAutoSave, clearProgress,
    saveProgress, selectedSize,
    layoutSplitX, layoutSplitY, updateLayoutSplitX, updateLayoutSplitY,
    onUpload,
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

  const renderCaptionSection = () => (
    <CaptionSection
      selectedCaption={selectedCaption}
      updateCaption={updateCaption}
      selectedFontFamily={selectedFontFamily}
      selectedFontSize={selectedFontSize}
      selectedFontColor={selectedFontColor}
      captionPosition={captionPosition}
      captionAlignment={captionAlignment}
      updateCaptionStyle={updateCaptionStyle}
    />
  )

  /* =========================================
     Definitions for Mobile Tabs
     ========================================= */
  const mobileTabs = [
    { id: 'layout', label: 'Layout', icon: TabIcons.layout, content: renderLayoutSection },
    { id: 'page', label: 'Page', icon: TabIcons.page, content: renderPageSettingsSection },
    { id: 'caption', label: 'Text', icon: TabIcons.caption, content: renderCaptionSection },
    { id: 'photos', label: 'Photos', icon: TabIcons.photos, content: () => <PhotoLibrary uploadedImages={uploadedImages} pages={pages} currentPage={currentPage} addImageToPage={addImageToPage} onUpload={onUpload} /> },
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
        <PhotoLibrary uploadedImages={uploadedImages} pages={pages} currentPage={currentPage} addImageToPage={addImageToPage} onUpload={onUpload} />
        {renderLayoutSection()}
        <div className="page-settings-desktop-card">
          {renderPageSettingsSection()}
        </div>
        {renderImageActions()}
        {renderCaptionSection()}
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
