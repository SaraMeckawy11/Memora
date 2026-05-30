Use this corrected prompt:

```text
The previous task was misunderstood.

Do NOT create a new redesigned landing page.
Do NOT change the existing Memora landing page design.
Do NOT adapt it to my current design system.
Do NOT only migrate colors.
Do NOT create a second unused page.

Goal:
Migrate the landing page from this GitHub repo exactly as it is:

https://github.com/shawky2002020/memora-your-story-bound.git

and make it the active landing page in my local project.

Source of truth:
- src/pages/Index.tsx
- src/styles/memora.css
- related assets used by the landing page, especially hero images
- any required imports such as GSAP / ScrollTrigger

What to do:
1. Copy the Memora landing page implementation exactly from the GitHub repo.
2. Copy the required CSS file exactly:
   - src/styles/memora.css
3. Copy any required assets used by the page.
4. Make this page active as my local landing page at `/`.
5. Update routing only if necessary so the imported Memora landing page is rendered on the homepage.
6. Install or keep any required dependencies used by the landing page, such as:
   - gsap
   - react-router-dom if routing needs it
7. Keep the original Memora class names, animations, layout, sections, colors, gradients, buttons, typography references, and responsive behavior.

Very important:
- Do not redesign anything.
- Do not convert it into my existing design system.
- Do not replace its CSS classes with Tailwind classes.
- Do not rewrite the layout.
- Do not modify sections, copy, spacing, animations, or colors.
- Do not generate a new landing page.
- Do not leave the migrated page unused.
- The final homepage `/` must render the migrated GitHub landing page.

Expected result:
When I run my local project and open `/`, I should see the exact same Memora landing page from the GitHub repo, using its original design, original CSS, original animations, and original visual style.

Implementation steps:
1. Inspect my local current homepage entry point.
2. Replace or wire that homepage to the migrated Memora `Index.tsx`.
3. Bring over `memora.css` and assets.
4. Fix only import paths or dependency issues required to make it run.
5. Do not make visual changes.
6. Run build/lint and fix only errors caused by the migration.

After finishing, report:
- Which files were copied from the GitHub repo.
- Which local route/page now renders the landing page.
- Any import paths that were adjusted.
- Confirmation that `/` renders the migrated Memora landing page.
```

Even stricter version:

```text
Undo the previous approach if it created a new or redesigned landing page.

I want an exact migration, not a redesign.

Take the landing page from:
https://github.com/shawky2002020/memora-your-story-bound.git

Use its `src/pages/Index.tsx` and `src/styles/memora.css` as the source of truth.

Make that exact page the active local homepage at `/`.

Only change what is required to make it run locally:
- import paths
- asset paths
- route wiring
- missing dependencies

Do not change:
- design
- layout
- colors
- typography
- spacing
- animations
- section structure
- copy
- class names
- CSS values

Do not adapt it to my current design system.
Do not create a separate inactive page.
Do not generate a new landing page.

Final result: my local `/` page should be the GitHub Memora landing page exactly as-is.
```
