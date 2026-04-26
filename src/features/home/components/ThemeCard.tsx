'use client'
import { useRouter } from 'next/navigation'

export default function ThemeCard({ title }) {
	const router = useRouter()
	return (
		<article className="theme-card">
			<div className="theme-preview" />
			<div className="theme-body">
				<h3>{title}</h3>
				<p className="muted">Handcrafted layouts and typography for your story.</p>
				<div className="theme-actions">
					<button className="btn btn-sm" onClick={() => router.push('/editor')}>Customize</button>
				</div>
			</div>
		</article>
	)
}