'use client'

export default function StepReview({
  pages,
  uploadedImages,
  selectedProduct,
  selectedSize,
  products,
  sizes,
  pageBgColor,
  handleProceed,
  exportToPDF,
  isExporting,
}) {
  const selectedProductObj = products.find(p => p.id === selectedProduct)
  const selectedSizeObj = sizes.find(s => s.id === selectedSize)
  const filledPages = pages.filter(p => p.images.length > 0).length

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
        Review Your Photo Book
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>
        Everything looks perfect? Let's finalize your order!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            width: '200px', 
            height: '260px', 
            backgroundColor: pageBgColor, 
            borderRadius: '8px', 
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1.5rem' 
          }}>
            <span style={{ fontWeight: 600, color: '#666' }}>Your Book</span>
          </div>
          <p style={{ textAlign: 'center', color: '#666' }}>
            {filledPages} of {pages.length} pages filled
          </p>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
            {uploadedImages.length} photos uploaded
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Order Summary</h3>

          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <span style={{ color: '#666' }}>Book Type:</span>
              <span style={{ fontWeight: 600 }}>{selectedProductObj?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <span style={{ color: '#666' }}>Size:</span>
              <span style={{ fontWeight: 600 }}>{selectedSizeObj?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: '#666' }}>Pages:</span>
              <span style={{ fontWeight: 600 }}>{pages.length}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600 }}>
              <span>Subtotal:</span>
              <span>${selectedProductObj?.price.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: isExporting ? 'wait' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {isExporting ? '⏳ Exporting...' : '📄 Download PDF Preview'}
            </button>
            
            <button
              className="btn btn-primary"
              onClick={handleProceed}
              style={{ width: '100%' }}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        padding: '1.5rem', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' 
      }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>
          All Pages Preview
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
          gap: '1rem' 
        }}>
          {pages.map((page, idx) => (
            <div
              key={page.id}
              style={{
                aspectRatio: '1',
                backgroundColor: pageBgColor,
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                color: '#666',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {page.images.length > 0 ? (
                <img
                  src={uploadedImages.find(i => i.id === page.images[0])?.src}
                  alt={`Page ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>Page {idx + 1}</span>
              )}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
              }}>
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}