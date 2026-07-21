# RE/MAX Indonesia — Design System

## Overview
RE/MAX Indonesia is the local affiliate of RE/MAX, one of the world's largest real estate franchise networks. This design system supports a **property marketplace website** (buy/rent/sell, similar in scope to Zillow or Rumah123) serving property buyers, sellers, investors, agents, and corporate partners. The direction is enterprise-grade SaaS: premium, corporate, modern, trustworthy, minimal, with generous whitespace — referencing Stripe, Vercel, Linear, Airbnb, Apple, Arc Browser. It explicitly avoids gradients, glassmorphism, neumorphism, and playful/cartoon UI.

**Sources provided:** no Figma file, codebase, or slide deck was attached. The system was built from a written brand brief (colors, type, radii, shadows, spacing, component inventory, tech stack) plus two logo image uploads (`uploads/Asset 12.png` full lockup, `uploads/Asset 2.png` balloon mark), now copied to `assets/logo-full.png` and `assets/logo-mark.png`. If a RE/MAX brand guideline PDF, Figma file, or codebase exists, attach it to refine colors/spacing/component fidelity further.

Target tech stack this system is designed to be compatible with: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion, TypeScript, React Hook Form, TanStack Table, Recharts.

## Index
- `styles.css` — root stylesheet, imports every token file below.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`, `motion.css`, `fonts.css`, `base.css`.
- `assets/` — `logo-full.png`, `logo-mark.png` (real RE/MAX balloon + wordmark, as uploaded).
- `guidelines/` — foundation specimen cards (colors, type, spacing, radius, shadows, motion, brand/logo).
- `components/forms/` — Button, IconButton/FAB, TextInput/Textarea/Select/PriceInput/OTPInput, Checkbox/Radio/Switch.
- `components/feedback/` — Badge.
- `components/core/` — Icon (Lucide wrapper).
- `components/cards/` — PropertyCard, AgentCard/OfficeCard, StatisticCard/InsightCard, BlogCard/TestimonialCard.
- `components/navigation/` — Navbar, Breadcrumb, BottomNav, DashboardSidebar.
- `components/property/` — MortgageCalculator.
- `ui_kits/marketplace/` — homepage, listing detail, dashboard screens (click-through).
- `SKILL.md` — Claude Code / Agent Skills-compatible package descriptor.
- `thumbnail.html` — project tile.

### Intentional additions
No component source was attached, so the standard set below was authored per the brief's own component list (Buttons, Inputs, Cards, Navigation, Property, Dashboard, AI). The brief's full inventory is large (CRM/Kanban/Chat Assistant/etc.); this pass covers the core primitives + property/dashboard essentials most needed for prototyping marketplace and agent-dashboard screens. See CAVEATS at the end of the build for what's deferred.

## Content Fundamentals
- **Voice:** confident, concise, benefit-led — short declarative sentences ("Find your next home in Jakarta." not "We would like to help you find a home"). Professional but warm, never jokey; no emoji.
- **Person:** direct address to the user ("Your dream home is closer than you think") mixed with agent-facing "you/your" in dashboard copy ("Your leads this week").
- **Casing:** Sentence case for UI labels and headings ("Schedule a visit", not "Schedule A Visit"). Title Case reserved for the wordmark and nav-level product names.
- **Numbers/currency:** always Rupiah with "Rp" prefix and dot thousands separators (`Rp 4.850.000.000`), consistent with Indonesian locale; percentages for trends (`+12% MoM`).
- **CTAs:** verb-first, specific ("Schedule a Visit", "List a Property", "Talk to an Agent") — never vague ("Learn More", "Click Here").
- **Trust signals:** phrasing leans on credentials and locality ("RE/MAX-certified agent", "182 active listings in Jakarta Selatan") rather than hype adjectives.
- No emoji anywhere in product copy.

## Visual Foundations
- **Color:** two-color brand system — RE/MAX Blue `#0043FF` (primary accent, CTAs, links, active states) and RE/MAX Red `#FF1200` (used sparingly — the balloon logo, destructive/urgent states only, never as a second CTA color). Dark Blue `#000E35` is the ink/heading color and dark-surface color; Bridge Blue/Red are muted, deeper variants for dark-mode surfaces. Cream `#F7F5EE` is the warm off-white background alternative to pure white. Max 2 accent colors on any single screen.
- **Type:** Geist Sans throughout (real webfont, available on Google Fonts — no substitution needed), Geist Mono for prices/stats/data tables. Generous line-height (1.5–1.6 body), tight tracking on display sizes (−0.02em).
- **Spacing:** 4/8-pt scale (4→128px). Desktop container 1440px, content width 1280px, 12-column grid.
- **Backgrounds:** flat color fields (white, cream, dark blue) — no gradients, no photographic full-bleed heroes as a default (photography is used only inside cards/galleries, never as a page-wide backdrop), no patterns/textures.
- **Radius:** cards 16px, buttons/inputs 12px, modals 20px, badges fully round (999px) — soft but not maximally-rounded "bubbly" UI.
- **Shadows:** soft and shallow only (`shadow-sm`/`md` for resting/hover cards); never heavy or multi-layered. Cards read as "elevated but minimal" — 1px hairline border + soft shadow, not shadow alone.
- **Motion:** fast, subtle, no bounce/spring easing — 150/200/300ms with a standard ease-out curve. Hover = background shift one step darker/lighter + slight shadow increase + 2px lift on cards. Press/active = one step further, no scale change on buttons.
- **Borders:** 1px hairline, `--border-default` (light gray) at rest, `--border-strong` for emphasis/focus-adjacent elements. Focus ring: 3px soft blue halo (`--shadow-focus`), 2px solid outline for keyboard nav.
- **Transparency/blur:** none — this system intentionally avoids glassmorphism per brief; surfaces are opaque flat colors.
- **Imagery:** bright, naturally-lit interiors and exteriors; minimal retouching; warm-neutral color grade (not cool/blue-tinted, not black-and-white, no heavy grain). Real estate photography only — no stock "business handshake" clichés.
- **Cards:** white surface, 1px hairline border, 16px radius, soft shadow, 2px lift + shadow increase on hover — the one consistent card recipe reused across Property/Agent/Office/Blog/Testimonial/Data cards (background tint swaps for Insight/Testimonial only).
- **Dark mode:** all components support `:root[data-theme="dark"]` — surfaces shift to Dark Blue/Bridge Blue, text inverts, accent stays RE/MAX Blue for continuity.

