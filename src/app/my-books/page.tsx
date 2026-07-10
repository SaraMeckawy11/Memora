'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '@/styles/memora.css'
import '@/styles/my-books/my-books.css'

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
      year: 'numeric',
    })
  }

  const handleCreateNew = () => {
    // Clear any existing draft to start fresh at step 1
    localStorage.removeItem('photobook_draft')
    localStorage.removeItem('photobook-draft')
    router.push('/create')
  }

  return (
    <div className="memora-root mybooks-root">
      <nav className="mybooks-nav">
        <Link href="/" className="mybooks-logo">memora</Link>
        <button className="m-btn-secondary" onClick={handleCreateNew} type="button">
          start a new book →
        </button>
      </nav>

      <div className="mybooks-container">
        {loading ? (
          <div className="mybooks-loading">Loading your books…</div>
        ) : (
          <>
            <div className="mybooks-header">
              <h1 className="m-display mybooks-title">My Books</h1>
              <p className="m-serif mybooks-subtitle">
                {books.length > 0
                  ? `${books.length} saved book${books.length > 1 ? 's' : ''}`
                  : 'Your saved photo books will appear here'}
              </p>
            </div>

            {books.length > 0 ? (
              <div className="mybooks-grid">
                {books.map((book) => (
                  <div key={book.id} className="mybooks-card">
                    <div className="mybooks-cover">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.name || 'Book cover'} />
                      ) : (
                        <div className="mybooks-cover-placeholder">
                          <span className="mark">✦</span>
                          <p style={{ margin: 0, fontSize: '0.9rem' }}>{book.pageCount || 20} pages</p>
                        </div>
                      )}
                      <div className={`mybooks-badge ${book.status !== 'draft' ? 'mybooks-badge--ready' : ''}`}>
                        {book.status === 'draft' ? 'draft' : 'ready'}
                      </div>
                    </div>

                    <div className="mybooks-info">
                      <h3 className="mybooks-name">{book.name || 'Untitled Book'}</h3>

                      <div className="mybooks-meta">
                        <span>{book.sizeName || 'Standard'}</span>
                        <span>·</span>
                        <span>{book.pageCount || 20} pages</span>
                        <span>·</span>
                        <span>{book.photoCount || 0} photos</span>
                      </div>

                      <p className="mybooks-date">
                        Last edited {formatDate(book.updatedAt || book.createdAt || new Date())}
                      </p>

                      <div className="mybooks-actions">
                        <Link href={`/create?bookId=${book.id}`} className="mybooks-action mybooks-action--primary">
                          Edit
                        </Link>
                        <Link href={`/order?bookId=${book.id}`} className="mybooks-action mybooks-action--ghost">
                          Order
                        </Link>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="mybooks-action mybooks-action--danger"
                          title="Delete book"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mybooks-empty">
                <span className="mark">✦</span>
                <h2>No books yet</h2>
                <p>Create your first photo book and preserve your precious memories.</p>
                <button onClick={handleCreateNew} className="m-btn-primary" type="button">
                  Create your first book <span className="m-btn-primary__arrow">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
