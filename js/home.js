const container = document.getElementById('liveEvents');
const EVENTS_URL = 'data/events.json';

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function isLive(event) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const startTime = parseTime(event.time.start);
  const endTime = parseTime(event.time.end);
  const currentTime = now.getHours() * 60 + now.getMinutes();

  let validDate = false;

  if (event.date_type === 'range') {
    validDate = today >= event.start_date && today <= event.end_date;
  }

  return validDate && currentTime >= startTime && currentTime <= endTime;
}

async function loadEvents() {
  container.innerHTML = '';

  const res = await fetch(EVENTS_URL);
  const events = await res.json();

  events.forEach(event => {
    if (!isLive(event)) return;

    const card = document.createElement('div');
    card.className = 'event-card';
    card.onclick = () => {
      window.location.href = `player.html?event=${event.event_id}`;
    };

    card.innerHTML = `
      <img src="${event.poster}" />
      <div class="event-info">
        <div class="live-badge">LIVE</div>
        <h3>${event.event_name}</h3>
        <p>${event.time.start} - ${event.time.end}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

loadEvents();
setInterval(loadEvents, 60000);
