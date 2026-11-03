#!/usr/bin/env node
// html-report 화면 확인. 밝음·어두움 × 넓은 폭·390px로 찍고, 가로 넘침·콘솔 오류·CSP 위반·크기 한도를 검사한다.
//
// 사용:
//   node check.mjs <html> [--out <dir>] [--csp-file <file>] [--widths 1280,390] [--no-shots] [--per-section]
//   --per-section: header·section·footer를 하나씩 따로 찍는다(긴 페이지를 직접 볼 때)
//   --csp-file: 뷰어 CSP 문자열이 든 파일. 주면 실제 응답 헤더로 CSP(sandbox 포함)를 걸어 연다.
//               Vault 모드에서 쓴다(값은 references/vault-mode.md가 가리키는 정본에서 그때 읽는다).
// 결과: <out>/check.json, 화면 PNG. 문제가 있으면 종료 코드 1.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const PW = process.env.HTML_REPORT_PW || join(homedir(), '.cache/html-report/node/node_modules/playwright-core');
const { chromium } = require(PW);

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(name);
const VALUED = ['--out', '--csp-file', '--widths'];
const file = args.find((a, i) => !a.startsWith('--') && !(i > 0 && VALUED.includes(args[i - 1])));
if (!file) { console.error('사용: node check.mjs <html> [--out dir] [--csp-file f] [--widths 1280,390] [--no-shots]'); process.exit(2); }

const htmlPath = resolve(file);
const stem = basename(htmlPath).replace(/\.html?$/i, '').replace(/[^\p{L}\p{N}._-]+/gu, '_').slice(0, 60);
const out = resolve(opt('--out', join(tmpdir(), `html-report-check-${stem}`)));
mkdirSync(out, { recursive: true });
const widths = opt('--widths', '1280,390').split(',').map(Number);
const cspFile = opt('--csp-file');
const csp = cspFile ? readFileSync(cspFile, 'utf8').replace(/\s+/g, ' ').trim() : null;
const shots = !flag('--no-shots');
const perSection = flag('--per-section');

const LIMIT_HTML = 3 * 1024 * 1024;   // HTML 전체 3MB
const LIMIT_IMG = 300 * 1024;         // 그림 한 장 300KB

const html = readFileSync(htmlPath, 'utf8');
const report = { file: htmlPath, csp: !!csp, size: statSync(htmlPath).size, problems: [], warnings: [], runs: [] };

// 크기 한도
if (report.size > LIMIT_HTML) report.problems.push(`HTML 크기 ${(report.size / 1048576).toFixed(2)}MB > 3MB`);
const imgs = [...html.matchAll(/data:image\/(\w+);base64,([A-Za-z0-9+/=]+)/g)];
imgs.forEach((m, i) => {
  const bytes = Math.floor(m[2].length * 3 / 4);
  if (bytes > LIMIT_IMG) report.problems.push(`인라인 그림 ${i + 1}(${m[1]}) ${(bytes / 1024).toFixed(0)}KB > 300KB`);
});
report.inlineImages = imgs.length;

