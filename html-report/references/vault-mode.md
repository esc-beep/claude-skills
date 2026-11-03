# Vault 모드

결과를 makestar 인프라팀 vault에 남길 때만 읽는다. 회사 고유 규칙(라벨, 목차, 보는 화면의 CSP, 반영 절차)은 이 파일에 옮겨 적지 않는다. 정본을 가리키기만 하고, 쓸 때마다 그 정본을 읽는다.

## 언제 Vault 모드인가

- 사용자가 "vault에 올려", "Vault 보고서에", "vault로 정리"를 말했다.
- 정본 노트가 vault 안에 있고, 결과가 팀 기록이다(회고, 프로젝트 진행, 검토).

애매하면 묻는다. 개인 메모나 다른 프로젝트 자료를 vault에 넣지 않는다.

## Vault 루트 찾기

1. 현재 폴더의 git 루트에 `13 Playbooks/Vault HTML 라벨과 목차.md`가 있으면 그곳이다.
2. 아니면 환경 변수 `HTML_REPORT_VAULT`.
3. 둘 다 없으면 사용자에게 묻는다. 짐작한 경로에 쓰지 않는다.

Vault 밖에서 부를 때는 `claude --add-dir <vault 루트>`로 열려 있어야 쓸 수 있다. 쓰기는 vault 규칙대로 최신 `origin/main`에서 만든 새 branch와 worktree에서 한다(사용자 통상 vault나 다른 세션의 폴더를 건드리지 않는다).

## 따를 정본 (매번 읽는다)

- 팀 스킬 `vault-html-report`의 `SKILL.md`
  - 3절 업무 라벨, 5절의 파일 이름과 자리·과제 첫 페이지, 7절 vault에 반영, 8절 플랫폼 확인
  - 4절(구성)과 5절의 모양 규칙은 이 스킬의 `layouts.md`와 `assets/base.html`이 대신한다. 부딪히면 vault 쪽 라벨·자리·반영 규칙을 따른다.
- `<vault>/13 Playbooks/Vault HTML 라벨과 목차.md`: 라벨의 정본.
- vault의 `CLAUDE.md`: 비밀 값, 민감도, branch·PR, Daily 규칙.

## 보는 화면의 CSP로 검사하기

정본은 플랫폼 repo `makestarlab/infra-platform`의 `internal/vaultreports/sign.go` 안 `ReportCSP` 상수다. 값을 이 스킬에 복사하지 않고, 검사할 때마다 읽는다. 회사 repo라 회사 계정으로 읽는다(이 사용자의 `gh`는 `~/.local/bin/gh` 래퍼가 호출마다 계정을 고르고 `GH_CONFIG_DIR`은 무시한다. 강제로 고를 때는 `GH_ACCOUNT=work`를 붙인다).

```bash
T="<세션 임시 폴더>"
GH_ACCOUNT=work gh api repos/makestarlab/infra-platform/contents/internal/vaultreports/sign.go --jq .content | base64 -d > "$T/sign.go"
python3 - "$T/sign.go" "$T/vault-csp.txt" <<'EOF'
import re, sys
s = open(sys.argv[1]).read()
m = re.search(r'const ReportCSP = ((?:"[^"]*"\s*\+?\s*)+)', s)
open(sys.argv[2], "w").write("".join(re.findall(r'"([^"]*)"', m.group(1))))
EOF
node ~/.claude/skills/html-report/scripts/check.mjs "<html>" --out "$T/check" --csp-file "$T/vault-csp.txt"
```

상수를 못 찾으면(이름이나 파일이 바뀜) 검사를 건너뛰지 말고 사용자에게 알린다. 허용 범위를 이 파일에 요약해 두지 않는다. 필요하면 위 명령으로 읽은 값을 그 자리에서 본다.

## 주의

- 목차 스크립트(`scripts/bin/vault-html-index.py`)는 반드시 vault 루트에서 돌린다. 현재 폴더의 git 루트를 기준으로 동작해서, 다른 repo에서 부르면 그 repo에 목차 폴더를 만든다(2026-11-03 확인).
- Vault 안에서 "PR 설명해줘 rich 하게", "IDD 발표 자료" 같은 요청은 팀 스킬(`explain-infra-change`, `infra-presentation`)이 맡는다. 사용자가 `/html-report`로 직접 부르면 이 스킬로 만든다.
- 캡처 그림도 vault 규칙의 비밀 값 금지를 따른다. 원본 PNG·로그는 vault에 두지 않는다.
