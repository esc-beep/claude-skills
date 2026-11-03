# 구조 다이어그램

먼저 `artifact-diagramming` 스킬을 읽는다(그림이 필요한 때, 두 테마에서 읽히는 SVG 그리기). 이 파일은 이 스킬의 규칙과 조각이다. 대괄호 숫자는 `sources.md` 출처 번호다.

## 고르기

- 문단이나 표보다 나을 때만 그린다. 3열 표로 같은 뜻이 되면 표를 쓴다. [7]
- 행동, 상태, 위험 중 무엇이 핵심인지 먼저 정하고 배치를 고른다. [7]

| 핵심 | 배치 | 기술 |
|---|---|---|
| 단계가 이어진다 | 단계 띠, 상자와 화살표 | CSS(`.flow`) |
| 원인이 사슬로 이어지고 대책과 짝을 이룬다 | 두 열 대응(왼쪽 원인 → 오른쪽 대책) | CSS grid |
| 구성 요소와 연결(아키텍처, 토폴로지) | 상자, 원통, 경계 | SVG |
| 시간 순서로 주고받는다 | 시퀀스 | Mermaid 또는 SVG |
| 상태가 바뀐다 | 상태 흐름 | Mermaid 또는 CSS |
| 맡은 쪽이 바뀐다(인계) | swimlane | CSS grid 또는 SVG |

기본은 직접 그린 CSS·SVG다. Mermaid는 시퀀스·상태 흐름을 빨리 그릴 때만 쓰고 Gantt에는 쓰지 않는다(`schedule.md`). [1][7]

## 규칙

- 메커니즘을 그린다. 화살표마다 동사를 단다(예: "가리킨다", "30초마다 읽는다"). [1]
- 밀도: 노드 9개, 화살표 12개, 강조 2개까지. 넘으면 5~8개짜리 개요 그림과 상세 그림으로 나눈다. [7][1]
- 시퀀스는 참여자 5개, 메시지 12개, 분기 틀 1개까지. swimlane은 레인 5개까지. [7]
- 번호 callout은 그림당 3개까지. [1][7]
- 모양으로 종류를 나눈다: 서비스는 사각형, 저장소는 원통, 큐는 칸막이 사각형, 선택·중단은 점선, 경계는 점선 사각형과 왼쪽 위 라벨. [1]
- 선: 실선은 동기, 점선은 비동기, 굵은 선은 주제 경로, X는 막힘. 축이 다른 노드는 직각 꺾임(모서리 반지름 8)으로 잇고 대각선을 쓰지 않는다. 선이 상자 뒤로 지나가거나 서로 겹치지 않게 한다. [1][7]
- 라벨은 배경색 사각형 위에 두고 선과 6~10px 띄운다. 범례는 그림 아래 가로 띠로. [7]
- 흐름도는 위에서 아래로. 결정 마름모의 출구는 3개 이하이고 모두 라벨. 상태 전이 라벨은 `사건 [조건] / 동작`. 전이가 상태의 두 배를 넘으면 그림을 나눈다. [7]
- 전후 비교는 같은 좌표·같은 축척으로 나란히. 추가는 실선, 삭제는 점선. [1]
- 그림의 사실을 본문에도 한 번 쓴다. [2]

## 글자와 390px

- SVG 글자는 줄바꿈되지 않는다. 약 18자(한글은 10자 안팎)에서 끊고 `tspan`을 쓴다. 한글은 영문보다 약 10% 넓으니 상자에 여유를 둔다. [1][7]
- viewBox 폭 960 그림은 390px 화면에서 0.4배가 되어 12px 글자가 5px가 된다. **390px에서 실제 글자 11px 이상**을 지킨다. 못 지키면 (가) CSS 배치로 바꿔 세로로 쌓이게 하거나, (나) `.scroll-x` 틀에 `min-width`를 주고 가로로 스크롤시킨다.
- 상자 간격 40 이상, 좌표는 4의 배수. 배치를 먼저 글로 잡고 그린다. [1][7]

