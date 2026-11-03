# 상호작용

필터·정렬 표, 탭, 접기, 계산기, 퀴즈, 단계별 재생 그림. 대괄호 숫자는 `sources.md` 출처 번호다.

## 공통 규칙

- JS가 없거나 막혀도 기본 화면은 완성되어 보여야 한다. 모든 행, 첫 탭, 기본값 결과가 HTML에 이미 그려져 있고, JS는 그 위에 고르기만 더한다. [1][6]
- 상태 저장(`localStorage`)은 편의 기능이다. try로 감싸고(`assets/base.html`의 `safeGet`·`safeSet`), 저장이 안 돼도 동작해야 한다. 뷰어 sandbox에는 `allow-same-origin`이 없다.
- 밖으로 요청하지 않는다(`fetch` 금지). 데이터는 HTML 안에 둔다.
- 키보드로 다 쓸 수 있어야 한다. 포커스 표시를 지우지 않는다. 움직임 줄이기 설정이면 움직임 없이 최종 상태를 보인다. [5]
- 복사 버튼(Clipboard API)은 sandbox에서 막힐 수 있다. 실패하면 선택할 수 있는 글을 보인다. [6]

## 접기

- 우선순위가 낮은 것(원자료, 파일 목록, 결정 기록, 방법론, 지난 검토, 고급 옵션)은 `<details>`로 접는다. [1][2][3]
- 다음 단계처럼 먼저 봐야 할 것은 `<details open>`. summary에 항목 수를 쓴다(예: "남은 일 12개"). [2]

## 조각: 필터·정렬 표

4행 이상이거나 3열 이상이면 상태 chip이 든 표로 만든다. 머리글 고정, 넓은 표는 `.table-wrap`. 가져온 글은 이스케이프해서 넣는다. [1][2][3]

```html
<div class="ft" data-ft>
  <div class="ft-bar">
    <div class="ft-chips" role="group" aria-label="시기">
      <button type="button" aria-pressed="true" data-k="when" data-v="">전체</button>
      <button type="button" aria-pressed="false" data-k="when" data-v="before">전환 전·중</button>
      <button type="button" aria-pressed="false" data-k="when" data-v="after">전환 후</button>
    </div>
    <input type="search" placeholder="검색" aria-label="표 검색" data-q>
    <span class="ft-n" aria-live="polite"></span>
  </div>
  <div class="table-wrap"><table class="wide">
    <thead><tr><th><button type="button" data-sort="0">#</button></th><th>문제</th><th><button type="button" data-sort="2">상태</button></th></tr></thead>
    <tbody>
      <tr data-when="before" data-state="done"><td class="num">1</td><td>무엇이 빠졌나</td><td><span class="chip pass">해결</span></td></tr>
      <tr data-when="after" data-state="open"><td class="num">2</td><td>무엇이 빠졌나</td><td><span class="chip hold">남음</span></td></tr>
    </tbody>
  </table></div>
</div>
<style>
.ft-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 12px; }
.ft-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.ft-chips button, th button { font: inherit; font-size: .8rem; border: 1px solid var(--line); background: var(--surface); color: var(--ink); border-radius: 999px; padding: 3px 10px; cursor: pointer; }
th button { border: 0; background: none; padding: 0; font-weight: 600; font-size: inherit; }
.ft-chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--surface); }
.ft-bar input { font: inherit; font-size: .86rem; padding: 4px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); min-width: 0; flex: 1 1 160px; }
.ft-n { font-size: .8rem; color: var(--muted); }
</style>
<script>
document.querySelectorAll('[data-ft]').forEach(root => {
  const rows = [...root.querySelectorAll('tbody tr')];
  const f = {}; const q = root.querySelector('[data-q]'); const n = root.querySelector('.ft-n');
  function apply() {
    const s = (q?.value || '').trim().toLowerCase(); let shown = 0;
    rows.forEach(r => {
      const ok = Object.entries(f).every(([k, v]) => !v || (r.dataset[k] || '').split(' ').includes(v)) && (!s || r.textContent.toLowerCase().includes(s));
      r.hidden = !ok; if (ok) shown++;
    });
    if (n) n.textContent = `${shown} / ${rows.length}건`;
  }
  root.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach(x => x.setAttribute('aria-pressed', x === b));
    f[b.dataset.k] = b.dataset.v; apply();
  }));
  q?.addEventListener('input', apply);
  root.querySelectorAll('[data-sort]').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.sort, dir = b.dataset.dir = b.dataset.dir === 'asc' ? 'desc' : 'asc', tb = root.querySelector('tbody');
    rows.sort((a, c) => { const x = a.cells[i].textContent.trim(), y = c.cells[i].textContent.trim(); const r = (+x && +y) ? x - y : x.localeCompare(y, 'ko'); return dir === 'asc' ? r : -r; })
        .forEach(r => tb.appendChild(r));
  }));
  apply();
});
</script>
```

