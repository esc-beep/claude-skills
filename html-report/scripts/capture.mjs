#!/usr/bin/env node
// html-report 화면 캡처. 전용 브라우저 프로필로 페이지를 열고, 가린 뒤, 요소 단위로 찍어 WebP로 만든다.
//
// 찍기:
//   node capture.mjs --url <주소> --out <파일.webp> [--selector <CSS>] [--ready <CSS>]
//                    [--width 1280] [--height 900] [--scheme light|dark] [--wait 1500]
//                    [--clip x,y,w,h] [--mask <CSS,CSS>] [--mask-common] [--replace '<정규식>=><바꿀 글>' ...]
//                    [--max-kb 300] [--headed]
// 로그인:
//   node capture.mjs --login --url <주소> [--ready <CSS>] [--timeout 600]
//   보이는 창을 띄우고, 사용자가 로그인을 마쳐 로그인 화면을 벗어날 때까지(또는 --ready가 보일 때까지) 기다린다.
//
// 종료 코드: 0 성공, 2 사용법 오류, 3 로그인 필요(LOGIN_REQUIRED), 4 대상 요소 없음, 5 크기 한도를 못 맞춤.
// 프로필: ~/.cache/html-report/browser-profile (권한 700), 세션 쿠키: ~/.cache/html-report/session-cookies.json (권한 600).
// 지우기: rm -rf ~/.cache/html-report/browser-profile ~/.cache/html-report/session-cookies.json
import { createRequire } from 'node:module';
import { mkdirSync, chmodSync, statSync, unlinkSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join, dirname } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const PW = process.env.HTML_REPORT_PW || join(homedir(), '.cache/html-report/node/node_modules/playwright-core');
const { chromium } = require(PW);

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const all = (n) => argv.flatMap((a, i) => (a === n ? [argv[i + 1]] : []));
const flag = (n) => argv.includes(n);

const url = opt('--url');
if (!url) { console.error('사용: node capture.mjs --url <주소> --out <파일.webp> [옵션] | --login --url <주소>'); process.exit(2); }
const PROFILE = process.env.HTML_REPORT_PROFILE || join(homedir(), '.cache/html-report/browser-profile');
mkdirSync(PROFILE, { recursive: true });
chmodSync(dirname(PROFILE), 0o700); chmodSync(PROFILE, 0o700);

// 로그인 화면으로 보는 주소. 필요하면 --login-pattern으로 더한다.
const LOGIN_PATTERNS = [
  /accounts\.google\.com/, /login\.microsoftonline\.com/, /github\.com\/(login|session)/,
  /\.okta\.com/, /\/sso\//i, /\/(login|signin|sign-in|auth\/login)(\/|\?|$)/i,
  /id\.atlassian\.com/, /grafana\.[^/]+\/login/,
  ...all('--login-pattern').map(p => new RegExp(p)),
];
const isLogin = (u) => LOGIN_PATTERNS.some(re => re.test(u));

const width = Number(opt('--width', 1280));
const height = Number(opt('--height', 900));
const scheme = opt('--scheme', 'light');
const ready = opt('--ready');
const login = flag('--login');
const headed = login || flag('--headed');

const ctx = await chromium.launchPersistentContext(PROFILE, {
  channel: 'chrome',
  headless: !headed,
  viewport: { width, height },
  colorScheme: scheme,
  deviceScaleFactor: 2,
  // 자동화 표시를 줄여 로그인 페이지가 막지 않게 한다(막히면 로그인은 사용자가 창에서 직접 한다).
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled'],
});
// 세션 쿠키(만료 없음)는 브라우저를 닫으면 사라진다(Argo CD 토큰 등). 로그인 때 따로 저장해 두고 다시 넣는다.
const STATE = join(dirname(PROFILE), 'session-cookies.json');
const ckey = (c) => `${c.name}|${c.domain}|${c.path}`;
const savedCookies = () => { try { return JSON.parse(readFileSync(STATE, 'utf8')); } catch { return []; } };
if (savedCookies().length) await ctx.addCookies(savedCookies()).catch(e => console.log('경고: 세션 쿠키 복원 실패 ' + e.message.split('\n')[0]));
async function saveSessionCookies() {
  const fresh = (await ctx.cookies()).filter(c => c.expires === -1);
  const merged = new Map(savedCookies().map(c => [ckey(c), c]));
  for (const c of fresh) merged.set(ckey(c), c);
  writeFileSync(STATE, JSON.stringify([...merged.values()]), { mode: 0o600 });
  chmodSync(STATE, 0o600);
  return fresh.length;
}
const page = ctx.pages()[0] || await ctx.newPage();

async function done(code, msg) { if (msg) console.log(msg); await ctx.close(); process.exit(code); }

