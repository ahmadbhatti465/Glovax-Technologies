Web accessibility is not optional. In 2026, accessible design ensures users with disabilities can navigate your digital products seamlessly while protecting your business against costly ADA compliance lawsuits. The European Accessibility Act now applies to a huge swath of consumer software, US ADA Title III lawsuits continue to set records, and WCAG 2.2 — the international standard that courts and regulators point to — has been the practical benchmark since its formal adoption. This guide is a concrete, build-ready WCAG 2.2 AA checklist for modern web apps, with the specific new criteria that shipped in 2.2 called out where they matter.

## Why WCAG 2.2 matters more in 2026 than ever

Accessibility is no longer a "nice to have" that an engineering team adds at the end. Three forces made it a hard requirement:

1. **Legal exposure.** ADA website lawsuits in the US run into the thousands every year, and most target WCAG 2.1/2.2 AA conformance. The European Accessibility Act brought enforceable obligations to public and consumer-facing software across the EU.
2. **The accessibility market is enormous.** Roughly 1 in 6 people globally has a significant disability, and accessible sites unlock both them and the aging demographic whose needs overlap heavily.
3. **Accessibility is a performance and SEO signal.** Semantic HTML, logical heading order, keyboard operability, and fast interactive response (INP) overlap directly with Google's Core Web Vitals and crawlability.

## The core WCAG 2.2 AA checklist

Work through these four pillars — they map to the four WCAG principles (Perceivable, Operable, Understandable, Robust) and cover the vast majority of audit findings.

### 1. Perceivable: content everyone can see and hear

- **Text contrast of at least 4.5:1** for normal text and 3:1 for large text (18px+/14px+ bold), UI components, and meaningful graphics. In 2026, bake contrast checks into your design system so it is impossible to ship a failing color. Our [design systems guide](/blog/complete-guide-to-ui-ux-design-systems-2026) shows how to encode this as design tokens.
- **Don't rely on color alone** to convey meaning — errors, states, and links must include an additional cue (icon, text, underline).
- **Alt text** for informative images, empty `alt=""` for decorative images, and text alternatives for video and audio content (captions, transcripts, audio descriptions).
- **Text resizing and reflow:** content must work when zoomed to 200% and when the viewport is narrow (mobile) without horizontal scrolling. Use fluid layouts and `rem`-based sizing, not fixed pixel widths.

### 2. Operable: everyone can use the interface

- **Full keyboard navigability.** Every interactive element must be reachable and operable with the Tab key alone, with a clearly visible focus indicator. This is the single most common automated failure and the easiest to regress — make `:focus-visible` styling a non-negotiable part of your component library.
- **No keyboard traps.** Users must never be stuck in a widget or modal; Esc must close overlays and return focus to the trigger.
- **Sufficient time and no seizures:** no content flashes more than 3 times per second, and auto-updating content has a mechanism to pause or hide it.
- **Skip links and logical focus order** that matches the visual reading order.

### 3. Understandable: predictable and clear

- **Page titles and language attributes** (`<html lang="en">`) set correctly.
- **Descriptive labels and instructions** for every form field, including placeholders that are not the only label.
- **Consistent navigation** across pages — repeated components (nav, search, header) appear in the same relative order.
- **Error identification and suggestions** in text, not color alone, with clear "what went wrong and how to fix it" messaging.
- **Focus order preserved on focus changes**, and no surprise context changes on focus or input.

### 4. Robust: works with assistive technology

- **Valid, semantic HTML** — use the right element for the job (`<header>`, `<main>`, `<nav>`, `<article>`, native `<button>` instead of `div` click handlers). Screen readers and crawlers both rely on this.
- **Proper heading hierarchy** — one `<h1>`, logical `<h2>`/`<h3>` nesting, no skipped levels.
- **ARIA used correctly, used sparingly.** The first rule of ARIA: prefer native HTML semantics over ARIA attributes. Use `aria-label` on icon-only buttons, `aria-expanded` on toggles, `role="alert"` for live region messages, and `aria-live="polite"` for async updates (like notifications). When you must build custom widgets (tabs, dialogs, comboboxes), follow the WAI-ARIA Authoring Practices patterns.

## What's NEW in WCAG 2.2 that you may be missing

If you audited against 2.1, these 2.2 additions are the ones most likely to bite:

### Focus Not Obscured (Minimum) — 2.4.11
When an element receives keyboard focus, it must not be fully hidden behind another element — think sticky headers, cookie banners, or chat widgets covering the focused control. Add `scroll-margin` to focusable elements so scroll-into-view leaves breathing room.

### Dragging Movements — 2.5.7
Any functionality that requires dragging (sortable lists, sliders, file drop zones) must have a single-pointer alternative: buttons to move items up/down, a slider with keyboard controls, a file picker alongside the drop zone.

### Target Size (Minimum) — 2.5.8
Interactive targets must be **at least 24x24 CSS pixels** (with exceptions for inline links and spacing). This is smaller than the old 44px recommendation but still larger than many 16-20px icon buttons shipping today. Audit your icon buttons and filter chips against this one.

### Accessible Authentication (Minimum) — 3.3.7
Authentication must not require users to perform a cognitive test (remembering a password, solving a puzzle, transcribing distorted text) as the *only* path. Provide an alternative: a passkey, a magic link, a password manager-supported flow, or a copy-and-paste mechanism. In 2026, passkeys are the cleanest answer — they are both more secure and fully accessible.

