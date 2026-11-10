# Booking conversion improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade The Cosy Place static site so visitors convert to enquiries/WhatsApp bookings with clearer pricing, stronger SEO landers, hospitality branding, and trust content — without instant payments.

**Architecture:** Keep GitHub Pages static HTML. Introduce shared `assets/css/brand.css` (CSS variables) and `assets/js/booking-helpers.js` (rate estimate + WhatsApp prefill). Apply the visual system across `index.html`, all `blog/**`, new SEO landers, and policy pages. Estimate totals client-side from the published rate matrix; Formspree remains the inquiry backend.

**Tech Stack:** HTML5, Tailwind CDN (config tokens aligned to CSS variables), vanilla JS, Flatpickr, Formspree, Font Awesome, Google Fonts (Fraunces + Source Sans 3), optional `cwebp` for WebP.

**Spec:** [docs/superpowers/specs/2026-11-10-booking-conversion-improvements-design.md](../specs/2026-11-10-booking-conversion-improvements-design.md)

## Global Constraints

- Preserve private-cottage messaging (never shared with another party).
- Do not move `/blog/accommodation-in-marlborough-harare/`.
- Rates: whole $70 / $65; one bedroom $50 / $45 (USD).
- Do not invent guest reviews or AggregateRating.
- No Instant Book / payment checkout in this plan.
- Do not name UK/SA/Australia/USA/Canada as diaspora markets in guide copy (existing coming-home rule).
- Mobile-first; Book CTA above the fold on homepage.

## File map

| Path | Responsibility |
|------|----------------|
| `assets/css/brand.css` | CSS variables: colours, type scale helpers |
| `assets/js/booking-helpers.js` | `estimateStayTotal()`, `buildWhatsAppUrl()`, FAB + form wiring |
| `assets/js/analytics.js` | GA4 loader + event helpers (gated on Measurement ID) |
| `assets/photos/*.webp` | WebP companions for gallery/hero JPGs |
| `assets/floor-plan.svg` | Simple 2-bed layout schematic |
| `index.html` | Homepage rebrand + conversion UX + trust + schema extras |
| `rates/index.html` | Dedicated rates / pricing SEO page |
| `accommodation-marlborough-harare/index.html` | Keyword lander (distinct from blog guide) |
| `self-catering-accommodation-harare/index.html` | Keyword lander |
| `two-bedroom-cottage-harare/index.html` | Keyword lander |
| `short-stay-accommodation-harare/index.html` | Keyword lander |
| `terms/index.html`, `privacy/index.html` | Replace footer `#` stubs |
| `blog/**/*.html` | Rebrand tokens, footer year, WhatsApp FAB, nav consistency |
| `sitemap.xml`, `llms.txt`, `robots.txt` | Index new URLs |
| `docs/...` | Spec/plan only |

---

### Task 1: Brand tokens and shared booking helpers

**Files:**
- Create: `assets/css/brand.css`
- Create: `assets/js/booking-helpers.js`
- Modify: `index.html` (Tailwind config + link tags only in this task)

**Interfaces:**
- Produces: CSS vars `--color-primary`, `--color-secondary`, `--color-accent`, `--color-light`, `--color-dark`, `--font-sans`, `--font-serif`
- Produces: `window.CosyBooking.estimateStayTotal({ stayType, checkin, checkout })` → `{ nights, nightlyRate, total, rateBand }`
- Produces: `window.CosyBooking.buildWhatsAppUrl({ stayType, checkin, checkout, guests })` → `https://wa.me/27646662761?text=...`
- Produces: rate constants matching published matrix

- [ ] **Step 1: Add `assets/css/brand.css`**

```css
:root {
  --color-primary: #1f4d3a;
  --color-secondary: #3d4a3f;
  --color-accent: #5b7f6a;
  --color-light: #fafaf7;
  --color-dark: #1c241e;
  --font-sans: "Source Sans 3", system-ui, sans-serif;
  --font-serif: "Fraunces", Georgia, serif;
}
```

- [ ] **Step 2: Add `assets/js/booking-helpers.js` with rate matrix and helpers**

