/* ============================================================
   الشريحة 11 — بطاقات مكونات النظام
   كل بطاقة: رسم توضيحي + اسم + وصف من سطر واحد
   ============================================================ */
(function () {
  'use strict';

  var G =
    '<defs>' +
    '<linearGradient id="pgBg" x1="0" y1="0" x2="0.6" y2="1">' +
    '<stop offset="0" stop-color="#e6efe6"/><stop offset="1" stop-color="#cfe0d2"/>' +
    '</linearGradient>' +
    '<radialGradient id="pgOr" cx="0.34" cy="0.28" r="0.8">' +
    '<stop offset="0" stop-color="#ffc06a"/><stop offset="0.5" stop-color="#ef9330"/><stop offset="1" stop-color="#bf631a"/>' +
    '</radialGradient>' +
    '</defs>';

  function art(inner) {
    return inner;
  }

  /* توليد رسم البطاقة مع معرفات فريدة لكل تدرج لوني */
  function render(inner, i) {
    var defs = G.split('pgBg').join('pgBg' + i).split('pgOr').join('pgOr' + i);
    var body = inner.split('pgBg').join('pgBg' + i).split('pgOr').join('pgOr' + i);
    return (
      '<svg viewBox="0 0 120 90" role="presentation" focusable="false">' +
      defs +
      '<rect width="120" height="90" fill="url(#pgBg' + i + ')"/>' +
      body +
      '</svg>'
    );
  }

  var PARTS = [
    {
      name: 'السير الناقل',
      desc: 'ينقل الثمار أمام الكاميرا بسرعة منتظمة.',
      art: art(
        '<rect x="6" y="52" width="108" height="16" rx="8" fill="#153a2c"/>' +
          '<g stroke="#dce8dd" stroke-width="2.4" stroke-linecap="round" opacity="0.5">' +
          '<path d="M18 60h10M40 60h10M62 60h10M84 60h10"/></g>' +
          '<circle cx="16" cy="60" r="9" fill="none" stroke="#3f7654" stroke-width="3"/>' +
          '<circle cx="104" cy="60" r="9" fill="none" stroke="#3f7654" stroke-width="3"/>' +
          '<circle cx="42" cy="42" r="11" fill="url(#pgOr)"/>' +
          '<circle cx="76" cy="43" r="10" fill="url(#pgOr)"/>' +
          '<rect x="20" y="72" width="6" height="14" rx="3" fill="#3f7654"/>' +
          '<rect x="94" y="72" width="6" height="14" rx="3" fill="#3f7654"/>'
      )
    },
    {
      name: 'الكاميرا',
      desc: 'تلتقط صورة واضحة لكل ثمرة أثناء المرور.',
      art: art(
        '<rect x="34" y="8" width="52" height="30" rx="8" fill="#153a2c"/>' +
          '<rect x="42" y="15" width="18" height="6" rx="3" fill="#3f7654"/>' +
          '<circle cx="78" cy="24" r="3.4" fill="#e8892d"/>' +
          '<rect x="52" y="36" width="16" height="8" rx="3" fill="#153a2c"/>' +
          '<circle cx="60" cy="47" r="9" fill="#0f2a20"/>' +
          '<circle cx="60" cy="47" r="4.6" fill="#3f7654"/>' +
          '<path d="M50 54 36 82h48L70 54z" fill="#e8892d" opacity="0.22"/>' +
          '<rect x="6" y="80" width="108" height="6" rx="3" fill="#153a2c"/>' +
          '<circle cx="60" cy="74" r="8" fill="url(#pgOr)"/>'
      )
    },
    {
      name: 'وحدة الإضاءة',
      desc: 'إضاءة ثابتة تمنع الظلال والانعكاس.',
      art: art(
        '<rect x="22" y="14" width="76" height="12" rx="6" fill="#153a2c"/>' +
          '<g fill="#e8892d" opacity="0.85">' +
          '<circle cx="34" cy="20" r="3.2"/><circle cx="48" cy="20" r="3.2"/>' +
          '<circle cx="62" cy="20" r="3.2"/><circle cx="76" cy="20" r="3.2"/><circle cx="88" cy="20" r="3.2"/></g>' +
          '<path d="M26 28 10 76h100L94 28z" fill="#e8892d" opacity="0.16"/>' +
          '<g stroke="#e8892d" stroke-width="2" stroke-linecap="round" opacity="0.5">' +
          '<path d="M34 30v10M48 30v14M62 30v10M76 30v14M88 30v10"/></g>' +
          '<rect x="6" y="78" width="108" height="8" rx="4" fill="#153a2c"/>' +
          '<circle cx="60" cy="70" r="10" fill="url(#pgOr)"/>'
      )
    },
    {
      name: 'الحساس',
      desc: 'يرصد وصول الثمرة إلى منطقة الفحص.',
      art: art(
        '<rect x="10" y="30" width="16" height="28" rx="5" fill="#153a2c"/>' +
          '<rect x="94" y="30" width="16" height="28" rx="5" fill="#153a2c"/>' +
          '<circle cx="18" cy="44" r="4" fill="#e8892d"/>' +
          '<circle cx="102" cy="44" r="4" fill="#3f7654"/>' +
          '<path d="M26 44h68" stroke="#e8892d" stroke-width="2.6" stroke-dasharray="7 6" stroke-linecap="round"/>' +
          '<circle cx="60" cy="46" r="13" fill="url(#pgOr)"/>' +
          '<rect x="6" y="66" width="108" height="10" rx="5" fill="#153a2c"/>' +
          '<g stroke="#dce8dd" stroke-width="2" opacity="0.45" stroke-linecap="round"><path d="M20 71h10M44 71h10M68 71h10M92 71h10"/></g>'
      )
    },
    {
      name: 'وحدة التحكم',
      desc: 'تنفذ أوامر النظام على الخط.',
      art: art(
        '<rect x="24" y="12" width="72" height="66" rx="8" fill="#153a2c"/>' +
          '<rect x="32" y="20" width="34" height="8" rx="4" fill="#dce8dd" opacity="0.7"/>' +
          '<rect x="32" y="34" width="26" height="6" rx="3" fill="#dce8dd" opacity="0.4"/>' +
          '<rect x="32" y="46" width="30" height="6" rx="3" fill="#dce8dd" opacity="0.4"/>' +
          '<rect x="32" y="58" width="22" height="6" rx="3" fill="#dce8dd" opacity="0.4"/>' +
          '<circle cx="80" cy="26" r="5" fill="#e8892d"/>' +
          '<circle cx="80" cy="42" r="5" fill="#3f7654"/>' +
          '<circle cx="80" cy="58" r="5" fill="#dce8dd" opacity="0.6"/>' +
          '<path d="M14 45h10M96 45h10" stroke="#3f7654" stroke-width="3" stroke-linecap="round"/>'
      )
    },
    {
      name: 'آلية الفرز',
      desc: 'تبعد الثمرة المستبعدة إلى المسار الجانبي.',
      art: art(
        '<rect x="6" y="46" width="108" height="12" rx="6" fill="#153a2c"/>' +
          '<rect x="58" y="10" width="14" height="24" rx="5" fill="#3f7654"/>' +
          '<rect x="52" y="32" width="26" height="9" rx="4" fill="#e8892d"/>' +
          '<path d="M65 41v5" stroke="#e8892d" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="64" cy="38" r="0" fill="none"/>' +
          '<path d="M78 58 100 82" stroke="#3f7654" stroke-width="3.4" stroke-linecap="round"/>' +
          '<path d="M62 58 84 82" stroke="#3f7654" stroke-width="3.4" stroke-linecap="round" opacity="0.5"/>' +
          '<circle cx="92" cy="72" r="10" fill="url(#pgOr)" opacity="0.9"/>' +
          '<circle cx="26" cy="38" r="9" fill="url(#pgOr)"/>'
      )
    },
    {
      name: 'وحدة المعالجة',
      desc: 'تشغل النموذج وتعيد الفئة والقرار.',
      art: art(
        '<rect x="32" y="24" width="56" height="46" rx="8" fill="#153a2c"/>' +
          '<rect x="46" y="38" width="28" height="18" rx="5" fill="#3f7654"/>' +
          '<g stroke="#3f7654" stroke-width="3" stroke-linecap="round">' +
          '<path d="M44 12v12M60 12v12M76 12v12M44 70v12M60 70v12M76 70v12"/>' +
          '<path d="M18 36h14M18 47h14M18 58h14M88 36h14M88 47h14M88 58h14"/></g>' +
          '<circle cx="60" cy="47" r="4" fill="#e8892d"/>'
      )
    },
    {
      name: 'النظام الإداري',
      desc: 'لوحة متابعة وتقارير للمشرفين.',
      art: art(
        '<rect x="12" y="14" width="96" height="56" rx="7" fill="#153a2c"/>' +
          '<rect x="20" y="22" width="40" height="7" rx="3.5" fill="#dce8dd" opacity="0.65"/>' +
          '<rect x="20" y="36" width="10" height="24" rx="3" fill="#3f7654"/>' +
          '<rect x="34" y="44" width="10" height="16" rx="3" fill="#3f7654" opacity="0.75"/>' +
          '<rect x="48" y="30" width="10" height="30" rx="3" fill="#e8892d"/>' +
          '<rect x="66" y="36" width="34" height="6" rx="3" fill="#dce8dd" opacity="0.4"/>' +
          '<rect x="66" y="48" width="26" height="6" rx="3" fill="#dce8dd" opacity="0.3"/>' +
          '<path d="M50 70v8M70 70v8M42 82h36" stroke="#3f7654" stroke-width="3.4" stroke-linecap="round"/>'
      )
    },
    {
      name: 'قاعدة البيانات',
      desc: 'تحفظ نتائج الفحص وسجل التشغيل.',
      art: art(
        '<g fill="#153a2c">' +
          '<ellipse cx="60" cy="22" rx="30" ry="10"/>' +
          '<rect x="30" y="22" width="60" height="46" />' +
          '<ellipse cx="60" cy="68" rx="30" ry="10"/></g>' +
          '<ellipse cx="60" cy="22" rx="30" ry="10" fill="#3f7654"/>' +
          '<g stroke="#dce8dd" stroke-width="2.2" opacity="0.4" fill="none">' +
          '<path d="M30 40c0 5.5 13.4 10 30 10s30-4.5 30-10"/>' +
          '<path d="M30 55c0 5.5 13.4 10 30 10s30-4.5 30-10"/></g>' +
          '<circle cx="60" cy="22" r="4.4" fill="#e8892d"/>'
      )
    }
  ];

  function build() {
    var grid = document.getElementById('partsGrid');
    if (!grid) return;
    var html = '';
    for (var i = 0; i < PARTS.length; i++) {
      var p = PARTS[i];
      var delay = 340 + i * 55;
      html +=
        '<li class="part" data-reveal="scale" style="--rd:' + delay + 'ms">' +
        '<span class="part__art" aria-hidden="true">' + render(p.art, i) + '</span>' +
        '<h3 class="part__name">' + p.name + '</h3>' +
        '<p class="part__desc">' + p.desc + '</p>' +
        '</li>';
    }
    grid.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
