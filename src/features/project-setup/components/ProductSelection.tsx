'use client'
import { useEffect } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import '@/styles/setup/step-setup.css'

const PRODUCTS = [
  { id: 1, name: 'Hardcover', icon: '📕', description: 'Premium hardcover with dust jacket', price: 0 },
  { id: 2, name: 'Softcover', icon: '📔', description: 'Flexible softcover binding', price: 0 },
]

export default function ProductSelection() {
  const selectedProduct = useProjectStore(s => s.selectedProduct)
  const setSelectedProduct = useProjectStore(s => s.setSelectedProduct)

  useEffect(() => {
    if (!PRODUCTS.some(product => product.id === selectedProduct)) {
      setSelectedProduct(PRODUCTS[0].id)
    }
  }, [selectedProduct, setSelectedProduct])

  return (
    <div className="section-container">
      <h3 className="section-title">
        <span className="section-num">01</span>
        Book type
      </h3>
      <div className="product-grid">
        {PRODUCTS.map((product) => (
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
            <span className="select-check" aria-hidden="true">✓</span>
            <div className="product-icon">{product.icon}</div>
            <h4 className="product-name">{product.name}</h4>
            <p className="product-desc">{product.description}</p>
            <p className="product-price">
              {product.price === 0 ? 'Included' : `${product.price} EGP`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export { PRODUCTS }
