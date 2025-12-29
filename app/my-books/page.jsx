'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MyBooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved books from localStorage
    const savedBooks = localStorage.getItem('pici-saved-books')
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks))
      } catch (e) {
        console.error('Error loading books:', e)
      }
    }
    setLoading(false)
  }, [])

  const deleteBook = (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(b => b.id !== bookId)
      setBooks(updatedBooks)
      localStorage.setItem('pici-saved-books', JSON.stringify(updatedBooks))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCreateNew = () => {
    // Clear any existing draft to start fresh at step 1
    localStorage.removeItem('photobook_draft')
    localStorage.removeItem('photobook-draft')
    router.push('/create')
  }

  if (loading) {
    return (
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading your books...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>My Books</h1>
          <p style={{ margin: 0, color: '#888', fontSize: '0.95rem' }}>
            {books.length > 0 
              ? `${books.length} saved book${books.length > 1 ? 's' : ''}`
              : 'Your saved photo books will appear here'
            }
          </p>
        </div>

        {/* Books Grid or Empty State */}
        {books.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {books.map((book) => (
              <div
                key={book.id}
                className="card"
                style={{
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Book Cover Preview */}
                <div style={{
                  aspectRatio: '4/3',
                  backgroundColor: 'var(--bg-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                        {book.product === 1 ? '📕' : '📔'}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>{book.pageCount || 20} pages</p>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: book.status === 'draft' ? '#fff3cd' : '#d4edda',
                    color: book.status === 'draft' ? '#856404' : '#155724',
                  }}>
                    {book.status === 'draft' ? '📝 Draft' : '✓ Ready'}
                  </div>
                </div>

                {/* Book Info */}
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.15rem', 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {book.name || 'Untitled Book'}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: '#666', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span>{book.sizeName || 'Standard'}</span>
                    <span>•</span>
                    <span>{book.pageCount || 20} pages</span>
                    <span>•</span>
                    <span>{book.photoCount || 0} photos</span>
                  </div>

                  <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#999' }}>
                    Last edited: {formatDate(book.updatedAt || book.createdAt || new Date())}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={`/create?bookId=${book.id}`}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        padding: '0.65rem 1rem',
                        textDecoration: 'none',
                      }}
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      href={`/order?bookId=${book.id}`}
                      className="btn btn-ghost"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        padding: '0.65rem 1rem',
                        textDecoration: 'none',
                      }}
                    >
                      🛒 Order
                    </Link>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="btn"
                      style={{
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'transparent',
                        color: '#e74c3c',
                        border: '1px solid #e74c3c',
                        fontSize: '0.9rem',
                      }}
                      title="Delete book"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card" style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: 'var(--bg-soft)',
            border: '2px dashed var(--border)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>📷</div>
            <h2 style={{ margin: '0 0 0.75rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
              No books yet
            </h2>
            <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              Create your first photo book and preserve your precious memories.
            </p>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
              }}
            >
              Create Your First Book
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
