import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const steps = [
  {
    n: "01",
    title: "Upload your moments",
    desc: "Drag, drop, or import from your phone. We handle every format and resolution — no fiddling with file types.",
    img: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=80",
  },
  {
    n: "02",
    title: "Design in minutes",
    desc: "Choose from 10+ editorial layouts or freeform the page. Live print preview shows you exactly what arrives.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    n: "03",
    title: "Bound & delivered",
    desc: "Heirloom binding, museum-grade paper, your book at your door in 7 days — gift-ready, no extra packaging required.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
];

export function HowItWorks() {
  return (
    <section
      className="border-b"
      style={{ background: "var(--memora-surface)", borderColor: "var(--memora-border)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div
              className="font-mono tracking-label mb-4"
              style={{ fontSize: 11, color: "var(--memora-muted)" }}
            >
              [ 003 — PROCESS ]
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
              <span className="italic" style={{ fontWeight: 300 }}>How</span> it works.
            </h2>
          </div>
          <p
            className="font-body max-w-sm"
            style={{ fontSize: 15, color: "var(--memora-muted)", lineHeight: 1.55 }}
          >
            Three deliberate steps. No subscriptions, no clutter — just a quiet
            studio for the photos you don’t want to lose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="brutal-card p-7 flex flex-col"
              style={{ background: "var(--memora-bg)" }}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="font-mono"
                  style={{ fontSize: 96, lineHeight: 0.85, color: "var(--memora-accent)", fontWeight: 500 }}
                >
                  {s.n}
                </div>
                <div
                  className="font-mono tracking-label px-2 py-1"
                  style={{
                    fontSize: 10,
                    border: "1px solid var(--memora-border)",
                    color: "var(--memora-text)",
                  }}
                >
                  STEP
                </div>
              </div>

              <div
                className="w-full aspect-[4/3] mb-6"
                style={{ border: "1.5px solid var(--memora-border)" }}
              >
                <ImageWithFallback
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(0.1) contrast(1.05)" }}
                />
              </div>

              <h3 className="font-body mb-3" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                {s.title}
              </h3>
              <p className="font-body" style={{ fontSize: 15, color: "var(--memora-muted)", lineHeight: 1.55 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
