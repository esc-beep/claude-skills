# 수치 차트·KPI

먼저 `dataviz` 스킬을 읽는다(그림 종류 고르기, 색 공식, 차트 요소 규격). 이 파일은 그 위에 얹는 이 스킬의 규칙과 복사해 쓰는 조각이다. 대괄호 숫자는 `sources.md` 출처 번호다.

## 고르기

| 보여 줄 것 | 그림 | 기술 |
|---|---|---|
| 크기·순위 | 정렬한 가로 막대 | SVG 또는 CSS |
| 비율 | waffle, 100% 누적 막대 | CSS |
| 추이(점 30개 이하) | 선, KPI의 추이선 | SVG polyline |
| 추이(점이 많거나 값을 짚어 봐야 함) | 선 | Chart.js |
| 구간(기간, 크기 범위) | 치수선 | SVG |
| 분포 | 히스토그램 | SVG |
| 둘의 관계 | 산점도 | SVG(점 30개 넘으면 Chart.js) |

[1][7]

## 규칙

- 숫자마다 그림이 필요하지는 않다. 그림이 주장 하나를 보여 줄 때만 넣는다. 주장은 figcaption 한 문장으로 쓴다. [1]
- 막대는 0에서 시작한다. 순서에 뜻이 없으면 값으로 정렬한다. small multiples는 축을 공유한다. 선 차트의 가로:세로는 2:1~3:1. [1]
- 시리즈가 5개 미만이면 범례 대신 끝에 직접 라벨(단위 포함)을 단다. 주석은 차트당 1~2개. [1]
- 테두리, 플롯 배경, 진한 격자, 3D, 그림자를 쓰지 않는다. 격자는 값을 읽어야 할 때만 옅게. [1]
- 숫자는 `tabular-nums`, 표에서는 오른쪽 정렬. 라벨마다 단위, 비교 기준(전 기간, 목표)을 쓴다. [1]
- 범주 색은 5개까지, 토큰 `--accent`, `--pass`, `--hold`, `--block`, `--plan` 순. 순차는 한 색의 명도 단계. 강조는 화면의 10% 이하. [1]
- 한 그림의 예산: 막대 8개, 선 시리즈 5개, 점 30개, 강조 1개. 넘으면 나누거나 묶는다. [7]
- 변화 색은 좋고 나쁨을 따른다(오류율 하락은 좋음, `--pass`). 색만으로 뜻을 전하지 않는다. ▲▼와 부호를 함께 쓴다. [3]
- 데이터는 정본에서 읽은 값만 쓴다. 이 보고서가 직접 세거나 묶은 값은 출처 꼬리표에 "이 보고서가 셈"으로 표시한다. 원자료 발췌 표와 방법은 `<details>`로 접어 붙인다. [3]
- 캔버스 차트에는 핵심 수치를 담은 대체 텍스트를 붙인다. SVG에는 `role="img"`와 `aria-label`을 준다. [1]

## 조각: 정렬한 가로 막대(CSS, 라이브러리 없음)

390px에서는 라벨이 막대 위로 올라간다.

```html
<figure class="fig">
  <div class="hbars" role="img" aria-label="원인 유형별 건수: 부속 미복제 6, 진입점 6, 재개 누락 6">
    <div class="hb"><span class="hb-l">부속 구성 미복제</span><span class="hb-t"><i style="width:100%"></i></span><span class="hb-v">6</span></div>
    <div class="hb"><span class="hb-l">일부러 끈 값의 재개 누락</span><span class="hb-t"><i style="width:83%"></i></span><span class="hb-v">5</span></div>
  </div>
  <figcaption>주장 한 문장. <span class="src-tag">이 보고서가 셈</span></figcaption>
</figure>
<style>
.hbars { display: grid; gap: 8px; }
.hb { display: grid; grid-template-columns: minmax(0, 13em) 1fr 3em; gap: 10px; align-items: center; font-size: .86rem; }
.hb-t { background: var(--line); border-radius: 4px; height: 14px; overflow: hidden; }
.hb-t i { display: block; height: 100%; background: var(--accent); }
.hb.key .hb-t i { background: var(--block); }
.hb-v { font-family: var(--font-data); font-variant-numeric: tabular-nums; text-align: right; }
@media (max-width: 560px) { .hb { grid-template-columns: 1fr 3em; } .hb-l { grid-column: 1 / -1; } }
</style>
```