```js
(function (global) {
  const WA_NUMBER = "27646662761";
  const RATES = {
    whole: { short: 70, long: 65 },
    one: { short: 50, long: 45 }
  };

  function parseStayType(value) {
    if (!value) return null;
    return /one bedroom/i.test(value) ? "one" : "whole";
  }

  function nightsBetween(checkin, checkout) {
    const a = new Date(checkin + "T12:00:00");
    const b = new Date(checkout + "T12:00:00");
    const nights = Math.round((b - a) / 86400000);
    return nights > 0 ? nights : 0;
  }

  function estimateStayTotal({ stayType, checkin, checkout }) {
    const key = typeof stayType === "string" && (stayType === "one" || stayType === "whole")
      ? stayType
      : parseStayType(stayType);
    const nights = nightsBetween(checkin, checkout);
    if (!key || nights < 1) return null;
    const rateBand = nights >= 11 ? "long" : "short";
    const nightlyRate = RATES[key][rateBand];
    return { nights, nightlyRate, total: nights * nightlyRate, rateBand, stayKey: key };
  }

  function buildWhatsAppUrl({ stayType, checkin, checkout, guests }) {
    const option = stayType || "one or two-bedroom";
    const from = checkin || "[check-in]";
    const to = checkout || "[check-out]";
    const n = guests || "[number]";
    const text = `Hi, I'd like to enquire about staying at The Cosy Place. I'm interested in the ${option} option from ${from} to ${to} for ${n} guests. Could you please confirm availability?`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  global.CosyBooking = { RATES, estimateStayTotal, buildWhatsAppUrl, parseStayType };
})(window);
```

- [ ] **Step 3: Wire fonts + Tailwind tokens on homepage head**

In `index.html`, replace Inter Google Fonts link with:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/brand.css">
```

Update `tailwind.config` colours/fonts to:

```js
colors: {
  primary: "#1f4d3a",
  secondary: "#3d4a3f",
  accent: "#5b7f6a",
  light: "#fafaf7",
  dark: "#1c241e"
},
fontFamily: {
  sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
  serif: ['Fraunces', "Georgia", "serif"]
}
```

Add before `</body>`:

```html
<script src="assets/js/booking-helpers.js" defer></script>
```

- [ ] **Step 4: Visual smoke check**

Open `index.html` locally. Confirm fonts load and existing red/navy accents start resolving to green once class names still use `primary`/`accent`.

- [ ] **Step 5: Commit**

```bash
git add assets/css/brand.css assets/js/booking-helpers.js index.html
git commit -m "$(cat <<'EOF'
Add hospitality brand tokens and shared booking helpers.

EOF
)"
```

---

### Task 2: Homepage hero, rates clarity, and sticky WhatsApp

**Files:**
- Modify: `index.html` (hero ~454–476, rates ~632–678, add FAB markup + small script)

- [ ] **Step 1: Rewrite hero for where / why / book**

Replace hero inner content with brand-forward copy (keep full-bleed `.hero-gradient` using exterior `O56A0306_113519.jpg` or stronger exterior if chosen in Task 6):

```html
<p class="text-sm md:text-base tracking-[0.2em] uppercase mb-4 opacity-90">The Cosy Place</p>
<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif">Your home away from home in Harare</h1>
<p class="text-xl md:text-2xl mb-8 opacity-90">Comfort, privacy and convenience in the heart of Marlborough.</p>
<div class="flex flex-col sm:flex-row gap-4 justify-center">
  <a href="#booking" class="bg-accent text-white px-8 py-3 rounded-lg font-semibold ...">Book your stay</a>
  <a href="#rates" class="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold ...">Check availability and rates</a>
</div>
```

Keep SEO location signal: ensure first H1 or immediately adjacent visible text still names Marlborough, Harare (if H1 is brand-led, add a clear subline: “Self-catering cottage in Marlborough, Harare”). Preferred: H1 stays location-led for SEO **or** use brand eyebrow + location H1. **Lock:** H1 = `Self-catering accommodation in Marlborough, Harare` (SEO); brand name as large eyebrow above H1 so brand still passes the brand test.

- [ ] **Step 2: Fix rate cards — standard nightly primary**

In `#rates` cards, show `$70` / `$50` as the large figure with caption `2–10 nights`, and a secondary line `11+ nights: $65 / $45`. Remove orphan “From $65 / From $45” as the only price.

