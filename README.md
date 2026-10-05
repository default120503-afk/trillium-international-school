# Trillium International School System — Official Website

Website for **Trillium International School System (TISS)**, Khanpur / Haripur,
Khyber Pakhtunkhwa, Pakistan. The school reopened in October 2026.

---

## 1. Project overview

A production-oriented school website built from the school's own supplied
material. The central editorial rule of this codebase is **honesty about what is
known**: every claim the site publishes is traceable to the school's profile
document or to information the school has confirmed, and everything unconfirmed
is either omitted or explicitly labelled as unconfirmed.

That rule is why several pages carry visible "this is an educational aim" /
"this is what we have not verified" qualifiers instead of confident marketing
copy. It is a deliberate design decision, not an unfinished section.

### Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16.3.8 (App Router, React Server Components) |
| Language | TypeScript 5.9, `strict: true` |
| Styling | Tailwind CSS v4 (`@theme` design tokens, CSS-first config) |
| Icons | lucide-react |
| Fonts | Fraunces (display serif) + Inter (body sans), via `next/font` |
| Package manager | npm |

**Framer Motion was deliberately not added.** Every transition on the site is a
CSS transition driven by design tokens. A 40 kB+ animation runtime was not
warranted for the subtle motion actually used.

### Architecture

```
src/
├─ app/
│  ├─ layout.tsx                 Root layout, fonts, School JSON-LD, metadata factory
│  ├─ globals.css                Design tokens (@theme) + base layer + utilities
│  ├─ robots.ts                  robots.txt; sitemap host only when domain known
│  ├─ sitemap.ts                 Sitemap; returns empty when domain unknown
│  ├─ icon.png                   Favicon, derived from the official logo
│  ├─ api/admissions/route.ts    POST endpoint for admissions inquiries
│  └─ (site)/                    All public routes + shared header/footer layout
├─ components/
│  ├─ brand/Marks.tsx            Official logo wrapper + original petal motif
│  ├─ layout/                    SiteHeader (mobile drawer), SiteFooter, Hero
│  ├─ ui/                        Button, SectionHeading, Prose
│  ├─ forms/AdmissionsForm.tsx   Validated form with honest delivery states
│  ├─ gallery/Gallery.tsx        Grid + accessible lightbox dialog
│  └─ home/                      Pillars, CampusStrip, FounderPreview
├─ content/                      ← ALL school copy lives here
│  ├─ school.ts                  Identity, founder, history, mission/vision
│  ├─ campuses.ts                Campus records (location, status, image)
│  ├─ contact.ts                 Contact fields + social links (all null until verified)
│  ├─ gallery.ts                 Gallery entries + provenance strings
│  ├─ programmes.ts              Learning pillars, co-curricular themes, announcements
│  └─ navigation.ts              Single nav definition for header, drawer and footer
└─ lib/
   ├─ site.ts                    Site URL resolution (never invents a domain)
   └─ admissions/
      ├─ schema.ts               Shared validation (client + server)
      └─ delivery.ts             Delivery boundary — the honesty contract
```

---

## 2. Prerequisites

- Node.js 20 or newer (developed on Node 26.7.0)
- npm 10 or newer

---

## 3. Commands

All commands below were run against this project and reflect real output.

```bash
npm install            # resolve dependencies
npm run dev            # dev server on http://localhost:3000
npm run build          # production build
npm run start          # serve the production build
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
```

**If port 3000 is busy, Next.js automatically uses the next free port** and prints
it. During development this project ran on **http://localhost:3001** because
another local project already held 3000.

---

## 4. Source material and where the assets live

### Files found in the project root (unmodified)

| File | What it is |
|---|---|
| `Trillium_logo.jpeg` | The official logo. 6400 × 3600 px, JPEG, opaque white background. |
| `CamScanner 10-03-2026 22.57.pdf` | The school profile. 8 pages, scanned, **no text layer**. |

Both originals are left untouched. Everything below is derived from them.

### Analysis findings that shaped the build

