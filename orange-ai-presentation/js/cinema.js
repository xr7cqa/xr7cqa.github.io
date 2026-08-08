/* ============================================================
   الشريحة 09 — مشهد سينمائي على Canvas
   خط فرز يتحرك: كاميرا، شعاع فحص، إطار تحديد، تصنيف، قرار،
   آلية فرز جانبية، ثم لوحة نتائج. المدة قرابة 19 ثانية.
   ============================================================ */
(function () {
  'use strict';

  var DUR = 18.8; /* ثانية */
  var V = 230; /* وحدة عالمية في الثانية */
  var WW = 1600;
  var START_X = 1780;
  var EXIT_X = -150;
  var EJECT_X = 470;
  var ZONE_IN = 1130;
  var ZONE_OUT = 940;
  var FLIGHT = 1.05;

  var C = {
    beltTop: '#28513d',
    beltBody: '#173a2c',
    beltDark: '#0d2419',
    steel: 'rgba(220,232,221,0.55)',
    steelSoft: 'rgba(220,232,221,0.22)',
    cream: '#f6f1e6',
    creamSoft: 'rgba(246,241,230,0.62)',
    orange: '#e8892d',
    green: '#6fbf8b',
    reject: '#e0653a',
    panel: 'rgba(9,24,17,0.86)'
  };

  var TYPES = {
    sound: { label: 'سليمة', decision: 'قبول', kind: 'accept', rs: 1.0, c: ['#ffc879', '#ef9330', '#bf631a'], leaf: true },
    unripe: { label: 'غير ناضجة', decision: 'مراجعة', kind: 'review', rs: 0.97, c: ['#e2e493', '#a8b64f', '#63701f'], leaf: true },
    small: { label: 'صغيرة', decision: 'مراجعة', kind: 'review', rs: 0.6, c: ['#ffc879', '#ef9330', '#bf631a'], leaf: false },
    rotten: { label: 'تالفة', decision: 'استبعاد', kind: 'reject', rs: 0.96, c: ['#c6a071', '#8a6231', '#4a361a'], blotch: true },
    defect: { label: 'عيب ظاهري', decision: 'استبعاد', kind: 'reject', rs: 1.0, c: ['#ffc879', '#ef9330', '#bf631a'], scar: true }
  };

  var PLAN = [
    { t: 0.5, k: 'sound' },
    { t: 2.0, k: 'unripe' },
    { t: 3.5, k: 'rotten' },
    { t: 5.0, k: 'small' },
    { t: 6.5, k: 'defect' },
    { t: 8.0, k: 'sound' }
  ];

  var canvas, ctx, stage, raf = null, t0 = 0, running = false, frozenT = null;
  var cssW = 0, cssH = 0, scale = 1, WH = 700, dpr = 1;
  var L = {};

  /* ---------- أدوات ---------- */

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function easeOut(x) {
    return 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  }

  function rr(x, y, w, h, r) {
    var m = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + m, y);
    ctx.lineTo(x + w - m, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + m);
    ctx.lineTo(x + w, y + h - m);
    ctx.quadraticCurveTo(x + w, y + h, x + w - m, y + h);
    ctx.lineTo(x + m, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - m);
    ctx.lineTo(x, y + m);
    ctx.quadraticCurveTo(x, y, x + m, y);
    ctx.closePath();
  }

  function font(px, weight) {
    return (weight || 700) + ' ' + px + 'px Cairo, "Noto Sans Arabic", Tahoma, sans-serif';
  }

  function fs(kind) {
    /* أحجام النص محسوبة بالبكسل الفعلي ثم تحول لوحدات المشهد */
    var base = clamp(Math.min(cssW * 0.022, cssH * 0.075), 13, 30);
    var mult = kind === 'big' ? 1.28 : kind === 'small' ? 0.82 : 1;
    return (base * mult) / scale;
  }

  /* ---------- القياسات ---------- */

  function layout() {
    WH = (cssH / cssW) * WW;
    L.beltTop = WH * 0.54;
    L.beltH = WH * 0.085;
    L.beltBottom = L.beltTop + L.beltH;
    L.r = Math.min(WH * 0.07, 50);
    L.camX = 1035;
    L.camLens = WH * 0.24;
    L.binTop = WH * 0.755;
    L.binH = WH * 0.165;
    L.binCx = 235;
    L.binW = 330;
    L.ground = WH * 0.965;
  }

  /* ---------- حالة المشهد عند لحظة معينة ---------- */

  function fruitState(p, t) {
    var ty = TYPES[p.k];
    var st = {
      type: ty,
      r: L.r * ty.rs,
      alive: false,
      x: 0,
      y: 0,
      phase: 0,
      inBin: false,
      ejected: false
    };
    if (t < p.t) return st;

    var tEject = p.t + (START_X - EJECT_X) / V;
    var isReject = ty.kind === 'reject';

    if (!isReject || t <= tEject) {
      var x = START_X - V * (t - p.t);
      if (x < EXIT_X) return st;
      st.alive = true;
      st.x = x;
      st.y = L.beltTop - st.r;
      st.phase = clamp((ZONE_IN - x) / (ZONE_IN - ZONE_OUT), 0, 1);
      return st;
    }

    /* بعد تشغيل آلية الفرز: مسار جانبي إلى الحاوية */
    st.alive = true;
    st.ejected = true;
    st.phase = 1;
    var u = clamp((t - tEject) / FLIGHT, 0, 1);
    var bx = p.binX;
    var p0x = EJECT_X, p0y = L.beltTop - st.r;
    var p2x = bx, p2y = L.binTop + L.binH * 0.42;
    var p1x = (p0x + p2x) / 2, p1y = p0y - WH * 0.16;
    var mu = 1 - u;
    st.x = mu * mu * p0x + 2 * mu * u * p1x + u * u * p2x;
    st.y = mu * mu * p0y + 2 * mu * u * p1y + u * u * p2y;
    st.inBin = u >= 1;
    return st;
  }

  /* ---------- الرسم ---------- */

  function drawBackdrop() {
    var g = ctx.createLinearGradient(0, 0, WW * 0.35, WH);
    g.addColorStop(0, '#16382a');
    g.addColorStop(0.55, '#102b20');
    g.addColorStop(1, '#0a1d15');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WW, WH);

    /* هيكل مصنع خلفي */
    ctx.strokeStyle = 'rgba(220,232,221,0.07)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (var i = 0; i < 7; i++) {
      var x = 90 + i * 240;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, L.beltTop - 10);
    }
    ctx.moveTo(0, WH * 0.16);
    ctx.lineTo(WW, WH * 0.16);
    ctx.moveTo(0, WH * 0.28);
    ctx.lineTo(WW, WH * 0.28);
    ctx.stroke();

    /* وهج برتقالي خفيف حول منطقة الفحص */
    var rg = ctx.createRadialGradient(L.camX, L.beltTop, 10, L.camX, L.beltTop, WH * 0.62);
    rg.addColorStop(0, 'rgba(232,137,45,0.18)');
    rg.addColorStop(1, 'rgba(232,137,45,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, WW, WH);
  }

  function drawBelt(t) {
    var y = L.beltTop, h = L.beltH;

    /* أرضية */
    var fg = ctx.createLinearGradient(0, L.ground - WH * 0.05, 0, WH);
    fg.addColorStop(0, 'rgba(8,22,16,0)');
    fg.addColorStop(1, 'rgba(8,22,16,0.75)');
    ctx.fillStyle = fg;
    ctx.fillRect(0, L.ground - WH * 0.05, WW, WH * 0.05 + WH);
    ctx.strokeStyle = 'rgba(220,232,221,0.12)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, L.ground);
    ctx.lineTo(WW, L.ground);
    ctx.stroke();

    /* أرجل */
    ctx.fillStyle = 'rgba(220,232,221,0.14)';
    [900, 1290, 1560].forEach(function (x) {
      ctx.fillRect(x, y + h, 15, L.ground - (y + h));
    });

    /* جسم السير */
    var g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, C.beltTop);
    g.addColorStop(1, C.beltBody);
    ctx.fillStyle = g;
    rr(-60, y, WW + 120, h, h * 0.4);
    ctx.fill();

    /* أشرطة متحركة */
    var sp = 74;
    var off = (t * V) % sp;
    ctx.strokeStyle = 'rgba(220,232,221,0.24)';
    ctx.lineWidth = Math.max(3, h * 0.1);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (var x = WW + sp; x > -sp * 2; x -= sp) {
      var px = x - off;
      ctx.moveTo(px, y + h * 0.3);
      ctx.lineTo(px, y + h * 0.75);
    }
    ctx.stroke();

    /* حافة سفلية */
    ctx.fillStyle = C.beltDark;
    rr(-60, y + h, WW + 120, h * 0.42, h * 0.2);
    ctx.fill();

    /* بكرات الطرفين */
    ctx.strokeStyle = C.steelSoft;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(-20, y + h / 2, h * 0.62, 0, Math.PI * 2);
    ctx.arc(WW + 20, y + h / 2, h * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCamera(t, active) {
    var x = L.camX, ly = L.camLens;
    var bodyH = WH * 0.125, bodyW = 190;

    /* حامل */
    ctx.fillStyle = C.steelSoft;
    rr(x - 9, 0, 18, ly - bodyH * 0.5, 8);
    ctx.fill();
    rr(x - 150, 0, 300, 16, 8);
    ctx.fill();

    /* مخروط الضوء */
    var beamA = active ? 0.2 : 0.1;
    var bg = ctx.createLinearGradient(0, ly, 0, L.beltTop);
    bg.addColorStop(0, 'rgba(246,241,230,' + beamA + ')');
    bg.addColorStop(1, 'rgba(246,241,230,0)');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(x - 70, ly + bodyH * 0.4);
    ctx.lineTo(ZONE_OUT - 40, L.beltTop + 4);
    ctx.lineTo(ZONE_IN + 40, L.beltTop + 4);
    ctx.lineTo(x + 70, ly + bodyH * 0.4);
    ctx.closePath();
    ctx.fill();

    /* جسم الكاميرا */
    ctx.fillStyle = '#1b2f26';
    rr(x - bodyW / 2, ly - bodyH * 0.55, bodyW, bodyH, 18);
    ctx.fill();
    ctx.strokeStyle = C.steelSoft;
    ctx.lineWidth = 4;
    rr(x - bodyW / 2, ly - bodyH * 0.55, bodyW, bodyH, 18);
    ctx.stroke();

    ctx.fillStyle = 'rgba(63,118,84,0.9)';
    rr(x - bodyW / 2 + 22, ly - bodyH * 0.34, 74, bodyH * 0.2, 8);
    ctx.fill();

    ctx.fillStyle = active ? C.orange : 'rgba(232,137,45,0.4)';
    ctx.beginPath();
    ctx.arc(x + bodyW / 2 - 26, ly - bodyH * 0.22, 9, 0, Math.PI * 2);
    ctx.fill();

    /* العدسة */
    ctx.fillStyle = '#0b1b14';
    ctx.beginPath();
    ctx.arc(x, ly + bodyH * 0.5, WH * 0.048, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C.steelSoft;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = active ? 'rgba(232,137,45,0.5)' : 'rgba(63,118,84,0.45)';
    ctx.beginPath();
    ctx.arc(x, ly + bodyH * 0.5, WH * 0.025, 0, Math.PI * 2);
    ctx.fill();

    label('كاميرا الفحص', x, ly - bodyH * 0.72, C.creamSoft, 'small');

    /* بيان منطقة الفحص أسفل السير */
    var by = L.beltTop + L.beltH * 2.1;
    ctx.strokeStyle = 'rgba(232,137,45,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ZONE_OUT - 40, by - 14);
    ctx.lineTo(ZONE_OUT - 40, by);
    ctx.lineTo(ZONE_IN + 40, by);
    ctx.lineTo(ZONE_IN + 40, by - 14);
    ctx.stroke();
    label('منطقة الفحص', (ZONE_IN + ZONE_OUT) / 2, by + fs('small') * 1.1, C.creamSoft, 'small');
  }

  function drawScanLine(t, active) {
    if (!active) return;
    var xs = (ZONE_IN + ZONE_OUT) / 2;
    var g = ctx.createLinearGradient(xs, L.camLens, xs, L.beltTop);
    g.addColorStop(0, 'rgba(232,137,45,0)');
    g.addColorStop(0.35, 'rgba(232,137,45,0.75)');
    g.addColorStop(1, 'rgba(232,137,45,0.95)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(xs, L.camLens + WH * 0.05);
    ctx.lineTo(xs, L.beltTop + 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(232,137,45,0.28)';
    ctx.beginPath();
    ctx.ellipse(xs, L.beltTop + 2, 34, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFruit(st) {
    var x = st.x, y = st.y, r = st.r, ty = st.type;

    /* ظل */
    if (!st.ejected) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(x, L.beltTop + 6, r * 0.85, r * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    var g = ctx.createRadialGradient(x - r * 0.34, y - r * 0.34, r * 0.12, x, y, r * 1.05);
    g.addColorStop(0, ty.c[0]);
    g.addColorStop(0.5, ty.c[1]);
    g.addColorStop(1, ty.c[2]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    /* مسام */
    ctx.fillStyle = 'rgba(90,45,10,0.18)';
    var pts = [[0.3, 0.16], [0.52, -0.2], [-0.1, 0.5], [-0.5, 0.18], [0.14, -0.55], [0.62, 0.36]];
    for (var i = 0; i < pts.length; i++) {
      ctx.beginPath();
      ctx.arc(x + pts[i][0] * r, y + pts[i][1] * r, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    if (ty.blotch) {
      ctx.fillStyle = 'rgba(38,26,12,0.62)';
      ctx.beginPath();
      ctx.ellipse(x + r * 0.22, y + r * 0.2, r * 0.42, r * 0.34, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x - r * 0.36, y - r * 0.28, r * 0.24, r * 0.18, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (ty.scar) {
      ctx.strokeStyle = 'rgba(70,40,14,0.75)';
      ctx.lineWidth = r * 0.14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - r * 0.1, y - r * 0.45);
      ctx.quadraticCurveTo(x + r * 0.3, y - r * 0.05, x + r * 0.05, y + r * 0.42);
      ctx.stroke();
      ctx.fillStyle = 'rgba(70,40,14,0.45)';
      ctx.beginPath();
      ctx.ellipse(x + r * 0.36, y + r * 0.12, r * 0.2, r * 0.15, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    /* لمعة */
    ctx.save();
    ctx.translate(x - r * 0.34, y - r * 0.38);
    ctx.rotate(-0.5);
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.32, r * 0.19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (ty.leaf) {
      ctx.fillStyle = '#3f7654';
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x + r * 0.26, y - r * 1.34, x + r * 0.62, y - r * 1.22);
      ctx.quadraticCurveTo(x + r * 0.5, y - r * 0.86, x, y - r);
      ctx.fill();
    }
  }

  function drawBox(st) {
    var p = st.phase;
    if (p <= 0.02 || st.ejected) return;
    var e = easeOut(p / 0.9);
    var r = st.r * (1.42 - 0.18 * e);
    var x = st.x, y = st.y;
    var a = clamp(p * 1.6, 0, 1);
    var arm = r * 0.55;

    ctx.strokeStyle = 'rgba(232,137,45,' + a + ')';
    ctx.lineWidth = Math.max(3, L.r * 0.075);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    var corners = [
      [x - r, y - r, 1, 1],
      [x + r, y - r, -1, 1],
      [x - r, y + r, 1, -1],
      [x + r, y + r, -1, -1]
    ];
    ctx.beginPath();
    for (var i = 0; i < corners.length; i++) {
      var c = corners[i];
      ctx.moveTo(c[0] + c[2] * arm, c[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(c[0], c[1] + c[3] * arm);
    }
    ctx.stroke();

    /* خط المسح داخل الإطار أثناء الفحص */
    if (p < 1) {
      ctx.strokeStyle = 'rgba(232,137,45,0.85)';
      ctx.lineWidth = Math.max(2, L.r * 0.05);
      var sy = y - r + 2 * r * p;
      ctx.beginPath();
      ctx.moveTo(x - r, sy);
      ctx.lineTo(x + r, sy);
      ctx.stroke();
    }
  }

  function chip(text, cx, cy, bg, fg, size) {
    var px = fs(size || 'normal');
    ctx.font = font(px, 700);
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var w = ctx.measureText(text).width + px * 1.5;
    var h = px * 1.85;
    ctx.fillStyle = bg;
    rr(cx - w / 2, cy - h / 2, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.fillText(text, cx, cy + px * 0.06);
    return { w: w, h: h };
  }

  function label(text, cx, cy, color, size) {
    var px = fs(size || 'normal');
    ctx.font = font(px, 700);
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
  }

  function drawTags(st) {
    if (st.ejected) return;
    var p = st.phase;
    if (p < 0.72) return;
    var r = st.r * 1.32;
    var a = clamp((p - 0.72) / 0.28, 0, 1);
    ctx.globalAlpha = a;
    chip(st.type.label, st.x, st.y - r - fs() * 1.5, 'rgba(9,24,17,0.9)', C.cream);
    ctx.globalAlpha = 1;

    if (st.x <= 880) {
      var da = clamp((880 - st.x) / 90, 0, 1);
      var col =
        st.type.kind === 'accept' ? C.green : st.type.kind === 'review' ? C.orange : C.reject;
      ctx.globalAlpha = da;
      chip(
        st.type.decision,
        st.x,
        st.y + r + fs() * 1.5,
        'rgba(9,24,17,0.9)',
        col,
        'small'
      );
      ctx.globalAlpha = 1;
    }
  }

  function drawEjector(t) {
    var x = EJECT_X;
    var pivotX = x + 46;
    var pivotY = L.beltTop - WH * 0.2;
    var ext = 0;

    for (var i = 0; i < PLAN.length; i++) {
      var p = PLAN[i];
      if (TYPES[p.k].kind !== 'reject') continue;
      var te = p.t + (START_X - EJECT_X) / V;
      var d = t - (te - 0.24);
      if (d > 0 && d < 0.78) ext = Math.max(ext, Math.sin((d / 0.78) * Math.PI));
    }

    /* عمود التثبيت */
    ctx.fillStyle = 'rgba(220,232,221,0.28)';
    rr(pivotX - 9, WH * 0.115, 18, pivotY - WH * 0.135, 8);
    ctx.fill();

    /* جسم المحرك */
    ctx.fillStyle = '#1b2f26';
    rr(pivotX - 34, pivotY - WH * 0.045, 68, WH * 0.075, 12);
    ctx.fill();
    ctx.strokeStyle = C.steelSoft;
    ctx.lineWidth = 4;
    rr(pivotX - 34, pivotY - WH * 0.045, 68, WH * 0.075, 12);
    ctx.stroke();

    /* الذراع الدوارة */
    var armLen = WH * 0.2;
    var idle = -Math.PI * 0.32;
    var fire = -Math.PI * 0.94;
    var ang = idle + ext * (fire - idle);
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(ang);
    ctx.fillStyle = ext > 0.06 ? C.orange : 'rgba(220,232,221,0.62)';
    rr(0, -WH * 0.014, armLen, WH * 0.028, WH * 0.014);
    ctx.fill();
    ctx.fillStyle = ext > 0.06 ? '#ffb262' : 'rgba(220,232,221,0.8)';
    rr(armLen - WH * 0.02, -WH * 0.042, WH * 0.03, WH * 0.084, 8);
    ctx.fill();
    ctx.restore();

    /* محور الدوران */
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, WH * 0.017, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b2f26';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, WH * 0.008, 0, Math.PI * 2);
    ctx.fill();

    label('آلية الفرز', pivotX, WH * 0.075, C.creamSoft, 'small');
  }

  function drawBin(t) {
    var x = L.binCx, w = L.binW, y = L.binTop, h = L.binH;

    /* منزلق مائل من حافة السير إلى الحاوية */
    ctx.strokeStyle = 'rgba(220,232,221,0.3)';
    ctx.lineWidth = WH * 0.02;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(EJECT_X - 10, L.beltTop + L.beltH * 1.3);
    ctx.lineTo(x + w / 2 - 8, y - 8);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(232,137,45,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(EJECT_X - 10, L.beltTop + L.beltH * 1.3);
    ctx.lineTo(x + w / 2 - 8, y - 8);
    ctx.stroke();

    /* صندوق المستبعد */
    ctx.fillStyle = 'rgba(10,28,20,0.92)';
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w / 2 - w * 0.09, y + h);
    ctx.lineTo(x - w / 2 + w * 0.09, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(224,101,58,0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(220,232,221,0.16)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + w * 0.035, y + h * 0.38);
    ctx.lineTo(x + w / 2 - w * 0.035, y + h * 0.38);
    ctx.moveTo(x - w / 2 + w * 0.062, y + h * 0.7);
    ctx.lineTo(x + w / 2 - w * 0.062, y + h * 0.7);
    ctx.stroke();

    ctx.fillStyle = 'rgba(224,101,58,0.85)';
    rr(x - w / 2 - 6, y - 10, w + 12, 12, 6);
    ctx.fill();

    label('المسار الجانبي', x, y - WH * 0.055, C.creamSoft, 'small');

    /* سهم منقط يوضح اتجاه الاستبعاد */
    ctx.strokeStyle = 'rgba(224,101,58,0.45)';
    ctx.lineWidth = 4;
    ctx.setLineDash([14, 11]);
    ctx.beginPath();
    ctx.moveTo(EJECT_X + 60, L.beltTop + L.beltH * 2.4);
    ctx.lineTo(x + w * 0.5 + 40, y - WH * 0.12);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawLanes() {
    var y = L.beltTop - L.r * 4.6;
    label('مسار القبول', 150, y - fs('small') * 1.2, 'rgba(111,191,139,0.9)', 'small');
    ctx.strokeStyle = 'rgba(111,191,139,0.5)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(280, y);
    ctx.lineTo(50, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(66, y - 12);
    ctx.lineTo(46, y);
    ctx.lineTo(66, y + 12);
    ctx.stroke();
  }

  function drawHUD(t, stats) {
    var start = 16.4;
    if (t < start) return;
    var a = easeOut((t - start) / 0.7);
    var pw = Math.min(WW * 0.5, 720);
    var lineH = fs('big') * 1.35;
    var ph = lineH * 1.1 + fs() * 2.6;
    var px = (WW - pw) / 2;
    var py = WH * 0.09;

    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(8,22,16,0.97)';
    rr(px, py, pw, ph, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(232,137,45,0.55)';
    ctx.lineWidth = 3;
    rr(px, py, pw, ph, 22);
    ctx.stroke();

    label('تم الفحص', WW / 2, py + lineH * 0.62, C.cream, 'big');

    var items = [
      { n: stats.accept, l: 'مقبول', c: C.green },
      { n: stats.review, l: 'مراجعة', c: C.orange },
      { n: stats.reject, l: 'مرفوض', c: C.reject }
    ];
    var seg = pw / 3;
    for (var i = 0; i < items.length; i++) {
      var cx = px + seg * (i + 0.5);
      var yy = py + lineH * 1.05 + fs() * 1.1;
      ctx.font = font(fs(), 800);
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = items[i].c;
      ctx.fillText(items[i].l + ' ' + items[i].n, cx, yy);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- الإطار ---------- */

  function frame(t) {
    t = clamp(t, 0, DUR);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx.clearRect(0, 0, WW, WH);

    drawBackdrop();
    drawBelt(t);

    /* حالات الثمار */
    var states = [];
    var rejectIdx = 0;
    var stats = { total: 0, accept: 0, review: 0, reject: 0 };
    for (var i = 0; i < PLAN.length; i++) {
      var p = PLAN[i];
      if (TYPES[p.k].kind === 'reject') {
        p.binX = L.binCx + (rejectIdx === 0 ? -L.r * 0.9 : L.r * 0.9);
        rejectIdx++;
      }
      var st = fruitState(p, t);
      states.push(st);
      /* إحصاء ما تم فحصه */
      var tDecide = p.t + (START_X - 880) / V;
      if (t >= tDecide) {
        stats.total++;
        stats[TYPES[p.k].kind === 'accept' ? 'accept' : TYPES[p.k].kind === 'review' ? 'review' : 'reject']++;
      }
    }

    var scanning = false;
    for (var j = 0; j < states.length; j++) {
      if (states[j].alive && !states[j].ejected && states[j].phase > 0.02 && states[j].phase < 1) {
        scanning = true;
      }
    }

    drawBin(t);
    drawLanes();
    drawEjector(t);
    drawCamera(t, scanning);
    drawScanLine(t, scanning);

    for (var k = 0; k < states.length; k++) {
      if (states[k].alive) drawFruit(states[k]);
    }
    for (var m = 0; m < states.length; m++) {
      if (states[m].alive) {
        drawBox(states[m]);
        drawTags(states[m]);
      }
    }

    drawHUD(t, stats);
  }

  /* ---------- الحلقة ---------- */

  function loop(now) {
    if (!running) return;
    var t = (now - t0) / 1000;
    frame(t);
    if (t >= DUR) {
      running = false;
      raf = null;
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (!ctx) return;
    stop();
    running = true;
    t0 = (window.performance && performance.now ? performance.now() : Date.now());
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function resize() {
    if (!canvas || !stage) return;
    cssW = Math.max(stage.clientWidth, 120);
    cssH = Math.max(stage.clientHeight, 80);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = cssW / WW;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    layout();
    if (!running) frame(frozenT === null ? 0 : frozenT);
  }

  function boot() {
    canvas = document.getElementById('cinemaCanvas');
    if (!canvas) return;
    stage = canvas.parentNode;
    ctx = canvas.getContext('2d');

    resize();

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        resize();
      }).observe(stage);
    } else {
      window.addEventListener('resize', resize);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (!running) frame(frozenT === null ? 0 : frozenT);
      });
    }

    var btn = document.getElementById('cinemaReplay');
    if (btn) btn.addEventListener('click', start);

    if (document.body.classList.contains('print-mode')) {
      frozenT = 12.45;
      frame(frozenT);
      return;
    }

    document.addEventListener('deck:slidechange', function (e) {
      var isCinema = e.detail.slide.classList.contains('slide--cinema');
      if (isCinema) {
        resize();
        setTimeout(start, 260);
      } else {
        stop();
      }
    });

    window.CinemaScene = { start: start, stop: stop, frame: frame, resize: resize };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
