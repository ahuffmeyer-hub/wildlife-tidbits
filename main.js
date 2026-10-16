// Wildlife Tidbits — home page behaviour.
// Content comes from site.config.js; you shouldn't need to edit this file
// to add episodes or links.
(function () {
  const SITE = window.SITE || { links: {}, episodes: [], newsletterAction: "" };
  const EPISODES = SITE.episodes || [];
  const HABITATS = ["All", "Ocean", "Forest", "Grassland", "Sky", "Deep sea"];
  const PLATFORM_NAMES = { spotify: "Spotify", apple: "Apple Podcasts", youtube: "YouTube" };
  const $ = (id) => document.getElementById(id);
  const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ── Listen-on platform pills ─────────────────────────────
  document.querySelectorAll("[data-platforms]").forEach((row) => {
    row.dataset.platforms.split(",").forEach((key) => {
      const url = (SITE.links || {})[key];
      const name = PLATFORM_NAMES[key];
      const el = document.createElement(url ? "a" : "span");
      el.className = "platform" + (url ? "" : " is-soon");
      if (url) {
        el.href = url; el.target = "_blank"; el.rel = "noopener"; el.textContent = name;
      } else {
        el.innerHTML = `${name}<span class="soon-tag">Soon</span>`;
        el.setAttribute("aria-label", `${name} — coming soon`);
      }
      row.appendChild(el);
    });
  });

  // ── Newsletter ───────────────────────────────────────────
  const form = $("signup-form");
  if (form) {
    if (SITE.newsletterAction) form.action = SITE.newsletterAction;
    form.addEventListener("submit", (e) => {
      if (!SITE.newsletterAction) {
        e.preventDefault();
        $("signup-note").textContent = "Signups open soon — check back when the first episode drops.";
        return;
      }
      // Provider form opens in a new tab; confirm here too.
      setTimeout(() => { $("signup-btn").textContent = "You’re in ✓"; }, 50);
    });
  }

  // ── Library filters ─────────────────────────────────────
  let filter = "All";
  const filtersEl = $("filters");
  HABITATS.forEach((h) => {
    const b = document.createElement("button");
    b.className = "filter"; b.type = "button"; b.textContent = h;
    b.setAttribute("aria-pressed", h === filter);
    b.addEventListener("click", () => {
      filter = h;
      filtersEl.querySelectorAll(".filter").forEach((x) => x.setAttribute("aria-pressed", x.textContent === h));
      renderList();
    });
    filtersEl.appendChild(b);
  });

  // ── Player state ────────────────────────────────────────
  const audio = $("audio");
  let current = 0;

  function renderList() {
    const list = $("episodes");
    if (!EPISODES.length) {
      $("library-count").textContent = "First episodes coming soon · new every week";
      list.innerHTML = [1, 2, 3].map((n) => `
        <div class="ep ep--placeholder" aria-hidden="${n > 1}">
          <span class="ep-play">▶</span>
          <div class="ep-main">
            <span class="ep-meta">Ep. ${n} · Coming soon</span>
            <span class="ep-title">Episode coming soon</span>
            <span class="skeleton" style="width:${[68, 54, 61][n - 1]}%"></span>
          </div>
        </div>`).join("");
      return;
    }
    const items = EPISODES.map((e, i) => ({ e, i })).filter(({ e }) => filter === "All" || e.habitat === filter);
    $("library-count").textContent = `${items.length} episode${items.length === 1 ? "" : "s"} · new every week`;
    const playing = !audio.paused;
    list.innerHTML = items.map(({ e, i }) => `
      <div class="ep${i === current ? " is-current" : ""}">
        <button class="ep-play" data-i="${i}" aria-label="${i === current && playing ? "Pause" : "Play"} episode ${esc(e.no)}">${i === current && playing ? "❚❚" : "▶"}</button>
        <div class="ep-main">
          <span class="ep-meta">Ep. ${esc(e.no)} · ${esc(e.date)}</span>
          <span class="ep-title">${esc(e.title)}</span>
          <span class="ep-tidbit">${esc(e.tidbit)}</span>
        </div>
        <div class="ep-side">
          ${e.habitat ? `<span class="chip">${esc(e.habitat)}</span>` : ""}
          <span class="ep-dur">${fmt(e.durationSec)}</span>
        </div>
      </div>`).join("");
    list.querySelectorAll(".ep-play").forEach((b) => b.addEventListener("click", () => playEp(+b.dataset.i)));
  }

  function renderPlayer() {
    const ep = EPISODES[current];
    if (!ep) return;
    const dur = audio.duration || ep.durationSec || 0;
    $("player-label").textContent = `${current === 0 ? "Latest episode" : "Now playing"} · Ep. ${ep.no} · ${ep.date}`;
    $("player-title").textContent = ep.title;
    $("player-time").textContent = `${fmt(audio.currentTime)} / ${fmt(dur)}`;
    $("progress-fill").style.width = dur ? `${(audio.currentTime / dur) * 100}%` : "0";
    const btn = $("play-btn");
    btn.textContent = audio.paused ? "▶" : "❚❚";
    btn.setAttribute("aria-label", audio.paused ? "Play episode" : "Pause episode");
  }

  function load(i) {
    current = i;
    audio.src = EPISODES[i].audioUrl;
  }
  function playEp(i) {
    if (i === current && audio.src) return audio.paused ? audio.play() : audio.pause();
    load(i); audio.play();
  }

  if (EPISODES.length) {
    const latest = EPISODES[0];
    $("hero-pill").textContent = `This week's tidbit${latest.habitat ? " · " + latest.habitat : ""}`;
    $("hero-title").textContent = latest.title;
    $("hero-body").textContent = latest.tidbit;
    $("badge-k").textContent = `Episode ${latest.no}`;
    $("badge-v").textContent = latest.animal || "";
    if (latest.image) $("hero-photo").innerHTML = `<img src="${esc(latest.image)}" alt="${esc(latest.animal || latest.title)}">`;
    $("play-btn").disabled = false;
    $("play-btn").addEventListener("click", () => playEp(current));
    load(0);
    ["play", "pause", "timeupdate", "loadedmetadata"].forEach((ev) => audio.addEventListener(ev, () => { renderPlayer(); if (ev === "play" || ev === "pause") renderList(); }));
    audio.addEventListener("ended", () => { audio.currentTime = 0; renderPlayer(); renderList(); });
    renderPlayer();
  }
  renderList();
})();
