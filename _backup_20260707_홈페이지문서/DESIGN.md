# 누구나컴퍼니 홈페이지 — 디자인 설계서 (단일 소스)

> **이 문서 하나로 관리한다.** 디자인 관련 결정·톤·규칙·리빌드 방향은 여기서만 업데이트하고, 여기저기 흩어놓지 않는다.
> 토큰의 **실제 최신값**은 항상 `nugoona/app/globals.css`가 정본(이 문서는 의도·규칙·이력). 자동 생성 스냅샷은 `docs/ctx/nugoona.md`(직접 수정 금지).
> 최종 갱신: 2026-07-07 (초안 — 현행 코드 파악 기반).

---

## 0. 이 문서의 목적
- 누구나 홈페이지를 **리빌드**하면서 (내용은 크게 바뀌되) **기존 버셀 스타일 디자인 톤앤매너는 차용**한다.
- 현행 코드에서 살릴 자산·규칙·모션을 정리하고, 리빌드 결정사항을 누적한다.
- "무엇을 왜 그렇게 정했는가"가 컴퓨터가 꺼져도 남도록.

## 1. 현재 상태 (2026-07-07 파악)
- 스택: **Next.js 16 + Tailwind v4 + Framer Motion**, Pretendard(한글)/Inter Tight(영문). `nugoona/`.
- 라우트 5개 **모두 완성형**: `/`(홈) · `/features` · `/about` · `/pricing` · `/start`(리드폼).
- 홈 흐름: Hero(Aurora) → PainPoints → Solution → Evidence(Insight·Speed·Trend) → ROIComparison → Reviews → FAQ → CTA.
- **미사용 컴포넌트 = 디자인 자산 창고**(라우트에 안 붙었지만 코드 살아있음 → 리빌드 재활용 후보):
  - home/ **16개**: 대안 Hero(`HeroMinimal`), 대안 비교(`Comparison`/`ComparisonNew`), 대안 증거(`EvidenceGrid`), `AdCanvasMagic`·`AdFlowGlimpse`·`DashboardGlimpse`/`DashboardPreview`·`DataPipeline`·`ManageGlimpse`·`ReportDark`/`ReportGlimpse`·`StepDone`·`StoryStep`·`TrendGlimpse`·`FeatureSection`.
    - ⚠ `BeamCanvas`는 **미사용 아님** — `HeroAurora`가 import해 홈 히어로에서 실사용(그레이핑 주의).
  - features/ 미사용: `BudgetSimulator`, `MobileDashboardMockup`. ui/ 미사용: `bento-grid`, `BrowserFrame`(미사용 `FeatureSection`에서만 참조; `AdCanvasShowcase`는 자체 로컬 BrowserFrame 별도 정의).
- 정리 후보: `globals.css`에 shadcn 토큰 계열이 섞여 있음 — `@import "shadcn/tailwind.css"`(3행) + `@theme inline`(379~418) + `:root`/`.dark`(420~487) + `@layer base`(489~493). 실제 페이지는 `@theme` 커스텀 토큰만 사용 → 리빌드 때 제거 검토(지울 땐 이 4곳 전부, 420~487만 지우면 안 됨).

## 2. 디자인 언어 (차용 대상 — Vercel/Geist 벤치마크)
- **미니멀 모노크롬 + 블루 악센트** `#0070f3`. 전역 **0px 모서리**(`border-radius:0 !important`). 예외(globals.css 기준 전체): `.rounded-dot`(점 50%), `.rounded-pill`(CTA 999px), 아이폰 목업(`.iphone-*`), 슬라이더 thumb(`.feat-sim-slider` 50%).
- "아무것도 없는 것"이 아니라 **지독하게 설계된 디테일**. 여백·정렬·1px 보더로 승부.
- 숫자/데이터는 영문 폰트(지향: Geist Mono 급 고정폭)로 정렬. 한글 `word-break:keep-all`. 쉼표는 세리프(`.comma`).

