'use client'
import { useRef } from 'react'

const COVER_THEMES = [
  {
    id: 'classic',
    name: 'Classic',
    bg: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
    textColor: '#333',
    desc: 'Clean and timeless'
  },
  {
    id: 'modern',
    name: 'Modern',
    bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    textColor: '#333',
    desc: 'Bold and contemporary'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    bg: 'linear-gradient(135deg, #fff7ed 0%, #fef9c3 100%)',
    textColor: '#333',
    desc: 'Warm and refined'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
    textColor: '#333',
    desc: 'Soft and subtle'
  },
  {
    id: 'bold',
    name: 'Bold',
    bg: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    textColor: '#333',
    desc: 'High contrast'
  },
  {
    id: 'soft',
    name: 'Soft',
    bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    textColor: '#333',
    desc: 'Romantic and gentle'
  },
]

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
  const fileInputRef = useRef(null);

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Max 10MB allowed.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage({
        id: Date.now(),
        src: event.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setCoverImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  const renderThemeCards = () => {
    // Ensure even number of cards (add a dummy if needed)
    const themes = [...COVER_THEMES];
    if ((themes.length + 1) % 2 !== 0) {
      themes.push({ id: 'dummy', name: '', bg: '', desc: '', textColor: '' });
    }
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '2.2rem',
        marginBottom: '2.5rem',
        padding: '0.5rem 0',
      }}>
        {/* Upload Cover Photo as a card */}
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#fff',
            border: !coverImage && !coverTheme ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: !coverImage && !coverTheme ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            padding: 0,
            minHeight: '130px',
            position: 'relative',
            transition: 'all 0.2s',
            outline: 'none',
            // height: '50%',
            // width:'50%',
            // margin: 'auto',
            
          }}
          tabIndex={0}
          htmlFor="cover-upload"
          onClick={() => {
            setCoverTheme('');
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setCoverTheme('');
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: 'none' }}
            id="cover-upload"
          />
          <div
            style={{
              width: '100%',
              aspectRatio: '3/4',
              background: '#fff',
              borderRadius: 'var(--radius) var(--radius) 0 0',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '2.5rem',
                color: 'var(--accent-solid)',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >+</span>
          </div>
          <div
            style={{
              width: '100%',
              padding: '0.7rem 0.5rem 0.5rem 0.5rem',
              textAlign: 'center',
              background: '#fff',
              borderRadius: '0 0 var(--radius) var(--radius)'
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'var(--accent-solid)'
              }}
            >
              Upload Cover Photo
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}
            >
              Use your own image
            </div>
          </div>
        </label>
        {/* Theme cards */}
        {themes.map(theme =>
          theme.id === 'dummy' ? (
            <div key="dummy" />
          ) : (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                setCoverTheme(theme.id);
                setCoverImage(null);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: theme.bg,
                border: coverTheme === theme.id && !coverImage ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: coverTheme === theme.id && !coverImage ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                padding: 0,
                minHeight: '130px',
                outline: 'none',
                transition: 'all 0.2s',
                // height: '50%',
                // width:'50%',
                // margin: 'auto',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: theme.bg,
                  borderRadius: 'var(--radius) var(--radius) 0 0',
                  minHeight: '80px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  padding: '0.7rem 0.5rem 0.5rem 0.5rem',
                  textAlign: 'center',
                  background: '#fff',
                  borderRadius: '0 0 var(--radius) var(--radius)'
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#222'
                  }}
                >
                  {theme.name}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  {theme.desc}
                </div>
              </div>
            </button>
          )
        )}
      </div>
    );
  };
// ...existing code...
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '0.5rem',
        fontSize: '2rem',
        color: 'var(--text-dark)',
        fontWeight: 700
      }}>
        Create Your Photo Book
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        marginBottom: '3rem',
        fontSize: '1.05rem'
      }}>
        Choose your book type, size, and cover theme
      </p>
      {/* Product Selection */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-dark)'
        }}>
          Book Type
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
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
              style={{
                padding: '1.5rem',
                backgroundColor: selectedProduct === product.id ? 'var(--accent-soft)' : '#fff',
                borderRadius: 'var(--radius)',
                border: selectedProduct === product.id ? '2px solid var(--accent-solid)' : '2px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedProduct === product.id ? '0 4px 16px rgba(0, 0, 0, 0.08)' : 'none',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                {product.icon}
              </div>
              <h4 style={{
                margin: '0 0 0.25rem 0',
                textAlign: 'center',
                fontSize: '1.1rem',
                color: 'var(--text-dark)',
                fontWeight: 600
              }}>
                {product.name}
              </h4>
              <p style={{
                margin: '0.25rem 0 0.75rem 0',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                {product.description}
              </p>
              <p style={{
                textAlign: 'center',
                fontWeight: 600,
                color: 'var(--accent-solid)',
                margin: 0,
                fontSize: '1.1rem'
              }}>
                From ${product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Size Selection - Improved Visualization */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-dark)'
        }}>
          Book Size
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {sizes.map((size) => {
            const shapeStyle = getBookShapeStyle(size)
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
                style={{
                  padding: '1.25rem',
                  backgroundColor: selectedSize === size.id ? 'var(--accent-soft)' : '#fff',
                  borderRadius: 'var(--radius)',
                  border: selectedSize === size.id ? '2px solid var(--accent-solid)' : '2px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {size.popular && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--accent-solid)',
                    color: '#fff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Popular
                  </span>
                )}
                {/* Visual Book Shape */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '90px',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{
                    ...shapeStyle,
                    backgroundColor: selectedSize === size.id ? 'var(--accent-solid)' : 'var(--bg-soft)',
                    borderRadius: '4px',
                    boxShadow: selectedSize === size.id
                      ? '4px 4px 0 rgba(0,0,0,0.1)'
                      : '2px 2px 0 var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}>
                    <span style={{
                      fontSize: '0.65rem',
                      color: selectedSize === size.id ? '#fff' : 'var(--text-muted)',
                      fontWeight: 500,
                    }}>
                      {size.width}×{size.height}
                    </span>
                  </div>
                </div>
                <h4 style={{
                  margin: '0 0 0.25rem 0',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)',
                  fontWeight: 600
                }}>
                  {size.name}
                </h4>
                <p style={{
                  margin: 0,
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  textAlign: 'center'
                }}>
                  {size.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      {/* Cover Theme (includes upload) */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          marginBottom: '1.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-dark)',
          textAlign: 'left',
        }}>
          Cover Theme
        </h3>
        {renderThemeCards()}
      </div>
    </div>
  )
}
