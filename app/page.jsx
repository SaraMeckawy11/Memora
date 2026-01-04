import NavBar from "./components/home/NavBar"
import Hero from "./components/home/Hero"
import Features from "./components/home/Features"
import ThemeCard from "./components/home/ThemeCard"
import Testimonials from "./components/home/Testimonials"
import CTA from "./components/home/CTA"
import Footer from "./components/home/Footer"

import "@/styles/HomePage.css"

export default function Home() {
  return (
    <>
      <NavBar />

      <main>
        {/* HERO */}
        <Hero />

        {/* FEATURES */}
        <section className="container">
          <Features />
        </section>

        {/* THEMES */}
        <section className="container">
          <h2 className="section-title">Beautiful themes</h2>
          <div className="themes">
            <ThemeCard title="Engagement" />
            <ThemeCard title="Wedding" />
            <ThemeCard title="Travel" />
            <ThemeCard title="Family" />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container">
          <h2 className="section-title">Loved by customers</h2>
          <Testimonials />
        </section>

        {/* CTA */}
        <section className="container">
          <CTA />
        </section>
      </main>

      <Footer />
    </>
  )
}