## 3. 토큰 (이름·의도만 — **실제 값의 정본은 globals.css `@theme`**, 여기에 hex를 복사하지 않는다)
> hex를 이 표에 적으면 globals.css·docs/ctx/nugoona.md와 3중 중복되어 곧 썩는다. 값이 필요하면 globals.css를 본다.
- **배경**: `bg`(기본 흰) / `bg-alt`(옅은 회색 섹션) / `bg-dark`(다크) / `bg-input`.
- **텍스트**: `text-primary`(제목) → `secondary`·`body`(본문) → `muted`/`weak`/`disabled`(약한 순).
- **보더**: `border-default`(기본 1px) / `hover` / `light` / `mid` / `cross`(교차마크).
- **악센트**: `accent`(블루) + `accent-bg`/`accent-border`(옅은 배경·테두리).
- **폰트**: `font-kr`(Pretendard) / `font-en`(Inter Tight).
- **브레이크포인트**: `sm 600` / `md 900` / `lg 1200`.

## 4. 레이아웃 시스템
- `OuterContainer`(max-w **1200px**) → `Section`(옵션: `alt`=회색 / `dark` / `crossMarks`=교차 마크 / `noBorder`).
- 텍스트 영역 `max-w-[720px] mx-auto`. 섹션 패딩 Desktop `px-12 py-16` / Mobile `px-6 py-12`.
- 그리드 Desktop 3-col → Mobile 1-col(`max-md:grid-cols-1`). 반응형 분기 `max-md`(900) / `max-sm`(600).

## 5. 타이포 스케일
- Hero: `text-[clamp(26px,5vw,56px)] font-bold` (페이지별 clamp 상한 다름: features/pricing은 72px).
- Section 제목: `clamp(28px,4vw,40px) font-semibold tracking-[-0.02em] leading-[1.15]`.
- Body: `15px font-light leading-[1.65]`. EN 악센트(eyebrow): `13px font-semibold tracking-[0.1em] uppercase` + Inter Tight.
- **규칙: 헤딩은 반드시 clamp()** (고정 px 헤딩 금지).

## 6. 모션 자산 (globals.css에 정의 — 재사용)
- 진입: `<FadeUp delay>` (600~800ms, ease `[0.16,1,0.3,1]`), 숫자 `<CounterUp target>`, `<StaggerGrid>`.
- 배경/장식: 오로라 그라디언트(`auroraFloat1~3`), 히어로 **회로 빔**(`hero-beam` L-path, 데스크탑 3200/14s·모바일 2400/12s), 코너 브래킷(`hero-bracket`), 노이즈 오버레이(`aurora-noise`), 그리드 크로스헤어.
- 인터랙션: 폰 목업 오토스크롤(`phoneAutoScroll` 18s), 마퀴(`marqueeUp` 30s), 글래스 글레어(`glassGlare`), shimmer, 파이프라인 플로우, 다크 그리드/도트 패턴.
- 다크 섹션 공식: `linear-gradient(180deg,#0a0a0a,#151515)` + `text-white`/`text-white/80` + 흰 CTA(`bg-white text-text-primary`).

## 7. 절대 금지 (globals.css 전역 리셋 기반)
1. `border-radius` 추가 금지(예외 전체: `.rounded-pill`·`.rounded-dot`·`.iphone-*`·`.feat-sim-slider` thumb).
2. hex 하드코딩 금지 → Tailwind 토큰 클래스.
3. `style={{ color/background }}` 인라인 금지(그라디언트 등 불가피한 경우만).
4. 1200px 초과 폭 금지.
5. clamp() 없는 헤딩 금지.
6. 콘텐츠 직접 작성 금지 → `lib/content/*.ts`에 분리.

