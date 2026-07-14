# S1·S2 구현 제약 가이드

> **목적**: 실제 홈 카피 작성 전, 가장 중요한 두 섹션(S1 히어로 · S2 공통 철학)의 구현 제약을 코드 근거로 최종 정리한다.
> **범위**: 코드·카피 수정 없음. **사실만.** 근거 = `HeroB.tsx`·`Philosophy.tsx`·`home.ts`·`globals.css`(2026-07-13 Read).
> **짝 문서**: 슬롯·글자수 = `COPY_SLOTS.md`, 메시지 목적 = `HOME_MESSAGE_SYSTEM.md`, 톤·금지 = `BRAND_OS.md`.

---

## 1. S1 (HeroB) — 변경 가능 / 변경 금지

### 변경 가능 (카피만)
- **H1** — `home.ts hero.h1`. 렌더: `dangerouslySetInnerHTML`, `text-[clamp(28px,5.4vw,60px)]`, `font-bold`, `tracking-[-0.04em]`, `leading-[1.1]`, `text-white`. accent = `<span class="text-accent">…</span>` (**반영본 2026-07-13 = '마케팅' 1곳**, 기존 '누구나'에서 이동).
- **서브** — `home.ts hero.sub`. 렌더: `dangerouslySetInnerHTML`, 모바일 `text-[14px] font-medium`, 데스크톱 `md:text-[clamp(14px,1.8vw,18px)] md:font-normal`, `text-[#d4d4d4]`, `leading-[1.5]`, `text-balance`, `max-w-[300px] md:max-w-[460px] mx-auto`. `<br>` 직접 지정 가능.
- **CTA 텍스트/링크** — `home.ts hero.cta`(버튼 라벨) + `hero.ctaHref`(현행 `/start`). 버튼 우측 화살표 SVG는 고정.

