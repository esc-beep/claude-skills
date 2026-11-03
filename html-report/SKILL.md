---
name: html-report
description: '어느 프로젝트에서나 보고서를 자체 완결 HTML 한 장으로 만든다. 다섯 종류(회고·사고 분석, 계획, 상태 보고, 비교·판정, 학습·설명)에 수치 차트, 구조 다이어그램, 일정·Gantt, 필터 표·탭·계산기·퀴즈 같은 상호작용, Playwright로 찍은 실제 화면을 넣는다. 트리거 예: "html로 정리해줘", "이거 보고서 한 장으로", "차트 넣어서 html로", "Gantt로 계획 그려줘", "회고 html로 만들자", "학습 자료 html로", "화면 캡처까지 넣어서", "/html-report <정본 자료 또는 주제>". 흐름: 입력 확인 → 사실과 출처 모으기 → 종류와 요소 고르기 → base.html에서 쓰기 → 캡처(로그인 필요하면 먼저 요청, 가린 뒤 확인받고 넣기) → check.mjs로 밝음·어두움·390px·콘솔 검사 → 결과 두기(말한 곳, 없으면 세션 임시 폴더). Vault 보고서로 올릴 HTML도 이 스킬로 만들고, 올리기는 references/vault-mode.md가 가리키는 팀 정본을 따른다. 하지 않는 것: 발표 장표·대본, 공유 링크 게시(요청할 때만), 인프라 변경, 메시지 발송.'
argument-hint: '[정본 자료 경로, 주제, 또는 종류]'
---

# html-report

보고서를 **HTML 한 장**으로 만든다. 프로젝트를 가리지 않는다. HTML은 정본(노트, 문서, 티켓, 측정 결과)을 그려 보여 주는 것이지 새 사실을 만드는 곳이 아니다.

스킬 폴더: `~/.claude/skills/html-report/`(실제 위치 `~/claude-skills/html-report`, 로컬 git과 `esc-beep/claude-skills` private repo). 아래 경로는 모두 스킬 폴더 기준이다.

## 0. 먼저 정하는 것

| 무엇 | 기본값 |
|---|---|
| 정본 자료 | 사용자가 준 노트·문서. 없으면 묻는다 |
| 종류 | 회고·사고 분석, 계획, 상태 보고, 비교·판정, 학습·설명 중 하나(`references/layouts.md`) |
| 읽는 사람 | 정본에서 짐작하고, 결론의 말투를 거기에 맞춘다 |
| 결과 위치 | 사용자가 말한 경로. 없으면 세션 임시 폴더(scratchpad)에 두고 전체 경로를 알린다. 다른 repo 안에 몰래 파일을 만들지 않는다 |
| Vault 모드 | 결과를 makestar 인프라팀 vault에 남길 때. `references/vault-mode.md`를 읽는다 |

공유 링크(claude.ai 공유 페이지)는 사용자가 따로 원할 때만 만든다. 그때는 `artifact-design` 스킬을 먼저 읽는다.

## 1. 사실 모으기

- 숫자마다 기준과 출처를 붙인다: 실측(언제, 어디서, 어떻게), 문서, 정가, 가정. 정본에 없는 숫자는 새로 재거나 "재지 않음"으로 쓴다. 확인된 것과 추정을 섞지 않는다.
- 티켓 번호·사람·날짜는 정본에서 확인한 것만 쓴다.
- 넣지 않는 것: 비밀 값, 토큰, 접속 IP, 개인 연락처, 고객 데이터. 사람 이름은 업무상 필요한 곳(정할 사람, 요청자)만.
- 원본 데이터 파일·로그를 결과 옆에 두지 않는다. 필요한 값만 HTML에 넣는다.

## 2. 종류와 요소 고르기

`references/layouts.md`에서 종류의 섹션 순서를 정한다. 그다음 보여 줄 것마다 부품을 고르고, **필요한 참고 문서만** 읽는다.

| 보여 줄 것 | 부품 | 먼저 읽기 |
|---|---|---|
| 숫자, 추이, 비교, 비용 | KPI 카드, 막대, 선, 추이선, 표 | `dataviz` 스킬 → `references/charts.md` |
| 구조, 흐름, 순서, 상태 | 상자와 화살표, 시퀀스, 상태 흐름, 계층 | `artifact-diagramming` 스킬 → `references/diagrams.md` |
| 언제 무엇을, 판정 시점 | Gantt, 마일스톤, 타임라인, 단계 띠 | `references/schedule.md` |
| 고르고 걸러 보기, 따라 해 보기 | 필터·정렬 표, 탭, 계산기, 접기, 퀴즈, 단계별 재생 | `references/interaction.md` |
| 실제 화면 | 웹 화면 캡처, 터미널 상자 | `references/capture.md` |

그림 하나에는 주장 하나를 둔다. 주장을 figcaption 한 문장으로 쓸 수 없으면 그림을 빼거나 나눈다.

## 3. 쓰기

