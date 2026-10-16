# Handoff: Wildlife Tidbits website

## Overview
Marketing site for **Wildlife Tidbits**, a weekly wildlife-facts podcast hosted by conservation biologist Dr. Audra A. Huffmeyer. Tagline: "Listen. Learn. Love wildlife." Two pages:
- **Home** — this week's tidbit + latest-episode player, filterable podcast library, newsletter signup.
- **About** — host intro with photo, bio, press, Instagram, Listen/Learn/Love values, contact CTA.

Goal: ship as a real codebase in a GitHub repo, auto-deployed to Vercel, with episodes pulled from the podcast RSS feed.

## About the Design Files
The `.dc.html` files in `design/` are **design references built in HTML** — they show the intended look and behavior, not production code. Recreate them in a proper framework. **Recommended: Astro** (static, content-first, great RSS support, zero-config on Vercel), with Tailwind or plain CSS. Next.js is fine if preferred.

To view the references: open `design/Wildlife Tidbits.dc.html` / `design/About Us.dc.html` in a browser (they need `support.js` and `assets/` next to them — already included).

## Fidelity
**High-fidelity.** Colors, type, spacing, copy and interactions are final. Recreate pixel-accurately.

## Recommended stack & deployment
- Astro + TypeScript. Pages: `src/pages/index.astro`, `src/pages/about.astro`.
- Episodes: fetch the podcast host's RSS feed at build time (e.g. `rss-parser` or `@astrojs/rss` utilities). Set feed URL in env var `PODCAST_RSS_URL`.
- Rebuild weekly: Vercel Deploy Hook triggered by a cron (Vercel Cron or GitHub Action) so new episodes appear without a code push. Alternative: SSR/ISR with ~1h revalidation.
- Newsletter: embed/POST to the chosen provider (Beehiiv / Kit / Mailchimp). Env var `NEWSLETTER_ENDPOINT` or provider form action. Provider's RSS-to-email automation sends the weekly email.
- Hosting: GitHub repo → Vercel "Import Git Repository". Clean URLs (`/`, `/about`).

## Data model (from RSS)
```ts
type Episode = {
  no: number;        // itunes:episode
  date: string;      // pubDate, display "Oct 14"
  title: string;     // item title
  tidbit: string;    // FIRST sentence/line of description
  habitat: 'Ocean'|'Forest'|'Grassland'|'Sky'|'Deep sea'; // from a tag/keyword "Habitat: X" or itunes:keywords
  animal: string;    // optional, from keyword "Animal: X" (used in hero photo badge)
  audioUrl: string;  // enclosure url
  durationSec: number; // itunes:duration
  image?: string;    // itunes:image (hero photo)
};
```
Latest episode (index 0) drives the hero. Sample data in the reference files is placeholder.

## Screens

### Shared: Header (both pages)
- Container max-width 1240px, padding 20px 32px, flex space-between, wraps.
- Left: logo `assets/logo-a.png` 60×60, border-radius 50%, object-fit cover, scale(1.04) to hide white corners. Next to it: "Wildlife Tidbits" Lexend 600 22px, letter-spacing -0.01em; below it tagline "LISTEN. LEARN. LOVE WILDLIFE." 11px 500, letter-spacing 0.18em, uppercase, #2fa883. Whole logo block links to `/`.
- Nav (gap 28px, 15px): Home · Episodes (`/#library`) · About (`/about`) · button "Join the newsletter" (`/#listen`): bg #2f67d8, white, padding 11px 20px, radius 999px, 500; hover bg #0d1b3d.
- Current page link: color #2f67d8, weight 500. Other links #0d1b3d, hover #2f67d8.

### Shared: Footer
- max-width 1240, padding 28px 32px 40px, flex space-between, 14px #6a7590: "© 2026 Wildlife Tidbits" | tagline 12px 500 uppercase 0.16em #2fa883.

