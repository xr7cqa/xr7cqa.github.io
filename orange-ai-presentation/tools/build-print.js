/* ============================================================
   يبني print.html من index.html للحفاظ على مصدر واحد للمحتوى
   التشغيل:  node tools/build-print.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

/* وضع الطباعة على body */
html = html.replace('<body>', '<body class="print-mode">');

/* ورقة أنماط الطباعة */
html = html.replace(
  '<link rel="stylesheet" href="css/slides.css" />',
  '<link rel="stylesheet" href="css/slides.css" />\n    <link rel="stylesheet" href="css/print.css" />'
);

/* عنوان مختلف */
html = html.replace(
  /<title>[\s\S]*?<\/title>/,
  '<title>نسخة الطباعة — نظام ذكي لفحص وتصنيف وفرز ثمار البرتقال</title>'
);

/* حذف شريط العرض ولوحة الملخص */
html = html.replace(/<!-- ==========================================================\s*\n\s*شريط العرض\s*\n\s*========================================================== -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
html = html.replace(/<div class="overview" id="overview"[\s\S]*?<\/div>\s*<\/div>/, '');

/* لا حاجة لمحرك التنقل في نسخة الطباعة */
html = html.replace('    <script src="js/deck.js"></script>\n', '');

fs.writeFileSync(path.join(root, 'print.html'), html, 'utf8');
console.log('print.html generated (' + html.length + ' bytes)');
