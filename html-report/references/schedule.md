# 일정·계획

Gantt, 마일스톤, 타임라인, 판정 시점. 기본은 CSS로 그린다(Mermaid Gantt는 어두운 화면 대비가 나빠 쓰지 않는다, `diagrams.md`). 대괄호 숫자는 `sources.md` 출처 번호다.

## 고르기

| 보여 줄 것 | 그림 |
|---|---|
| 시작·끝이 있는 작업, 겹침·병렬, 판정 시점 | Gantt |
| 지난 사건을 시간 순서로(사고, 전환 당일) | 세로 타임라인 |
| 단계가 차례로 끝남(진행 현황) | 단계 띠(`assets/base.html`의 카드 + `diagrams.md`의 `.flow`) |
| 앞으로의 기간별 할 일 | 일정 띠(기간 칸 + 판정 칸 강조) |

## 규칙

- Gantt는 작업 12개, 단계당 병렬 5개까지. 넘으면 단계 수준으로 접거나 하위 계획으로 나눈다. [7]
- 강조 막대는 하나(핵심 산출물이나 임계 경로). 막대 라벨에 날짜를 쓰지 않는다(축이 말한다). [7]
- 의존 화살표는 꼭 필요할 때만. 상태 보고에서는 "X 다음"이나 번호로 보인다. [7][2]
- 오늘은 세로 점선. 막대 길이는 기간에 비례한다. 간격도 시간에 비례하고, 빽빽한 구간은 축 끊김으로 표시한다. [7]
- 마일스톤(판정 시점)마다 **무엇으로 판정하는지**를 쓴다: 관측 가능한 확인 방법, 지표와 임계값, 실패하면 무엇을 하는지. [2]
- 열린 질문에는 "누구와, 어느 단계 전까지", 위험에는 결정자와 기한을 쓴다. [8][2]
- 사고 타임라인은 세로 목록. 시각은 mono. 영향 시작, 완화, 복구는 모양이 다른 점으로 나눈다. 틀린 가설과 그로 인한 지연도 남긴다. [8]
- 최신 항목이나 지금 위치를 강조한다. 기간 값(예: "4일")은 치수선으로 그린다. [1]
- 390px: 라벨 열과 시간축을 나란히 두면 들어가지 않는다. 좁은 화면에서는 작업명을 막대 위로 올린다(아래 조각이 그렇게 한다).

## 조각: Gantt(퍼센트 배치, 라이브러리 없음)

막대 위치는 작성할 때 날짜에서 계산해 `--s`(시작 %), `--w`(폭 %)로 넣는다. 화면 폭이 바뀌어도 비율이 유지되고, 좁으면 라벨이 위로 올라간다.

```html
<figure class="fig">
  <div class="gantt" role="img" aria-label="07-11부터 10-21까지 8단계 일정">
    <div class="g-axis"><span style="--s:0%">07-11</span><span style="--s:24.1%">08-01</span><span style="--s:48.2%">09-01</span><span style="--s:72.3%">10-01</span><span style="--s:100%">10-21</span></div>
    <div class="g-row"><span class="g-lab">결정<small>INF-1076</small></span><span class="g-track"><i class="g-bar done" style="--s:0%;--w:12.1%"></i></span></div>
    <div class="g-row"><span class="g-lab">전환<small>INF-1677</small></span><span class="g-track"><i class="g-bar key" style="--s:88%;--w:1.5%"></i><b class="g-mk" style="--s:88%">10-16 DNS 전환</b></span></div>
    <div class="g-today" style="--t:1" aria-hidden="true"></div>
  </div>
  <div class="legend"><span><i style="background:var(--pass)"></i>끝</span><span><i style="background:var(--block)"></i>핵심</span><span><i style="background:var(--plan)"></i>다음</span></div>
  <figcaption>주장 한 문장. <span class="src-tag">정본 1절</span></figcaption>
</figure>
<style>
.gantt { position: relative; --lab: 9.5rem; }
.g-axis { position: relative; height: 22px; margin-left: var(--lab); border-bottom: 1px solid var(--line); font-family: var(--font-data); font-size: .72rem; color: var(--muted); }
.g-axis span { position: absolute; left: var(--s); transform: translateX(-50%); white-space: nowrap; }
.g-axis span:first-child { transform: none; } .g-axis span:last-child { transform: translateX(-100%); }
.g-row { display: grid; grid-template-columns: var(--lab) 1fr; align-items: center; min-height: 34px; border-bottom: 1px dashed var(--line); }
.g-lab { font-size: .84rem; font-weight: 600; line-height: 1.25; padding-right: 8px; }
.g-lab small { display: block; font-weight: 400; color: var(--muted); font-family: var(--font-data); font-size: .72rem; }
.g-track { position: relative; height: 34px; }
.g-bar { position: absolute; top: 9px; height: 16px; left: var(--s); width: max(var(--w), 6px); border-radius: 4px; background: var(--accent); }
.g-bar.done { background: var(--pass); } .g-bar.key { background: var(--block); } .g-bar.next { background: var(--plan); opacity: .85; } .g-bar.wait { background: var(--hold); }
.g-mk { position: absolute; left: var(--s); top: -2px; font: 600 .7rem var(--font-body); color: var(--ink); white-space: nowrap; transform: translateX(-50%); }
.g-today { position: absolute; top: 0; bottom: 0; left: calc(var(--lab) + (100% - var(--lab)) * var(--t)); border-left: 2px dotted var(--block); }
@media (max-width: 560px) {
  .gantt { --lab: 0px; }
  .g-row { grid-template-columns: 1fr; padding-top: 4px; }
  .g-lab { padding: 0; } .g-lab small { display: inline; margin-left: 6px; }
}
</style>
```