- **The PDF has no text layer.** `page.get_text()` returned only the string
  `"CamScanner"` on every page — each page is a single flat page image. The
  content was recovered with **Windows OCR** (`Windows.Media.Ocr`) instead, and
  all 8 pages were read successfully. That text is the basis for every
  educational claim on the site.
- **The PDF contains no photographs.** Every page is running text plus coloured
  decoration. Colour-variance analysis across all 8 pages found no photographic
  regions. This is why the gallery shows the profile pages themselves and why the
  campus panels are designed placeholders rather than stock images.
- **Brand palette, measured from the sources.** Dominant logo colours are a deep
  navy → azure gradient (`#001050`, `#002060`, `#003070`, `#0050a0`) with gold
  accents (`#f0c030`, `#d09010`). The profile cover is violet/magenta
  (`#781878`, `#784890`) with gold and cream (`#f0f0d8`, `#d8f0c0`). The site's
  tokens blend these into a violet/ink + gold system on warm cream.

### Derived assets

| Path | What it is |
|---|---|
| `public/brand/logo-mark.png` | Primary logo: cropped to the ink bounding box, converted to a real alpha channel (soft-edge unmatting against the brand ink colour). Used in the header, hero and footer. |
| `public/brand/logo-mark-240/480/960.png` | Responsive sizes of the same mark. |
| `src/app/icon.png` | 512 × 512 favicon derived from the logo. |
| `public/images/profile/page-1..8.webp` | Profile pages at ≤1400 px, WebP q88 — used in the gallery lightbox, the founder section and the mission page. |
| `public/images/profile/page-1..8-thumb.webp` | ≤600 px thumbnails (currently the gallery grid uses the full assets; swap `src` to the `-thumb` variant for further savings). |

### Gallery provenance

Every gallery entry carries a `provenance` string in
`src/content/gallery.ts` naming the exact source page. **No caption asserts a
person, place, date or event.** When the school supplies authentic photography,
add files under `public/images/` and add entries to the same array.

---

## 5. Maintaining the site

Everything a non-developer would need to change is in `src/content/`. No
component needs editing for routine copy changes.

| To change | Edit |
|---|---|
| School name, location, reopening notice | `src/content/school.ts` → `school` |
| Founder details | `src/content/school.ts` → `founder` |
| History timeline | `src/content/school.ts` → `history.timeline` |
| Mission / vision wording | `src/content/school.ts` → `missionVision` |
| Campus name, location, status, photo | `src/content/campuses.ts` |
| Phone / email / WhatsApp / address / hours | `src/content/contact.ts` → `contact` |
| Social links | `src/content/contact.ts` → `social` |
| Gallery images and provenance | `src/content/gallery.ts` |
| Learning pillars, activity themes | `src/content/programmes.ts` |
| News announcements | `src/content/programmes.ts` → `announcements` |
| Navigation / footer menu | `src/content/navigation.ts` |

### Two fields are deliberately `null`

`contact.ts` ships with `phone`, `whatsapp`, `email`, `postalAddress`, `mapUrl`
and `officeHours` all set to `null`, and `campuses.ts` ships with both campus
`image` fields `null`. The UI **hides** these entirely rather than rendering a
placeholder, and `contactUnavailableNotice` explains the gap to visitors. This is
intentional: inventing a phone number on a school website costs a family real
time. Replace a `null` with the verified value and it appears automatically.

---

## 6. Admissions delivery — read this before launch

**The admissions form validates fully and submits to a real API route, but no
delivery channel is configured, so it will not currently deliver an inquiry
anywhere.** This is stated in the UI before the user submits and again if they
submit anyway. It never shows a success message.

The honesty contract is enforced in code:

| Situation | HTTP | Response | UI |
|---|---|---|---|
| Valid + transport really delivered | `201` | `{delivered:true}` | Success **only** here |
| Invalid input | `400` | `fieldErrors` | Field-level messages |
| Honeypot filled | `202` | `{delivered:false}` | Silent, nothing sent |
| Valid but no transport configured | `503` | `{delivered:false, error}` | "Your inquiry was not sent" |
| Transport reports failure | `502` | `{delivered:false}` | "Your inquiry was not sent" |

