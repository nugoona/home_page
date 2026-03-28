# NGN Homepage

회사 홈페이지. 두 개 브랜드 사이트를 하나의 레포에서 관리.

## 아키텍처 — 세션 시작 시 `docs/ctx/` 폴더의 md 파일들을 읽어라

- `docs/ctx/structure.md` — 프로젝트 구조 + 기술 스택 비교
- `docs/ctx/nugoona.md` — 누구나 디자인 시스템 (토큰, 컴포넌트, 규칙)
- `docs/ctx/aurum.md` — 아우르메 디자인 시스템 (토큰, 컴포넌트, 규칙)

> ctx 파일은 `scripts/update-ctx.js`가 SessionStart hook으로 자동 생성. 직접 수정하지 말 것.

## 작업 규칙

- **새 토큰 추가 시** globals.css에 먼저 정의 후 사용
- **레거시 디렉토리** (next/, static/, css/) 수정 금지
