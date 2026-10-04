/* Presentation mode: on wide screens the page can be shown inside the phone frame.
   The frame holds this same page in an iframe (390 x 844), so it uses the phone layout. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (root.classList.contains('is-embedded')) return;
  const btn = document.querySelector('[data-view-toggle]');
  const view = document.querySelector('[data-device-view]');
  const frame = document.querySelector('[data-device-frame]');
  const phone = document.querySelector('.device-view__phone');
  if (!btn || !view || !frame || !phone) return;
  const KEY = 'unloop-phone-view';
  const PHONE_W = 411, PHONE_H = 865;     // 390 x 844 screen + 9px frame + 1.5px outline on each side

  function fit() {
    const s = Math.min(1, (window.innerHeight - 40) / PHONE_H, (window.innerWidth - 40) / PHONE_W);
    phone.style.setProperty('--s', s.toFixed(4));
  }
  function set(on) {
    if (on && !frame.getAttribute('src')) frame.setAttribute('src', location.pathname + '?embed=1');
    view.hidden = !on;
    btn.setAttribute('aria-pressed', String(on));
    root.classList.toggle('device-on', on);
    if (on) fit();
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
  }
  btn.addEventListener('click', () => set(view.hidden));
  window.addEventListener('resize', () => { if (!view.hidden) fit(); });
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if (typing) return;
    if (e.key === 'p' || e.key === 'P') set(view.hidden);
    else if (e.key === 'Escape' && !view.hidden) set(false);
  });
  let saved = false; try { saved = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if ((saved || /[?&]phone=1/.test(location.search)) && window.innerWidth >= 900) set(true);
})();