`data-*` 값이 여럿이면 공백으로 나눈다(예: `data-type="entry attach"`).

### 좁은 화면에서는 행을 카드로

열이 5개 넘는 표는 390px에서 가로 스크롤 상자 안에서도 칸이 좁아져 한 행이 길게 늘어진다. JS가 머리글을 칸 라벨(`data-l`)로 붙이고 `cards` 클래스를 더해, 좁은 화면에서는 행마다 카드로 보인다. JS가 없으면 가로 스크롤 표로 남는다. 머리글에 꼬리표가 붙어 있으면 `<th data-l="유형">`처럼 라벨을 따로 준다.

```html
<style>
tr[hidden] { display: none !important; }   /* 아래 display:block이 hidden을 이기지 않게 */
@media (max-width: 640px) {
  table.cards { min-width: 0; }
  table.cards thead { display: none; }
  table.cards tr { display: block; padding: 10px 12px; border-bottom: 1px solid var(--line); }
  table.cards td { display: block; border: 0; padding: 2px 0; }
  table.cards td::before { content: attr(data-l); display: inline-block; min-width: 4.6em; color: var(--muted); font-size: .74rem; margin-right: 6px; }
}
</style>
<script>
document.querySelectorAll('[data-ft]').forEach(root => {
  const heads = [...root.querySelectorAll('thead th')].map(th => th.dataset.l || th.textContent.trim());
  root.querySelectorAll('tbody tr').forEach(r => [...r.cells].forEach((td, i) => td.dataset.l = heads[i] || ''));
  root.querySelector('table').classList.add('cards');
});
</script>
```

## 조각: 탭

상태 보고에서만 쓴다(학습·설명은 탭 없이 긴 페이지). 탭 id는 바꾸지 않는다. 배너와 다음 단계는 탭 밖에 둔다. 빈 탭을 두지 않는다. [2][9]

```html
<div class="tabs" data-tabs>
  <div role="tablist" aria-label="보기">
    <button role="tab" id="t-over" aria-controls="p-over" aria-selected="true">개요</button>
    <button role="tab" id="t-risk" aria-controls="p-risk" aria-selected="false" tabindex="-1">위험</button>
  </div>
  <section role="tabpanel" id="p-over" aria-labelledby="t-over">…</section>
  <section role="tabpanel" id="p-risk" aria-labelledby="t-risk" hidden>…</section>
</div>
<style>
[role="tablist"] { display: flex; gap: 2px; border-bottom: 1px solid var(--line); overflow-x: auto; }
[role="tab"] { font: inherit; font-size: .88rem; padding: 8px 14px; border: 0; background: none; color: var(--muted); border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; }
[role="tab"][aria-selected="true"] { color: var(--ink); border-bottom-color: var(--accent); font-weight: 600; }
[role="tabpanel"] { padding-top: 12px; }
</style>
<script>
document.querySelectorAll('[data-tabs]').forEach(root => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  function sel(t) { tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
    document.getElementById(x.getAttribute('aria-controls')).hidden = !on; }); t.focus(); if (typeof safeSet === 'function') safeSet('tab:' + location.pathname, t.id); }
  tabs.forEach((t, i) => { t.addEventListener('click', () => sel(t));
    t.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) sel(tabs[(i + d + tabs.length) % tabs.length]); }); });
  const saved = typeof safeGet === 'function' && safeGet('tab:' + location.pathname); const st = saved && document.getElementById(saved);
  if (st && tabs.includes(st)) sel(st);
});
</script>
```