### How to activate delivery

1. Implement a transport in `src/lib/admissions/delivery.ts` →
   `sendViaConfiguredTransport()`. Return `{ok:true, reference}` on genuine
   success and `{ok:false, reason}` on failure. Keep all credentials server-side.
2. Set in `.env.local`:
   ```
   ADMISSIONS_DELIVERY_ENABLED=1
   ADMISSIONS_NOTIFICATION_EMAIL=admissions@the-school.example
   ```
3. Re-test the full form flow. The success state is deliberately gated on the
   transport's real return value, so it will not appear until step 1 is real.

---

## 7. Environment variables

Copy `.env.example` to `.env.local`. Every value there is a safe placeholder.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Before production** | Official domain. When unset, canonical URLs, sitemap host and absolute Open Graph URLs are **omitted** rather than pointing at an invented domain. |
| `NEXT_PUBLIC_ADMISSIONS_ENDPOINT_PATH` | No | Form POST target. Defaults to `/api/admissions`. |
| `ADMISSIONS_ENDPOINT_PATH` | No | Server-side accepted path. Must match the public one. |
| `ADMISSIONS_DELIVERY_ENABLED` | No | Set to `1` only after a transport is implemented. |
| `ADMISSIONS_NOTIFICATION_EMAIL` | With delivery | Where inquiries are forwarded. Server-side only. |

No secret is ever sent to the browser. `ADMISSIONS_NOTIFICATION_EMAIL` and the
delivery flags are read only in server modules.

---

## 8. Verification results

| Check | Result | Notes |
|---|---|---|
| `npm install` | **PASS** | 0 production vulnerabilities |
| `npm audit` | **PASS (prod)** | 0 production vulnerabilities. 5 dev-only advisories remain in the `eslint-config-next → fast-glob → micromatch → braces` chain; `braces@3.0.3` is the latest published and the advisory has no upstream fix, so it cannot be resolved without downgrading Next's ESLint plugin. |
| `npm run typecheck` | **PASS** | No errors, `strict: true` |
| `npm run lint` | **PASS** | No errors, no warnings |
| `npm run build` | **PASS** | 16 routes; 15 static, 1 dynamic (`/api/admissions`) |
| Security headers | **PASS** | CSP, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP — 14/14 tests |
| Cross-site POST rejection | **PASS** | Returns 403 |
| Rate limiting | **PASS** | 429 with `Retry-After` after the per-IP cap |
| `aria-labelledby` integrity | **PASS** | Zero dangling references across all 13 routes |
| Admissions API tests | **PASS** | 8/8 — see below |
| Admissions form in browser | **PASS** | Labelling, validation, duplicate guard, honest failure |
| Gallery lightbox | **PASS** | Dialog semantics, arrows, Escape, focus trap, focus restore, scroll lock |
| Mobile drawer @390 px | **PASS** | Open/close, focus in/out, Tab trap, Escape, scroll lock, route change |
| Skip link | **PASS** | Becomes visible and focusable on focus |
| Responsive sweep | **PASS** | 13 routes × 5 viewports, re-run after fixes |
| Horizontal overflow | **PASS** | `scrollWidth === clientWidth` at every route/viewport |
| Broken images / missing alt / dead links | **PASS** | None found |
| Heading hierarchy | **PASS** | No level skips; one `<h1>` per route |
| SEO metadata | **PASS** | 13 unique titles + descriptions, OG on every page, no duplicates |
| robots / sitemap degradation | **PASS** | Empty sitemap and no sitemap host while `NEXT_PUBLIC_SITE_URL` is unset |
| 404 | **PASS** | Custom page, HTTP 404, Next adds `noindex` |
| Browser console | **PASS** | No errors, no hydration warnings |
| Admissions **delivery** | **BLOCKED** | No transport configured — by design, see §6 |
| Form field alignment | **PASS** | All paired inputs share a baseline (measured tops 835 / 945 / 1056) |
| Heading scale by level | **PASS** | h1 56-64px / h2 32-34px / h3 18-20px; was h1=h2=h3=34px |
| Desktop nav does not wrap | **PASS** | One row at 1280 / 1366 / 1440; drawer below `xl` |
| Focus ring vs WCAG 1.4.11 | **PASS** | Two-tone ring; was 2.2:1 gold-on-cream (below the 3:1 minimum) |
| Touch targets | **PASS** | Zero interactive targets under 40 px; the only sub-40 px node is the `tabIndex={-1}` honeypot |
| Visual review by vision model | **BLOCKED** | The vision endpoint returned HTTP 429 throughout this session (~41 h fair-share window). Design review was done instead by measuring computed styles, contrast maths and layout geometry in the live DOM, plus pixel analysis of 65 full-page screenshots. **No human or model looked at a rendered image with its own eyes.** |

