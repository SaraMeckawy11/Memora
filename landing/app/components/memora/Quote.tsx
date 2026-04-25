import { motion } from "motion/react";

const line1 = "Every photo tells a story.".split(" ");
const line2 = "We give it a cover.".split(" ");

export function Quote() {
  return (
    <section
      className="border-b"
      style={{ background: "var(--memora-ink)", borderColor: "var(--memora-border)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-32 text-center">
        <div
          className="font-mono tracking-label mb-10"
          style={{ fontSize: 11, color: "var(--memora-accent)" }}
        >
          [ 006 — MANIFESTO ]
        </div>

        <h2
          className="font-display italic"
          style={{
            fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 1.1,
            color: "var(--memora-bg)",
            fontWeight: 300,
            letterSpacing: "-0.015em",
          }}
        >
          <span className="block">
            {line1.map((w, i) => (
              <motion.span
                key={i}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.7 }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {line2.map((w, i) => (
              <motion.span
                key={i}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.7 }}
                className="inline-block mr-3"
                style={{ color: "var(--memora-accent)" }}
              >
                {w}
              </motion.span>
            ))}
          </span>
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="font-mono tracking-label mt-12"
          style={{ fontSize: 11, color: "var(--memora-muted)" }}
        >
          — MEMORA STUDIO, EST. 2024
        </motion.div>
      </div>
    </section>
  );
}
