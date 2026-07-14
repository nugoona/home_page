# 완료 요약

- **수정한 문서**: `docs/home-renewal/PM_HANDOFF.md`(§6 개편가설 → PM 확정 구조 6섹션, §5 문제별 채택/기각, §9 작업로그 추가) · `docs/home-renewal/NEXT_PLAN.md`(Phase 1 완료 표시, Phase 2 대상 S1~S6, 철학 해체·변경파일 갱신).
- **생성한 문서**: `docs/home-renewal/COPY_SLOTS.md`(카피 슬롯 명세) · `docs/home-renewal/PHASE1_RESULT.md`(본 파일).
- **코드 수정 여부**: **없음.** 홈 컴포넌트·`home.ts`·이미지·스타일 일절 미수정. 구조 확정은 문서에만 반영.

# 확정된 홈 구조

- **S1 히어로** — 마케팅을 직접 운영하는 시대와 두 제품(HeroB 캔버스 유지).
- **S2 공통 철학** — 전문가만의 일이었던 마케팅의 진입장벽을 낮춘다(짧은 선언, 제품 목업 없음).
- **S3 누구나 콘텐츠** — 고민은 줄이고, 콘텐츠는 내 계정에 쌓인다(app-home-mobile·RankMock·nc.svg).
- **S4 누구나 광고** — 어려운 광고를 쉬운 말로 이해하고 직접 결정한다(app-dashboard-mobile·AdChatMock·na.svg).
- **S5 회사 약속** — 앱은 계속 바뀌고, 기존 고객의 요금은 그대로다(PromiseTimeline; 가상 날짜 타임라인은 결정 대기).
- **S6 CTA** — 부담 없이 한 달 먼저 시작(매니지드 온보딩).

# 카피 슬롯 핵심 제약 (섹션별 최대 2)

- **S1**: 서브는 H1 반복 금지 → 두 제품을 직접 설명 / 모바일 H1 한 줄 ≤11자(폭 제약).
- **S2**: 현행 opening·3막 REMOVE(해체) → 새 헤드+짧은 선언 / 장문 서술 지양.
- **S3**: 카피는 `PhoneScene.tsx` 하드코딩 직접 수정 / RankMock 배지는 측정·현황만(순위 보장 금지).
- **S4**: 광고 철학을 새로 세움(현행 0개) / AdChatMock 답변은 과거 사실 서술만, 매니지드(셀프 연동 표현 금지).
- **S5**: 공통 주어로(현행 "누구나 콘텐츠가" 한정 해소) / "추가 비용 없음"은 강조 1곳만.
- **S6**: 무료/카드/약정 정보는 각 1회만 / primary CTA가 S1과 중복 → 역할 분담.

# 새 컴포넌트 필요 가능성

- **필요 후보**: S2 공통 철학 전용 경량 컴포넌트 — 철학을 S2/S3/S4로 3분할하면서 목업 결합을 끊어야 하므로 분리 편이 유리(필수는 아님).
- **기존 컴포넌트 재구성 가능 후보**: `Philosophy.tsx`(acts를 짧은 선언으로 축소 + MOCKS 맵 제거 시 S2로 재사용 가능) · `PhoneScene`/`AdScene`(S3/S4 제품 섹션으로 카피·목업 재배치) · `PromiseTimeline`·`CTA`(그대로 재사용).
- **아직 확정할 수 없는 부분**: S3/S4를 기존 Scene 하드코딩 확장으로 갈지 새 제품-철학 컴포넌트로 분리할지(Phase 4 구현 시 결정) · S5 타임라인 표시 방식(가상 날짜 처리) · 목업의 S3/S4 이동이 FadeUp 스태거·`MOCKS` 인덱스 매핑에 주는 영향(이동 후 렌더로만 확정).

# Phase 2 시작을 위해 ChatGPT가 작성해야 할 카피 (슬롯 이름)

- **S1**: H1, 서브, CTA.
- **S2**: 헤드(신규), 짧은 선언 본문.
- **S3**: 제품 라벨, 헤드, 서브, 핵심 경험 문장, CTA / RankMock: 제목, 행 2~3(키워드·부제·배지).
- **S4**: 제품 라벨, 헤드, 서브, 핵심 경험 문장, CTA / AdChatMock: 사용자 질문, AI 답변.
- **S5**: 헤드, 서브 문단, 강조 문장(공통 주어). 타임라인 표시 방식 = 결정 대기.
- **S6**: 헤드, 서브, primary CTA(무료/카드/약정 각 1회 배치).

# 변경 파일 목록

- `docs/home-renewal/PM_HANDOFF.md` (수정)
- `docs/home-renewal/NEXT_PLAN.md` (수정)
- `docs/home-renewal/COPY_SLOTS.md` (신규)
- `docs/home-renewal/PHASE1_RESULT.md` (신규)
- 홈 소스코드: **변경 없음**.

# 검증 결과

- **PM_HANDOFF / NEXT_PLAN / COPY_SLOTS 상호 모순 여부**: 없음. 세 문서 모두 확정 6섹션(S1~S6)·동일 스토리 순서·철학 해체(S2 공통/S3 콘텐츠/S4 광고)·RankMock=S3·AdChatMock=S4·S5 타임라인 결정 대기로 일치. 슬롯 요약(COPY_SLOTS) = PM_HANDOFF §6 시각물 배정과 대응.
- **홈 소스코드 미수정 확인**: `page.tsx`·`home.ts`·컴포넌트·이미지·스타일 편집 0건(문서 4건만 변경).
- **미확정 사항**: ① S5 가상 날짜 타임라인 표시 방식 ② S3/S4를 Scene 확장 vs 새 컴포넌트 분리 ③ 앱 스크린샷 빌드·계정 및 대시보드 날짜 불일치 교체 가능 여부 ④ 목업 이동 시 애니메이션·인덱스 의존성 ⑤ home.ts 폐기 export 참조처(정리 전 grep). — 전부 PM_HANDOFF §8/§6에 기록, Phase 2~4에서 해소.