### Home — Hero
- Grid `repeat(auto-fit, minmax(min(100%,440px),1fr))`, gap 56px, padding 40px 32px 72px, align center.
- Left column (flex col, gap 22px):
  - Pill "THIS WEEK'S TIDBIT · {habitat}": 12px 600, 0.14em, uppercase, bg #cff5e6, padding 8px 14px, radius 999.
  - H1 = tidbit headline: Lexend 600, clamp(40px,5.6vw,68px), line-height 1.04, letter-spacing -0.03em, text-wrap balance.
  - Body: 20px 300, line-height 1.6, #33405f, max 50ch.
  - **Player card**: bg #fff, radius 28px, padding 14px 22px 14px 14px, max-width 540px, shadow `0 1px 0 rgba(13,27,61,.06), 0 8px 24px rgba(13,27,61,.06)`. Contents: 56px circular play button bg #2f67d8 (hover #0d1b3d) with ▶ / ❚❚; label "LATEST EPISODE · EP. {no} · {date}" (11px 600 0.14em uppercase #2fa883; switches to "NOW PLAYING" when a non-latest episode is loaded); title 14px 500 ellipsis + time "m:ss / m:ss" #6a7590; progress bar 6px, track #e3f2ec, fill #2fa883, radius 999.
  - "Listen on" row (14px #6a7590) + 3 pill links: Spotify, Apple Podcasts, YouTube — 14px 500, border 1.5px #c9dcd4, padding 9px 16px, radius 999; hover border/text #2f67d8.
  - Link "Browse all episodes ↓" → #library, 15px 500 #2f67d8.
- Right column: square (max 540px). Mint disc #cff5e6 full-size; inner circle at 9% inset holds the episode photo (placeholder now). Navy badge bottom-right (bg #0d1b3d, radius 16px, padding 12px 16px): "EPISODE {no}" 11px 0.14em uppercase #cff5e6 / animal name 15px 500 white.

### Home — Podcast library (`#library`)
- Container max-width 1240, padding 0 32px 96px.
- Header row: H2 "Podcast library" 36px 600 -0.02em; sub "{n} episodes · new every week" 16px 300 #6a7590. Right: filter pills All / Ocean / Forest / Grassland / Sky / Deep sea — 14px 500, padding 9px 16px, radius 999, border 1.5px. Active: bg+border #0d1b3d, white text. Inactive: transparent, border #c9dcd4, text #0d1b3d.
- List (flex col gap 10px). Row: flex wrap, gap 20px, padding 18px 24px 18px 18px, radius 24px, bg #eaf6f1 (current episode #fff; hover #fff).
  - 48px circle play button, border 1.5px #2f67d8; current: filled #2f67d8 white glyph; else transparent #2f67d8 glyph.
  - Middle (flex 1 1 320px): "EP. {no} · {date}" 12px 600 0.12em uppercase #2fa883; title 20px 600; tidbit 15px 300 #33405f line-height 1.5.
  - Right: habitat chip (13px 500, bg #cff5e6, padding 6px 12px, radius 999) + duration 14px #6a7590.

### Home — Newsletter (`#listen`)
- Outer padding 0 20px 20px. Inner: max-width 1240, bg #0d1b3d, white, radius 32px, padding 56px clamp(24px,5vw,64px); 2-col auto-fit grid (min 380px), gap 40px.
- Left: eyebrow "THE NEWSLETTER" 12px 600 0.16em #7fe0bd; H2 "Wild facts, straight to your inbox." clamp(30px,4vw,44px) 600; body "One email a week: the new tidbit and the latest episode, the day it drops. Free, and you can unsubscribe anytime." 18px 300 #c6cde0.
- Right: form — email input (white, radius 999, padding 16px 20px, 15px, required) + "Subscribe" button (bg #cff5e6, navy, 600, hover #fff). On success label → "You're in ✓". Below: "Or listen on" + Apple Podcasts / Spotify / YouTube pills (border #33416a, hover border/text #cff5e6).

### About — Hero
- Same grid as Home hero (padding 56px 32px 80px).
- Left: pill "ABOUT US"; H1 "Small stories about a very big, very wild world."; body "Fun, science-backed animal facts from a conservation biologist. Each week, one surprising tidbit, unpacked in just a few minutes — for anyone who's ever wondered how an animal does what it does."
- Right (flex col, centered, gap 28px):
  - Square max 500px: mint disc + headshot `assets/audra-headshot.png` in inner circle (9% inset, object-fit cover, object-position 50% 20%). Navy badge bottom-right: "YOUR HOST" / "Dr. Audra A. Huffmeyer" 16px 500.
  - "AS SEEN IN" (12px 600 0.16em #6a7590) + National Geographic · NPR · Los Angeles Times · The Guardian (18px 600, centered, gap 10px 22px). Use outlets' official logos later if licensed; text for now.
  - Button "Follow @wildlifetidbits on Instagram →" → https://www.instagram.com/wildlifetidbits/ (new tab), border 1.5px #c9dcd4, radius 999.

### About — Bio
- max-width 820px block. Pill "MEET YOUR HOST"; H2 "Dr. Audra A. Huffmeyer" clamp(34px,4.4vw,52px) 600; line "Conservation biologist · National Geographic Explorer" 15px 500 #2f67d8; two paragraphs 19px 300 line-height 1.65 #33405f (copy in `design/About Us.dc.html`).

### About — Listen / Learn / Love
- 3 white cards (auto-fit min 300px, gap 18px, radius 24px, padding 32px): eyebrow 13px 600 #2fa883, H3 24px 600, body 16px 300.
  - Listen — "One fact, a few minutes." / "Short enough for a commute or a coffee break, every single week."
  - Learn — "Real science, plainly told." / "Every tidbit is researched and checked, then explained without the jargon."
  - Love wildlife — "Curiosity that turns into care." / "The more you know about an animal, the more you want to protect it."

### About — Contact CTA
- Navy band (same style as newsletter band), flex space-between: H2 "Got an animal you're curious about?" + "Suggest a tidbit, or just say hello." Buttons: "Email us" (mailto, mint bg) + "Join the newsletter" (→ /#listen, outline). Email address is a placeholder — confirm with owner.

## Interactions & Behavior
- **Single shared audio player**: one <audio> element. Hero play toggles current episode. Clicking a library row loads that episode into the hero player and plays; clicking the current row toggles pause. Progress + time update from audio `timeupdate`. Reset at end.
- **Filters**: client-side filter by habitat; count label updates.
- **Newsletter form**: validate email (HTML required/type=email), POST to provider, show "You're in ✓" on success, inline error on failure.
- Hover transitions ~0.2s. Responsive: all grids auto-fit/wrap; test at 375px.
- Accessibility: aria-labels on play buttons, visible focus rings (#2f67d8), alt text on images.

## Design Tokens
Colors:
- Navy (ink) #0d1b3d — text, dark bands, active states
- Brand blue #2f67d8 — primary buttons, links
- Mint #cff5e6 — pills, discs, chips
- Teal #2fa883 — eyebrows, tagline, progress (on light bg); #7fe0bd on navy
- Page bg #f4fbf8; row bg #eaf6f1; track #e3f2ec; card #ffffff
- Body text #33405f; muted #6a7590; on-navy muted #c6cde0
- Borders #c9dcd4 (light), #33416a (on navy)
Typography: **Lexend** (Google Fonts) weights 300/400/500/600. Eyebrows uppercase with 0.12–0.18em tracking.
Radii: 999 (pills/buttons), 16 (badges), 20–24 (cards/rows), 28 (player), 32 (bands).
Spacing: container 1240px, side padding 32px; section bottom padding 88–96px; common gaps 10/14/18/22/28/56.
Shadow: player only — `0 1px 0 rgba(13,27,61,.06), 0 8px 24px rgba(13,27,61,.06)`.

## Assets
- `assets/logo-a.png` — primary circular logo (owner-provided). Also use as favicon.
- `assets/logo-b.png` — brand sheet (palette/lockups reference only).
- `assets/audra-headshot.png` — host headshot, cropped from owner's photo. Convert to WebP/AVIF for production.
- Episode photos: placeholders in design; use RSS `itunes:image` or a per-episode image.

## Files
- `design/Wildlife Tidbits.dc.html` — Home reference
- `design/About Us.dc.html` — About reference
- `design/support.js` — runtime needed to open the references
- `design/assets/` — images

## Screenshots
`screenshots/` — reference captures at ~910px preview width: `01-03-home.png` (hero, library, newsletter), `01-04-about.png` (intro, photo, bio, CTA). At wider desktop widths the hero is two columns.

## Open items for owner
- Podcast host + RSS feed URL
- Spotify / Apple Podcasts / YouTube show URLs
- Newsletter provider
- Contact email
- Custom domain (wildlifetidbits.com) in Vercel
