# NGN Homepage

회사 홈페이지. 두 개 브랜드 사이트를 하나의 레포에서 관리.

## 아키텍처 — 세션 시작 시 `docs/ctx/` 폴더의 md 파일들을 읽어라

- `docs/ctx/structure.md` — 프로젝트 구조 + 기술 스택 비교
- `docs/ctx/nugoona.md` — 누구나 디자인 시스템 (토큰, 컴포넌트, 규칙)
- `docs/ctx/aurum.md` — 아우르메 디자인 시스템 (토큰, 컴포넌트, 규칙)

> ctx 파일은 `scripts/update-ctx.js`가 SessionStart hook으로 자동 생성. 직접 수정하지 말 것.

## 누구나 홈페이지 리빌드 — 살아있는 문서 (관할 = 단일 소스, 파편화 금지)

> `docs/ctx/nugoona.md`는 **자동 생성 스냅샷**. 아래는 **사람이 계속 업데이트하는 정본**이다. 리빌드/디자인/배포 작업 시 여기부터 읽어라.

- `nugoona/DESIGN.md` — **디자인 설계 정본**(톤·규칙·자산·리빌드 방향). 단, **토큰 실제 값의 정본은 `nugoona/app/globals.css`**(DESIGN.md엔 hex 복사 금지).
- `nugoona/CONTENT.md` — **콘텐츠 전략 정본**(통합 뼈대: IA·북극성 + 두 갈래 정본 포인터). "무슨 말을 하나".
- `nugoona/DEPLOY.md` — **배포 정본**(standalone SSR·Cloud Run·함정·체크리스트). 배포 착수 전 필독.
- `docs/features-master-2apps.md` — **기능 사실 정본**(업로드·대시보드 전 기능, 코드 근거·스케줄·엔진, 페이블 검증 2026-07-07). ★카피 쓸 때 이 깊이를 본다. 완성/미완 판정 금지·완성 전제.
- `docs/_handoff-homepage-upload-plan.md`(업로드) · `docs/2026-07-07-dashboard-positioning-handoff.md`(대시보드) — 각 앱 **랜딩 기획**(섹션 구성·카피 후보·가격·SEO). 각 앱 세션 관할, 홈페이지가 카피 재료로 씀.
- 관할 요약: 디자인=DESIGN.md / 통합뼈대·메시지=CONTENT.md / 기능사실=features-master-2apps.md / 랜딩카피재료=두 handoff / 배포=DEPLOY.md / 토큰 실값=globals.css / 자동 스냅샷=docs/ctx/nugoona.md. (모두 누구나 전용 — 아우르메는 aurum/·docs/ctx/aurum.md로 별개)
- **`docs/랜딩-아이디어로그.md` = 리빌드 결정 로그(작업 정본)**: 어필맵 3종·와이어프레임 3종·요금·팩트체크·육성 원자료 누적. 구조 확정분은 DESIGN §8·CONTENT §0 반영됨. **두 handoff는 어필맵 확정 이전이라 "v3 재정렬 대기"(문서 상단 경고 배너) — 섹션·가격·명칭·히어로 갱신은 홈페이지 세션이, 기능 사실은 각 앱 세션이 관할.** 게이트②(카피) 재료 = 아이디어로그 육성 A~E·팩트체크 C.

> **⛔ 문서 파편화 금지 (사장님 지시, 최우선).** 누구나 홈페이지 관련 정보는 **위 3개 문서(DESIGN·CONTENT·DEPLOY)에만** 누적 업데이트한다.
> - **새 md 파일 생성 = 게이트.** 만들기 전에 사장님께 먼저 추천하고 **승인받는다**. 판단은 매우 보수적으로(기본값 = 안 만든다). 파편화되면 세션이 바뀌며 작업이 끊긴다(세션 저장만으론 부족).
> - **기존 3문서 업데이트 = 자동.** 사장님 확인 없이 필요하면 바로 반영한다(합의된 내용·수정·보강).
> - 각 문서엔 "작업에 실제 필요한 최소 정보"만(장식·중복 금지).

## 세션 핸드오프 = `.ngn-session.md`

세션 끝·작업 단락마다 이 파일 **최상단**에 **자족적**(메모리 없이도 이어갈 수 있는) 핸드오프를 적는다 — **무엇을 했고 / 현재 상태 / 다음 할 일**. 최신이 위로 가도록 append(기존 내용 보존).

새 세션은 SessionStart 훅이 주입한 이 내용부터 따른다. "이어서/계속" 지시 시 여기부터 이어간다.

> 주입은 전역 `~/.claude/settings.json`의 SessionStart 훅이 cwd 기준 `.ngn-session.md`를 읽어 처리. 프로젝트 루트에서 Claude Code를 실행해야 동작한다. (프로젝트에 중복 훅을 추가하지 말 것 — 이중 주입 방지)

## 작업 규칙

- **새 토큰 추가 시** globals.css에 먼저 정의 후 사용
- **레거시 디렉토리** (next/, static/, css/) 수정 금지
