# Wildlife Tidbits website — notes for Claude Code

Static site (plain HTML/CSS/JS, no build step). Deployed on Vercel; every push to `main` redeploys automatically.

## Files
- `index.html` — Home (hero + player, podcast library, newsletter band)
- `about.html` — About (served at `/about` via `cleanUrls` in `vercel.json`)
- `styles.css` — all styling; design tokens are CSS variables in `:root`
- `main.js` — home-page behaviour (player, habitat filters, newsletter, platform pills)
- `site.config.js` — **the only file to touch for content**: podcast links, newsletter URL, episode list
- `assets/` — optimized logo, favicon, headshot (webp)
- `design-reference/` — original Claude Design handoff (specs + screenshots). Not deployed. `README.md` there has exact colors, type and spacing.

## Placeholder behaviour
- `episodes: []` → hero shows "Coming soon", player disabled, library shows 3 dashed placeholder rows.
- Empty `links.*` → that platform pill renders as "Spotify · Soon" (not clickable).
- Empty `newsletterAction` → form shows "Signups open soon" instead of submitting.

## Conventions
- Keep it build-free unless the owner asks for a framework (handoff suggests Astro once RSS is live).
- Match the design-reference specs; Lexend font; mobile must work at 375px.
- Contact email `hello@wildlifetidbits.com` is a placeholder — confirm before changing.
- Preview locally: `npx serve .` then open http://localhost:3000
