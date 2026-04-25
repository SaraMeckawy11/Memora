export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--memora-border)", background: "var(--memora-bg)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="font-display italic" style={{ fontSize: 28, letterSpacing: "0.02em" }}>
            Memora
          </div>
          <p
            className="font-body mt-4 max-w-xs"
            style={{ fontSize: 13, color: "var(--memora-muted)", lineHeight: 1.6 }}
          >
            A small studio printing the books your photos always wanted to be.
            Bound in Cairo, shipped worldwide.
          </p>
          <div
            className="font-mono tracking-label mt-8"
            style={{ fontSize: 10, color: "var(--memora-muted)" }}
          >
            © 2026 — ALL RIGHTS RESERVED
          </div>
        </div>

        <div>
          <div
            className="font-mono tracking-label mb-5"
            style={{ fontSize: 10, color: "var(--memora-muted)" }}
          >
            [ NAVIGATE ]
          </div>
          <ul className="space-y-3 font-body" style={{ fontSize: 13 }}>
            {["Examples", "How it works", "Pricing", "FAQ", "Studio"].map((l) => (
              <li key={l}>
                <a href="#" className="hover:opacity-60 transition-opacity" style={{ color: "var(--memora-text)" }}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div
            className="font-mono tracking-label mb-5"
            style={{ fontSize: 10, color: "var(--memora-muted)" }}
          >
            [ ELSEWHERE ]
          </div>
          <ul className="space-y-3 font-body" style={{ fontSize: 13 }}>
            {["Instagram", "Pinterest", "Behance", "Newsletter"].map((l) => (
              <li key={l}>
                <a href="#" className="hover:opacity-60 transition-opacity inline-flex items-center gap-2" style={{ color: "var(--memora-text)" }}>
                  {l} <span style={{ opacity: 0.5 }}>↗</span>
                </a>
              </li>
            ))}
          </ul>
          <div
            className="font-mono tracking-label mt-10"
            style={{ fontSize: 10, color: "var(--memora-muted)" }}
          >
            HELLO@MEMORA.STUDIO
          </div>
        </div>
      </div>

      <div
        className="border-t font-mono tracking-label py-4 px-6 md:px-10 flex justify-between flex-wrap gap-2 max-w-[1280px] mx-auto"
        style={{ borderColor: "var(--memora-border)", fontSize: 10, color: "var(--memora-muted)" }}
      >
        <span>MEMORA / 26.04 / VOL. 01</span>
        <span>BOUND IN CAIRO · DELIVERED WORLDWIDE</span>
        <span>v 2.4.1</span>
      </div>
    </footer>
  );
}
