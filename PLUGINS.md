# 플러그인으로 설치한 외부 묶음

스킬이 수십 개인 외부 묶음은 이 저장소에 복사하지 않고 Claude Code 플러그인으로 설치한다. 대신 무엇을, 어느 커밋 기준으로 검토해 설치했는지 여기에 적는다.

## pm-skills

| 항목 | 값 |
|---|---|
| 원본 | https://github.com/phuryn/pm-skills (MIT) |
| 마켓플레이스 이름 | `pm-skills` (user 범위, `claude plugin marketplace add phuryn/pm-skills`) |
| 검토한 커밋 | `9af7bfd0bc47fdad43c2eaa7a43cd13918e7aaef` (설치 시점의 마켓플레이스 HEAD와 같음) |
| 검토·설치 날짜 | 2026-11-17 |

### 설치한 플러그인 (user 범위)

`pm-product-discovery`, `pm-product-strategy`, `pm-execution`, `pm-market-research`, `pm-data-analytics`, `pm-go-to-market`, `pm-marketing-growth`, `pm-toolkit`

```bash
for p in pm-product-discovery pm-product-strategy pm-execution pm-market-research \
         pm-data-analytics pm-go-to-market pm-marketing-growth pm-toolkit; do
  claude plugin install "$p@pm-skills"
done
```

### 설치하지 않은 플러그인

- `pm-ai-shipping`: 다른 저장소(`phuryn/product-engineering`)로 옮겨졌다는 안내문뿐이다. `code-review` 스킬이 평범한 코드 리뷰 요청에도 걸리고 기본 `code-review`와 이름이 겹친다.

### 검토 결과

- hooks, MCP 서버, 설정 변경, 숨김 지시는 없다.
- `live-polls`, `live-qa`는 작성자 자사 서비스(AskOne)를 권하고 MCP 추가 명령을 안내한다. 자동 설치는 아니다. 따르지 않는다.
- `/generate-data`, `ab-test-analysis`, `analyze-cohorts`는 스크립트를 실행한다(일반 권한 확인을 거친다).
- `create-prd`는 시장 조사를 위해 웹 검색을 하라고 한다. 내부 기획을 다룰 때는 검색어에 기밀 내용을 넣지 않는다.
- 트리거가 겹치는 것: `create-prd`와 `show-me-the-prd`("PRD 만들어줘"). 원하는 쪽을 이름으로 부른다.
- 스킬과 명령이 합쳐 약 100개라 세션마다 설명이 컨텍스트에 실린다. 안 쓰는 플러그인은 `claude plugin disable <plugin>@pm-skills`로 끈다.

### 업데이트

`claude plugin marketplace update pm-skills` 전에 원본의 `9af7bfd..HEAD` 변경을 읽고, 위 검토 항목(hooks, MCP, 스크립트 실행, 숨김 지시)을 다시 확인한다. 문제가 없으면 업데이트하고 이 문서의 커밋을 고친다.
