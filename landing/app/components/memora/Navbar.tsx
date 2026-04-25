import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  const links = ["Examples", "How it works", "Pricing", "Stories"];
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b w-full"
      style={{ background: "var(--memora-bg)", borderColor: "var(--memora-border)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
        <a href="#" className="font-display italic" style={{ fontSize: 22, letterSpacing: "0.02em" }}>
          Memora
        </a>
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="font-body hover:opacity-60 transition-opacity"
              style={{ fontSize: 13, color: "var(--memora-text)" }}
            >
              {l}
            </a>
          ))}
        </div>
        <a
          href="#"
          className="brutal-btn font-body inline-flex items-center gap-2 px-5 py-3"
          style={{
            fontSize: 13,
            background: "var(--memora-ink)",
            color: "var(--memora-bg)",
          }}
        >
          Create your book
          <ArrowRight size={14} strokeWidth={2} />
        </a>
      </div>
    </motion.nav>
  );
}
