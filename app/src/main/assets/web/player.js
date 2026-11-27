(function () {
  'use strict';
  var X = FIX, THEMES = FIXTHEMES;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { } }
  };
  var WIRE_CSS = { RED: '#e5392c', BLUE: '#2f6fe0', YELLOW: '#f5c518', WHITE: '#f4f4f4', BLACK: '#141414' };
  var LAMP_CSS = { GREEN: '#35c66f', AMBER: '#ffb000', RED: '#e5392c', BLUE: '#3fa0ff' };
  var ORDER = ['ideation', 'mvp', 'pivot', 'launch', 'ece', 'envi'];

  var ID = store.get('fx-id');
  if (!ID) { ID = 'p' + Math.random().toString(36).slice(2) + Date.now().toString(36); store.set('fx-id', ID); }
  var session = null;
  try { session = JSON.parse(store.get('fx-session') || 'null'); } catch (e) { }
  var pick = (session && session.program) || store.get('fx-program') || '';

  var es = null, view = null, offset = 0, T = null, R = null, screen = '', bodyKey = '', muted = false, endArm = 0;
  var local = null; // Product Lead's own module progress for the current sprint
  var lastPhaseKey = '';

  function now() { return Date.now() + offset; }
  function race(ms) { var s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); }
  function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function clock(ms) { var d = new Date(ms); return [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (x) { return String(x).padStart(2, '0'); }).join(':'); }
  function show(id) {
    if (screen === id) return;
    screen = id;
    ['sJoin', 'sLobby', 'sPlay', 'sOver'].forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }
  function post(path, body) {
    return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }
  function act(type, extra) {
    var b = { room: session.room, id: ID, type: type };
    for (var k in extra || {}) b[k] = extra[k];
    return post('/api/act', b).catch(function () { });
  }
  function svg(i) { return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + T.symbols[i] + '</svg>'; }
  function mmss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function applyTheme(prog) {
    T = THEMES[prog] || null;
    var c = T ? T.colors : { bg: '#14161a', plate: '#20242b', plate2: '#2a2f37', edge: '#3d444e', ink: '#eef0f2', dim: '#a0a8b2', accent: '#ffc21a', accentInk: '#1a1400', accent2: '#7fd3ff' };
    var st = document.documentElement.style;
    for (var k in c) st.setProperty('--' + k, c[k]);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', c.bg);
  }

  // ------------------------------------------------------------ sound, buzz, toast, wake
  var actx = null;
  function audioInit() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { actx = null; } }
  function tone(f, d, type, vol, when) {
    if (muted || !actx) return;
    try {
      var t0 = actx.currentTime + (when || 0), o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(vol || 0.06, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + d + 0.03);
    } catch (e) { }
  }
  function sfx(k) {
    if (k === 'click') tone(900, .04, 'square', .03);
    if (k === 'good') tone(1046, .12, 'triangle', .09);
    if (k === 'fault') tone(180, .35, 'sawtooth', .08);
    if (k === 'win') { tone(523, .1, 'triangle', .09); tone(659, .1, 'triangle', .09, .12); tone(784, .3, 'triangle', .09, .24); }
    if (k === 'lose') { tone(320, .3, 'sawtooth', .08); tone(220, .5, 'sawtooth', .08, .3); }
    if (k === 'tick') tone(1400, .03, 'square', .03);
    if (k === 'start') { tone(440, .08, 'square', .05); tone(660, .12, 'square', .05, .1); }
  }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { } }
  var toastTimer = 0;
  function toast(type, text) {
    var t = $('toast'); t.className = 'toast show ' + type; t.textContent = text;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.className = 'toast ' + type; }, 2200);
  }
  var lock = null;
  function wake() { try { if (navigator.wakeLock && !lock) navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); }).catch(function () { }); } catch (e) { } }
  document.addEventListener('visibilitychange', function () { if (!document.hidden && session) wake(); });

  // ------------------------------------------------------------ join
  function renderPrograms() {
    $('jPrograms').innerHTML = ORDER.map(function (p) {
      var t = THEMES[p];
      return '<button type="button" data-p="' + p + '" class="' + (pick === p ? 'sel' : '') + '" style="--pc:' + t.colors.accent + '"><i></i><b>' + esc(t.title) + '</b><span>' + esc(t.program) + '</span></button>';
    }).join('');
  }
  $('jPrograms').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-p]'); if (!b) return;
    pick = b.dataset.p; store.set('fx-program', pick); renderPrograms();
  });
  $('jTeam').addEventListener('input', function () { var v = this.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); if (v !== this.value) this.value = v; });$('joinForm').addEventListener('submit', function (e) {
    e.preventDefault(); audioInit();
    join($('jName').value.trim(),$('jTeam').value.trim(), pick);
  });
  function join(name, team, program) {
    $('jErr').textContent = '';
    if (!program) { $('jErr').textContent = 'Pick your track or program.'; show('sJoin'); return; }
    if (!name) { $('jErr').textContent = 'Type your name.'; show('sJoin'); return; }
    if (team.length < 2) { $('jErr').textContent = 'Type a team code (at least 2 letters or numbers).'; show('sJoin'); return; }$('jBtn').disabled = true;
    post('/api/join', { id: ID, name: name, team: team, program: program }).then(function (r) {
      $('jBtn').disabled = false;
      if (!r.ok) { $('jErr').textContent = r.error || 'Could not join.'; show('sJoin'); return; }
      session = { room: r.room, name: name, team: team, program: r.program };
      store.set('fx-session', JSON.stringify(session)); store.set('fx-name', name); store.set('fx-team', team);
      if (r.program !== program) toast('warn', 'Team ' + r.room + ' is playing ' + THEMES[r.program].title + '.');
      connect();
    }).catch(function () {
      $('jBtn').disabled = false;
      $('jErr').textContent = 'Can\'t reach the host phone. Check you\'re on its hotspot or the same Wi-Fi.';
      show('sJoin');
    });
  }
  function toJoin(msg) {
    if (es) { es.close(); es = null; }
    session = null; store.del('fx-session'); view = null; bodyKey = '';
    applyTheme(null); renderPrograms(); show('sJoin');
    $('jErr').textContent = msg || '';
  }

  // ------------------------------------------------------------ live connection
  function connect() {
    if (es) es.close();
    es = new EventSource('/events?room=' + encodeURIComponent(session.room) + '&id=' + encodeURIComponent(ID));
    es.onmessage = function (e) {
      $('conn').hidden = true;
      var v; try { v = JSON.parse(e.data); } catch (err) { return; }
      offset = v.now - Date.now(); view = v;
      render();
    };
    es.addEventListener('gone', function () {
      if (session) { var s = session; es.close(); es = null; join(s.name, s.team, s.program); }
    });
    es.addEventListener('closed', function () { toJoin('Your instructor closed this team. Join again with a team code.'); });
    es.onerror = function () { $('conn').hidden = false; };
  }

  // ------------------------------------------------------------ render
  function render() {
    var r = view.room;
    if (!T || T.id !== r.program) applyTheme(r.program);
    if (r.state === 'lobby') return renderLobby();
    if (r.state === 'over') return renderOver();
    renderPlay();
  }

  function renderLobby() {
    var r = view.room;
    show('sLobby');
    $('lProg').textContent = 'Team · ' + T.title + ' · ' + T.program;
    $('lTeam').textContent = r.key;
    $('lTag').textContent = T.tagline;
    var online = r.players.filter(function (p) { return p.online; }).length;
    $('lCount').textContent = online + ' online';$('lRoster').innerHTML = r.players.map(function (p) {
      var me = p.station === view.me.station;
      return '<div class="crew"><span class="nm">' + esc(p.name) + (me ? ' <span class="label">(you)</span>' : '') + '</span><span class="tag ' + (p.online ? 'on' : 'off') + '">' + (p.online ? 'ready' : 'offline') + '</span></div>';
    }).join('');
    $('lStart').disabled = online < 2;
    $('lNote').textContent = online < 2 ? 'Waiting for teammates. They join with team code ' + r.key + ' on the same Wi-Fi or hotspot.'
      : 'Goal: validate ' + r.target + ' sprints in one game. Best with 3 to 6. Start when everyone is in; anyone on the team can press Start.';
  }
  $('lStart').addEventListener('click', function () { audioInit(); wake(); act('start'); });$('lLeave').addEventListener('click', function () { act('leave'); toJoin(''); });

  function round() {
    var r = view.room;
    if (!R || R.k !== r.k || R._seed !== r.seed) { R = X.buildRound(T, r.key, r.n, r.seed, r.round, r.k); R._seed = r.seed; }
    return R;
  }
  function localState() {
    var r = view.room, key = 'fx-op-' + r.key + '-' + r.seed + '-' + r.k;
    if (!local || local.key !== key) {
      try { local = JSON.parse(store.get(key) || 'null'); } catch (e) { local = null; }
      if (!local) {
        local = { key: key, cut: {}, keys: {}, proc: {}, sw: {}, done: {}, faults: 0 };
        R.modules.forEach(function (m, i) { if (m.type === 'switches') local.sw[i] = m.init.slice(); });
      }
    }
    return local;
  }
  function saveLocal() { if (local) store.set(local.key, JSON.stringify(local)); }

  function renderPlay() {
    var r = view.room, me = view.me;
    show('sPlay');
    round();
    var opIdx = r.operator, isOp = me.station === opIdx;
    var opName = (r.players.filter(function (p) { return p.station === opIdx; })[0] || {}).name || ('Station ' + (opIdx + 1));
    $('pTitle').textContent = T.title;
    $('pStn').textContent = 'Stn ' + (me.station + 1) + '/' + r.n;
    $('pRound').innerHTML = '<small>Goal: validate ' + r.target + ' · validated ' + r.fixed + ' · race <span id="raceClk">' + race(now() - r.raceStart) + '</span></small>Round ' + r.round;
    var lv = ''; for (var i = 0; i < X.LIVES; i++) lv += '<i class="' + (i < r.lives ? '' : 'lost') + '"></i>';
    $('pLives').
