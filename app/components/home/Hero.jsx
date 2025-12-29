'use client'
import Link from 'next/link'

export default function Hero() {
	return (
		<section className="hero-hero">
			<div className="hero-inner container">
				<div className="hero-copy">
					<h1 className="hero-title">Memora — your photo books, reimagined</h1>
					<p className="hero-sub">Create beautiful, tactile photo books from your favorite moments. Minimal design, effortless tools, lasting keepsakes.</p>
				<div className="hero-ctas">
					<Link href="/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>Create Your Book</Link>
				</div>
				</div>

				<div className="hero-media" aria-hidden>
					<div className="mock-book">
						<div className="page" />
						<div className="page back" />
					</div>
				</div>
			</div>
		</section>
	)
}