- [ ] **Step 3: Add sticky WhatsApp FAB**

Before `</body>`:

```html
<a id="whatsappFab"
   href="https://wa.me/27646662761?text=Hi%2C%20I'd%20like%20to%20enquire%20about%20staying%20at%20The%20Cosy%20Place."
   class="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
   target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp">
  <i class="fab fa-whatsapp text-3xl" aria-hidden="true"></i>
</a>
```

On Flatpickr `onChange` and stay/guest `change`, update `#whatsappFab.href` via `CosyBooking.buildWhatsAppUrl(...)`.

- [ ] **Step 4: Soften CTA chrome**

Replace `rounded-full` primary booking buttons on homepage with `rounded-lg` (hospitality, less pill-cluster). Keep Airbnb brand button styling on its own card.

- [ ] **Step 5: Mobile check**

Resize to 390px width: hero CTAs stack; FAB does not cover form submit; header still usable.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Clarify homepage hero CTAs, nightly rates, and sticky WhatsApp.

EOF
)"
```

---

### Task 3: Shorter booking form + estimated total + response promise

**Files:**
- Modify: `index.html` (`#booking` form ~764–836 and form JS ~1330+)

**Interfaces:**
- Consumes: `CosyBooking.estimateStayTotal`, `CosyBooking.buildWhatsAppUrl`
- Produces: hidden Formspree field `estimated_total`; visible `#estimateBox`

- [ ] **Step 1: Adjust field requirements**

- Keep `name` required.
- Make `phone` required; label `WhatsApp / contact number *`.
- Make `email` not required in HTML; in submit handler, require `email || phone` (phone already required → email optional).
- Keep stay type, dates, guests required; message optional.
- Add prominent line above submit: `We typically respond within 2 hours.`

- [ ] **Step 2: Add estimate UI**

After guests field:

```html
<div id="estimateBox" class="rounded-lg border border-gray-200 bg-light p-4 hidden" aria-live="polite">
  <p class="text-sm text-gray-600">Estimated total</p>
  <p class="text-2xl font-bold text-primary"><span id="estimateAmount">—</span></p>
  <p id="estimateDetail" class="text-sm text-gray-500 mt-1"></p>
  <p class="text-xs text-gray-500 mt-2">Confirmed after we check availability. Prices in USD.</p>
</div>
<input type="hidden" name="estimated_total" id="estimated_total" value="">
```

- [ ] **Step 3: Wire estimate updates**

Whenever stay type or dates change:

```js
const estimate = CosyBooking.estimateStayTotal({
  stayType: stayTypeEl.value,
  checkin: checkinEl.value,
  checkout: checkoutEl.value
});
if (estimate) {
  estimateBox.classList.remove("hidden");
  estimateAmount.textContent = `$${estimate.total}`;
  estimateDetail.textContent = `${estimate.nights} nights × $${estimate.nightlyRate}`;
  estimatedTotalInput.value = `$${estimate.total} (${estimate.nights} × $${estimate.nightlyRate})`;
} else {
  estimateBox.classList.add("hidden");
  estimatedTotalInput.value = "";
}
```

- [ ] **Step 4: Sync booking-panel WhatsApp link** with the same helper as the FAB.

- [ ] **Step 5: Manual test matrix**

| Stay | Nights | Expected nightly | Expected total |
|------|--------|------------------|----------------|
| Whole | 3 | 70 | 210 |
| Whole | 11 | 65 | 715 |
| One | 2 | 50 | 100 |
| One | 14 | 45 | 630 |

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add booking estimate and shorten the inquiry form.

