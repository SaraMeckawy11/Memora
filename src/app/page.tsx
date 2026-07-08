"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImage from "@/assets/memora-hero.jpg";
import "@/styles/memora.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cool-toned, turquoise/sage/ocean aligned photography (no pink/warm tones)
const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format", // ocean beach
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80&auto=format", // foggy forest
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=80&auto=format", // wave
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80&auto=format", // lake mountain
  "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=600&q=80&auto=format", // misty mountain
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80&auto=format", // alpine lake
  "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&q=80&auto=format", // coastal cliffs
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80&auto=format", // ocean aerial
  "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&q=80&auto=format", // foggy pines
];

const POLAROIDS = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80&auto=format",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80&auto=format",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80&auto=format",
];

const NAV_LINKS = [
  { href: "#how", label: "how it works" },
  { href: "#themes", label: "themes" },
  { href: "#pricing", label: "pricing" },
  { href: "/my-books", label: "my books" },
];

const LandingPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Smooth-scroll for in-page anchor links (respects reduced-motion)
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setMenuOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        // Skip entrance/scroll animations; keep everything visible & static.
        const track = rootRef.current?.querySelector<HTMLDivElement>(".m-marquee__track");
        if (track) gsap.to(track, { x: () => -(track.scrollWidth / 2), duration: 45, ease: "none", repeat: -1 });
        const nav = rootRef.current?.querySelector<HTMLElement>(".m-nav");
        const onScrollR = () => {
          if (!nav) return;
          nav.classList.toggle("is-scrolled", window.scrollY > 24);
        };
        window.addEventListener("scroll", onScrollR, { passive: true });
        onScrollR();
        return;
      }
      // ---- NAV reveal + scroll state ----
      gsap.from(".m-nav", { y: -80, opacity: 0, duration: 1, ease: "power4.out" });
      const nav = rootRef.current?.querySelector<HTMLElement>(".m-nav");
      const onScroll = () => {
        if (!nav) return;
        if (window.scrollY > 24) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      // ---- HERO entrance ----
      gsap.from(".pill-tag", { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: "back.out(2)" });
      gsap.from(".h1-line span", { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.11, delay: 0.35, ease: "power4.out" });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.9, delay: 0.78, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, delay: 0.95, ease: "power3.out", stagger: 0.08 });
      gsap.from(".hero-proof", { y: 16, opacity: 0, duration: 0.7, delay: 1.15, ease: "power3.out" });
      gsap.from(".hero-stat", { y: 20, opacity: 0, duration: 0.7, delay: 1.1, ease: "power3.out", stagger: 0.1 });
      gsap.from(".hero-right", { y: 60, opacity: 0, duration: 1.2, delay: 0.45, ease: "power3.out" });
      gsap.from(".hero-polaroid", {
        y: 40, opacity: 0, rotation: (i: number) => (i % 2 ? 12 : -12),
        scale: 0.85, duration: 1, delay: 0.9, ease: "back.out(1.6)", stagger: 0.15,
      });
      gsap.from(".hero-blob", { scale: 0.4, opacity: 0, duration: 1.6, ease: "power3.out", stagger: 0.2 });

      // ---- HERO parallax (scroll-linked) ----
      gsap.to(".hero-blob.b1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-blob.b2", { yPercent: -25, xPercent: 10, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".m-hero__visual img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-polaroid.p1", { y: -80, rotate: -18, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
      gsap.to(".hero-polaroid.p2", { y: -140, rotate: 14, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
      gsap.to(".hero-polaroid.p3", { y: -100, rotate: -8, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
      gsap.to(".m-hero__left", { y: -40, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });

      // ---- MARQUEE ----
      const track = rootRef.current?.querySelector<HTMLDivElement>(".m-marquee__track");
      if (track) {
        gsap.to(track, {
          x: () => -(track.scrollWidth / 2),
          duration: 35,
          ease: "none",
          repeat: -1,
        });
      }

      // ---- WHY ----
      gsap.from(".why-left > *", {
        scrollTrigger: { trigger: ".m-why", start: "top 80%", once: true },
        x: -40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
      });
      gsap.from(".why-right .m-feature", {
        scrollTrigger: { trigger: ".m-why", start: "top 80%", once: true },
        x: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.15,
      });

      // ---- EDITOR ----
      gsap.from(".m-editor h2, .m-editor .m-section-label", {
        scrollTrigger: { trigger: ".m-editor", start: "top 80%", once: true },
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      });
      gsap.from(".m-editor__mockup", {
        scrollTrigger: { trigger: ".m-editor", start: "top 70%", once: true },
        scale: 0.92, opacity: 0, duration: 1.1, ease: "power3.out",
      });
      gsap.from(".m-editor__pills > *", {
        scrollTrigger: { trigger: ".m-editor__pills", start: "top 90%", once: true },
        y: 20, opacity: 0, scale: 0.8, duration: 0.8, ease: "back.out(2)", stagger: 0.1,
      });

      // ---- THEMES ----
      gsap.from(".m-themes__head > *", {
        scrollTrigger: { trigger: ".m-themes", start: "top 80%", once: true },
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
      });
      const cards = gsap.utils.toArray<HTMLElement>(".m-theme-card");
      cards.forEach((card, i) => {
        const finalRotation = card.classList.contains("is-1") ? -2 : card.classList.contains("is-3") ? 2 : 0;
        gsap.from(card, {
          scrollTrigger: { trigger: ".m-themes__grid", start: "top 80%", once: true },
          y: 80, opacity: 0, rotation: finalRotation + (i % 2 ? 8 : -8),
          scale: 0.9, duration: 1, ease: "back.out(1.4)", delay: i * 0.12,
          onComplete: () => {
            gsap.set(card, { clearProps: "transform" });
          },
        });
      });

      // ---- QUOTES ----
      gsap.from(".m-quotes__head > *", {
        scrollTrigger: { trigger: ".m-quotes", start: "top 80%", once: true },
        y: 36, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
      });
      gsap.from(".m-quote", {
        scrollTrigger: { trigger: ".m-quotes__grid", start: "top 82%", once: true },
        y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
      });

      // ---- PRICING ----
      gsap.from(".m-pricing__head > *", {
        scrollTrigger: { trigger: ".m-pricing", start: "top 80%", once: true },
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      });
      gsap.from(".m-pricing__card", {
        scrollTrigger: { trigger: ".m-pricing__card", start: "top 85%", once: true },
        y: 50, opacity: 0, scale: 0.96, duration: 1, ease: "power3.out",
      });
      gsap.from(".m-pricing__list li", {
        scrollTrigger: { trigger: ".m-pricing__list", start: "top 90%", once: true },
        x: -16, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, delay: 0.15,
      });

      // ---- FINALE ----
      gsap.from(".m-finale__eyebrow, .m-finale h2, .m-finale__sub, .m-finale__cta, .m-finale__trust, .m-finale__sig", {
        scrollTrigger: { trigger: ".m-finale", start: "top 78%", once: true },
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      });

      const scrollHandler = () => onScroll();
      return () => {
        window.removeEventListener("scroll", scrollHandler);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="memora-root">
      {/* ============= NAV ============= */}
      <nav className="m-nav">
        <div className="m-nav__inner">
          <Link href="/" className="m-nav__logo">
            <span className="m-nav__logo-dot" aria-hidden="true" />
            Memora
          </Link>
          <div className="m-nav__links">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={(e) => handleAnchor(e, l.href)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="m-nav__actions">
            <Link href="/create" className="m-nav__cta">
              <span>Get started</span>
              <span className="m-nav__cta-arrow">→</span>
            </Link>
            <button
              type="button"
              className={`m-nav__burger ${menuOpen ? "is-open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* ============= MOBILE MENU ============= */}
      <div className={`m-drawer ${menuOpen ? "is-open" : ""}`} role="dialog" aria-modal="true">
        <button
          type="button"
          className="m-drawer__scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <aside className="m-drawer__panel">
          <div className="m-drawer__head">
            <span className="m-nav__logo">
              <span className="m-nav__logo-dot" aria-hidden="true" />
              Memora
            </span>
            <button
              type="button"
              className="m-drawer__close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <span className="m-pill m-drawer__pill">
            <span className="m-pill__dot" aria-hidden="true" />
            your memories, beautifully bound
          </span>
          <nav className="m-drawer__links">
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                style={{ ["--i" as string]: String(i) }}
              >
                <span className="m-drawer__idx">0{i + 1}</span>
                {l.label}
                <span className="m-drawer__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
          <div className="m-drawer__foot">
            <Link href="/create" className="m-btn-primary m-drawer__cta" onClick={() => setMenuOpen(false)}>
              Create your book
              <span className="m-btn-primary__arrow">→</span>
            </Link>
            <div className="m-drawer__meta">
              <a href="mailto:hello@memora.app">hello@memora.app</a>
              <span>cairo · egypt</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ============= HERO ============= */}
      <header className="m-hero">
        <div className="hero-blob b1" aria-hidden="true" />
        <div className="hero-blob b2" aria-hidden="true" />
        <div className="hero-blob b3" aria-hidden="true" />
        <div className="m-hero__grid" aria-hidden="true" />

        <div className="m-hero__inner">
          <div className="m-hero__left">
            <span className="m-pill pill-tag">
              <span className="m-pill__dot" aria-hidden="true" />
              now printing · winter '26
            </span>
            <h1>
              <span className="h1-line"><span>Every photo</span></span>
              <span className="h1-line"><span>deserves a </span><span className="home">home.</span></span>
            </h1>
            <p className="m-hero__sub hero-sub">
              From weekend trips to wedding days — Memora turns your
              camera roll into something you can actually hold.
            </p>
            <div className="m-hero__ctas">
              <Link href="/create" className="m-btn-primary hero-cta">
                Create your book
                <span className="m-btn-primary__arrow">→</span>
              </Link>
              <Link href="#themes" className="m-btn-secondary hero-cta" onClick={(e) => handleAnchor(e, "#themes")}>See examples</Link>
            </div>
            <div className="m-hero__stats">
              <div className="hero-stat">
                <div className="hero-stat__num">2,400+</div>
                <div className="hero-stat__label">books printed</div>
              </div>
              <div className="hero-stat__sep" aria-hidden="true" />
              <div className="hero-stat">
                <div className="hero-stat__num">4.9<span>★</span></div>
                <div className="hero-stat__label">avg. rating</div>
              </div>
              <div className="hero-stat__sep" aria-hidden="true" />
              <div className="hero-stat">
                <div className="hero-stat__num">5–7d</div>
                <div className="hero-stat__label">to your door</div>
              </div>
            </div>
          </div>

          <div className="m-hero__right hero-right">
            <div className="m-hero__visual">
              <Image
                src={heroImage}
                alt="An open Memora photo book on a marble surface with a film camera, eucalyptus, matcha, and coastal polaroids"
                width={1024}
                height={1024}
                priority
              />
              <div className="m-hero__badge">
                <span className="m-hero__badge-k">✦</span>
                <span>premium paper · hand-stitched</span>
              </div>
            </div>

            <div className="hero-polaroid p1">
              <img src={POLAROIDS[0]} alt="" loading="lazy" />
              <span>lake · 07.24</span>
            </div>
            <div className="hero-polaroid p2">
              <img src={POLAROIDS[1]} alt="" loading="lazy" />
              <span>alps · 06.24</span>
            </div>
            <div className="hero-polaroid p3">
              <img src={POLAROIDS[2]} alt="" loading="lazy" />
              <span>coast · 05.24</span>
            </div>
          </div>
        </div>

        <div className="m-hero__scroll" aria-hidden="true">
          <span>scroll</span>
          <span className="m-hero__scroll-line" />
        </div>
      </header>

      {/* ============= MARQUEE ============= */}
      <section className="m-marquee" aria-hidden="true">
        <div className="m-marquee__track">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
            <div key={i} className="m-marquee__item">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ============= WHY MEMORA ============= */}
      <section id="how" className="m-why">
        <div className="why-left">
          <div className="m-section-label">[ why memora ]</div>
          <h2 className="m-why__head">
            Because some moments are too good to <span className="hl">live only on a screen.</span>
          </h2>
          <span className="m-pill m-why__pill">✦ printed with love</span>
        </div>

        <div className="why-right m-why__list">
          {[
            ["01", "Drag & drop editor", "Arrange photos across 10+ layouts. No design skills needed."],
            ["02", "Cover studio", "Design your front, back, and spine exactly as you imagine."],
            ["03", "Doorstep delivery", "We handle print, bind, and ship. You just press order."],
          ].map(([num, title, desc]) => (
            <div key={num} className="m-feature">
              <div className="m-feature__num">{num}</div>
              <div>
                <h3 className="m-feature__title">{title}</h3>
                <p className="m-feature__desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============= EDITOR (DARK) ============= */}
      <section className="m-editor">
        <div className="m-section-label">[ the editor ]</div>
        <h2>Designed for your imagination.</h2>
        <div className="m-editor__mockup">
          <div className="m-editor__sidebar">
            <div className="m-editor__icon is-active">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="1" width="7" height="7" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="10" width="16" height="7" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
            <div className="m-editor__icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="7" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="10" width="16" height="7" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
            <div className="m-editor__icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
          </div>
          <div className="m-editor__canvas">
            <div className="m-editor__row">
              <div className="m-editor__photo">photo · 01</div>
              <div className="m-editor__photo">photo · 02</div>
            </div>
            <div className="m-editor__caption">caption · cairo, july 2024 — golden hour on the rooftop_</div>
          </div>
        </div>
        <div className="m-editor__pills">
          <span className="m-pill m-pill--solid">✦ undo / redo</span>
          <span className="m-pill m-pill--solid">✦ auto-save</span>
        </div>
      </section>

      {/* ============= THEMES ============= */}
      <section id="themes" className="m-themes">
        <div className="m-themes__head">
          <div className="m-section-label">[ made for every memory ]</div>
          <h2>A theme for <span className="hl">every chapter.</span></h2>
        </div>
        <div className="m-themes__grid">
          {[
            { cls: "is-1", label: "Coastal",   img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80&auto=format" },
            { cls: "is-2", label: "Travel",    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&q=80&auto=format" },
            { cls: "is-3", label: "Adventure", img: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=700&q=80&auto=format" },
          ].map((t) => (
            <article key={t.label} className={`m-theme-card ${t.cls}`}>
              <img src={t.img} alt={`${t.label} theme preview`} loading="lazy" />
              <div className="m-theme-card__sticker">✦ new</div>
              <div className="m-theme-card__label">{t.label}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ============= TESTIMONIALS ============= */}
      <section className="m-quotes">
        <div className="m-quotes__head">
          <div className="m-section-label">[ loved by makers ]</div>
          <h2>Kept on coffee tables <span className="hl">everywhere.</span></h2>
        </div>
        <div className="m-quotes__grid">
          {[
            {
              q: "I cried opening it. My whole summer in Greece, sitting on my coffee table. Worth every pound.",
              n: "Layla H.", l: "Cairo, EG",
            },
            {
              q: "Way nicer than I expected. Paper feels expensive, the binding is real. My mom thinks I bought it from a shop.",
              n: "Omar K.", l: "Riyadh, SA",
            },
            {
              q: "Made one for my best friend's birthday and now everyone in the group chat wants one. The editor is so fun.",
              n: "Yasmin R.", l: "Dubai, UAE",
            },
          ].map((t) => (
            <article key={t.n} className="m-quote">
              <span className="m-quote__rating">★ ★ ★ ★ ★</span>
              <p className="m-quote__text">"{t.q}"</p>
              <div className="m-quote__author">
                <span className="m-quote__avatar" aria-hidden="true">{t.n.charAt(0)}</span>
                <div>
                  <div className="m-quote__name">{t.n}</div>
                  <div className="m-quote__loc">{t.l} · verified order</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section id="pricing" className="m-pricing">
        <div className="m-pricing__head">
          <div className="m-section-label">[ start creating ]</div>
          <h2 className="m-pricing__title">
            Simple, <span className="hl">honest pricing.</span>
          </h2>
          <p className="m-pricing__lede">
            Design your entire book for free. You only pay when you're
            ready to hold it in your hands.
          </p>
        </div>

        <div className="m-pricing__card">
          <div className="m-pricing__ribbon">most loved</div>

          <div className="m-pricing__top">
            <div>
              <div className="m-pricing__plan">The Memora Book</div>
              <div className="m-pricing__plan-sub">hardcover · 20 pages · lay-flat binding</div>
            </div>
            <div className="m-pricing__price">
              <span className="m-pricing__currency">EGP</span>
              <span className="m-pricing__amount">299</span>
              <span className="m-pricing__per">/ book</span>
            </div>
          </div>

          <div className="m-pricing__divider" aria-hidden="true" />

          <ul className="m-pricing__list">
            {[
              "20 premium lay-flat pages included",
              "Hardcover or softcover, your choice",
              "Drag & drop editor with auto-layout",
              "Design free — no account needed",
              "Ships to your door in 5–7 days",
            ].map((item) => (
              <li key={item}>
                <span className="m-pricing__check" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <Link href="/create" className="m-pricing__btn">
            Start your book
            <span className="m-btn-primary__arrow">→</span>
          </Link>
          <div className="m-pricing__fine">
            + EGP 15 / extra page · free shipping over EGP 800 · 30-day love guarantee
          </div>
        </div>
      </section>

      {/* ============= FINALE ============= */}
      <section className="m-finale">
        <div className="m-finale__inner">
          <div className="m-finale__eyebrow">
            <span className="dot" />
            <span>your story, bound in print</span>
          </div>
          <h2>
            One last page.<br />
            <span className="hl">Then it's yours forever.</span>
          </h2>
          <p className="m-finale__sub">
            Start with a single photo. End with a book you'll still open in ten years —
            printed on archival paper, stitched by hand, made just for you.
          </p>
          <Link href="/create" className="m-finale__cta">Begin your Memora →</Link>
          <div className="m-finale__trust">
            <span>archival paper</span>
            <span>hand-stitched binding</span>
            <span>ships worldwide</span>
            <span>30-day love guarantee</span>
          </div>
          <div className="m-finale__sig">— made in cairo, for the moments worth keeping.</div>
        </div>
      </section>

      {/* ============= FOOTER ============= */}
      <footer className="m-footer">
        <div className="m-footer__grid">
          <div className="m-footer__brand">
            <div className="m-footer__logo">
              <span className="m-nav__logo-dot" aria-hidden="true" />
              Memora
            </div>
            <div className="m-footer__tag">
              Your memories, beautifully bound — printed on archival
              paper and stitched by hand in Cairo.
            </div>
            <div className="m-footer__social">
              <a href="https://instagram.com" aria-label="Instagram">Instagram</a>
              <a href="https://tiktok.com" aria-label="TikTok">TikTok</a>
              <a href="mailto:hello@memora.app" aria-label="Email">Email</a>
            </div>
          </div>
          <div className="m-footer__col">
            <h4>explore</h4>
            <Link href="#how" onClick={(e) => handleAnchor(e, "#how")}>how it works</Link>
            <Link href="#themes" onClick={(e) => handleAnchor(e, "#themes")}>themes</Link>
            <Link href="#pricing" onClick={(e) => handleAnchor(e, "#pricing")}>pricing</Link>
            <Link href="/my-books">my books</Link>
          </div>
          <div className="m-footer__col">
            <h4>studio</h4>
            <Link href="#">about</Link>
            <Link href="#">journal</Link>
            <Link href="#">press kit</Link>
            <Link href="/admin">admin</Link>
          </div>
          <div className="m-footer__col m-footer__col--cta">
            <h4>start today</h4>
            <p className="m-footer__cta-copy">Turn your camera roll into a book you'll keep forever.</p>
            <Link href="/create" className="m-footer__cta-btn">
              Create your book
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="m-footer__wordmark" aria-hidden="true">Memora</div>

        <div className="m-footer__bar">
          <span>© 2026 Memora</span>
          <span className="brand-line" aria-hidden="true" />
          <span>made in cairo · egypt</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
