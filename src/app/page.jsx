import NavBar from "@/features/home/components/NavBar"
import Hero from "@/features/home/components/Hero"
import Features from "@/features/home/components/Features"
import ThemeCard from "@/features/home/components/ThemeCard"
import Testimonials from "@/features/home/components/Testimonials"
import CTA from "@/features/home/components/CTA"
import Footer from "@/features/home/components/Footer"

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