## Iconography
- **System:** Lucide Icons (outlined, 2px stroke, consistent geometry) per the brief — loaded from CDN (`https://unpkg.com/lucide@latest`) rather than bundled, since no icon set was provided in the source materials. This is a **flagged substitution**: if RE/MAX Indonesia has a proprietary icon set, swap the CDN link and `Icon` component accordingly.
- **Usage:** the `Icon` component (`components/core/Icon.jsx`) renders `<i data-lucide="name">` and calls `lucide.createIcons()` on mount — any page using it must load the Lucide CDN script.
- No emoji, no unicode-glyph icons, no icon font other than Lucide's.
- **Logos:** only real, user-provided assets are used (`assets/logo-full.png`, `assets/logo-mark.png`). No logo was invented or approximated.

## Components (built)
Button, IconButtons (IconButton, FAB), Inputs (TextInput, Textarea, Select, PriceInput, OTPInput), Toggles (Checkbox, Radio, Switch), Badge, Icon, PropertyCard, PeopleCards (AgentCard, OfficeCard), DataCards (StatisticCard, InsightCard), ContentCards (BlogCard, TestimonialCard), Navigation (Navbar, Breadcrumb, BottomNav, DashboardSidebar), MortgageCalculator.

## UI Kit
`ui_kits/marketplace/` — a marketplace website kit: homepage (hero search, featured listings, insights, testimonials), listing detail page (gallery, price, mortgage calculator, agent contact), and an agent dashboard (sidebar, stats, lead table). See `ui_kits/marketplace/README.md`.

## Accessibility
WCAG AA contrast targeted for all text/background pairs; visible focus ring on every interactive component; all controls keyboard-operable (native `<button>`/`<input>`/`<select>`).
