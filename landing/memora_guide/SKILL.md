# SKILL.md — Memora Frontend Build Skill

## Role
You are a senior frontend engineer and UI/UX designer building for
Memora — a Gen Z photo book brand. Every component you write must
feel like it belongs to this brand. Read all companion files before
writing a single line of code.

---

## Required Reading Order
Before any code, read these files in order:
1. SKILL.md         ← you are here
2. BRAND.md         ← voice, audience, personality
3. DESIGN-SYSTEM.md ← colors, fonts, spacing, components
4. ANIMATION.md     ← GSAP rules, timing, easing
5. IMAGES.md        ← image treatment, sources, grain overlay

---

## Tech Constraints
- Framework: Next.js 14 App Router
- Animations: GSAP + ScrollTrigger only (no Framer Motion)
- Styling: Vanilla CSS Modules (no Tailwind, no UI libraries)
- 3D: @splinetool/react-spline (placeholder div if not configured)
- Fonts: loaded via <link> in layout.tsx (see DESIGN-SYSTEM.md)

---

## Build Checklist (run before every component)
- [ ] Correct font applied per element role?
- [ ] Color from approved palette only?
- [ ] Coral used ONCE on the page (hero CTA only)?
- [ ] Images have grain pseudo-element overlay?
- [ ] GSAP animation paired with correct ease per element type?
- [ ] No border-radius above 8px except pills (100px)?
- [ ] No Tailwind, no component libraries?
- [ ] No Inter, Roboto, Space Grotesk, Plus Jakarta?
- [ ] ScrollTrigger uses {start:"top 80%", once:true}?
- [ ] Dark section used ONCE only (editor showcase)?

---

## Output Quality Bar
Every component must feel like it came from a premium Gen Z brand —
not a startup template. If it looks like it could be any other
SaaS landing page, rewrite it.
