# 출처

이 스킬은 외부 저장소의 파일을 그대로 가져온 것이다. 내용은 고치지 않았다.

| 항목 | 값 |
|---|---|
| 원본 저장소 | https://github.com/majidmanzarpour/threejs-game-skills |
| 원본 경로 | `skills/threejs-game-ui-designer` |
| 고정 커밋 | [`8286774b22a2`](https://github.com/majidmanzarpour/threejs-game-skills/tree/8286774b22a2566bf894dbc825825c16921866af/skills/threejs-game-ui-designer) |
| 가져온 날짜 | 2026-11-18 |
| 라이선스 | MIT (`LICENSE`는 원본 저장소 루트의 라이선스 파일) |
| 로컬 수정 | 없음 |

## 파일

blob 해시는 고정 커밋의 원본 트리와 같다.

| 이 폴더 | 원본 | 바이트 | blob |
|---|---|---|---|
| `SKILL.md` | `skills/threejs-game-ui-designer/SKILL.md` | 2368 | `1ff25aa86cf6` |
| `references/ui-patterns.md` | `skills/threejs-game-ui-designer/references/ui-patterns.md` | 5230 | `438aa234e725` |
| `agents/openai.yaml` | `skills/threejs-game-ui-designer/agents/openai.yaml` | 248 | `0afafea6a3d8` |
| `LICENSE` | `LICENSE` | 1073 | `0e7cfcfa43d5` |

## 검토 결과

- **들어 있는 것:** 지시문 두 개(`SKILL.md`, `references/ui-patterns.md`)와 다른 에이전트용 표시 정보(`agents/openai.yaml`)뿐이다. 스크립트, 훅, MCP 서버, 설정 변경, 외부 전송, 숨김 지시는 없다.
- **같은 묶음의 다른 스킬:** `SKILL.md`가 `threejs-image-generator`(Gemini 이미지 API)와 `threejs-3d-generator`(Tripo API)를 "품질을 높일 때" 불러 쓰라고 하지만, 꼭 필요한 의존은 아니다. 이 저장소에는 두 스킬을 들이지 않았다. 둘 다 유료 API 키와 스크립트가 필요하므로, 필요해지면 따로 검토한다.
- **"lead's consolidated pass":** 보고 절의 이 표현은 같은 묶음의 지휘 스킬(`threejs-game-director`)을 가리킨다. 혼자 쓸 때는 무시해도 된다.
- **적용 범위:** 이름에 Three.js가 붙었지만 내용은 HTML·CSS 게임 UI에도 그대로 맞는다(HUD 배치, 상태 목록, 터치 대상, 안전 영역, 글자 넘침, 웹 페이지 같은 기본값 피하기).

## 업데이트

원본 저장소에 새 커밋이 있으면 `skills/threejs-game-ui-designer/` 아래 바뀐 내용을 먼저 읽는다. 스크립트나 외부 호출이 새로 생겼는지 확인하고, 문제가 없을 때 위 파일을 덮어쓴다. 그다음 이 문서의 고정 커밋과 blob 해시를 고친다.
