import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MousePointerClick, Layers, FileDown, Palette } from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "Drag & Drop Editor",
    desc: "Pixel-perfect snap grid with editorial baseline alignment. Built for fingers and pointers alike.",
  },
  {
    icon: Layers,
    title: "10+ Layouts",
    desc: "From spreads inspired by Magnum monographs to clean Swiss grids — switch in one click.",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    desc: "Print-ready CMYK with bleed marks. Download the file or let us print it for you.",
  },
  {
    icon: Palette,
    title: "Cover Design",
    desc: "Linen, leatherette, debossed type. Customize the spine, flyleaf, and endpapers.",
  },
];

export function Features() {
  return (
    <section className="border-b" style={{ borderColor: "var(--memora-border)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div
              className="font-mono tracking-label mb-4"
              style={{ fontSize: 11, color: "var(--memora-muted)" }}
            >
              [ 004 — TOOLKIT ]
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              Built for the <span className="italic" style={{ fontWeight: 300 }}>thoughtful</span> archivist.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured card spans 2 columns at top */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7 }}
            className="brutal-card md:col-span-2 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] overflow-hidden"
            style={{ background: "var(--memora-bg)" }}
          >
            <div className="p-10 flex flex-col justify-between min-h-[380px]">
              <div
                className="font-mono tracking-label"
                style={{ fontSize: 11, color: "var(--memora-accent-dark)" }}
              >
                [ FEATURED ]
              </div>
              <div>
                <h3
                  className="font-display mb-5"
                  style={{ fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em" }}
                >
                  An editor that <span className="italic" style={{ fontWeight: 300 }}>respects</span> the page.
                </h3>
                <p
                  className="font-body max-w-md"
                  style={{ fontSize: 15, color: "var(--memora-muted)", lineHeight: 1.55 }}
                >
                  Magnetic guides, paragraph rags, automatic image cropping that
                  honors the rule of thirds. The studio gets out of the way and
                  lets the photograph speak.
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono" style={{ fontSize: 11, color: "var(--memora-muted)" }}>
                <span>v2.4 — APRIL 2026</span>
                <span style={{ width: 4, height: 4, background: "var(--memora-border)" }} />
                <span>WEB · iPAD · DESKTOP</span>
              </div>
            </div>
            <div style={{ borderLeft: "1.5px solid var(--memora-border)" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&q=80"
                alt="Open photo book"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="brutal-card p-8 flex flex-col gap-5"
                style={{ background: "var(--memora-bg)" }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 52,
                      height: 52,
                      background: "var(--memora-ink)",
                      color: "var(--memora-bg)",
                    }}
                  >
                    <Icon size={22} strokeWidth={1.6} />
                  </div>
                  <div className="font-mono" style={{ fontSize: 11, color: "var(--memora-muted)" }}>
                    0{i + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-body mb-2" style={{ fontSize: 20, fontWeight: 700 }}>
                    {f.title}
                  </h3>
                  <p className="font-body" style={{ fontSize: 14, color: "var(--memora-muted)", lineHeight: 1.55 }}>
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
