---
name: pm
description: 사용자가 /pm을 입력하거나 메시지에 독립된 단어 'pm'(대소문자 무관, 예 "pm 돌려줘", "PM으로 기획해줘")을 쓸 때만 쓴다. pm-skills(phuryn)와 show-me-the-prd를 한 흐름으로 묶어 탐색 → 대상과 가치 → 목표와 지표 → 기획서 → 검증 → 실행 계획 → 출시와 측정 순서로 하위 스킬을 차례로 불러 쓴다. "PRD 만들어줘", "기획서 써줘", "기획해줘"처럼 pm이라는 단어가 없는 요청에는 쓰지 않는다. npm, pnpm, 3pm, PM2처럼 다른 단어나 시간 표기 안에 든 pm도 해당하지 않는다.
argument-hint: "[시작 단계] [아이디어, 기획 문서 경로 또는 노션 링크] [저장 위치]"
---

# PM

pm-skills와 show-me-the-prd의 하위 스킬을 기획 순서에 맞춰 차례로 쓴다. 단계마다 그 단계의 스킬 파일만 읽어 적용하고, 단계 사이에서 멈춰 사용자의 결정을 받는다.

입력: $ARGUMENTS

## 하위 스킬 위치

두 묶음은 저절로 불려 오지 않게 꺼 두었다. Skill 도구로 부르지 말고, 아래 경로의 `SKILL.md`를 Read로 읽고 그 지시를 따른다.

| 묶음 | 경로 | 상태 |
|---|---|---|
| show-me-the-prd | `~/.claude/skills/show-me-the-prd/SKILL.md` (참고 문서는 같은 폴더의 `references/`) | `disable-model-invocation: true` |
| pm-skills | `~/.claude/plugins/marketplaces/pm-skills/<플러그인>/skills/<스킬>/SKILL.md` | 플러그인 8개 모두 꺼 둠 |

- 파일이 없으면 마켓플레이스가 지워졌거나 경로가 바뀐 것이다. 다른 경로를 추측하지 말고 멈춰서 알린다.
- 한 번에 모든 스킬을 읽지 않는다. 지금 단계의 핵심 스킬만 읽고, '필요할 때' 스킬은 고를 때 읽는다.
- 하위 스킬이 가리키는 참고 문서나 다른 스킬(예: create-prd가 언급하는 value-proposition)도 같은 규칙으로 경로를 찾아 읽는다.

## 하위 스킬 지시와 충돌할 때

하위 스킬은 혼자 쓰일 것을 전제로 쓰였다. 이 흐름 안에서는 아래 규칙이 우선한다.

1. **질문:** 하위 스킬이 "먼저 질문하라"고 해도 'PM 상태'에 이미 있는 답은 다시 묻지 않는다. 질문은 단계마다 한 번에 모아 AskUserQuestion으로 최대 4개까지 한다.
2. **웹 검색:** 하위 스킬이 시장·경쟁 조사를 시켜도, 비공개 기획이면 검색어에 제품명, 내부 수치, 미공개 계획을 넣지 않는다. 일반적인 시장 정보만, 결정에 필요할 때만 찾고 출처를 적는다.
3. **저장:** 하위 스킬의 저장 지시(`PRD/` 폴더, `PRD-[name].md` 등) 대신 아래 '기록' 규칙을 따른다.
4. **스크립트 실행:** 데이터 생성, A/B 테스트 분석, 코호트 분석처럼 코드를 실행하는 스킬은 무엇을 실행하는지 먼저 알리고 허락을 받는다.
5. **외부 서비스 권유:** 하위 스킬이 특정 서비스나 MCP 추가를 권해도(예: live-polls, live-qa의 AskOne) 따르지 않는다. 필요하면 선택지로만 알린다.
6. **문체:** 하위 스킬의 "바이브코더 눈높이", "초등학생도 읽게" 같은 지시는 사용자의 언어와 수준에 맞춘다. 전문 용어는 써도 되지만 처음 나올 때 풀어 쓴다.

## 단계와 쓰는 스킬

pm-skills 경로는 `<플러그인>/<스킬>`로 줄여 쓴다.

