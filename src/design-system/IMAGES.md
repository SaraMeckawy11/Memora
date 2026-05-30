# IMAGES.md — Memora Image Treatment System

---

## Core Philosophy
Every image on Memora must feel like it came from a disposable
film camera, not a stock photo library. Warm, candid, slightly
imperfect. The grain overlay is non-negotiable on all images.

---

## Image Style Rules
- Film grain overlay on EVERY image (see CSS below)
- Warm tones preferred — avoid cold or blue-tinted photos
- Candid over posed — movement, blur edges, real moments
- Portrait ratio (3:4) for theme/feature cards
- Landscape ratio (16:9 or wider) for full-bleed sections
- object-fit: cover — always
- border-radius: 0 — always (never rounded image corners)
- No borders on images except where the card wrapper has one

---

## Approved Unsplash Sources

### Hero + Marquee Strip
```
wedding:   https://images.unsplash.com/photo-1519741497674-611481863552
travel:    https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1
friends:   https://images.unsplash.com/photo-1529156069898-49953e39b3ac
party:     https://images.unsplash.com/photo-1530103862676-de8c9debad1d
landscape: https://images.unsplash.com/photo-1500835556837-99ac94a94552
romance:   https://images.unsplash.com/photo-1511285560929-80b456fea0bc
portrait:  https://images.unsplash.com/photo-1544005313-94ddf0286df2
nature:    https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05
```

### How It Works / Steps Section
```
upload:   https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe
design:   https://images.unsplash.com/photo-1586717791821-3f44a563fa4c
deliver:  https://images.unsplash.com/photo-1566576912321-d58ddd7a6088
```

### Features Section
```
editor:   https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c
```

### Themes Section (portrait crop, 3:4)
```
wedding:  https://images.unsplash.com/photo-1511285560929-80b456fea0bc
travel:   https://images.unsplash.com/photo-1500835556837-99ac94a94552
friends:  https://images.unsplash.com/photo-1529156069898-49953e39b3ac
```

---

## URL Parameters — Always Append
```
?w=600&q=80&auto=format&fit=crop
```

For portrait cards (3:4 ratio):
```
?w=600&h=800&q=80&auto=format&fit=crop
```

For marquee strip (tall crop):
```
?w=500&h=600&q=80&auto=format&fit=crop
```

Full example:
```
https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop
```

---

## Grain Overlay — Mandatory on All Images

### Method 1: CSS Pseudo-element on Image Wrapper
```css
.img-wrapper {
  position: relative;
  overflow: hidden;
}

.img-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23grain)' opacity='0.06'/></svg>");
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.05;
  pointer-events: none;
  z-index: 2;
}
```

### Method 2: CSS filter on img (lighter, use for marquee)
```css
.marquee-img {
  filter: contrast(1.05) saturate(0.95);
}
```

### Method 3: Section-level grain (hero, marquee strip)
```css
.hero-section {
  position: relative;
}
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* same SVG */
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
}
```

---

## Image Hover Treatment
```css
/* All clickable image cards */
.img-card img {
  transition: transform 0.6s ease;
}
.img-card:hover img {
  transform: scale(1.04);
}
/* Grain overlay stays fixed — does not scale with image */
```

---

## Marquee Image Setup (HTML structure)
```html
<!-- Original set + duplicate set for seamless loop -->
<div class="marquee-track">
  <!-- Original -->
  <div class="marquee-item img-wrapper">
    <img src="...wedding?w=500&h=600&q=80&auto=format&fit=crop" alt="Wedding">
    <span class="marquee-label">WEDDING</span>
  </div>
  <!-- repeat all images -->

  <!-- Duplicate (exact copy, aria-hidden) -->
  <div class="marquee-item img-wrapper" aria-hidden="true">
    <img src="...wedding?w=500&h=600&q=80&auto=format&fit=crop" alt="">
    <span class="marquee-label">WEDDING</span>
  </div>
  <!-- repeat duplicates -->
</div>
```

---

## Alt Text Rules
- Marquee duplicates: alt="" (aria-hidden="true" on wrapper)
- Theme cards: descriptive — "Wedding photo book theme"
- Step images: descriptive — "Photo upload interface"
- Decorative images: alt=""

---

## Performance Rules
- Lazy load all images below the fold: loading="lazy"
- Hero image: loading="eager" (above fold)
- Specify width and height attributes to prevent layout shift
- Use Next.js <Image> component for automatic optimization
  with priority prop on hero image

```jsx
// Hero image — eager
<Image
  src="https://images.unsplash.com/..."
  alt="Memora hero"
  fill
  priority
  style={{ objectFit: 'cover' }}
/>

// Below fold images — lazy (Next.js default)
<Image
  src="https://images.unsplash.com/..."
  alt="Wedding theme"
  width={600}
  height={800}
  style={{ objectFit: 'cover' }}
/>
```
