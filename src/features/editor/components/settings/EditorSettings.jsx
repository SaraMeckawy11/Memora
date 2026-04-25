'use client'
import { useState, useEffect } from 'react'
import { useProjectStore } from '@/store/useProjectStore'

import LayoutSection from './LayoutSection'
import ImageActions from './ImageActions'
import GlobalActions from './GlobalActions'
import PageSettingsSection from './PageSettingsSection'
import CaptionSection from './CaptionSection'
import TextPageSection from './TextPageSection'
import MobileView, { TabIcons } from './MobileView'

import '@/styles/editor/common.css'
import '@/styles/editor/EditorSettings.css'

export default function EditorSettings() {
  const store = useProjectStore()
  const currentPage = store.pages[store.currentPageIdx]
  
  // Local UI state for mobile tabs
  const [activeMobileTab, setActiveMobileTab] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setActiveMobileTab(null)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const selectedImageId = store.selectedSlotIdx !== null ? currentPage?.images?.[store.selectedSlotIdx] : null
  const selectedImageObj = selectedImageId ? store.uploadedImages?.find((img) => img.id === selectedImageId) : null

  /* =========================================
     Render Modules
     ========================================= */

  const renderLayoutSection = () => <LayoutSection />
  const renderImageActions = () => <ImageActions selectedImageId={selectedImageId} selectedImageObj={selectedImageObj} />
  const renderGlobalActions = () => <GlobalActions />
  const renderPageSettingsSection = () => <PageSettingsSection />
  const renderCaptionSection = () => (currentPage?.type === 'text' ? <TextPageSection /> : <CaptionSection />)

  const mobileTabs = [
    { id: 'layout', label: 'Layout', icon: TabIcons.layout, content: renderLayoutSection },
    { id: 'page', label: 'Margin', icon: TabIcons.page, content: renderPageSettingsSection },
    { id: 'text', label: 'Text', icon: TabIcons.caption, content: renderCaptionSection },
    { id: 'actions', label: 'Actions', icon: TabIcons.actions, content: renderGlobalActions },
  ];
  
  if (selectedImageId) {
    mobileTabs.splice(1, 0, { id: 'image', label: 'Edit', icon: TabIcons.image, content: renderImageActions });
  }

  return (
    <>
      <div className="editor-settings desktop-view">
        {renderLayoutSection()}
        <div className="page-settings-desktop-card">{renderPageSettingsSection()}</div>
        {renderImageActions()}
        {renderCaptionSection()}
        {renderGlobalActions()}
      </div>

      <MobileView 
        step={store.step}
        activeMobileTab={activeMobileTab}
        setActiveMobileTab={setActiveMobileTab}
        mobileTabs={mobileTabs}
      />
    </>
  )
}