폭은 최댓값 대비 백분율로 계산해 넣는다(값을 지어내지 않는다).

## 조각: KPI 카드와 추이선(SVG)

```html
<div class="card kpi">
  <div class="lbl">전환 후 누락</div>
  <div class="num">14<span class="unit">건</span></div>
  <svg class="spark" viewBox="0 0 100 24" preserveAspectRatio="none" role="img" aria-label="일별 발견: 10-19 2건, 10-20 9건, 10-21 3건">
    <polyline fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke" points="0,18 50,2 100,15"/>
  </svg>
  <span class="src">실측 · 10-19~10-21 · 정본 3절</span>
</div>
```

points는 값을 0~24 높이(위가 큰 값)로 바꿔 넣는다. 점이 1~2개면 추이선을 그리지 않는다. [1]

## 조각: 선 차트(SVG, 점 30개 이하)

```html
<figure class="fig scroll-x">
  <svg viewBox="0 0 640 240" width="100%" style="min-width:420px" role="img" aria-labelledby="ln-t">
    <title id="ln-t">주별 건수 추이</title>
    <g class="muted" font-size="12">
      <line x1="40" y1="200" x2="620" y2="200" stroke="var(--line)"/>
      <text x="40" y="220">10-01</text><text x="620" y="220" text-anchor="end">10-29</text>
      <text x="32" y="204" text-anchor="end">0</text><text x="32" y="44" text-anchor="end">10</text>
    </g>
    <polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="40,170 233,90 426,130 620,60"/>
    <circle cx="620" cy="60" r="4" fill="var(--accent)"/>
    <text x="612" y="50" text-anchor="end" font-size="12">9건</text>
  </svg>
  <figcaption>주장 한 문장. <span class="src-tag">실측</span></figcaption>
</figure>
```

## Chart.js를 쓸 때

조건: 점이 많은 시계열, 마우스로 값을 짚어 봐야 하는 차트. 단순 수치와 추이선은 위 조각으로 그린다. [1]

```html
<figure class="fig">
  <div style="position:relative;height:260px"><canvas id="c1" aria-label="주별 요청 수, 최대 10-22 9건"></canvas></div>
  <figcaption>주장 한 문장.</figcaption>
</figure>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script>
(() => {
  const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let chart;
  function draw() {
    chart?.destroy();
    chart = new Chart(document.getElementById('c1'), {
      type: 'line',
      data: { labels: ['10-01','10-08','10-15','10-22'], datasets: [{ label: '요청 수', data: [3,7,4,9], borderColor: tok('--accent'), pointRadius: 2, tension: 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tok('--muted') }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { color: tok('--muted') }, grid: { color: tok('--line') } }
        }
      }
    });
  }
  draw();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
})();
</script>
```

함정:
- canvas는 반드시 `position:relative`에 높이를 정한 div로 감싼다(미니 40px, 본 차트 240~280px). 높이가 없으면 ResizeObserver가 반복 호출되며 차트가 끝없이 커지다 브라우저가 멈춘다. canvas의 `height` 속성으로 레이아웃을 잡지 않는다. [3]
- `responsive:true`와 `maintainAspectRatio:false`를 같이 준다. [3]
- 색은 생성할 때 고정된다. 글자·격자 색은 `getComputedStyle`로 토큰에서 읽고, 테마가 바뀌면 다시 그린다(위 `draw`). [1]
- 미니 차트는 범례·툴팁·축을 끄고 점 반지름 0. [3]
- 버전은 `4.5.1` 고정(2025-10-13 배포). 4.6.x는 2026-10-22 배포라 아직 쓰지 않는다. 뷰어 CSP에서 그려지는 것을 2026-11-03 실측했다.