EOF
)"
```

---

### Task 4: Trust section, policies, map, personas, contact clarity

**Files:**
- Modify: `index.html` (new section before `#booking` or after rates)
- Create: `terms/index.html`
- Create: `privacy/index.html`
- Modify: footers in `index.html` and `blog/**/*.html` to link Terms/Privacy and dynamic year

- [ ] **Step 1: Add `#why-guests` section**

Include:
- Heading: Why guests choose The Cosy Place
- Persona line (families, diaspora visitors, business travellers, couples, longer stays) — no fake quotes
- Trust facts: secure parking / building security as already stated; check-in/out times (lock defaults: check-in 14:00, check-out 10:00 unless host overrides before implement); cancellation (free up to 7 days); payment (USD; deposit/balance details: “Pay by bank transfer or agreed method after availability is confirmed — no card charge on enquiry”)
- Testimonials: if no permissioned quotes yet, show Airbnb listing link CTA only: “Read guest reviews on Airbnb” → existing Airbnb URL. Do not invent quotes.
- Embed OpenStreetMap or Google Maps iframe centred on Marlborough / Westgate (use existing schema coords `-17.76160, 31.01020` with a city-level zoom, not a private street pin if privacy prefers — **lock:** neighbourhood zoom 14 around those coords)

- [ ] **Step 2: +27 clarity**

Near every phone display:

```html
<a href="tel:+27646662761">+27 64 666 2761</a>
<span class="text-sm opacity-80">(WhatsApp · South Africa-based manager)</span>
```

- [ ] **Step 3: Create minimal Terms + Privacy pages**

Mirror blog page chrome (header/footer). Terms cover enquiry vs confirmed booking, cancellation (7 days), rates in USD, property rules at high level. Privacy: Formspree processing, contact use for booking only, no sale of data. Update footer links from `href="#"` to `terms/` and `privacy/` (relative paths correct per page depth).

- [ ] **Step 4: Footer year**

```html
<span id="year">2026</span>
<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
```

Replace `© 2024` on all pages.

- [ ] **Step 5: Commit**

```bash
git add index.html terms/privacy blog
git commit -m "$(cat <<'EOF'
Add trust content, policy pages, and contact clarity.

EOF
)"
```

---

### Task 5: Meta polish, WebSite schema, homepage heading fixes

**Files:**
- Modify: `index.html` `<head>` + JSON-LD block ~1124–1200

- [ ] **Step 1: Update homepage title + description**

```html
<title>Self-Catering Accommodation in Marlborough, Harare | The Cosy Place</title>
<meta name="description" content="Stay at The Cosy Place, a private self-catering cottage in Marlborough, Harare. Enjoy comfortable 1 and 2-bedroom accommodation, solar backup, borehole water and fast Wi-Fi. Enquire directly.">
```

Align `og:title` / `twitter:title` / descriptions.

- [ ] **Step 2: Add WebSite JSON-LD** alongside Organization (same script or adjacent):

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The Cosy Place",
  "url": "https://thecosyplace.co.zw/"
}
```

Keep existing `VacationRental` block; do not add fake reviews.

- [ ] **Step 3: Fix H2→H4 skips** in About feature tiles and booking benefits — use `h3`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Polish homepage SEO meta, WebSite schema, and headings.

EOF
)"
```

---

### Task 6: Photography — WebP, exterior gallery, floor plan, video slot

**Files:**
- Create: WebP files under `assets/photos/`
- Create: `assets/floor-plan.svg`
- Modify: `index.html` gallery + about images to `<picture>`
- Optional: `assets/video/` only if host provides file

- [ ] **Step 1: Generate WebP for images referenced in HTML**

```bash
cd "assets/photos"
for f in *.jpg; do cwebp -q 78 "$f" -o "${f%.jpg}.webp"; done
```

If `cwebp` missing, install via `brew install webp` or use `npx @squoosh/cli` — pick one and use it consistently.

- [ ] **Step 2: Convert gallery/hero/about `<img>` to `<picture>`**

```html
<picture>
  <source srcset="assets/photos/NAME.webp" type="image/webp">
  <img src="assets/photos/NAME.jpg" alt="two-bedroom self-catering cottage living room Marlborough Harare" loading="lazy" width="800" height="600" class="...">
</picture>
```