## 접근성

- `<svg role="img" aria-labelledby="d1-t d1-d">`, 첫 자식에 `<title id="d1-t">`(60자 안팎), `<desc id="d1-d">`(내용 한 문장). [7]
- id에는 그림별 접두사를 붙인다(한 페이지에 그림이 여럿). 장식 SVG는 `aria-hidden="true"`. [7]
- 색은 `currentColor`나 CSS 변수로 칠한다. 색만으로 종류를 나누지 않는다. [2]

## 조각: 상자와 화살표(CSS, 좁으면 세로로)

```html
<div class="flow" role="list">
  <div class="node" role="listitem"><b>발견</b><span class="why">조사 중 한 줄로 적음</span></div>
  <span class="arrow" aria-hidden="true">→</span>
  <div class="node key" role="listitem"><b>기록</b><span class="why">상태·담당 없는 문장</span></div>
  <span class="arrow" aria-hidden="true">→</span>
  <div class="node old" role="listitem"><b>요약에서 빠짐</b><span class="why">다시 읽지 않으면 사라짐</span></div>
</div>
<style>
.flow { display: flex; flex-wrap: wrap; align-items: stretch; gap: 6px; }
.node { flex: 1 1 140px; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; font-size: .84rem; }
.node b { display: block; font-size: .9rem; margin-bottom: 2px; }
.node .why { color: var(--muted); }
.node.key { border-color: var(--accent); background: var(--accent-soft); }
.node.bad { border-color: var(--block); background: var(--block-soft); }
.node.old { border-style: dashed; }
.arrow { flex: 0 0 auto; align-self: center; color: var(--muted); }
@media (max-width: 720px) { .node { flex-basis: 100%; } .arrow { flex-basis: 100%; text-align: center; transform: rotate(90deg); } }
</style>
```

## 조각: 원인 → 대책 대응(두 열)

```html
<div class="pairs">
  <div class="pair">
    <div class="pair-cause"><span class="n">1</span><b>원인</b><p>짧은 설명</p></div>
    <div class="pair-fix"><b>대책</b><p>짧은 설명</p><p class="pair-gate">완료 판정: …</p></div>
  </div>
</div>
<style>
.pairs { display: grid; gap: 10px; margin-top: 12px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--surface); }
.pair-cause, .pair-fix { padding: 12px 14px; font-size: .86rem; min-width: 0; }
.pair-cause { border-right: 1px solid var(--line); position: relative; }
.pair-cause::after { content: "→"; position: absolute; right: -9px; top: 12px; background: var(--surface); color: var(--muted); }
.pair-cause .n { font-family: var(--font-data); color: var(--block); margin-right: 6px; }
.pair-fix { background: var(--pass-soft); }
.pair-gate { color: var(--muted); font-size: .8rem; margin: 6px 0 0; }
@media (max-width: 640px) { .pair { grid-template-columns: 1fr; } .pair-cause { border-right: 0; border-bottom: 1px solid var(--line); } .pair-cause::after { content: "↓"; right: auto; left: 14px; top: auto; bottom: -11px; } }
</style>
```

## 조각: SVG 화살표 머리(두 테마)

```html
<svg viewBox="0 0 640 160" width="100%" role="img" aria-labelledby="a1-t" style="color:var(--muted)">
  <title id="a1-t">워커가 큐를 읽고 DB에 쓴다</title>
  <defs><marker id="a1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <rect x="20" y="52" width="140" height="56" rx="8" fill="var(--surface)" stroke="var(--line)"/>
  <text x="90" y="85" text-anchor="middle" font-size="14">워커</text>
  <path d="M160,80 H300" stroke="currentColor" stroke-width="1.5" marker-end="url(#a1-head)"/>
  <rect x="236" y="62" width="40" height="16" fill="var(--bg)"/><text x="256" y="74" text-anchor="middle" font-size="11" class="muted">읽는다</text>
</svg>
```

