// js/home.js
import {
  PATHS, fetchJSON, toISODate, isoAddDays, formatNowTime,
  getEventOccurrences, getOccurrenceStatus, msToHMS, formatDT,
  getNextBoundaryFromOccurrences, safeText
} from "./utils.js";

const els = {
  clock: document.getElementById("clock"),
  refreshIn: document.getElementById("refreshIn"),

  search: document.getElementById("searchInput"),
  clearSearch: document.getElementById("clearSearch"),
  forceRefresh: document.getElementById("forceRefresh"),
  scrollToTimeline: document.getElementById("scrollToTimeline"),

  liveSkeleton: document.getElementById("liveSkeleton"),
  liveWrap: document.getElementById("liveWrap"),
  liveSlider: document.getElementById("liveSlider"),
  liveEmpty: document.getElementById("liveEmpty"),
  liveLeft: document.getElementById("liveLeft"),
  liveRight: document.getElementById("liveRight"),

  upSkeleton: document.getElementById("upSkeleton"),
  upWrap: document.getElementById("upWrap"),
  upcomingSlider: document.getElementById("upcomingSlider"),
  upEmpty: document.getElementById("upEmpty"),
  upLeft: document.getElementById("upLeft"),
  upRight: document.getElementById("upRight"),

  timeline: document.getElementById("timeline"),
  timelineSection: document.getElementById("timelineSection")
};

const CONFIG = {
  horizonDays: 14,     // upcoming slider look-ahead
  timelineDays: 7,     // timeline look-ahead
  hardRefreshMs: 60_000, // re-fetch JSON every 60s no matter what (keeps it dynamic)
  countdownTickMs: 250   // smooth countdown updates
};

let state = {
  events: [],
  occurrences: [],
  filter: "",
  boundaryTimer: null,
  hardRefreshTimer: null,
  countdownTimer: null,
  nextBoundaryAt: null
};

function setLoading(section, isLoading) {
  if (section === "live") {
    els.liveSkeleton.classList.toggle("hidden", !isLoading);
    els.liveWrap.classList.toggle("hidden", isLoading);
  } else if (section === "up") {
    els.upSkeleton.classList.toggle("hidden", !isLoading);
    els.upWrap.classList.toggle("hidden", isLoading);
  }
}

function setEmpty(section, isEmpty) {
  if (section === "live") {
    els.liveEmpty.classList.toggle("hidden", !isEmpty);
    els.liveWrap.classList.toggle("hidden", isEmpty);
  } else if (section === "up") {
    els.upEmpty.classList.toggle("hidden", !isEmpty);
    els.upWrap.classList.toggle("hidden", isEmpty);
  }
}

function scrollByCards(slider, dir = 1) {
  const cardW = 300 + 16; // match CSS var + gap
  slider.scrollBy({ left: dir * cardW * 2, behavior: "smooth" });
}

function updateArrowState(slider, leftBtn, rightBtn) {
  const maxScroll = slider.scrollWidth - slider.clientWidth - 4;
  const leftDisabled = slider.scrollLeft <= 0;
  const rightDisabled = slider.scrollLeft >= maxScroll;

  leftBtn.disabled = leftDisabled;
  rightBtn.disabled = rightDisabled;
  leftBtn.style.opacity = leftDisabled ? "0.35" : "1";
  rightBtn.style.opacity = rightDisabled ? "0.35" : "1";
}

function buildBadge(status) {
  const badge = document.createElement("div");
  badge.className = `badge ${status === "live" ? "live" : "upcoming"}`;

  const dot = document.createElement("span");
  dot.className = "dot";

  const label = document.createElement("span");
  label.textContent = status === "live" ? "LIVE" : "UPCOMING";

  badge.appendChild(dot);
  badge.appendChild(label);
  return badge;
}

function buildChip(text) {
  const chip = document.createElement("span");
  chip.className = "inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300";
  chip.textContent = text;
  return chip;
}

function buildCard(occ, status) {
  const a = document.createElement("a");
  a.className = "event-card event-shine";
  a.href = `player.html?event=${encodeURIComponent(occ.event_id)}&occ=${encodeURIComponent(occ.occ_key)}`;
  a.setAttribute("aria-label", `Open ${occ.event_name}`);

  a.appendChild(buildBadge(status));

  const img = document.createElement("img");
  img.className = "event-poster";
  img.alt = occ.event_name;
  img.loading = "lazy";
  img.draggable = false;
  img.src = occ.poster || "assets/images/poster1.svg";
  a.appendChild(img);

  const info = document.createElement("div");
  info.className = "event-info";

  const title = document.createElement("div");
  title.className = "text-base font-extrabold tracking-tight";
  title.textContent = occ.event_name;

  const meta = document.createElement("div");
  meta.className = "mt-1 flex flex-wrap items-center gap-2";

  const when = (status === "live")
    ? `Ends: ${formatDT(occ.endDT)}`
    : `Starts: ${formatDT(occ.startDT)}`;

  meta.appendChild(buildChip(when));
  meta.appendChild(buildChip(`Time: ${occ.time.start} - ${occ.time.end}`));

  const countdown = document.createElement("div");
  countdown.className = "mt-2 text-sm text-zinc-200 font-extrabold";
  countdown.innerHTML = status === "live"
    ? `Ends in <span class="font-mono" data-countdown data-mode="end" data-target="${occ.endDT.getTime()}">--:--:--</span>`
    : `Starts in <span class="font-mono" data-countdown data-mode="start" data-target="${occ.startDT.getTime()}">--:--:--</span>`;

  const ch = document.createElement("div");
  ch.className = "mt-2 text-xs text-zinc-300 opacity-90";
  ch.textContent = occ.channels?.length ? `Channels: ${occ.channels.join(" · ")}` : "Channels: —";

  info.appendChild(title);
  info.appendChild(meta);
  info.appendChild(countdown);
  info.appendChild(ch);

  a.appendChild(info);
  return a;
}