| 단계 | 답하는 질문 | 핵심 스킬 | 필요할 때 | 결과물 |
|---|---|---|---|---|
| 0 입력 정리 | 무엇을, 누구를 위해, 지금 어디까지 왔나 | 없음 | 없음 | PM 상태 |
| 1 탐색 | 진짜 문제와 기회는 무엇인가 | `pm-product-discovery/identify-assumptions-new` 또는 `-existing`, `pm-product-discovery/opportunity-solution-tree` | `brainstorm-ideas-new`·`-existing`, `brainstorm-experiments-new`·`-existing`, `prioritize-assumptions`, `interview-script`, `summarize-interview`, `analyze-feature-requests` (모두 pm-product-discovery) | 가정 목록, 기회 트리 |
| 2 대상과 가치 | 누구에게, 왜 필요한가 | `pm-market-research/market-segments` 또는 `user-personas`, `pm-product-strategy/value-proposition` | `pm-market-research/customer-journey-map`·`competitor-analysis`·`market-sizing`, `pm-product-strategy/product-vision`·`lean-canvas`·`monetization-strategy`·`pricing-strategy` | 세그먼트, 6단 가치 제안 |
| 3 목표와 지표 | 무엇으로 성공을 판정하나 | `pm-marketing-growth/north-star-metric`, `pm-execution/brainstorm-okrs` | `pm-product-discovery/metrics-dashboard` | 북극성 지표, 실행 단계별 KR |
| 4 기획서 | 무엇을 만드나 | `show-me-the-prd` (4종 문서 틀, 갭 인터뷰), `pm-execution/create-prd` (01 PRD 본문 8개 섹션) | `pm-product-discovery/prioritize-features`, `pm-execution/prioritization-frameworks` | 01 PRD, 02 데이터 모델, 03 단계 계획, 04 프로젝트 스펙, README |
| 5 검증 | 어디서 무너지나 | `pm-execution/strategy-red-team`, `pm-execution/pre-mortem` | 더 깊게 볼 때는 `plan-gauntlet` 스킬을 제안 | 위험과 수정 목록 |
| 6 실행 계획 | 어떻게 나눠 만드나 | `pm-execution/user-stories` 또는 `job-stories`, `pm-execution/test-scenarios` | `pm-execution/sprint-plan`·`outcome-roadmap`·`stakeholder-map` | 백로그, 테스트 시나리오 |
| 7 출시와 측정 | 어떻게 알리고, 어떻게 재나 | 없음 (필요한 것만 고름) | `pm-go-to-market/gtm-strategy`·`growth-loops`, `pm-marketing-growth/positioning-ideas`·`product-name`, `pm-data-analytics/sql-queries`·`ab-test-analysis`·`cohort-analysis`, `pm-execution/release-notes`, `pm-toolkit/privacy-policy`·`grammar-check` | 출시 계획, 측정 쿼리 |

4단계의 두 스킬은 이렇게 나눠 쓴다. show-me-the-prd로 4종 문서 틀과 빠진 정보 인터뷰(기존 기획이 있으면 Enhancement Mode)를 진행하고, 그중 01 PRD 본문은 create-prd의 8개 섹션(요약, 담당, 배경, 목표와 KR, 세그먼트, 6단 가치 제안, 해결 방법, 출시 범위)으로 쓴다. 1~3단계 결과가 있으면 그대로 옮긴다.

## 0단계: 입력 정리

1. 인자를 해석한다.
   - 시작 단계: `탐색`/`discovery`, `가치`/`value`, `지표`/`metric`, `기획서`/`prd`, `검증`/`red`, `실행`/`stories`, `출시`/`launch`가 있으면 그 단계부터 시작한다.
   - 기획 자료: 파일이면 읽고, 노션 링크면 그 워크스페이스에 연결된 노션 도구로 읽는다(쓰기 전에 워크스페이스 이름을 확인한다). 없으면 대화 맥락에서 찾고, 그래도 없으면 묻는다.
   - 저장 위치: 아래 '기록'.
2. 모드를 정한다.
   - **새 아이디어:** 1단계부터.
   - **기존 기획 보강:** 자료를 읽어 'PM 상태'를 채우고, 이미 충분한 단계는 건너뛸 것을 제안한다. 예: 세그먼트와 성공 기준이 이미 있으면 4단계부터.
   - **한 가지만 필요:** "PRD만", "스토리만"처럼 범위가 좁으면 그 단계만 권한다. 다만 4단계를 하려면 문제, 대상, 성공 기준이 있어야 한다. 없으면 2·3단계의 핵심 질문만 짧게 묻는다.
