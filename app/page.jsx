import NavBar from "./components/home/NavBar"
import Hero from "./components/home/Hero"
import Features from "./components/home/Features"
import ThemeCard from "./components/home/ThemeCard"
import Testimonials from "./components/home/Testimonials"
import CTA from "./components/home/CTA"
import Footer from "./components/home/Footer"

export default function Home() {
	return (
		<>
			<NavBar />
			<main>
				<Hero />

				<section className="container features-section">
					<Features />
				</section>

				<section className="container themes-section">
					<h2 className="section-title">Beautiful themes</h2>
					<div className="themes">
						<ThemeCard title="Engagement" />
						<ThemeCard title="Wedding" />
						<ThemeCard title="Travel" />
						<ThemeCard title="Family" />
					</div>
				</section>

				<section className="container testimonials-section">
					<h2 className="section-title">Loved by customers</h2>
					<Testimonials />
				</section>

				<CTA />
			</main>

			<Footer />
		</>
	)
}