if (login) {
  const timeout = Number(opt('--timeout', 600)) * 1000;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  console.log(`LOGIN_WINDOW 열린 창에서 로그인해 주세요: ${url}`);
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    await page.waitForTimeout(2000);
    const cur = page.url();
    const okUrl = !isLogin(cur) && cur !== 'about:blank';
    const okReady = ready ? await page.locator(ready).first().isVisible().catch(() => false) : true;
    if (okUrl && okReady) {
      await page.waitForTimeout(1500);
      const n = await saveSessionCookies();
      await done(0, `LOGIN_OK ${new URL(cur).host} (세션 쿠키 ${n}개 저장)`);
    }
  }
  await done(3, 'LOGIN_TIMEOUT 시간 안에 로그인을 마치지 못했습니다');
}

const out = resolve(opt('--out', join(tmpdir(), `capture-${Date.now()}.webp`)));
mkdirSync(dirname(out), { recursive: true });
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.log('경고: ' + e.message.split('\n')[0]));
if (isLogin(page.url())) await done(3, `LOGIN_REQUIRED ${new URL(page.url()).host} → node capture.mjs --login --url '${url}'`);
if (ready) {
  const ok = await page.locator(ready).first().waitFor({ state: 'visible', timeout: 30000 }).then(() => true).catch(() => false);
  if (!ok) await done(isLogin(page.url()) ? 3 : 4, `READY_MISSING ${ready} (로그인이 풀렸거나 화면이 바뀌었을 수 있습니다)`);
}
await page.waitForTimeout(Number(opt('--wait', 1500)));

// 가리기: 요소는 칠해서 덮고(흐림은 되살릴 수 있어 쓰지 않는다), 글은 바꿔 쓴다.
const masks = (opt('--mask', '') || '').split(',').map(s => s.trim()).filter(Boolean);
const replaces = all('--replace').map(r => { const i = r.lastIndexOf('=>'); return [r.slice(0, i), r.slice(i + 2)]; });
if (flag('--mask-common')) {
  replaces.push(
    ['\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', 'x.x.x.x'],                         // IPv4
    ['[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}', '***@***'],           // 메일
    ['\\b(?:ghp|gho|github_pat|xox[abp]|AKIA|AIza|ya29)[A-Za-z0-9_\\-.]{8,}', '[가림]'], // 흔한 토큰 접두사
    ['\\b(?![0-9a-f]{40}\\b)(?![0-9a-f]{64}\\b)[A-Za-z0-9_\\-]{40,}\\b', '[가림]'], // 긴 무작위 문자열(git 커밋·sha256 해시는 제외)
  );
}
const masked = await page.evaluate(({ masks, replaces }) => {
  let n = 0;
  for (const sel of masks) for (const el of document.querySelectorAll(sel)) {
    el.style.setProperty('background', '#6b7280', 'important');
    el.style.setProperty('color', 'transparent', 'important');
    el.style.setProperty('text-shadow', 'none', 'important');
    for (const c of el.querySelectorAll('*')) c.style.setProperty('visibility', 'hidden', 'important');
    n++;
  }
  const res = replaces.map(([p, t]) => [new RegExp(p, 'g'), t]);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let x; (x = w.nextNode());) {
    let v = x.nodeValue; const before = v;
    for (const [re, t] of res) v = v.replace(re, t);
    if (v !== before) { x.nodeValue = v; n++; }
  }
  for (const el of document.querySelectorAll('input')) {
    for (const [re, t] of res) if (re.test(el.value)) { el.value = el.value.replace(re, t); n++; }
  }
  return n;
}, { masks, replaces });

const png = out.replace(/\.webp$/i, '') + '.png';
const sel = opt('--selector');
const clip = opt('--clip'); // x,y,w,h (CSS px). 요소를 고르기 어려운 콘솔 화면에 쓴다
if (clip) {
  const [x, y, w, h] = clip.split(',').map(Number);
  await page.screenshot({ path: png, clip: { x, y, width: w, height: h } });
} else if (sel) {
  const el = page.locator(sel).first();
  if (!(await el.count())) await done(4, `SELECTOR_MISSING ${sel}`);
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: png });
} else {
  await page.screenshot({ path: png });
}

// WebP로 줄이기: 품질을 낮추고, 그래도 크면 폭을 줄인다.
const maxKB = Number(opt('--max-kb', 300));
let final = null;
outer: for (const resize of [0, 1600, 1280, 1000]) {
  for (const q of [82, 72, 62]) {
    const a = ['-quiet', '-q', String(q), '-m', '6'];
    if (resize) a.push('-resize', String(resize), '0');
    execFileSync('cwebp', [...a, png, '-o', out]);
    const kb = statSync(out).size / 1024;
    if (kb <= maxKB) { final = { q, resize, kb }; break outer; }
  }
}
if (existsSync(png)) unlinkSync(png);
if (!final) await done(5, `SIZE_OVER ${out} 가 ${maxKB}KB를 넘습니다. --selector로 범위를 줄이세요`);
await done(0, `SHOT_OK ${out} ${final.kb.toFixed(0)}KB q${final.q}${final.resize ? ' w' + final.resize : ''} 가림 ${masked}곳 (${new URL(page.url()).host})`);
