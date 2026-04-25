import "./components/memora-tokens.css";
import { Navbar } from "./components/memora/Navbar";
import { Hero } from "./components/memora/Hero";
import { HowItWorks } from "./components/memora/HowItWorks";
import { Features } from "./components/memora/Features";
import { Themes } from "./components/memora/Themes";
import { Quote } from "./components/memora/Quote";
import { PricingCTA } from "./components/memora/PricingCTA";
import { Footer } from "./components/memora/Footer";

export default function App() {
  return (
    <div className="memora-root min-h-screen w-full">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Themes />
      <Quote />
      <PricingCTA />
      <Footer />
    </div>
  );
}