### Security header tests (`node .work/test-security.mjs`)

```
PASS  header content-security-policy   PASS  CSP forbids framing
PASS  header x-content-type-options     PASS  CSP limits frames
PASS  header x-frame-options            PASS  CSP has no third-party origins
PASS  header referrer-policy            PASS  API marked noindex
PASS  header permissions-policy         PASS  cross-site POST -> 403
PASS  header cross-origin-opener-policy PASS  same-origin POST accepted
PASS  rate limiter kicks in             PASS  no success ever returned
```

### Responsive viewports tested

1440 × 900 · 1366 × 768 · 768 × 1024 · 390 × 844 · 320 × 700

### Defects found by measurement and fixed

| Defect | How it was found | Fix |
|---|---|---|
| Gold CTA rendered dark text on a dark fill (1.26:1) | Computed-style contrast sweep | Added `accent` button variant |
| Home page had no `<title>` (empty) | Browser tab inspection | Added `buildMetadata()` export |
| Gallery filter with a single option | Design review | Hidden while only one category exists |
| 18 links below the 44 px touch minimum | Viewport sweep | Padding raised, re-measured to zero |
| Gold numerals at 3.18:1 on cream | Contrast sweep | Darkened to `gold-700` (~4.9:1) |
| Gallery `<h1>` → `<h3>` skip | Heading audit | Notice promoted to `<h2>` |
| Drawer restored focus to `<body>` | Keyboard test | Falls back to the toggle |
| Datalist wrongly in `aria-describedby` | ARIA wiring test | Removed |
| Missing space in two rendered strings | Snapshot text diff | Fixed |
| Gallery loaded 1400 px assets in the grid | Bundle review | Switched to `-thumb` variants |
| 19 dangling `aria-labelledby` references | Independent code audit | `SectionHeading` gained an `id` prop; all wired and verified |
| No security headers | Independent code audit | `headers()` added to `next.config.ts`, CSP strict (`'self'` only) |
| Public POST had no rate limit or origin check | Independent code audit | Origin/`Sec-Fetch-Site` guard + per-IP token bucket |
| `<` unescaped in the JSON-LD payload | Independent code audit | Serialised as `\u003c` |
| Honeypot focusable inside `aria-hidden` | Independent code audit | Moved to `sr-only` + `tabIndex={-1}` |
| Phone/email inputs 20 px out of alignment | Independent design audit | Reserved hint slot in `Field` so grid rows align |
| Section banding delta 0.04 (invisible) | Independent design audit | Deepened `cream-100`; delta now 0.099 |

### Admissions API tests (`node .work/test-admissions-api.mjs`)

```
PASS  GET is rejected with 405
PASS  empty body -> 400 with field errors
PASS  bad phone + bad email -> 400
PASS  unknown campus id -> 400
PASS  honeypot filled -> 202 and explicitly NOT delivered
PASS  valid inquiry, delivery not configured -> 503, never 201
PASS  international phone +92 is accepted
PASS  malformed JSON -> 400
```