function applyFilter(list) {
  const q = state.filter.trim().toLowerCase();
  if (!q) return list;
  return list.filter(occ => safeText(occ.event_name).toLowerCase().includes(q));
}

function renderSliders() {
  const now = new Date();

  const live = applyFilter(state.occurrences.filter(o => getOccurrenceStatus(o, now) === "live"))
    .sort((a, b) => a.endDT - b.endDT);

  const upcoming = applyFilter(state.occurrences.filter(o => getOccurrenceStatus(o, now) === "upcoming"))
    .sort((a, b) => a.startDT - b.startDT);

  // LIVE
  els.liveSlider.innerHTML = "";
  if (!live.length) setEmpty("live", true);
  else {
    setEmpty("live", false);
    for (const occ of live) els.liveSlider.appendChild(buildCard(occ, "live"));
    requestAnimationFrame(() => updateArrowState(els.liveSlider, els.liveLeft, els.liveRight));
  }

  // UPCOMING
  els.upcomingSlider.innerHTML = "";
  if (!upcoming.length) setEmpty("up", true);
  else {
    setEmpty("up", false);
    // show up to 25 in slider (timeline shows more)
    for (const occ of upcoming.slice(0, 25)) els.upcomingSlider.appendChild(buildCard(occ, "upcoming"));
    requestAnimationFrame(() => updateArrowState(els.upcomingSlider, els.upLeft, els.upRight));
  }

function renderTimeline() {
  const now = new Date();
  const todayIso = toISODate(now);
  const endIso = isoAddDays(todayIso, CONFIG.timelineDays);

  // Take occurrences that start within next 7 days
  const filtered = applyFilter(state.occurrences.filter(o => o.isoDate >= todayIso && o.isoDate <= endIso))
    .sort((a, b) => a.startDT - b.startDT);

  // Group by isoDate
  const groups = new Map();
  for (const occ of filtered) {
    const key = occ.isoDate;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(occ);
  }

  els.timeline.innerHTML = "";

  if (!filtered.length) {
    const box = document.createElement("div");
    box.className = "rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-zinc-300";
    box.textContent = "No scheduled occurrences in the next 7 days (or filtered out).";
    els.timeline.appendChild(box);
    return;
  }

  for (const [isoDate, list] of groups.entries()) {
    const wrap = document.createElement("div");
    wrap.className = "rounded-3xl border border-white/10 bg-white/5 overflow-hidden";

    const header = document.createElement("div");
    header.className = "px-5 py-4 border-b border-white/10 flex items-center justify-between";
    const left = document.createElement("div");
    left.className = "font-extrabold";
    left.textContent = new Date(isoDate).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

    const right = document.createElement("div");
    right.className = "text-xs text-zinc-400";
    right.textContent = `${list.length} occurrence${list.length === 1 ? "" : "s"}`;

    header.appendChild(left);
    header.appendChild(right);

    const body = document.createElement("div");
    body.className = "divide-y divide-white/10";

    for (const occ of list) {
      const status = getOccurrenceStatus(occ, now);
      const row = document.createElement("a");
      row.href = `player.html?event=${encodeURIComponent(occ.event_id)}&occ=${encodeURIComponent(occ.occ_key)}`;
      row.className = "block px-5 py-4 hover:bg-white/5 transition";

      const top = document.createElement("div");
      top.className = "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2";

      const name = document.createElement("div");
      name.className = "font-extrabold";
      name.textContent = occ.event_name;

      const time = document.createElement("div");
      time.className = "text-sm text-zinc-300";
      time.textContent = `${occ.time.start} - ${occ.time.end}`;

      top.appendChild(name);
      top.appendChild(time);

      const bottom = document.createElement("div");
      bottom.className = "mt-2 flex flex-wrap items-center gap-2 text-xs";

      const badge = document.createElement("span");
      badge.className = status === "live"
        ? "px-2 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-200 font-extrabold"
        : (status === "upcoming"
            ? "px-2 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-100 font-extrabold"
            : "px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-extrabold");

      badge.textContent = status.toUpperCase();

      const countdown = document.createElement("span");
      countdown.className = "px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-200";

      if (status === "live") {
        countdown.innerHTML = `Ends in <span class="font-mono" data-countdown data-mode="end" data-target="${occ.endDT.getTime()}">--:--:--</span>`;
      } else if (status === "upcoming") {
        countdown.innerHTML = `Starts in <span class="font-mono" data-countdown data-mode="start" data-target="${occ.startDT.getTime()}">--:--:--</span>`;
      } else {
        countdown.textContent = "Finished";
      }

      const ch = document.createElement("span");
      ch.className = "px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300";
      ch.textContent = occ.channels?.length ? `${occ.channels.length} channels` : "No channels";

      bottom.appendChild(badge);
      bottom.appendChild(countdown);
      bottom.appendChild(ch);

      row.appendChild(top);
      row.appendChild(bottom);

      body.appendChild(row);
    }

    wrap.appendChild(header);
    wrap.appendChild(body);
    els.timeline.appendChild(wrap);
  }
}

function updateCountdownUI() {
  const now = Date.now();

  // All countdown spans
  document.querySelectorAll("[data-countdown]").forEach((el) => {
    const target = Number(el.getAttribute("data-target"));
    if (!Number.isFinite(target)) return;
    const ms = target - now;
    el.textContent = msToHMS(ms);
  });
}

function scheduleBoundaryRefresh() {
  if (state.boundaryTimer) clearTimeout(state.boundaryTimer);
  state.nextBoundaryAt = null;

  const now = new Date();
  const nextTs = getNextBoundaryFromOccurrences(state.occurrences, now);
  if (!nextTs) {
    els.refreshIn.textContent = "01:00";
    return;
  }

  state.nextBoundaryAt = nextTs + 450;
  const delay = Math.max(500, state.nextBoundaryAt - Date.now());

  state.boundaryTimer = setTimeout(() => {
    loadAndRender(); // re-evaluate so cards appear/disappear exactly
  }, delay);
}

function updateRefreshCountdown() {
  if (!state.nextBoundaryAt) {
    els.refreshIn.textContent = "01:00";
    return;
  }
  els.refreshIn.textContent = msToHMS(state.nextBoundaryAt - Date.now()).slice(3); // mm:ss style
}

async function loadAndRender() {
  setLoading("live", true);
  setLoading("up", true);

  try {
    const events = await fetchJSON(PATHS.events);
    state.events = Array.isArray(events) ? events : [];
  } catch (e) {
    console.error(e);
    state.events = [];
  }

  // Generate occurrences horizon around now (season engine)
  const now = new Date();
  const todayIso = toISODate(now);
  const fromIso = isoAddDays(todayIso, -1);
  const toIso = isoAddDays(todayIso, CONFIG.horizonDays);

  const all = [];
  for (const ev of state.events) {
    const occ = getEventOccurrences(ev, fromIso, toIso);
    all.push(...occ);
  }
  state.occurrences = all;

  setLoading("live", false);
  setLoading("up", false);

  renderSliders();
  renderTimeline();
  scheduleBoundaryRefresh();
  updateRefreshCountdown();
}

function init() {
  // Clock
  setInterval(() => { els.clock.textContent = formatNowTime(new Date()); }, 250);

  // Slider buttons
  els.liveLeft.addEventListener("click", () => scrollByCards(els.liveSlider, -1));
  els.liveRight.addEventListener("click", () => scrollByCards(els.liveSlider, 1));
  els.upLeft.addEventListener("click", () => scrollByCards(els.upcomingSlider, -1));
  els.upRight.addEventListener("click", () => scrollByCards(els.upcomingSlider, 1));

  els.liveSlider.addEventListener("scroll", () => updateArrowState(els.liveSlider, els.liveLeft, els.liveRight), { passive: true });
  els.upcomingSlider.addEventListener("scroll", () => updateArrowState(els.upcomingSlider, els.upLeft, els.upRight), { passive: true });
  window.addEventListener("resize", () => {
    updateArrowState(els.liveSlider, els.liveLeft, els.liveRight);
    updateArrowState(els.upcomingSlider, els.upLeft, els.upRight);
  });

  // Search
  els.search.addEventListener("input", () => {
    state.filter = els.search.value || "";
    renderSliders();
    renderTimeline();
  });
  els.clearSearch.addEventListener("click", () => {
    els.search.value = "";
    state.filter = "";
    renderSliders();
    renderTimeline();
  });

  // Buttons
  els.forceRefresh.addEventListener("click", loadAndRender);
  els.scrollToTimeline.addEventListener("click", () => {
    els.timelineSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Countdown ticker (smooth UI)
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  state.countdownTimer = setInterval(() => {
    updateCountdownUI();
    updateRefreshCountdown();
  }, CONFIG.countdownTickMs);

  // Hard refresh timer (re-fetch JSON regularly)
  if (state.hardRefreshTimer) clearInterval(state.hardRefreshTimer);
  state.hardRefreshTimer = setInterval(() => loadAndRender(), CONFIG.hardRefreshMs);

  loadAndRender();
}

init();