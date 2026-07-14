# S1·S2 카피 적용 실행 계획

> **목적**: PM이 S1·S2 카피를 확정하면 실행(Claude)이 그대로 따라 반영·검증할 수 있는 체크리스트. 이번 문서에서는 **구현하지 않는다.**
> **범위**: 코드·카피 수정 없음. 사실만. 근거 = `S1_S2_IMPLEMENTATION_GUIDE.md`·`COPY_SLOTS.md`·`page.tsx`·`HeroB.tsx`·`Philosophy.tsx`·`home.ts`.

---

## 1. S1 적용 체크리스트

### 수정 파일
- `nugoona/lib/content/home.ts` → `hero`(h1·sub·cta·ctaHref)만.
- `HeroB.tsx` → **원칙상 수정 없음**(구조·캔버스·라벨 불변, 데이터만 교체). 예외: accent span 위치가 바뀌면 h1 문자열 안에서 처리(컴포넌트 로직 불변).

### 수정 순서
1. `hero.h1` 교체(accent `<span class="text-accent">` 1곳 유지).
2. `hero.sub` 교체(`<br>` 직접 지정, 두 제품 재나열은 범례와 중복이라 지양).
3. `hero.cta`/`ctaHref` 확인(현행 `무료로 시작하기`/`/start` — S6과 문구 역할 분담).
4. dev 서버(`localhost:3131`)에서 렌더.

### 렌더 확인 항목 (PC)
- [ ] H1 2줄 이내, `leading-[1.1]`에서 sub·CTA와 세로 충돌 없음(content rect 상하 12.5% 안).
- [ ] accent 색(브랜드블루)이 의도한 단어에만.
- [ ] 서브 `max-w-[460px]` 안에서 balance 균형, 윗줄·아랫줄 길이 유사.
- [ ] CTA 버튼 라벨+화살표 한 줄, 캔버스 위 가독(다크 배경 대비).
- [ ] mount 애니(H1→sub→CTA 스태거 0/0.1/0.2) 정상 발화.

### 모바일 확인 항목
- [ ] 서브 `max-w-[300px]` 오버플로 없음(한 줄 ≤약 11자, `<br>`로 제어).
- [ ] H1 `clamp` 최소 28px에서 2줄 이내, 가로 넘침 없음.
- [ ] 좌하단 두 제품 범례(콘텐츠·광고)와 서브 내용 중복 인상 없는지.
- [ ] CTA 버튼 가로 여백 압박 없음.

---

## 2. S2 적용 체크리스트

### 데이터 구조 변경 여부
- **변경 있음(예상).** 현행 `philosophy = { opening, acts[{title, lines[]}] }`는 3막 장문 전제. 짧은 선언으로 가면 shape 변경 필요:
  - 옵션 A: `opening`(새 헤드) + `acts`를 짧은 문장 배열로 축소(기존 shape 최대 유지).
  - 옵션 B: `philosophy = { head, lines[] }` 같은 단순 구조로 재정의(Philosophy 렌더 로직도 함께 수정).
- ⚠️ shape 결정 = PM 카피 구조 확정과 연동(COPY_SLOTS S2). 데이터가 바뀌면 `Philosophy.tsx` 렌더도 반드시 함께 수정.

### Philosophy 재구성 범위
- **제거**: `MOCKS` 맵(RankMock/AdChatMock import·바인딩), 지그재그 레이아웃(`side` 분기·`flex gap-16`), 번호 배지(01/02/03), 3막 `acts` 장문, `opening` "누구나 마케팅하는 시대"(H1 중복).
- **유지·재사용**: 컨테이너(`py-[120px] max-w-[960px] flex justify-center`), `FadeUp`, 헤드 스타일(`clamp(26→42) font-bold text-balance`), Body의 `dangerouslySetInnerHTML` 문장 렌더 골격.