---

## 9. Accessibility notes

- Semantic landmarks on every page; one `<h1>` per route; no heading-level skips.
- Skip link to `#main` as the first focusable element.
- Visible 3 px gold focus ring on `:focus-visible`, globally.
- The mobile drawer is a proper disclosure: `aria-expanded`, `aria-controls`,
  focus moves in on open, is trapped with Tab, and returns to the toggle on close.
  Body scroll is locked while open.
- The gallery lightbox is `role="dialog" aria-modal="true"`, labelled, with a
  focus trap, Escape to close, ←/→ navigation, and focus restored to the
  thumbnail that opened it.
- Form fields have real `<label for>`, `aria-required`, `aria-invalid` and
  `aria-describedby` pointing at a `role="alert"` error node.
- `prefers-reduced-motion: reduce` disables all transitions and smooth scrolling.
- Colour contrast was measured, not assumed: gold numerals on cream were failing
  at 3.18:1 and were darkened to `gold-700` (~4.9:1) to reach AA.
- Touch targets: the first sweep measured 18 links below the 44 px minimum —
  footer links at 17 px, campus and social links at 20 px, and desktop header
  nav at 33 px. All were raised and re-measured to zero.
- Button colours are declared as **variants**, not `className` overrides. Under
  Tailwind v4 two same-specificity utilities do not resolve in class-attribute
  order, so an override silently lost and produced dark text on a dark fill on
  the gold CTA. `variant="accent"` now carries that treatment explicitly.
  This was found by measuring computed styles, not by reading the source.

---

## 10. SEO

- Unique title and meta description per route via the `buildMetadata()` factory.
- Open Graph and Twitter card metadata.
- Canonical URLs emitted **only** when `NEXT_PUBLIC_SITE_URL` is set.
- `robots.txt` allows crawling, disallows `/api/`, and advertises the sitemap
  only when the domain is known.
- `School` JSON-LD carries **only** verified fields: name, alternate name, area
  served and the school's own Facebook URL. There is no telephone, address,
  coordinate, opening-hours, rating or price-range property.

---

## 11. Known limitations

### Awaiting the school

1. **Official domain** — required before deployment for canonicals and sitemap.
2. **Contact details** — phone, WhatsApp, email, full postal address, opening
   hours. All `null` and hidden.
3. **Principal's message** — the Leadership page carries a neutral school-level
   introduction and says so. It needs an approved, signed message with name,
   role and photograph.
4. **Campus operating status** — both campuses are labelled
   *"Listed in school records"*. Flip `status` to `"operational"` in
   `src/content/campuses.ts` once the school confirms it.
5. **Campus photographs** — none exist in the supplied material.
6. **Announcements** — `announcements` is intentionally empty; the News page
   renders an honest empty state.
7. **Current session details** — grade offerings, fees, deadlines, class
   availability, facilities and activity schedules are all absent by design.

### Technical

- The rate limiter is per-instance and in-memory. On a multi-instance
  deployment, move the counter into shared storage (Redis, or a hosted KV)
  before relying on it, and serve the API from a platform with edge rate
  limiting.
- `script-src` includes `'unsafe-inline'` because Next emits its own inline
  hydration scripts. Removing it requires per-request nonce support; the site
  contains no user-supplied markup, so the risk is limited.
- Admissions delivery is not active (§6).
- The gallery currently loads full-size WebP assets in the grid; switching
  `src` to the `-thumb` variants would cut gallery page weight substantially.
- `next.config.ts` enables `output: "standalone"` automatically once
  `NEXT_PUBLIC_SITE_URL` is set, for container deployments.

### Recommended production checks

- Run the full browser sweep against the deployed URL.
- Confirm real admissions delivery end to end before announcing the form.
- Re-run `npm audit` on the deployment's lockfile.
- Verify the school's Facebook link resolves publicly.

---

## 12. How this was verified

Review was done by measurement, not by reading source and assuming.

