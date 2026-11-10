# The Cosy Place — booking conversion improvements (design)

Date: 2026-11-10  
Scope choice: **Full brief** (conversion UX + SEO foundation + hospitality rebrand + trust + photography + guides + tech fixes)

## Goal

Turn thecosyplace.co.zw into a booking-conversion site: visitors searching for Harare / Marlborough accommodation should immediately know where it is, why it is worth staying, and how to enquire — then complete a short, transparent booking request (or WhatsApp) with an estimated total.

## Non-goals (this programme)

- Instant booking, payments, or live blocked-date calendars (iCal sync). Keep inquiry + estimate; treat automated booking as a later phase.
- Framework rewrite (Next.js/React). Remain static HTML + Tailwind CDN + vanilla JS on GitHub Pages.
- Fabricated guest reviews.

## What already exists (preserve)

- Location-led H1 and private-cottage messaging (whole cottage or one bedroom; never shared).
- Published USD rates: whole cottage $70 (2–10 nights) / $65 (11+); one bedroom $50 / $45.
- Formspree inquiry form with Flatpickr date range and stay-type guest caps.
- VacationRental + Organization JSON-LD; robots.txt; sitemap; canonicals; GSC verification file.
- Guides: `/blog/`, Marlborough guide, coming-home guide (do **not** move Marlborough URL).
- Airbnb whole-cottage listing + direct booking path.

## Locked product decisions

| Decision | Choice |
|----------|--------|
| Stack | Static HTML/CSS/JS; duplicate shared patterns across pages (existing model). Optional small shared `assets/js/booking.js` for estimate + WhatsApp helpers. |
| Visual system | Warm hospitality: deep forest green primary, sage accent, warm stone neutrals, white surfaces. Replace navy/red. |
| Typography | Replace Inter. Display: Fraunces. Body: Source Sans 3. Keep serif for brand/H1 energy. |
| Hero | Full-bleed exterior photo; brand name as hero-level signal; one headline; one support line; primary CTA Book your stay → `#booking`; secondary Check rates → `#rates`. Prices appear in rates section and as soft cue near CTA, not a cluttered hero stats row. |
| Sticky WhatsApp | Floating button (mobile priority, also desktop). Prefills from current form values when present; otherwise a generic enquire message. |
| Cost estimate | Client-side nights × published rate matrix. Label as “Estimated total — confirmed after we check availability.” No payments. |
| Form fields | Full name*; WhatsApp/phone*; email optional if phone present (validate at least one contact); stay type*; dates*; guests*; additional requests optional. |
| Response promise | “Typically respond within 2 hours” next to form submit and in success state (already present — elevate visually). |
| SEO landers | New top-level folders (not under `/blog/`): `/rates/`, `/self-catering-accommodation-harare/`, `/two-bedroom-cottage-harare/`, `/short-stay-accommodation-harare/`, `/accommodation-marlborough-harare/` (distinct from existing blog slug). Unique content + CTA to `#booking`. |
| Schema | Keep VacationRental; add WebSite + BreadcrumbList on landers; FAQPage only on FAQ-shaped pages; no fake AggregateRating. |
| Trust | “Why guests choose The Cosy Place”: persona strip, security/check-in/payment/cancellation copy, map embed (Marlborough-level), testimonials only with permissioned quotes or Airbnb review link CTA. |
| Photography | Promote unused exterior JPGs into hero/gallery; generate WebP + `<picture>`; SEO-friendly alt text; simple SVG floor plan; walkthrough video section wired when an MP4/YouTube URL exists (omit media until asset provided). |
| Analytics | GA4 via gtag; events for booking submit, WhatsApp click, Book CTA click. Requires a real Measurement ID before go-live of that task. |
| Contact | Keep +27 number; label as WhatsApp / South Africa-based manager number, international WhatsApp OK. |
| Footer | Dynamic year via small JS; real Terms + Privacy pages (replace `href="#"`). |
| Pricing clarity | Rate cards show standard nightly ($70 / $50) as primary; “From $65 / $45” only as 11+ nights note — never alone. |

## Homepage information architecture (after)

1. Header: brand, Home, About, Gallery, Guides, Contact/Book  
2. Hero (where / why / book)  
3. Why stay (amenity strip: backup power, borehole, fibre, secure parking)  
4. About + private cottage clarity  
5. Stay options & rates (clear 1BR / 2BR)  
6. Why guests choose us (trust)  
7. Book platforms + direct inquiry (estimate + short form + 2-hour promise)  
8. Gallery (rooms + exterior)  
9. Footer  

## Success criteria

- Mobile: Book CTA and WhatsApp reachable without hunting; form under ~7 required fields; estimate visible before submit.  
- SEO: unique title/description per important URL; landers in sitemap; schema validates in Rich Results Test.  
- Brand: first viewport still reads as The Cosy Place in Marlborough if nav is ignored.  
- No invented reviews; private-cottage messaging preserved.