Use descriptive alts including Marlborough/Harare where natural. Keep logo decorative `alt=""`.

- [ ] **Step 3: Expand Outside gallery** using unused exteriors (`O56A0335`–`O56A0343` as appropriate). Lead gallery jump with Exterior.

- [ ] **Step 4: Add simple SVG floor plan** under About or Gallery: two bedrooms, two bathrooms, lounge, kitchen, porch — labelled schematic, not a survey document.

- [ ] **Step 5: Video**

If an MP4 or YouTube URL is provided in-session, embed a 30–60s walkthrough under Gallery. If not provided, skip embed (do not ship a broken player).

- [ ] **Step 6: Commit**

```bash
git add assets/photos assets/floor-plan.svg index.html
git commit -m "$(cat <<'EOF'
Improve property photography delivery with WebP and exterior coverage.

EOF
)"
```

---

### Task 7: SEO landing pages + rates page

**Files:**
- Create: `rates/index.html`
- Create: `accommodation-marlborough-harare/index.html`
- Create: `self-catering-accommodation-harare/index.html`
- Create: `two-bedroom-cottage-harare/index.html`
- Create: `short-stay-accommodation-harare/index.html`
- Modify: `sitemap.xml`, `llms.txt`, homepage/footer internal links

**Content rules:** Unique 400–700 words each; one primary keyword; amenities + CTA to `../index.html#booking`; BreadcrumbList JSON-LD; no thin doorway duplicate paragraphs.

| URL | Title pattern | H1 focus |
|-----|---------------|----------|
| `/rates/` | Rates for self-catering accommodation in Harare \| The Cosy Place | Published USD rates + both stay options |
| `/accommodation-marlborough-harare/` | Accommodation in Marlborough, Harare \| The Cosy Place | Neighbourhood stay option (link to deeper blog guide) |
| `/self-catering-accommodation-harare/` | Self-Catering Accommodation Harare \| The Cosy Place | Kitchen, privacy, utilities resilience |
| `/two-bedroom-cottage-harare/` | Two-Bedroom Cottage Harare \| The Cosy Place | Whole-cottage layout, up to 4 guests |
| `/short-stay-accommodation-harare/` | Short-Stay Accommodation Harare \| The Cosy Place | 2–10 night stays, business & visits |

- [ ] **Step 1: Clone chrome from `blog/coming-home-to-harare/index.html`** as template (header/footer/paths adjusted for one level deep: `../assets/...`, `../index.html#booking`).

- [ ] **Step 2: Write each lander** with unique meta title/description, one H1, amenity proof, link to booking + WhatsApp FAB.

- [ ] **Step 3: `/rates/` includes the full rate table + estimate explainer (“enquiry confirms availability”) + note that Airbnb is whole cottage only; one-bedroom is direct.

- [ ] **Step 4: Update `sitemap.xml`** with all five URLs, `lastmod` today (`2026-11-10`), priority 0.8 for landers / 0.9 for rates.

- [ ] **Step 5: Update `llms.txt`** to list new URLs + coming-home guide.

- [ ] **Step 6: Add footer “Explore” links** on homepage to landers (one compact list — not a homepage keyword dump in the hero).

- [ ] **Step 7: Commit**

```bash
git add rates accommodation-marlborough-harare self-catering-accommodation-harare two-bedroom-cottage-harare short-stay-accommodation-harare sitemap.xml llms.txt index.html
git commit -m "$(cat <<'EOF'
Add SEO landing pages and a dedicated rates URL.

EOF
)"
```

---

### Task 8: New guide articles

**Files:**
- Create under `blog/`:
  - `self-catering-vs-hotels-harare/index.html`
  - `best-areas-harare-business-travellers/index.html`
  - `things-to-do-near-marlborough-harare/index.html`
  - `what-to-expect-booking-accommodation-zimbabwe/index.html`
- Modify: `blog/index.html` listings
- Modify: `sitemap.xml`

Note: “Where to Stay in Harare: Marlborough” and “Coming Home” already exist — do not duplicate; link them from new pieces.

