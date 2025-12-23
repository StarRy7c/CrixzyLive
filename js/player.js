// js/player.js
import {
  PATHS, fetchJSON, getQueryParam, safeText,
  toISODate, isoAddDays, getEventOccurrences, getOccurrenceStatus,
  msToHMS, formatDT
} from "./utils.js";

const els = {
  title: document.getElementById("eventTitle"),
  statusText: document.getElementById("statusText"),
  statusDot: document.getElementById("statusDot"),
  eventWindow: document.getElementById("eventWindow"),
  eventDate: document.getElementById("eventDate"),
  occLabel: document.getElementById("occLabel"),

  upcomingBox: document.getElementById("upcomingBox"),
  endedBox: document.getElementById("endedBox"),
  playerArea: document.getElementById("playerArea"),

  startCountdown: document.getElementById("startCountdown"),
  startTimeLabel: document.getElementById("startTimeLabel"),
  endCountdown: document.getElementById("endCountdown"),

  channelsRow: document.getElementById("channelsRow"),
  channelNow: document.getElementById("channelNow"),

  frame: document.getElementById("videoFrame"),
  theaterBtn: document.getElementById("theaterBtn")
};

const eventId = getQueryParam("event");
const occKeyParam = getQueryParam("occ");

let eventObj = null;
let occObj = null;

let streams = {};
let streamsB64 = {};
let activeChannel = null;

let tickTimer = null;
let boundaryTimer = null;

function disableContextMenu() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
}

function setTheaterMode(on) {
  document.body.classList.toggle("theater", on);
  els.theaterBtn.textContent = on ? "Exit Theater" : "Theater";
  try { localStorage.setItem("theaterMode", on ? "1" : "0"); } catch {}
}

function getTheaterMode() {
  try { return localStorage.getItem("theaterMode") === "1"; } catch { return false; }
}

function rememberChannel(eid, channel) {
  try { localStorage.setItem(`lastChannel:${eid}`, channel); } catch {}
}
function loadRememberedChannel(eid) {
  try { return localStorage.getItem(`lastChannel:${eid}`); } catch { return null; }
}

function setStatus(status) {
  els.statusText.textContent = status.toUpperCase();

  if (status === "live") {
    els.statusDot.className = "inline-block w-2 h-2 bg-red-500 rounded-full animate-liveDot";
  } else if (status === "upcoming") {
    els.statusDot.className = "inline-block w-2 h-2 bg-blue-500 rounded-full";
  } else if (status === "ended") {
    els.statusDot.className = "inline-block w-2 h-2 bg-emerald-400 rounded-full";
  } else {
    els.statusDot.className = "inline-block w-2 h-2 bg-zinc-400 rounded-full";
  }
}

function showOnly(section) {
  els.upcomingBox.classList.toggle("hidden", section !== "upcoming");
  els.endedBox.classList.toggle("hidden", section !== "ended");
  els.playerArea.classList.toggle("hidden", section !== "player");
}

function decodeUrl(channel) {
  const encoded = streamsB64[channel];
  if (!encoded) return null;
  try { return atob(encoded); } catch { return null; }
}

function setActiveButton(channel) {
  els.channelsRow.querySelectorAll("button").forEach(b => {
    b.classList.toggle("active", b.textContent === channel);
  });
}

function setStream(channel) {
  activeChannel = channel;
  rememberChannel(eventId, channel);

  els.channelNow.textContent = channel;
  setActiveButton(channel);

  const url = decodeUrl(channel);
  els.frame.src = url || "about:blank";
}

function renderChannels() {
  els.channelsRow.innerHTML = "";
  const channels = Array.isArray(eventObj?.channels) ? eventObj.channels : [];

  if (!channels.length) {
    const msg = document.createElement("div");
    msg.className = "text-sm text-zinc-400";
    msg.textContent = "No channels configured for this event.";
    els.channelsRow.appendChild(msg);
    return;
  }

  for (const ch of channels) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ch-btn";
    b.textContent = ch;
    b.addEventListener("click", () => setStream(ch));
    els.channelsRow.appendChild(b);
  }

  // Choose channel default
  let chosen = loadRememberedChannel(eventId);
  if (!chosen || !channels.includes(chosen)) chosen = channels[0];
  setStream(chosen);
}

function clearTimers() {
  if (tickTimer) clearInterval(tickTimer);
  if (boundaryTimer) clearTimeout(boundaryTimer);
  tickTimer = null;
  boundaryTimer = null;
}

function setupBoundaryEnd() {
  // When live ends, auto switch UI to ended.
  if (!occObj?.endDT) return;

  const ms = Math.max(600, occObj.endDT.getTime() - Date.now() + 600);
  boundaryTimer = setTimeout(() => {
    const st = getOccurrenceStatus(occObj, new Date());
    if (st === "ended") {
      setStatus("ended");
      showOnly("ended");
      els.frame.src = "about:blank";
    }
  }, ms);
}

