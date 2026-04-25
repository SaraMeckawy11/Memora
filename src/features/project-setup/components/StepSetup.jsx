'use client'
import SetupHeader from './SetupHeader'
import ProductSelection from './ProductSelection'
import SizeSelection from './SizeSelection'
import CoverThemeSelection from './CoverThemeSelection'
import '@/styles/setup/step-setup.css'

export default function StepSetup() {
  return (
    <div className="setup-container">
      {/* <SetupHeader /> */}
      
      <ProductSelection />
      
      <SizeSelection />
{/*       
      <CoverThemeSelection 
        coverTheme={coverTheme}
        setCoverTheme={setCoverTheme}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      /> */}
    </div>
  )
}