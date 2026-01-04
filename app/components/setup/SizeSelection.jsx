'use client'
import '@/styles/setup/step-setup.css'

export default function SizeSelection({ sizes, selectedSize, setSelectedSize }) {
  
  const getBookShapeStyle = (size) => {
    const baseSize = 80;
    const ratio = size.width / size.height;
    if (ratio > 1) {
      return { width: `${baseSize}px`, height: `${baseSize / ratio}px` };
    } else if (ratio < 1) {
      return { width: `${baseSize * ratio}px`, height: `${baseSize}px` };
    } else {
      return { width: `${baseSize * 0.9}px`, height: `${baseSize * 0.9}px` };
    }
  };

  return (
    <div className="section-container">
      <h3 className="section-title">Book Size</h3>
      <div className="size-grid">
        {sizes.map((size) => {
          const shapeStyle = getBookShapeStyle(size)
          const isSelected = selectedSize === size.id
          
          return (
            <div
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedSize(size.id)
                }
              }}
              className={`size-card ${isSelected ? 'selected' : ''}`}
            >
              {size.popular && <span className="popular-tag">Popular</span>}
              
              {/* Visual Book Shape */}
              <div className="size-visual-container">
                <div 
                  className="size-visual-shape"
                  style={shapeStyle}
                >
                  <span className="size-dimensions">
                    {size.width}×{size.height}
                  </span>
                </div>
              </div>
              
              <h4 className="size-name">{size.name}</h4>
              <p className="size-label">{size.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}