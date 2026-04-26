# DESIGN-SYSTEM.md — Memora Visual Design System

---

## Fonts — Load in layout.tsx

```html
<!-- Clash Display — Fontshare -->
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet">

<!-- Instrument Serif — Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">

<!-- DM Mono — Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500&display=swap" rel="stylesheet">
```

## Font Roles — STRICT

| Role | Font | Weight | Size | Style |
|------|------|--------|------|-------|
| Page headlines | Clash Display | 700 | clamp(64px,7vw,104px) | normal |
| Section headlines | Clash Display | 700 | clamp(44px,5vw,72px) | normal |
| Sub-headlines | Clash Display | 600 | 20–28px | normal |
| Navbar logo | Clash Display | 600 | 20px | normal |
| CTA buttons | Clash Display | 600 | 13–16px | normal |
| Body / subtext | Instrument Serif | 400 | 17–20px | italic |
| Quote text | Instrument Serif | 400 | 18–22px | italic |
| Feature desc | Instrument Serif | 400 | 14–16px | normal or italic |
| Labels / tags | DM Mono | 400 | 11px | normal |
| Step numbers | DM Mono | 400 | 11px | normal |
| Price metadata | DM Mono | 400–500 | 11–13px | normal |
| Nav links | DM Mono | 400 | 12px | normal |
| Badge text | DM Mono | 400 | 10–11px | normal |

---

## Color Palette — CSS Variables

```css
:root {
  --white:      #FFFFFF;   /* dominant — 80% of all surfaces */
  --cream:      #FAF8F5;   /* alternate section backgrounds */
  --blush:      #F2C4CE;   /* romantic accent — pills, tags, pricing bg */
  --sky:        #C3D9F0;   /* travel accent — used sparingly */
  --sand:       #E8DDD0;   /* warmth, soft card borders, hover */
  --ink:        #1C1C1C;   /* all text, hard borders, nav */
  --muted:      #9A9490;   /* secondary text, captions, labels */
  --pop-coral:  #FF6B6B;   /* ONE USE ONLY — primary hero CTA button */
  --dark:       #111111;   /* editor showcase section bg only */
}
```

