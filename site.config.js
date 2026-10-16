// ─────────────────────────────────────────────────────────────
//  Wildlife Tidbits — site settings
//  Everything that's still a placeholder lives here.
//  Fill in a value, push to GitHub, and Vercel redeploys.
// ─────────────────────────────────────────────────────────────
window.SITE = {
  // Podcast show pages. Leave "" to show the button as "Coming soon".
  links: {
    spotify: "",
    apple: "",
    youtube: "",
  },

  // Newsletter signup. Paste your provider's form action URL
  // (Beehiiv / Kit / Mailchimp). Leave "" while signups aren't open.
  newsletterAction: "",

  // Episodes, newest first. While this list is empty the site shows
  // "coming soon" placeholders in the player and the library.
  //
  // Example entry:
  // {
  //   no: 1,
  //   date: "Jan 6",
  //   title: "Why mountain lions need wildlife crossings",
  //   tidbit: "One-sentence hook shown in the hero and the library.",
  //   habitat: "Forest",          // Ocean | Forest | Grassland | Sky | Deep sea
  //   animal: "Mountain lion",    // shown on the hero photo badge
  //   audioUrl: "https://…/episode-1.mp3",
  //   durationSec: 754,
  //   image: "assets/episodes/ep1.webp"  // optional hero photo
  // },
  episodes: [],
};
