"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImage from "@/assets/memora-hero.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80&auto=format",
];

const LandingPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- NAV ----
      gsap.from(".m-nav", { y: -80, opacity: 0, duration: 1, ease: "power4.out" });

      // ---- HERO ----
      gsap.from(".pill-tag", { y: 30, opacity: 0, rotation: -5, duration: 0.8, delay: 0.2, ease: "back.out(2)" });
      gsap.from(".h1-line span", { y: 100, opacity: 0, duration: 1, stagger: 0.12, delay: 0.4, ease: "power4.out" });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.9, delay: 0.78, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, delay: 0.95, ease: "power3.out", stagger: 0.08 });
      gsap.from(".hero-proof", { y: 16, opacity: 0, duration: 0.7, delay: 1.15, ease: "power3.out" });
      gsap.from(".hero-right", { x: 50, opacity: 0, duration: 1.1, delay: 0.5, ease: "power3.out" });
      gsap.from(".sticker", { rotation: 15, opacity: 0, scale: 0.7, duration: 0.9, delay: 1.1, ease: "elastic.out(1, 0.5)" });

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
      gsap.from(".m-quote", {
        scrollTrigger: { trigger: ".m-quotes", start: "top 80%", once: true },
        y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
      });

      // ---- PRICING ----
      gsap.from(".m-pricing .word", {
        scrollTrigger: { trigger: ".m-pricing", start: "top 80%", once: true },
        y: 60, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.1,
      });
      gsap.from(".m-pricing__sub, .m-pricing__btn, .m-pricing__fine", {
        scrollTrigger: { trigger: ".m-pricing", start: "top 75%", once: true },
        y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.2,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="memora-root">
      {/* ============= NAV ============= */}
      <nav className="m-nav">
        <div className="m-nav__logo">Memora</div>
        <div className="m-nav__links">
          <Link href="#how">how it works</Link>
          <Link href="#themes">themes</Link>
          <Link href="#pricing">pricing</Link>
        </div>
        <Link href="#pricing" className="m-nav__cta">Start for free →</Link>
      </nav>

      {/* ============= HERO ============= */}
      <header className="m-hero">
        <div className="m-hero__left">
          <span className="m-pill pill-tag">[ your memories, printed ]</span>
          <h1>
            <span className="h1-line"><span>Every photo</span></span>
            <span className="h1-line"><span>deserves a</span></span>
            <span className="h1-line"><span className="home">home.</span></span>
          </h1>
          <p className="m-hero__sub hero-sub">
            From weekend trips to wedding days — Memora turns your camera roll
            into something you can actually hold.
          </p>
          <div className="m-hero__ctas">
            <Link href="/create" className="m-btn-primary hero-cta">Create your book</Link>
            <Link href="#themes" className="m-btn-secondary hero-cta">See examples →</Link>
          </div>
          <div className="m-hero__proof hero-proof">
            ✦ 2,400+ books printed  ·  ships to egypt &amp; gcc
          </div>
        </div>

        <div className="m-hero__right hero-right">
          <div className="m-hero__visual">
            <Image
              src={heroImage}
              alt="An open Memora photo book on a cream linen surface, surrounded by polaroid prints, a film camera, and dried flowers"
              width={1024}
              height={1280}
              priority
            />
          </div>
          <div className="m-hero__sticker sticker">✦ film · romance · travel</div>
          <div className="m-hero__est">EST. 2024</div>
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
            Because some moments are too good to live only on a screen.
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
          <h2>A theme for every chapter.</h2>
        </div>
        <div className="m-themes__grid">
          {[
            { cls: "is-1", label: "Wedding", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&auto=format" },
            { cls: "is-2", label: "Travel", img: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&q=80&auto=format" },
            { cls: "is-3", label: "Friends", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format" },
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
        <h2>What people are saying.</h2>
        <div className="m-quotes__grid">
          {[
            {
              q: "I cried opening it. My whole summer in Greece, sitting on my coffee table. Worth every pound.",
              n: "Layla H.", l: "Cairo, EG · ✦ verified order",
            },
            {
              q: "Way nicer than I expected. Paper feels expensive, the binding is real. My mom thinks I bought it from a shop.",
              n: "Omar K.", l: "Riyadh, SA · ✦ verified order",
            },
            {
              q: "Made one for my best friend's birthday and now everyone in the group chat wants one. The editor is so fun.",
              n: "Yasmin R.", l: "Dubai, UAE · ✦ verified order",
            },
          ].map((t) => (
            <article key={t.n} className="m-quote">
              <span className="m-quote__rating">✦ ✦ ✦ ✦ ✦</span>
              <p className="m-quote__text">"{t.q}"</p>
              <div className="m-quote__meta">{t.n} · {t.l}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section id="pricing" className="m-pricing">
        <div className="m-section-label">[ start creating ]</div>
        <h2>
          {["From", "EGP", "299."].map((w, i) => (
            <span key={i} className="word">{w}{i < 2 ? "\u00A0" : ""}</span>
          ))}
        </h2>
        <p className="m-pricing__sub">
          Design is always free. Pay only when you're ready to print.
        </p>
        <Link href="/create" className="m-pricing__btn">Start your book →</Link>
        <div className="m-pricing__fine">
          ✦ free design  ·  no account needed  ·  ships in 5–7 days
        </div>
      </section>

      {/* ============= FOOTER ============= */}
      <footer className="m-footer">
        <div className="m-footer__grid">
          <div>
            <div className="m-footer__logo">Memora</div>
            <div className="m-footer__tag">Your memories, beautifully bound.</div>
          </div>
          <div className="m-footer__col">
            <h4>explore</h4>
            <Link href="#how">how it works</Link>
            <Link href="#themes">themes</Link>
            <Link href="#pricing">pricing</Link>
            <Link href="/admin">admin</Link>
          </div>
          <div className="m-footer__col">
            <h4>contact</h4>
            <Link href="https://instagram.com">instagram</Link>
            <Link href="https://tiktok.com">tiktok</Link>
            <Link href="mailto:hello@memora.app">hello@memora.app</Link>
          </div>
        </div>
        <div className="m-footer__bar">
          <span>© 2024 MEMORA</span>
          <span>CAIRO, EGYPT</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