1. **Source analysis** — the brochure has no text layer, so all 8 pages were
   recovered with Windows OCR and colour-variance analysis established that it
   contains no photographs. That finding shaped the gallery and campus panels.
2. **Automated sweep** — 13 routes × 5 viewports = 65 samples, each checking
   horizontal overflow, WCAG contrast (with alpha compositing over ancestor
   backgrounds), touch targets, alt text, broken images, dead links, heading
   hierarchy and page titles.
3. **Interaction tests** — mobile drawer (focus in, Tab trap, Escape, focus
   restore, scroll lock, route change), gallery lightbox (dialog semantics,
   arrow keys, Escape, focus trap, focus restore), admissions form (labelling,
   ARIA wiring, validation, duplicate-submission guard, honest failure).
4. **API tests** — 9 assertions on status codes and the delivered flag.
5. **Security tests** — 14 assertions on headers, cross-site rejection and
   rate limiting, all against the **production** build.
6. **Two independent review agents** ran in parallel against the rendered
   site and the source, and their findings drove a second polish pass.

The second pass fixed: a gold CTA rendering dark-on-dark (1.26:1), 19 dangling
`aria-labelledby` references, 18 undersized touch targets, missing security
headers, an unrate-limited public endpoint, a 20 px form misalignment, invisible
section banding, an empty home-page `<title>`, a single-option gallery filter,
and an unescaped `<` in the JSON-LD payload.

### Independent review — round 2

A second independent pass returned 34 findings. Verified and **fixed**: heading
scale (h1/h2/h3 all rendered at 34px because `SectionHeading` hardcoded one size
regardless of level), a nav that wrapped and misaligned between 1024-1296px, a
focus ring at 2.2:1 against cream (WCAG 1.4.11 requires 3:1 — it was invisible
on the header, every cream section and every form field), form hints rendered
but never referenced by `aria-describedby`, server-side validation errors that
never moved focus, `disabled` on the submit button dropping focus to `<body>`,
`role="alert"` double-announcing inside an `aria-live="polite"` region, arrow
keys in the lightbox yanking focus back to Close, the "n of m" position never
announced, a `NaN` when the gallery category was empty, a `content-length`
body cap trivially bypassed by chunked requests, the 503 echoing server
configuration state to anonymous callers, `new Date()` in the sitemap, a
deployment artifact coupled to a metadata variable, a footer link whose
`textContent` ran campus name and location together, and the Facebook
`/share/` redirect presented as "the official page" and emitted as `sameAs`.

**Two findings were checked and dismissed**, and it matters that they were:

- *"'began educational work in January 2014' is an interpolated date."* The OCR
  of the profile reads *"I started working in Jaruary, 2014"* — January 2014 is
  sourced. Changing it would have deleted a true fact.
- *"'mathematicians who enjoy, businessmen who play basketball…' and 'the
  trophies that follow' are embellishments."* The OCR contains almost exactly
  that sentence: *"mathematicians who enjoy, businessmen who indulge in
  basketball,uarists who may enjoy and engineers who love elocution. Our
  students participate and win various trophies in inter-school events."* It is
  sourced, and the page already attributes it ("The school's profile states…").
  Taking the finding at face value would have thinned real content into
  vaguer prose.

One further claim — that the custom 404 is unreachable — was disproven by
direct test: `/nope` returns the designed page with HTTP 404 and `noindex`.

### Independent review — round 1

Both agents hit the same vision rate limit and substituted computed-style
measurement. Both produced findings that survived verification — including two
the original sweep had missed entirely, because they were measured on the
wrong surface (the CTA contrast bug passed a source-level read because the
class was present in the markup; it only failed when the computed background
was read).

One agent finding was **checked and dismissed**: it reported that
"began educational work in January 2014" was an interpolated date. The OCR of
the school profile reads *"I started working in Jaruary, 2014"*, so January
2014 is sourced, not invented.

---

## 13. Attribution

The school's profile document and official logo are the school's own material
and remain unmodified in the project root. Derived web assets are reproduced
here for the school's own website.