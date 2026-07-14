# S1 반영 결과 (2026-07-13)

## 수정 파일 목록
- `nugoona/lib/content/home.ts` — `hero.h1`(accent '누구나'→'마케팅'), `hero.sub`(신규 3줄) 교체 + 주석 갱신. `hero.cta`/`ctaHref`는 유지.
- `docs/home-renewal/COPY_SLOTS.md` — S1 H1 슬롯 accent 기준 '마케팅'으로 동기화.
- `docs/home-renewal/S1_S2_IMPLEMENTATION_GUIDE.md` — S1 H1 accent 기준 동기화.
- `docs/home-renewal/PM_HANDOFF.md` — §3 S1 실측을 반영본으로 갱신(개편 전 값은 이력으로 병기).
- `docs/home-renewal/S1_COPY_INPUT.md` — Claude 검증 결과 기록란 채움.
- **HeroB.tsx 등 컴포넌트: 무수정**(구조·캔버스·애니메이션·범례 불변).

## 반영 완료 여부
- **완료.** H1·서브 = home.ts에 반영, DOM 실측 일치(H1 html `누구나 <span class="text-accent">마케팅</span>하는 시대`, 서브 3줄, CTA "무료로 시작하기").

## 렌더 검증 결과
- **PC(1280)**: H1 1줄(accent '마케팅' 파랑), 서브 3줄 중앙 balance, CTA 정상. 2줄 이내 충족.
- **Mobile(뷰포트 312)**: **오버플로 없음** — 측정 `document scrollWidth 312 = clientWidth 312`, H1 left35~right277 한 줄(fontSize 28px), H1 self-overflow 없음. 서브 줄바꿈 정상, 버튼 정상.
- **금지 표현 게이트**(BRAND_OS §5): 통과(순위·보장·상위노출·소상공인·셀프연동·모델명 등 없음).
- **검증 수준**: 실제 브라우저 렌더(Playwright) + DOM 측정까지 = 검증 사다리 최상단(E2E). 단위·타입만이 아님.
- **참고**: element 캡처(`[data-hero]`)가 처음 잘려 보인 것은 resize(390)와 실뷰포트(312) 불일치 아티팩트였고, 뷰포트 캡처·수치 측정으로 실제 정상 확인.

## PC 캡처 경로
- `s1-pc-viewport.png` (레포 루트, 뷰포트 캡처) — H1 정중앙(측정 h1_center=viewport_center=512, 좌우 여백 대칭 171px). ⚠️ 구 `s1-pc.png`는 element 캡처 왜곡으로 우측 쏠림처럼 보였음 — 폐기.

## Mobile 캡처 경로
- `s1-mobile-viewport.png` (레포 루트, 뷰포트 캡처) — H1 한 줄 중앙·오버플로 0. ⚠️ 구 `s1-mobile.png`(element 캡처)는 아티팩트로 잘려 보였음 — 폐기.

> **캡처 교훈**: `[data-hero]` element 캡처는 resize 뷰포트와 실뷰포트 불일치·absolute 콘텐츠로 **왜곡**된다(우측 쏠림·잘림처럼 보임). 홈 캡처는 반드시 **viewport 캡처 + 좌표 측정** 병행으로 검증한다.

## 남은 이슈
- **CTA 문구 중복(경고 유지)**: "무료로 시작하기"가 S6 primary와 겹침(HOME_MESSAGE_SYSTEM §4). S6 카피 확정 시 역할 분담 필요. 지금은 변경 안 함(PM 지시).
- 폐기 시안 `HeroC.tsx`·`Draft_CoreSet.tsx`에 옛 accent 표기가 남아 있으나 홈 미사용·레거시 보존 대상이라 미수정.
