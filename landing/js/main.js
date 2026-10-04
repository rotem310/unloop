/* Unloop landing: interactions. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mq.matches;
  mq.addEventListener?.('change', e => { reduce = e.matches; });
  const EASE_CALM = 'cubic-bezier(.22,1,.36,1)';

  const state = { balance: 5000 };
  let vh = window.innerHeight;
  let vw = window.innerWidth;

  /* ---------------------------------------------------------------- layout cache */
  const scenes = new Map(); // el -> {top, height}
  function measure() {
    vh = window.innerHeight; vw = window.innerWidth;
    $$('[data-scene], [data-draw-slot], .field, .worth, .start, .coinfeature').forEach(el => {
      const r = el.getBoundingClientRect();
      scenes.set(el, { top: r.top + window.scrollY, height: r.height });
    });
    hero.resize();
    if (typeof floatCoin !== 'undefined' && floatCoin) floatCoin.measure();
  }
  // progress through a tall sticky section: 0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom
  const stickyP = el => { const m = scenes.get(el); if (!m) return 0; return clamp((window.scrollY - m.top) / Math.max(1, m.height - vh)); };
  // progress of an element entering: 0 when its top is at the viewport bottom, 1 after `span` viewports
  const enterP = (el, span = 0.9) => { const m = scenes.get(el); if (!m) return 0; return clamp((window.scrollY + vh - m.top) / (vh * span)); };

  /* ---------------------------------------------------------------- reveal + nav */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  const nav = $('[data-nav]');
  const heroCta = $('.hero__actions .pill');
  const navLinks = $$('.nav__links a').map(a => ({ a, t: $(a.getAttribute('href')) })).filter(x => x.t);

  /* ---------------------------------------------------------------- inline drawable svgs */
  // Stroke drawings are inlined in the HTML (works from file:// too); each path has pathLength="1".
  function loadDrawSlots() {
    $$('[data-draw-slot]').forEach(slot => {
      const svg = slot.querySelector('svg');
      slot._paths = svg ? $$('path', svg) : null;
    });
    return Promise.resolve();
  }
  function drawSlot(slot, p) {
    const paths = slot._paths; if (!paths) return;
    const n = paths.length, spread = 0.55; // later paths start later
    for (let i = 0; i < n; i++) {
      const start = (i / n) * spread;
      const local = reduce ? 1 : clamp((p - start) / (1 - spread));
      const v = (1 - easeOut(local)).toFixed(4);
      if (paths[i]._v !== v) { paths[i].style.strokeDashoffset = v; paths[i]._v = v; }
    }
  }

  /* ---------------------------------------------------------------- 1. hero loop */
  const hero = (() => {
    const section = $('[data-scene="hero"]');
    const svg = $('[data-loop]');
    const path = svg && $('path', svg);
    const person = $('.hero__person');
    const hint = $('.hero__hint');
    const coin = $('.hero__coin');
    const heroStage = $('.hero__stage');
    let W = 0, H = 0, base = 0, seatX = 0, seatW = 0;
    let coinDx = 0, coinDy = 0;
    let personL = 0, personR = 0, personH = 0, personT = 0;
    let shownP = 0, phase = 0;

    function resize() {
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      W = r.width; H = r.height;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      const pr = person.getBoundingClientRect();
      base = pr.bottom - r.top - 2;
      seatX = pr.left - r.left + pr.width * 0.42;
      seatW = pr.width * 0.75;
      personL = pr.left - r.left; personR = pr.right - r.left; personH = pr.height; personT = pr.top - r.top;
      if (coin) {
        /* where the coin should rest: on the horizon, clear of the person */
        coin.style.transform = 'none';
        const cr = coin.getBoundingClientRect();
        const lineY = r.top + base;
        coinDy = Math.max(0, lineY - cr.bottom - 2);
        const cw = cr.width, cx = cr.left + cw / 2;
        const personRight = pr.right + 18 + cw / 2;
        const rightLimit = vw - cw / 2 - 24;
        const want = Math.min(rightLimit, Math.max(cx, personRight));
        coinDx = want - cx;
      }
      if (typeof hero !== 'undefined') hero._done = false;
    }
    const HEAD_X = 0.19, HEAD_Y = 0.17, PHONE_X = 0.68, PHONE_Y = 0.33;   // where the line meets the drawing (fractions of the figure)
    function build(p, dt) {
      const calm = easeOut(p);
      phase += dt * 0.0016 * (1 - calm);
      const R = Math.min(40, H * 0.14) * (1 - calm);
      const period = vw < 720 ? 46 : 62;
      const k = (Math.PI * 2) / period;
      const step = 2.5;
      let d = '', pen = false;
      for (let x0 = -60; x0 <= W + 60; x0 += step) {
        // the line is quiet under the person: they sit in the one still spot
        const dist = Math.abs(x0 - seatX);
        const env = clamp((dist - seatW * 0.5) / 140);
        const wob = 0.82 + 0.18 * Math.sin(x0 * 0.011 + phase * 0.35);
        const r = R * env * wob;
        const th = k * x0 + phase;
        const x = x0 - r * 1.15 * Math.sin(th);
        // the line meets the character at two places: it starts at the left side of his scalp, and the spring on the right ends on his phone
        const pw = personR - personL;
        const scalpX = personL + pw * HEAD_X, phoneX = personL + pw * PHONE_X;
        const headY = personT + personH * HEAD_Y, phoneY = personT + personH * PHONE_Y;
        if (x0 > scalpX && x0 < phoneX) { pen = false; continue; }
        const lvl = x0 <= scalpX ? headY : phoneY;
        const y = lvl - r * (1 - Math.cos(th));
        d += (pen ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); pen = true;
      }
      path.setAttribute('d', d);
    }
    function frame(dt) {
      if (!svg) return;
      const m = scenes.get(section);
      if (m && window.scrollY > m.top + m.height) return; // off screen: idle
      const target = reduce ? 1 : clamp(stickyP(section) / 0.7);
      shownP = reduce ? 1 : lerp(shownP, target, 0.08);
      if (shownP > 0.999 && target === 1 && path.getAttribute('d') && hero._done) return;
      hero._done = shownP > 0.999;
      build(shownP, reduce ? 0 : dt);
      if (heroStage) heroStage.style.setProperty('--calm', shownP.toFixed(3));
      if (hint) hint.style.opacity = String(1 - clamp(target * 4));
    }
    return { resize, frame, _done: false };
  })();

  /* ---------------------------------------------------------------- floating coin
     A fixed coin. It starts under the hero button, settles on the horizon as the
     line calms, then detaches and docks bottom-right so it follows the visitor.
     It steps aside where the big coin and the breath moment own the stage. */
  const floatCoin = (() => {
    const orig = $('.hero__coin'), section = $('[data-scene="hero"]'), stage = $('.hero__stage');
    const person = $('.hero__person'), line = $('[data-loop]');
    if (!orig || !section || !stage || !person || !line) return null;
    const a = document.createElement('a');
    a.className = 'floatcoin'; a.href = '#coins'; a.setAttribute('aria-label', 'Your Time Coins');
    const img = document.createElement('img');
    img.src = orig.currentSrc || orig.src; img.alt = ''; img.decoding = 'async';
    a.appendChild(img); document.body.appendChild(a);
    document.documentElement.classList.add('has-floatcoin');
    const hideIn = [$('.worth'), $('.quiet'), $('.coinfeature')].filter(Boolean);
    let g = null, p = 0, ready = false;

    function measure() {
      const prevT = orig.style.transform; orig.style.transform = 'none';
      const sr = stage.getBoundingClientRect(), cr = orig.getBoundingClientRect();
      orig.style.transform = prevT;
      const pr = person.getBoundingClientRect(), lr = line.getBoundingClientRect();
      const cw = cr.width, ch = cr.height;
      const startX = cr.left - sr.left, startY = cr.top - sr.top;
      const lineY = lr.top - sr.top + (pr.bottom - lr.top - 2);          // baseline under the person
      const cx = startX + cw / 2, personRight = pr.left - sr.left + pr.width;
      const wantCx = Math.min(vw - cw / 2 - 24, Math.max(cx, personRight + 18 + cw / 2));
      const dock = vw < 720 ? 52 : 64, pad = vw < 720 ? 16 : 28;
      g = { cw, ch, startX, startY, restX: wantCx - cw / 2, restY: lineY - ch - 2, dock, pad };
      a.style.width = cw + 'px'; a.style.height = ch + 'px';
      ready = cw > 0;
    }
    function frame() {
      if (!g || !ready) return;
      if (!orig.classList.contains('is-in')) { a.style.opacity = '0'; return; }
      const sec = section.getBoundingClientRect();
      const endScroll = sec.height - vh;                                  // scroll distance of the sticky run
      const into = -sec.top - endScroll;                                  // px scrolled past the run
      const q = easeInOut(clamp(into / (vh * 0.55)));
      const x = g.startX, y = g.startY;                                   // fixed to the screen: no scrolling with the page
      a.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      a.style.opacity = String(1 - q);                                    // stays put, fades out once the hero is done
      a.style.pointerEvents = q > 0.95 ? 'none' : 'auto';
    }
    return { measure, frame };
  })();

  /* ---------------------------------------------------------------- 2. hours */
  (() => {
    const input = $('[data-hours]'); if (!input) return;
    const slider = $('[data-slider]');
    const out = $('[data-hours-out]');
    const unitOut = $('[data-hours-unit]');
    const daysOut = $('[data-days-out]');
    const weekOut = $('[data-week-out]');
    const backOut = $('[data-back-out]');
    const month = $('[data-month]');
    const daysWord = $('[data-days-word]');
    const backWord = $('[data-back-word]');
    const dots = [];
    for (let i = 0; i < 30; i++) { const d = document.createElement('i'); d.style.setProperty('--i', i); month.appendChild(d); dots.push(d); }

    function render() {
      const h = Number(input.value);
      const t = (h - input.min) / (input.max - input.min);
      slider.style.setProperty('--t', t.toFixed(4));
      out.textContent = h;
      if (unitOut) unitOut.textContent = h === 1 ? 'hour' : 'hours';
      const days = Math.round(h * 30 / 24);   // days of a 30-day month spent on the phone
      const back = Math.round(30 / 24);        // one hour a day back = about a day a month
      daysOut.textContent = days;
      if (weekOut) weekOut.textContent = h * 7;
      backOut.textContent = back;
      input.setAttribute('aria-valuetext', `${h} hour${h === 1 ? '' : 's'} a day`);
      if (daysWord) daysWord.textContent = days === 1 ? 'day' : 'days';
      if (backWord) backWord.textContent = back === 1 ? 'day' : 'days';
      month.setAttribute('aria-label', `30 days in a month; ${days} of them on your phone`);
      dots.forEach((d, i) => {
        const on = i < days, bk = on && i >= days - back;   // the day(s) you'd win back show as a ring
        if (d.classList.contains('on') !== on) d.classList.toggle('on', on);
        if (d.classList.contains('back') !== bk) d.classList.toggle('back', bk);
      });
    }
    input.addEventListener('input', render);
    $$('[data-step]', slider).forEach(b => b.addEventListener('click', () => {
      input.value = clamp(Number(input.value) + Number(b.dataset.step), Number(input.min), Number(input.max));
      render();
    }));
    render();
  })();

  /* ---------------------------------------------------------------- 3. nudge */
  (() => {
    const wrap = $('[data-nudge]'); if (!wrap) return;
    const feed = $('[data-feed]');
    const toast = $('[data-toast]');
    const calm = $('[data-calm]');
    const hint = $('[data-nudge-hint]');
    const palette = ['#D9A28B', '#C9B79C', '#E7C873', '#9BB3A3', '#D98C76', '#B7A4C2', '#E3B58F', '#8FA3B5', '#CDB08A', '#E09A7A'];
    const ICO = {
      heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5C5 15.6 3 12 3 9a4.7 4.7 0 0 1 9-2 4.7 4.7 0 0 1 9 2c0 3-2 6.6-9 11.5z"/></svg>',
      chat: '<svg viewBox="0 0 24 24"><path d="M4 5.5h16a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H10l-4.5 3.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z"/></svg>',
      send: '<svg viewBox="0 0 24 24"><path d="M21 4L10 14.5M21 4l-6.5 16-4-5.5L5 11z"/></svg>'
    };
    const inner = document.createElement('div');
    let html = '';
    for (let i = 0; i < 9; i++) {
      const c = palette[i % palette.length], a = palette[(i * 3 + 2) % palette.length];
      const nameW = 30 + ((i * 17) % 35);
      html += `<div class="post"><div class="post__head"><span class="post__av" style="background:${a}"></span><span class="post__name" style="width:${nameW}%"></span></div><div class="post__img" style="background:${c}"><div class="post__side"><span class="post__act"><span class="post__ic">${ICO.heart}</span><b>${(1.2 + ((i * 7) % 9) * 0.9).toFixed(1)}K</b></span><span class="post__act"><span class="post__ic">${ICO.chat}</span><b>${80 + ((i * 53) % 300)}</b></span><span class="post__act"><span class="post__ic">${ICO.send}</span></span></div></div></div>`;
    }
    inner.innerHTML = html + html; // seamless loop
    feed.appendChild(inner);
    const sizePosts = () => feed.style.setProperty('--ph', feed.clientHeight + 'px');
    sizePosts(); addEventListener('resize', sizePosts);

    const STEP = 1750, HOLD = 1200;   // ms per post: rest, then a 550ms snap
    let anim = null, timer = null, autoTimer = null, stage = 'idle';
    function start() {
      if (stage !== 'idle') return;
      stage = 'busy';
      if (!reduce) {
        /* TikTok-style: one post fills the screen, rests, then snaps up to the next */
        const H = feed.clientHeight; feed.style.setProperty('--ph', H + 'px');
        const N = 9, kf = [];
        for (let i = 0; i < N; i++) {
          kf.push({ offset: (i * STEP) / (N * STEP), transform: `translateY(${-i * H}px)`, easing: 'linear' });
          kf.push({ offset: (i * STEP + HOLD) / (N * STEP), transform: `translateY(${-i * H}px)`, easing: 'cubic-bezier(.65,0,.35,1)' });
        }
        kf.push({ offset: 1, transform: `translateY(${-N * H}px)` });
        anim = inner.animate(kf, { duration: N * STEP, iterations: Infinity });
      }
      timer = setTimeout(() => {
        toast.classList.add('is-in'); hint?.classList.add('is-on'); stage = 'nudged';
        autoTimer = setTimeout(settle, 4000);   // like the app flow: 4s after the notification, the Break screen takes over
      }, reduce ? 0 : 2400);
    }
    function settle() {
      if (stage !== 'nudged') return;
      stage = 'calm'; clearTimeout(autoTimer);
      toast.classList.add('is-done');

      const finish = () => {
        feed.classList.add('is-calm'); calm.classList.add('is-in');
        wrap.classList.add('is-replayable'); wrap.setAttribute('role', 'button'); wrap.setAttribute('tabindex', '0');
        wrap.setAttribute('aria-label', 'Watch the nudge again');
      };
      if (!anim || reduce) { anim?.pause(); finish(); return; }
      /* let the swipe in progress land on a post, then stop there */
      const a0 = anim, t = Number(a0.currentTime) % STEP;
      const wait = t < HOLD ? 0 : STEP - t;
      setTimeout(() => { if (anim !== a0) return; a0.pause(); finish(); }, wait);
    }
    function reset() {
      clearTimeout(timer); clearTimeout(autoTimer); anim?.cancel(); anim = null; stage = 'idle';
      toast.classList.remove('is-in', 'is-done'); hint?.classList.remove('is-on');
      feed.classList.remove('is-calm'); calm.classList.remove('is-in');
      wrap.classList.remove('is-replayable'); wrap.removeAttribute('role'); wrap.removeAttribute('tabindex'); wrap.removeAttribute('aria-label');
    }
    function replay() { reset(); start(); }
    toast.addEventListener('click', settle);
    wrap.addEventListener('click', e => { if (toast.contains(e.target)) return; if (stage === 'calm') replay(); });
    wrap.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && stage === 'calm') { e.preventDefault(); replay(); } });
    new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.55) start();
      else if (!e.isIntersecting) reset();
    }, { threshold: [0, 0.55] }).observe(wrap);
  })();

  /* ---------------------------------------------------------------- 4. setup phone */
  (() => {
    const root = $('[data-setup]'); if (!root) return;
    const screens = $$('.scr', root);
    const steps = $$('[data-steps] li');
    const cats = $$('.cat', root);
    const cont = $('[data-go="work"]', root);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const wheels = {};

    cats.forEach(c => c.addEventListener('click', () => {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      cont.disabled = !cats.some(x => x.getAttribute('aria-pressed') === 'true');
    }));

    $$('[data-wheel]', root).forEach(w => {
      const isDay = w.dataset.wheel.startsWith('day');
      const list = isDay ? days : hours;
      const suffix = w.dataset.suffix ? `<small>${w.dataset.suffix}</small>` : '';
      w.innerHTML = list.map((v, i) => `<div class="wheel__item" role="option" id="${w.dataset.wheel}-${i}" aria-selected="false" data-i="${i}"><span>${v}</span>${suffix}</div>`).join('');
      const items = $$('.wheel__item', w);
      const api = { el: w, list, items, sel: Number(w.dataset.start) || 0, suffix: w.dataset.suffix || '' };
      const itemH = () => items[0].offsetHeight || 1;
      const mark = () => {
        const i = clamp(Math.round(w.scrollTop / itemH()), 0, list.length - 1);
        if (i === api._marked) return; api._marked = i; api.sel = i;
        items.forEach((it, j) => { it.classList.toggle('is-sel', j === i); it.setAttribute('aria-selected', String(j === i)); });
        w.setAttribute('aria-activedescendant', items[i].id);
      };
      api.go = (i, smooth = true) => { w.scrollTo({ top: clamp(i, 0, list.length - 1) * itemH(), behavior: smooth && !reduce ? 'smooth' : 'auto' }); };
      let raf = 0;
      w.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
      items.forEach((it, i) => it.addEventListener('click', () => api.go(i)));
      w.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); api.go(api.sel + 1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); api.go(api.sel - 1); }
      });
      api.init = () => { api.go(api.sel, false); mark(); };
      wheels[w.dataset.wheel] = api;
    });

    function go(name) {
      let past = true;
      screens.forEach(s => {
        const cur = s.dataset.scr === name;
        if (cur) past = false;
        s.classList.toggle('is-current', cur);
        s.classList.toggle('is-past', !cur && past);
        s.setAttribute('aria-hidden', String(!cur));
        s.inert = !cur;
      });
      const idx = { apps: 0, work: 1, home: 2 }[name];
      steps.forEach((li, i) => { li.classList.toggle('is-active', i === idx); li.classList.toggle('is-done', i < idx); });
      if (name === 'work') requestAnimationFrame(() => Object.values(wheels).forEach(w => w.init()));
      if (name === 'home') {
        const w = wheels;
        $('[data-home-sub]', root).textContent = `${days[w.dayFrom.sel]} to ${days[w.dayTo.sel]}, ${hours[w.hourFrom.sel]} AM to ${hours[w.hourTo.sel]} PM`;
        const picked = cats.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.cat);
        $('[data-home-chip]', root).textContent = picked.length ? `Paused during work: ${picked.join(', ')}` : 'No apps blocked';
      }
      if (name === 'apps') { cats.forEach(c => c.setAttribute('aria-pressed', 'false')); cont.disabled = true; }
    }
    $$('[data-go]', root).forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
    go('apps');
    // wheels need layout to position; init once the section is near
    Object.values(wheels).forEach(w => w.init());
  })();

  /* ---------------------------------------------------------------- 5. ring */
  const ring = (() => {
    const section = $('[data-scene="ring"]'); if (!section) return null;
    const arc = $('[data-arc]');
    const plus = $('[data-plus]');
    const dial = $('[data-dial]');
    const balanceEl = $('[data-balance]');
    const balanceOut = $('[data-balance-out]');
    const freeOut = $('[data-stat-free]');
    const workOut = $('[data-stat-work]');
    const steps = $$('[data-ring-steps] li');
    let shown = 0, earned = 0, shownBalance = 5000;
    const R = 180 / 440;

    const fmt = h => { const m = Math.round(h * 60); const hh = Math.floor(m / 60), mm = m % 60; return hh ? (mm ? `${hh}h ${mm}m` : `${hh}h`) : `${mm}min`; };
    const headPos = f => { const a = Math.PI * 2 * f; return { x: 0.5 - R * Math.sin(a), y: 0.5 - R * Math.cos(a) }; };

    function setBalance(v, bump) {
      shownBalance = v; balanceOut.textContent = v.toLocaleString('en-US').replace(/,/g, '');
      if (bump) { balanceEl.classList.add('is-bump'); setTimeout(() => balanceEl.classList.remove('is-bump'), 500); }
    }
    function fly(fromX, fromY, target, onDone) {
      const tr = target.getBoundingClientRect();
      const toX = tr.left + 22, toY = tr.top + tr.height / 2;
      const img = document.createElement('img');
      img.src = 'assets/coin/coin-hero.webp'; img.alt = ''; img.className = 'flycoin';
      document.body.appendChild(img);
      const a = img.animate([
        { transform: `translate(${fromX - 17}px, ${fromY - 17}px) scale(.6)`, opacity: 0 },
        { transform: `translate(${fromX - 17}px, ${fromY - 40}px) scale(1)`, opacity: 1, offset: .25 },
        { transform: `translate(${toX - 17}px, ${toY - 17}px) scale(.72)`, opacity: 1 }
      ], { duration: 1300, easing: EASE_CALM });
      a.onfinish = () => { img.remove(); onDone && onDone(); };
    }

    function frame() {
      const p = stickyP(section);
      const target = reduce ? 1 : clamp((p - 0.06) / 0.82);
      shown = reduce ? target : lerp(shown, target, 0.09);
      if (Math.abs(shown - target) < 0.0005) shown = target;
      arc.style.strokeDashoffset = (100 - shown * 100).toFixed(2);
      const hours = shown * 8;
      freeOut.textContent = fmt(hours);
      workOut.textContent = hours >= 7.999 ? 'Done' : `${fmt(8 - hours)} left`;
      const idx = shown < 0.12 ? 0 : shown < 0.55 ? 1 : 2;
      steps.forEach((li, i) => { li.classList.toggle('is-active', i <= idx); li.classList.toggle('is-current', i === idx); });

      const nowEarned = Math.floor(hours + 0.0001);
      if (nowEarned > earned) {
        const dr = dial.getBoundingClientRect();
        for (let k = earned + 1; k <= nowEarned; k++) {
          const hp = headPos(k / 8);
          const fx = dr.left + hp.x * dr.width, fy = dr.top + hp.y * dr.height;
          plus.style.left = (hp.x * 100) + '%'; plus.style.top = (hp.y * 100) + '%';
          plus.classList.remove('is-on'); void plus.offsetWidth; plus.classList.add('is-on');
          const value = 5000 + k * 1000;
          if (reduce) setBalance(value, false);
          else fly(fx, fy, balanceEl, () => { if (value > shownBalance) setBalance(value, true); });
        }
        earned = nowEarned;
      } else if (nowEarned < earned) {
        earned = nowEarned; setBalance(5000 + earned * 1000, false);
      }
      state.balance = Math.max(state.balance, 5000 + earned * 1000);
    }
    return { frame };
  })();

  /* ---------------------------------------------------------------- 6. outside + field */
  const outside = (() => {
    const section = $('[data-scene="outside"]');
    const art = $('[data-wipe]');
    const title = $('.outside__title');
    const field = $('[data-scene="field"]');
    const sun = $('.field__sun');
    let shown = 0;
    return {
      frame() {
        if (section) {
          const p = stickyP(section);
          const target = reduce ? 1 : clamp((p - 0.04) / 0.8);
          shown = reduce ? 1 : lerp(shown, target, 0.08);
          art.style.setProperty('--r', (lerp(-16, 104, shown)).toFixed(2) + '%');
          title.classList.toggle('is-in', reduce || p > 0.02 || enterP(section, 0.6) > 0.9);
        }
        if (field) {
          const p = enterP(field, 1.1);
          sun.style.setProperty('--sun', (reduce ? 1 : p).toFixed(3));
          const slot = $('[data-draw-slot]', field);
          drawSlot(slot, reduce ? 1 : clamp((p - 0.12) / 0.85));
        }
      }
    };
  })();

  /* ---------------------------------------------------------------- 7. coin turntable + rewards */
  const coin = (() => {
    const el = $('[data-turntable]'); if (!el) return null;
    const section = el.closest('section') || $('[data-scene="coin"]');
    const FRAMES = 24;
    let current = 0, target = 0, lastScroll = window.scrollY, idleAt = 0, lastFrame = -1;
    return {
      onScroll() {
        const dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
        target += dy * 0.045;               // scroll turns the coin
        idleAt = performance.now();
      },
      frame(now) {
        const m = scenes.get(section);
        if (!m || window.scrollY + vh < m.top - 200 || window.scrollY > m.top + m.height) return;
        if (reduce) { if (lastFrame !== 0) { el.style.backgroundPosition = '0% 0'; lastFrame = 0; } return; }
        if (now - idleAt > 700) {            // at rest it settles face forward
          const front = Math.round(target / FRAMES) * FRAMES;
          target = lerp(target, front, 0.06);
        }
        current = lerp(current, target, 0.12);
        const f = ((Math.round(current) % FRAMES) + FRAMES) % FRAMES;
        if (f !== lastFrame) { el.style.backgroundPosition = `${(f / (FRAMES - 1)) * 100}% 0`; lastFrame = f; }
      }
    };
  })();

  (() => {
    const out = $('[data-store-out]'); if (!out) return;
    const bal = $('[data-store-balance]');
    let local = null;
    const show = () => { out.textContent = String(local); };
    new IntersectionObserver(([e]) => { if (e.isIntersecting && local === null) { local = state.balance; show(); } }, { threshold: 0.1 }).observe(bal);
    $$('[data-spend]').forEach(btn => btn.addEventListener('click', () => {
      if (local === null) local = state.balance;
      const card = btn.closest('.reward');
      if (card.classList.contains('is-spent')) return;
      const price = Number(btn.dataset.spend);
      if (local < price) {
        const t = btn.textContent; btn.textContent = `${price - local} more to go`;
        setTimeout(() => { btn.textContent = t; }, 2200); return;
      }
      local -= price;
      const br = bal.getBoundingClientRect(), cr = btn.getBoundingClientRect();
      const finish = () => { card.classList.add('is-spent'); btn.textContent = 'Enjoy it'; btn.setAttribute('aria-disabled', 'true'); };
      show(); bal.classList.add('is-bump'); setTimeout(() => bal.classList.remove('is-bump'), 500);
      if (reduce) { finish(); return; }
      const img = document.createElement('img');
      img.src = 'assets/coin/coin-hero.webp'; img.alt = ''; img.className = 'flycoin';
      document.body.appendChild(img);
      const a = img.animate([
        { transform: `translate(${br.left + 8}px, ${br.top + br.height / 2 - 17}px) scale(.7)`, opacity: 1 },
        { transform: `translate(${cr.left + cr.width / 2 - 17}px, ${cr.top + cr.height / 2 - 17}px) scale(.9)`, opacity: .9 }
      ], { duration: 1100, easing: EASE_CALM });
      a.onfinish = () => { img.remove(); finish(); };
    }));
  })();

  /* 8. the quiet is now a pure CSS scene (breathing ring over a photo): no script. */
  /* ---------------------------------------------------------------- 9. start */
  /* the closing sketch (Figma "SVGUR"): 30 strokes, each drawn in 2.8s, one every 0.22s, once */
  (() => {
    const sketch = $('[data-sketch]'); if (!sketch) return;
    new IntersectionObserver(([e], io) => { if (e.isIntersecting) { sketch.classList.add('is-drawing'); io.disconnect(); } }, { threshold: 0.3 }).observe(sketch);
  })();

  /* the coin-section paragraph starts at the same x as the (centred) title text above it */
  (() => {
    const title = $('#tc-title'), lead = $('.coinfeature__lead'); if (!title || !lead) return;
    function align() {
      lead.style.marginLeft = '0px';
      const rng = document.createRange(); rng.selectNodeContents(title);
      const t = rng.getBoundingClientRect(), l = lead.getBoundingClientRect();
      if (!t.width || !l.width) return;
      const off = Math.max(0, t.left - l.left);
      lead.style.marginLeft = off.toFixed(1) + 'px';
    }
    align();
    addEventListener('resize', align);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    addEventListener('load', align);
  })();

  /* ---------------------------------------------------------------- main loop */
  function updateNav() {
    nav.classList.toggle('is-solid', window.scrollY > 40);
    navLinks.forEach(({ a, t }) => { const r = t.getBoundingClientRect(); a.classList.toggle('is-active', r.top < window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.45); });
    if (heroCta) { const r = heroCta.getBoundingClientRect(); nav.classList.toggle('cta-hidden', r.bottom > 0 && r.top < window.innerHeight); }
  }
  let lastT = performance.now();
  function tick(now) {
    const dt = Math.min(64, now - lastT); lastT = now;
    updateNav();
    hero.frame(dt);
    floatCoin && floatCoin.frame();
    ring && ring.frame();
    outside.frame();
    coin && coin.frame(now);
    requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', () => { coin && coin.onScroll(); updateNav(); }, { passive: true });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });

  // Capture helper for design review: ?at=<css selector>&p=<0..1> or ?y=<px> scrolls there on load.
  function jumpFromQuery() {
    const q = new URLSearchParams(location.search);
    let y = null;
    if (q.has('y')) y = Number(q.get('y'));
    if (q.has('at')) {
      const el = $(q.get('at'));
      if (el) { const m = el.getBoundingClientRect(); const top = m.top + window.scrollY; y = top + Number(q.get('p') || 0) * Math.max(0, m.height - vh); }
    }
    if (y !== null) { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, y); }
  }

  function boot() {
    measure();
    jumpFromQuery();
    requestAnimationFrame(tick);
  }
  loadDrawSlots().then(measure);
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
  // fonts can shift layout
  document.fonts?.ready.then(measure);
})();