## Color Usage Rules
- White (#FFFFFF) covers at least 80% of all page surfaces
- Blush and sky NEVER appear in the same section
- Coral (#FF6B6B) appears ONCE — the hero "Create your book" button
- Dark (#111111) appears ONCE — the editor showcase section
- Sand (#E8DDD0) used for dashed borders and soft hover states
- Muted (#9A9490) for all secondary/caption text

## Section Background Map
| Section | Background |
|---------|------------|
| Navbar | --white |
| Hero | --white |
| Marquee | --white |
| Why Memora | --cream |
| Editor Showcase | --dark (only dark section) |
| Themes | --white |
| Testimonials | --cream |
| Pricing CTA | --blush |
| Footer | --white |

---

## Spacing System
```css
--space-xs:   8px;
--space-sm:   16px;
--space-md:   24px;
--space-lg:   48px;
--space-xl:   80px;
--space-2xl:  100px;
--space-3xl:  120px;
```
Section padding: var(--space-2xl) var(--space-lg)
Max content width: 1280px, centered with auto margins

---

## Border System
```css
/* Primary — structural, assertive */
--border-primary: 1px solid var(--ink);

/* Secondary — soft, decorative */
--border-soft: 1.5px dashed var(--sand);

/* Dark section border */
--border-dark: 1px solid #333333;

/* Accent section border (pricing) */
--border-accent: 2px solid var(--ink);
```

---

## Border Radius System
```css
--radius-none:  0px;      /* images — always square crop */
--radius-card:  6px;      /* cards, mockup containers */
--radius-btn:   4px;      /* all buttons */
--radius-pill:  100px;    /* tags, badges, pills ONLY */
```
Rule: Never use border-radius above 8px except on pill elements.
Images always have border-radius: 0.

---

## Shadow System
```css
/* Hover state — brutalist offset (no blur) */
--shadow-hover: 4px 4px 0px var(--ink);

/* Card hover on dark bg */
--shadow-hover-dark: 6px 6px 0px var(--ink);

/* Never use: box-shadow with blur radius */
/* Never use: drop-shadow filters */
/* Never use: glow or neon effects */
```

---

## Component Patterns

### Pill Tag
```css
.pill-tag {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  background: var(--blush);
  border: 1.5px dashed var(--ink);
  border-radius: var(--radius-pill);
  padding: 6px 14px;
  color: var(--ink);
  display: inline-block;
}
```

### Sticker Badge
```css
.sticker {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  background: var(--blush);
  border: 1px solid var(--ink);
  border-radius: var(--radius-pill);
  padding: 5px 12px;
  transform: rotate(3deg);
  position: absolute;
}
```

### Primary CTA Button (coral — hero only)
```css
.btn-primary {
  font-family: 'Clash Display', sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.03em;
  background: var(--pop-coral);
  color: var(--white);
  border: 2px solid var(--ink);
  border-radius: var(--radius-btn);
  padding: 16px 36px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-hover);
}
```

### Secondary CTA Button
```css
.btn-secondary {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--ink);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ink);
  padding-bottom: 2px;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}
```

### Dark CTA Button (used in pricing on blush bg)
```css
.btn-dark {
  font-family: 'Clash Display', sans-serif;
  font-weight: 600;
  font-size: 16px;
  background: var(--ink);
  color: var(--white);
  border: 2px solid var(--ink);
  border-radius: var(--radius-btn);
  padding: 20px 56px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-dark:hover {
  background: transparent;
  color: var(--ink);
}
```

### Section Label
```css
.section-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.25em;
  color: var(--muted);
  margin-bottom: 48px;
}
```

### Feature Row (Why Memora section)
```css
.feature-row {
  padding: 28px 0;
  border-bottom: 1.5px dashed var(--sand);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feature-row:last-child { border-bottom: none; }
```

### Quote / Testimonial Card
```css
.quote-card {
  background: var(--white);
  border: 1px solid var(--sand);
  border-radius: var(--radius-card);
  padding: 36px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.quote-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
```

### Photo Card (Themes section)
```css
.theme-card {
  border: 1px solid var(--ink);
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.theme-card:hover {
  transform: rotate(0deg) scale(1.03) !important;
  box-shadow: var(--shadow-hover);
  z-index: 10;
}
```

---

## Grain Overlay — Apply to Hero + Marquee

```css
/* SVG noise grain — define in :root or as data URI */
--grain: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.06'/></svg>");

/* Apply as pseudo-element */
.grain-overlay {
  position: relative;
}
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--grain);
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.05;
  pointer-events: none;
  z-index: 1;
}
```

---

## Rotation Rules
```
Theme card 1:   rotate(-2deg), margin-top: 32px
Theme card 2:   rotate(0deg) — center anchor
Theme card 3:   rotate(+2deg), margin-top: 24px
Pill tag hero:  rotate(-1deg)
Sticker badge:  rotate(+3deg) to +5deg
All hover:      rotate(0deg) — snap back to straight
```

---

## Typography Scale Quick Reference
```
H1 hero:        clamp(64px, 7vw, 104px) / Clash Display 700 / lh 0.95
H2 section:     clamp(44px, 5vw, 72px)  / Clash Display 700 / lh 1.0
H3 sub:         clamp(32px, 3vw, 48px)  / Clash Display 600 / lh 1.1
Feature title:  18–20px                 / Clash Display 600 / lh 1.2
Body/subtext:   17–20px                 / Instrument Serif italic / lh 1.7
Quote:          18–22px                 / Instrument Serif italic / lh 1.5
Caption:        13–15px                 / Instrument Serif / lh 1.6
Label:          11px                    / DM Mono 400 / ls 0.2em
Badge:          10–11px                 / DM Mono 400 / ls 0.15em
Nav links:      12px                    / DM Mono 400 / ls 0.08em
```
