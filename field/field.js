/* field.js — shared behaviour for the Zentra Realty Field prototype.
   Prototype only: the "upload queue" and sign-in are simulated (no backend calls). */
(function () {
  const LS_QUEUE = 'zh_field_queue';

  // ---- service worker + install prompt -------------------------------
  let deferredPrompt = null;

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    // Secure context check: https, or a loopback host (localhost / 127.0.0.1 / [::1]).
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    if (location.protocol !== 'https:' && !loopback) return;
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((r) => console.log('[field] service worker registered:', r.scope))
      .catch((e) => console.warn('[field] service worker registration failed:', e));
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const b = document.getElementById('install-btn');
    if (b) { b.style.display = 'inline-flex'; }
  });

  window.installFieldApp = async function () {
    if (!deferredPrompt) {
      alert('To install: open the browser menu and choose "Add to Home screen".\n\n'
        + 'iPhone (Safari): Share -> Add to Home Screen.\nAndroid (Chrome): three dots -> Add to Home screen.');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    const b = document.getElementById('install-btn');
    if (b) b.style.display = 'none';
  };

  // ---- online / offline indicator ------------------------------------
  function paintNet() {
    document.body.classList.toggle('offline', !navigator.onLine);
    const t = document.querySelector('.netbar span');
    if (t) {
      t.textContent = navigator.onLine
        ? 'Back online — queued items are being sent (prototype: simulated).'
        : 'Offline — work is saved on this phone and will send when you are back online.';
    }
  }

  // ---- local "upload queue" (prototype) ------------------------------
  function queue() {
    try { return JSON.parse(localStorage.getItem(LS_QUEUE) || '[]'); } catch (e) { return []; }
  }
  function saveQueue(q) { localStorage.setItem(LS_QUEUE, JSON.stringify(q)); paintQueue(); }

  function paintQueue() {
    const n = queue().length;
    document.querySelectorAll('[data-queue-count]').forEach((el) => {
      el.textContent = n === 0 ? 'All photos sent' : n + ' photo(s) waiting to send';
      el.className = 'pill ' + (n === 0 ? 'green' : 'amber');
    });
  }

  window.fieldAddToQueue = function (name, gps) {
    const q = queue();
    q.push({ name: name, gps: gps, at: new Date().toISOString() });
    saveQueue(q);
  };

  window.fieldFlushQueue = function () {
    const q = queue();
    if (!q.length) return;
    saveQueue([]);
    alert('Prototype: ' + q.length + ' photo(s) would now upload to the listing record.');
  };

  // ---- GPS capture (real browser geolocation) ------------------------
  window.fieldGPS = function (targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    if (!navigator.geolocation) { el.value = 'Not supported on this browser'; return; }
    el.value = 'Locating…';
    navigator.geolocation.getCurrentPosition(
      (p) => {
        el.value = p.coords.latitude.toFixed(6) + ', ' + p.coords.longitude.toFixed(6)
          + '  (±' + Math.round(p.coords.accuracy) + ' m)';
      },
      (err) => { el.value = 'Permission denied or unavailable (' + err.code + ')'; },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ---- camera / gallery picker (real device picker) ------------------
  window.fieldPickPhoto = function (inputId, gridId) {
    const input = document.getElementById(inputId);
    const grid = document.getElementById(gridId);
    if (!input || !grid) return;
    input.click();
    input.onchange = () => {
      const f = input.files && input.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      const cell = document.createElement('div');
      cell.className = 'thumb';
      cell.innerHTML = '<img alt="captured photo preview" src="' + url + '">';
      grid.prepend(cell);
      const gpsEl = document.getElementById('gps-out');
      const gps = gpsEl ? gpsEl.value : '';
      window.fieldAddToQueue(f.name, gps);
      const msg = document.getElementById('photo-msg');
      if (msg) msg.textContent = 'Saved on this phone: ' + f.name + (gps ? ' · ' + gps : ' · no GPS yet');
    };
  };

  document.addEventListener('DOMContentLoaded', () => {
    registerSW();
    paintNet();
    paintQueue();
    window.addEventListener('online', paintNet);
    window.addEventListener('offline', paintNet);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'flush-queue') window.fieldFlushQueue();
      });
    }
  });
})();