`--s`·`--w` 계산(작성할 때 한 번):

```bash
python3 -c 'import datetime as d,sys;a,b=[d.date.fromisoformat(x) for x in sys.argv[1:3]];t=(b-a).days
for s,e in zip(sys.argv[3::2],sys.argv[4::2]):
  S,E=d.date.fromisoformat(s),d.date.fromisoformat(e);print(s,e,f"--s:{(S-a).days/t*100:.1f}%;--w:{((E-S).days+1)/t*100:.1f}%")' 2026-07-11 2026-10-21 2026-07-11 2026-07-24 2026-10-16 2026-10-16
```

오늘 선의 `--t`는 0~1 비율(단위 없음)이다. `%`를 넣으면 calc가 깨진다.

## 조각: 세로 타임라인(사건)

```html
<ol class="tl">
  <li class="ev ev-impact"><time>HH:MM</time><b>영향 시작</b><p>무엇이, 어디서</p></li>
  <li class="ev ev-wrong"><time>HH:MM</time><b>틀린 가설</b><p>무엇으로 판단했고 왜 틀렸나</p></li>
  <li class="ev ev-fix"><time>HH:MM</time><b>복구</b><p>무엇을 바꿨나</p></li>
</ol>
<style>
.tl { list-style: none; margin: 12px 0 0 8px; padding: 0 0 0 22px; border-left: 2px solid var(--line); }
.ev { position: relative; margin: 0 0 14px; font-size: .88rem; }
.ev::before { content: ""; position: absolute; left: -29px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--surface); border: 2px solid var(--muted); }
.ev time { display: block; font-family: var(--font-data); font-size: .76rem; color: var(--muted); }
.ev b { display: block; } .ev p { margin: 2px 0 0; color: var(--muted); }
.ev.ev-impact::before { background: var(--block); border-color: var(--block); border-radius: 2px; }   /* 네모: 영향 시작 */
.ev.ev-fix::before { background: var(--pass); border-color: var(--pass); }                            /* 채운 원: 복구 */
.ev.ev-wrong::before { border-style: dashed; border-color: var(--hold); }                             /* 점선 원: 틀린 가설 */
.ev.ev-now::before { box-shadow: 0 0 0 4px var(--accent-soft); border-color: var(--accent); }
</style>
```

범례에 모양의 뜻(네모 = 영향 시작, 채운 원 = 복구, 점선 원 = 틀린 가설)을 글로 적는다. 정본에 없는 시각은 지어내지 않는다. 시각을 모르면 날짜만 쓴다.

## 조각: 일정 띠(앞으로)

```html
<div class="plan-band">
  <div class="slot"><span class="when">11-03 ~ 11-07</span><b>할 일</b><p>누가 · 무엇</p></div>
  <div class="slot gate"><span class="when">11-10 판정</span><b>판정 기준</b><p>지표와 임계값 · 실패 시 무엇을</p></div>
</div>
<style>
.plan-band { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(170px, 100%), 1fr)); margin-top: 12px; }
.plan-band .slot { background: var(--surface); border: 1px solid var(--line); margin: -1px 0 0 -1px; padding: 12px; font-size: .84rem; min-width: 0; }
.plan-band .slot .when { display: block; font-family: var(--font-data); font-size: .76rem; color: var(--plan); font-weight: 500; }
.plan-band .slot.gate { background: var(--plan-soft); }
.plan-band .slot p { margin: 2px 0 0; color: var(--muted); }
</style>
```