### 신규 컴포넌트 필요 여부 (사실만)
- **필수 아님, 권장.** 현행 `Philosophy.tsx`는 `PhilosophyMocks`(RankMock·AdChatMock)에 강결합. 목업을 S3/S4로 보내려면 import·MOCKS·지그재그를 걷어내야 하므로, **S2 전용 경량 컴포넌트로 분리**하면 결합이 깔끔해짐. 기존 파일 재구성으로도 가능하나, 재구성 시 남는 목업 코드가 사문화될 수 있음(목업은 S3/S4에서 다시 import).
- 최종 결정(재구성 vs 신규) = Phase 4 구현 시.

---

## 3. 구현 리스크

### High
- **S2 데이터 shape 변경 + 렌더 로직 동시 수정** — 데이터와 `Philosophy.tsx`가 어긋나면 빌드·렌더 깨짐. shape 확정 후 한 번에.
- **목업 결합 해제** — MOCKS·import 제거 시 S3/S4 이동 전이라 목업이 "잠깐 어디에도 안 붙는" 상태. 이동 계획과 순서 맞춰야 함.

### Medium
- **page.tsx 순서·다크/라이트 연속** — S2를 제품(S3/S4) 앞으로 옮기면 현행 다크(S1)→라이트(현 S2) 흐름이 바뀜. `Section` 플래그(`noBorder`/`alt`)·배경 재점검 필요.
- **S2 FadeUp whileInView 미발화(캡처 함정)** — 렌더 검증 캡처 시 훑기/강제 필요(S1은 mount 애니라 무관).
- **모바일 서브 폭 오버플로(S1)** — `max-w-[300px]` 제약, `<br>` 제어 필요.

### Low
- **S1 데이터 교체** — 구조 불변이라 실패 비용 낮음.
- **accent span 위치 이동** — 문자열 내 처리, 로직 영향 없음.
- **헤드 스타일 재사용** — 기존 클래스 그대로.

---

## 4. 렌더 검증 체크리스트

### PC
- [ ] S1: H1/서브/CTA 레이아웃·애니·대비. S2: 헤드+선언 중앙 리듬, 목업 없음 확인.
- [ ] S1→S2 배경 전환(다크→?) 자연스러움, `Section` 경계.

### Mobile
- [ ] S1 서브 오버플로 0, H1 2줄 이내. S2 선언 문장 세로 리듬·가독.
- [ ] 폰트 크기(모바일 14px 계열)·자간·행간 촘촘.

### 줄바꿈
- [ ] `<br>` 지정대로 PC/모바일 각각. balance로 윗줄·아랫줄 균형.
- [ ] 긴 문장이 폭 제약에서 의도치 않게 깨지지 않음.

### 애니메이션
- [ ] S1 mount 스태거 발화. S2 FadeUp whileInView 발화(스크롤 진입).
- [ ] 캔버스 빔·범례·LIVE 점멸 정상(카피 반영 후에도).

### 다크/라이트
- [ ] S1 다크 유지. S2 배경·텍스트 색 대비 충분(WCAG 감안).
- [ ] 섹션 경계에서 다크 연속·급전환 없는지.

### 접근성
- [ ] h1(S1)→h2(S2) 위계 유지, 헤딩 레벨 건너뛰지 않음.
- [ ] `dangerouslySetInnerHTML` 안에 스크립트 없음(순수 텍스트+`<br>`/`<span>`만).
- [ ] 캔버스·장식 `pointer-events-none`/`aria-hidden` 유지.
- [ ] CTA는 `<Link>`(키보드 포커스 가능), 링크 목적 명확.
- [ ] 색 대비(다크 배경 위 서브 `#d4d4d4`)·accent 색이 의미 전달을 색에만 의존하지 않는지.

### 마무리
- [ ] BRAND_OS §5 금지 표현 `rg` 검사 0건(순위·상위노출·셀프연동·모델명 등).
- [ ] PM_HANDOFF/NEXT_PLAN/COPY_SLOTS와 반영 결과 정합(오염 점검).
