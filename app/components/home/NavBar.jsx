'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NavBar(){
  const [open, setOpen] = useState(false)

  // lock body scroll when mobile menu is open
  useEffect(()=>{
    if(typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    return ()=>{ document.body.style.overflow = '' }
  },[open])

  // close on escape for accessibility
  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') setOpen(false) }
    if(typeof window !== 'undefined') window.addEventListener('keydown', onKey)
    return ()=>{ if(typeof window !== 'undefined') window.removeEventListener('keydown', onKey) }
  },[])

  const linkStyle = { textDecoration: 'none' }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="nav-left">
          <Link href="/" className="logo" style={linkStyle}>Memora</Link>
        </div>

        <nav className={`nav-links ${open? 'open': ''}`} aria-label="Main navigation">
          <Link href="/my-books" onClick={()=>setOpen(false)} style={linkStyle}>My Books</Link>
        </nav>

        <div className="nav-actions">
          <button className={`nav-toggle ${open? 'open':''}`} aria-expanded={open} aria-label="Toggle menu" onClick={()=>setOpen(v=>!v)}>
            <span className="hamburger" aria-hidden></span>
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu (for small screens) */}
      <div className={`mobile-menu ${open? 'open':''}`} role="dialog" aria-modal={open}>
        <div className="mobile-menu-backdrop" onClick={()=>setOpen(false)} aria-hidden />
        <aside className={`mobile-menu-panel ${open? 'open':''}`}>
          <div className="mobile-menu-inner container">
            <div className="mobile-menu-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Link href="/" className="logo" onClick={()=>setOpen(false)} style={linkStyle}>Memora</Link>
              <button className="mobile-close" aria-label="Close menu" onClick={()=>setOpen(false)}>✕</button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/my-books" onClick={()=>setOpen(false)} style={linkStyle}>My Books</Link>
            </nav>
          </div>
        </aside>
      </div>
    </header>
  )
}
