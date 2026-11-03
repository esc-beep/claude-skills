#!/usr/bin/env node
// 초안의 <img src="상대경로.webp|png|jpg|svg">를 data: URI로 바꿔 HTML 한 파일로 만든다.
// 사용: node inline-images.mjs <초안.html> <완성.html>
// 원격 주소(http, https)와 이미 data:인 것은 건드리지 않는다. 없는 파일이 있으면 종료 코드 1.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';

const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error('사용: node inline-images.mjs <초안.html> <완성.html>'); process.exit(2); }
const base = dirname(resolve(src));
const TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
let n = 0; const missing = [];
const html = readFileSync(src, 'utf8').replace(/(<img\b[^>]*?\bsrc=")([^"]+)(")/g, (m, a, p, b) => {
  if (/^(data:|https?:)/.test(p)) return m;
  const f = resolve(base, decodeURIComponent(p));
  const t = TYPES[extname(f).toLowerCase()];
  if (!t || !existsSync(f)) { missing.push(p); return m; }
  n++;
  return a + `data:${t};base64,` + readFileSync(f).toString('base64') + b;
});
writeFileSync(dst, html);
console.log(`인라인 ${n}장 → ${dst}`);
if (missing.length) { console.log('없는 그림: ' + missing.join(', ')); process.exit(1); }
