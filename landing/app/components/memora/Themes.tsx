import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const themes = [
  {
    label: "WEDDING",
    title: "Vows & Vellum",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    rotate: -1.5,
  },
  {
    label: "TRAVEL",
    title: "Passages",
    img: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80",
    rotate: 0,
  },
  {
    label: "FAMILY",
    title: "Heirloom",
    img: "https://images.unsplash.com/photo-1484665754804-74b091211472?w=800&q=80",
    rotate: 1.5,
  },
];

export function Themes() {
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
              [ 005 — COLLECTIONS ]
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              Made for <span className="italic" style={{ fontWeight: 300 }}>every</span> memory.
            </h2>
          </div>
          <a
            href="#"
            className="font-body underline-offset-4 hover:underline"
            style={{ fontSize: 14 }}
          >
            View all 12 collections →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 place-items-center">
          {themes.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ rotate: t.rotate * 4, y: 80, opacity: 0 }}
              whileInView={{ rotate: t.rotate, y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ delay: i * 0.12, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ rotate: 0, y: -6 }}
              className="relative"
              style={{
                width: 360,
                maxWidth: "100%",
                height: 480,
                border: "1.5px solid var(--memora-border)",
                background: "var(--memora-bg)",
                boxShadow: "6px 6px 0 var(--memora-border)",
              }}
            >
              <ImageWithFallback
                src={t.img}
                alt={t.title}
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(0.05) contrast(1.05)" }}
              />
              <div
                className="absolute bottom-4 left-4 font-mono tracking-label px-2 py-1"
                style={{ fontSize: 11, background: "var(--memora-ink)", color: "var(--memora-bg)" }}
              >
                {t.label}
              </div>
              <div
                className="absolute top-4 right-4 font-mono px-2 py-1"
                style={{
                  fontSize: 10,
                  background: "var(--memora-bg)",
                  border: "1px solid var(--memora-border)",
                }}
              >
                0{i + 1} / 03
              </div>
              <div
                className="absolute bottom-4 right-4 font-display italic"
                style={{ fontSize: 22, color: "var(--memora-bg)", fontWeight: 400, mixBlendMode: "difference" }}
              >
                {t.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
