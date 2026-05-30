# ANIMATION.md — Memora GSAP Animation System

---

## Setup — Always First

```js
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
```

---

## Easing Reference — Use Only These

```js
/* Large layout blocks — sections, columns, images */
ease: "power4.out"       // hero text lines, columns entering
ease: "power3.out"       // hero image, subtext, standard reveals
ease: "power2.out"       // scroll-triggered section reveals (default)

/* Small UI elements — pills, badges, stickers, icons */
ease: "back.out(1.7)"    // pills and tags popping into view
ease: "elastic.out(1, 0.5)"  // stickers, floating badges

/* Continuous / looping */
ease: "none"             // marquee, infinite loops

/* Hover micro-interactions */
transition: CSS only — transform + box-shadow, 0.2–0.4s ease
```

Never use: bounce, steps(), linear for reveals, or
ease: "power1" (too weak for the brand energy).

---

## Element Type → Ease Mapping

| Element | Ease | Duration |
|---------|------|----------|
| Navbar | power4.out | 0.9s |
| H1 lines (stagger) | power4.out | 1.0s |
| Hero subtext | power3.out | 0.9s |
| Hero CTA row | power3.out | 0.8s |
| Hero right column | power3.out | 1.1s |
| Pill/tag | back.out(1.7) | 0.8s |
| Sticker badge | elastic.out(1, 0.5) | 0.9s |
| Step cards (stagger) | power2.out | 0.8s |
| Feature rows (stagger) | power2.out | 0.75s |
| Theme cards | back.out(1.4) | 0.9s |
| Quote cards (stagger) | power2.out | 0.8s |
| Marquee track | none | 35s repeat:-1 |
| Editor mockup scale | power2.out | 1.0s |
| Pricing headline | power4.out | 1.0s |

---

## Animation Properties — Rules

```
Always pair opacity with at least ONE transform property.
Never animate opacity alone.

Approved pairs:
  y + opacity        (standard reveal — most common)
  x + opacity        (left/right enter)
  scale + opacity    (zoom reveal — editor mockup only)
  rotation + opacity (stickers, theme cards)
  y + rotation + opacity (theme cards settling)
```

---

## Hero Sequence — Exact Timing

```js
// Navbar
gsap.from("nav", {
  y: -80, opacity: 0, duration: 0.9, ease: "power4.out"
})

// Pill tag
gsap.from(".pill-tag", {
  y: 30, opacity: 0, rotation: -5,
  duration: 0.8, delay: 0.2, ease: "back.out(2)"
})

// H1 lines — split into 3 spans with class .h1-line
gsap.from(".h1-line", {
  y: 80, opacity: 0,
  duration: 1.0, stagger: 0.12, delay: 0.4, ease: "power4.out"
})

// Subtext
gsap.from(".hero-sub", {
  y: 30, opacity: 0,
  duration: 0.9, delay: 0.78, ease: "power3.out"
})

// CTA row
gsap.from(".hero-cta", {
  y: 20, opacity: 0,
  duration: 0.8, delay: 0.95, ease: "power3.out"
})

// Social proof line
gsap.from(".hero-proof", {
  y: 15, opacity: 0,
  duration: 0.7, delay: 1.1, ease: "power2.out"
})

// Right column (3D / spline area)
gsap.from(".hero-right", {
  x: 50, opacity: 0,
  duration: 1.1, delay: 0.5, ease: "power3.out"
})

// Sticker badge on right column
gsap.from(".sticker", {
  rotation: 15, opacity: 0, scale: 0.7,
  duration: 0.9, delay: 1.2, ease: "elastic.out(1, 0.5)"
})
```

---

## Marquee — Seamless Loop

```js
// Duplicate the image set in HTML for seamless loop
// Track contains 2x the images (original + clone)

const track = document.querySelector(".marquee-track")

gsap.to(track, {
  x: () => -(track.scrollWidth / 2),
  duration: 35,
  ease: "none",
  repeat: -1,
  modifiers: {
    x: gsap.utils.unitize(x => parseFloat(x) % (track.scrollWidth / 2))
  }
})
```