### Consistent Help — 3.2.6
If you offer help mechanisms (contact page, chat widget, help center links), they must appear in the same relative location across pages.

## Automated vs manual testing: what actually catches issues

Automated tools are fast but catch only about 30-40% of WCAG 2.2 issues. A robust process uses both:

**Automated (run in CI, every PR):**
- **axe-core / @axe-core/react** in unit tests and in the browser.
- **Lighthouse Accessibility** score as a CI gate.
- **eslint-plugin-jsx-a11y** for React/Next.js to catch issues at authoring time — missing alt text, invalid heading order, unlabeled form fields, and improper button usage.
- **Pa11y** for a free crawl-based audit of key templates.

**Manual (before every release, or quarterly):**
- **Full keyboard walkthrough** — tab through every page; everything must be reachable, visible, and operable.
- **Screen reader pass** — NVDA (Windows) or VoiceOver (macOS) on the top 5 user journeys, listening to how content is announced.
- **Zoom to 200% and mobile viewport** checks for reflow and readability.
- **High-contrast mode** and **reduced motion** preference checks (`prefers-reduced-motion`).

A practical 2026 standard: automated checks block merge, and a manual keyboard + screen-reader pass blocks release.

## Building accessibility into the design system (so it can't regress)

The most effective strategy is to make accessibility a property of your components, not a QA afterthought:

1. **Design tokens for contrast** — encode the 4.5:1 ratios into your color palette and lint against them in design review.
2. **Radix UI primitives** for dialogs, menus, comboboxes, and tooltips — these ship with correct ARIA, keyboard handling, and focus management out of the box, which eliminates a huge class of errors.
3. **A shared `Button`, `Input`, and `Link` component** that always renders semantic HTML with proper focus styles.
4. **Storybook a11y addon** so every component's accessibility test runs in isolation.
5. **a11y regression tests** in Playwright (the `@axe-core/playwright` integration) that run against your live app on a representative set of routes.

This is exactly how the [modern design systems](/blog/complete-guide-to-ui-ux-design-systems-2026) we build at Glovax ship accessible by default rather than accessible by remediation.

## The business case beyond compliance

Beyond avoiding lawsuits, accessibility converts. Accessible sites rank better (semantic structure, fast INP, low bounce), perform better with the growing disability and aging markets, and improve the experience for everyone — keyboard power users, mobile users on bad connections, and users in bright sunlight. Every accessibility fix you make is also a usability and SEO improvement. That is why accessible design belongs in the [top web development trends to plan around](/blog/top-web-development-trends-2026).

## Quick pre-launch checklist

- [ ] All interactive elements keyboard-reachable with visible focus
- [ ] No keyboard traps; Esc closes overlays and returns focus
- [ ] Text contrast ≥ 4.5:1 (3:1 for large text and UI components)
- [ ] Meaning not conveyed by color alone
- [ ] All form fields labeled; errors announced in text
- [ ] One `h1` per page; logical heading order
- [ ] Icon-only buttons have `aria-label`
- [ ] All targets ≥ 24x24px
- [ ] Drag-only interactions have a single-pointer alternative
- [ ] Authentication has a non-cognitive path (passkey/magic link)
- [ ] Focus not obscured under sticky headers/modals
- [ ] `prefers-reduced-motion` respected
- [ ] Automated a11y checks pass in CI; manual keyboard + screen-reader pass done

If you need an accessibility audit, remediation, or an accessible-by-design build, [contact us](/contact) — or start with [our web development services](/services), where WCAG 2.2 AA conformance is standard practice.

## FAQ

### What does WCAG 2.2 AA actually require in a sentence?
It requires that your site be perceivable, operable, understandable, and robust for people with disabilities — meaning text is readable and contrast-compliant, everything is keyboard-operable, forms are labeled and forgiving, and the code is semantic enough for assistive technology to interpret. Level AA is the standard courts and regulators most commonly cite.

### Is WCAG 2.2 a legal requirement?
Not a statute itself, but it is the de facto standard used to evaluate compliance with laws like the ADA (US) and the European Accessibility Act. A WCAG 2.2 AA conformance claim is the strongest practical defense against accessibility lawsuits and the clearest path to regulatory compliance in the EU.

### How much of accessibility can automated tools catch?
Roughly 30–40%. Automated tools reliably catch color-contrast failures, missing alt text, unlabeled form fields, and invalid ARIA. They cannot judge whether an alt text is accurate, whether focus order makes sense, or how a screen reader actually announces a complex widget. A keyboard walkthrough and screen-reader pass remain essential.

### Do WCAG 2.2 requirements apply to mobile apps?
The WCAG success criteria apply to web content, and by extension the same principles apply to mobile apps (the related standard is WCAG2ICT). In practice, accessibility requirements now reach native mobile, PWAs, and web apps alike, so treat accessibility as a product-wide property.

### What is the fastest way to start fixing accessibility in an existing app?
Run a Lighthouse accessibility audit and the axe-core browser extension against your five most important user journeys, fix the automated findings first, then add a keyboard walkthrough. From there, route the fixes through your component library so they apply everywhere — and add automated a11y checks to CI so the problems stop coming back.