## Mermaid를 쓸 때

버전 `12.2.0` 고정(2026-10-13 배포, v12는 레이아웃 엔진 기본값이 ELK로 바뀐 판). 뷰어 CSP에서 시퀀스와 Gantt가 그려지는 것을 2026-11-03 실측했다. 같은 시험에서 어두운 화면의 Gantt는 "끝난 작업" 막대가 밝은 회색에 흰 글자라 읽히지 않았다. 그래서 Gantt에는 쓰지 않는다.

```html
<figure class="fig scroll-x"><pre class="mermaid" data-src>
sequenceDiagram
  participant A as 요청자
  participant W as 워커
  A->>W: 작업 등록
  W-->>A: 처리 결과
</pre><figcaption>주장 한 문장.</figcaption></figure>
<script src="https://cdn.jsdelivr.net/npm/mermaid@12.2.0/dist/mermaid.min.js"></script>
<script>
(() => {
  const els = [...document.querySelectorAll('pre.mermaid')];
  els.forEach(e => e.dataset.src = e.textContent);           // 다시 그리려고 원문을 보관한다
  const hex = v => { const c = document.createElement('canvas').getContext('2d'); c.fillStyle = v; return c.fillStyle; };
  const tok = n => hex(getComputedStyle(document.documentElement).getPropertyValue(n).trim());
  async function draw() {
    els.forEach(e => { e.removeAttribute('data-processed'); e.textContent = e.dataset.src; });
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base', look: 'classic',
      themeVariables: { background: tok('--surface'), primaryColor: tok('--accent-soft'), primaryBorderColor: tok('--accent'),
        primaryTextColor: tok('--ink'), lineColor: tok('--muted'), secondaryColor: tok('--surface-2'), tertiaryColor: tok('--surface'),
        actorBkg: tok('--accent-soft'), actorBorder: tok('--accent'), actorTextColor: tok('--ink'), signalColor: tok('--ink'),
        signalTextColor: tok('--ink'), noteBkgColor: tok('--hold-soft'), noteTextColor: tok('--ink'), fontSize: '14px',
        fontFamily: getComputedStyle(document.body).fontFamily } });
    await document.fonts.ready;
    await mermaid.run({ nodes: els });
  }
  draw().catch(e => console.error('mermaid', e));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => draw());
})();
</script>
```

함정:
- `theme: 'base'`일 때만 themeVariables가 모두 적용된다. 값은 hex만 받으므로 토큰을 hex로 바꿔 넣는다(위 `hex`). [1][4]
- 초기화는 한 번 정해지면 그대로다. 테마 전환은 원문을 보관해 두었다가 다시 렌더한다(위 `draw`). [1]
- 웹 글꼴이 다 받아진 뒤 렌더한다(`document.fonts.ready`). [4]
- 라벨 문법: `/`, `\`, `(`, `{`로 시작하거나 괄호·콜론·쉼표가 들어가면 따옴표로 감싼다. 줄바꿈은 `<br/>`. id는 영숫자만. 시퀀스 메시지에 `{}[]<>&`가 있으면 그림 전체가 깨진다. stateDiagram-v2 전이 라벨에는 `<br/>`, 괄호, 두 번째 콜론을 쓰지 않는다. [1]
- 모르는 키워드는 그림을 깨고, 잘못된 설정값은 조용히 무시된다. 그려진 화면을 반드시 본다. [4]
- 노드가 5개 이상이거나 분기가 있으면 `TD`, 3~4개 직선만 `LR`. 390px에서는 `TD`가 낫다. [1]
- 뷰어 모드에서는 아이콘(iconify), `click`·`link`, 이미지 노드를 쓰지 않는다. 외부 요청을 만든다. [4]
- `classDef`·`style`에 글자색을 하드코딩하지 않는다. 채우기는 반투명 8자리 hex. [1]
