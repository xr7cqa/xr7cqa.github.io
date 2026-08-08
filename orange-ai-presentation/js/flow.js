/* ============================================================
   الشريحة 10 — آلية عمل النظام (تعليمية وتفاعلية)
   ثمرة واحدة تتحرك بين تسع مراحل مع تحكم كامل
   ============================================================ */
(function () {
  'use strict';

  var STEPS = [
    {
      title: 'دخول البرتقال',
      desc: 'تدخل الثمار إلى السير الناقل بتدفق منتظم يسمح بفصلها قبل الفحص.'
    },
    {
      title: 'اكتشاف الثمرة',
      desc: 'يرصد الحساس وصول الثمرة إلى منطقة التصوير ويعطي إشارة البدء.'
    },
    {
      title: 'التقاط الصورة',
      desc: 'تلتقط الكاميرا صورة للثمرة تحت إضاءة ثابتة تمنع الظلال.'
    },
    {
      title: 'تحليل الصورة',
      desc: 'تعالج الصورة لعزل الثمرة عن الخلفية واستخراج ملامح السطح واللون والحجم.'
    },
    {
      title: 'تصنيف الحالة',
      desc: 'يحدد النموذج فئة الثمرة ودرجة الثقة في النتيجة.'
    },
    {
      title: 'اتخاذ القرار',
      desc: 'يترجم النظام الفئة إلى قرار قبول أو مراجعة أو استبعاد.'
    },
    {
      title: 'تشغيل آلية الفرز',
      desc: 'ترسل وحدة التحكم أمر التشغيل لإبعاد الثمرة المستبعدة إلى المسار الجانبي.'
    },
    {
      title: 'حفظ النتيجة',
      desc: 'تسجل الفئة والقرار ووقت الفحص في قاعدة البيانات.'
    },
    {
      title: 'تحديث لوحة المتابعة',
      desc: 'تظهر النتائج والمؤشرات مباشرة أمام المشرف على خط الإنتاج.'
    }
  ];

  var STEP_MS = 2600;

  var el = {};
  var current = 1;
  var timer = null;
  var playing = false;

  function q(id) {
    return document.getElementById(id);
  }

  function positionFruit() {
    if (!el.fruit || !el.rail || !el.track) return;
    var trackRect = el.track.getBoundingClientRect();
    var railRect = el.rail.getBoundingClientRect();
    if (!railRect.width) return;
    var ratio = (current - 0.5) / STEPS.length;
    var targetRight = railRect.width * ratio + (trackRect.right - railRect.right);
    el.fruit.style.right = targetRight + 'px';
  }

  function render() {
    var items = el.steps ? el.steps.querySelectorAll('.fstep') : [];
    for (var i = 0; i < items.length; i++) {
      var n = i + 1;
      items[i].classList.toggle('is-current', n === current);
      items[i].classList.toggle('is-done', n < current);
    }

    var s = STEPS[current - 1];
    if (el.title) el.title.textContent = s.title;
    if (el.desc) el.desc.textContent = s.desc;
    if (el.badge) el.badge.textContent = String(current);
    if (el.railFill) el.railFill.style.width = (current / STEPS.length) * 100 + '%';
    positionFruit();
  }

  function setStep(n) {
    current = Math.min(Math.max(n, 1), STEPS.length);
    render();
  }

  function tick() {
    if (current >= STEPS.length) {
      pause();
      return;
    }
    setStep(current + 1);
  }

  function play() {
    if (playing) return;
    if (current >= STEPS.length) setStep(1);
    playing = true;
    updatePlayBtn();
    timer = setInterval(tick, STEP_MS);
  }

  function pause() {
    playing = false;
    if (timer) clearInterval(timer);
    timer = null;
    updatePlayBtn();
  }

  function toggle() {
    if (playing) pause();
    else play();
  }

  function restart() {
    pause();
    setStep(1);
  }

  function updatePlayBtn() {
    if (!el.play) return;
    var use = el.play.querySelector('use');
    if (use) use.setAttribute('href', playing ? '#ic-pause' : '#ic-play');
    if (el.playLabel) el.playLabel.textContent = playing ? 'إيقاف مؤقت' : 'تشغيل';
    el.play.setAttribute('aria-label', playing ? 'إيقاف مؤقت' : 'تشغيل');
  }

  function boot() {
    el.steps = q('flowSteps');
    if (!el.steps) return;
    el.track = el.steps.parentNode;
    el.rail = q('flowRailFill') ? q('flowRailFill').parentNode : null;
    el.railFill = q('flowRailFill');
    el.fruit = q('flowFruit');
    el.title = q('flowTitle');
    el.desc = q('flowDesc');
    el.badge = q('flowBadgeNum');
    el.play = q('flowPlay');
    el.playLabel = q('flowPlayLabel');

    setStep(1);

    if (el.play) el.play.addEventListener('click', toggle);
    var bn = q('flowNext');
    var bp = q('flowPrev');
    var br = q('flowRestart');
    if (bn)
      bn.addEventListener('click', function () {
        pause();
        setStep(current + 1);
      });
    if (bp)
      bp.addEventListener('click', function () {
        pause();
        setStep(current - 1);
      });
    if (br) br.addEventListener('click', restart);

    el.steps.addEventListener('click', function (e) {
      var item = e.target.closest ? e.target.closest('.fstep') : null;
      if (!item) return;
      pause();
      setStep(parseInt(item.getAttribute('data-step'), 10));
    });

    window.addEventListener('resize', positionFruit);

    if (document.body.classList.contains('print-mode')) {
      setStep(5);
      return;
    }

    document.addEventListener('deck:slidechange', function (e) {
      var isFlow = e.detail.slide.classList.contains('slide--flow');
      if (isFlow) {
        setStep(1);
        setTimeout(function () {
          positionFruit();
          play();
        }, 420);
      } else {
        pause();
      }
    });

    window.FlowScene = { play: play, pause: pause, setStep: setStep, restart: restart };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
