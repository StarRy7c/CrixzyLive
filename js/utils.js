// js/utils.js
// Robust schedule engine:
// - Supports original structure (range or specific + time)
// - Adds: extra_occurrences + overrides (multiple times for same date)
// - Generates "occurrences" near now so you upload once for the whole season.
// - Provides: live detection, upcoming detection, countdown formatting, and boundaries.

export const PATHS = {
  events: "events.json",
  streams: "streams.json"
};

export async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.json();
}

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

export function isoToLocalDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

export function isoAddDays(iso, delta) {
  const dt = isoToLocalDate(iso);
  dt.setDate(dt.getDate() + delta);
  return toISODate(dt);
}

export function formatNowTime(d = new Date()) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export function safeText(s) {
  return String(s ?? "").trim();
}

export function parseHM(hm) {
  const [hS, mS] = String(hm || "").split(":");
  const h = Number(hS);
  const m = Number(mS);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m, total: h * 60 + m };
}

export function normalizeTimeWindow(t) {
  // Accepts:
  // - {start:"HH:MM", end:"HH:MM"}
  // - "HH:MM-HH:MM"
  if (!t) return null;
  if (typeof t === "string") {
    const parts = t.split("-");
    if (parts.length !== 2) return null;
    const start = safeText(parts[0]);
    const end = safeText(parts[1]);
    if (!parseHM(start) || !parseHM(end)) return null;
    return { start, end };
  }
  const start = safeText(t.start);
  const end = safeText(t.end);
  if (!parseHM(start) || !parseHM(end)) return null;
  return { start, end };
}

export function isDateValidForEvent(event, isoDate) {
  const sd = Array.isArray(event?.specific_dates) ? event.specific_dates : null;
  if (sd && sd.length) return sd.includes(isoDate);

  const type = safeText(event?.date_type);
  if (type === "specific") {
    // specific with no specific_dates -> invalid
    return false;
  }

  const start = safeText(event?.start_date);
  const end = safeText(event?.end_date);
  if (!start || !end) return false;
  return isoDate >= start && isoDate <= end;
}

export function buildOccurrence(event, isoDate, timeWindow, source = "base") {
  const tw = normalizeTimeWindow(timeWindow);
  if (!tw) return null;

  const s = parseHM(tw.start);
  const e = parseHM(tw.end);
  if (!s || !e) return null;

  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;

  const startDT = new Date(y, m - 1, d, s.h, s.m, 0, 0);

  // If end <= start => crosses midnight
  const crossesMidnight = e.total <= s.total;
  const endDT = new Date(y, m - 1, d, e.h, e.m, 0, 0);
  if (crossesMidnight) endDT.setDate(endDT.getDate() + 1);

  const occ_key = `${isoDate}T${tw.start}`; // unique key for this occurrence
  const occurrence_id = `${safeText(event?.event_id)}__${occ_key}`;

  return {
    occurrence_id,
    occ_key,
    source,
    event_id: safeText(event?.event_id),
    event_name: safeText(event?.event_name),
    poster: safeText(event?.poster),
    channels: Array.isArray(event?.channels) ? event.channels.slice() : [],
    isoDate,
    time: tw,
    startDT,
    endDT,
    crossesMidnight
  };
}

export function getEventOccurrences(event, fromIso, toIso) {
  // Generate occurrences for a single event inside [fromIso..toIso].
  // Logic:
  // 1) Determine base schedule dates:
  //    - If specific_dates exist => only those dates
  //    - Else range => all dates from start_date to end_date
  // 2) Apply overrides for that date (replaces base time)
  // 3) Add extra_occurrences (additional times)
  // 4) De-duplicate by occ_key.

  const out = [];
  const seen = new Set();

  const addOcc = (occ) => {
    if (!occ) return;
    if (seen.has(occ.occ_key)) return;
    seen.add(occ.occ_key);
    out.push(occ);
  };

  const overrides = (event && typeof event.overrides === "object" && event.overrides) ? event.overrides : null;
  const baseTime = normalizeTimeWindow(event?.time);

  // Date list
  const sd = Array.isArray(event?.specific_dates) ? event.specific_dates : null;

  if (sd && sd.length) {
    // Only specific dates
    for (const iso of sd) {
      if (iso < fromIso || iso > toIso) continue;

      const ov = overrides?.[iso];
      if (Array.isArray(ov) && ov.length) {
        for (const t of ov) addOcc(buildOccurrence(event, iso, t, "override"));
      } else if (baseTime) {
        addOcc(buildOccurrence(event, iso, baseTime, "base"));
      }
    }
  } else {
    // Range dates
    const start = safeText(event?.start_date);
    const end = safeText(event?.end_date);
    if (start && end && baseTime) {
      const s = (start > fromIso) ? start : fromIso;
      const e = (end < toIso) ? end : toIso;

      // iterate day by day
      let cur = s;
      while (cur <= e) {
        // this date is valid
        if (isDateValidForEvent(event, cur)) {
          const ov = overrides?.[cur];
          if (Array.isArray(ov) && ov.length) {
            for (const t of ov) addOcc(buildOccurrence(event, cur, t, "override"));
          } else {
            addOcc(buildOccurrence(event, cur, baseTime, "base"));
          }
        }
        cur = isoAddDays(cur, 1);
      }
    }
  }

  // Extra occurrences (additions)
  const extra = Array.isArray(event?.extra_occurrences) ? event.extra_occurrences : [];
  for (const item of extra) {
    const date = safeText(item?.date);
    if (!date) continue;
    if (date < fromIso || date > toIso) continue;

    const t = normalizeTimeWindow(item?.time);
    if (!t) continue;

    addOcc(buildOccurrence(event, date, t, "extra"));
  }

  // sort by startDT
  out.sort((a, b) => a.startDT - b.startDT);
  return out;
}

export function getOccurrenceStatus(occ, now = new Date()) {
  if (!occ) return "invalid";
  if (now < occ.startDT) return "upcoming";
  if (now >= occ.startDT && now <= occ.endDT) return "live";
  return "ended";
}

export function msToHMS(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
}

export function formatDT(dt) {
  // 24h display
  const d = dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const t = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${d} · ${t}`;
}

export function getNextBoundaryFromOccurrences(occurrences, now = new Date()) {
  let next = Infinity;
  for (const occ of occurrences) {
    if (!occ?.startDT || !occ?.endDT) continue;

    if (now < occ.startDT) next = Math.min(next, occ.startDT.getTime());
    if (now >= occ.startDT && now < occ.endDT) next = Math.min(next, occ.endDT.getTime());
  }
  return Number.isFinite(next) ? next : null;
}

export function getQueryParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}