---

## ScrollTrigger — Standard Config

```js
// Apply to ALL scroll-triggered animations
ScrollTrigger.defaults({
  start: "top 80%",
  once: true          // never re-trigger
})

// Step cards — stagger
gsap.from(".step-card", {
  scrollTrigger: { trigger: ".steps-section", start: "top 80%", once: true },
  y: 70, opacity: 0,
  duration: 0.8, stagger: 0.15, ease: "power2.out"
})

// Why Memora — split left/right
gsap.from(".why-left", {
  scrollTrigger: { trigger: ".why-section", start: "top 80%", once: true },
  x: -50, opacity: 0, duration: 1, ease: "power3.out"
})
gsap.from(".why-right", {
  scrollTrigger: { trigger: ".why-section", start: "top 80%", once: true },
  x: 50, opacity: 0, duration: 1, delay: 0.15, ease: "power3.out"
})

// Feature rows — stagger
gsap.from(".feature-row", {
  scrollTrigger: { trigger: ".why-right", start: "top 85%", once: true },
  y: 30, opacity: 0,
  duration: 0.7, stagger: 0.12, ease: "power2.out"
})

// Editor mockup — scale reveal
gsap.from(".editor-mockup", {
  scrollTrigger: { trigger: ".editor-section", start: "top 75%", once: true },
  scale: 0.9, opacity: 0, duration: 1.1, ease: "power2.out"
})

// Theme cards — rotation settle
gsap.utils.toArray(".theme-card").forEach((card, i) => {
  const rotations = [-2, 0, 2]
  gsap.from(card, {
    scrollTrigger: { trigger: ".themes-section", start: "top 80%", once: true },
    y: 80, opacity: 0, rotation: rotations[i] * 3,
    duration: 0.9, delay: i * 0.15, ease: "back.out(1.4)"
  })
})

// Quote cards — stagger
gsap.from(".quote-card", {
  scrollTrigger: { trigger: ".testimonials-section", start: "top 80%", once: true },
  y: 50, opacity: 0,
  duration: 0.8, stagger: 0.12, ease: "power2.out"
})

// Pricing headline words
const words = document.querySelectorAll(".pricing-word")
gsap.from(words, {
  scrollTrigger: { trigger: ".pricing-section", start: "top 80%", once: true },
  y: 60, opacity: 0,
  duration: 1, stagger: 0.08, ease: "power4.out"
})
// Split "From EGP 299." into spans with class .pricing-word
```

---

## Hover States — CSS Only (no GSAP for hover)

```css
/* Image cards */
.theme-card { transition: transform 0.4s ease, box-shadow 0.4s ease; }
.theme-card:hover {
  transform: rotate(0deg) scale(1.03) !important;
  box-shadow: 6px 6px 0 var(--ink);
}

/* Feature/step cards */
.step-card { transition: transform 0.3s, box-shadow 0.3s; }
.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 4px 4px 0 var(--ink);
}

/* Primary CTA */
.btn-primary { transition: transform 0.2s, box-shadow 0.2s; }
.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--ink);
}

/* Quote cards */
.quote-card { transition: transform 0.3s, box-shadow 0.3s; }
.quote-card:hover {
  transform: translateY(-4px);
  box-shadow: 4px 4px 0 var(--ink);
}

/* Nav links */
.nav-link { transition: color 0.2s; }
.nav-link:hover { color: var(--ink); }

/* Image zoom on hover */
.marquee-item img { transition: transform 0.6s ease; }
.marquee-item:hover img { transform: scale(1.05); }
```

---

## Timing Rules Summary
```
Stagger between siblings:  0.10–0.15s
Delay between sections:    0.10–0.20s
Minimum duration:          0.7s
Maximum duration:          1.2s (except marquee)
ScrollTrigger start:       "top 80%" always
ScrollTrigger once:        true always
```