## 8. 리빌드 방향 (← 여기부터 사용자와 채운다, TBD)
> 아직 미정. 기획 세션에서 아래를 확정하며 이 섹션을 업데이트한다.
> **콘텐츠·메시지(무슨 말을 하나)는 여기 말고 [CONTENT.md](CONTENT.md)** — 디자인과 분리한다.
- [ ] 리빌드 목표/타깃(내용이 어떻게 바뀌나): TBD
- [ ] 유지할 페이지 / 새로 만들 페이지 / 버릴 페이지: TBD
- [ ] 자산 창고 17개 중 살릴 것 / 버릴 것: TBD
- [ ] 살릴 톤 vs 바꿀 톤(색/모션 강도 등): TBD
- [ ] 콘텐츠 구조(lib/content) 재설계: TBD

## 8.5 재사용 자산 인벤토리 (컴포넌트 50개 전수, 2026-07-07 요약)
> 설계 시 **여기서 매핑 우선 = 창작 최소**. "범용"은 콘텐츠만 갈아끼움, "목업"은 제품화면 목업(스톡 이미지 대신 = CEO 원칙), "하드코딩"은 카피·목업 교체해 재활용.

**범용(props로 바로 재사용)** — `Section`(래퍼: alt/dark/crossMarks/noBorder) · `SectionHeader` · `FAQ`(좌제목+우아코디언) · `Accordion` · `Badge` · `Button`(CVA variant) · `BrowserFrame`(데스크톱 프레임) · `bento-grid`(3열 카드) · `CrossMark` · `GridDivider` · `FeatureSection`(좌텍스트+우 BrowserFrame, props) · `StoryStep`(props 배경 다크/라이트/회색) · `BudgetSimulator`(예산 슬라이더+실시간 막대, 계산 조정가능).

**제품 목업 자산(콘텐츠 교체해 재활용)** — 대시보드/광고/리포트 실화면 목업:
- 대시보드: `DashboardGlimpse`(6 KPI) · `DashboardPreview`(다크→퍼스펙티브 카드) · `ManageGlimpse`(캠페인 온/오프+ROAS 카운트업) · `MobileDashboardMockup`(360px 모바일)
- 광고생성: `AdCanvasMagic`(URL입력 목업) · `AdFlowGlimpse`(3단계 플로우) · `EvidenceInsight`(상품→인스타/틱톡 미리보기)
- 트렌드: `EvidenceSpeed`(29CM 랭킹 3.5초 순환) · `EvidenceGrid`(대시보드+3탭 순환) · `EvidenceTrend`/`TrendGlimpse`(랭킹 정적, 자사 강조)
- 리포트: `ReportDark`(다크+타이핑) · `ReportGlimpse`(월간 리포트 타이핑)
- 비교/증거: `Comparison`·`ComparisonNew`(운영방식 비교표) · `ROIComparison`(가격대별 스크롤 진행) · `Reviews`(3열 후기) · `PainPoints`(문제 일러스트) · `DataPipeline`(데이터 흐름 SVG)

**히어로/모션/데코** — `HeroAurora`(다크 그리드+코너 십자+`BeamCanvas` 회로빔) · `HeroMinimal`(텍스트+일정 springPop) · `CTA`(다크+버튼2) · `StepDone`(다크 큰 타임스탬프).

**features/** — `AdCanvasShowcase`(4스텝 토글) · `DashboardShowcase`(4탭) · `TrendShowcase`(급상승/신규/하락 3탭+이미지).

**layout/** — `Nav`(로고+3링크, 스크롤 배경변화) · `Footer`(3열 회사정보) · `PromoBanner`(첫달무료 상단배너) · `Section`.

> ⚠ 대부분 콘텐츠가 하드코딩(광고·대시보드·리포트) → **리빌드 시 카피·목업만 교체**. 범용(props)만 그대로. 상세 렌더/모션/범용성 원본 요약은 이 세션 산출(필요 시 재생성).

## 9. 변경 이력
- 2026-07-07: 초안 작성(현행 5페이지·토큰·모션·규칙 파악, 리빌드 방향은 미정 자리만 마련).
- 2026-07-07: **재사용 자산 인벤토리(§8.5)** 추가 — 컴포넌트 50개 전수 분류(범용/목업/하드코딩). 설계 시 매핑 우선.
