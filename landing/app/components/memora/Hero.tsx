import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const stripImages = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", label: "Wedding" },
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80", label: "Travel" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", label: "Family" },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80", label: "Birthday" },
];

const lineVariants = {
  hidden: { y: 80, opacity: 0 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.3 + i * 0.12, duration: 1, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

export function Hero() {
  return (
    <section className="border-b" style={{ borderColor: "var(--memora-border)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-mono tracking-label flex items-center gap-3 mb-10"
            style={{ fontSize: 11, color: "var(--memora-muted)" }}
          >
            <span style={{ width: 32, height: 1, background: "var(--memora-border)" }} />
            [ PRESERVE YOUR MEMORIES ]
          </motion.div>

          <h1
            className="font-display"
            style={{ fontSize: "clamp(48px, 7vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
          >
            <motion.span
              variants={lineVariants}
              initial="hidden"
              animate="show"
              custom={0}
              className="block italic"
              style={{ fontWeight: 300 }}
            >
              Your memories,
            </motion.span>
            <motion.span
              variants={lineVariants}
              initial="hidden"
              animate="show"
              custom={1}
              className="block"
              style={{ fontWeight: 400 }}
            >
              beautifully
            </motion.span>
            <motion.span
              variants={lineVariants}
              initial="hidden"
              animate="show"
              custom={2}
              className="block italic"
              style={{ fontWeight: 300 }}
            >
              bound.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="font-body mt-10 max-w-[460px]"
            style={{ fontSize: 17, lineHeight: 1.55, color: "var(--memora-muted)" }}
          >
            A premium photo book studio. Upload, arrange, and print heirloom-quality
            books in minutes — designed with the patience of an editor, the care of
            a stationer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="mt-10 flex items-center gap-6 flex-wrap"
          >
            <a
              href="#"
              className="brutal-btn font-body inline-flex items-center gap-2 px-6 py-4"
              style={{ fontSize: 14, background: "var(--memora-ink)", color: "var(--memora-bg)" }}
            >
              Start Creating
              <ArrowRight size={16} />
            </a>
            <a
              href="#"
              className="font-body inline-flex items-center gap-2 underline-offset-4 hover:underline"
              style={{ fontSize: 14, color: "var(--memora-text)" }}
            >
              See examples →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-16 flex items-center gap-8 font-mono"
            style={{ fontSize: 11, color: "var(--memora-muted)" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ width: 6, height: 6, background: "var(--memora-accent)" }} />
              12,840+ BOOKS PRINTED
            </div>
            <div>EST. 2024</div>
            <div>EGYPT · WORLDWIDE</div>
          </motion.div>
        </div>

        {/* Right: Spline placeholder block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] w-full"
        >
          {/* SPLINE_EMBED_HERE */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              border: "1.5px solid var(--memora-border)",
              background: "var(--memora-surface)",
              boxShadow: "8px 8px 0 var(--memora-border)",
            }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&q=80"
              alt="Open photo book"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "grayscale(0.15) contrast(1.05)" }}
            />
            <div
              className="absolute top-4 left-4 font-mono px-2 py-1"
              style={{ fontSize: 10, background: "var(--memora-bg)", border: "1px solid var(--memora-border)" }}
            >
              [ 3D PREVIEW ]
            </div>
            <div
              className="absolute bottom-4 right-4 font-mono flex items-center gap-2 px-3 py-2"
              style={{ fontSize: 10, background: "var(--memora-ink)", color: "var(--memora-bg)" }}
            >
              <BookOpen size={12} />
              VOL. 01 — SPRING ’26
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div className="border-t border-b overflow-hidden" style={{ borderColor: "var(--memora-border)" }}>
        <div className="flex marquee-track" style={{ width: "max-content" }}>
          {[...stripImages, ...stripImages, ...stripImages].map((img, i) => (
            <div
              key={i}
              className="relative shrink-0"
              style={{
                width: 300,
                height: 400,
                borderRight: "1.5px solid var(--memora-border)",
              }}
            >
              <ImageWithFallback
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-3 left-3 font-mono px-2 py-1 tracking-label"
                style={{ fontSize: 10, background: "var(--memora-ink)", color: "var(--memora-bg)" }}
              >
                {img.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          .marquee-track { animation: memora-marquee 40s linear infinite; }
          @keyframes memora-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    </section>
  );
}
