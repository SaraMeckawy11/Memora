import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function PricingCTA() {
  return (
    <section
      style={{
        background: "var(--memora-accent)",
        borderTop: "2px solid var(--memora-border)",
        borderBottom: "2px solid var(--memora-border)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono tracking-label mb-5"
            style={{ fontSize: 11, color: "var(--memora-ink)" }}
          >
            [ 007 — PRICING ]
          </motion.div>
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--memora-ink)",
            }}
          >
            <span className="italic" style={{ fontWeight: 300 }}>Start from</span> EGP 299
          </motion.h2>
          <p className="font-body mt-6 max-w-md" style={{ fontSize: 15, color: "var(--memora-ink)", lineHeight: 1.55 }}>
            20-page softcover, archival paper, free domestic shipping. Upgrade
            to linen-bound hardcover for EGP 549.
          </p>
        </div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex md:justify-end"
        >
          <a
            href="#"
            className="brutal-btn font-body inline-flex items-center gap-3 px-8 py-5"
            style={{
              fontSize: 16,
              background: "var(--memora-ink)",
              color: "var(--memora-bg)",
              boxShadow: "6px 6px 0 var(--memora-border)",
            }}
          >
            Create your book
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