## 조각: 계산기

컨트롤 1~3개. 상태 객체 하나, 순수 함수 `model(s)` 하나가 숫자·그림·문장을 함께 바꾼다. 적용 버튼 없이 즉시 다시 그린다. 기본값은 현재 실측값이고, 프리셋 3~5개가 모든 컨트롤을 한 번에 맞춘다. 수식은 접어 두고, 단순 모델에는 "예시"라고 붙인다. 결과 문장은 기본값과 다른 점만 쓴다. [1][6]

```html
<div class="card calc" data-calc>
  <div class="presets"><button type="button" data-p='{"rps":120,"pods":3}'>지금(실측)</button><button type="button" data-p='{"rps":400,"pods":3}'>발매 피크</button></div>
  <label>초당 요청 <input type="range" min="0" max="1000" step="10" value="120" data-s="rps"> <output data-o="rps">120</output></label>
  <label>파드 수 <input type="range" min="1" max="10" value="3" data-s="pods"> <output data-o="pods">3</output></label>
  <p class="calc-out" aria-live="polite">파드당 40 rps. 한도 150 rps 안이다.</p>
  <details><summary>계산식</summary><p><code>파드당 = 초당 요청 ÷ 파드 수</code>, 한도는 실측 150 rps(예시)</p></details>
</div>
<style>
.calc .presets { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.calc label { display: grid; grid-template-columns: minmax(0, 7em) 1fr 3.5em; gap: 10px; align-items: center; font-size: .88rem; margin: 6px 0; }
.calc output { font-family: var(--font-data); font-variant-numeric: tabular-nums; text-align: right; }
.calc-out { margin: 10px 0 0; font-weight: 600; }
</style>
<script>
document.querySelectorAll('[data-calc]').forEach(root => {
  const st = {}; root.querySelectorAll('[data-s]').forEach(i => st[i.dataset.s] = +i.value);
  const model = s => { const per = s.rps / s.pods; return { per, ok: per <= 150 }; };
  function updateAll() {
    const m = model(st);
    root.querySelectorAll('[data-s]').forEach(i => { i.value = st[i.dataset.s]; root.querySelector(`[data-o="${i.dataset.s}"]`).textContent = st[i.dataset.s]; });
    root.querySelector('.calc-out').textContent = `파드당 ${m.per.toFixed(0)} rps. ${m.ok ? '한도 150 rps 안이다.' : '한도 150 rps를 넘는다.'}`;
  }
  root.querySelectorAll('[data-s]').forEach(i => i.addEventListener('input', () => { st[i.dataset.s] = +i.value; updateAll(); }));
  root.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { Object.assign(st, JSON.parse(b.dataset.p)); updateAll(); }));
});
</script>
```

## 조각: 퀴즈(학습·설명)

5문항, 객관식, 중간 난이도, 함정 없음. 누르면 정답 여부와 **선택지마다 이유**를 보인다. [9]

