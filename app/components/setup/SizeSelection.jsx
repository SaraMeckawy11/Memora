'use client'
import '@/styles/setup/step-setup.css'

const SIZES = [
  {
    id: 1,
    name: 'A4 Portrait',
    label: '210 × 297 mm',
    aspect: (8.27 / 11.69).toFixed(2),
    width: 8.27,
    height: 11.69,
  },
  {
    id: 2,
    name: 'A4 Landscape',
    label: '297 × 210 mm',
    aspect: (11.69 / 8.27).toFixed(2),
    width: 11.69,
    height: 8.27,
  },
  {
    id: 3,
    name: 'B5 Portrait',
    label: '176 × 250 mm',
    aspect: (6.93 / 9.84).toFixed(2),
    width: 6.93,
    height: 9.84,
    popular: true,
  },
  {
    id: 4,
    name: 'B5 Landscape',
    label: '250 × 176 mm',
    aspect: (9.84 / 6.93).toFixed(2),
    width: 9.84,
    height: 6.93,
  },
]

export default function SizeSelection({ selectedSize, setSelectedSize }) {
  
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
        {SIZES.map((size) => {
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

export { SIZES }