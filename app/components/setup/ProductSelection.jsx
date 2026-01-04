'use client'
import '@/styles/setup/step-setup.css'

export default function ProductSelection({ products, selectedProduct, setSelectedProduct }) {
  return (
    <div className="section-container">
      <h3 className="section-title">Book Type</h3>
      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedProduct(product.id)
              }
            }}
            className={`product-card ${selectedProduct === product.id ? 'selected' : ''}`}
          >
            <div className="product-icon">{product.icon}</div>
            <h4 className="product-name">{product.name}</h4>
            <p className="product-desc">{product.description}</p>
            <p className="product-price">From ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}