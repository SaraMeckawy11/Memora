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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      const nav = rootRef.current?.querySelector<HTMLElement>(".m-nav");
      const onScroll = () => {
        if (!nav) return;
        nav.classList.toggle("is-scrolled", window.scrollY > 24);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      if (reduce) {
        return () => window.removeEventListener("scroll", onScroll);
      }

      gsap.from(".m-nav", { y: -32, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(".pill-tag", { y: 18, opacity: 0, duration: 0.55, delay: 0.1, ease: "power3.out" });
      gsap.from(".h1-line span", { yPercent: 105, opacity: 0, duration: 0.85, stagger: 0.08, delay: 0.2, ease: "power4.out" });
      gsap.from(".hero-sub, .hero-cta", { y: 20, opacity: 0, duration: 0.7, delay: 0.8, ease: "power3.out", stagger: 0.08 });
      gsap.from(".hero-stat", { y: 20, opacity: 0, duration: 0.7, delay: 1.1, ease: "power3.out", stagger: 0.1 });
      gsap.from(".hero-right", { y: 60, opacity: 0, duration: 1.2, delay: 0.45, ease: "power3.out" });
      gsap.from(".m-hero__visual", {
        y: 44,
        opacity: 0,
        scale: 0.94,
        rotate: 2,
        duration: 1.05,
        delay: 0.55,
        ease: "power3.out",
      });
      gsap.fromTo(
        ".hero-polaroid.p1",
        { y: 40, opacity: 0, rotate: -21, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          rotate: -9,
          scale: 1,
          duration: 1,
          delay: 0.9,
          ease: "back.out(1.6)",
          onComplete: () => gsap.set(".hero-polaroid.p1", { clearProps: "transform" }),
        },
      );
      gsap.fromTo(
        ".hero-polaroid.p2",
        { y: 40, opacity: 0, rotate: 20, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          rotate: 8,
          scale: 1,
          duration: 1,
          delay: 1.05,
          ease: "back.out(1.6)",
          onComplete: () => gsap.set(".hero-polaroid.p2", { clearProps: "transform" }),
        },
      );
      gsap.fromTo(
        ".hero-polaroid.p3",
        { y: 40, opacity: 0, rotate: -16, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          rotate: -4,
          scale: 1,
          duration: 1,
          delay: 1.2,
          ease: "back.out(1.6)",
          onComplete: () => gsap.set(".hero-polaroid.p3", { clearProps: "transform" }),
        },
      );
      gsap.from(".hero-blob", { scale: 0.4, opacity: 0, duration: 1.6, ease: "power3.out", stagger: 0.2 });

      gsap.to(".hero-blob.b1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-blob.b2", { yPercent: -25, xPercent: 10, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".m-hero__visual img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".m-hero__left", { y: -40, ease: "none", scrollTrigger: { trigger: ".m-hero", start: "top top", end: "bottom top", scrub: true } });

      // On mobile the why section is a centered single column, so slide the
      // steps up (not in from the side) — a horizontal offset would read as the
      // steps being shifted right.
      const whyNarrow = window.matchMedia("(max-width: 960px)").matches;
      gsap.from(".why-left > *", {
        scrollTrigger: { trigger: ".m-why", start: "top 80%", once: true },
        x: whyNarrow ? 0 : -40,
        y: whyNarrow ? 24 : 0,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });
      gsap.from(".why-right .m-feature", {
        scrollTrigger: { trigger: ".m-why", start: "top 80%", once: true },
        x: whyNarrow ? 0 : 40,
        y: whyNarrow ? 28 : 0,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });
      gsap.from(".m-editor h2, .m-editor .m-section-label, .m-editor__mockup, .m-editor__pills > *", {
        scrollTrigger: { trigger: ".m-editor", start: "top 76%", once: true },
        y: 28,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
      });
      gsap.from(".m-themes__head > *", {
        scrollTrigger: { trigger: ".m-themes", start: "top 76%", once: true },
        y: 34,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
      });
      // Animate each theme card toward its resting tilt/scale, then hand the
      // transform back to CSS so the signature tilt + hover effects survive.
      const themeCards: Array<{ sel: string; rot: number; scale: number }> = [
        { sel: ".m-theme-card.is-1", rot: -2, scale: 1 },
        { sel: ".m-theme-card.is-2", rot: 0, scale: 1.02 },
        { sel: ".m-theme-card.is-3", rot: 2, scale: 1 },
      ];
      themeCards.forEach(({ sel, rot, scale }, i) => {
        gsap.fromTo(
          sel,
          { y: 52, opacity: 0, rotate: rot, scale: scale * 0.94 },
          {
            y: 0,
            opacity: 1,
            rotate: rot,
            scale,
            duration: 0.85,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".m-themes__grid", start: "top 85%", once: true },
            onComplete: () => gsap.set(sel, { clearProps: "transform,opacity" }),
          },
        );
      });
      gsap.from(".m-quotes__head > *, .m-quote", {
        scrollTrigger: { trigger: ".m-quotes", start: "top 76%", once: true },
        y: 30,
        opacity: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.08,
      });
      gsap.from(".m-pricing__head > *, .m-pricing__card", {
        scrollTrigger: { trigger: ".m-pricing", start: "top 76%", once: true },
        y: 30,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
      });

      return () => window.removeEventListener("scroll", onScroll);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="memora-root">
      <nav className="m-nav">
        <div className="m-nav__inner">
          <Link href="/" className="m-nav__logo">
            <span className="m-nav__logo-dot" aria-hidden="true" />
            Memora
          </Link>

          <div className="m-nav__links">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={(e) => handleAnchor(e, link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="m-nav__actions">
            <Link href="/create" className="m-nav__cta">
              <span>Get started</span>
              <span className="m-nav__cta-arrow">-&gt;</span>
            </Link>
            <button
              type="button"
              className={`m-nav__burger ${menuOpen ? "is-open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

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
              x
            </button>
          </div>

          <span className="m-pill m-drawer__pill">
            <span className="m-pill__dot" aria-hidden="true" />
            your memories, beautifully bound
          </span>

          <nav className="m-drawer__links">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                style={{ ["--i" as string]: String(index) }}
              >
                <span className="m-drawer__idx">0{index + 1}</span>
                {link.label}
                <span className="m-drawer__arrow" aria-hidden="true">-&gt;</span>
              </Link>
            ))}
          </nav>

          <div className="m-drawer__foot">
            <Link href="/create" className="m-btn-primary m-drawer__cta" onClick={() => setMenuOpen(false)}>
              Create your book
              <span className="m-btn-primary__arrow">-&gt;</span>
            </Link>
            <div className="m-drawer__meta">
              <a href="mailto:hello@memora.app">hello@memora.app</a>
              <span>cairo / egypt</span>
            </div>
          </div>
        </aside>
      </div>

      <header className="m-hero">
        <div className="hero-blob b1" aria-hidden="true" />
        <div className="hero-blob b2" aria-hidden="true" />
        <div className="hero-blob b3" aria-hidden="true" />
        <div className="m-hero__grid" aria-hidden="true" />

        <div className="m-hero__inner">
          <div className="m-hero__left">
            <span className="m-pill pill-tag">
              <span className="m-pill__dot" aria-hidden="true" />
              now printing / winter '26
            </span>

            <h1>
              <span className="h1-line"><span>Every photo</span></span>
              <span className="h1-line"><span>deserves a </span><span className="home">home.</span></span>
            </h1>

            <p className="m-hero__sub hero-sub">
              From weekend trips to wedding days, Memora turns your camera roll into something you can actually hold.
            </p>

            <div className="m-hero__ctas">
              <Link href="/create" className="m-btn-primary hero-cta">
                Create your book
                <span className="m-btn-primary__arrow">-&gt;</span>
              </Link>
              <Link href="#themes" className="m-btn-secondary hero-cta" onClick={(e) => handleAnchor(e, "#themes")}>
                See examples
              </Link>
            </div>

            <div className="m-hero__stats">
              <div className="hero-stat">
                <div className="hero-stat__num">2,400+</div>
                <div className="hero-stat__label">books printed</div>
              </div>
              <div className="hero-stat__sep" aria-hidden="true" />
              <div className="hero-stat">
                <div className="hero-stat__num">4.9<span>*</span></div>
                <div className="hero-stat__label">avg. rating</div>
              </div>
              <div className="hero-stat__sep" aria-hidden="true" />
              <div className="hero-stat">
                <div className="hero-stat__num">5-7d</div>
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
                <span className="m-hero__badge-k">*</span>
                <span>premium paper / hand-stitched</span>
              </div>
            </div>

            <div className="hero-polaroid p1">
              <img src={POLAROIDS[0]} alt="" loading="lazy" />
              <span>lake / 07.24</span>
            </div>
            <div className="hero-polaroid p2">
              <img src={POLAROIDS[1]} alt="" loading="lazy" />
              <span>alps / 06.24</span>
            </div>
            <div className="hero-polaroid p3">
              <img src={POLAROIDS[2]} alt="" loading="lazy" />
              <span>coast / 05.24</span>
            </div>
          </div>
        </div>

        <div className="m-hero__scroll" aria-hidden="true">
          <span>scroll</span>
          <span className="m-hero__scroll-line" />
        </div>
      </header>

      <section id="how" className="m-why">
        <div className="why-left">
          <div className="m-section-label">[ why memora ]</div>
          <h2 className="m-why__head">
            Because some moments are too good to <span className="hl">live only on a screen.</span>
          </h2>
          <span className="m-pill m-why__pill">printed with care</span>
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
              <div className="m-editor__photo">photo / 01</div>
              <div className="m-editor__photo">photo / 02</div>
            </div>
            <div className="m-editor__caption">caption / cairo, july 2024 - golden hour on the rooftop_</div>
          </div>
        </div>
        <div className="m-editor__pills">
          <span className="m-pill m-pill--solid">undo / redo</span>
          <span className="m-pill m-pill--solid">auto-save</span>
        </div>
      </section>

      <section id="themes" className="m-themes">
        <div className="m-themes__head">
          <div className="m-section-label">[ made for every memory ]</div>
          <h2>A theme for <span className="hl">every chapter.</span></h2>
        </div>
        <div className="m-themes__grid">
          {[
            { cls: "is-1", label: "Coastal", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80&auto=format" },
            { cls: "is-2", label: "Travel", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&q=80&auto=format" },
            { cls: "is-3", label: "Adventure", img: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=700&q=80&auto=format" },
          ].map((theme) => (
            <article key={theme.label} className={`m-theme-card ${theme.cls}`}>
              <img src={theme.img} alt={`${theme.label} theme preview`} loading="lazy" />
              <div className="m-theme-card__sticker">new</div>
              <div className="m-theme-card__label">{theme.label}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="m-quotes">
        <div className="m-quotes__head">
          <div className="m-section-label">[ loved by makers ]</div>
          <h2>Kept on coffee tables <span className="hl">everywhere.</span></h2>
        </div>
        <div className="m-quotes__grid">
          {[
            {
              q: "I cried opening it. My whole summer in Greece, sitting on my coffee table. Worth every pound.",
              n: "Layla H.",
              l: "Cairo, EG",
            },
            {
              q: "Way nicer than I expected. Paper feels expensive, the binding is real. My mom thinks I bought it from a shop.",
              n: "Omar K.",
              l: "Riyadh, SA",
            },
            {
              q: "Made one for my best friend's birthday and now everyone in the group chat wants one. The editor is so fun.",
              n: "Yasmin R.",
              l: "Dubai, UAE",
            },
          ].map((quote) => (
            <article key={quote.n} className="m-quote">
              <span className="m-quote__rating">*****</span>
              <p className="m-quote__text">"{quote.q}"</p>
              <div className="m-quote__author">
                <span className="m-quote__avatar" aria-hidden="true">{quote.n.charAt(0)}</span>
                <div>
                  <div className="m-quote__name">{quote.n}</div>
                  <div className="m-quote__loc">{quote.l} / verified order</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="m-pricing">
        <div className="m-pricing__head">
          <div className="m-section-label">[ start creating ]</div>
          <h2 className="m-pricing__title">
            Simple, <span className="hl">honest pricing.</span>
          </h2>
          <p className="m-pricing__lede">
            Design your entire book for free. You only pay when you're ready to hold it in your hands.
          </p>
        </div>

        <div className="m-pricing__card">
          <div className="m-pricing__ribbon">most loved</div>

          <div className="m-pricing__top">
            <div>
              <div className="m-pricing__plan">The Memora Book</div>
              <div className="m-pricing__plan-sub">hardcover / 20 pages / lay-flat binding</div>
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
              "Design free - no account needed",
              "Ships to your door in 5-7 days",
            ].map((item) => (
              <li key={item}>
                <span className="m-pricing__check" aria-hidden="true">+</span>
                {item}
              </li>
            ))}
          </ul>

          <Link href="/create" className="m-pricing__btn">
            Start your book
            <span className="m-btn-primary__arrow">-&gt;</span>
          </Link>
          <div className="m-pricing__fine">
            + EGP 15 / extra page / free shipping over EGP 800 / 30-day love guarantee
          </div>
        </div>
      </section>

      <footer className="m-footer">
        <div className="m-footer__inner">
          <div className="m-footer__brand">
            <div className="m-footer__logo">
              <span className="m-nav__logo-dot" aria-hidden="true" />
              Memora
            </div>
            <div className="m-footer__tag">
              Your memories, beautifully bound, printed on archival paper and stitched by hand in Cairo.
            </div>
          </div>

          <nav className="m-footer__links" aria-label="Footer">
            <Link href="#how" onClick={(e) => handleAnchor(e, "#how")}>how it works</Link>
            <Link href="#themes" onClick={(e) => handleAnchor(e, "#themes")}>themes</Link>
            <Link href="#pricing" onClick={(e) => handleAnchor(e, "#pricing")}>pricing</Link>
            <Link href="/create">create</Link>
          </nav>
        </div>

        <div className="m-footer__wordmark" aria-hidden="true">Memora</div>

        <div className="m-footer__bar">
          <span>Copyright 2026 Memora</span>
          <span className="brand-line" aria-hidden="true" />
          <span>made in cairo / egypt</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
