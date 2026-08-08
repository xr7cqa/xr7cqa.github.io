/* ============================================================
   محرك العرض — تنقل، اختصارات، لمس، ملء الشاشة، ملخص الشرائح
   ============================================================ */
(function () {
  'use strict';

  var Deck = {
    slides: [],
    index: 0,
    ready: false
  };
  window.Deck = Deck;

  var deckEl,
    slides,
    progressBar,
    counterCurrent,
    overviewEl,
    overviewGrid,
    btnPrev,
    btnNext,
    btnFull,
    btnOverview;

  var idleTimer = null;
  var settleTimer = null;
  var IDLE_MS = 3200;

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  /* ---------- الانتقال بين الشرائح ---------- */

  function applyState(i, back) {
    for (var k = 0; k < slides.length; k++) {
      var s = slides[k];
      if (k === i) {
        s.classList.toggle('is-back', !!back);
        /* إعادة تدفق لضمان بدء الانتقال من الحالة الصحيحة */
        void s.offsetWidth;
        s.classList.add('is-active');
        s.classList.remove('is-back');
        s.removeAttribute('aria-hidden');
      } else {
        if (s.classList.contains('is-active')) {
          s.classList.toggle('is-back', !back);
        }
        s.classList.remove('is-active');
        s.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function goTo(i, opts) {
    opts = opts || {};
    if (i < 0) i = 0;
    if (i > slides.length - 1) i = slides.length - 1;
    var back = typeof opts.back === 'boolean' ? opts.back : i < Deck.index;
    var changed = i !== Deck.index || !Deck.ready;
    Deck.index = i;
    Deck.ready = true;

    applyState(i, back);
    updateChrome();

    /* بعد استقرار حركات الظهور نزيل طبقات التركيب المؤقتة */
    if (settleTimer) clearTimeout(settleTimer);
    slides[i].classList.remove('is-settled');
    settleTimer = setTimeout(function () {
      slides[i].classList.add('is-settled');
    }, 1500);

    if (changed) {
      var ev;
      try {
        ev = new CustomEvent('deck:slidechange', {
          detail: { index: i, number: i + 1, slide: slides[i] }
        });
      } catch (e) {
        ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('deck:slidechange', false, false, {
          index: i,
          number: i + 1,
          slide: slides[i]
        });
      }
      document.dispatchEvent(ev);
    }

    if (opts.hash !== false) {
      try {
        history.replaceState(null, '', '#' + (i + 1));
      } catch (e) {
        /* تجاهل في وضع الملف المحلي */
      }
    }
  }

  function next() {
    if (Deck.index < slides.length - 1) goTo(Deck.index + 1, { back: false });
  }

  function prev() {
    if (Deck.index > 0) goTo(Deck.index - 1, { back: true });
  }

  /* ---------- شريط العرض ---------- */

  function updateChrome() {
    var n = Deck.index + 1;
    var total = slides.length;
    if (progressBar) progressBar.style.width = (n / total) * 100 + '%';
    if (counterCurrent) counterCurrent.textContent = pad2(n);
    if (btnPrev) btnPrev.disabled = Deck.index === 0;
    if (btnNext) btnNext.disabled = Deck.index === total - 1;

    document.body.classList.toggle(
      'on-dark',
      slides[Deck.index].classList.contains('slide--dark')
    );

    if (overviewGrid) {
      var cards = overviewGrid.children;
      for (var k = 0; k < cards.length; k++) {
        cards[k].classList.toggle('is-current', k === Deck.index);
      }
    }
  }

  function wake() {
    document.body.classList.remove('is-idle');
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      document.body.classList.add('is-idle');
    }, IDLE_MS);
  }

  /* ---------- ملخص الشرائح ---------- */

  function buildOverview() {
    if (!overviewGrid) return;
    var html = '';
    for (var i = 0; i < slides.length; i++) {
      var title = slides[i].getAttribute('data-title') || 'شريحة';
      html +=
        '<button type="button" class="ov-card" data-go="' + i + '">' +
        '<span class="ov-card__num u-num">' + pad2(i + 1) + '</span>' +
        '<span class="ov-card__label">' + title + '</span>' +
        '</button>';
    }
    overviewGrid.innerHTML = html;
    overviewGrid.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-go]') : null;
      if (!b) return;
      closeOverview();
      goTo(parseInt(b.getAttribute('data-go'), 10));
    });
  }

  function openOverview() {
    if (overviewEl) overviewEl.classList.add('is-open');
  }

  function closeOverview() {
    if (overviewEl) overviewEl.classList.remove('is-open');
  }

  function overviewOpen() {
    return overviewEl && overviewEl.classList.contains('is-open');
  }

  /* ---------- ملء الشاشة ---------- */

  function toggleFull() {
    var d = document;
    var el = d.documentElement;
    var isFull = d.fullscreenElement || d.webkitFullscreenElement;
    if (!isFull) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
    }
  }

  /* ---------- المدخلات ---------- */

  function isTypingTarget(el) {
    if (!el) return false;
    var t = el.tagName;
    return t === 'INPUT' || t === 'TEXTAREA' || el.isContentEditable;
  }

  function onKey(e) {
    if (isTypingTarget(e.target)) return;
    wake();
    var k = e.key;

    if (k === 'Escape') {
      if (overviewOpen()) {
        closeOverview();
        e.preventDefault();
        return;
      }
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        return; /* المتصفح يتكفل بالخروج */
      }
      return;
    }

    if (overviewOpen() && (k === 'ArrowRight' || k === 'ArrowLeft')) {
      return;
    }

    switch (k) {
      case 'ArrowRight':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prev();
        break;
      case ' ':
      case 'Spacebar':
        e.preventDefault();
        next();
        break;
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0, { back: true });
        break;
      case 'End':
        e.preventDefault();
        goTo(slides.length - 1, { back: false });
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFull();
        break;
      case 'o':
      case 'O':
        e.preventDefault();
        if (overviewOpen()) closeOverview();
        else openOverview();
        break;
      default:
        break;
    }
  }

  function initTouch() {
    var x0 = 0,
      y0 = 0,
      t0 = 0,
      tracking = false;

    deckEl.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length !== 1) {
          tracking = false;
          return;
        }
        tracking = true;
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
        t0 = Date.now();
        wake();
      },
      { passive: true }
    );

    deckEl.addEventListener(
      'touchend',
      function (e) {
        if (!tracking) return;
        tracking = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - x0;
        var dy = t.clientY - y0;
        var dt = Date.now() - t0;
        if (dt > 900) return;
        if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
        if (dx < 0) next();
        else prev();
      },
      { passive: true }
    );
  }

  /* ---------- الإقلاع ---------- */

  function boot() {
    deckEl = document.getElementById('deck');
    if (!deckEl) return;
    slides = Array.prototype.slice.call(deckEl.querySelectorAll('.slide'));
    Deck.slides = slides;

    progressBar = document.getElementById('progressBar');
    counterCurrent = document.getElementById('counterCurrent');
    overviewEl = document.getElementById('overview');
    overviewGrid = document.getElementById('overviewGrid');
    btnPrev = document.getElementById('btnPrev');
    btnNext = document.getElementById('btnNext');
    btnFull = document.getElementById('btnFull');
    btnOverview = document.getElementById('btnOverview');

    var totalEl = document.querySelector('.counter__total');
    if (totalEl) totalEl.textContent = pad2(slides.length);

    buildOverview();

    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);
    if (btnFull) btnFull.addEventListener('click', toggleFull);
    if (btnOverview)
      btnOverview.addEventListener('click', function () {
        if (overviewOpen()) closeOverview();
        else openOverview();
      });

    document.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', wake, { passive: true });
    window.addEventListener('wheel', wake, { passive: true });
    initTouch();

    var start = 0;
    var m = /^#(\d+)$/.exec(window.location.hash || '');
    if (m) {
      var v = parseInt(m[1], 10) - 1;
      if (v >= 0 && v < slides.length) start = v;
    }

    goTo(start, { back: false });
    wake();

    Deck.goTo = goTo;
    Deck.next = next;
    Deck.prev = prev;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