### 변경 금지 (카피 아님 — 손대지 말 것)
- **빔 캔버스**: `HeroBeams`, 색 상수 `BEAM_NC='77,159,255'(#4d9fff)`·`BEAM_NA='41,213,255'(#29d5ff)`, 루프/트레일/코너버스트.
- **격자**: `GridLines`(모바일 6×10 / 데스크톱 12×8), 크로스헤어, 코너 브래킷.
- **4코너 라벨**: `NUGOONA — SYSTEM` / `GRID 12×08`(모바일 06×10) / **좌하단 두 제품 범례(콘텐츠 #4d9fff · 광고 #29d5ff 점)** / `LIVE`(점멸). ⚠️ 범례가 이미 "콘텐츠·광고"를 표기 → **S1 서브에서 두 제품을 또 나열하면 중복.**
- **배경 그라디언트**(다크), 필름 노이즈, 스크롤 유도 트랙("Scroll").
- **주석 "카피 불변"**(307행) — H1/sub/cta만 데이터로 교체, 구조·좌표계는 불변.

### 애니메이션 특성
- H1/sub/cta는 **mount 시 즉시** framer `initial opacity0 y18 → animate`(whileInView 아님). 스태거 delay 0 / 0.1 / 0.2. → 카피 길이가 바뀌어도 애니는 그대로 발화(캡처 시 whileInView 미발화 함정 없음 — 이 섹션은 mount 애니).

---

## 2. S2 (공통 철학) — Philosophy 재사용 가능 / 분리 필요

> 확정: 현행 3막을 **해체**, 공통 철학만 **짧은 선언**으로. 제품 목업 배치 안 함(PM_HANDOFF §6).

### 재사용 가능한 부분
- **컨테이너·리듬**: `py-[120px] px-6 max-md:py-16`, `w-full max-w-[960px]`, `flex justify-center`.
- **FadeUp 래핑**(whileInView 페이드) — 그대로 사용.
- **여는 헤드 슬롯 스타일**: `opening` 자리의 `text-[clamp(26px,4.5vw,42px)] font-bold tracking-[-0.03em] leading-[1.3] text-balance` (S2 새 헤드에 재활용). ⚠️ 단 이 헤드만 `text-center`·`mx-auto max-w-[680px]`가 걸려 있음(현행 예외).
- **Body 골격**(번호 배지 + h3 + lines[] `dangerouslySetInnerHTML`) — 선언 문장 렌더에 부분 재사용 가능.

### 분리·제거해야 하는 부분
- **`MOCKS` 맵**(`{1: RankMock/right, 2: AdChatMock/below}`) — **제거.** 두 목업은 S3(RankMock)·S4(AdChatMock)로 이동. S2엔 제품 목업 없음.
- **지그재그 레이아웃**(`flex items-center justify-center gap-16 max-md:flex-col`, `side: right/below` 분기) — 목업 전제라 S2에선 불필요.
- **`acts` 3막 장문**(`title` + `lines[]` 다문장) — 짧은 선언으로 축소. 현행 3막 title·lines는 REMOVE(일부 문장은 S3/S4 재료로만).
- **`opening` 문구** `누구나 마케팅하는 시대…` — **H1과 중복이라 교체**(S2 새 헤드).
- **번호 배지(01/02/03)** — 3막 순서 표기용. 짧은 선언 1~2문장 구조로 가면 불필요(유지 여부는 Phase 4 판단).

### 구조 결합 주의
- `Philosophy.tsx`는 `home.ts philosophy` 데이터 + `PhilosophyMocks`(RankMock/AdChatMock) import에 **강결합**. 목업을 떼면 import·MOCKS·지그재그 분기를 함께 제거해야 함 → 사실상 **S2 전용 경량 컴포넌트로 재구성**하는 편이 깔끔(신규 컴포넌트 필수는 아니나 권장). 목업은 S3/S4에서 다시 import.

---

## 3. 줄바꿈 · 반응형 · 애니메이션 · 시각물 제약

- **줄바꿈**: 두 섹션 모두 카피에 `<br>` 직접 넣고 `dangerouslySetInnerHTML`로 렌더(순수 텍스트 → HTML). 전역 `@layer base`: 헤드 `text-wrap:balance`, 본문 `pretty`.
- **반응형 폰트**: S1 H1 `clamp(28→60)`, 서브 모바일 14px/데스크톱 clamp(14→18). S2 헤드 `clamp(26→42)`. 서브·본문 = `text-[16px] max-md:text-[14px]` 패턴 권장, 자간 `-0.01em`, 행간 `1.5~1.55`(촘촘).
- **정렬**: 텍스트 왼쪽정렬 + 블록 중앙(`mx-auto`). `text-center` 금지 — **단 S1 히어로 전체·S2 opening 헤드는 현행 `text-center` 예외**(중앙 정렬 유지).
- **애니메이션**: S1 = mount 즉시 발화(스태거 0/0.1/0.2). S2 = `FadeUp`(whileInView). fullPage 캡처 시 whileInView 미발화 함정은 S2에 해당(캡처 시 훑기/강제 필요).
- **시각물**: S1 = 캔버스·격자·범례 유지(카피만 얹힘). S2 = **제품 스크린샷·목업 없음**(짧은 선언 중심, 기존 레이아웃 자산은 재사용 가능).

---

## 4. 카피 길이 초과 시 깨질 위험 요소

- **S1 H1**: `leading-[1.1]` + `tracking-[-0.04em]` 조밀. 데스크톱 clamp 최대 60px라 **3줄 이상이면** content rect(상하 12.5%) 안에서 sub·CTA와 세로 충돌 위험. 2줄 이내 권장.
- **S1 서브**: **모바일 `max-w-[300px]`** 가 좁음. 한 줄 ≤약 11자 초과 시 의도치 않은 줄바꿈(과거 오버플로 지적 지점). `<br>`로 줄을 직접 끊어 제어. `text-balance`가 자동 균형을 주지만 폭 제약이 우선.
- **S1 CTA**: 버튼 `px-8 py-3.5` 고정 + 화살표. 라벨이 길면 버튼 폭만 늘어남(줄바꿈은 안 되지만 모바일에서 가로 여백 압박).
- **S2 헤드**: `text-center max-w-[680px]`. 너무 길면 중앙 정렬 3줄 이상으로 무게가 과해짐(짧은 선언 취지와 상충).
- **S2 선언 본문**: 장문이면 "짧은 선언" 구조가 무너짐 — 문장당 1~2줄, 총 2~4문장 권장(COPY_SLOTS S2).
- **공통**: `<br>` 없이 긴 문장을 balance에만 맡기면 PC/모바일에서 윗줄·아랫줄 불균형 → `<br>`로 명시 제어.

---

## 5. 실제 카피 반영 시 수정해야 할 파일 목록

- **S1**: `nugoona/lib/content/home.ts` → `hero`(h1·sub·cta·ctaHref). `HeroB.tsx`는 **카피만 데이터로 바뀌므로 원칙상 수정 불필요**(구조 불변).
- **S2**:
  - 카피 데이터: `nugoona/lib/content/home.ts` → `philosophy`(opening·acts) 재구성. 3막 배열을 짧은 선언 구조로 바꾸면 데이터 shape 변경 → `Philosophy.tsx` 렌더 로직도 함께 수정 필요.
  - 컴포넌트: `nugoona/components/home/Philosophy.tsx` — MOCKS·지그재그·번호 제거 또는 S2 전용 경량 컴포넌트 신설.
  - (연동) 목업 이동: `PhilosophyMocks.tsx`의 RankMock→S3, AdChatMock→S4 재배치는 S3/S4 작업에서.
- **배치**: `nugoona/app/page.tsx` — S2가 제품(S3/S4) 앞에 오도록 섹션 순서·`Section` 플래그(다크/라이트 연속) 조정.

---

## 6. 카피 적용 순서 (권장)

1. **S1 히어로 먼저** — 데이터만 교체(`home.ts hero`), 구조 불변이라 리스크 최소. 렌더로 H1 2줄·모바일 서브 폭 확인.
2. **S2 데이터 shape 결정** — 짧은 선언을 `philosophy`에 어떤 배열 형태로 담을지 확정(현행 acts[{title,lines[]}] 유지 vs 단순 문장 배열).
3. **S2 컴포넌트 재구성** — MOCKS·지그재그·번호 제거, opening 헤드 교체. (목업은 아직 S2에서 빼기만, S3/S4 이동은 후속)
4. **page.tsx 순서** — S2를 제품 앞으로, 다크/라이트 연속 재점검.
5. **렌더 검증** — PC/모바일, `<br>` 줄바꿈, 서브 폭 오버플로, S2 FadeUp 발화(캡처 시 강제).
6. **금지 게이트** — BRAND_OS §5 표현 검사(순위·매니지드·모델명 등) `rg` 0건 확인.

> S1을 먼저 하는 이유: 구조 불변·데이터 교체라 실패 비용이 낮고, 히어로 렌더 감을 먼저 잡아 S2 이후 톤을 맞출 수 있음. S2는 데이터 shape 변경이 동반되어 S1보다 위험이 크다.