```html
<div class="quiz" data-quiz>
  <fieldset class="card q"><legend>1. 질문</legend>
    <button type="button" data-ok="0" data-why="이 선택지가 틀린 이유">보기 A</button>
    <button type="button" data-ok="1" data-why="이 선택지가 맞는 이유">보기 B</button>
    <p class="why" aria-live="polite"></p>
  </fieldset>
</div>
<style>
.q { margin-top: 10px; } .q legend { font-weight: 600; padding: 0 4px; }
.q button { display: block; width: 100%; text-align: left; font: inherit; font-size: .9rem; margin: 6px 0 0; padding: 8px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); color: var(--ink); cursor: pointer; }
.q button.right { border-color: var(--pass); background: var(--pass-soft); } .q button.wrong { border-color: var(--block); background: var(--block-soft); }
.q button.right::before { content: "맞음 · "; font-weight: 600; } .q button.wrong::before { content: "틀림 · "; font-weight: 600; }
.why { font-size: .86rem; color: var(--muted); margin: 8px 0 0; }
</style>
<script>
document.querySelectorAll('[data-quiz] .q').forEach(q => q.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
  q.querySelectorAll('button').forEach(x => x.classList.remove('right', 'wrong'));
  b.classList.add(b.dataset.ok === '1' ? 'right' : 'wrong'); q.querySelector('.why').textContent = b.dataset.why;
})));
</script>
```

## 단계별 재생 그림

- 완성 그림에서 시작하고 자동 재생하지 않는다. 정지 화면만으로 뜻이 통해야 한다. [1][7]
- 단계마다 한 부분이 나타나고 한 줄 캡션(이유와 근거 위치)이 붙는다. 상태 재생이면 한 단계에 사건 하나, 6~12단계(예산 8단계, 동시 움직임 2개). [1][7]
- `transform`, `opacity`, `stroke-dashoffset`만 움직인다. 움직임 줄이기 설정이면 최종 상태만 보인다. [1]
- 본문 용어와 그림 부품을 `data-ref`로 이어, 용어에 포커스하면 그림의 2~4곳이 함께 강조되게 할 수 있다. [1]

```html
<figure class="fig" data-steps>
  <svg viewBox="0 0 640 140" width="100%" role="img" aria-label="세 단계 흐름">
    <g data-step="1"><rect x="20" y="40" width="160" height="60" rx="8" fill="var(--surface)" stroke="var(--line)"/><text x="100" y="75" text-anchor="middle">1단계</text></g>
    <g data-step="2"><rect x="240" y="40" width="160" height="60" rx="8" fill="var(--surface)" stroke="var(--line)"/><text x="320" y="75" text-anchor="middle">2단계</text></g>
  </svg>
  <div class="steps-bar"><button type="button" data-prev aria-label="이전">◀</button><input type="range" min="1" max="2" value="2" aria-label="단계"><button type="button" data-next aria-label="다음">▶</button><span class="steps-cap" aria-live="polite"></span></div>
  <ol hidden class="caps"><li>1단계 캡션: 무엇이 왜 일어났나(근거 위치)</li><li>2단계 캡션</li></ol>
</figure>
<style>
[data-step] { transition: opacity .3s; } [data-step].off { opacity: .12; }
.steps-bar { display: flex; gap: 8px; align-items: center; margin-top: 8px; font-size: .84rem; flex-wrap: wrap; }
.steps-bar input { flex: 1 1 120px; } .steps-cap { flex: 1 1 100%; color: var(--muted); }
</style>
<script>
document.querySelectorAll('[data-steps]').forEach(f => {
  const parts = [...f.querySelectorAll('[data-step]')], caps = [...f.querySelectorAll('.caps li')].map(li => li.textContent);
  const r = f.querySelector('input[type=range]'), cap = f.querySelector('.steps-cap');
  const show = k => { r.value = k; parts.forEach(p => p.classList.toggle('off', +p.dataset.step > k)); cap.textContent = caps[k - 1] || ''; };
  r.addEventListener('input', () => show(+r.value));
  f.querySelector('[data-prev]').onclick = () => show(Math.max(1, +r.value - 1));
  f.querySelector('[data-next]').onclick = () => show(Math.min(+r.max, +r.value + 1));
  show(+r.max);
});
</script>
```
