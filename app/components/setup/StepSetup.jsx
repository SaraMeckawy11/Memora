'use client'
import SetupHeader from './SetupHeader'
import ProductSelection from './ProductSelection'
import SizeSelection from './SizeSelection'
import CoverThemeSelection from './CoverThemeSelection'
import '@/styles/setup/step-setup.css'

export default function StepSetup({
  selectedProduct,
  setSelectedProduct,
  selectedSize,
  setSelectedSize,
  coverImage,
  setCoverImage,
  coverText,
  setCoverText,
  coverTheme,
  setCoverTheme,
  products,
  sizes
}) {
  return (
    <div className="setup-container">
      <SetupHeader />
      
      <ProductSelection 
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
      
      <SizeSelection 
        sizes={sizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />
      
      <CoverThemeSelection 
        coverTheme={coverTheme}
        setCoverTheme={setCoverTheme}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      />
    </div>
  )
}