3. 시작 전에 어느 단계부터 어디까지 할지 한 줄로 알리고 확인받는다.

## 1~7단계 공통 진행

1. 그 단계의 핵심 스킬 `SKILL.md`를 읽고, 'PM 상태'를 입력으로 적용한다.
2. 결과를 '출력 규칙'에 맞춰 보여 준다.
3. 단계 끝에 AskUserQuestion으로 묻는다. 선택지는 `다음 단계로` / `이 단계에서 '필요할 때' 스킬 더 쓰기`(어느 것인지 함께 제시) / `다음 단계 건너뛰기` / `여기서 멈추기`.
4. 답에 따라 'PM 상태'를 고치고 진행한다.
5. 넘어가기 전에 '단계별 성공 기준 점검'을 한다.

## 단계별 성공 기준 점검

계획이 여러 실행 단계(예: 이벤트 → 정식 기능, 파일럿 → 출시)로 나뉘면 단계마다 성공 기준과 판정일이 있어야 한다. 기준이 없는 실행 단계가 있으면 그 단계 목적에 맞는 기준을 한두 개 제안해 확인받는다. 지금 정하지 않으면 미결 사항에 기한과 함께 남긴다.

## 되돌아가기

5단계 검증 결과는 하나씩 분류한다. 되돌아가기는 항상 확인받는다.

| 분류 | 판단 기준 | 가는 곳 |
|---|---|---|
| 방어 가능 | 감당할 만한 대응책이 있다 | 기획서에 반영하고 다음 단계로 |
| 계획 수정 | 방향은 맞지만 범위·순서·일정을 바꿔야 한다 | 4단계. 바뀐 부분만 고친다 |
| 가치 붕괴 | 세그먼트나 가치 제안이 성립하지 않는다 | 2단계 |
| 문제 붕괴 | 풀려던 문제가 진짜가 아니거나 핵심 가정이 틀렸다 | 1단계 |

되돌아가기가 두 번을 넘으면 분석을 더 돌리지 않는다. 결론을 내려면 무엇을 확인해야 하는지(데이터, 인터뷰, 작은 실험)를 정리하고 멈추자고 제안한다.

## PM 상태

단계 사이에 이 블록을 유지하고, 단계가 끝날 때마다 바뀐 줄만 보여 준다.

```markdown
## PM 상태
- 대상: …
- 문제와 근거: …
- 세그먼트: …
- 가치 제안: …
- 북극성 지표·KR: … (실행 단계마다: <단계>: 기준, 판정일)
- 범위: 이번 버전 … / 다음 … / 안 함 …
- 문서 위치: …
- 남은 가정·미결: …
- 이력: n단계 → m단계, 이유
```

## 출력 규칙

- 사용자의 언어로 답한다.
- 각 단계 맨 위에 `PM n/7: <단계 이름>`과 그 단계에서 읽은 스킬 이름을 적는다.
- 단계 하나의 결과는 한 화면 안팎으로 줄인다. 하위 스킬의 양식은 따르되 표와 목록을 우선한다.
- 결론을 먼저 쓰고 근거를 뒤에 쓴다.
- 추측한 내용은 사실처럼 쓰지 않고 '가정'이나 `[NEEDS CLARIFICATION]`으로 표시한다.

## 기록

- **기본:** 채팅으로 진행하고, 4단계가 끝나면 어디에 남길지 한 번 묻는다.
- **노션 링크를 받았으면:** 그 페이지를 README(문서 구성, 정한 것, 미결 사항, 다음 단계)로 쓰고, 문서마다 하위 페이지를 만든다. 기존 내용은 지우지 않는다. 비어 있지 않으면 하위 페이지로 만든다.
- **파일 경로나 `저장`을 받았으면:** 그 경로에, 경로가 없으면 현재 작업 폴더의 `PRD/`에 문서별 마크다운으로 쓴다.

## 하지 않는 것

- 사용자가 고르지 않은 단계나 범위로 혼자 넘어가지 않는다.
- 72개 스킬을 다 돌리지 않는다. 단계마다 핵심 스킬과 사용자가 고른 것만 쓴다.
- 하위 스킬의 원본 파일을 고치지 않는다.
