'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
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

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', padding: '1rem' }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '0.5rem',
        fontSize: '2rem',
        color: '#1e293b',
        fontWeight: 700
      }}>
        Create Your Photo Book
      </h2>
      <p style={{
        textAlign: 'center',
        color: '#64748b',
        marginBottom: '3rem',
        fontSize: '1.05rem'
      }}>
        Choose your book type, size, and cover theme
      </p>

      {/* Product Selection */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
          1. Select Book Type
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products?.map(product => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{
                background: 'white',
                border: selectedProduct?.id === product.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedProduct?.id === product.id ? '0 10px 15px -3px rgba(59, 130, 246, 0.1)' : 'none'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{product.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.25rem' }}>{product.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>{product.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
          2. Select Size
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.2rem' }}>
          {sizes?.map(size => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size)}
              style={{
                background: 'white',
                border: selectedSize?.id === size.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: size.id % 2 === 0 ? '30px' : '50px', 
                background: '#f1f5f9', 
                margin: '0 auto 1rem',
                border: '1px solid #cbd5e1'
              }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{size.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{size.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cover Theme Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          marginBottom: '1.5rem',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#1e293b',
          textAlign: 'left',
        }}>
          3. Choose a Background Theme
        </h3>
        {renderThemeCards()}
      </div>
    </div>
  );
}