- `assets/base.html`을 복사해서 시작한다. 색은 `:root` 토큰만 쓰고, 어두운 값은 `@media (prefers-color-scheme: dark)`의 `:root:not([data-theme="light"])`와 `:root[data-theme="dark"]` 두 곳에 정한다. 쓰지 않는 부품의 CSS는 지운다.
- 한 파일, 자체 완결. CSS는 `<style>` 안. 외부는 Google Fonts와 jsdelivr 고정 버전 라이브러리만 쓴다.
- 그리는 기술의 기본은 인라인 SVG와 CSS다. 라이브러리는 조건이 맞을 때만:
  - Chart.js `4.5.1`: 점이 많은 시계열이거나 마우스로 값을 봐야 할 때(`references/charts.md`의 고정 높이 규칙).
  - Mermaid `12.2.0`: 시퀀스·상태 흐름을 빨리 그릴 때. 어두운 화면 토큰을 지정한다. Gantt에는 쓰지 않는다(`references/diagrams.md`).
- 글은 쉬운 한국어 평서형(`~다`). 결론을 앞에 둔다. `=`, `→`, `+`, `★`로 조사를 대신하지 않는다. 코드·명령·경로는 `<code>`로 감싼다. 마크다운 백틱을 본문에 남기지 않는다(그대로 보인다).
- 색만으로 상태를 구분하지 않는다. 글자나 모양을 같이 쓴다.
- 폭: 본문 최대 약 1080px, 좌우 여백 16px. 390px에서 페이지가 가로로 넘치지 않는다. 넓은 표·그림만 `.scroll-x`나 `.table-wrap` 안에서 스크롤한다.
- 섹션이 4개 이상이면 목차를 둔다. 정할 것과 확인하지 못한 것으로 끝맺는다.
- 상호작용 상태를 저장하면 `localStorage`를 try로 감싸고, 저장이 안 돼도 화면은 그대로 그려지게 한다.
- `references/general.md`의 AI 기본값 피하기 목록을 쓰기 전에 한 번 본다.

## 4. 캡처

`references/capture.md`를 따른다. 요점만:

1. 찍을 화면 후보(주소, 요소, 왜 필요한지)를 먼저 사용자에게 보여 주고 고른다.
2. `node scripts/capture.mjs --url ... --selector ... --mask-common --out <임시 폴더>/x.webp`
3. 종료 코드 3(`LOGIN_REQUIRED`)이면 멈추고 로그인을 요청한다. `node scripts/capture.mjs --login --url ...`을 백그라운드로 띄우면 창이 열린다. 사용자가 로그인하면 `LOGIN_OK`로 끝난다. 자격 증명을 다루거나 대신 입력하지 않는다.
4. 찍은 그림을 직접 열어 보고, 가릴 것이 남았으면 다시 찍는다. 그다음 사용자에게 보여 주고 확인받은 뒤 넣는다.
5. 초안에서는 `<img src="shots/x.webp">`로 두고, 마지막에 `node scripts/inline-images.mjs 초안.html 완성.html`로 한 파일로 만든다. 한 장 300KB, HTML 전체 3MB 이하.

터미널 출력은 그림으로 찍지 않고 `.term` 상자에 글로 넣는다. 실행 시각(KST)과 실행한 곳을 머리에 적고, 출력은 고치지 않는다.

## 5. 화면 확인

```bash
node ~/.claude/skills/html-report/scripts/check.mjs "<html>" --out "<임시 폴더>/check"
# Vault 모드는 보는 화면의 CSP를 걸어서: references/vault-mode.md의 --csp-file 절차
```

- `RESULT PASS`여야 한다. 검사하는 것: 밝음·어두움 × 1280px·390px의 가로 넘침, 스크립트 오류, 콘솔 오류, CSP 위반, 본문의 백틱, 다크 모드 토큰, 크기 한도.
- 찍힌 PNG를 직접 열어 본다. 자동 검사가 못 보는 것: 글자 잘림, 어두운 화면의 대비(특히 라이브러리 그림), 화살표 위치, 차트 축의 단위, 그림과 figcaption이 맞는지.
- 고친 뒤 다시 돌린다. 같은 검사를 이유 없이 반복하지 않는다.

## 6. 결과 두기와 알리기

- Vault 모드가 아니면 결과 위치(0절)에 둔다. 미리보기 PNG는 임시 폴더에 둔다.
- Vault 모드면 `references/vault-mode.md`대로 팀 정본의 라벨, 자리, 반영, 플랫폼 확인을 따른다.
- 마치며 알린다: HTML 전체 경로, 종류와 쓴 부품, 검사 결과(PASS와 고친 것), 넣은 캡처와 가린 것, 정본과 다르게 그린 곳과 이유, 재지 않은 숫자.

## 관련

- `references/sources.md`: 각색한 외부 출처와 라이선스
- 함께 쓰는 스킬: `dataviz`(차트 색·요소), `artifact-diagramming`(SVG 다이어그램), `artifact-design`(공유 링크를 만들 때)
- Vault 팀 스킬: `vault-html-report`(올리기), `explain-infra-change`, `infra-presentation`
- 의존: `~/.cache/html-report/node`의 `playwright-core@1.64.1`(시스템 Chrome 사용), `cwebp`. 다시 설치: `npm install --prefix ~/.cache/html-report/node --save-exact playwright-core@1.64.1`
