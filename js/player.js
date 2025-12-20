const params = new URLSearchParams(window.location.search);
const EVENT_ID = params.get('event');

const EVENTS_URL = 'data/events.json';
const STREAMS_URL = 'data/streams.json';

const iframe = document.getElementById('player');
const buttons = document.getElementById('channels');

async function initPlayer() {
  const [eventsRes, streamsRes] = await Promise.all([
    fetch(EVENTS_URL),
    fetch(STREAMS_URL)
  ]);

  const events = await eventsRes.json();
  const streams = await streamsRes.json();

  const event = events.find(e => e.event_id === EVENT_ID);
  if (!event) return;

  event.channels.forEach((ch, index) => {
    const btn = document.createElement('button');
    btn.textContent = ch;

    btn.onclick = () => {
      iframe.src = streams[ch].iframe;
      document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };

    if (index === 0) btn.click();

    buttons.appendChild(btn);
  });
}

initPlayer();
