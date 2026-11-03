# 각색한 외부 출처

규칙만 한국어로 바꿔 각색했고 원문을 통째로 복사하지 않았다. 각 참고 문서의 `[번호]`가 아래 번호다. 2026-11-03에 원문을 읽었다.

| # | 출처 | 라이선스 | 읽은 판 | 가져온 것 |
|---|---|---|---|---|
| 1 | visual-explainer (nicobailon) · https://github.com/nicobailon/visual-explainer | MIT | 커밋 `2a34c38c` (2026-10-30) | 그림·숫자·문체 규칙, Mermaid 함정, 재생 그림 규칙 |
| 2 | project-artifact (Anthropic, claude-plugins-official) · https://github.com/anthropics/claude-plugins-official/tree/main/plugins/project-artifact | Apache-2.0 | 커밋 `a7ba5b93` (2026-10-30) | 상태 페이지 구조, 상태 JSON 블록, 넘침 규칙, 탭 |
| 3 | data-report (nexu-io/open-design) · https://github.com/nexu-io/open-design/tree/main/skills/data-report | Apache-2.0 | 커밋 `5a0c4777` (2026-11-02) | KPI 카드, Chart.js 고정 높이 규칙 |
| 4 | mermaid-diagrams (softaworks/agent-toolkit) · https://github.com/softaworks/agent-toolkit/tree/main/skills/mermaid-diagrams | MIT | 커밋 `3027f20f` (2026-03-05) | Mermaid 함정 요약 |
| 5 | frontend-design (Anthropic, anthropics/skills) · https://github.com/anthropics/skills/tree/main/skills/frontend-design | Apache-2.0 | 커밋 `ca45fc49` (2026-10-28) | AI 기본값 피하기, 품질 하한 |
| 6 | playground (Anthropic, claude-plugins-official) · https://github.com/anthropics/claude-plugins-official/tree/main/plugins/playground | Apache-2.0 | 커밋 `a7ba5b93` | 상태 객체와 `updateAll`, 프리셋 |
| 7 | diagram-design v2.3 (로컬 `~/.agents/skills/diagram-design`) | MIT(frontmatter 표기) | 2026-11-03 로컬 사본 | 유형별 배치, 밀도 예산, 접근성 |
| 8 | html-effectiveness (Thariq Shihipar) · https://github.com/ThariqS/html-effectiveness | Apache-2.0 | 커밋 `1787245d` (2026-07-03) | 예제의 섹션 구성만(사고 보고, 구현 계획, 주간 상태) |
| 9 | explain-diff gist (Geoffrey Litt) · https://gist.github.com/geoffreylitt/a29df1b5f9865506e8952488eac3d524 | 표기 없음 | 리비전 `126e7fe9` (2026-07-01) | 구성 아이디어만(배경 → 직관 → 설명 → 퀴즈). 원문 문장은 옮기지 않았다 |

Apache-2.0 출처(2, 3, 5, 6, 8)에서 코드나 문장을 그대로 가져오지 않았다. 규칙을 우리 말로 다시 썼고, 조각(HTML·CSS·JS)은 이 스킬에서 새로 썼다. 원문을 그대로 옮길 일이 생기면 해당 라이선스의 고지 조건을 따른다.

## 내부 출처

- makestar 인프라팀 vault의 기존 HTML 보고서(색 토큰, 단계 띠, Gantt, 흐름 상자 패턴). 회사 고유 규칙은 이 스킬에 옮기지 않고 `vault-mode.md`가 가리키기만 한다.
- 팀 스킬 `infra-presentation`의 화면 캡처·터미널 상자 규칙.

## 실측으로 정한 것 (2026-11-03)

- Chart.js `4.5.1`, Mermaid `12.2.0`은 Vault 뷰어 CSP(실제 응답 헤더로 흉내 낸 것) 아래에서 오류 없이 그려졌다. 반대 시험에서 다른 CDN 스크립트, 외부 요청, 외부 그림은 모두 막혔다.
- Mermaid Gantt는 어두운 화면에서 "끝난 작업" 막대 대비가 나빴다. 그래서 일정은 CSS로 그린다.
