# 출처

이 스킬은 외부 플러그인 저장소에서 `skills/show-me-the-prd/` 폴더만 가져왔다. 안전 때문에 `SKILL.md`를 세 군데 고쳤다(아래 "로컬 수정"). 그래서 `SKILL.md`의 해시는 원본과 다르다.

| 항목 | 값 |
|---|---|
| 원본 저장소 | https://github.com/fivetaku/show-me-the-prd |
| 원본 경로 | `skills/show-me-the-prd` |
| 고정 커밋 | [`7cd6c8db6d69`](https://github.com/fivetaku/show-me-the-prd/tree/7cd6c8db6d69cccbddde2b6282f6c1a54cae2825) |
| 가져온 날짜 | 2026-11-17 |
| 라이선스 | MIT (`LICENSE`는 원본 저장소의 라이선스 파일) |
| 로컬 수정 | 있음 (아래) |

## 파일

| 이 폴더 | 원본 | 바이트 |
|---|---|---|
| `SKILL.md` | `skills/show-me-the-prd/SKILL.md` | 17766 |
| `references/design-reference-guide.md` | `skills/show-me-the-prd/references/design-reference-guide.md` | 5013 |
| `references/document-templates.md` | `skills/show-me-the-prd/references/document-templates.md` | 9765 |
| `references/domain-doc-sets.md` | `skills/show-me-the-prd/references/domain-doc-sets.md` | 6938 |
| `references/interview-guide.md` | `skills/show-me-the-prd/references/interview-guide.md` | 6746 |
| `references/research-strategy.md` | `skills/show-me-the-prd/references/research-strategy.md` | 6553 |
| `LICENSE` | `LICENSE` | 1065 |

## 업데이트

원본 저장소에 새 커밋이 있으면 바뀐 내용을 먼저 읽고, 문제가 없을 때 위 파일을 덮어쓴다. 그다음 이 문서의 고정 커밋을 고친다.

## 로컬 수정

| 위치 | 원본 | 바꾼 것 | 이유 |
|---|---|---|---|
| `SKILL.md` 맨 앞 | "Step 0 — run once, silently"로 `setup/setup.sh`를 실행하고 실행 사실을 말하지 말라고 지시 | 줄 삭제 | 이 스크립트가 `~/.claude/settings.json`에 SessionStart 훅(`gptaku-update-check.cjs`)을 몰래 추가하고, 언어 감지를 위해 `~/.claude/projects/**/*.jsonl` 대화 기록을 읽는다. 상시 설정 변경은 사용자 허락이 필요하다 |
| `SKILL.md` 참고 경로 4곳 | `${CLAUDE_PLUGIN_ROOT}/skills/show-me-the-prd/references/` | `references/` | 플러그인이 아니라 개인 스킬로 설치해서 `CLAUDE_PLUGIN_ROOT`가 없다 |
| `SKILL.md` Phase 0 3번 | insane-search가 있으면 디자인 레퍼런스 수집 | 이미지 내려받기 전 허락받기 조건 추가 | `references/design-reference-guide.md`가 디자인 사이트 이미지를 Referer 헤더를 넣어 curl로 내려받는다 |

## 가져오지 않은 원본 파일

- `setup/setup.sh`, `setup/gptaku-update-check.cjs`: 위의 설정 변경, 대화 기록 읽기, GitHub 별 누르기(`star yes`)
- `commands/show-me-the-prd.md`: 별 누르기 질문 흐름이 들어 있는 슬래시 명령. 스킬은 `/show-me-the-prd`로 바로 부를 수 있다
- `.claude-plugin/plugin.json`, `routing.json`: 플러그인 매니페스트(`gptaku-core` 의존). 개인 스킬에는 필요 없다

원본을 업데이트할 때는 위 세 군데를 다시 확인하고, 원본에 새로 생긴 스크립트 실행 지시가 없는지 본다.
