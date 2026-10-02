# Coming home to Harare — SEO design

Date: 2026-10-02

## Goal

Help Zimbabweans living anywhere abroad find The Cosy Place when they search for a place of their own on a trip home to Harare. Keep the homepage focused on “self-catering cottage in Marlborough, Harare.”

Google ranks each URL on its own. A blog index does not replace the two guide pages. It is the shelf they sit on, and it keeps the homepage from growing a new section.

## What stays

- Homepage title, H1, and vacation-rental structured data stay as they are.
- The Marlborough guide stays at `https://thecosyplace.co.zw/blog/accommodation-in-marlborough-harare/`. Do not move that URL.
- Rates stay the published USD rates: whole cottage $70 a night for 2–10 nights and $65 for 11 or more; one bedroom $50 and $45.
- Copy does not name the UK, South Africa, Australia, the USA, or Canada, and it does not offer a diaspora discount.

## New pages

### Blog index — `/blog/`

- File: `blog/index.html`
- Canonical: `https://thecosyplace.co.zw/blog/`
- Title: `Guides | The Cosy Place`
- H1: `Guides`
- One short intro: practical notes for staying at the cottage in Marlborough, Harare.
- Two links, each with the guide’s title and one sentence:
  - Accommodation in Marlborough, Harare — where the cottage is, and what is nearby.
  - Coming home to Harare — a place of your own when you visit family.
- Same header, footer, and visual style as the Marlborough guide.
- Header item that today says Location becomes Guides and points here, on the homepage, the Marlborough guide, and this index. Desktop and mobile.

### Coming-home guide — `/blog/coming-home-to-harare/`

- File: `blog/coming-home-to-harare/index.html`
- Built from the Marlborough guide template (header, footer, type, colours, one photo, book button).
- Canonical: `https://thecosyplace.co.zw/blog/coming-home-to-harare/`
- Title: `Coming home to Harare | The Cosy Place`
- Meta description: `A private self-catering cottage in Marlborough, Harare, for a visit home. Solar backup, borehole water, Wi-Fi, and USD rates. Book the whole cottage or one bedroom.`
- H1: `A place of your own when you come home to Harare`
- Breadcrumb: Home / Guides / Coming home to Harare
- Opening: you are visiting family and want your own front door. The Cosy Place is a private cottage in Marlborough, Harare.
- A short facts list, using the same numbers as the homepage: location, both stay options and rates, what is included (kitchen, uncapped Wi-Fi, DSTV, solar inverter, solar geyser, borehole water, washer and dryer, parking for two cars), and how to book (direct on the site, or the whole cottage on Airbnb). Booking from overseas is by the site form or WhatsApp.
- Photo: the entrance image already used on the Marlborough guide, `assets/photos/O56A0339_112115.jpg`.
- Five questions, visible on the page and repeated in FAQ structured data:
  1. Can I book from overseas? Yes. Use the form or WhatsApp. Rates are in USD.
  2. What happens when the power or water drops? Solar inverter for the lights, solar geyser for hot water, private borehole for the taps. Wi-Fi, DSTV, washer and dryer, and parking for two cars are included.
  3. How do I get to family nearby? The cottage is in Marlborough, near Westgate Shopping Centre. Avondale, Strathaven, and Avonlea are nearby. Parking for two cars is on the property.
  4. Can I stay over the holidays? Yes. The same USD rates apply. Send dates early.
  5. Is this a shared guest house? No. It is a private cottage. The whole cottage sleeps four. One bedroom sleeps two. Either way the cottage is not shared with another party.
- Book button links to the homepage booking form.
- Structured data, same pattern as the Marlborough guide: `BlogPosting`, `BreadcrumbList`, and `FAQPage`. `about` points at `https://thecosyplace.co.zw/#cottage`.

## Homepage link

In the about section, keep the sentence that the cottage is in Marlborough near Westgate. Replace the single “Read about accommodation in Marlborough” link with one line and two links: Guides for [accommodation in Marlborough](blog/accommodation-in-marlborough-harare/) and [coming home to Harare](blog/coming-home-to-harare/).

Do not add a new homepage section.

## Marlborough guide tweaks

- Breadcrumb becomes Home / Guides / Accommodation in Marlborough. Guides links to `/blog/`.
- The footer item that points at this page as “Location” becomes “Guides” and points at `/blog/`.

## Sitemap

Add both new URLs to `sitemap.xml`, with `lastmod` of 2026-10-02. Leave the homepage priority at 1.0. Give `/blog/` priority 0.6 and the coming-home guide priority 0.8, matching the Marlborough guide.

## Done when

- `/blog/` lists both guides.
- `/blog/coming-home-to-harare/` answers the five questions and shows the real rates.
- The homepage title is unchanged, and the about section links to both guides in one line.
- Header and footer say Guides and open the blog index.
- The Marlborough URL still resolves.
- Both new URLs are in the sitemap.