function startTickLoop() {
  clearTimers();

  tickTimer = setInterval(() => {
    if (!occObj) return;

    const now = new Date();
    const st = getOccurrenceStatus(occObj, now);

    if (st === "upcoming") {
      els.startCountdown.textContent = msToHMS(occObj.startDT.getTime() - now.getTime());
      els.endCountdown.textContent = "--:--:--";

      // Auto-start at live boundary
      if (now >= occObj.startDT) {
        goLive();
      }
    } else if (st === "live") {
      els.endCountdown.textContent = msToHMS(occObj.endDT.getTime() - now.getTime());
      els.startCountdown.textContent = "--:--:--";
    } else if (st === "ended") {
      setStatus("ended");
      showOnly("ended");
      els.frame.src = "about:blank";
    }
  }, 250);
}

function goLive() {
  setStatus("live");
  showOnly("player");

  // only now inject the iframe URLs
  renderChannels();
  setupBoundaryEnd();
}

function goUpcoming() {
  setStatus("upcoming");
  showOnly("upcoming");
  els.startTimeLabel.textContent = formatDT(occObj.startDT);
  els.startCountdown.textContent = msToHMS(occObj.startDT.getTime() - Date.now());
  els.frame.src = "about:blank"; // lazy: no player load until live
}

function goEnded() {
  setStatus("ended");
  showOnly("ended");
  els.frame.src = "about:blank";
}

function pickOccurrence(eventObj, occKeyParam) {
  const now = new Date();

  // If occ parameter exists, generate occurrences around that date (so links work even far in the future)
  if (occKeyParam) {
    const [datePart] = String(occKeyParam).split("T");
    const baseIso = safeText(datePart);

    const fromIso = isoAddDays(baseIso, -2);
    const toIso = isoAddDays(baseIso, 2);
    const occs = getEventOccurrences(eventObj, fromIso, toIso);
    const found = occs.find(o => o.occ_key === occKeyParam);
    if (found) return found;

    // fallback: pick nearest upcoming in that window
    const upcoming = occs.filter(o => o.startDT > now).sort((a,b) => a.startDT - b.startDT)[0];
    if (upcoming) return upcoming;

    // fallback: pick latest live
    const live = occs.filter(o => getOccurrenceStatus(o, now) === "live")[0];
    if (live) return live;

    return null;
  }

  // No occ param: pick live now else next upcoming (next 14 days)
  const todayIso = toISODate(now);
  const fromIso = isoAddDays(todayIso, -2);
  const toIso = isoAddDays(todayIso, 14);

  const occs = getEventOccurrences(eventObj, fromIso, toIso);

  const live = occs.find(o => getOccurrenceStatus(o, now) === "live");
  if (live) return live;

  const upcoming = occs.filter(o => o.startDT > now).sort((a,b) => a.startDT - b.startDT)[0];
  if (upcoming) return upcoming;

  return null;
}

async function init() {
  disableContextMenu();
  setTheaterMode(getTheaterMode());
  els.theaterBtn.addEventListener("click", () => setTheaterMode(!document.body.classList.contains("theater")));

  if (!eventId) {
    els.title.textContent = "Missing event id";
    setStatus("invalid");
    showOnly("ended");
    return;
  }

  // Load data
  let events = [];
  try {
    [events, streams] = await Promise.all([fetchJSON(PATHS.events), fetchJSON(PATHS.streams)]);
  } catch (e) {
    console.error(e);
    els.title.textContent = "Failed to load data";
    setStatus("invalid");
    showOnly("ended");
    return;
  }

  events = Array.isArray(events) ? events : [];
  eventObj = events.find(e => safeText(e.event_id) === safeText(eventId));

  if (!eventObj) {
    els.title.textContent = "Event not found";
    setStatus("invalid");
    showOnly("ended");
    return;
  }

  // Prepare basic obfuscation map (NOT security; just hides raw URLs from casual view)
  streamsB64 = {};
  for (const [ch, info] of Object.entries(streams || {})) {
    const url = safeText(info?.iframe);
    if (url) streamsB64[ch] = btoa(url);
  }

  // Pick occurrence
  occObj = pickOccurrence(eventObj, occKeyParam);
  if (!occObj) {
    els.title.textContent = eventObj.event_name || "Event";
    els.eventWindow.textContent = "No occurrence found in window";
    els.eventDate.textContent = "—";
    els.occLabel.textContent = "";
    setStatus("ended");
    showOnly("ended");
    return;
  }

  // Header info
  els.title.textContent = safeText(eventObj.event_name) || "Event";
  els.eventWindow.textContent = `Time: ${occObj.time.start} - ${occObj.time.end}`;
  els.eventDate.textContent = `Start: ${formatDT(occObj.startDT)}`;
  els.occLabel.textContent = `occ=${occObj.occ_key}`;

  // Decide initial UI
  const st = getOccurrenceStatus(occObj, new Date());
  if (st === "upcoming") {
    goUpcoming();
  } else if (st === "live") {
    goLive();
  } else {
    goEnded();
  }

  startTickLoop();
}

init();