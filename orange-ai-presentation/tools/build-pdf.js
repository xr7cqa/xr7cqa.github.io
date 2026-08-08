/* ============================================================
   يولد presentation.pdf — صفحة لكل شريحة بنسبة 16:9 وبدون
   أي أدوات تحكم أو حركات. يعتمد على Playwright + Chromium.

   التشغيل:
     python3 -m http.server 8123     (من جذر المشروع)
     node tools/build-pdf.js
   ============================================================ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = process.env.DECK_URL || 'http://127.0.0.1:8123/index.html';
const EXE = process.env.CHROMIUM_PATH || undefined;
const W = 1600;
const H = 900;
const SCALE = 2;
const COUNT = 14;

(async () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'deck-pdf-'));
  const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: SCALE,
    locale: 'ar'
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  /* إخفاء شريط العرض في اللقطات */
  await page.addStyleTag({
    content: '.chrome,.overview{display:none !important}'
  });

  const shots = [];
  for (let i = 1; i <= COUNT; i++) {
    await page.evaluate(n => window.Deck.goTo(n - 1), i);
    if (i === 9) {
      /* لقطة من منتصف المشهد المتحرك حيث يعمل الفرز */
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        window.CinemaScene.stop();
        window.CinemaScene.frame(12.45);
      });
      await page.waitForTimeout(300);
    } else if (i === 10) {
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        window.FlowScene.pause();
        window.FlowScene.setStep(5);
      });
      await page.waitForTimeout(700);
    } else {
      await page.waitForTimeout(1700);
    }
    const file = path.join(tmp, 'slide-' + String(i).padStart(2, '0') + '.jpg');
    await page.screenshot({ path: file, type: 'jpeg', quality: 92 });
    shots.push(file);
  }
  await ctx.close();

  /* تجميع الصفحات في مستند واحد ثم طباعته PDF */
  const imgs = shots
    .map(f => {
      const b64 = fs.readFileSync(f).toString('base64');
      return '<div class="pg"><img src="data:image/jpeg;base64,' + b64 + '"></div>';
    })
    .join('\n');

  const doc =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<style>@page{size:' + W + 'px ' + H + 'px;margin:0}' +
    'html,body{margin:0;padding:0;background:#0f2a20}' +
    '.pg{width:' + W + 'px;height:' + H + 'px;overflow:hidden;page-break-after:always;break-after:page}' +
    '.pg:last-child{page-break-after:auto;break-after:auto}' +
    'img{display:block;width:' + W + 'px;height:' + H + 'px}</style></head><body>' +
    imgs +
    '</body></html>';

  const docFile = path.join(tmp, 'doc.html');
  fs.writeFileSync(docFile, doc);

  const ctx2 = await browser.newContext({ viewport: { width: W, height: H } });
  const page2 = await ctx2.newPage();
  await page2.goto('file://' + docFile, { waitUntil: 'load' });
  await page2.pdf({
    path: path.join(ROOT, 'presentation.pdf'),
    width: W + 'px',
    height: H + 'px',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true
  });
  await ctx2.close();
  await browser.close();

  const size = fs.statSync(path.join(ROOT, 'presentation.pdf')).size;
  console.log('presentation.pdf created — ' + COUNT + ' pages, ' + Math.round(size / 1024) + ' KB');
})();
