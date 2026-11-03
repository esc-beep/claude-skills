# 화면 캡처

웹 화면은 Playwright로 요소나 영역만 찍어 WebP로 넣는다. 터미널 출력은 그림으로 찍지 않고 HTML 터미널 상자에 글로 넣는다.

## 준비(처음 한 번)

- `playwright-core@1.64.1`을 `~/.cache/html-report/node`에 설치했다. 브라우저는 시스템 Chrome(`channel: 'chrome'`)을 쓰고 따로 내려받지 않는다. 없으면 `npm install --prefix ~/.cache/html-report/node --save-exact playwright-core@1.64.1`.
- `cwebp`가 필요하다(`brew install webp`).
- 캡처 전용 프로필은 `~/.cache/html-report/browser-profile`(권한 700)이다. 평소 쓰는 Chrome 프로필은 쓰지 않는다(잠금 충돌, 노출 범위).
- 세션 쿠키(브라우저를 닫으면 사라지는 로그인 토큰, 예: Argo CD)는 로그인할 때 `~/.cache/html-report/session-cookies.json`(권한 600)에 따로 저장하고 다음 실행 때 다시 넣는다.
- 지우기: `rm -rf ~/.cache/html-report/browser-profile ~/.cache/html-report/session-cookies.json`

## 순서

1. **후보를 먼저 정한다.** 찍을 화면마다 주소, 범위(요소나 영역), 보고서의 어느 주장을 뒷받침하는지를 사용자에게 보여 주고 고른다. 주장이 없는 화면은 넣지 않는다.
2. **찍는다.**
   ```bash
   S=~/.claude/skills/html-report/scripts
   node $S/capture.mjs --url '<주소>' --out '<임시 폴더>/shots/<이름>.webp' --mask-common \
     [--selector '<CSS>' | --clip x,y,w,h] [--ready '<CSS>'] [--width 1440 --height 900] [--wait 5000] [--scheme dark]
   ```
   - 요소를 고르기 어려운 콘솔 화면(GCP 등)은 먼저 전체를 찍어 보고, CSS px 기준 `--clip`으로 필요한 영역만 다시 찍는다. 그림은 `deviceScaleFactor 2`라 그림 픽셀의 절반이 CSS px다.
   - 무거운 콘솔은 `--wait 5000~8000`.
3. **로그인이 필요하면 멈추고 요청한다.** 종료 코드 3(`LOGIN_REQUIRED <host>`)이면:
   - 사용자에게 어느 계정으로 로그인할지 말하고, 아래를 **백그라운드로** 띄운다. 창이 열리고, 사용자가 로그인해 로그인 화면을 벗어나면 `LOGIN_OK`로 끝난다(기본 10분, `--timeout` 초).
     ```bash
     node $S/capture.mjs --login --url '<주소>' [--ready '<목록 화면의 CSS>'] --timeout 900
     ```
   - 자격 증명을 묻거나 입력하지 않는다. 로그인 화면이 자동화 브라우저를 막으면(예: Google의 "안전하지 않은 브라우저") 그대로 알리고, 같은 내용을 읽기 명령 출력(터미널 상자)으로 대신할지 묻는다.
   - `LOGIN_OK` 뒤에 다시 찍었는데 또 3이면 세션 쿠키 문제일 수 있다. 한 번 더 `--login`으로 받는다(이번에는 쿠키를 저장한다).
   - 로그인 화면 판단은 주소 패턴으로 한다(Google, Microsoft, GitHub, Okta, Atlassian, `/login`, `/sso/` 등). 맞지 않는 사이트는 `--login-pattern '<정규식>'`을 더한다.
4. **가린다.** `--mask-common`은 IPv4, 메일 주소, 흔한 토큰 접두사(`ghp_`, `AKIA`, `AIza`, `ya29` 등), 40자 넘는 무작위 문자열을 바꿔 쓴다(git 커밋·sha256 해시는 그대로 둔다). 그 밖은:
   - 요소 덮기: `--mask '.user-email,.avatar'`(흐림이 아니라 칠해서 덮는다. 흐림은 되살릴 수 있다)
   - 글 바꾸기: `--replace 'mystarroom-[a-z0-9-]+=>[프로젝트]'`
   - 가릴 것: 비밀 값, 토큰, 접속 IP, 내부 리졸버 주소, 개인 메일·아바타·이름(업무상 필요한 곳 제외), 고객 데이터, 보고서에 필요 없는 프로젝트·파드 이름.
5. **직접 본다.** `dwebp -quiet x.webp -o x.png`로 바꿔 열어 본다. 가릴 것이 남았거나, 쿠키 배너·알림 같은 군더더기가 있으면 범위를 줄여 다시 찍는다.
6. **확인받는다.** 사용자에게 그림(PNG 경로), 찍은 시각(KST), 가린 것, 크기를 보여 주고 넣어도 되는지 묻는다. 확인 전에는 넣지 않는다.
7. **넣는다.** 초안에서는 `<img src="shots/x.webp">`로 두고, 마지막에 한 파일로 만든다.
   ```bash
   node $S/inline-images.mjs 초안.html 완성.html
   ```
   한 장 300KB(`capture.mjs`가 품질과 폭을 줄여 맞춘다, 못 맞추면 종료 코드 5), HTML 전체 3MB 이하.

## 그림 상자

```html
<figure class="fig shot">
  <img src="shots/x.webp" width="1160" height="380" alt="새 Stage Cloud Build 트리거 6개, 모두 사용 설정됨" loading="lazy">
  <figcaption>주장 한 문장. <span class="src-tag">캡처 · 2026-11-03 12:43 KST · console.cloud.google.com</span></figcaption>
</figure>
```

- `width`·`height`는 CSS px(그림 픽셀의 절반)로 넣어 자리를 먼저 잡는다.
- alt에는 그림이 보여 주는 사실을 쓴다("스크린샷" 같은 말이 아니라).
- 캡션 꼬리표에 찍은 시각과 출처 host를 쓴다. 숫자의 기준 시각과 찍은 시각이 다르면 둘 다 쓴다.

## 터미널 상자

```html
<div class="term">
  <div class="term-head">2026-11-03 12:40 KST · 로컬 · gcloud builds triggers list --region asia-northeast3</div>
  <pre>NAME
app-stage-deploy
…(같은 꼴 4줄 줄임)
thumbnail-stage-deploy</pre>
</div>
```

- 읽기 명령만 실행한다. 바꾸는 명령은 이 스킬에서 하지 않는다.
- 출력은 고치지 않는다. 줄인 자리에는 줄였다고 쓴다. 설명용 표시는 표시라고 밝힌다.
- 합자는 `.term pre`에서 꺼져 있다(`->>` 같은 출력이 다른 글자로 보이지 않게).
- 원본 출력 파일은 결과 옆에 두지 않는다.