- [ ] **Step 1: Author each guide** from the Marlborough/coming-home template (FAQ optional; only add FAQPage JSON-LD when the page truly is Q&A).

- [ ] **Step 2: Each article ends with a CTA** to The Cosy Place booking (`../../index.html#booking`) and mentions both stay options + utilities (solar, borehole, fibre).

- [ ] **Step 3: Register on blog index + sitemap.**

- [ ] **Step 4: Commit**

```bash
git add blog sitemap.xml
git commit -m "$(cat <<'EOF'
Publish additional Harare travel guides that link back to booking.

EOF
)"
```

---

### Task 9: Propagate rebrand + FAB to blog and landers; GA4

**Files:**
- Modify: every HTML page head (fonts, brand.css, tailwind colour tokens)
- Create: `assets/js/analytics.js`
- Modify: all pages to include analytics + FAB

- [ ] **Step 1: Mirror Task 1 token/font changes** on blog + landers + policy pages.

- [ ] **Step 2: Add FAB** on all public pages with generic prefill (form-aware only on homepage).

- [ ] **Step 3: `assets/js/analytics.js`**

```js
(function () {
  var MEASUREMENT_ID = window.COSY_GA4_ID || ""; // set in page: window.COSY_GA4_ID = "G-XXXXXXXX";
  if (!MEASUREMENT_ID) return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-analytics]");
    if (!a) return;
    gtag("event", a.getAttribute("data-analytics"), { transport_type: "beacon" });
  });
})();
```

Add `data-analytics="whatsapp_click"` on FAB; `book_cta_click` on hero Book; fire `booking_submit` on Formspree success.

**Gate:** Do not invent a fake GA ID. Before enabling, set `window.COSY_GA4_ID` once the property exists. Until then, ship the script inert.

- [ ] **Step 4: Blog Twitter/OG completeness** — add `twitter:title`, `twitter:description`, `twitter:image` on guide pages missing them.

- [ ] **Step 5: Commit**

```bash
git add assets/js/analytics.js blog rates accommodation-marlborough-harare self-catering-accommodation-harare two-bedroom-cottage-harare short-stay-accommodation-harare terms privacy index.html
git commit -m "$(cat <<'EOF'
Propagate rebrand sitewide and prepare GA4 event hooks.

EOF
)"
```

---

### Task 10: Verification pass

**Files:** none required unless fixes

- [ ] **Step 1: Link check** — all new nav/footer/CTA paths resolve locally (open each lander + blog + terms/privacy).

- [ ] **Step 2: Booking math** — re-run Task 3 matrix on production build folder.

- [ ] **Step 3: Rich Results Test** (homepage URL or raw HTML) for VacationRental / WebSite; lander BreadcrumbList.

- [ ] **Step 4: Lighthouse mobile** on homepage — address only regressions introduced (images lazy, WebP). No need to chase 100.

- [ ] **Step 5: Confirm GSC** — after deploy, submit updated sitemap in Search Console (manual host step); verify no accidental noindex.

- [ ] **Step 6: Final commit only if fixes landed**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Fix verification issues from conversion improvement pass.

EOF
)"
```

---

## Spec coverage checklist

| Spec area | Tasks |
|-----------|-------|
| Rebrand greens/fonts | 1, 2, 9 |
| Hero where/why/book | 2 |
| Sticky WhatsApp + prefill | 2, 3, 9 |
| Rates clarity | 2, 7 |
| Estimate + shorter form + 2h promise | 3 |
| Trust / map / policies / +27 / year | 4 |
| Meta + schema | 5, 7 |
| Photography WebP / exterior / floor plan / video | 6 |
| SEO landers + rates URL | 7 |
| Extra guides | 8 |
| GA4 + sitewide polish | 9 |
| GSC/sitemap/CWV sanity | 7, 10 |
| No instant pay / no fake reviews | Global + 3, 4 |

## Out of scope reminders

- Live availability calendars / iCal blocking  
- Payment gateways  
- Moving existing Marlborough blog URL  
- Invented testimonials
