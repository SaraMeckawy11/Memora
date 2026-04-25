'use client'
import Link from 'next/link'

export default function CTA(){
  return (
    <section className="cta container">
      <div className="cta-inner">
        <div>
          <h2>Ready to turn photos into keepsakes?</h2>
          <p>Start a project, pick a theme, and have your book printed and delivered.</p>
        </div>
        <div>
          <Link href="/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>Start Your Book</Link>
        </div>
      </div>
    </section>
  )
}
