# 생성 문서

- `docs/home-renewal/COPY_IMPLEMENTATION_PLAN.md` — S1·S2 카피 적용 실행 계획(S1 체크리스트 / S2 체크리스트 / 리스크 High·Medium·Low / 렌더 검증 6영역).
- `docs/home-renewal/COPY_IMPLEMENTATION_PLAN_RESULT.md` — 본 완료 보고.
- 코드·카피 수정: **없음.** 사실만. 이번 문서에서 구현하지 않음.

# 핵심 요약

- **S1**: `home.ts hero`만 교체, `HeroB.tsx`는 원칙상 무수정 → **저위험**. 확인 핵심 = 모바일 서브 `max-w-[300px]` 오버플로, H1 2줄 이내.
- **S2**: 데이터 shape 변경(3막 장문 → 짧은 선언)이 `Philosophy.tsx` 렌더 수정을 동반 → **고위험**. MOCKS·지그재그·번호·opening 제거, 컨테이너·FadeUp·헤드 스타일 재사용. 신규 경량 컴포넌트는 권장(필수 아님).
- **리스크**: High=S2 데이터/렌더 동시 수정·목업 결합 해제 / Medium=page.tsx 순서·다크연속·FadeUp 캡처·S1 서브 폭 / Low=S1 데이터 교체.
- **검증**: PC·Mobile·줄바꿈·애니(S1 mount / S2 whileInView)·다크라이트·접근성(헤딩 위계·aria·색 대비) + 금지 게이트 rg.

# 아직 비어 있는 항목

- S2 데이터 shape 최종안(옵션 A 기존 유지 vs B 단순 재정의) — 카피 구조 확정과 연동.
- S2 재구성 vs 신규 컴포넌트 최종 결정(Phase 4).
- 실제 카피(PM 작성 대기).

# ChatGPT가 다음에 결정해야 할 항목

1. S1·S2 실제 카피 확정(H1·서브·CTA / S2 헤드·선언 문장).
2. S2 선언의 문장 수·구조 → 데이터 shape(A/B) 결정에 직결.
3. S1 서브가 두 제품 범례와 중복되지 않게 무엇을 말할지.

# 다음 Phase 추천

**S1·S2 카피 확정 → 실행 반영.** PM이 카피를 확정하면, 실행(Claude)은 이 PLAN의 순서대로 **S1(저위험)부터** `home.ts hero` 교체·렌더 확인 후, S2 데이터 shape 확정 → Philosophy 재구성 → page.tsx 순서 → 렌더 검증 → 금지 게이트 순으로 진행. 산출물 = 반영된 S1·S2 + PC/모바일 렌더 캡처 + 게이트 결과.