// 정적 점검: 다크 모드 토큰, viewport, 남은 마크다운 백틱
if (!/prefers-color-scheme:\s*dark/.test(html)) report.problems.push('prefers-color-scheme: dark 정의 없음');
if (!/:root\[data-theme="dark"\]/.test(html)) report.warnings.push(':root[data-theme="dark"] 정의 없음');
if (!/name="viewport"/.test(html)) report.problems.push('viewport meta 없음');
const extScripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
extScripts.forEach(s => {
  if (!/^https:\/\/cdn\.jsdelivr\.net\/npm\/[^/]+@\d[^/]*\//.test(s)) report.warnings.push(`외부 script가 jsdelivr 고정 버전이 아님: ${s}`);
});

const URL_FAKE = 'https://report.local/index.html';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const scheme of ['light', 'dark']) {
    for (const w of widths) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme, deviceScaleFactor: w <= 500 ? 2 : 1 });
      const page = await ctx.newPage();
      const run = { scheme, width: w, console: [], pageErrors: [], csp: [], failed: [] };
      page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') run.console.push(`${m.type()}: ${m.text()}`.slice(0, 300)); });
      page.on('pageerror', e => run.pageErrors.push(String(e).slice(0, 300)));
      page.on('requestfailed', r => run.failed.push(`${r.url().slice(0, 120)} ${r.failure()?.errorText || ''}`));
      let target;
      if (csp) {
        // 실제 응답 헤더로 CSP를 건다. meta CSP는 sandbox를 지원하지 않아서 이 방식을 쓴다.
        await page.route(URL_FAKE, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', headers: { 'Content-Security-Policy': csp }, body: html }));
        target = URL_FAKE;
      } else {
        target = 'file://' + htmlPath.split('/').map(encodeURIComponent).join('/');
      }
      await page.addInitScript(() => {
        window.__csp = [];
        document.addEventListener('securitypolicyviolation', e => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
      });
      await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => run.pageErrors.push('goto: ' + e.message.slice(0, 200)));
      await page.waitForTimeout(800);
      const res = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const inScroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(s.overflowX) && p !== document.body && p !== document.documentElement) return true; } return false; };
        const over = [];
        for (const el of document.body.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > vw + 1 && !inScroller(el)) {
            const id = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
            over.push(`${id} right=${Math.round(r.right)}`);
          }
        }
        // 화면에 보이는 글의 백틱(마크다운이 남은 자리)
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const ticks = [];
        for (let n; (n = walker.nextNode());) {
          if (n.nodeValue.includes('`') && !n.parentElement.closest('pre,code,script,style')) ticks.push(n.nodeValue.trim().slice(0, 60));
        }
        return { vw, sw, over: over.slice(0, 15), overCount: over.length, ticks: ticks.slice(0, 5), csp: window.__csp || [], height: document.documentElement.scrollHeight };
      });
      run.overflow = res.sw > res.vw + 1 ? `scrollWidth ${res.sw} > ${res.vw}` : null;
      run.overflowEls = res.over; run.overflowCount = res.overCount; run.csp = res.csp; run.height = res.height;
      if (run.overflow) report.problems.push(`${scheme} ${w}px 가로 넘침: ${run.overflow} (${res.over.slice(0, 3).join(', ')})`);
      else if (res.overCount) report.warnings.push(`${scheme} ${w}px 화면 밖 요소 ${res.overCount}개(스크롤 상자 밖): ${res.over.slice(0, 3).join(', ')}`);
      if (res.ticks.length && scheme === 'light' && w === widths[0]) report.problems.push(`본문에 백틱이 남음: ${res.ticks.join(' | ')}`);
      if (run.pageErrors.length) report.problems.push(`${scheme} ${w}px 스크립트 오류: ${run.pageErrors[0]}`);
      if (run.csp.length) report.problems.push(`${scheme} ${w}px CSP 위반 ${run.csp.length}건: ${run.csp.slice(0, 3).join(', ')}`);
      const errs = run.console.filter(c => c.startsWith('error'));
      if (errs.length) report.problems.push(`${scheme} ${w}px 콘솔 오류 ${errs.length}건: ${errs[0]}`);
      if (shots) {
        run.shot = join(out, `${stem}-${scheme}-${w}.png`);
        await page.screenshot({ path: run.shot, fullPage: true });
      }
      if (perSection) {
        // 긴 페이지는 한 장으로 보면 축소돼 읽을 수 없다. header와 main > section을 하나씩 찍는다.
        const els = await page.$$('main > header, main > section, main > footer');
        run.sections = [];
        for (const [k, el] of els.entries()) {
          const id = (await el.getAttribute('id')) || (await el.evaluate(e => e.tagName.toLowerCase()));
          const p = join(out, `${stem}-${scheme}-${w}-${String(k).padStart(2, '0')}-${id}.png`);
          await el.screenshot({ path: p }).catch(() => {});
          run.sections.push(p);
        }
      }
      report.runs.push(run);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}

report.problems = [...new Set(report.problems)];
report.warnings = [...new Set(report.warnings)];
writeFileSync(join(out, 'check.json'), JSON.stringify(report, null, 2));
console.log(`파일 ${htmlPath}`);
console.log(`크기 ${(report.size / 1024).toFixed(0)}KB · 인라인 그림 ${report.inlineImages}장 · CSP ${csp ? '적용' : '없음'}`);
for (const r of report.runs) console.log(`- ${r.scheme} ${r.width}px 높이 ${r.height}px${r.shot ? ' → ' + r.shot : ''}`);
if (report.warnings.length) { console.log('주의:'); report.warnings.forEach(w => console.log('  · ' + w)); }
if (report.problems.length) { console.log('문제:'); report.problems.forEach(p => console.log('  ✗ ' + p)); console.log('RESULT FAIL'); process.exit(1); }
console.log('RESULT PASS');
