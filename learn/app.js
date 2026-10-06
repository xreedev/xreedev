(function () {
  'use strict';

  /* ================================================================ DATA */
  var CUR = window.CURRICULUM;
  var MODS = [];
  var BYID = {};
  var MONTHS = CUR.months.map(function (m, mi) {
    return { n: mi + 1, data: m, mods: [], weeks: [] };
  });

  function parseRes(s) {
    var i = s.indexOf('|');
    if (i > -1) return { label: s.slice(0, i), url: s.slice(i + 1), direct: true };
    return { label: s, url: 'https://www.google.com/search?q=' + encodeURIComponent(s), direct: false };
  }

  CUR.months.forEach(function (m, mi) {
    m.weeks.forEach(function (w, wi) {
      var week = { n: mi * 4 + wi + 1, title: w.title, mods: [] };
      MONTHS[mi].weeks.push(week);
      w.days.forEach(function (d, di) {
        var mod = {
          id: (mi + 1) + '-' + (wi + 1) + '-' + (di + 1),
          idx: MODS.length, num: MODS.length + 1,
          m: mi + 1, w: wi + 1, wk: week.n, d: di + 1,
          build: di === 4,
          title: d[0], goal: d[1], tasks: d[2], res: d[3].map(parseRes), hrs: d[4],
          weekTitle: w.title
        };
        MODS.push(mod); BYID[mod.id] = mod;
        MONTHS[mi].mods.push(mod); week.mods.push(mod);
      });
    });
  });
  var TOTAL = MODS.length;

  /* ================================================================ STATE */
  var LS = 'robotics-path-v1';
  function today() { return iso(new Date()); }
  function iso(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function fromIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function defaults() {
    return {
      settings: { name: '', startDate: today(), dailyGoal: 2, theme: 'auto' },
      done: {}, tasks: {}, notes: {}, time: {}, links: {}, journal: [], gear: {}, act: {},
      timer: null, last: null
    };
  }
  var S = (function () {
    var d = defaults();
    try {
      var raw = JSON.parse(localStorage.getItem(LS) || 'null');
      if (raw) {
        Object.keys(d).forEach(function (k) { if (raw[k] !== undefined) d[k] = raw[k]; });
        d.settings = Object.assign(defaults().settings, raw.settings || {});
      }
    } catch (e) {}
    return d;
  })();
  var saveWarned = false;
  function save() {
    try { localStorage.setItem(LS, JSON.stringify(S)); }
    catch (e) { if (!saveWarned) { saveWarned = true; toast('Browser storage is full or blocked - export a backup'); } }
  }
  function bump(n) { var t = today(); S.act[t] = (S.act[t] || 0) + (n || 1); }

  /* ================================================================ FILE STORE (IndexedDB) */
  var DB = {
    db: null, ok: true,
    open: function () {
      var self = this;
      return new Promise(function (res) {
        if (!window.indexedDB) { self.ok = false; return res(null); }
        var r = indexedDB.open('robotics-path-files', 1);
        r.onupgradeneeded = function () {
          var st = r.result.createObjectStore('files', { keyPath: 'id' });
          st.createIndex('owner', 'owner');
        };
        r.onsuccess = function () { self.db = r.result; res(self.db); };
        r.onerror = function () { self.ok = false; res(null); };
      });
    },
    store: function (mode) { return this.db.transaction('files', mode).objectStore('files'); },
    req: function (r) { return new Promise(function (res, rej) { r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); },
    all: function () { return this.ok && this.db ? this.req(this.store('readonly').getAll()) : Promise.resolve([]); },
    byOwner: function (o) { return this.ok && this.db ? this.req(this.store('readonly').index('owner').getAll(o)) : Promise.resolve([]); },
    put: function (f) { return this.req(this.store('readwrite').put(f)); },
    del: function (id) { return this.req(this.store('readwrite').delete(id)); },
    clear: function () { return this.req(this.store('readwrite').clear()); }
  };

  /* ================================================================ UTILS */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function fmtDur(sec) {
    sec = Math.round(sec || 0);
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
    return h ? h + 'h ' + String(m).padStart(2, '0') + 'm' : m + 'm';
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ':' : '') + String(m).padStart(h ? 2 : 1, '0') + ':' + String(s).padStart(2, '0');
  }
  function fmtSize(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(0) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }
  function fmtDate(s) { return fromIso(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }
  function mcol(n) { return 'var(--m' + n + ')'; }

  var ICON = {
    home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    map: '<path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7zM9 4v13M15 7v13"/>',
    note: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6"/>',
    file: '<path d="M21 12.5 12.5 21a5.5 5.5 0 0 1-8-8l9-9a3.7 3.7 0 0 1 5.3 5.3l-9 9a1.8 1.8 0 0 1-2.6-2.6L15 8"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13.5A8.5 8.5 0 1 1 10.5 3a7 7 0 0 0 10.5 10.5z"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  function ic(n, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' + (extra || '') + '>' + ICON[n] + '</svg>'; }

  /* ---- tiny markdown renderer (safe: input is escaped first) ---- */
  function mdInline(s) {
    var codes = [];
    s = esc(s).replace(/`([^`]+)`/g, function (_, c) { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>').replace(/\*([^*\s][^*]*)\*/g, '<em>$1</em>');
    return s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return '<code>' + codes[+i] + '</code>'; });
  }
  function md(src) {
    if (!src || !src.trim()) return '<p class="md-empty">Nothing here yet.</p>';
    var lines = src.replace(/\r/g, '').split('\n'), out = [], i = 0;
    while (i < lines.length) {
      var l = lines[i], m;
      if (/^```/.test(l)) {
        var buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++; out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>'); continue;
      }
      if ((m = l.match(/^(#{1,3})\s+(.*)/))) { out.push('<h' + m[1].length + '>' + mdInline(m[2]) + '</h' + m[1].length + '>'); i++; continue; }
      if (/^\s*(---|\*\*\*)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
      if (/^>\s?/.test(l)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
        out.push('<blockquote>' + mdInline(q.join(' ')) + '</blockquote>'); continue;
      }
      if (/^\s*([-*+]|\d+\.)\s+/.test(l)) {
        var ord = /^\s*\d+\./.test(l), items = [];
        while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
          var t = lines[i++].replace(/^\s*([-*+]|\d+\.)\s+/, ''), cb = t.match(/^\[( |x|X)\]\s+(.*)/);
          items.push(cb ? '<li class="cb"><input type="checkbox" disabled ' + (cb[1] !== ' ' ? 'checked' : '') + '> ' + mdInline(cb[2]) + '</li>' : '<li>' + mdInline(t) + '</li>');
        }
        out.push((ord ? '<ol>' : '<ul>') + items.join('') + (ord ? '</ol>' : '</ul>')); continue;
      }
      if (!l.trim()) { i++; continue; }
      var p = [];
      while (i < lines.length && lines[i].trim() && !/^(```|#{1,3}\s|>\s?|\s*([-*+]|\d+\.)\s+|\s*---\s*$)/.test(lines[i])) p.push(lines[i++]);
      out.push('<p>' + mdInline(p.join('\n')).replace(/\n/g, '<br>') + '</p>');
    }
    return out.join('');
  }

  /* ================================================================ PROGRESS HELPERS */
  function doneCount(list) { var n = 0; list.forEach(function (m) { if (S.done[m.id]) n++; }); return n; }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function taskDone(m) { var t = S.tasks[m.id] || {}, n = 0; m.tasks.forEach(function (_, i) { if (t[i]) n++; }); return n; }
  function totalDone() { return doneCount(MODS); }
  function nextUndone(fromIdx) {
    for (var i = (fromIdx || 0); i < TOTAL; i++) if (!S.done[MODS[i].id]) return MODS[i];
    for (var j = 0; j < (fromIdx || 0); j++) if (!S.done[MODS[j].id]) return MODS[j];
    return null;
  }
  function completedOn(date) { var n = 0; Object.keys(S.done).forEach(function (k) { if (S.done[k] === date) n++; }); return n; }
  function totalSeconds() {
    var t = 0; Object.keys(S.time).forEach(function (k) { t += S.time[k]; });
    if (S.timer) t += (Date.now() - S.timer.start) / 1000;
    return t;
  }
  function streak() {
    var d = new Date(), n = 0;
    if (!S.act[iso(d)] && !completedOn(iso(d))) d.setDate(d.getDate() - 1);
    while (S.act[iso(d)] || completedOn(iso(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function weekdaysSince(startIso) {
    var s = fromIso(startIso), t = fromIso(today()), n = 0;
    if (s > t) return 0;
    for (var d = new Date(s); d <= t; d.setDate(d.getDate() + 1)) { var w = d.getDay(); if (w !== 0 && w !== 6) n++; }
    return n;
  }
  function pace() {
    var expected = Math.min(TOTAL, weekdaysSince(S.settings.startDate)), diff = totalDone() - expected;
    var label = diff === 0 ? 'On track' : diff > 0 ? plural(diff, 'module') + ' ahead' : plural(-diff, 'module') + ' behind';
    return { expected: expected, diff: diff, label: label };
  }
  function projectedFinish() {
    var done = totalDone(), left = TOTAL - done;
    if (!left) return 'Complete!';
    var elapsed = Math.max(1, Math.round((fromIso(today()) - fromIso(S.settings.startDate)) / 864e5) + 1);
    var rate = done / elapsed;
    var days = rate > 0 ? Math.ceil(left / rate) : left * 1.4;
    var d = new Date(); d.setDate(d.getDate() + Math.ceil(days));
    return fmtDate(iso(d));
  }
  function plannedFinish() { var d = fromIso(S.settings.startDate); d.setDate(d.getDate() + 24 * 7); return fmtDate(iso(d)); }

  /* ================================================================ ACTIONS */
  function setDone(id, on, date) {
    if (on) { S.done[id] = date || today(); bump(3); } else delete S.done[id];
    save();
  }
  function toggleDone(id) {
    var m = BYID[id], was = !!S.done[id];
    setDone(id, !was);
    if (!was) {
      var wk = MONTHS[m.m - 1].weeks[(m.w - 1)];
      var d = totalDone();
      if (d === TOTAL) toast('You finished the entire roadmap!');
      else if (doneCount(wk.mods) === wk.mods.length) toast('Week ' + m.wk + ' complete - ' + d + '/' + TOTAL + ' modules');
      else toast('Module complete - ' + d + '/' + TOTAL);
    }
    return !was;
  }
  function toggleTask(id, i) {
    S.tasks[id] = S.tasks[id] || {};
    S.tasks[id][i] = !S.tasks[id][i];
    if (!S.tasks[id][i]) delete S.tasks[id][i];
    bump(1); save();
  }
  function startTimer(id) {
    if (S.timer) stopTimer();
    S.timer = { id: id, start: Date.now() }; save(); tick();
  }
  function stopTimer() {
    if (!S.timer) return;
    var el = (Date.now() - S.timer.start) / 1000;
    S.time[S.timer.id] = (S.time[S.timer.id] || 0) + el;
    S.timer = null; bump(1); save(); tick();
  }
  function modTime(id) {
    var t = S.time[id] || 0;
    if (S.timer && S.timer.id === id) t += (Date.now() - S.timer.start) / 1000;
    return t;
  }

  /* ================================================================ UI HELPERS */
  function toast(msg) {
    var el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
    $('#toasts').appendChild(el); setTimeout(function () { el.remove(); }, 2800);
  }
  var objectUrls = [];
  function trackUrl(blob) { var u = URL.createObjectURL(blob); objectUrls.push(u); return u; }
  function revokeUrls() { objectUrls.forEach(function (u) { URL.revokeObjectURL(u); }); objectUrls = []; }

  function openOverlay(html, cls) {
    var o = $('#overlay'); o.className = 'overlay ' + (cls || ''); o.innerHTML = html; o.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    var o = $('#overlay'); o.hidden = true; o.innerHTML = ''; document.body.style.overflow = '';
  }
  function checkBtn(id, on) {
    return '<button class="check ' + (on ? 'on' : '') + '" data-act="toggle" data-id="' + id + '" aria-label="' + (on ? 'Mark incomplete' : 'Mark complete') + '" aria-pressed="' + on + '">' + ic('check') + '</button>';
  }

  function modCard(m) {
    var done = !!S.done[m.id], td = taskDone(m), hasNote = !!(S.notes[m.id] || '').trim();
    return '<div class="mod ' + (done ? 'done' : '') + '" style="--c:' + mcol(m.m) + '" data-href="#/module/' + m.id + '">' +
      '<div class="top"><span class="day">Day ' + m.d + (m.build ? ' · Build' : '') + '</span>' + checkBtn(m.id, done) + '</div>' +
      '<h4><a href="#/module/' + m.id + '">' + esc(m.title) + '</a></h4>' +
      '<div class="foot"><div class="bar"><i style="width:' + pct(td, m.tasks.length) + '%"></i></div>' +
      '<span>' + td + '/' + m.tasks.length + '</span><span title="Estimated hours">' + m.hrs + 'h</span>' + (hasNote ? '<span title="Has notes">✎</span>' : '') + '</div></div>';
  }

  /* ================================================================ VIEWS */
  var post = null; // hook run after render

  function viewDashboard() {
    var done = totalDone(), p = pace(), ring = 2 * Math.PI * 56, off = ring * (1 - done / TOTAL);
    var nxt = nextUndone(S.last ? BYID[S.last] ? BYID[S.last].idx : 0 : 0) || null;
    var upnext = [], idx = nxt ? nxt.idx : 0;
    for (var i = 0; i < TOTAL && upnext.length < 4; i++) { var mm = MODS[(idx + i) % TOTAL]; if (!S.done[mm.id]) upnext.push(mm); }
    var todayN = completedOn(today()), goal = +S.settings.dailyGoal || 1, dots = '';
    for (var g = 0; g < Math.max(goal, todayN); g++) dots += '<i class="' + (g < todayN ? 'on' : '') + '"></i>';
    var name = S.settings.name ? ', ' + esc(S.settings.name) : '';
    var h = new Date().getHours(), greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

    var months = MONTHS.map(function (mo) {
      var d = doneCount(mo.mods);
      return '<a class="month-row" href="#/roadmap/' + mo.n + '"><span class="badge-num" style="--c:' + mcol(mo.n) + ';width:34px;height:34px;font-size:12px">M' + mo.n + '</span>' +
        '<div><b>' + esc(mo.data.short) + '</b><div class="bar" style="--c:' + mcol(mo.n) + '"><i style="width:' + pct(d, mo.mods.length) + '%"></i></div></div>' +
        '<span class="muted">' + d + '/' + mo.mods.length + '</span></a>';
    }).join('');

    var recent = Object.keys(S.done).sort(function (a, b) { return S.done[b] < S.done[a] ? -1 : S.done[b] > S.done[a] ? 1 : BYID[b].idx - BYID[a].idx; }).slice(0, 5).map(function (id) {
      var m = BYID[id];
      return '<a class="next-card" href="#/module/' + id + '"><span class="badge-num" style="--c:' + mcol(m.m) + '">' + m.num + '</span><div><h3>' + esc(m.title) + '</h3><p>Completed ' + fmtDate(S.done[id]) + '</p></div></a>';
    }).join('');

    var noteCount = Object.keys(S.notes).filter(function (k) { return (S.notes[k] || '').trim(); }).length + S.journal.length;

    post = function () { DB.all().then(function (f) { var el = $('#statFiles'); if (el) el.textContent = f.length; }); };
    return '<div class="card hero">' +
      '<div class="ring"><svg width="132" height="132" viewBox="0 0 132 132"><circle cx="66" cy="66" r="56" fill="none" stroke="var(--surface-2)" stroke-width="12"/><circle cx="66" cy="66" r="56" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + ring + '" stroke-dashoffset="' + off + '"/></svg><div class="pct"><div>' + pct(done, TOTAL) + '%<small>' + done + '/' + TOTAL + '</small></div></div></div>' +
      '<div><h1>' + greet + name + '.</h1><p class="muted">' + (done === TOTAL ? 'Roadmap complete. Now go build something great.' : 'You are on module ' + (nxt ? nxt.num : TOTAL) + ' of ' + TOTAL + '. Pace: <b>' + p.label + '</b>.') + '</p>' +
      '<div class="stats">' +
      '<div class="stat"><b>' + streak() + '</b><span>Day streak</span></div>' +
      '<div class="stat"><b>' + fmtDur(totalSeconds()) + '</b><span>Time studied</span></div>' +
      '<div class="stat"><b>' + noteCount + '</b><span>Notes</span></div>' +
      '<div class="stat"><b id="statFiles">-</b><span>Files</span></div></div></div></div>' +

      '<div class="dash-grid"><div class="grid">' +
      '<div class="card pad"><div class="section-title">Up next <span class="chip">' + plural(upnext.length ? TOTAL - done : 0, 'module') + ' left</span></div>' +
      (upnext.length ? upnext.map(function (m, i) {
        return '<a class="next-card ' + (i === 0 ? 'big' : '') + '" style="margin-bottom:10px" href="#/module/' + m.id + '"><span class="badge-num" style="--c:' + mcol(m.m) + '">' + m.num + '</span><div><h3>' + esc(m.title) + '</h3><p>Month ' + m.m + ' · Week ' + m.wk + ' · Day ' + m.d + ' · ~' + m.hrs + 'h' + (m.build ? ' · Build day' : '') + '</p></div></a>';
      }).join('') : '<div class="empty">Everything is complete.</div>') + '</div>' +
      '<div class="card pad"><div class="section-title">Activity</div><div class="heat" id="heat">' + heatmap() + '</div><p class="muted" style="font-size:12.5px;margin-top:6px">Last 20 weeks. Darker = more activity.</p></div>' +
      (recent ? '<div class="card pad"><div class="section-title">Recently completed</div><div class="grid" style="gap:8px">' + recent + '</div></div>' : '') +
      '</div><div class="grid" style="align-content:start">' +
      '<div class="card pad"><div class="section-title">Today <span class="chip ' + (todayN >= goal ? 'done' : '') + '">' + todayN + ' / ' + goal + ' goal</span></div><div class="goal-dots">' + dots + '</div>' +
      '<p class="muted" style="font-size:13px;margin-top:10px">' + (todayN >= goal ? 'Goal reached. Do as many extra modules as you like.' : 'Complete ' + (goal - todayN) + ' more to hit today\'s goal. There is no daily cap.') + '</p></div>' +
      '<div class="card pad"><div class="section-title">Months</div>' + months + '</div>' +
      '<div class="card pad"><div class="section-title">Schedule</div>' +
      '<div class="kv"><span>Started</span><b>' + fmtDate(S.settings.startDate) + '</b></div>' +
      '<div class="kv"><span>Planned finish</span><b>' + plannedFinish() + '</b></div>' +
      '<div class="kv"><span>Projected finish</span><b>' + projectedFinish() + '</b></div>' +
      '<div class="kv"><span>Expected by today</span><b>' + plural(p.expected, 'module') + '</b></div></div>' +
      '</div></div>';
  }

  function heatmap() {
    var now = new Date(), start = new Date(now); start.setDate(start.getDate() - now.getDay() - 19 * 7);
    var out = '', t = today();
    for (var d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
      var k = iso(d), v = (S.act[k] || 0), l = v === 0 ? 0 : v < 3 ? 1 : v < 6 ? 2 : v < 10 ? 3 : 4;
      out += '<i data-l="' + l + '" class="' + (k === t ? 'today' : '') + '" title="' + k + ': ' + plural(completedOn(k), 'module') + ' completed, ' + v + ' activity points"></i>';
    }
    return out;
  }

  var rmFilter = 'all';
  function viewRoadmap(arg) {
    var n = Math.min(6, Math.max(1, parseInt(arg, 10) || (S.last && BYID[S.last] ? BYID[S.last].m : 1))), mo = MONTHS[n - 1], d = mo.data;
    var tabs = MONTHS.map(function (x) {
      var dc = doneCount(x.mods);
      return '<a class="tab ' + (x.n === n ? 'active' : '') + '" style="--c:' + mcol(x.n) + ';text-decoration:none" href="#/roadmap/' + x.n + '"><small>Month ' + x.n + '</small><b>' + esc(x.data.short) + '</b><div class="bar" style="--c:' + mcol(x.n) + '"><i style="width:' + pct(dc, x.mods.length) + '%"></i></div></a>';
    }).join('');
    var dc2 = doneCount(mo.mods);
    var gear = d.gear.map(function (g, i) {
      var key = n + '-' + i, on = !!S.gear[key];
      return '<label class="gear-item"><input type="checkbox" data-act="gear" data-key="' + key + '" ' + (on ? 'checked' : '') + ' style="accent-color:var(--ok);margin-top:3px"><div><b>' + esc(g[0]) + '</b><small>' + esc(g[2]) + '</small></div><span class="price">' + esc(g[1]) + '</span></label>';
    }).join('');
    var gearGot = d.gear.filter(function (_, i) { return S.gear[n + '-' + i]; }).length;

    var weeks = mo.weeks.map(function (w) {
      var list = w.mods.filter(function (m) { return rmFilter === 'all' || (rmFilter === 'todo' ? !S.done[m.id] : !!S.done[m.id]); });
      if (!list.length) return '';
      var wd = doneCount(w.mods);
      return '<section class="week"><div class="week-head"><h3>Week ' + w.n + ': ' + esc(w.title) + '</h3><div class="bar" style="--c:' + mcol(n) + '"><i style="width:' + pct(wd, w.mods.length) + '%"></i></div><span class="muted" style="font-size:13px">' + wd + '/' + w.mods.length + '</span></div>' +
        '<div class="mods" style="--c:' + mcol(n) + '">' + list.map(modCard).join('') + '</div></section>';
    }).join('');

    return '<div class="page-head"><div><h1>Roadmap</h1><p>' + TOTAL + ' modules across 24 weeks. Do them in order, or jump around - complete as many per day as you like.</p></div>' +
      '<div class="seg" role="group" aria-label="Filter">' + ['all', 'todo', 'done'].map(function (f) { return '<button data-act="filter" data-f="' + f + '" class="' + (rmFilter === f ? 'on' : '') + '">' + { all: 'All', todo: 'To do', done: 'Done' }[f] + '</button>'; }).join('') + '</div></div>' +
      '<div class="tabs">' + tabs + '</div>' +
      '<div class="card month-head" style="--c:' + mcol(n) + '"><h2>Month ' + n + ': ' + esc(d.title) + '</h2><p class="muted" style="margin-top:6px">' + esc(d.outcome) + '</p>' +
      '<div class="meta"><span class="chip">' + dc2 + '/' + mo.mods.length + ' modules</span><span class="chip">Budget: ' + esc(d.budget) + '</span><span class="chip">~' + Math.round(mo.mods.reduce(function (a, m) { return a + m.hrs; }, 0)) + ' hours</span></div>' +
      '<details class="gear"><summary>Hardware &amp; shopping list (' + gearGot + '/' + d.gear.length + ' got) <span class="muted" style="font-weight:400;font-size:12.5px">- prices from the source article, Sept 2026</span></summary><div class="gear-list">' + gear + '</div></details></div>' +
      (weeks || '<div class="empty">No modules match this filter.</div>');
  }

  function viewModule(id) {
    var m = BYID[id];
    if (!m) return '<div class="empty">Module not found. <a href="#/roadmap">Back to roadmap</a></div>';
    S.last = id; save();
    var done = !!S.done[id], td = taskDone(m), prev = MODS[m.idx - 1], next = MODS[m.idx + 1];
    var tasks = m.tasks.map(function (t, i) {
      var on = !!(S.tasks[id] || {})[i];
      return '<label class="task ' + (on ? 'on' : '') + '"><input type="checkbox" data-act="task" data-id="' + id + '" data-i="' + i + '" ' + (on ? 'checked' : '') + '><span>' + esc(t) + '</span></label>';
    }).join('');
    var res = m.res.map(function (r) {
      var host = ''; try { host = r.direct ? new URL(r.url).hostname.replace(/^www\./, '') : 'web search'; } catch (e) {}
      return '<a class="res" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + ic(r.direct ? 'link' : 'search') + '<span>' + esc(r.label) + '</span><small>' + esc(host) + '</small></a>';
    }).join('');
    var links = (S.links[id] || []).map(function (l, i) {
      return '<div class="res"><a href="' + esc(l.u) + '" target="_blank" rel="noopener noreferrer" style="flex:1;color:inherit;overflow:hidden;text-overflow:ellipsis">' + ic('link', 'style="display:inline;vertical-align:-3px;margin-right:6px;width:16px;height:16px;color:var(--accent)"') + esc(l.t || l.u) + '</a><button class="btn sm danger" data-act="dellink" data-id="' + id + '" data-i="' + i + '" aria-label="Remove link">✕</button></div>';
    }).join('');
    var running = S.timer && S.timer.id === id;

    post = function () {
      bindEditor('mod-' + id, S.notes[id] || '', function (v) { S.notes[id] = v; bump(1); save(); });
      loadFiles(id);
    };
    return '<div class="crumbs"><a href="#/roadmap/' + m.m + '">Month ' + m.m + '</a><span>›</span><span>Week ' + m.wk + ': ' + esc(m.weekTitle) + '</span><span>›</span><span>Day ' + m.d + '</span></div>' +
      '<div class="card mod-head" style="--c:' + mcol(m.m) + '"><div class="row wrap"><span class="chip">Module ' + m.num + ' / ' + TOTAL + '</span>' + (m.build ? '<span class="chip build">Build day</span>' : '') + '<span class="chip">~' + m.hrs + ' hours</span>' + (done ? '<span class="chip done">Completed ' + fmtDate(S.done[id]) + '</span>' : '') + '</div>' +
      '<h1>' + esc(m.title) + '</h1><p>' + esc(m.goal) + '</p></div>' +
      '<div class="mod-layout"><div class="stack">' +
      '<div class="card pad"><div class="section-title">Tasks <span class="chip" id="taskChip">' + td + '/' + m.tasks.length + '</span></div>' + tasks + '</div>' +
      '<div class="card pad"><div class="section-title">Resources</div>' + res + (links ? '<div class="section-title" style="margin-top:16px">My links</div>' + links : '') +
      '<form class="link-form" data-act="addlink" data-id="' + id + '"><input type="text" name="t" placeholder="Title (optional)" aria-label="Link title"><input type="text" name="u" placeholder="https://…" aria-label="Link URL" required><button class="btn sm" type="submit">Add link</button></form></div>' +
      '<div class="card pad"><div class="section-title">Notes <span class="saved" id="saved-mod-' + id + '"></span></div>' + editorHTML('mod-' + id, 'Write what you learnt, commands, gotchas, questions… (Markdown supported)') + '</div>' +
      '<div class="card pad"><div class="section-title">Files &amp; uploads <span class="chip" id="fileCount">0</span></div>' + dropHTML(id) + '<div class="files" id="files-' + id + '"></div></div>' +
      '</div><div class="aside">' +
      '<div class="card pad"><button class="btn lg ' + (done ? '' : 'ok') + '" style="width:100%;justify-content:center" data-act="toggle" data-id="' + id + '">' + (done ? 'Completed - undo' : 'Mark complete') + '</button>' +
      (!done && next ? '<button class="btn" style="width:100%;justify-content:center;margin-top:8px" data-act="completenext" data-id="' + id + '">Complete &amp; next →</button>' : '') +
      (done ? '<label class="field" style="margin:14px 0 0"><span>Completed on</span><input type="date" data-act="donedate" data-id="' + id + '" value="' + S.done[id] + '" max="' + today() + '"></label>' : '') + '</div>' +
      '<div class="card pad"><div class="section-title">Study timer</div><div class="timer-big" id="modTimer" data-id="' + id + '">' + fmtClock(modTime(id)) + '</div><p class="muted" style="font-size:12.5px;margin:2px 0 12px">Total time on this module</p>' +
      '<button class="btn ' + (running ? '' : 'primary') + '" data-act="' + (running ? 'timerstop' : 'timerstart') + '" data-id="' + id + '">' + (running ? 'Stop timer' : 'Start timer') + '</button></div>' +
      '<div class="card pad"><div class="section-title">Progress</div><div class="bar" style="--c:' + mcol(m.m) + '"><i style="width:' + pct(td, m.tasks.length) + '%" id="taskBar"></i></div>' +
      '<div class="kv" style="margin-top:10px"><span>Month ' + m.m + '</span><b>' + doneCount(MONTHS[m.m - 1].mods) + '/' + MONTHS[m.m - 1].mods.length + '</b></div>' +
      '<div class="kv"><span>Overall</span><b>' + totalDone() + '/' + TOTAL + '</b></div></div>' +
      '<div class="nextprev">' + (prev ? '<a href="#/module/' + prev.id + '"><small>← Previous</small>' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a href="#/module/' + next.id + '"><small>Next →</small>' + esc(next.title) + '</a>' : '<span></span>') + '</div>' +
      '</div></div>';
  }

  /* ---- editor component ---- */
  function editorHTML(eid, placeholder) {
    var tools = [['B', '**', '**', 'bold text', 'Bold'], ['I', '_', '_', 'italic', 'Italic'], ['</>', '`', '`', 'code', 'Inline code'], ['H', '## ', '', 'Heading', 'Heading'], ['•', '- ', '', 'List item', 'Bullet list'], ['☑', '- [ ] ', '', 'To do', 'Checklist'], ['{ }', '\n```\n', '\n```\n', 'code', 'Code block'], ['🔗', '[', '](https://)', 'link text', 'Link']];
    return '<div class="editor" data-eid="' + eid + '"><div class="editor-tabs"><div class="seg"><button data-act="edtab" data-tab="write" class="on">Write</button><button data-act="edtab" data-tab="preview">Preview</button></div>' +
      tools.map(function (t) { return '<button class="tool" type="button" data-act="edtool" data-b="' + esc(t[1]) + '" data-a="' + esc(t[2]) + '" data-p="' + esc(t[3]) + '" title="' + t[4] + '">' + esc(t[0]) + '</button>'; }).join('') + '</div>' +
      '<textarea class="notes-area" placeholder="' + esc(placeholder) + '" aria-label="Notes"></textarea><div class="md preview" hidden></div></div>';
  }
  function bindEditor(eid, value, onChange) {
    var root = document.querySelector('.editor[data-eid="' + eid + '"]'); if (!root) return;
    var ta = $('textarea', root), saved = document.getElementById('saved-' + eid);
    ta.value = value || '';
    var flush = debounce(function () { onChange(ta.value); if (saved) saved.textContent = 'Saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }, 500);
    ta.addEventListener('input', function () { if (saved) saved.textContent = 'Saving…'; flush(); });
    ta.addEventListener('blur', function () { onChange(ta.value); });
    ta.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); wrap(ta, '**', '**', 'bold text'); flush(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); wrap(ta, '_', '_', 'italic'); flush(); }
      if (e.key === 'Tab') { e.preventDefault(); wrap(ta, '  ', '', ''); flush(); }
    });
    root._ta = ta; root._flush = flush;
  }
  function wrap(ta, b, a, ph) {
    var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || ph;
    ta.setRangeText(b + sel + a, s, e, 'select');
    ta.selectionStart = s + b.length; ta.selectionEnd = s + b.length + sel.length; ta.focus();
    ta.dispatchEvent(new Event('input'));
  }

  /* ---- files ---- */
  function dropHTML(owner) {
    return '<div class="drop" data-owner="' + esc(owner) + '" tabindex="0" role="button" aria-label="Upload files"><b>Drop files here</b> or click to browse<br><small>Images, PDFs, code, datasheets, CAD, videos - anything. Stored privately in your browser.</small>' +
      '<input type="file" multiple hidden></div>';
  }
  function fileIcon(f) {
    var ext = (f.name.split('.').pop() || '').slice(0, 4).toUpperCase();
    return esc(ext || 'FILE');
  }
  function fileCard(f, showOwner) {
    var thumb = f.type.indexOf('image/') === 0 ? '<img alt="" src="' + trackUrl(f.blob) + '">' : f.type.indexOf('video/') === 0 ? '<video muted preload="metadata" src="' + trackUrl(f.blob) + '#t=0.5"></video>' : fileIcon(f);
    var own = '';
    if (showOwner) {
      if (BYID[f.owner]) own = '<a href="#/module/' + f.owner + '">M' + BYID[f.owner].num + ': ' + esc(BYID[f.owner].title) + '</a>';
      else own = f.owner.indexOf('nb-') === 0 ? 'Notebook' : 'Library';
      own = '<br><span>' + own + '</span>';
    }
    return '<div class="file"><div class="thumb" data-act="preview" data-fid="' + f.id + '">' + thumb + '</div><div class="info"><b title="' + esc(f.name) + '">' + esc(f.name) + '</b><span>' + fmtSize(f.size) + ' · ' + fmtDate(iso(new Date(f.ts))) + '</span>' + own + '</div>' +
      '<div class="acts"><button data-act="preview" data-fid="' + f.id + '">View</button><button data-act="download" data-fid="' + f.id + '">Save</button><button class="del" data-act="delfile" data-fid="' + f.id + '">Delete</button></div></div>';
  }
  function loadFiles(owner) {
    var grid = document.getElementById('files-' + owner); if (!grid) return;
    DB.byOwner(owner).then(function (list) {
      list.sort(function (a, b) { return b.ts - a.ts; });
      revokeUrls();
      grid.innerHTML = list.map(function (f) { return fileCard(f, false); }).join('');
      var c = document.getElementById('fileCount'); if (c) c.textContent = list.length;
    }).catch(function () { grid.innerHTML = '<div class="empty">File storage is unavailable in this browser mode.</div>'; });
  }
  function addFiles(owner, fileList, after) {
    if (!DB.ok || !DB.db) { toast('File storage is unavailable (private mode?)'); return; }
    var arr = Array.prototype.slice.call(fileList);
    Promise.all(arr.map(function (file) {
      return DB.put({ id: uid(), owner: owner, name: file.name, type: file.type || guessType(file.name), size: file.size, ts: Date.now(), blob: file });
    })).then(function () { bump(arr.length); save(); toast('Uploaded ' + plural(arr.length, 'file')); after(); })
      .catch(function () { toast('Upload failed - storage may be full'); });
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  }
  function guessType(n) {
    var e = (n.split('.').pop() || '').toLowerCase();
    return { md: 'text/markdown', py: 'text/x-python', js: 'text/javascript', ino: 'text/x-arduino', cpp: 'text/x-c++', c: 'text/x-c', h: 'text/x-c', json: 'application/json', csv: 'text/csv', txt: 'text/plain', yaml: 'text/yaml', yml: 'text/yaml', urdf: 'text/xml', xacro: 'text/xml', xml: 'text/xml', launch: 'text/plain', pdf: 'application/pdf' }[e] || '';
  }
  function isText(f) { return f.type.indexOf('text/') === 0 || /json|xml|yaml/.test(f.type) || /\.(md|py|ino|cpp|c|h|js|json|csv|txt|ya?ml|urdf|xacro|launch|sdf|cfg|ini|sh|toml|log|msg|srv)$/i.test(f.name); }
  function previewFile(id) {
    DB.all().then(function (list) {
      var f = list.filter(function (x) { return x.id === id; })[0]; if (!f) return;
      var url = trackUrl(f.blob), body;
      if (f.type.indexOf('image/') === 0) body = '<img alt="' + esc(f.name) + '" src="' + url + '">';
      else if (f.type.indexOf('video/') === 0) body = '<video controls src="' + url + '"></video>';
      else if (f.type.indexOf('audio/') === 0) body = '<audio controls src="' + url + '" style="width:100%"></audio>';
      else if (f.type === 'application/pdf') body = '<iframe title="' + esc(f.name) + '" src="' + url + '"></iframe>';
      else if (isText(f) && f.size < 2e6) {
        body = '<pre id="txtPrev">Loading…</pre>';
        f.blob.text().then(function (t) { var el = $('#txtPrev'); if (el) { if (/\.md$/i.test(f.name)) { el.outerHTML = '<div class="md">' + md(t) + '</div>'; } else el.textContent = t; } });
      } else body = '<div class="empty">No preview for this file type. Use Save to download it.<br><br><b>' + esc(f.name) + '</b> · ' + fmtSize(f.size) + '</div>';
      openOverlay('<div class="modal wide" role="dialog" aria-label="Preview"><div class="modal-head"><b>' + esc(f.name) + '</b><div class="row"><button class="btn sm" data-act="download" data-fid="' + f.id + '">Save</button><button class="btn sm" data-act="closeov">Close</button></div></div><div class="modal-body">' + body + '</div></div>', 'center');
    });
  }
  function downloadFile(id) {
    DB.all().then(function (list) {
      var f = list.filter(function (x) { return x.id === id; })[0]; if (!f) return;
      var a = document.createElement('a'); a.href = URL.createObjectURL(f.blob); a.download = f.name; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
  }

  /* ---- notebook ---- */
  var nbQuery = '';
  function viewNotebook(sel) {
    var cur = S.journal.filter(function (j) { return j.id === sel; })[0];
    var q = nbQuery.toLowerCase();
    var free = S.journal.slice().sort(function (a, b) { return b.upd - a.upd; }).filter(function (j) { return !q || (j.title + ' ' + j.body).toLowerCase().indexOf(q) > -1; });
    var modNotes = MODS.filter(function (m) { var n = (S.notes[m.id] || '').trim(); return n && (!q || (m.title + ' ' + n).toLowerCase().indexOf(q) > -1); });
    var list = free.map(function (j) {
      return '<a class="nb-item ' + (cur && cur.id === j.id ? 'on' : '') + '" href="#/notebook/' + j.id + '"><b>' + esc(j.title || 'Untitled') + '</b><small>' + esc(j.body.replace(/[#*_`>\-\[\]]/g, '').slice(0, 140) || 'Empty note') + '</small></a>';
    }).join('') + (modNotes.length ? '<div class="nav-label" style="padding:10px 2px 2px">Module notes</div>' : '') + modNotes.map(function (m) {
      return '<a class="nb-item" href="#/module/' + m.id + '"><b>M' + m.num + ' · ' + esc(m.title) + '</b><small>' + esc(S.notes[m.id].replace(/[#*_`>\-\[\]]/g, '').slice(0, 140)) + '</small></a>';
    }).join('');
    post = function () {
      var s = $('#nbSearch'); if (s) s.addEventListener('input', function () { nbQuery = s.value; var pos = s.selectionStart; render(true); var n = $('#nbSearch'); n.focus(); n.setSelectionRange(pos, pos); });
      if (cur) {
        bindEditor('nb-' + cur.id, cur.body, function (v) { cur.body = v; cur.upd = Date.now(); bump(1); save(); });
        var t = $('#nbTitle'); if (t) t.addEventListener('input', function () { cur.title = t.value; cur.upd = Date.now(); save(); });
        loadFiles('nb-' + cur.id);
      }
    };
    return '<div class="page-head"><div><h1>Notebook</h1><p>Free-form notes, plus every note you wrote inside a module.</p></div><div class="row"><button class="btn" data-act="exportnotes">Export all (.md)</button><button class="btn primary" data-act="newnote">' + ic('plus') + ' New note</button></div></div>' +
      '<div class="nb-layout"><div><input type="text" id="nbSearch" placeholder="Search notes…" value="' + esc(nbQuery) + '" aria-label="Search notes" style="margin-bottom:10px"><div class="nb-list">' + (list || '<div class="empty">No notes yet. Create one, or write notes inside any module.</div>') + '</div></div>' +
      '<div>' + (cur ? '<div class="card pad"><div class="row spread"><input class="title-input" id="nbTitle" type="text" value="' + esc(cur.title) + '" placeholder="Note title" aria-label="Note title"><button class="btn sm danger" data-act="delnote" data-id="' + cur.id + '">Delete</button></div><div class="row" style="margin:4px 0 12px"><span class="saved" id="saved-nb-' + cur.id + '" style="margin-left:0"></span></div>' + editorHTML('nb-' + cur.id, 'Start writing… (Markdown supported)') +
        '<div class="section-title" style="margin-top:22px">Attachments <span class="chip" id="fileCount">0</span></div>' + dropHTML('nb-' + cur.id) + '<div class="files" id="files-nb-' + cur.id + '"></div></div>' : '<div class="empty" style="padding:70px 20px">Select a note on the left, or create a new one.</div>') + '</div></div>';
  }

  /* ---- files library ---- */
  var fileQuery = '', fileFilter = 'all', libDraw = null;
  function viewFiles() {
    libDraw = function () {
      DB.all().then(function (list) {
        var q = fileQuery.toLowerCase();
        list = list.filter(function (f) {
          if (q && (f.name + ' ' + (BYID[f.owner] ? BYID[f.owner].title : '')).toLowerCase().indexOf(q) === -1) return false;
          if (fileFilter === 'image') return f.type.indexOf('image/') === 0;
          if (fileFilter === 'doc') return f.type === 'application/pdf' || isText(f);
          if (fileFilter === 'other') return !(f.type.indexOf('image/') === 0 || f.type === 'application/pdf' || isText(f));
          return true;
        }).sort(function (a, b) { return b.ts - a.ts; });
        var g = $('#libGrid'); if (!g) return;
        revokeUrls();
        g.innerHTML = list.length ? list.map(function (f) { return fileCard(f, true); }).join('') : '<div class="empty" style="grid-column:1/-1">No files match. Drop some above - or upload from inside any module.</div>';
        var tot = list.reduce(function (a, f) { return a + f.size; }, 0), c = $('#libStat'); if (c) c.textContent = plural(list.length, 'file') + ' · ' + fmtSize(tot);
      });
    };
    post = function () {
      libDraw();
      var s = $('#fileSearch'); if (s) s.addEventListener('input', function () { fileQuery = s.value; libDraw(); });
    };
    return '<div class="page-head"><div><h1>Files</h1><p>Every upload from every module, in one place. <span id="libStat"></span></p></div></div>' +
      '<div class="card pad" style="margin-bottom:16px">' + dropHTML('lib') + '</div>' +
      '<div class="filters"><input type="text" id="fileSearch" placeholder="Search files…" value="' + esc(fileQuery) + '" style="max-width:300px" aria-label="Search files"><div class="seg">' +
      ['all', 'image', 'doc', 'other'].map(function (f) { return '<button data-act="filefilter" data-f="' + f + '" class="' + (fileFilter === f ? 'on' : '') + '">' + { all: 'All', image: 'Images', doc: 'Docs & code', other: 'Other' }[f] + '</button>'; }).join('') + '</div></div>' +
      '<div class="files" id="libGrid"></div>';
  }
  function viewFilesRefresh() { if (libDraw) libDraw(); }

  /* ---- settings ---- */
  function viewSettings() {
    post = function () {
      var el = $('#storageEst');
      if (el && navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (e) { el.textContent = fmtSize(e.usage || 0) + ' used' + (e.quota ? ' of ' + fmtSize(e.quota) : ''); });
    };
    var st = S.settings;
    return '<div class="page-head"><div><h1>Settings</h1><p>Everything is stored in this browser. Export regular backups.</p></div></div><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))">' +
      '<div class="card pad"><div class="section-title">Profile &amp; schedule</div>' +
      '<label class="field"><span>Your name</span><input type="text" data-act="set" data-k="name" value="' + esc(st.name) + '" placeholder="Optional"></label>' +
      '<label class="field"><span>Start date (used for pace tracking)</span><input type="date" data-act="set" data-k="startDate" value="' + st.startDate + '"></label>' +
      '<label class="field"><span>Daily goal (modules per day, no maximum)</span><input type="number" min="1" max="10" data-act="set" data-k="dailyGoal" value="' + st.dailyGoal + '"></label>' +
      '<label class="field"><span>Theme</span><select data-act="set" data-k="theme">' + ['auto', 'light', 'dark'].map(function (t) { return '<option value="' + t + '"' + (st.theme === t ? ' selected' : '') + '>' + t[0].toUpperCase() + t.slice(1) + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="card pad"><div class="section-title">Backup &amp; restore</div><p class="muted" style="margin-bottom:12px">Exports progress, notes, links and uploaded files into one JSON file. Browser storage can be cleared, so back up often.</p>' +
      '<div class="row wrap"><button class="btn primary" data-act="export">Export backup</button><label class="btn" style="cursor:pointer">Import backup<input type="file" accept="application/json,.json" hidden data-act="import"></label></div>' +
      '<p class="muted" style="font-size:13px;margin-top:12px">Storage: <span id="storageEst">…</span></p></div>' +
      '<div class="card pad"><div class="section-title">Danger zone</div><p class="muted" style="margin-bottom:12px">Permanently delete all progress, notes and files from this browser.</p><button class="btn danger" data-act="reset">Reset everything</button></div>' +
      '<div class="card pad"><div class="section-title">About</div><p class="muted">Curriculum adapted from <a href="' + CUR.source + '" target="_blank" rel="noopener noreferrer">How to Become a Robotics Engineer</a> (Technologiee). Resource links point to external sites; entries without a direct link open a web search. Hardware prices are from the article (Sept 2026) and may have changed.</p></div></div>';
  }

  /* ================================================================ ROUTER */
  var NAV = [['', 'Dashboard', 'home'], ['roadmap', 'Roadmap', 'map'], ['notebook', 'Notebook', 'note'], ['files', 'Files', 'file'], ['settings', 'Settings', 'gear']];
  function renderNav(route) {
    var html = NAV.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (route === n[0] ? 'active' : '') + '">' + ic(n[2]) + n[1] + '</a>'; }).join('');
    html += '<div class="nav-label">Months</div>' + MONTHS.map(function (mo) {
      return '<a href="#/roadmap/' + mo.n + '"><span style="width:10px;height:10px;border-radius:50%;background:' + mcol(mo.n) + ';margin:0 4px"></span>' + esc(mo.data.short) + '<span class="count">' + pct(doneCount(mo.mods), mo.mods.length) + '%</span></a>';
    }).join('');
    $('#nav').innerHTML = html;
    var d = totalDone();
    $('#sideProgress').innerHTML = '<b>' + d + '/' + TOTAL + '</b> modules<div class="bar" style="margin-top:8px"><i style="width:' + pct(d, TOTAL) + '%"></i></div>';
  }
  var cur = { route: '', arg: '' };
  function render(keepScroll) {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var route = parts[0] || '', arg = parts[1] || '', html;
    cur = { route: route, arg: arg }; post = null; revokeUrls();
    switch (route) {
      case 'roadmap': html = viewRoadmap(arg); break;
      case 'module': html = viewModule(arg); break;
      case 'notebook': html = viewNotebook(arg); break;
      case 'files': html = viewFiles(); break;
      case 'settings': html = viewSettings(); break;
      default: html = viewDashboard(); route = '';
    }
    $('#view').innerHTML = html;
    renderNav(route === 'module' ? 'roadmap' : route);
    updateTheme();
    if (post) post();
    tick();
    if (!keepScroll) window.scrollTo(0, 0);
  }
  function refresh() { var y = window.scrollY, ae = document.activeElement; render(true); window.scrollTo(0, y); }

  /* ================================================================ THEME / TIMER */
  function updateTheme() {
    var t = S.settings.theme, root = document.documentElement;
    if (t === 'light' || t === 'dark') root.dataset.theme = t; else delete root.dataset.theme;
    var dark = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    $('#themeBtn').innerHTML = ic(dark ? 'sun' : 'moon', 'width="19" height="19"');
  }
  function tick() {
    var chip = $('#timerChip');
    if (S.timer && BYID[S.timer.id]) {
      var el = (Date.now() - S.timer.start) / 1000;
      chip.hidden = false;
      chip.innerHTML = '<span class="dot"></span><a href="#/module/' + S.timer.id + '" style="color:inherit">M' + BYID[S.timer.id].num + ' · ' + fmtClock(el) + '</a><button data-act="timerstop" data-id="' + S.timer.id + '">Stop</button>';
    } else { chip.hidden = true; chip.innerHTML = ''; }
    var big = $('#modTimer'); if (big) big.textContent = fmtClock(modTime(big.dataset.id));
  }
  setInterval(function () { if (S.timer) tick(); }, 1000);

  /* ================================================================ SEARCH PALETTE */
  var palItems = [], palSel = 0;
  function buildIndex() {
    var items = [];
    MODS.forEach(function (m) {
      items.push({ type: 'Module', title: 'M' + m.num + ' · ' + m.title, sub: m.goal, hash: '#/module/' + m.id, hay: (m.title + ' ' + m.goal + ' ' + m.tasks.join(' ') + ' ' + m.res.map(function (r) { return r.label; }).join(' ') + ' ' + m.weekTitle).toLowerCase(), w: 3 });
      var n = (S.notes[m.id] || '').trim();
      if (n) items.push({ type: 'Note', title: 'Notes: ' + m.title, sub: n.slice(0, 120).replace(/\n/g, ' '), hash: '#/module/' + m.id, hay: n.toLowerCase(), w: 1 });
    });
    S.journal.forEach(function (j) { items.push({ type: 'Note', title: j.title || 'Untitled', sub: j.body.slice(0, 120).replace(/\n/g, ' '), hash: '#/notebook/' + j.id, hay: (j.title + ' ' + j.body).toLowerCase(), w: 1 }); });
    NAV.forEach(function (n) { items.push({ type: 'Page', title: n[1], sub: '', hash: '#/' + n[0], hay: n[1].toLowerCase(), w: 2 }); });
    return items;
  }
  function openPalette() {
    var idx = buildIndex();
    openOverlay('<div class="modal pal" role="dialog" aria-label="Search"><input type="text" id="palIn" placeholder="Search modules, tasks, notes, resources…" autocomplete="off" aria-label="Search"><div class="pal-list" id="palList"></div></div>');
    var input = $('#palIn');
    function run() {
      var terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      var res = idx.map(function (it) {
        if (!terms.length) return it.type === 'Module' && it.title.indexOf('· ') > -1 ? null : { it: it, s: 1 };
        var s = 0;
        for (var i = 0; i < terms.length; i++) { if (it.hay.indexOf(terms[i]) === -1) return null; s += it.title.toLowerCase().indexOf(terms[i]) > -1 ? 3 : 1; }
        return { it: it, s: s * it.w };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 40);
      if (!terms.length) res = res.concat(MODS.slice(0, 0));
      palItems = res.map(function (r) { return r.it; }); palSel = 0; drawPal();
    }
    input.addEventListener('input', run);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { palSel = Math.min(palItems.length - 1, palSel + 1); drawPal(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { palSel = Math.max(0, palSel - 1); drawPal(); e.preventDefault(); }
      else if (e.key === 'Enter' && palItems[palSel]) { location.hash = palItems[palSel].hash; closeOverlay(); }
    });
    run(); input.focus();
  }
  function drawPal() {
    var l = $('#palList'); if (!l) return;
    l.innerHTML = palItems.length ? palItems.map(function (it, i) {
      return '<a class="pal-item ' + (i === palSel ? 'sel' : '') + '" href="' + it.hash + '" data-act="closeov"><div><b>' + esc(it.title) + '</b>' + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</div><span class="type">' + it.type + '</span></a>';
    }).join('') : '<div class="empty" style="margin:8px">No matches.</div>';
    var s = $('.pal-item.sel', l); if (s) s.scrollIntoView({ block: 'nearest' });
  }

  /* ================================================================ BACKUP */
  function blobToDataURL(b) { return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(b); }); }
  function download(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' })); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function exportBackup() {
    toast('Preparing backup…');
    DB.all().then(function (list) {
      return Promise.all(list.map(function (f) { return blobToDataURL(f.blob).then(function (d) { return { id: f.id, owner: f.owner, name: f.name, type: f.type, size: f.size, ts: f.ts, data: d }; }); }));
    }).then(function (files) {
      download('robotics-path-backup-' + today() + '.json', JSON.stringify({ app: 'robotics-path', v: 1, state: S, files: files }), 'application/json');
      toast('Backup downloaded');
    });
  }
  function importBackup(file) {
    var r = new FileReader();
    r.onload = function () {
      var data; try { data = JSON.parse(r.result); } catch (e) { return toast('Not a valid backup file'); }
      if (!data || data.app !== 'robotics-path' || !data.state) return toast('Not a Robotics Path backup');
      if (!confirm('Replace ALL current progress, notes and files with this backup?')) return;
      var chain = DB.ok && DB.db ? DB.clear() : Promise.resolve();
      chain.then(function () {
        return Promise.all((data.files || []).map(function (f) {
          return fetch(f.data).then(function (x) { return x.blob(); }).then(function (b) { return DB.put({ id: f.id, owner: f.owner, name: f.name, type: f.type, size: f.size, ts: f.ts, blob: b }); });
        }));
      }).then(function () {
        S = Object.assign(defaults(), data.state); S.settings = Object.assign(defaults().settings, data.state.settings || {});
        save(); toast('Backup restored'); render();
      });
    };
    r.readAsText(file);
  }
  function exportNotes() {
    var out = '# Robotics Path - Notes\n\nExported ' + today() + '\n\n';
    S.journal.forEach(function (j) { out += '## ' + (j.title || 'Untitled') + '\n\n' + j.body + '\n\n'; });
    MODS.forEach(function (m) { var n = (S.notes[m.id] || '').trim(); if (n) out += '## Module ' + m.num + ': ' + m.title + '\n\n' + n + '\n\n'; });
    download('robotics-path-notes-' + today() + '.md', out, 'text/markdown');
  }

  /* ================================================================ EVENTS */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (t) {
      var a = t.dataset.act, id = t.dataset.id;
      switch (a) {
        case 'toggle': e.preventDefault(); e.stopPropagation(); toggleDone(id); refresh(); return;
        case 'completenext':
          toggleDone(id); var nx = MODS[BYID[id].idx + 1]; if (nx) location.hash = '#/module/' + nx.id; else refresh(); return;
        case 'filter': rmFilter = t.dataset.f; refresh(); return;
        case 'filefilter': fileFilter = t.dataset.f; $$('[data-act="filefilter"]').forEach(function (b) { b.classList.toggle('on', b === t); }); viewFilesRefresh(); return;
        case 'menu': $('#sidebar').classList.toggle('open'); return;
        case 'search': openPalette(); return;
        case 'theme':
          var dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
          S.settings.theme = dark ? 'light' : 'dark'; save(); updateTheme(); return;
        case 'timerstart': startTimer(id); render(true); return;
        case 'timerstop': stopTimer(); if (cur.route === 'module') render(true); return;
        case 'edtab':
          var ed = t.closest('.editor'), prev = t.dataset.tab === 'preview', ta = $('textarea', ed), pv = $('.preview', ed);
          $$('[data-act="edtab"]', ed).forEach(function (b) { b.classList.toggle('on', b === t); });
          if (prev) pv.innerHTML = md(ta.value);
          ta.hidden = prev; pv.hidden = !prev; $$('.tool', ed).forEach(function (b) { b.disabled = prev; b.style.opacity = prev ? .4 : 1; });
          return;
        case 'edtool': var ed2 = t.closest('.editor'); wrap($('textarea', ed2), t.dataset.b, t.dataset.a, t.dataset.p); return;
        case 'newnote':
          var n = { id: uid(), title: '', body: '', upd: Date.now() }; S.journal.push(n); save(); location.hash = '#/notebook/' + n.id; return;
        case 'delnote':
          if (!confirm('Delete this note and its attachments?')) return;
          DB.byOwner('nb-' + id).then(function (fs) { return Promise.all(fs.map(function (f) { return DB.del(f.id); })); }).then(function () {
            S.journal = S.journal.filter(function (j) { return j.id !== id; }); save(); location.hash = '#/notebook';
          }); return;
        case 'exportnotes': exportNotes(); return;
        case 'dellink': S.links[id].splice(+t.dataset.i, 1); save(); refresh(); return;
        case 'preview': previewFile(t.dataset.fid); return;
        case 'download': downloadFile(t.dataset.fid); return;
        case 'delfile':
          if (!confirm('Delete this file?')) return;
          DB.del(t.dataset.fid).then(function () { toast('File deleted'); if (cur.route === 'files') viewFilesRefresh(); else { var d = t.closest('.files'); if (d) loadFiles(d.id.replace('files-', '')); } }); return;
        case 'export': exportBackup(); return;
        case 'reset':
          if (!confirm('Delete ALL progress, notes and files? This cannot be undone.')) return;
          if (!confirm('Really reset everything? Consider exporting a backup first.')) return;
          (DB.ok && DB.db ? DB.clear() : Promise.resolve()).then(function () { S = defaults(); save(); toast('Everything was reset'); location.hash = '#/'; render(); }); return;
        case 'closeov': closeOverlay(); return;
      }
    }
    var drop = e.target.closest('.drop');
    if (drop && e.target.tagName !== 'INPUT') { var inp = $('input', drop); if (inp) inp.click(); return; }
    if (e.target.id === 'overlay') { closeOverlay(); return; }
    var card = e.target.closest('[data-href]');
    if (card && !e.target.closest('a,button')) { location.hash = card.dataset.href; return; }
    if (window.innerWidth <= 820 && !e.target.closest('#sidebar') && !e.target.closest('[data-act="menu"]')) $('#sidebar').classList.remove('open');
  });

  document.addEventListener('change', function (e) {
    var t = e.target, a = t.dataset && t.dataset.act;
    if (!a) { if (t.matches('.drop input')) { var d = t.closest('.drop'); addFiles(d.dataset.owner, t.files, afterUpload); t.value = ''; } return; }
    if (a === 'task') {
      toggleTask(t.dataset.id, +t.dataset.i);
      var m = BYID[t.dataset.id], n = taskDone(m);
      t.closest('.task').classList.toggle('on', t.checked);
      $('#taskChip').textContent = n + '/' + m.tasks.length; $('#taskBar').style.width = pct(n, m.tasks.length) + '%';
    } else if (a === 'gear') { S.gear[t.dataset.key] = t.checked; save(); }
    else if (a === 'donedate') { if (t.value) { S.done[t.dataset.id] = t.value; save(); toast('Date updated'); } }
    else if (a === 'set') {
      var k = t.dataset.k, v = t.value;
      if (k === 'dailyGoal') v = Math.max(1, Math.min(10, parseInt(v, 10) || 1));
      if (k === 'startDate' && !v) return;
      S.settings[k] = v; save(); if (k === 'theme') updateTheme(); toast('Saved');
    } else if (a === 'import') { if (t.files[0]) importBackup(t.files[0]); t.value = ''; }
  });
  function afterUpload() { if (cur.route === 'files') viewFilesRefresh(); else { var g = $('.files[id^="files-"]'); if (g) loadFiles(g.id.replace('files-', '')); } }

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('form[data-act="addlink"]'); if (!f) return;
    e.preventDefault();
    var u = f.u.value.trim(); if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try { new URL(u); } catch (er) { return toast('That does not look like a valid URL'); }
    var id = f.dataset.id; (S.links[id] = S.links[id] || []).push({ t: f.t.value.trim(), u: u }); bump(1); save(); refresh();
  });

  ['dragover', 'dragenter'].forEach(function (ev) { document.addEventListener(ev, function (e) { var d = e.target.closest && e.target.closest('.drop'); if (d) { e.preventDefault(); d.classList.add('over'); } }); });
  ['dragleave', 'drop'].forEach(function (ev) { document.addEventListener(ev, function (e) { var d = e.target.closest && e.target.closest('.drop'); if (d) { d.classList.remove('over'); if (ev === 'drop') { e.preventDefault(); if (e.dataTransfer.files.length) addFiles(d.dataset.owner, e.dataTransfer.files, afterUpload); } } }); });
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) { e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if ($('#overlay').hidden) openPalette(); else closeOverlay(); }
    else if (e.key === 'Escape' && !$('#overlay').hidden) closeOverlay();
    else if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('drop')) { var i = $('input', e.target); if (i) i.click(); }
  });
  window.addEventListener('hashchange', function () { closeOverlay(); $('#sidebar').classList.remove('open'); render(); });
  window.addEventListener('beforeunload', function () { var ta = document.querySelector('.editor textarea'); var ed = ta && ta.closest('.editor'); if (ed && ed._flush) { ed._flush(); } save(); });
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
  window.addEventListener('storage', function (e) { if (e.key === LS && e.newValue) { try { S = Object.assign(defaults(), JSON.parse(e.newValue)); render(true); } catch (er) {} } });

  /* ================================================================ BOOT */
  save();
  DB.open().then(function () { render(); });
  window.__RP = { MODS: MODS, TOTAL: TOTAL };
})();
