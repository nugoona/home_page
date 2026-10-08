# 누구나컴퍼니 홈페이지 — 디자인 설계서 (단일 소스)

## 2026-09-20 최신 제한 — 디자인 변경은 사전 승인

사용자가 전화번호는 그대로 두고 나머지 문구·동선 오류 수리를 위임했다. **레이아웃 또는 개별 디자인을 바꾸기 전 무엇을 왜 바꿀지 설명하고 사용자 승인을 받는다.** 이전 ‘필요한 모듈 확장 자율 허용’보다 이 제한이 우선한다. 요금·시작 안내와 앱 예시 문구의 사실 교정은 기존 요소·클래스·배치를 유지한다. 모바일 요금 제품 탭의 이름 줄바꿈·비활성 글자 대비 문제는 별도 승인 요청했으며 승인 전에는 수정하지 않는다.

## 2026-09-19 텍스트와 버튼 실물 보완

사용자 지시: **텍스트도 디자인이다.** 내용이 필요하다는 이유만으로 문장을 쌓지 않는다. 기존 골격·장면을 보존하고 중복을 덜어내며, 버튼은 실제 목적지나 행동을 말한다. 이번 직접 수정 담당은 코덱스이고 `/home2`·`/content2`·`/ads2`에 한정해 원본 기본 출력은 유지했다. 상세 결과·검수 한계는 작업요청서 §0.4-C.

- 메인 서비스 버튼은 ‘누구나 콘텐츠 보기 / 누구나 광고 보기’로 통일하고 비교 상세로 연결. 모바일 단계 이름을 짧은 행동으로 정리하고 기존 위치 표시를 44px 누름 영역의 선택 버튼으로 확장했다. 원본 캐러셀은 기본 분기 유지.
- 첫 화면은 두 줄 설명으로, 검색 후 다음 글감 안내는 표의 해당 행 안으로, 광고 제작·성과의 중복 문장은 하나로 정리. 플러스 조건·영상 직접 확인·공개 자료 조건은 보존.
- 참고 조사: [Shopify](https://www.shopify.com/)의 제품별 목적지 분리, [Buffer](https://buffer.com/)의 업무별 짧은 소개, [WAI 링크 목적](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html), [Carbon 버튼](https://carbondesignsystem.com/components/button/usage/). 짧고 목적이 분명한 행동 문법만 적용하고 외부 색·장식은 이식하지 않았다. 새 이미지가 필요한 변경은 아니었다.

## 2026-09-18 추가 원칙 — 기존 디자인 보존과 필요한 변경

**최신 디자인 작업 범위(2026-09-18):** 콘텐츠·메인·광고·공통 동선의 남은 개선을 클로드가 비교 페이지에서 일괄 진행한다. 기존 /content 디자인을 기반으로 한 3차 시안 d86f93d는 재료이며 사용자 최종 승인 전이다. 1·2차 시안의 실패는 글·라벨·상자·주석을 쌓아 위계가 사라진 것이었다. 이를 이유로 새 모듈·이미지를 전면 금지하지 않는다. 사용자는 기존 골격·톤앤매너에 맞는 필요한 추가를 허용했다. 기존 원본에 중복이 많다고 전제하거나 좋은 장면을 광범위하게 삭제하지 않는다. 실제 오류·지나친 중복만 정리하며 의미를 보존해 축약·통합할 수 있다. 원본 출력은 유지하고 새 구간은 별도 비교 화면에서 PC·모바일 실물 검수한다. 세 구간만 보완하던 종전 범위는 이번 일괄 작업으로 확대됐다. 구체 작업과 완료 기준은 `docs/홈페이지-디자인-작업요청.md` §0이 기준이다.
**이번 시안의 조사 근거:** [Buffer Publish](https://buffer.com/publish)의 업무별 설명·화면 연결과 [HubSpot Marketing](https://www.hubspot.com/products/marketing)의 효용별 제품 설명을 참고했다. [Carbon Tabs](https://carbondesignsystem.com/components/tabs/usage/)와 [WAI Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)에서 대안 콘텐츠 전환·선택 상태를 확인했으며, 이 시안은 복잡한 탭 대신 기본 버튼 두 개와 aria-pressed로 구현했다. 외부 색·장식을 복제하지 않고 기존 Clone01의 얇은 선·변환 관계 문법만 재조립했다. 생성 이미지나 실제 앱을 흉내 낸 외부 채널 UI는 사용하지 않았다.

이번 통합 작업 기준은 [홈페이지 개선안](../docs/홈페이지-개선안.md) §8이다. 기존 검정·흰색·파란색, 글꼴·제목·여백·모듈에 들인 완성도를 유지한다. 내용에 맞는 재배치·추가·교체는 가능하며 기존 모듈 재사용·확장을 우선한다. 고객 이해에 이미지가 꼭 필요한 경우 작업자가 직접 제작·검수한다. 이미지 제작은 필수가 아니며 생성 이미지를 실제 앱 기능·실제 성과의 증거로 쓰지 않는다. 통합 문서 작성 이후 문구 반영과 `/content2` 시안이 진행됐으며, 최신 작업 범위는 위 작업요청서 §0을 따른다. 아래 과거 섹션 수는 이번 변경의 완료 조건이 아니다.

> **이 문서 하나로 관리한다.** 디자인 관련 결정·톤·규칙·리빌드 방향은 여기서만 업데이트하고, 여기저기 흩어놓지 않는다.
> 토큰의 **실제 최신값**은 항상 `nugoona/app/globals.css`가 정본(이 문서는 의도·규칙·이력). 자동 생성 스냅샷은 `docs/ctx/nugoona.md`(직접 수정 금지).
> 최종 갱신: 2026-07-07 (초안 — 현행 코드 파악 기반).

---

## 0. 이 문서의 목적
- 누구나 홈페이지를 **리빌드**하면서 (내용은 크게 바뀌되) **기존 버셀 스타일 디자인 톤앤매너는 차용**한다.
- 현행 코드에서 살릴 자산·규칙·모션을 정리하고, 리빌드 결정사항을 누적한다.
- "무엇을 왜 그렇게 정했는가"가 컴퓨터가 꺼져도 남도록.

## 1. 현재 상태 = **구현 현황 정본** (실측 2026-07-10 · 사장님 3축 중 ①)
> 이 절이 "실제로 지금 무엇이 존재하는가"의 단일 소스다(§8.0은 **계획**, 이 절은 **실물**). 코드가 바뀌면 여기부터 갱신한다.
> 자동 스냅샷 `docs/ctx/nugoona.md`는 컴포넌트 목록일 뿐 섹션 구성·의도를 담지 못한다.

- 스택: **Next.js 16 + Tailwind v4 + Framer Motion**, Pretendard(한글)/Inter Tight(영문)/Nanum Myeongjo(인용 전용). `nugoona/`.
- **라우트 13개**(실험장 `/lab/*` 26개 별도 · 실측 2026-09-19):
  `/` `/content` `/ads` `/pricing` `/start` `/features` `/about` `/privacy` `/terms` `/styles` + 비교 시안 `/home2` `/content2` `/ads2`.
  ⚠ 아래 표에 `/privacy`·`/terms`가 빠져 있었다 — 푸터에서 쓰고 앱 심사 요건인 공개 페이지다.
  | 라우트 | 지위 | 실제 구성 |
  |---|---|---|
  | `/` 홈 | **PC·모바일 1차 완성(2026-07-16)** | **PC**: HeroB → **TwoAppsRail**(회사 정의 + 누구나 콘텐츠(S41)/광고(S42) 블록 지그재그, Grid Occupancy) → BrandPhilosophySection(철학+선언) → S6AssetStacks(자산) → S3GraphicA(OUR WAY 궤도 + **밝은 채팅 카드**, 07-16 다크 패널 폐기) → S7UpdatePairs(업데이트) → S8CtaDark(CTA). ⚠ **S2Concept1은 홈에서 제외**(07-15, `/ads` 도입부 이식 대기 — `app/page.tsx` 미연결). **★모바일 = §8.18 전용 컴포넌트 트랙**(`MobileOurWay`·`MobileOrbit`·`MobileAssetTimeline`·`MobileProductCarousel`·`MobileStepMocks` — PC와 별도 설계, `md:hidden`). 여백 = 모바일 칸칸이(§8.18-I). 구 TwoAppsHeader·PhoneScene·AdScene 원작 보존. 검수 무대 `/lab/*`. |
  | `/content` | 리빌드 중 | S1 히어로 확정(§8.17 스타일 락). **S2 = 카피+비주얼 v4(2026-07-17, 4차 — 반려 이력: ①상징 SVG "네모칸이 뭔지 모름" ②겹침 카드 "그림자"+주체 부재 ③"예약≠누적" ④칩+아카이브 "로고·이름만으론 부족, 폰 실화면+채널 카드 일부+실제 검색창, 벽돌 수직·캐러셀 금지". v4 구성 = `S2Collage`(폰 목업 = S41 phone-frame 비례 축소·NC 앱 "새 글" 실화면 + 채널 카드 3장 블로그·인스타·쇼츠 계단식 겹침) → PC 수평 점/모바일 세로 이음선 → `S2SearchWindow`(그린 검색바 "성수 딸기 케이크"+탭바 전체·블로그·이미지·지도, ⛔네이버 로고 미사용). 서사 = 블로그 카드 제목 "딸기 케이크가 새로 나왔습니다" = 검색 결과 내 글 제목. ⛔모바일 수평 이동 금지 §8.18. **v5 마감 수리(같은 날, 페이블 적대 검수 15건 → 반영)**: 무대 도입(DotStage+십자 = S4 문법, "허공 부유" 해소) · 폰 220px 확대+부제 삭제(판독) · 폰 크롭 = 발행 버튼 무는 홀더 컷 + 잘린 단면 밀착 radial 구획선(StepHead 문법) · 카드 우측단 right:0 완전 정렬+바디 h-11 통일(지그재그 해소) · 컨테이너 412px 실측(빈 공간 제거) · 검색창 300px 축소+Chrome("통합검색") 재사용 · 결과 제목 text-accent 단일(비토큰 파랑 2종 제거) · 카드 체크 #171717(accent 절제) · 스켈레톤 #EBEBEB/#E4E6E9 2단 통일 · 커넥터 = §8.15 그라디언트 선 1.7px+점 1개. **v6(같은 날)**: 모바일 카드 중앙 스택. **v7(같은 날)**: 채널 카드 3장 폐기 → 매체 표기 1행 + 폰 크롭 218 + 검색 결과 = 플레이스+블로그 2건 + 콜라주 PC/모바일 공용 재통합. **v8 최종 컨펌(같은 날 사장님 "완료")**: 폰 사진 3장 = **정사각**(2사진+1영상 흰테두리 플레이 마크) · 발행물 행 = **매체 로고 타일 3장**(정사각 92px: 배경 사진 원본+검정 45% 오버레이 다크 톤다운, 중앙 로고만 크게 42~48px — ⚠투명도 낮추기(화이트 뿌염) 금지, 다크 오버레이가 정답) · 인스타 = **공식 그라디언트 앱 아이콘 재현**(radial 노랑→핑크→보라, 매체 공식 로고라 §7-7 보라 그라디언트 금지의 예외 = 사장님 실로고 지시) · 네이버 N 초록/유튜브 빨강 채움 · Vercel 1px 테두리+옅은 그림자. 매체 로고 표기 허용 — 단 매체 UI 재현은 여전히 금지)**. **S3 v5(2026-07-17 — v4 디테일 반려 "빔이 카드 위·02 텍스트 해석·지도 디테일 0" → 수리)**: 01 = A4 AnimatedBeam(글 카드 z-10 = **빔이 카드 뒤로**, 스켈레톤 → 실텍스트+말줄임) / 02 = **갤러리 C1 BorderBeam 원본**(테두리 도는 블루 빛) + **"글로 읽히는" 완결 문장**(v6 사장님 교정 — 헤더·NC 로고·칸 구분 제거: "네이버 노출은 실제 방문 경험이 담긴 글이 더 유리해지고 / 구글 지도는 사진이 담긴 소식이 먼저 보이게 바뀌면 → ✓ 다음 글에 반영") / 03 = 지도 v2(도로 외곽선 위계 대로1+골목2·녹지 2·지명 라벨 "성수동 2가/서울숲"·핀-칩 꼬리 정렬+접지 그림자 하드 타원·"구글 지도에도 함께" 흰 배지 우하단). S2 pb-14·S3 pt-8 공백 축소. ⚠인스타 defs id = s3 접두. ★lab-sources 원본 직접 import(A4+C1). ★교훈 = 스켈레톤 자제·실텍스트+말줄임, 은유가 필요한 항목은 갤러리 소스에서(자작 도형은 "텍스트 해석"이 됨). **S4 v3(2026-07-17 사장님 안A — "텍스트 리스트 = 카피 중복·목업 매력 없음" → 단계별 실물 3단)**: steps 텍스트 리스트 폐기 → `S4StepHead`(홈 StepHead 축소 문법: 다크 필 번호+라벨+한 줄 설명, steps 토씨 재사용) + 01 `InputCard`(업로드 창 v2 — 사진 2장+[+사진 추가] 점선 칸, 음성 = 녹음 활성 파란 마이크+웨이브 애니+받아쓴 지시문 "오늘 나온 딸기 케이크로 소개글 써줘") → 02 `S4ArticleCard`(글 완성 — "성수 딸기 케이크" 검색어 하이라이트 = 02 desc 실증) → 03 `S4FormatRow`(**주인공** — 같은 글이 형식만 바뀜. ★2026-09-19 실측: 실제 세 카드는 **블로그 / 인스타그램 / 페이스북**이다. "쇼츠 9:14 세로 영상"은 낡은 서술. 셋 다 앱의 실제 채널이 맞다 — 앱 지도 142·83번. **영상 갈래는 빠져 있었고**, 비교 시안 `/content2`에서 `shorts` 인자로 넷째 카드(쇼츠·릴스)를 더했다(PC 4열·모바일 2×2). 구 ChannelCards 폐기). ⚠인스타 defs id = s4 접두. **★사진 = 딸기 케이크 3종 교체(2026-07-17 사장님 택B "카피가 서사 뼈대니 사진을 맞춰라")**: `/img/content/cake-1.jpg`(프레지에 딸기 케이크 = 메인)·`cake-2.jpg`(딸기 토핑 케이크)·`cake-3.jpg`(딸기 디저트 세로 = 쇼츠용) — Unsplash 실측 확인 후 저장, ContentSections 전체 hero-1~3 → cake-1~3 일괄 치환(hero-*는 lab 갤러리용으로 보존). **S5 비주얼 v2(2026-07-17 안C → 사장님 교정 "가운데 고리(무엇이 바뀌었나) 부재"): 매체 로고 타일 5(네이버·플레이스·인스타·당근·구글) → 수렴선+점 → `S5NewsCard` "이번 주 수집" 소식 카드(항목 2건: [N] "검색, 실제 방문 경험이 담긴 글 우대" = accent → 아래 글 하이라이트와 색 연결 / [G] 지도 사진 흐름 — 매체 정책 중립 서술만) **로 끝(v3 사장님 "반영 글 창은 중복 → 소식까지만" — S5ArticleWindow·이음선 삭제. v4 = 소식 항목을 매체 5종 전부로: [N accent]검색 실제 방문 경험 글 우대 / [플레이스]새 소식 글이 지도 검색에 함께 / [인스타]릴스 커버 비율 변경 / [당근]동네 가게 소식 글 영역 확대 / [G]사진 있는 소식 우선 — 전부 중립 정책 서술, 위 타일 5개와 1:1 대응. 인스타 defs id = s5n 접두)**. `ContentSections.tsx` ContentS5Visual, 근거 = A14. ⚠인스타 defs id = s5 접두(§8.14-6). ★교훈 = 인과 사슬의 모든 고리는 실물 카드로 — 라벨·각주로 건너뛰면 직관성 반려)**. **S6 폐지(2026-07-17 사장님 — 플레이스는 S2 검색결과·S3-03 지도 장면·S5 소식에 이미 3회 등장, 페이블 동의. page.tsx에서 섹션 삭제)**. **S7 구현(같은 날 사장님 확정)**: `ContentS7Visual` = [네이버 검색 API 칩(N 로고+DATA)] → 세로 이음선("검색량·순위 데이터를 매일 가져옵니다" — 사장님 "손님 검색 장면은 과함, API 수집 한 줄이면 됨") → `S7RankBoard`(Chrome "순위 확인"+"추적 중인 검색어·매일 07:40 확인" 헤더 + 키워드 3행: 검색량(월 N회)+4곳 순위(블로그 절대순위·플레이스·구글 1페이지 ○×)+**정직 혼재**(1페이지 7위 accent / 3페이지 27위+하락 경고 뱃지 / 중간) + 30일 스파크라인 1개(`S7Sparkline` 결정적 데이터, 상승 일변도 금지)). 근거 = A12(검색량 게이트·keywordstool 실측)+A13(매일 07:40·4곳·하락 경고만). **S8 확정형(2026-07-18 — 마키·카드·예시 키워드 안 전부 반려 "카드에 집착 말라, 스텝으로 로직 그 자체를" → 로직 스텝 2창)**: `ContentS8Visual` = ① `S8KeywordSteps`(창 "목표 키워드": 01 업종 분석 → 02 지역 분석 → 03 월간 검색량 추출[네이버 검색 API 배지] → ✓ 가게에 알맞은 목표 키워드 확정. **예시 키워드 표기 금지** — 로직 단계가 주인공) + ② `S8TopicSteps`(창 "1년치 글감": 01 가게 재료 분석 → 02 각도 확장("메뉴 소개로 시작해 가게 이야기로 끝납니다") → 03 1년 달력에 배치 → ✓ 1년치 글감 **52**개 완성 + "무엇을 올릴지 고민하지 않아도 됩니다"). 공용 = `S8Step`(다크 필 번호+**우측 선 아이콘** 가게/핀/차트/격자/문서/달력 — 텍스트 천편일률 해소)·`S8StepGroup`(**연속 세로 스파인** rgba .32 — 끊긴 선+glow 도트 마감 불량 폐기)·`S8Result`(⛔파스텔 틴트 배경 금지 §7-7 — 흰 배경+hairline+accent 텍스트만). ⛔"각도" 용어 금지(유저 언어 아님 → "재료 하나를 여러 글로"). **최종 구조(2026-07-18 사장님)**: 서브 카피 삭제 → `S8SearchBox`(상호 검색 UI "상호명만 넣어주세요"+파란 검색 버튼 = 서사 출발) → `S8Connect`(단색 accent 밀착 연결선, 도트 없음) → 창1(Chrome 폐기, 머리 = 카피 "최적의 목표 키워드를 찾아 드립니다") → 연결 → 창2(머리 = "어떤 글을 써야 할지 자동으로 분석해 52개의 글감을 선정합니다", 결과 행 = "무엇을 올릴지 고민하지 않아도 됩니다"). 인수 반응 = "정교한 원리(신뢰)"+"고민 불필요(편의)". ⛔내부 수치·내부 카테고리명 노출 금지. **S9·S10·S11 구현(2026-07-18 사장님 "갤러리 원본+승인 실물만, 자작 저퀄 금지")**: S9 = `ContentS9Grid` **v3 확정(사장님 3차 교정 — 구조: 행마다 [좌 텍스트|우 목업] 페어, 구획선 구분. 기능 5개로 축소·재배열: ①사진 질문(최중요 맨 위 — "애매하면 AI가 되물어 → 답 한 줄로 더 정확·풍성한 글") ②리뷰 답글 ③쇼츠·릴스(**PREMIUM 배지**·"전문 편집자가 완성") ④대표 이미지 **v2(사장님 교정 "썸네일 = 같은 사진에 텍스트 디자인만 다른 것")** = 같은 cake-1+같은 제목에 실서비스 템플릿 HTML 실측 재현 5종(089 테두리 박스/095 캡션+흰 띠/100 다크 글래스/091 하단 그라디언트/104 우측 정렬)+"+10 더 많은 디자인" 칸, 캡션 "같은 사진, 다른 디자인 — 고르기만 하세요". /thumbs 데모 에셋 6장은 폐기(서로 다른 사진이라 오개념) ⑤여러 스토어. 말로 수정·검토·일정·음성 업로드 = 중복·부차 제외)**: 목업 소스 = ①`answer` 화면 실측(실제 폴백 질문 "이 사진은 무엇인가요? 자랑할 점은?"·placeholder 토씨) ②`review-reply` 실측(리뷰 인용→AI 초안→복사 버튼) ③영상+음성 요청+전문가 완성 ④실서비스 `/thumbs` 에셋 ⑤갤러리 A4 AnimatedBeam 원본(성수점·연남점·판교점→한 계정). ★교훈 = 기능 증명 = 실서비스 화면·실토씨 차용(자작 금지) · S10 = `ContentS10Visual`(홈 S6 "고객님의 블로그" 창 실물 + **갤러리 D6 MinimalCard 원본** 글 카드 4장 cake 사진) · S11 = `ContentS11Cta`(**갤러리 B1 BackgroundBeams 원본** 다크 배경 + 홈 S8CtaDark 타이포 정합 + S8 검색 UI 다크 재수신 "스토어 이름"→[한 달 무료로 시작]→/start + "카드 등록 없이"). ⛔ S9 "미니 UI" 점선 플레이스홀더·S11 인풋 미확정 해소 — /content 전 섹션(S1~S11, S6 폐지) 실물 구현 완료. **★GPT 전면 개정 적용(2026-07-18 사장님 "이대로 수정" 합의 — 리듬 반복·케이크 편중·후반 나열 해소)**: ①**업종 배정표(사장님 확정 규칙 2026-07-18: 업종당 1회·요식업 편중 금지·블로그 마케팅 활발 업종)**: 카페 케이크=**S2에만**(사장님 2026-07-18 3차 지적: "S3·S4도 케이크 금지") / 에스테틱("달빛 에스테틱", biz-esthetic)=S3 빔 카드·지도 라벨 / 펜션("강릉 오션뷰", biz-pension-1~3)=S4 업로드·글·3형식 / 화덕 피자=S9 대표 이미지(고정 허용) / 미용실=S7 순위 / 꽃집=S9 사진 질문(biz-flower) / 네일숍=S9 리뷰 답글 / 필라테스=S9 쇼츠(biz-pilates) / 애견미용·공방·사진관=S9 멀티스토어 상호 / 인테리어=S10 자산(biz-interior-1~4). 신규 에셋 = `public/img/content/biz-*.jpg`(Unsplash 실측 확인 후 저장). ⛔새 섹션·목업에 업종 추가 시 이 표에 없는 업종만 사용 ②~~S5 소식 단독~~ → **사장님 재반려로 흐름도(타일5+수렴선+소식 카드) 복원**("칭찬했던 디자인 삭제하지 마라 — 사장님 지시 > GPT") ③S7 = 크롬·무대 제거 표 하나, 숫자 28px·보조 12px ④~~S8 온보딩 1창~~ → **사장님 재반려로 스텝 로직 2창(아이콘 스텝+카피 머리) 복원**("요약하지 마라, 스텝이 훨씬 낫다") ⑤S9 = 3묶음 상이 레이아웃(게시물 정확성 페어 2행 / 운영 절감 2열 카드 / 전문 작업 = **다크 패널 PREMIUM** 차별) ⑥S3 = 01 전폭 크게 + 02·03 2열 압축 ⑦S4 배지 박스 → 보조 한 줄 ⑧S10 py-32 존재감 ⑨S11 pb-36(N 플로팅 겹침 해소) ⑩무대·십자·신호등 크롬 사용처 축소(S2 무대·S2 검색창/S10 블로그 창 크롬만 유지 — 홈 정본 문법이므로 전면 제거 아닌 남발 제거). 유지 = 섹션 논리·확정 카피·직각·팔레트·실물 목업. **★섹션 리듬 통일(2026-07-18 사장님 "섹션 구분 인지 안 됨·제목 규격 제각각"):** ①전 섹션 경계에 `SpacerRow`(격자 한 줄) 삽입 = 홈과 같은 구분 리듬(구분 안 되던 근본 원인 = 배경 alt로만 구분·격자 리듬 부재) ②`SectionHead` 단일 규격(Eyebrow ✦ + 헤딩 clamp(26,3.4,38)·bold·-0.04·1.26 + 서브 clamp(15,1.4,18)·#4f4f4f·balance) 전부 **좌측 정렬 통일**(S5 중앙→좌측, 중앙은 CTA S11만) ③서브 2줄 이내+text-balance(⚠한글 쉼표는 balance가 줄 앞으로 미니 쉼표 제거/"과" 치환 — S4·S5·S7 실증) ④배경 흰색 통일(alt 연회색 폐기 — 구분은 격자가 담당). page.tsx 전면 재구성 + S2·S4 헤딩 40→38 통일. **★섹션 카피 타이포 = 홈 실측 문법 통일(2026-07-17 사장님 "홈이 기준")**: 헤딩 `font-bold tracking-[-0.04em] leading-[1.26] text-balance`(홈 S6 실측) / 서브 `clamp(15px,1.4vw,18px) font-medium #4f4f4f leading-[1.55]`(홈 TwoAppsRail 실측) — page.tsx `H` 상수·ContentS2·S4 적용, 다크 CTA(S11)만 홈 S8CtaDark(semibold) 정합 유지. **+영문 단락 라벨 `Eyebrow`(홈 ✦ 22px + 13px 대문자 0.14em #555 실측 문법, ContentSections export)**: S2 Build-up / S4 Channels / S5 News(center) / S6 Place / S7 Tracking / S8 Start / S9 Features / S10 Asset. 와이어프레임 Tag·S5 한글 어깨문구("가장 중요한 것") 폐기. 비주얼 선정 루프 = **갤러리 63종(/lab/sources 53 + /lab/vercel 10) 안에서만 조합**(사장님 확정 2026-07-17 — 새 소스 탐색 기본 금지, 없을 때만 단품 추가 승인). ⚠ S5~S11 카피가 page.tsx 하드코딩(§7-6 위반, 교정 대상 — S2~S4는 content.ts 연결됨). **★편집 리듬 매핑(2026-07-18 사장님 "매핑은 페이블 판단 — 조잡하게 섞지 말고 통일감+섹션 구분" → 페이블 확정·장착. 교정 이력: 다크 S5→S4 "채널이 핵심" → **최종 = 중간 다크 폐기, S4도 회색**("다크 없애고 회색으로"))**: 도구 = 흰(기본)/**회색 밴드 2곳(S4·S9** `#eef0f3` — #f4f5f7은 흰 대비 4%라 밴드 인지 불가 실측, 반 단계 진하게)/다크는 **S1 히어로·S11 CTA 양끝만**. S4 = 회색 밴드 위 도트 무대(#fafafa)+흰 목업 창 층위(Ramp 문법). S9 = 회색 밴드 + 묶음2 카드 제목 먼저→목업(사장님 "제목이 목업 밑" 반려 수정) + **묶음3 쇼츠 PREMIUM 다크 카드 재작업(사장님 "그냥 검은 네모·밋밋" 반려 → 갤러리 조합)**: C1 BorderBeam 원본(테두리 도는 흰→블루 빛)+rounded-[14px]·테두리 white/16(사장님 직접 지시 = 직각 예외)+왕관 직선 글리프 PREMIUM 배지+세로 썸네일 3장 꽉(aspect 9/14: 필라테스·**클라이밍짐 biz-climbing·댄스학원 biz-dance = 신규 업종 추가**(배정표 외 업종만 규칙 준수, Unsplash 실측 저장)+가운데 플레이+하단 라벨 그라디언트). 나머지 구분 = 면적·여백: S2 최대 장면(기존) / **S7 순위판 = 헤딩과 같은 좌축+560px**(mx-auto 440 중앙 부유 폐기 — "좌 헤딩/중앙 목업 축 불일치 = 위계 안 읽힘" 사장님 지적 근본 수리. 리서치 실증 = 세계 SaaS 16사 중 중앙 부유 0곳, NN/G 근접성=위계. **+2026-07-18 사장님 교정 2건: ①▼ 하락 삼각형 폐기**("구리고 위치 안 맞음 — 제대로 못 할 거면 빼" — 구 기록의 '하락 경고 뱃지·▼ 왼쪽 칸'은 전부 폐기, 정직 혼재는 3페이지 27위 행이 담당) **②검색량 = keywordstool 실측값**(2026-07-18 페이블 직접 조회, dashboard flask/.env 자격증명·PC+모바일 합): 연남동 미용실 3,410 / 홍대 미용실 18,630 / 합정 미용실 7,540. 문장형·저검색 키워드 폐기(연남동펌 = 실측 월 10회 — 사장님 "누가 이렇게 검색하냐" 적중). 서사 = 연남동 가게가 상권 키워드까지 추적(동네 1페이지 accent·큰 상권 3페이지 = 정직 혼재). 순위 숫자만 목업 예시(실순위는 실가게 필요). 재조회 스크립트 문법 = `ngn_dashboard/flask/tools/naver_searchad_test.py`) / S10 여백 휴식(py-32/모바일 py-24). 배경 리듬 = **다크(S1)→흰×2→회색(S4)→흰×2→회색(S9)→흰(S10)→다크(S11)**. 다크 네이티브 코드는 prop으로 보존·현재 미사용: `ContentS4 dark`(텍스트·DotStage #111113·십자·스텝 흰 필 반전, 목업 창은 흰 실화면 유지)·`ContentS5Visual dark`(타일·수렴선·소식 카드 #151517 표면)·SectionHead/Eyebrow `dark`. ⛔다크 밴드 재도입 시 = 내용물까지 다크 네이티브로(라이트 부속 통째 흰 상자 부착 금지 — "검은 벽 흰 포스터" 반려 실증). 임시 비교 페이지 `/lab/hierarchy` = 삭제됨(2026-07-19, `/lab/catalog`도 함께). |
  | `/ads` | **PC 11섹션 전 실물 완료(2026-07-19)** | 카피 정본 = `lib/content/ads.ts`(히어로 하드코딩 해소됨 — 'AI 시대의 온라인 광고'). 구성 = `AdsHero`(다크+매체 로고 궤도 10위성) → 1-4-1 답(AdsAnswerScene) → 탱글 → **애드캔버스 2그룹**(`CvGroup` Vercel 문법: 메타 3스텝 URL→사진+AI문구→인스타 실물 / 구글 2스텝 URL→**AI 키워드 칩**→SERP 키워드 볼드+포함 체크+**Ad Strength 4기준 채점표**(§4.5 원문) — 근거 = Easy Mode 실코드 URL→recommended_keywords 15~20·상위 5~6 헤드라인 강제 포함) → 챗봇(ChatMock 재사용) → 카탈로그 루프(매일 자동 갱신 = `dynamic_Ads_meta.py` 매일 17:00 실측) → 대시보드 → 월간 리포트(**2026-09-18 교정** — 시각 문구 삭제·6개 섹션. 구 '매월 1일 7:05·9장·8장 마퀴'는 지도와 어긋나 폐기) → 시장 2×2(랭킹/MATCH/검색량/**촬영 레퍼런스** — 구 "집행 중 소재"는 스펙에 없는 창작이라 2026-07-19 감사로 교체) → Stores(시트→분석, 칩 자동 순환+다크 인사이트 바) → 진화 반원(위성 4 파동 싱크) → 클로징(BackgroundBeams+필 버튼 2). 요금 섹션 폐지(→/pricing 별도). **2026-07-19 스펙 전수 감사(Opus 2건) 통과** — 창작 2건(시장④·/content S4 쇼츠) 교정, "매일 자동"·"URL→키워드"는 실코드로 근거 확정. 텍스트 다이어트 처방 1~3 적용(구글 2스텝 압축·리포트 액션 카드/2문장 서브 = 모바일 첫 문장만). ⚠모바일 전용 검수 미실시(다음 작업). |
  | `/start` | 운영 | 리드폼. `btn-gradient-dark` 제출 계승 완료. |
  | `/pricing` | **제품 탭 구조(2026-09-18 갱신 — 구 "4칸 한 줄"은 폐기)** | 개선안 §6·§7 반영. 구 구조(콘텐츠 9.9 / 광고 19.9 / 프리미엄 49 / 문의를 **한 줄 4칸**)는 사장님 지적으로 폐기 — "누구나 콘텐츠와 누구나 광고는 아예 다른 앱인데 4칸을 붙여 놓으니 한 앱의 4플랜처럼 보인다". 현행 = **제품 탭**(`PricingTabs`) 안에 콘텐츠 3단(99 / 149 **추천** / 299~ 상담) + 광고 단일(199). 탭을 고른 이유 = 광고 요금을 스크롤 없이 볼 수 있고 제품 경계가 위계로 드러난다(사장님 낙점). 선택 안 된 탭은 조건부 렌더가 아니라 `hidden`으로 감춘다(검색엔진·Ctrl+F 대비). 제품 머리 = NC/NA 로고를 크게(사장님 "밋밋하다"의 원인은 선 굵기가 아니라 눈이 걸릴 앵커의 부재 — 선은 §8.17대로 1px 유지). featured 카드는 인라인 `style`로 색을 못박는다(`globals.css`의 `a { color: inherit }`가 Tailwind `text-white`를 이겨 검은 배경+검은 글자가 됐던 실증, 대비 1.4:1 → 17.9:1). ⛔ **묶음 요금은 화면에 두지 않는다** — §7.4가 "묶음 도입은 미확정"이라 못 박았다(2026-09-18 되돌림. 값·되살릴 조건은 `lib/content/pricing.ts` 주석). 무료 체험 = 콘텐츠·플러스·광고 30일, **스튜디오는 상담 후 시작**(각주·FAQ 양쪽 일치 확인). |
  | `/features` `/about` | 구 라우트(폐지 예정) | 새 IA(§CONTENT §0)에 없음. Nav가 아직 여기를 가리킴. |
  | `/home2` `/content2` `/ads2` | **비교 시안(2026-09-18) — 낙점 전 임시** | 개선안 반영안을 원본과 나란히 보기 위한 페이지. Nav 미등록 · metadata `robots: noindex`. **원본 파일 무수정이 원칙**: 공용 부품에는 기본값이 꺼짐인 선택 인자만 더하고 시안 경로에서만 켠다.
    실측 목록(2026-09-19) — 메인: `TwoAppsRail video` → `S41SearchScene video` / `NcMobileMock video`(+`NcMobileMockVideo` 래퍼) · `S3GraphicA both` → `OrbitScene both`·`MobileOurWay both`·`MobileOrbit both`.
    콘텐츠: `ContentHero flow`(설명 교체 + 첫 화면 시작 링크) · `ContentS4 choice·shorts` → `InputCard batch`·`S4FormatRow shorts`·`S4FormatRowPC shorts` · `ContentS8Visual enrich` → `S8TopicSteps shoot`·`S8SearchBox cta` · `ContentS11Cta cta`.
    공통: `Footer`(경로 감지 — 인자가 아니라 `usePathname`).
    ⛔ 폐기된 인자 — `TwoAppsRail loop`·`S41SearchScene loop`·`MobileProductCarousel loopNote`·`S8SearchBox framed`.
    loop 계열은 §7-9(목업 아래 단독 한 줄 금지)에 걸려 걷어냈고, 그 내용은 `TwoAppsRail`의 NC `desc` 문장에 흡수했다. `/ads2`만 성격이 다르다 = 구간 **순서**만 재배치한 조립본(내용 무변경). 낙점 후 원본에 반영하고 이 세 폴더와 `scripts/ui-shots.mjs`의 등록 줄을 함께 지운다. ⛔ 한 문장 때문에 컴포넌트를 통째로 복제하지 않는다(개선안 작업요청서 §0.5). |
  | `/lab` | 실험장 | 임시. 삭제 예정. |
  | `/styles` | **작업 도구 — 지우지 말 것(사장님 지시)** | 목업 스타일 갤러리(S1~S11). §8.7 프로세스의 검수 무대. 재사용·타 프로젝트 참고용. |
- ~~**Nav 미갱신**~~ → ✅ **이미 새 IA다**(2026-09-19 실측). `Nav.tsx` = `/content`·`/ads`·`/pricing` + `/start` 버튼. `/features`·`/about`을 가리킨다는 서술은 낡은 것이었다.
- **⛔ 알려진 코드 오염 (잔여분 — 완주 모드에서 순차 해소 중)**:
  | 위치 | 문제 | 상태 |
  |---|---|---|
  | ~~`app/ads/page.tsx`(히어로)~~ | ~~하드코딩~~ | ✅ 해소(2026-07-19 실측 — ads.ts import 사용 중) |
  | ~~`ChatbotShowcase.ChatMock`(→/ads·/features)~~ | ~~"메타 예산 20% 올려줘 → ₩500,000→₩600,000 → 위저드에서 확인" = **닫힌 기능을 판매**~~ | ✅ 해소(2026-09-18, 사장님 낙점 "2번"). 근거 = `ngn_dashboard/.ngn-map/stage-7-chatbot.json` #541(2026-09-02 서버 차단 410)·#516. 교체 = 숫자 조회·용어 설명·화면 안내(딥링크) 3문답. 틀·색·그림자·타이핑 원작 유지. 같은 커밋에서 `ads.ts chatbot.control`·/features 좌측 카피·태그('광고 말로 제어'·'AI 진단'·'자유 질문')·"안전 게이트"도 교정 |
  | ~~`AdsSections.tsx`(월간 리포트 목업)~~ | ~~"매월 1일 오전 7시 5분 업데이트"(지도 = 1일 06:00 집계·06:20 스냅샷·**16:00 완성**) + "아래 여덟 개 섹션"(지도 = **6개**) + `ads.ts report.items` 9개~~ | ✅ 해소(2026-09-18). 시각 문구 삭제(근거 없는 숫자를 다른 숫자로 바꾸지 않고 **뺐다**) · 섹션 수 6으로 통일(`RPT_CHIPS`·각주·void 처리된 `RPT_TOC`까지) · `RPT_MINI` 8→5 통합 · `report.items` 9→6. 근거 = `ngn_dashboard/.ngn-map/stage-6-report.json` #460~465 |
  | `app/content/page.tsx` | `lib/content/content.ts` 미사용·카피 하드코딩(§7-6 위반) + **"월간 노출 리포트" 문구**(정본 없음=대시보드 기능, 제거 확정) + 업종 안 맞는 예시 스크린샷(콜드 리드 지적) | 대기 |
  | `lib/content/home.ts` 폐기 잔재 / `Nav.tsx` 구 IA 링크 | §1 상단 참조 | 대기 |
  - ✅ **해소됨(2026-07-11)**: "소상공인" 5건(pricing.ts·pricing/page.tsx → '라이트'로) / NewsReflectMock "상위 노출 유지"→"꾸준히 노출 중" / SearchResultMock "최상단"(주석뿐이었음, 교체) / **Gemini→Claude 5건**(DashboardShowcase·TrendShowcase·ReportDark·home.ts·features.ts — 정본 위반 해소, /ads 실렌더 확인).
- **`lib/content/home.ts`** (실측 2026-07-14 갱신):
  - **살아있음**: `hero`(→`HeroB`) · `homeV2`(why·ourWay·twoAppsHead·brandPhilosophy·asset·update+pairs — 홈 8섹션 카피 정본) · `cta`(→`S8CtaDark`) · `promise.log`(→S7 pairs 재료).
  - **폐기된 구 리빌드 잔재 — 사용 금지**: `painPoints`·`evidence`·`features`·`comparison`·`solution`·`reviews`·`faqItems`·구 가격표. "Gemini"(→Claude로 통일)·"예정"(완성 전제 위반)·가공 후기(지어내기 금지)·구 가격을 포함. 이들을 import하는 컴포넌트(`PainPoints`·`EvidenceGrid`·`FAQ`·`Comparison`·`ROIComparison`·`SolutionSection`·`AdCanvasMagic`·`ReportDark`)는 현재 어느 라우트에도 안 붙어 있다.
  - `branch`(→`ProductBranch`)는 §8.0 S3용으로 **준비돼 있으나 홈에 미연결**.
- **컴포넌트 사용 현황** (⚠ 2026-07-10 실측 교정 — 이전 07-07 목록이 틀렸음. `fe318cf` "홈 실목업 재활용" 커밋 이후 상태):
  - 🔴 **이 목록은 2026-09-19 실측으로 틀린 것이 확인됐다.** 아래 구 목록이 "홈에서 실사용 중"이라 한 11개 중
    **홈(`app/page.tsx`)이 실제로 import 하는 것은 0개**다. `fe318cf` 시점에는 맞았으나 그 뒤 홈이 재구성됐다.
    - **지금 홈이 쓰는 것**(실측): `HeroB` · `TwoAppsRail`(→`S41SearchScene`·`S42AdScene`·`MobileProductCarousel`·`MobileStepMocks`) ·
      `BrandPhilosophySection` · `S6AssetStacks` · `S3GraphicA`(→`MobileOurWay`·`MobileOrbit`) · `S7UpdatePairs` · `S8CtaDark`
      \+ 레이아웃(`OuterContainer`·`Section`·`OccupancyGrid`).
    - ~~구 목록(홈 실사용이라 잘못 적혀 있던 것)~~: `HeroAurora`·`BeamCanvas` · `ShowcaseHeader`/`ShowcaseRow` · `DashboardGlimpse` ·
      `ManageGlimpse` · `ReportGlimpse` · `SearchResultMock`/`RankTrackMock` · `StoryStep` · `CTA`.
      이 중 일부는 `/features`·`/about`·`/lab`에서만 쓰이고, `ShowcaseHeader`·`ManageGlimpse`·`ReportGlimpse`·`RankTrackMock`은 **어디서도 안 쓰인다**.
      ⚠ 지우기 전에 반드시 사용처를 다시 grep 할 것 — 이 표 자체가 틀렸던 전례가 이것이다.
  - **미사용 = 디자인 자산 창고**(코드 살아있음 → 리빌드 재활용 후보): `HeroMinimal` · `Comparison`/`ComparisonNew` · `ROIComparison` · `EvidenceGrid` · **`EvidenceInsight`**(§8.0 S4가 쓸 자산) · `EvidenceSpeed` · `EvidenceTrend` · `PainPoints` · `SolutionSection` · `Reviews` · `FAQ` · `AdCanvasMagic` · `AdFlowGlimpse` · `DashboardPreview` · `DataPipeline` · `ReportDark` · `StepDone` · `TrendGlimpse` · `FeatureSection` · `ProductBranch`(§8.0 S3용, 미연결).
  - features/ 미사용: `BudgetSimulator`, `MobileDashboardMockup`. ui/ 미사용: `bento-grid`. (`AdCanvasShowcase`는 자체 로컬 BrowserFrame을 별도 정의 — `ui/BrowserFrame`과 다른 것)
- 정리 후보: `globals.css`에 shadcn 토큰 계열이 섞여 있음 — **`@import "shadcn/tailwind.css"` + `@theme inline` 블록 + 그 아래 shadcn용 `:root`/`.dark` 블록 + `@layer base`** 네 곳. 실제 페이지는 `@theme` 커스텀 토큰만 사용 → 리빌드 때 제거 검토.
  - ⚠ **줄번호로 지우지 말 것**(파일이 바뀌면 좌표가 밀린다 — 실제로 2026-07-10 `--font-quote` 추가로 +7행 시프트됨). 특히 `:root`가 **두 개**다: 위쪽 `:root`(`--font-quote`, **남길 것**) / 아래쪽 `:root`(shadcn `--background` 등, 제거 대상). 블록 내용을 보고 지운다.

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
- **폰트**: `font-kr`(Pretendard) / `font-en`(Inter Tight) / `--font-quote`(Nanum Myeongjo 명조 — **목업 안에서 "실제 발행된 글"을 인용할 때만**. 본문 UI 사용 금지).
  - ⚠ `--font-quote`는 `@theme`이 아니라 `:root`에 선언한다. Tailwind v4는 `@theme` 안의 **참조되지 않는 변수를 빌드에서 제거**하는데, 인라인 `style`의 `var()`는 스캔 대상이 아니라 변수가 통째로 사라진다(2026-07-10 실측 확인).
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
1. `border-radius` 추가 금지(예외 전체: `.rounded-dot`·`.rounded-card`(28px 모바일 캐러셀 §8.18-B)·`.rounded-pill`(버튼)·`.iphone-*`·`.feat-sim-slider` thumb). ⚠ 07-16 선언바·채팅 직각 전환으로 `.rounded-bar`는 삭제됨.
2. hex 하드코딩 금지 → Tailwind 토큰 클래스.
3. `style={{ color/background }}` 인라인 금지(그라디언트 등 불가피한 경우만).
4. 1200px 초과 폭 금지.
5. clamp() 없는 헤딩 금지.
6. 콘텐츠 직접 작성 금지 → `lib/content/*.ts`에 분리.
7. ★★ **파스텔톤·옅은 틴트 "면" 금지 = 전형적인 AI 냄새**(사장님 반복 지시). 연보라·연분홍·민트 등 파스텔 배경 블록, 보라 그라디언트, 옅은 색면으로 칠해 강조하기(면칠) 전부 금지. **강조는 1px 보더 · accent 텍스트 · accent 점 · 굵기 대비로만.** 제네릭 AI 폰트(Inter·Roboto 계열을 브랜드 폰트로) 금지.
   - 예외 1: `accent-bg`(#0070f3 8% 틴트)는 **선택/활성 상태 표시**로만 소량 허용(장식용 색면 금지).
   - 예외 2: §8.6-G "베스트배지 보라 그라디언트"는 **원본 보존 자산**이므로 그 컴포넌트 안에서만 유지(신규 디자인에 확산 금지).
8. ★ **저대비 회색 텍스트 금지 — 다크·라이트 공통**(사장님 2026-07-19 — "안 보여, 일괄 조정하고 앞으로도 없어야 해". 실증 = 1-4-1 모듈 라벨 white/50 반려 + 목업 미니 라벨 #999 반려 "완성 미리보기 안 보여").
   - 다크 배경: 의미 텍스트 최소 `text-white/70`, 미니 캡션도 `white/50` 미만 금지.
   - 라이트 배경: 의미 텍스트·라벨은 **#666(text-weak) 이상**. `#999(text-muted)`는 장식적 수치 꼬리표(바이트 카운터 등)에만 — 읽어야 하는 라벨("완성 문구"·"HEADLINE" 등)에 금지.
   - 흐림으로 위계를 만들려면 투명도·연회색 대신 **크기·굵기 대비**를 먼저 쓴다.
9. ★ **목업 아래 단독 한 줄(캡션·메타·칩) 금지**(사장님 2026-07-19 반복 지적 — "주석처럼 넣지 마, 몇 번 얘기해". 리포트 메타 줄·Stores 확장성 칩 2회 반려 실증). 목업이 말할 내용은 **목업 안에**(헤더 라벨·화면 내 요소), 소구 문구는 **섹션 카피(서브)에 흡수**. 정 필요한 정보만 목업 내부 요소로 디자인한다 — 목업 바깥 아래에 띄우는 순간 주석이다.

## 8. 리빌드 방향 (2026-07-07 확정 — 어필 기획 3단계 완결)
> 상세 결정·근거·전 섹션 매핑의 **작업 정본 = `docs/랜딩-아이디어로그.md`**(결정 로그). 여기엔 디자인 소관(페이지 구성·컴포넌트 매핑·와이어프레임)만 요약한다. 메시지 뼈대는 [CONTENT.md](CONTENT.md).

### 8.0 ★★ 2026-07-10 홈(/) 방향 전환 (사장님 확정 — 최우선. 아래 §8 '홈 5블록'·§8.6-D 판정 대체)
> **사장님 지시(2026-07-10)**: 원본 홈에서 **차용은 "디자인 언어"만**(§8.6 A~I = 차용 대상, 그대로 유효). 원본의 **섹션 구성·카피·FAQ·후기 등 내용·구성은 지금과 안 맞아 폐기**(FAQ는 홈에서 제외 확정). 홈 **구성·내용·메시지는 새로·심플 OK**, 단 **디자인 완성도는 최소 원본 이상**(단순화하다 '문장 랜딩'으로 평범해지는 것이 반복 실패점 — 그 밑 금지). → 아래 §8 "홈 5블록"과 **§8.6-D "섹션별 판정(글자만 교체)" 방향은 본 결정으로 대체·폐기**한다(§8.6 A~I 디자인 보존 규칙은 폐기 아님).

> ⛔ **아래 "홈 7섹션(2026-07-10)" 표는 폐기(2026-07-14)** — V2 최종원고(2026-07-13) + 섹션별 개념그래픽·Vercel 재조립 작업(2026-07-14)으로 대체됨. 현행 정본 = 바로 아래 "홈 8섹션(현행)" 표.

**★홈 = 8섹션 (현행 확정, 2026-07-14 — `app/page.tsx` 실측. 전 섹션 사장님 컨펌 완료)**:

| # | 섹션(명암) | 헤드 카피(확정) | 실물 컴포넌트 |
|---|---|---|---|
| S1 | 히어로(다크) | "누구나 마케팅하는 시대" | `styles/bricks/HeroB`(벽돌1, BeamCanvas 진화) |
| S2 | WHY(라이트) | "어려운 건 마케팅이 아닙니다/복잡한 시작입니다" | `home/s2/S2Concept1`(얽힌 연결망 개념 그래픽) |
| S4 | 두 개의 앱(라이트) | "필요한 마케팅에 맞게/두 가지 앱을 만들었습니다" | `TwoAppsHeader`+`bricks/PhoneScene`(S41 검색 3단)+`bricks/AdScene`(S42 광고 3단) — 3단 장면 PC·모바일 공용(구 PC 실사 스샷 폐기 2026-07-14) |
| S3 | 우리의 방식(라이트) | "어려운 건 앱이 합니다"+"확인은 사장님이 합니다"(리드 분리) | `home/s3/S3GraphicA` — **Clone05 재조립: 궤도 자동 처리 루프(중앙 앱 원→칩 6개 빔·체크, 오픈 배경) + 말풍선 문답(다크 sent/흰 received), PC 지그재그 2열. ★순서 = S4 광고 장면 아래(사장님 2026-07-14)** |
| S5 | 회사 철학(다크) | "좋은 가게는 발견될 기회가 있어야 합니다" | `home/BrandPhilosophySection` |
| S6 | 자산(라이트) | "쌓이는 것은 고객님의 자산입니다" | `home/s6/S6AssetStacks`(블로그 창 컬렉션 + 광고 리포트, 결론 = Clone05 십자·다크 바 배너) |
| S7 | 업데이트(라이트 — 2026-07-15 다크 3연속 해소 전환) | "필요한 기능은/계속 더해집니다" | `home/s7/S7UpdatePairs`(미니멀 업데이트 로그 + "추가 비용이 없습니다") |
| S8 | CTA(다크 패널) | "카드 등록 없이/한 달 무료로 시작하세요"(2026-07-15 카피 확정) | `home/s8/S8CtaDark`(좌 헤딩 6/10 / 우 "한 달 무료로 시작하기"+"요금 안내" 세로 스택+각주 4/10, 디바이더 = 바둑판 line 8 정합) |

- 폐기 시안(원작 보존, 미장착): OurWayFlow·OurWaySection·S2Concept2~4·S3Concept1~4·S3GraphicB/C·AssetSection·UpdateSection·CTA(구). 검수 무대 = `/lab/s2·s3·s41·s42·s6·s7·s8`(+`/lab/vercel` 소스 갤러리). 표 행 순서 = 실제 페이지 순서(S4가 S3보다 위).
- 제작 규율 = **§8.15 목업 파이프라인**(소스 리서치→구성안 컨펌→메인 직접 구현→렌더 검증) + §8.14 노하우 10 + §8.9 구두점·장식 금지 4종.

<details>
<summary>(폐기 이력) 2026-07-10 홈 7섹션 표</summary>

| # | 섹션(명암) | 메시지 방향 | 차용 원본 디자인 자산 |
|---|---|---|---|
| S1 | 히어로(다크) | "어려운 광고, 이제 **이해**하며 직접" | `HeroAurora` + `BeamCanvas` 회로빔 그대로(홈 전용 빔) |
| S2 | 전환(라이트) | "이제는 이해하고 직접 운영하는 시대"(고통자극 금지) | `SolutionSection` accent 선언형 헤딩·crossMarks |
| S3 | **두 제품 분기(라이트·홈의 심장)** | 노출(콘텐츠)/광고 2카드 → /content·/ads | `bento-grid` 2열 + `FeatureSection` + 미니목업(`DashboardGlimpse`/`ManageGlimpse`) |
| S4 | 광고 미리보기(다크) | 광고·매출·유입을 한 화면에서 **이해** | `EvidenceInsight` 통합 대시보드 목업(3데이터셋 순환) |
| S5 | 콘텐츠 미리보기(라이트) | "검색에 내 스토어가 보이게"(노출 킬러) | 대안 A = 신규 콘텐츠 목업 1개 |
| S6 | 회사 약속(다크) | "앱은 생물, 요금은 동결" | `StoryStep`/`StepDone` 큰 EN 숫자·타임스탬프 톤 |
| S7 | CTA(다크) | 한 달 무료·카드 없이 → /start | `CTA` 그대로 |

</details>

- **버린 원본 섹션**: PainPoints·EvidenceSpeed·EvidenceTrend·ROIComparison·Reviews·FAQ. **다크 리듬(현행)** = S1·S5·S7·S8 다크.
- **평범화 방지 구속**: 섹션별 "**카피 문자열만 허용 / JSX 구조·애니메이션·목업 데이터·컴포넌트 삭제·텍스트카드 대체 금지**". **§8.6 A~I 전면 적용**. 완료 판정 = `:3131` 원본과 나란히 실렌더 비교(그리드·빔·목업·모션 생존) + 페이블 적대 검수. "빌드 통과"로 갈음 금지.
- **다음**: 7섹션 확정 카피 초안=페이블(§0.5 규칙 통과·현재형) → 사장님 카피 승인 게이트 → Opus 구현(원본 컴포넌트 재사용 조립).
- **타깃/구성**: 통합 1사이트 2갈래 — **누구나 컨텐츠**(/content, 노출, 타깃=가게 사장님) + **NGN 대시보드**(/ads, 광고, 타깃=규모 있는 셀러·브랜드) + **홈**(/, 얕은 분기 안내소) + **/start**(무료 시작 폼). 북극성 = 30초 안에 "직접 해도 되겠고 한 달 공짜니 밑질 것 없다".
- **어필 기획(무엇을 말할까) 확정** — 세 페이지 어필맵(아이디어로그 결정 로그):
  - 대시보드 11섹션: "대행사 대체" 논리, AI 챗봇 최대 비중, 월간리포트·애드캔버스·모바일.
  - 누구나 콘텐츠 11섹션: 정공법 포지셔닝, **노출소식 자동반영 킬러(최대 비중)**, 네이버+구글 플레이스.
  - 홈 5블록: H1 "맡기려던 일" 분기 카드 · H2 공통구조(왜 직접이 가능한가) · H4 "앱=생물·요금동결"(정본 자리) · H5 위험제로 스택.
- **와이어프레임 3종 완료 + 페이블 검증(2026-07-07)**: 홈 5블록 · /content 11섹션 · /ads 11섹션. 상세 매핑·검증 수정사항 = 아이디어로그 "와이어프레임 v1" 블록 3개(구현 명세).
  - **신규 제작 = 지도 목업 1개뿐**(사이트 전체 누적. 나머지 전부 §8.5 재활용·개조).
  - **히어로 3종 구분**: 홈=`HeroAurora`(BeamCanvas 빔=홈 전용) / content=`HeroMinimal` 라이트 / ads=다크 셸+`DashboardPreview`(빔 제거). 동일 토큰·clamp.
  - **다크 배분**: /ads 3덩어리(S1 / S4 / S10+S11 클로징 시퀀스), S5·S7 라이트. 홈 2/5.
  - **재활용 개조 3건**: S4 챗봇=`ReportDark` 셸+`TypeWriterLine`+대화버블(풀폭 재조립) · S5=`DashboardShowcase` Section02 추출(라이트) · S2=`BudgetSimulator` 로직 교체(수수료 비례↑ vs 요금 수평).
  - 제작=Opus · 검증=페이블.
- **살릴 톤**: 기존 버셀 스타일 차용(§2~§7 유지) — 한 섹션 한 메시지·절제·위계·**제품 목업 중심**(스톡 이미지 금지).
- **콘텐츠 구조(lib/content)**: 섹션별 **최종 카피는 전용 단계**(와이어프레임으로 구조 확정 후). 어감 다듬기는 별도 AI/사장님 몫 — 지금 어필맵 문장은 "방향 라벨"(최종 카피 아님).
- ⛔ **완성/미완 판정 금지·전 기능 완성 전제 현재형**(memory: feedback_homepage_assume_complete).

## 8.5 재사용 자산 인벤토리 (컴포넌트 50개 전수, 2026-07-07 요약)
> 설계 시 **여기서 매핑 우선 = 창작 최소**. "범용"은 콘텐츠만 갈아끼움, "목업"은 제품화면 목업(스톡 이미지 대신 = CEO 원칙), "하드코딩"은 카피·목업 교체해 재활용.

**범용(props로 바로 재사용)** — `Section`(래퍼: alt/dark/crossMarks/noBorder) · `SectionHeader` · `FAQ`(좌제목+우아코디언) · `Accordion` · `Badge` · `Button`(CVA variant) · `BrowserFrame`(데스크톱 프레임) · `bento-grid`(3열 카드) · `CrossMark` · `GridDivider` · `FeatureSection`(좌텍스트+우 BrowserFrame, props) · `StoryStep`(props 배경 다크/라이트/회색) · `BudgetSimulator`(예산 슬라이더+실시간 막대, 계산 조정가능).

**제품 목업 자산(콘텐츠 교체해 재활용)** — 대시보드/광고/리포트 실화면 목업:
- 대시보드: `DashboardGlimpse`(6 KPI) · `DashboardPreview`(다크→퍼스펙티브 카드) · `ManageGlimpse`(캠페인 온/오프+ROAS 카운트업) · `MobileDashboardMockup`(360px 모바일)
- 광고생성: `AdCanvasMagic`(URL입력 목업) · `AdFlowGlimpse`(3단계 플로우) · `EvidenceInsight`(⚠**통합 대시보드 목업** — KPI 4종+광고 ROAS 행+채널별 매출 막대, 3데이터셋 순환. 기존 "상품→인스타/틱톡" 설명은 코드 불일치라 교정 2026-07-07)
- 트렌드: `EvidenceSpeed`(29CM 랭킹 3.5초 순환) · `EvidenceGrid`(대시보드+3탭 순환) · `EvidenceTrend`/`TrendGlimpse`(랭킹 정적, 자사 강조)
- 리포트: `ReportDark`(다크+타이핑) · `ReportGlimpse`(월간 리포트 타이핑)
- 비교/증거: `Comparison`·`ComparisonNew`(운영방식 비교표) · `ROIComparison`(가격대별 스크롤 진행) · `Reviews`(3열 후기) · `PainPoints`(문제 일러스트) · `DataPipeline`(데이터 흐름 SVG)

**히어로/모션/데코** — `HeroAurora`(다크 그리드+코너 십자+`BeamCanvas` 회로빔) · `HeroMinimal`(텍스트+일정 springPop) · `CTA`(다크+버튼2) · `StepDone`(다크 큰 타임스탬프).

**features/** — `AdCanvasShowcase`(4스텝 토글) · `DashboardShowcase`(4탭) · `TrendShowcase`(급상승/신규/하락 3탭+이미지).

**layout/** — `Nav`(로고+3링크, 스크롤 배경변화) · `Footer`(3열 회사정보) · `PromoBanner`(첫달무료 상단배너) · `Section`.

> ⚠ 대부분 콘텐츠가 하드코딩(광고·대시보드·리포트) → **리빌드 시 카피·목업만 교체**. 범용(props)만 그대로. 상세 렌더/모션/범용성 원본 요약은 이 세션 산출(필요 시 재생성).

## 8.6 원래 홈 디자인 해부 — 재건 보존 규칙 (설계도, 2026-07-08 · 사장님 지시 "하나도 빼지 마라")

> **원칙**: 원래 홈(갈아엎기 전, `git b1d9b0f~1`)의 디자인 요소를 **하나도 임의 제거하지 않는다.** 새 카피·포지셔닝을 입히되, 아래 점·선·면·그리드·타이포·줄바꿈·모션 규칙은 **원래대로 보존·재활용**한다. "추억은 아름다워야 한다"(사장님). 근원 코드 = `globals.css` + `Section` + `HeroAurora` + `SectionHeader` + 목업 컴포넌트.
> ⚠ **이번 리빌드(신 lib/content 카피)가 평범해진 근본 원인**: 아래 B(줄바꿈·`.comma`·accent 스팬)·목업(제품 화면)을 통째로 뺐기 때문. 재건 = 이 규칙 복원.

### A. 점·선·면·그리드 (전부 의도 설계 — 임의 제거 금지)
- **직각 전역**(`* { border-radius:0 !important }`). 예외 4개만: `.rounded-dot`(점 50%)·`.rounded-pill`(히어로 CTA 999px)·`.iphone-*`·slider thumb.
- **선·면(Section)**: 섹션 경계 = `border-b border-border-default`(1px #eaeaea). `alt`=#fafafa 면 / `dark`=#0a0a0a 면. `crossMarks`=상단 좌·우 `CrossMark`(교차 +표식). 이 1px 격자가 페이지 골격 — 없애면 밋밋해짐.
- **HeroAurora 그리드(정수)**: 데스크 **12열×8행** / 모바일 **6열×10행**, 셀마다 우측 `1px rgba(255,255,255,0.12)` + 하단 `0.5px` 선. **콘텐츠 영역(데스크 2-5행·2-9열)만 선을 비워** 글이 격자 구멍에 앉음. + 4모서리 `.grid-crosshair`(0.5px 흰 십자, opacity .35) + `.hero-bracket`(코너 20px 브래킷) + `.aurora-noise`/필름노이즈(fractalNoise opacity .035) + `BeamCanvas` 회로빔 + `radial-gradient(#0d1525→#000)`.
- **다크 섹션 패턴**: `.dark-grid-pattern`(32px 격자)·`.dark-dot-pattern`(20px 도트). 다크 공식 = `linear-gradient(180deg,#0a0a0a,#151515)` + white/white80.
- **모션 자산(globals.css — 전부 보존)**: 오로라 float, 회로빔(데스크 3200/14s·모바일 2400/12s), 폰 오토스크롤 18s, 마퀴 30s, 글래스 글레어, shimmer, badge pulse, pipeline flow, skeleton, float.

### B. 타이포 & 줄바꿈 (홈페이지용 — 재건 최우선 복원 대상)
- **`word-break: keep-all`(전역)** — 한글 단어 단위로만 줄바꿈(어절 중간 안 끊김).
- **헤딩 = `dangerouslySetInnerHTML`로 렌더** → 카피 문자열 안에 직접:
  - **수동 `<br>`로 두 줄 너비를 비슷하게 균형** 맞춘다(예 원래: `광고, 누구나 쉽게.<br>가격은 가볍게.` / `URL 하나로<br>Instagram·Google 광고까지`). ⛔한 줄이 길고 한 줄이 짧은 어색한 auto-wrap 금지.
  - **`.comma`** = 콤마를 세리프체(Georgia .75em, translateY .05em)로. 헤딩의 쉼표는 이걸로.
  - **`<span class="text-accent">…</span>`** = 강조 단어만 블루(#0070f3).
- **leading(줄 간격) 촘촘**: 히어로 h1 `leading-[1.12]` / 섹션 h2 `leading-[1.15]` / 본문 `leading-[1.6~1.65]`. tracking 헤딩 `-0.02~-0.04em`.
- **clamp 스케일(고정px 헤딩 금지)**: 히어로 `clamp(26px,5vw,56px)`(features/pricing 72px) · 섹션 `clamp(28px,4vw,40px)` · 본문 15~18px · eyebrow `13px 600 tracking-[0.1em] uppercase` + Inter Tight.
- **숫자·영문 = `var(--font-en)`(Inter Tight)**, 쉼표 `.comma`. 한글 = Pretendard.
- ⚠ **현 신 카피(content/ads/home.ts)엔 `<br>`·`.comma`·accent 스팬 0** → 재건 시 헤딩마다 **균형 `<br>`+`.comma`+accent** 삽입하고 `dangerouslySetInnerHTML` 렌더로 전환.

### C. 여백·간격
- `OuterContainer` max-w **1200px** → `Section`. 텍스트 폭 `max-w-[520~720px] mx-auto`. 섹션 패딩 데스크 `px-12 py-16~20` / 모바일 `px-6 py-12~14`. SectionHeader `mb-12`.

### D. 원래 섹션 인벤토리 (홈 10블록 — 재활용 대상, 하나도 안 뺌)
> 각 블록 = 보존/재활용. 새 IA(2갈래)로 재배치하되 **디자인 요소·목업 밀도는 원래대로**.
1. **HeroAurora** — 그리드+크로스헤어+브래킷+노이즈+회로빔 다크 히어로 (홈 전용, 빔).
2. **PainPoints** — 3문제 셀 + 각 미니 목업(파이프라인 다이어그램·대시보드·광고생성).
3. **SolutionSection** — accent 강조 선언.
4. **EvidenceInsight** — 다크 + **통합 대시보드 목업**(KPI·ROAS·채널 매출 막대, 3데이터셋 순환).
5. **EvidenceSpeed** — 다크 + **광고생성 제품 목업**(상품 이미지 + 실제 폼 필드).
6. **EvidenceTrend** — 다크 + **트렌드 랭킹표 + 이미지 벤치마크 그리드(실상품 사진) + 검색량 차트**.
7. **ROIComparison** — 큰 `0%` 타이포 + 광고비 구간별 대행 vs NGN 비교표(스크롤 진행).
8. **Reviews** — 3열 후기 카드.
9. **FAQ** — 좌 제목 + 우 아코디언.
10. **CTA** — 다크 마감 버튼2.
> 그 외 쇼케이스(`AdCanvasShowcase` 4스텝 토글·`DashboardShowcase` 4탭·`TrendShowcase` 3탭)·`DataPipeline`(SVG 점 흐름)·`DashboardGlimpse`(6KPI)·`MobileDashboardMockup`·`BrowserFrame`·`bento-grid` = §8.5 자산. **재건은 이들을 재활용**(카피·목업 데이터만 교체).

### E. 재건 매핑 원칙 (원래 컴포넌트 → 새 페이지, 밀도 유지)
- **/ads(대시보드 제품)** = 원래 목업이 광고/대시보드용이라 **거의 직접 재활용**: 히어로=`HeroAurora`류 다크(빔) · 통합=`EvidenceInsight`/`DashboardShowcase` · 리포트=`ReportDark`/`DashboardShowcase §2` · 트렌드=`EvidenceTrend`/`TrendShowcase` · 광고생성=`EvidenceSpeed`/`AdCanvasShowcase` · 챗봇=`ReportDark`셸+대화. 카피만 새 포지셔닝(‘이해’).
- **/content(검색·콘텐츠 제품)** = 광고 목업이 안 맞음 → **같은 밀도의 콘텐츠용 목업 신규**(검색결과·블로그 에디터·플레이스 지도·순위추적 대시보드 화면). BrowserFrame 셸·점선면·줄바꿈 규칙 동일 적용.
- **홈** = `HeroAurora`(빔) 재활용 + 미리보기 목업 리치.
- 전 페이지: 위 A(점선면)·B(줄바꿈·comma·accent)·C(간격) 규칙 **무조건 적용**. 목업은 텍스트 카드 금지 = **실제 제품 화면 재현**.

### F. 페이지별 원래 디자인 인벤토리 (홈 외 — 하나도 안 뺌, 2026-07-08 코드 전수)
- **/features** (`app/features/page.tsx`): `Features`(EN 72px, crossMarks) 히어로 + 3 쇼케이스(AdCanvas·Dashboard·Trend) + 다크 CTA(버튼2). **시그니처=FeatureRow**(`AdCanvasShowcase`): 좌 `BrowserFrame`(3점+url+그림자 `0 2px 40px`)에 **애니 제품 목업** / 우 [번호칩 `32×32 #171717 흰숫자` + `flex-1 h-px` 디바이더 + h3 `clamp(22,3vw,30) 700 -0.02em 1.25` + desc 15/1.7 + sub 14/#999] · alt 교차 · `springPop`+`staggerContainer`, 진입후 450ms 트리거.
- **/about** (`app/about/page.tsx`): crossMarks 히어로(eyebrow "About NGN" + h1 수동 `<br>` "대행사 없이도,<br>…") · **통계 4카드**(`border p-8` + **`CounterUp`** 대형 EN 숫자 + 라벨) · Vision 3항목 · 회사정보(사업자번호 376-05-02792 ⚠footer 544-02-02671과 불일치, 확인 필요) · 다크 CTA "선착순 10개 업체 한정".
- **/pricing(원래, HEAD)**: `Pricing`(EN) 히어로 + 3플랜(`border-r` 분할·상단 흡착 badge·`48px` 가격 EN·VAT·체크리스트·note) + **비교표**(bg-alt 헤더·`✓`=accent·hover) + **dashed border 콜아웃** + FAQ `Accordion` + 다크 CTA. (→E3-4에서 신 `PricingCards`로 교체했으나 **분할선·흡착 badge·체크·다크CTA 디테일은 계승**.)
- **/start(원래, HEAD)**: crossMarks 히어로 + 폼(라벨 13/500 + input `h-11 px-4 border focus:border-accent` · **select 드롭다운**[쇼핑몰 플랫폼·월 광고비 예산] · textarea) + **`btn-gradient-dark` 제출**(그라디언트) + 에러 `red-500` + 성공 상태. ⚠신 /start는 이걸 flat 검정으로 바꿔 디테일 손실 → gradient·select 계승.

### G. 쇼케이스 리치 패턴 (★★/ads 재건의 금광 — 거의 그대로 재스킨) — 코드: `components/features/*Showcase.tsx`
- **쇼케이스 다크 히어로**: `grid-cols-[7fr_5fr]` + 라디얼 그라디언트(대시보드=네이비 `#0a2050`, 트렌드=그린 `#0d2a18`) + 대형 EN 워드(`clamp(44,6vw,72) 800`) + **데모 pill**(흰 `rounded-pill`, 텍스트 + `rounded-dot 36px #171717` 화살표) + eyebrow + h2 `<br>` + 흰 태그칩. 세로 구분 `[box-shadow:1px_0_0_rgba(255,255,255,0.12)]`.
- **AdCanvas 4스텝(BrowserFrame 내부 애니)**: ①URL 타이핑+커서 → AI 스피너(SVG spin) → done(4:5 이미지·`AI Copywriting`·`Targeting` 태그 x-슬라이드·`광고 게시하기`) ②Meta 카탈로그 제품카드 + 배지(NEW/TOP/AUTO 컬러·`badgePulse`) + 동기화 스피너 ③Google `Sponsored` + `skeletonPulse`→reveal + **Ad Strength 게이지**(4막대 scaleX 채움) ④캠페인 행(초록/회색 pulse 점) + ROAS **CountUp** + **토글 스위치**(rounded-pill 슬라이드) + 통계카드 CountUp.
- **Dashboard 쇼케이스**: ①**애니 SVG 데이터 파이프라인**(5소스[Cafe24/Meta/Google/GA4/Market 컬러점]→NGN 도트박스→대시보드 목업[매출 막대·방문자 폴리라인·₩·ROAS 785%], elbow 경로 + `animateMotion` 흐르는 점, 데스크/모바일 2벌) ②**매거진 AI 리포트**(타이틀 패널 `#f0f0f0 minHeight96`·**`AIAnalysis` 카드**[`border-left:2px #0070f3`]·KPI행 delta·퍼널바·비교표[`#1e3a5f` 헤더]·시나리오 카드[보수/도전 accent], 다크 그라디언트 패널 `#0a1e3d→#0a0a0a`) ③**iPhone 목업**(`iphone-frame`·dynamic island·볼륨/전원 버튼·`animate-glass-glare`·`animate-phone-scroll` 요요·풀 앱화면[KPI·막대·상품랭킹·광고 이미지카드·GA4·AI Insight]).
- **Trend 쇼케이스**: ①**Briefing 테이블**(카테고리 탭 9개 + 필터 탭[급상승/신규/하락] + 썸네일·`▲▼순위변화`·이번주/지난주·`AnimatePresence`·더보기) ②**AI Insight**(다크 헤더 + `MY BRAND` 카드 + `KEYWORD`[Material🌍/Mood✨ 이모지] + `TRENDS` 탭 + 상품카드[랭킹배지 `#1e3a5f`·🔥변화배지·₩가격]) ③**Compare**(브랜드 탭 + 5열 상품 그리드[랭킹번호 text-shadow·베스트배지 보라 그라디언트·하트 likes·바로가기/리뷰 버튼]) ④**Search Volume**(다크 패널 + **애니 SVG 라인차트**[내 브랜드 vs 경쟁 `dashed`·`pathLength` draw·그라디언트 area] + GSC 테이블[검색어/노출/CTR/순위/클릭·행 x-슬라이드]).

### H. 공통 마이크로 요소 (전 페이지 — 하나라도 제거 금지)
- **번호 칩** `w-8 h-8 #171717 흰숫자`(다크 섹션=흰바탕 검정) + `w-10 h-px #eaeaea` 디바이더.
- **세로 디바이더** = `[box-shadow:1px_0_0_var(--color-border-default)]`(라이트) / `rgba(255,255,255,0.12)`(다크).
- **타이틀 패널** `#f0f0f0` bg `minHeight 96` + uppercase EN eyebrow(`10px .06em #555`) + bold 타이틀(`clamp` 20↔16 `-0.03em`).
- **AIAnalysis 카드** `border-left:2px #0070f3` + title(13/600) + body(12/1.7 #555). 전역 `.ai-card strong{font-weight:500;color:#171717}`(작은 한글 700 뭉갬 방지).
- **데모 pill** / **eyebrow**(12~13px 600 accent `.1em` uppercase EN) / **태그칩**(흰 bg 또는 1px 보더).
- **KPI 카드**(label + 대형 EN value + delta ▲초록/▼빨강) · **퍼널 바** · **비교표**(`#1e3a5f` 헤더·2색 컬럼) · **시나리오 카드**(보수 흑/도전 accent).
- **탭**(active `#111` bg 흰텍스트 or 밑줄 `2px accent`) + **`AnimatePresence`** 전환(`opacity/y`).
- **모션 변주**(globals + 컴포넌트): `springPop`(y20→0, EASE `[0.16,1,0.3,1]`) · `staggerContainer`(0.12) · 진입후 400~450ms 지연 트리거 · `CountUp/CounterUp`(0→목표) · `badgePulse` · `skeletonPulse` · spin · `glass-glare` · `phone-scroll` · SVG `animateMotion`/`pathLength`.
- **`.comma` 세리프 콤마** · **이모지 악센트**(🌍✨🔥) · **실상품 이미지**(`/img/unsplash/webp/*.webp`).
- **`btn-gradient-dark`**(그라디언트 CTA/제출 — 플랫 검정 대체 금지) · CTA 화살표 아이콘 hover 이동.

### I. 재건 필수 규칙 (요약 — 이거 어기면 다시 평범해짐)
1. **헤딩** = 수동 `<br>` 균형 + `.comma` + `text-accent` 스팬 (`dangerouslySetInnerHTML`). leading 촘촘.
2. **목업 = 텍스트 카드 금지 → 실제 제품 화면**(BrowserFrame·SVG 파이프라인/차트·iPhone·데이터 테이블·상품 그리드).
3. **/ads** = Dashboard·Trend·AdCanvas 쇼케이스를 **직접 재스킨**(구조·모션 유지, 카피만 '이해' 포지셔닝). **/content** = 같은 밀도의 콘텐츠 목업 신규(네이버 검색결과·블로그 에디터·플레이스 지도·순위추적·GSC류 — 쇼케이스 패턴 차용).
4. **점·선·면·그리드·모션·마이크로(A~H) 하나도 제거 금지.** 없앨 땐 이유를 사장님께 먼저.

## 8.7 ★★ 목업·미감 확정 규칙 (2026-07-10 사장님 확정 — /content 목업 작업의 직접 기준)

> 여기 있는 규칙들은 원래 `.ngn-session.md`(append형 핸드오프)에만 있어서 컴팩션 한 번이면 유실될 상태였다. **디자인 규칙의 집은 이 문서다.** 세션 파일에는 "지금 어디까지 했나(상태)"만 적는다.

### 8.7-00 ★★★ 북극성과 4층 작업 모델 (사장님 확정 2026-07-11 — 이 문서의 모든 규칙 위에 있음)
> 사장님: "처음 이 홈피 보는 사람의 눈으로 만들어야 돼. 그게 북극성이 돼야 되는 거고, 그 다음이 디자인이거든."
- **1차 통과 기준(유일) = 첫 방문자 이해** — 뭐 하는 회사인지 / 왜 필요한지 / 기능이 이해되는지. 측정 = **콜드 리드 게이트**(§8.7-F). 만든 사람(사장님 포함)은 이 눈을 가질 수 없으므로 감으로 판정하지 않는다.
- **2차 기준 = 디자인(신뢰 장치)** — §8.6(원본 보존)·§7(절대 금지)은 **"어떻게 만드나"의 제작 규칙**이지 통과 기준이 아니다. §8.6-I의 밀도 요구는 "점·선·그리드·모션 같은 **시각 장치**를 빼지 마라"는 뜻이지 "글자를 채우라"가 아니다(§8.7-H와 층이 달라 충돌 아님). 진짜 충돌 시 **이해가 이긴다**.
- **4층 모델 (위→아래 한 방향)**:
  | 층 | 내용 | 통과 검사 |
  |---|---|---|
  | L1 구조 | 사이트 골격·동선: 홈=분기 / /content / /ads / /start | **확정 — 흔들지 않는다** |
  | L2 스토리 | 페이지 안 섹션 순서 = 방문자 질문 순서(뭐지?→왜 필요?→진짜 되나?→얼마?→시작) | 페이지 단위 콜드 리드 |
  | L3 섹션 | 섹션별 위계·밀도·카피 | 시안 O/X(§8.7-0) + 섹션 콜드 리드 |
  | L4 디자인 | 브랜드 문법(§8.6~8.7) 입히기 → 조립 후 Claude Design 마감(§8.7-G) | 원본 대비 완성도 + §7 준수 |
- **⛔ 역류 금지**: 하위 층 작업 중 상위 층 의심이 생기면 즉시 바꾸지 말고 **메모 → 모아서 한 번에 판정**. 층을 오가는 즉흥 변경이 진척을 죽인 실증 원인(2026-07-10~11, S9~S14 재작업 9회).

### 8.7-0 ★ 코드 전 '시안(거친 목업)' 선확인 (사장님 확정 2026-07-11 — 반복 재작업의 근본 차단)
> 사장님 규칙(memory `design_slide_structure §0`)을 홈페이지에도 적용: **디자인부터 만들지 마라.** 실컴포넌트를 만들기 전에 아래 3가지가 보이는 **거친 목업(정적 시안 — 위계·밀도·실카피만, 애니·픽셀 정렬 없음)**을 먼저 내고 사장님 O/X를 받는다. **텍스트 기획서로 갈음 금지 — 사장님: "목업으로 보여줘, 이렇게(글로) 하면 내가 결정을 못 해"(2026-07-11).** 통과한 시안만 구현. 픽셀·정렬·모션의 엄격 검증은 **시안 통과 뒤에만**(버려질 시안에 정밀 검증 낭비 금지).
> **모델 분업(사장님 2026-07-11, 메인=페이블 전환)**: 정본 발췌·시안·검수·보고 = 페이블(메인) / 확정 시안 → 실컴포넌트 번역 + 렌더·DOM 검증 루프 = Sonnet 서브 / grep 위생검사·기계 추출 = Haiku 서브.
> **⛔ 소구 재료는 요약본이 아니라 원본 스펙에서.** features-master의 한 줄 요약만 보고 목업을 만들면 본질이 왜곡된다(실패 실증: 목표 키워드="검색량 월30" 오독, 글감=로테이션 6유형 구조 누락). 각 A항목의 "소구 재료" 발췌 블록(원문 인용)을 근거로 쓴다.
1. **이 섹션이 증명할 단 하나의 메시지** (한 문장).
2. **위계**: 무엇이 주인공(크게)이고, 무엇이 과정(심볼·애니로 압축)이고, 무엇이 결과물(크게 펼침)인가.
3. **밀도**: 글자 총량을 얼마로, 무엇을 대표 몇 개만 보이고 나머지는 어떻게 뭉갤지(§8.7-H).
- ⚠ 이 단계를 건너뛰고 코드부터 만들면 위계·밀도를 매번 임의 추측하게 되고, 만든 뒤에야 어긋남이 드러나 통째로 재작업된다(2026-07-11까지 S9~S14 전부 이 이유로 재작업).

### 8.7-A 목업 문법 (기준 파일 = `components/styles/S9_ChannelFanout.tsx`)
- **브라우저 창 껍데기**(신호등 3점 + URL 바)로 제품/채널 화면을 감싼다.
- ~~직각 이음선만. 곡선 금지, 화살표 금지 → 선의 끝은 accent 점~~ **⛔ 폐기(2026-07-19 사장님 확정 — 정반대로 뒤집힘)**: 과정·연결 커넥터 = **화살표가 정본**. **확정 화살 문법(2026-07-20 재확정)**: **PC = 짧은 선+채운 삼각형(#171717, 선 1.6px)** — 사장님 "라인 화살은 흐름 전달이 약하다". **모바일 = 가는 라인 V촉(#171717·1.1px)** 유지. **화살은 카드/요소에 밀착**(사이 여백 금지 — 카드 사이 공간을 화살이 꽉 채우게 선을 늘린다. 카드 폭을 줄여 맞추는 건 반려). 실물 = `ContentSections.VArrow` / `AdsSections.CtVArrow`(수직, 내부 PC/모바일 분기)·`CvArrow`(수평)·카탈로그 `ct-arw` 마커(곡선, PC 채운 삼각). 파란 accent 선+glow/도트 애니 커넥터는 "과정 의미 없는 장식"으로 반려됨.
  - SVG 선은 `vector-effect="non-scaling-stroke"`로 굵기를 균일하게(`preserveAspectRatio="none"`으로 늘어나도 1.5px 유지).
  - ⚠ 좌표계 함정: `viewBox` 퍼센트 좌표는 **부모 높이가 곧 좌표계**다. 정렬 기준이 되는 요소(카드 스택 등)에 SVG를 직접 `absolute`로 붙여야 선이 어긋나지 않는다. 픽셀 하드코딩 대신 `absolute left-full top-1/2 -translate-y-1/2`처럼 **브라우저가 중심을 계산**하게 한다.
- **스켈레톤(회색 막대) 금지 → 실제 글**을 넣는다(정본 A5: 사장님 시점·인사말 없이).
- 목업 안에서 **"실제 발행된 글"을 인용할 때는 따옴표 + 명조(`--font-quote`)**. 앱이 만든 UI 텍스트(Pretendard)와 시각적으로 구분되어야 한다.
- 데스크 = 가로 트리 / 모바일 = 왼쪽 세로축 + 가지(또는 아래로 접기).
- ~~참고 자산: `components/home/DataPipeline.tsx`(얇은 균일선 + 흐르는 점)~~ ⚠ 흐르는 점 문법은 폐기(위 화살 정본 참조). DataPipeline·MobileOurWay(홈)에 구 파란 도트 애니 잔존 — 홈 개보수 시 화살 문법으로 교체 검토.

### 8.7-B 형식 금지
- ⛔ **카드 나열 금지**(사장님 2026-07-10). 정보를 카드 N장으로 늘어놓지 말 것.
- 대신 **주인공을 하나 세우고** 나머지를 그 주변에 위계로 배치한다.
- **적용 범위 = 섹션 안 "설명 시각화"**(한 기능을 설명하는 목업/그래픽). 예: ⑤ 노출 소식 엔진을 소식 카드 4장으로 늘어놓는 것 → 금지.
  - **예외(금지 아님)**: 확정 구조로서의 카드 — §8.0 S3 "두 제품 분기 2카드"(bento), /content·/ads 와이어프레임의 bento 그리드처럼 **탐색·분기용 카드**는 유효하다. 금지 대상은 "설명을 카드로 쪼개 나열하는 것"이지 카드 컴포넌트 자체가 아니다.

### 8.7-C 정보 위계 (사장님 2026-07-10 — S11에서 확정)
- **어필(무엇이 사장님에게 이득인가)이 가장 크고**, 그 근거·예시·출처는 작게.
- 예(⑤ 노출 소식 엔진): ① 매체의 이번 주 노출 소식 = 주인공(18px bold) → ② "예시" 라벨(회색 10px) → ③ 그 결과 글에 들어간 문장 = 명조 인용(14px).
- **accent(파랑)는 1~2곳만.** 선·점에 쓰면 라벨은 회색으로 낮춘다.

### 8.7-D 텍스트 감량 4조 (사장님 "텍스트가 많아 눈에 안 들어온다")
1. **그림이 이미 말하는 것을 글로 또 말하지 않는다.**(하이라이트+주석선이 "반영됨"을 말하면 "반영됨" 라벨은 뺀다)
2. **정본 사실을 전부 넣지 않는다.** 나열(매체 5곳 실명)·부차 규칙은 뺀다. 남길 것 = 어필 + 신뢰 한 방.
3. **각주는 한 줄. 서브카피도 한 줄.**
4. 빈 스페이서로 간격을 벌리지 말고 **실제 내용(본문 한 단락)으로 간격을 만든다.**

### 8.7-E 사진 정책
- 목업 속 사진은 전부 **교체용 슬롯**(이미지 아이콘 + 업로드 완료 배지)으로 둔다. **사장님이 엔바토에서 조달** 후 `next/image`로 교체.
- 컨셉 통일 = **성수동 브런치 카페**.
- ⛔ **아무 스톡 이미지나 끌어다 쓰지 말 것**(§8 "살릴 톤" — 제품 목업 중심, 스톡 이미지 금지 / picsum 같은 랜덤 URL 절대 금지).
  - 구분: §8.6-H의 **`/img/unsplash/webp/*.webp`는 원본 트렌드 쇼케이스의 "실상품 이미지" 보존 자산**(그 컴포넌트 안에서만 유지). 신규 목업의 사장님 가게 사진은 **엔바토 조달분으로 교체**하며, 그 전까지는 빈 슬롯으로 둔다.
  - 목업 자체는 텍스트 카드가 아니라 **실제 제품 화면**이어야 한다(§8.6-I-2).

### 8.7-F 작업 프로세스 (`/styles` 갤러리)
1. 섹션 시각화를 `components/styles/Sxx.tsx`로 만든다 → 2. `/styles` 갤러리 맨 위에 ★로 추가 → 3. **사장님이 하나씩 확인** → 4. 확정분만 실페이지(`app/content/page.tsx`의 ShowcaseRow 등)로 이관.
- `/styles`와 S1~S11은 **지우지 말 것**(사장님 지시. 재사용·타 프로젝트 참고용).
- 검증은 **브라우저 실렌더까지**(타입체크·빌드 통과로 갈음 금지). DOM 실측으로 선·간격·폰트 적용을 확인한다.
- **★ 콜드 리드 게이트 (사장님 요청 2026-07-11 — "처음 방문한 유저의 눈")**: 만든 사람은 첫 방문자의 눈을 가질 수 없다. **프로젝트 문서를 전혀 읽지 않은 에이전트**에게 화면 캡처만 주고 페르소나를 입혀 묻는다("파일 읽기 금지, 이미지 한 장만" 명시).
  - **섹션 단위(구현 완료 시마다)**: 페르소나 1~2명 — "이 그림이 무슨 기능을 말하는 것 같나? 이해 안 되는 것은?"
  - **페이지 단위(조립 후)**: 페르소나 3종(타깃 사장님·비전문 일반인·3초 스캔) — "뭐 하는 회사? 왜 필요? 신뢰 가는가? 어디서 막히나?"
  - **콜드 리드(복수 페르소나)가 최종 이해도 게이트다** — 외부인 테스트는 하지 않는다(사장님 확정 2026-07-11). 페르소나 수·다양성으로 보완한다.
  - ⛔ **가격은 검사 항목이 아니다**(사장님 확정 2026-07-11): 가격은 베타 테스트 후 확정 — 그때까지 콜드 리드 질문에 가격 평가를 넣지 않고, 가격 관련 판정도 사장님께 묻지 않는다. 가격 섹션·문구 작업은 보류.
  - 도구 구분: frontend-design 스킬=새 미감 창작(브랜드 문법 확정 후엔 히어로 등 창의 순간에만) / Claude Design=조립 후 룩앤필 다듬기(§8.7-G) / **이해도 검증=콜드 리드(이 게이트)**.

### 8.7-G Claude Design 사용 시점
- **지금은 쓰지 않는다.** 카피 분량·위계 문제는 룩앤필 도구로 해결되지 않는다.
- `/content` 섹션이 다 조립된 뒤, **페이지 전체 리듬·여백·타이포를 한 번에 훑을 때** 사용(사장님 결정). 사용 시 §7-7(파스텔·AI 냄새 금지)을 반드시 프롬프트에 명시할 것.

### 8.7-H ★ 홈페이지 목업 밀도 = "랜딩이지 앱 UI가 아니다" (사장님 2026-07-11 "글자가 너무 많아 UI 같아. 이건 홈페이지야!!")
> §8.6-I "실제 제품 화면(텍스트 카드 금지)"은 **"스톡 이미지 대신 제품 느낌"**이라는 뜻이지 **"앱을 그대로 축소"**가 아니다. 랜딩 목업은 제품을 **상징·발췌**하되 홈페이지답게 크고 비운다.
- ⛔ **앱 UI 축소판 금지**: 실제 앱처럼 필드·행·값을 빽빽이 채우지 않는다. 한 목업에 정보 블록이 5개 넘으면 십중팔구 앱 UI다.
- **한 섹션 = 큰 그림 하나 + 최소 글자.** 주인공 하나만 크게, 나머지는 **심볼·요약 배지**로 뭉갠다.
- **실제 제품 텍스트를 전수 나열하지 말 것** — 대표 1~3개만 실제 문구로 보이고, 나머지는 `+12개 자동 완성 ✓`처럼 **"많다"는 느낌만** 준다(개수·말줄임).
- **과정은 글자가 아니라 심볼/애니**: "AI가 읽는 중" 같은 과정은 아이콘·스캔 애니 하나로. 과정 안에 목록·표를 넣지 않는다.
- **여백은 넉넉히**(§8.6-C). 목업 하나가 화면을 시원하게 쓰고, 헤드라인이 크게 선다.
- 자가 점검: **"이걸 캡처해서 앱스토어 스크린샷이라 해도 되나?" → 그렇다면 실패**(그건 앱 UI). 랜딩은 "한눈에 뭔지 알고 글자는 거의 없다".

### 8.7-I ★ 텍스트-온리 카드 금지 = "카드의 주인공은 시각물" (사장님 2026-07-11 "텍스트 목업 디테일 수준이 너무 떨어져 — 리니어와 비교해봐")

> ### ★★★★ 목업의 정의 — 이게 이 절 전체의 대전제 (사장님 확정 2026-07-11 밤, 페이블이 짝퉁·밋밋 목업으로 여러 번 실패한 뒤 매듭)
> **목업은 실제(제품 화면)를 구현·재현하는 도구가 아니라, "메시지를 한눈에 이해시키는" 도구다.** 이 한 문장이 아래 모든 세부 규칙보다 우선한다.
> - ✅ 메시지만 전달되면 표현은 **자유롭고 창의적으로** — 실제 네이버·인스타·대시보드 UI를 흉내 낼 필요 없음. **은유·상징·추상 다 허용**(예: "검색에 보인다"를 검색창 없이 '손님들이 검색이라는 길로 내 가게에 모여드는' 라인아트 은유로).
> - ✅ **단 하나의 제약 = 전체 톤앤매너**: 직각·화이트 모노크롬·그린(#2fd46b 콘텐츠)/블루(#3e8bff 광고) 포인트·우리 타이포·라인아트. 사이트 전체와 한 몸으로 보여야 한다.
> - ⛔ 그래도 금지: ~~**짝퉁 실물 재현**(가짜 네이버 결과창 = 실물을 어설프게 흉내)~~ (🛑 2026-10-09 사장님 폐기 — "실제 화면이 필요할 수도 있지, 낡은 규칙". 필요하면 실제 앱 화면을 **진짜와 똑같이** 재현한다. 첫 적용 = /content 채널 구간 인스타·쇼츠), **IT 노드-엣지 도식**(박스+화살표 아키텍처 = 소비자 이해 실패), **순위·성과 보장**(검색1위·3위→1위), **파스텔·AI슬롭**(그린틴트 배경·회색 스켈레톤).
> - **판정 = 딱 두 가지**: ① "엄마가 보고 무슨 뜻인지 아는가"(메시지 전달) ② "톤앤매너가 사이트와 맞는가". 이 둘이면 실물이든 은유든 표현 방식은 **자유**. (실물 재현 여부·밀도는 판정 기준이 아니다 — 이 오해가 짝퉁을 낳았다.)
> - **★선행 조건(사장님 반복 지적 = `design_slide_structure §0`)**: 목업(디자인)을 만들기 전에 **"이 카드가 증명할 단 하나의 메시지"를 텍스트로 먼저 확정**한다. 메시지 없이 디자인부터 만들면 밋밋·무의미해진다(페이블 반복 실패 지점).
> - **★★★★★ 목업은 텍스트를 '거들' 뿐, 설명 그 자체가 될 수 없다 (사장님 확정 2026-07-12 — 페이블이 SVG 목업 하나로 개념을 완벽히 설명하려다 반복 실패한 근본 교정)**: 카피가 메시지를 말한다. 시각물은 그 **감정·장면·분위기를 거들어** 이해를 '돕는' 조연이다. 목업 하나에 개념 전체(순위·채널·흐름)를 욱여넣어 "완벽히 설명"하려 하면 반드시 조잡해진다. **덜어내라 — 시각물은 카피 옆에서 분위기만 살려도 충분하다.**
> - **★유연한 사고 = 매체를 가리지 마라**: SVG 라인아트로 억지로 그리지 마라(손님=동그라미, 가게=아이콘 = 다이어그램 수준, 퀄리티 한계 명확). "한 장의 이미지로 이 메시지를 전한다면 어떤 **장면**일까"(AI 이미지 프롬프트처럼)를 먼저 상상하고, 필요하면 **AI 생성 이미지·사진·정교한 일러스트**를 쓴다. **사장님이 AI 이미지 생성을 지원**하므로, 페이블은 톤에 맞는 **이미지 프롬프트(장면 묘사)를 텍스트로 제시** → 사장님이 생성 → 페이블이 배치·톤 정리. (톤앤매너 = 모노크롬+그린 포인트·미니멀은 이미지에도 적용.)
> - **★★ 실사 폰 목업 제작 노하우 (2026-07-12 확립, 사장님 "이 노하우 잊지마") — 앱 화면은 실제 폰 목업에 담는다**:
>   1. **프레임 다운로드**: 화면·배경 투명한 정면 폰 프레임 PNG(Vecteezy 등, 상업 사용 확인). `nugoona/public/shots/content/phone-frame.png`. (무료+상업+직링은 대개 로그인 벽 → 사장님이 받아 줌.)
>   2. **가짜 투명 처리**: 프레임 화면이 체크무늬(=가짜 투명, 실은 밝은 픽셀)면 PIL로 화면 영역 밝은 픽셀 `alpha=0` 처리해야 뒤 스샷이 비친다. (안 하면 스샷을 덮어 체크무늬만 보임 — 실증.)
>   3. **레이어**: 프레임 = 위(z-index 2) / 앱 스샷 = 화면 영역(`SCREEN {left,top,width,height}` %, 프레임 폰 bbox에서 도출)에 아래(z-index 1).
>   4. **노치 회피**: 스샷이 상태바 제거본이면 콘텐츠가 노치를 침범 → 스샷에 `marginTop`(~8%)으로 노치 아래로 내린다.
>   5. **좌우 여백**: 내부 스샷 `width: 93%` + `margin: auto`(중앙) → 앱이 베젤에서 균등하게 떨어진다(사장님 노하우).
>   6. **반사**: 화면 위 대각선 유리 글레어 그라디언트 = 실사감.
>   7. ⚠ **정밀 정렬은 반드시 '확대 캡처'(playwright MCP로 폰만 크게)로 확인한 뒤 넘어간다.** 작은 전체 캡처로 "됐다" 하지 말 것 — 사장님 지적("MCP 확인도 안 하고 넘어가?"). 현행 정본 = `components/styles/bricks/PhoneScene.tsx`.

> Linear류 최상급 랜딩의 원리 3개를 우리 문법(라이트·직각·라인아트)으로 번역한 규칙. §8.7-H(글자 줄여라)와 한 쌍 — H는 "글자 빼라", I는 "**뺀 자리에 시각물을 넣어라**". (⚠ 아래 세부는 위 "목업의 정의" 대전제 아래에서 읽는다 — "실물 인상·밀도" 표현은 짝퉁 재현을 뜻하지 않는다.)
- ⛔ **번호칩+제목+설명만 있는 카드/스텝 금지.** 카드·스텝·그리드 칸에는 반드시 시각 요소가 하나 이상: **미니 라인아트 다이어그램**(직각선·`non-scaling-stroke`·끝 accent 점 — S9~S13 문법의 미니어처) 또는 **글리프 아이콘**(stroke 1.5, 직각 모서리).
- **목업 밀도 = 실물의 인상**: 목업엔 상태 점·미세 보더·보조 라벨·흐림 처리(경쟁 항목 opacity) 같은 **실물스러운 부속**을 갖춘다. 요소 2~3개짜리 성긴 목업은 "가짜" 인상.
- **시각물은 텍스트를 대체하지 설명하지 않는다** — 캡션·라벨을 시각물 안에 더 넣지 말 것(§8.7-H 유지). 시각물이 기능을 암시하고, 텍스트는 카드 하단 제목+한 줄로 끝.
- 자가 점검: **"이 카드에서 글자를 다 지워도 뭔가 남는가?" → 안 남으면 실패.**
- **★목업 디테일의 사내 기준 = /ads 데이터 파이프라인**(`DashboardShowcase.tsx`의 `DataPipelineVisual` — 사장님 지정 2026-07-11). 여기서 가져올 것 = **디테일 밀도**(실체 있는 요소·상태 점·라벨)와 **살아있는 흐름**(도트·모션). 회색 스켈레톤 바 나열·라벨 없는 추상 도형은 미달.
- **★★단, 이해의 문법은 소비자용** (사장님 2차 판정 2026-07-11 — "Vercel·Linear는 IT 전문가용, 우리는 일반 소비자용. IT 전문가용 목업을 그대로 채용하면 아무도 이해 못 한다"):
  - **추상 노드-엣지 다이어그램(박스+선 아키텍처 도식) 금지** — 그건 IT 문법. 목업의 등장물은 **타깃이 매일 보는 실물 화면**이어야 한다: 네이버 검색결과·블로그 글·인스타 포스트·플레이스 카드·카톡 알림·문자.
  - **"자동화"의 전달 = 과정(progress)이 눈앞에서 일어나는 시퀀스** — "자동으로 됩니다" 글자가 아니라, 사진이 들어가고 → 글이 써지고 → 발행 체크가 찍히는 **비포→진행→애프터 스토리**. 창의성은 여기에 쓴다(연출), 도식에 쓰지 않는다.
  - 자가 점검: **"우리 엄마가 이 목업을 보고 무슨 일이 일어났는지 말할 수 있나?"** — 못 하면 IT 문법이다.
  - **★★★3차 교정 (사장님 2026-07-11 밤 — "실물 목업 자체가 AI 냄새 나고 직관적이지 않다. 설명 문장 그대로 기계적 해석의 목업이 나와서 한 번에 못 알아먹는다"):** 위 "실물 화면"을 **어설프게 재현하면 짝퉁 = 더 심한 AI 냄새**다(가짜 네이버 검색결과 UI = `SearchResultMock`이 실증). 세 가지 금지를 추가한다:
    1. ~~❌ **진짜 서비스 화면(네이버·인스타·플레이스)의 어설픈 재현** — 실제와 조금이라도 다르면 짝퉁. 픽셀 흉내 금지.~~ (🛑 2026-10-09 사장님 폐기 — "실제 화면이 필요할 수도 있지, 낡은 규칙". 필요하면 실제 앱 화면을 **진짜와 똑같이** 재현한다. 첫 적용 = /content 채널 구간 인스타·쇼츠) 남는 기준 = 어설프게 하지 말 것(재현한다면 아이콘·글자·간격까지 진짜와 같게).
    2. ❌ **설명 문장의 기계적 1:1 번역** — "검색에 보이고 싶다" → 검색창 그리기 식. 카피를 UI로 직역하지 말 것(이게 "한 번에 못 알아먹는" 근본 원인).
    3. ❌ **목업 안 텍스트 과다** — 라벨·문구 잔뜩 = 즉각 안 읽힘.
    - ✅ 대신 **핵심 개념 하나**를 (a) **세련된 간소한 동적 애니메이션**(진짜 화면 흉내 X, 은유·추상 OK — 단 성의 없는 회색 스켈레톤과는 다르다) **또는** (b) **짧은 텍스트 + 절제된 미니 그래픽**으로.
    - 자가점검 격상: **"그 서비스를 아는 사람이 봐도 짝퉁 같지 않고(세련), 모르는 사람도 한 번에 뜻을 아는가(즉각)?"** 둘 다 Yes라야 통과.
    - ⚠ 이 교정은 위 "목업 밀도 = 실물 인상"·"실물 화면" 항목과 긴장한다 — **즉각 이해·세련이 밀도·실물 재현보다 우선**. 밀도·실물성을 좇아 텍스트·부속을 늘려 짝퉁이 되면 실격. (실물 화면 지침은 "타깃에게 낯익은 소재를 쓰라"는 뜻이지 "픽셀 단위로 재현하라"가 아니다 — 이 오독이 짝퉁을 낳았다.)
    - 구체적 당선 목업 문법(추상 애니 vs 짧은 텍스트 vs 혼합)은 **벽돌2 목업 시안 비교(`/lab/mock`)로 확정 예정** → 확정 후 이 자리에 적립하고 세 분기 시안(A/B/C)에 이식한다.

> ### ★ 목업 제작 디테일 8조 (2026-07-12 페이블 리서치 확립 — 모든 목업 일괄 적용. 근거: Vercel elevation 스택·Ahlin/Comeau 레이어드 섀도·Linear look)
> **투박함의 범인 = ①1겹 대형 그림자 ②평면 크롬 ③행별 보더 박스 ④무대 부재** (색·레이아웃 아님). 아래로 같은 구성에서 Vercel급 재질이 나온다. 구현체 정본 = `components/styles/bricks/PhilosophyMocks.tsx`(RankMock·AdChatMock).
> 1. **그림자 = 공용 토큰 `--shadow-mock` 하나만**(globals.css: hairline 링 + contact→far ambient 5겹, slate(15,23,42) 틴트, 겹당 알파 ≤0.10, 광원 위). 개별 임의 그림자·순검정 `rgba(0,0,0,x)`·1겹 대형 그림자 금지.
> 2. **보더 대신 링**: 목업 외곽은 `border` 대신 그림자 1겹째 `0 0 0 1px rgba(15,23,42,0.07)`. 크롬(창 상단바)엔 top-light(`inset 0 1px 0 rgba(255,255,255,0.9)`) + 미세 수직 그라디언트(`#fcfcfd→#f5f7f9`) + 중앙 URL 칩 — "종이 스티커"가 아니라 "재질".
> 3. **내부 구획 = hairline divider**(`divide-y divide-border-light` + 컨테이너 1개). 행마다 보더 박스 나열 금지(선이 2배로 늘어 시끄러움).
> 4. **무대 필수**: 목업 뒤 라디얼 글로우(accent 알파 **≤0.06** — "면"이 아니라 "빛", 넘기면 §7-7 파스텔 면칠) + 도트/그리드 + `mask-image: radial-gradient`로 가장자리 페이드. 기존 자산(그리드 크로스헤어·noise) 재사용 우선.
> 5. **숫자·URL·데이터 = `var(--font-en)` + `tabular-nums`.** 배지·컬러 버튼엔 자체 미세 그림자 + 윗면 1px 하이라이트(`inset 0 1px 0 rgba(255,255,255,0.25)`), radius ≤6px(직각 계열), 색은 §8.9 데이터 색 표만(amber `#f59e0b` 등 표 밖 색 금지 — 중립 아웃라인 배지로).
> 6. **살아있는 신호 정확히 1개**: 펄스 점·typing 도트·타임스탬프 중 하나(2개 이상 = 시끄러움).
> 7. **복수 목업**: 대등 나열이 어색하면 스케일 대비(0.94~0.96)·z 겹침·y 오프셋으로 장면화. **회전(rotate) 금지**(직각 브랜드 충돌). 단 두 제품 대칭이 의미 있으면(콘텐츠/광고) 대칭 유지도 정답 — 시안 O/X로 판정.
> 8. 폰트 크기·색·자간은 §8.9 표만(목업 내부도 **소수점 px·12px 금지**).

### 8.7-K ★★★ 디자인 검수표 — 설계→적대검사→마감 (사장님 확정 2026-07-17 "이거부터 끝내고 작업")
> 배경: S2~S4 1차 구현이 "카피의 기계적 배치 = 와이어프레임 수준(구현율 20%)" 판정. **디자인 완수 = 아래 A→구현→B→수정→C 전부 통과.** 캡처는 사장님께 보내기 전에 B·C를 먼저 돌린다. 콜드 리드 팬아웃은 불필요(사장님 2026-07-17 — 과하면 "앱이 아니라 논문이 된다").

**A. 착수 전 설계 분석표 (목업마다 작성 — 무턱대고 구현 금지)**
1. **메시지**: 헤드라인과, 목업이 증명할 단 하나의 메시지.
2. **장면**: 무엇을 보여줄 것인가 한 문장 + "이걸 보면 유저가 헤드라인 이해에 도움이 된다"는 논리.
3. **표현 스펙트럼**: 추상 은유 ↔ 실제 화면 유사 중 어디로, 왜. (홈 = 목업마다 다르게 선택: 궤도=추상 / 검색 장면·글 스택=실물 유사. 기계적 직역도 무의미한 추상도 금지.)
4. **공간 활용**: 배치(2열/중앙/전폭)·그리드 칸 분할·목업 크기 — 공간 활용도를 어떻게 쓸지.
5. **재질·부속**: 크롬(신호등·타이틀칩)·무대(도트/글로우/edge mask)·실카피(명조)·상태 부속 중 무엇을(§8.7 8조).
6. **모션**: 메시지를 **연기**하는 모션 1개 — 필요 여부와 내용(fade-in은 모션이 아님).

**B. 구현 후 적대 검사 (캡처 기반 셀프 — 사장님 송부 전 필수)**
1. ★**텍스트 가림**: 문구 없이 목업만 보고 **"무슨 상황인지 알 수 있을 것 같다"** 수준이면 합격(사장님 확정 합격선 — 도메인까지 알 필요 없음, 과하게 잡지 말 것).
2. **이해 기여**: 헤드라인 이해에 시각적 효과를 주는가 — 옆에 있는 장식이면 실격.
3. **추상-직역 균형**: 너무 추상(아무 말 안 함) / 너무 직역(카피 1:1 기계 번역) 둘 다 실격.
4. **어설픈 재현**: 실제 서비스 화면을 쓰는 것은 허용(2026-10-09). 단 진짜와 다르게 어설프면 실격.
5. **와이어프레임**: 보더 박스+스켈레톤 나열에 그침(재질·리얼리티 부재) 실격.

**C. 디자인 마감 검수**
1. **소스급 퀄리티**: 홈 실물·/lab/vercel·/lab/sources 옆에 놓아도 같은 손인가.
2. **애니메이션 필요성**: 있어야 사는가 — 판단을 기록(필요한데 없으면 미완).
3. 규칙: §8.9 허용값·§8.17 스타일 락·§8.16 좌표.
4. 모바일 390 실측(§8.18).
5. 감독관(§8.10) 5항.
> 최종 판정 = 사장님(묶음 단위 O/X — 이 표는 반려율을 낮추는 사전 장치이지 대체가 아님).

## 8.10 ★★ 디자인 감독관 게이트 (사장님 확정 2026-07-11 — "그 사람 눈에 맞아야 된다고 가정해")

> 콜드 리드(§8.7-F) = **이해**의 최종 게이트 / **디자인 감독관 = 미감·디테일의 최종 게이트.** L4 작업물은 사장님에게 가기 전에 반드시 감독관을 통과한다.

**페르소나**: 애플·Linear·Vercel을 거친 세계 최고 수준의 디자인 디렉터. 모든 것에 완벽을 추구하며, 다음을 냉정하게 판정한다:
1. **타이포 정밀도** — 자간·굵기·행간·크기 위계가 의도적인가, 임의인가. 한 화면에서 어긋난 1px도 잡는다.
2. **목업 디테일** — 실물의 인상을 주는가, 대충 만든 가짜처럼 보이는가.
3. **톤앤매너 일관성** — 페이지·섹션을 넘나들며 같은 손이 만든 것처럼 보이는가.
4. **내용 전달** — 각 섹션이 무엇을 말하는지 3초 안에 들어오는가(장식이 내용을 가리면 실격).
5. **고급스러움** — 조잡한가 세련됐는가. 심플하면서 비어 보이지 않는가. 채웠으면서 시끄럽지 않은가.

**운용 규칙**:
- 실행 = `Agent(model: fable)` 읽기 전용, **프로젝트 문서·코드를 읽지 않고 렌더 캡처만 보고** 판정(만든 맥락을 모르는 눈이어야 함).
- 출력 = 항목별 합격/불합격 + 불합격 사유(캡처 좌표·구체 지점) + 수리 지시. "전체적으로 좋다" 류의 관대한 총평 금지 — **불합격 지점이 0이 될 때까지 재감사**.
- 감독관 지적이 §8.9(허용값)·§8.6(원본 보존)과 충돌하면 정본이 이기되, 충돌 기록을 남긴다.

## 8.9 ★★ 디테일 시스템 — 허용값 제한 (2026-07-11 확정. 사장님 "기준을 정말 디테일하게 세우고 일괄로 해라")

> ### ★ 텍스트 줄바꿈·줄간격 규칙 (사장님 확정 2026-07-13 — 향후 **모든** 텍스트 디자인에 일괄 반영)
> - **줄 너비를 동일하게** — 본문·서브·캡션은 `[text-wrap:balance]`로 각 줄 길이를 균형 있게(한 줄만 짧게 남거나 들쭉날쭉 금지). 헤딩은 기존대로 수동 `<br>` 균형(§8.6-B). `word-break:keep-all` 유지.
> - **줄간격 촘촘히** — 본문·서브 `leading-[1.5]` 기준(기존 1.65~1.75는 지양, 밀도 있게). 캡션도 동일.
> - **글자는 또렷하게** (사장님 2026-07-13 — "Vercel은 또렷한데 우리는 흐리다") — 본문·서브는 `font-light`(얇음) 금지, **weight 400~500(medium 권장)** + 충분히 진한 색(옅은 회색 본문 지양, `text-body` 이상). 원인 = 얇은 굵기 + 옅은 회색이지 폰트(Pretendard)가 아님. 폰트는 유지, weight·색으로 해결.
> - 적용 범위: 홈·시안·목업·전 페이지 모든 카피. (첫 적용례 = S2 시안1 서브·캡션을 `text-wrap:balance` + `leading-[1.5]` + `font-medium` + 진한 색으로 반영, 2026-07-13.)

> ### ★ 구두점·장식 금지 4종 (사장님 확정 2026-07-14 — 전 섹션 카피·헤드 일괄. 이전에도 지시했으나 명문화 누락으로 재위반됐던 것)
> 1. ⛔ **대시(—·–·ㅡ) 금지** — 문장 연결·부연에 대시를 쓰지 않는다. 필요하면 가운뎃점(·)이나 문장 분리로.
> 2. ⛔ **크게 나오는 문구(헤드라인·대형 강조)에 밑줄 금지** — accent 색만으로 강조. 밑줄 바 장식 금지.
> 3. ⛔ **크게 나오는 문구 끝 마침표 금지** — 헤드라인·대형 마무리 문구는 마침표 없이 끝낸다.
> 4. ⛔ **`<br>` 줄바꿈 앞 쉼표·마침표 금지** — 줄바꿈이 구두점 역할을 한다("매체가 바뀌면,<br>" ❌ → "매체가 바뀌면<br>" ✅). 본문 소형 문장의 문장 끝 마침표는 유지.

> **최상급 사이트(Vercel/Geist·Linear)가 딱 떨어져 보이는 이유 = 요소를 잘 만들어서가 아니라 "허용값 자체가 몇 개 없어서"다.**
> 실측(2026-07-11, 4페이지 DOM 전수): 폰트 크기 53종·텍스트 색 34종·자간 39종·보더 3종 난립 — 이것이 "디테일 떨어짐"의 구조적 원인.
> 아래 표 밖의 값은 **쓰지 않는다**. 새 값이 필요하면 이 절을 먼저 고친다.

### 텍스트 색 — 라이트 4단 / 다크 3단 (그 외 회색 금지)
| 용도 | 클래스 | 값 |
|---|---|---|
| 헤딩·강조 | `text-text-primary` | #171717 |
| 본문 | `text-text-body` | #333 |
| 보조 설명·캡션 | `text-text-weak` | #666 (토큰 값 #555→#666 통합) |
| 라벨·미세 캡션·비활성 | `text-text-muted` | #999 (토큰 값 #444→#999 재정의 — 위계 역전 해소) |
| 다크 | `text-white` / `text-white/55` / `text-white/40` | 3단만 |
- 인라인 회색 hex(#444 #555 #666 #888 #999 #aaa #bbb #ccc 텍스트) 금지 → 위 토큰으로. 매핑: **#444→body / #ccc→muted**(진하기 기준 수렴 — 토큰 muted의 옛값이 #444였던 것과 무관). `text-secondary`·`text-disabled`는 폐기 예정(신규 사용 금지).

### 폰트 크기 — 화면 텍스트 스케일 (이 11개 + §5 클램프 헤딩만)
`11px`(EN 라벨) · `13px`(보조·캡션) · `14px`(본문S) · `15px`(본문) · `16px`(리드) · `18px`(카드 제목) · `20px`(소헤딩) + 클램프 헤딩 4단(§5) 
- **12px·17px 및 소수점(10.5/11.25/13.5…) 금지** → 13/16/정수로 치환.
- **예외 = 목업·시각물 내부**(SVG 텍스트, 미니 UI): 9~11px 허용(8px 미만 금지). 목업 밖 화면 텍스트에 9~10px 금지.

### 자간 — 4단만
헤딩 대형(clamp 28px+) `-0.03em` / 헤딩 중형 `-0.02em` / 본문 지정 안 함(0) / EN 대문자 라벨 `0.08em`. (-0.01/-0.015/-0.025/-0.035/-0.045 등 잡값 금지. 히어로 h1의 -0.04em은 §8.6 원본 보존으로 예외.)

### 행간 — 4단만
헤딩 `1.15` / 서브헤딩 `1.25` / 본문 `1.65` / 목업·UI `1.4~1.5`.

### 보더 — 2단만
구획·카드 = `border-default`(#eaeaea) / 목업 내부 미세 = `border-light`(#f0f0f0). **#e0e0e0·#e5e5e5 금지** → border-default. 강조 = accent 계열만.

### 간격 — 4px 배수(8 배수 우선)
섹션 위계 = §8.7(128>80>64>40). 카드 내부 p-6/p-7, 요소 간 gap 4의 배수. 홀수·임의 px 금지.

### ★ 모바일(≤900px) — "축소 복사본 금지, 텍스트가 공간의 주인" (사장님 2026-07-11 "여백만 많고 글자가 얇다 — 공간 활용과 디자인으로서의 텍스트")
> Vercel·Linear 모바일의 원리: 모바일에서 활자를 **키운다**(본문조차 데스크톱보다 크거나 같게), 텍스트 블록이 화면 폭을 채워 그 자체가 그래픽이 된다. 여백은 섹션 사이에만.
- **모바일 타이포 하한**: 본문 16px(데스크톱 14~15 → 모바일 16~17) · 리드 18px · 캡션 14px · 헤딩 clamp 하한을 화면 폭 기준으로 상향(h2 min 26~28px). 13px 이하는 목업 내부만.
- **한글 웨이트**: 모바일 본문 500(Pretendard 400은 축소 화면에서 가늘어 '얇고 안 예쁨') · 헤딩 700+ 유지.
- **요소 크기 = 화면 폭 비례(고정 px 금지)**: 사진·목업·카드가 모바일에서 44~88px 우표 크기로 뜨면 실격 — flex-1/%/aspect로 폭을 나눠 갖게. **"직계 자식 폭 합 ÷ 컨테이너 폭 < 60%"인 행 = 공간 방치 결함.**
- 자가 점검: 모바일 스크린샷에서 **한 화면에 흰 공백이 콘텐츠보다 많으면 실패.**
- **세로 공간 방치 금지(2026-07-11 계측 도입)**: 모바일에서 **섹션 콘텐츠 높이 ÷ 섹션 높이 ≥ 75%**. 데스크톱의 대형 패딩(py-24+)·고정 마진(mb-72 등)을 모바일에 상속하는 게 주범 — 모바일은 py-12~14, 요소 간 마진은 콘텐츠에 비례. (히어로는 배경 시각 장치 감안하되 콘텐츠 블록 바깥 순수 여백은 같은 기준.)

### ★ 감독관 게이트 모바일 필수 (2026-07-11 구멍 실증 — 데스크톱만 감사해 모바일 참사 통과)
§8.10 감독관 감사는 **데스크톱 + 모바일(390px) 캡처를 모두** 제출해야 유효. 모바일 미감사 합격은 무효.

### 데이터 색(목업 전용 — 화면 카피에 쓰지 않음)
네이버 #03c75a · 메타 #1877f2 · 인스타 #e1306c · 구글 #4285f4 · 상승 #22c55e · 하락(데이터) #ef4444 · 하락(순위표) #3b82f6. **#8b5cf6(보라)는 데이터 색에서도 제외** — 중립(#666) 또는 위 색으로.

## 8.11 ★★ 벽돌 쌓기 — 당선 문법 적립부 (2026-07-11 시작 — 위젯별 시안 경쟁→사장님 택1→여기 적립→다음 벽돌 브리프에 상속)

> 프로세스: 위젯 1개 = 시안 3~4컨셉 병렬(Opus+Sonnet) → /lab 갤러리 → 사장님 택1+메모 → 본편 장착 → 당선 문법 여기 적립. 취향 데이터가 쌓일수록 시안 수 축소.

> ### ⛔⛔ 금지 게이트 (2026-07-11 밤 — 사장님 3연속 격노 "정본을 왜 계속 잊는 거야?" 이후 강제 절차화)
> **시안을 만들기 전에 정본 금지 리스트를 확인하고, 만든 뒤 실제로 검사를 돌린다. 이 게이트를 통과 못 하면 사장님께 보여주지 않는다.** (원인 = 절차 부재: "직관적이니까"로 정본을 건너뛰고 `검색 3위→1위` 같은 순위 보장 표현·파스텔 그린틴트·회색 스켈레톤을 넣었다 = `features-master §14`·`§7-7` 명백 위반.)
> - **시안 생산 전 (브리프에 반드시 명시)**: ① `features-master §14` — 순위·노출 보장 금지(❌"검색 1위/상위노출/1페이지 보장/상단 고정/3위→1위/○위") · 성과 보장 금지 · 우월 과장 금지. **우리 제품은 순위를 측정·표시하고 하락 경고만 한다(A13) — "올려준다"가 아니다.** ② `§7-7`+`§8.7-I 3차교정` — 파스텔·그린틴트 배경·회색 스켈레톤 바 = AI 슬롭 금지(~~짝퉁 실물 재현~~ 2026-10-09 폐기 — 실제 화면은 진짜와 똑같이면 허용). ③ Vercel/Linear 미니멀 회색 문법을 이 목업에 그대로 이식 금지(사장님 2026-07-11 "여기서는 vercel·linear 스타일 제외").
> - **시안 생산 후 (실제로 돌린다)**: `CLAUDE.md`의 검사①(순위·금지표현)·검사③(파스텔·AI)을 `rg`로 실행해 **0건 확인**. 0건 아니면 사장님께 안 보여준다. "0건일 것"이라 단정 금지 — 반드시 실행.
> - ✅ 예외(정상): 남의 공개 순위 조회(29CM 랭킹·지출순 정렬), 우리 가게 노출 **측정·현황 표시**("안 보임" 대신 "3페이지 27위"로 정직하게 — A13). 금지는 "우리가 순위를 올려준다는 보장"이지, 현황 측정 표시가 아니다. 단 이 미묘한 차이가 "올려줌"으로 읽히면 실격이니 조심.

### 벽돌1 · 홈 히어로 = B "빔 캔버스 진화" 당선 (2026-07-11, `components/styles/bricks/HeroB.tsx` → 본편 장착)
- **낙선**: A 타이포 지배(화이트·초대형 활자) / C 실물 전면(라이트·목업 주인공) / D 톤온톤 타일(어도비 그리드).
- **당선 문법(다음 벽돌에 상속)**:
  1. **원작 계승 우선** — 사장님이 만든 기존 시각 장치(격자·크로스헤어·노이즈·빔)의 진화가 신규 발명보다 강함.
  2. **다크 + 정밀 시스템 감성** — 코너 좌표풍 라벨(SYSTEM/GRID 12×08/LIVE), 격자 교차점 도트, "계기판" 인상.
  3. **두 제품색 이중주** — 콘텐츠 그린(#2fd46b)·광고 블루(#3e8bff)가 배경(빔)에서 회사 구조를 암시.
  4. 중앙 정렬 타이포 + 직각 흰 CTA. 배경 장치는 은은한 무한 루프 허용(원작 문법).
- **취향 신호**: 실물 목업 전면(C)보다 시스템 무드를 택함 — 단 이는 "히어로" 맥락(분기 카드 등 제품 소개 위젯에선 실물이 여전히 유효할 수 있음, 벽돌2에서 검증).

## 8.8 로고 시스템 (사장님 확정 2026-07-11 — 어도비 CC 방식, C안·직각)

### ★★★ 2026-10-07 새 로고 확정 — 아래 구 로고(NC/NA 글자형)는 **전부 폐기**
> 사장님 확정 2026-10-07. **디자인 수정 금지**(파일을 그대로 쓴다. 색·형태를 다시 그리지 않는다).
> 저장소 반입 2026-10-08(직원 PC에서 받을 수 있게 GitHub 공유).

**이름**
| | 한글 | 영문 |
|---|---|---|
| 회사 | 누구나 컴퍼니 | **NUGOONA** (COMPANY 는 영문에서 뺀다) |
| 광고 앱(= 대시보드) | **누구나광고** | NUGOONA ADS |
| 콘텐츠 앱(= 업로드) | **누구나콘텐츠** | NUGOONA CONTENT |

⚠️ **로고 속 글자는 앱 이름을 붙여 쓴다**(누구나광고·누구나콘텐츠).
🛑 **화면 본문의 제품명 표기는 아직 "누구나 광고"·"누구나 콘텐츠"(띄어쓰기)가 정본이다**(CLAUDE.md 작업 규칙).
   **로고에 맞춰 화면 글자를 바꿀지는 사장님 결정 전 — 임의로 고치지 말 것.**

**생김새**
- 한글 글꼴 = 페이북 Bold~ExtraBold 중간 굵기 · 영문 = Inter Tight 대문자
- 심벌: **회사 = 검정 둥근 판 + 흰 스마일** / **앱 = 검정 아이콘 + 오른쪽 아래 흰 스마일 배지**
- 색은 **파랑 점 `#2F7BFF` 한 곳만** (나머지는 검정·흰색)

**파일 — `nugoona/public/img/brand/`**
| 폴더 | 무엇 |
|---|---|
| `company/` | 회사(누구나 컴퍼니 · NUGOONA) |
| `ad/` | 누구나광고 · NUGOONA ADS |
| `content/` | 누구나콘텐츠 · NUGOONA CONTENT |

각 폴더 안 (9개 SVG + 부속)
| 파일 | 쓰는 곳 |
|---|---|
| `symbol.svg` | 심벌만 |
| `horizontal-ko-dark-text.svg` · `horizontal-en-dark-text.svg` | 가로형, **밝은 바탕용**(글자 검정) |
| `horizontal-ko-white-text.svg` · `horizontal-en-white-text.svg` | 가로형, **어두운 바탕용**(글자 흰색) |
| `vertical-ko-*.svg` · `vertical-en-*.svg` | 세로형, 같은 규칙 |
| `png/symbol-{16,32,64,128,256,512}.png` · `favicon.ico` | 파비콘·작은 아이콘용 |
| `preview.png`(brand 루트) | 전체 미리보기 1장 |

🛑 **`dark-text` = 밝은 바탕에 쓰는 것**이다(글자가 검정이라서). 어두운 바탕에는 `white-text` 를 쓴다. 이름만 보고 반대로 쓰지 말 것.
원본 전체(PNG 154종·인쇄용 PDF)는 사장님 PC 작업 폴더에 있다 — 저장소에는 **홈페이지에 필요한 것만** 넣었다.

⛔ **이하 구 로고 체계(NC/NA 두 글자 + 네이비·로열블루 그라데이션)는 2026-10-07 새 로고로 대체되어 폐기.**
   기존 `public/img/logo/{n,na,nc}.*` 는 아직 화면에서 쓰이고 있으므로 지우지 않는다 —
   **교체 작업은 별도 지시 때.** 아래는 그때까지의 이력·근거로만 남긴다.


> **규칙 하나로 로고가 자동 생성되는 시스템** — 제품이 늘어도 새 로고를 "창작"하지 않는다.

> ⛔ **옛 버전(2026-07-11 어도비 CC 톤온톤·그린·직각)은 전면 폐기.** 사장님 지적 "누가봐도 어도비"·"우리 색은 블루" → 2026-07-12 재설계·"합격" 확정. 아래가 정본.

- **★★핵심 = 두 앱은 완전히 다른 앱 → 로고 통일 금지** (사장님 "통일하면 헷갈린다"). 콘텐츠·광고의 배경 톤·글자 색을 확실히 다르게 한다.
- **브랜드 색 = 블루 `#0070f3` 단일** (홈·앱 `globals.css` 정본, 앱 "1년치 글 주제" 카드색). ⛔ **그린(`#2fd46b`)·별도블루(`#3e8bff`)는 페이블 임의 창작 → 폐기.** (히어로 빔 등 잔존 그린은 정리 대상.)
- **형태** = 정사각 + **라운드 살짝(`rx=40`, 약 8%)** — 어도비의 부드러운 라운드는 피하되 완전 직각도 아님. **배경 = 세로 그라데이션**(위→아래 점점 어둡게, 깊이감).
- **글자 = 대문자 2글자**(NC/NA — N=누구나, C/A=제품). **두 글자 동일 크기**. `system-ui` 900 + `stroke`로 더 두껍게. `letter-spacing 3`(붙지 않되 벌어지지 않게). **정중앙**(대문자 baseline 계산 y≈340/512, MCP 십자 가이드로 검증).
- **색 (확정)**:
  - **NC 콘텐츠** = 배경 네이비 그라데이션(`#13387a`→`#06122c`) + 글자 밝은블루 `#4d9fff`
  - **NA 광고** = 배경 로열블루 그라데이션(`#1c6fd6`→`#0a2e63`) + 글자 채도높은 시안 `#29d5ff`
  - ⛔ 글자 = **채도 있는 유채색만.** 흰색(무채색)·파스텔(저채도) 금지 — 사장님 "로고 같지 않다".
- **어도비 표절 회피 3요소**: ①폰트 Inter Tight(어도비풍) → `system-ui` ②라운드 축소 ③배경 그라데이션 + 두 앱 색 반전 차별.
- **자산** = `public/img/logo/{nc,na}.svg`(원본) + `{nc,na}-{512,180,32,16}.png`(2026-07-12 렌더 추출·갱신). **★화면에선 PNG 사용 권장** — SVG의 `system-ui`는 기기(맥·안드로이드)마다 글자가 달라짐. 벡터 패스화가 최종이나, 우선 PNG로 고정.
- **미완(외주)**: 글자 벡터 패스화(폰트 의존 완전 제거)·옵티컬 보정.
- 마스터 N(회사·파비콘)은 `n.svg`/`n-*.png` 유지(별건).

## 8.13 ★ Vercel 레이아웃 소스 라이브러리 (2026-07-13 사장님 확정 — 재사용 디자인 소스)

> 사장님 방향(2026-07-13): "밑도 끝도 없는 동일 격자무늬가 아니라, **내용에 맞게 칸을 만드는 그리드**(hairline 칸 divider + 교차 `+` 마커) + 여백 활용 + 꼭 필요한 곳의 간단·세련된 목업"이 Vercel의 배울 점. **모든 걸 목업으로 기계 설명 = 과유불급 금지.**
> ⚠️ **§8.11 금지 게이트의 "Vercel/Linear 스타일 제외"와 모순 아님**: 금지 대상은 **회색 밋밋 미니멀·흰 배경 과다**이고, **그리드 칸·십자선·좌표 라벨·여백·절제된 목업 문법은 우리 히어로(HeroB) 언어의 확장으로 차용 OK**(사장님 재정의).

- **위치**: `/lab/vercel` 갤러리 = `components/styles/vercel/Clone01~10.tsx`. Vercel 실사이트 10개 시안을 픽셀 실측 복제(페이블 10팀, 2026-07-13). **디자인 소스(레이아웃 문법)일 뿐 그대로 쓰는 게 아니다.**

> ### ★ 재사용 소스 갤러리 2종 (⛔ 삭제 금지 = 재사용 자산, 사장님 지시 2026-07-16)
> 이 두 갤러리는 **이번 홈피에 국한되지 않는 영구 디자인 소스**다. 시안 폴더(`/lab`)에 있지만 정리 시 **지우지 말 것**. 언제든 URL로 열어 골라서(선택) → 우리 스타일로 가공해 재사용한다.
> - **`/lab/vercel`** — Vercel Clone **10종**(`components/styles/vercel/Clone01~10.tsx`). 레이아웃·여백·그림자·균형 문법 소스.
> - **`/lab/sources`** — 애니메이션 컴포넌트 **53종**(`app/lab/sources/page.tsx` + `components/lab-sources/{magicui,aceternity,motion-primitives,reactbits,cultui,hextaui,animata,svg}/`). 원본 그대로 이식(가공 전). **사이드바 + 단일 프리뷰**(한 번에 1개만 재생 = 성능). 구성: **그룹 A 다이어그램·네트워크·구조형 10**(World Map·Globe·Icon Cloud·Animated Beam·Orbiting Circles·Gemini Effect·Tracing Beam + **A8 SVG Line Draw·A9 SVG Path Dot Flow(순수 SVG 자작 프리미티브, 의존성 0 — 선 좌표를 §8.16 그리드에 직접 앉힘)·A10 Gradient Beam**) / **B 배경·입자·질감 15** / **C 카드 강조·텍스트 11** / **★D 콘텐츠 카드 17**(2026-07-17 확충, 사장님 "카드+점·선 다다익선" — Magic Card·3D Card·Focus Cards·Tilt·Spotlight Card·MinimalCard·Card Stack·Comet·Glare·Wobble·Draggable·Expandable 모달/인라인·Tilted·Flip·Border Trail·Spotlight 커서추적. **카드 안에 사진·내용을 담는 컨테이너 계열**). 외부 라이브러리 = `cobe@0.6.4`·`@tsparticles v3`·`simplex-noise`·`dotted-map`·`react-use-measure`(three.js·GSAP 없음). 애니 keyframe = `globals.css`의 `.lab-sources-scope` 스코프(유틸 직접 선언 + `@source`). 정적 2종=Dot/Grid Pattern, 인터랙션(hover) 2종=Glowing/Card Hover.
> ### 📍 어디를 보면 되나 (2026-10-02 사장님 지시로 명시 — "디자인 참고할 때 어딜 봐야 할지 모를 때를 위해")
>
> **보는 주소** (개발 서버 3131이 떠 있어야 한다)
>
> | | 애니메이션 53종 | Vercel 클론 10종 |
> |---|---|---|
> | PC | `http://localhost:3131/lab/sources` | `http://localhost:3131/lab/vercel` |
> | 폰(테일스케일) | `http://100.112.202.111:3131/lab/sources` | `http://100.112.202.111:3131/lab/vercel` |
>
> **파일이 있는 곳**
>
> | 무엇 | 경로 |
> |---|---|
> | 애니메이션 소스 **53개 파일** | `nugoona/components/lab-sources/` — 8묶음(`aceternity` `animata` `cultui` `hextaui` `magicui` `motion-primitives` `reactbits` `svg`) |
> | 그 갤러리 화면 | `nugoona/app/lab/sources/page.tsx` |
> | Vercel 클론 **10개** | `nugoona/components/styles/vercel/Clone01~10.tsx` |
> | 그 갤러리 화면 | `nugoona/app/lab/vercel/page.tsx` |
>
> ⚠ **폰에서는 애니메이션 쪽만 제대로 보인다.** Vercel 클론은 PC 화면을 베낀 것이라 폰 폭에서 오른쪽이 잘린다(실측 390px).
>   폰으로 참고할 거면 애니메이션 쪽을, Vercel 레이아웃은 PC에서 볼 것.
>
> ~~**임시 외부 열람 URL(Cloud Run `nugoona-lab`)**~~ → 🛑 **2026-10-02 서비스째 정리됨.**
>   밖에서 볼 일이 없다는 사장님 판단(*"밖에서는 볼 필요 없고 PC에 있으니 폰 테일스케일로 보면 된다"*).
>   **소스·갤러리 화면은 하나도 안 지웠다** — 지운 건 바깥에서 열던 주소뿐이다.
>   다시 외부에 올릴 일이 생기면 **검색 차단(noindex)을 함께** 넣을 것(전에는 `Allow: /`로 열려 있었다).
> - 재사용 원칙: **골라서 우리 스타일(다크·accent 블루 절제·직각·순백·§7-7 파스텔 금지)로 가공** 후 실제 페이지에 이식(§8.13 "소스=분해→재조립"과 동일).
> - **★필수 참조(사장님 2026-07-16)**: 목업·디자인 작업 진입 시 이 2종을 **반드시 먼저 열어 재료를 찾는다**. 단순한 줄·선이 아니면 맨손 창작 금지 — **여러 소스 조합·변형·재가공**이 기본 경로(손목업 반려 4회 실증). 다음 세션도 이 절부터.
- **문법 인벤토리** (→ 우리 섹션 매핑 아이디어):
  - **01 플로우 다이어그램**(노드+곡선 커넥터 끝 fade+pill 라벨) → 분기·"매체 바뀌면 대응".
  - **02·07·09·10 칸 그리드 3·4칸**(hairline divider + `+` 마커) → WHY 3요소·기능 소개.
  - **03·04 브라우저/터미널 목업**(추상 UI) → 노출 측정 정직 표시("아직 안 보임").
  - **02·05·06·08 방사형 노드/오비트** → 다채널 발행(한 곳 → 여러 채널).
  - **09·10 라인차트·글로브·도넛 링** → 노출·성과 추이.
  - **07 다크 3칸** → 철학·약속 섹션(라이트 연속 끊는 리듬).
  - **05 iMessage 말풍선** → 광고 AI 챗봇.
- **⛔ 활용 = 변형 필수(그대로 복붙 금지)**:
  1. Vercel 카피·로고 → **우리 내용·로고로 치환**(브랜드·저작권).
  2. **반응형 작업 필수** — 현재 데스크톱 고정 px 좌표(원본 1:1, 1946 등)라 모바일 대응 없음.
  3. **금지 게이트 통과** — 순위·성과 보장, 파스텔·AI슬롭(실제 화면 재현은 2026-10-09부터 허용 — 진짜와 똑같이). Vercel 목업은 추상 UI라 대체로 안전하나 섹션별 점검.
- **디테일 기준**(사장님 "완벽 복제" 눈높이에서 배운 것): 커넥터 선·곡선의 **끝이 opacity 0으로 fade**(SVG `linearGradient` stroke), 라운딩·그림자·간격까지 원본 수준으로.

## 8.14 ★★ S2에서 확립한 목업·디자인 노하우 (2026-07-13 — S3 이후 모든 섹션·시안에 일괄 적용)

> S2 "복잡한 시작" 시안 작업에서 사장님과 확정. **Vercel 느낌의 정체 = 절제 + 또렷함 + 정밀 디테일.** 개별 장식을 더할수록 구려진다(사장님: "요청할수록 디자인이 구려진다").

1. **다크 태그 금지** — 라이트 다이어그램/섹션에 다크 pill 라벨(#1f2632 등) 박지 마라. 통일감 깨지고 무거워짐. 라벨은 배경 없는 텍스트로, 단 또렷하게(3항).
2. **선·커넥터는 또렷하게** — opacity 0.1~0.2대 옅은 선 금지. **최소 0.4+**, fade 그라디언트 중간 stop 0.9~1.0. **굵기(strokeWidth)는 유지, 진하기만 올린다.**
3. **글자는 또렷하게**(§8.9) — `font-light` 금지, **weight 400~500(medium)** + 진한 색(`text-body` 이상, 옅은 회색 본문 금지). + `text-wrap:balance`(줄너비 균형) + `leading-[1.5]`(촘촘). 폰트(Pretendard)가 아니라 굵기·색 문제.
4. **그림자 = 부드러운 다층** — SVG `feDropShadow` 한 겹(딱딱·촌스러움) 금지. Vercel식 다층: 넓은 ambient(dy 크게·stdDeviation 크게·opacity 0.08~0.1) + 미세 contact(dy 1·stdDeviation 1·opacity 0.07). CSS box-shadow도 다층.
5. **입체 = radial 채움 + 다층 그림자** — 노드 원 등은 흰 단색 대신 radial gradient(위 밝고 아래 진하게) + 4항 부드러운 그림자.
6. **배경 mask 분리** — 도트/그리드 배경에 가장자리 페이드 mask를 걸 때, mask가 콘텐츠(라벨·텍스트)에 걸리면 그라데이션 오염. 배경을 **별도 absolute 레이어**로 분리하고 콘텐츠엔 mask 안 걸리게.
7. **절제 = 빼기, 단 핵심은 또렷** — 태그·강한 그림자·장식을 얹지 말고 뺀다. 절제 ≠ 흐리게: 뺀 상태에서 글자·핵심 선은 또렷하게.
8. **모바일 우선** — 폭 360에서 잘 보이게(SVG viewBox 스케일 or 반응형). 대표님 검수 = 모바일.
9. **소스 = 분해→재조립**(§8.13) — Vercel 소스를 라벨만 바꿔 복붙 금지. 기법(여백·균형·색·그림자) 분석 후 우리 메시지로 재설계.
10. **★ UI가 아니라 "개념 그래픽"** (사장님 확정 2026-07-13 — 가장 중요) — 목업은 실제 앱 UI(버튼·리스트·폼·체크박스·탭 등 기능적 인터페이스) 흉내가 **아니다.** **텍스트(메시지)를 이해시키는 개념의 시각적 은유**(추상 도형·노드·흐름·다이어그램·일러스트)다. Vercel 목업의 정체 = 실제 UI가 아니라 **개념 일러스트**(예: fallback 다이어그램·방사형 노드는 진짜 화면이 아니라 은유). **"UI를 만들지 말고 개념을 그려라."** ⛔ 기능적 라벨(APP/YOU 등) 금지. ~~실제 버튼·컨트롤·앱 화면 재현 금지~~ (🛑 2026-10-09 사장님 폐기 — "실제 화면이 필요할 수도 있지, 낡은 규칙". 필요하면 실제 앱 화면을 **진짜와 똑같이** 재현한다. 첫 적용 = /content 채널 구간 인스타·쇼츠). (S2 얽힌 연결망 = 올바른 예 / S3 초안의 승인버튼·선택리스트 = UI로 빠진 오답.) 단 예외 = "실제 앱 스샷을 그대로 쓰는" 시안(진짜 화면 강조)은 별개로 허용.

## 8.15 ★★ 작업 플로우 정본 — 홈 PC 1차 완성(2026-07-15)으로 검증된 루프 (v2 전면 개정)

> 구 7단계(텍스트 구성안 승인·시안 다안 경쟁·서브에이전트 병렬 구현)는 **전부 폐기** — 실전에서 반려됨(사장님: 텍스트 구성안은 "머리에 안 그려짐" / 서브 위임 구현은 "자꾸 어설퍼" 반복 반려). **지금 플로우 = 메인(페이블)이 직접 만들고, 렌더 캡처로 대화한다.** 모든 페이지·섹션 작업은 이 순서.

### 진입 규칙 (자동)
- 페이지/섹션 작업 시작 = **§8.16(좌표계) + §8.17(톤앤매너 = **PC 기준**) + §8.18(**모바일 트랙 정본 = 모바일은 반드시 이것**) + §8.13(Vercel 소스) + 해당 카피(`lib/content/*.ts`)를 먼저 읽는다.** 코드부터 만들지 않는다. ⛔ PC 좌표계(§8.16)로 모바일까지 지으면 §8.18 대원칙(PC≠모바일) 위반.
- **★착수 전 3확인 선언 의무(2026-07-18 사장님 "왜 정본 안 읽나·홈/콘텐츠 확인 안 하나·소스 참고 안 하나" 격노로 확립 — /ads 히어로 실증: 이 규칙이 있는데도 건너뛰고 CSS 격자 흉내+임의 타이포 60px를 만들어 전면 재작업됨).** 시각물(히어로·섹션·목업) 착수 시 **첫 보고에 반드시 3줄 선언**: ①정본 = 이번에 Read한 조항(§번호) ②기준 실물 = Read한 홈/콘텐츠 컴포넌트 파일명(문법을 흉내가 아니라 그 파일의 실측값으로) ③소스 = 갤러리(§8.13/lab-sources)에서 고른 것. **선언 없이 만든 시각물은 무효 — 사장님이 이 3줄로 건너뜀을 즉시 적발할 수 있다.** 발송 전 = 실측 검증(좌표·색·애니 diff)+캡처 육안, "될 것"이라 단정 금지.

### 플로우 6단계 (사장님 확정 역할 분담)
1. **내용(카피) = 사장님+GPT가 정리** — 페이블은 확정 토씨만 사용, 카피 창작·수정 금지(재량 = 줄바꿈 위치·accent 스팬·명백한 중복 컷 정도. 컷도 보고).
2. **레이아웃 설계 = Grid Occupancy 칸 분할(§8.16-C)** — 칸 스케치 → 콘텐츠 행 수 **실측** → areas 좌표. 카피·구성이 바뀌면 행 수 재실측(§8.16 위반 시 "여백 과다/침범" 반려 실증).
3. **목업 = /lab/vercel(Clone01~10, §8.13) 소스에서 실측 발췌·재조립** — 해당 Clone*.tsx를 실제로 Read해 그림자·선·간격 값을 가져온다. ⛔ 리서치 없이 다이렉트 창작 금지(반려의 근본 원인).
   - **★목업 아이디어 기준(사장님 2026-07-18 확립 — /ads 애드캔버스 "완성 화면 2장 나열" 반려로)**: 스펙을 도움말처럼 나열 금지(텍스트 과다). 질문 순서 = ①우리 기술 중 **유저가 관심 가질 것 하나**를 고른다 ②그것이 **어떤 원리로 되는지 단계별로** 보여준다(예: 원클릭 광고 = URL 입력→상세페이지 이미지 자동 수집→크롭→AI 문구→그 URL이 랜딩→광고 완성). 목표 반응 = "오 대단하다·신기하다·해보고 싶다". 내부 로직 노출은 금지지만 **사용자가 겪는 변환 과정**은 목업의 주인공. 완성 화면만 툭 놓는 것 = 반려. 모든 섹션에 다 적용하는 건 아님(기술 소구 섹션 위주) — 섹션 착수 시 아이디어 2~3안 먼저 제시 후 택1.
4. **구현 = 메인이 직접** — ⛔ 서브에이전트에 통째 위임 금지. 매 변경: `tsc`(nugoona cwd + `${PIPESTATUS[0]}`) → **렌더 캡처 눈 확인**(타입 통과≠검증).
5. **사장님 캡처 확인 → 개별 수정 루프** — 캡처를 보내고, 스샷 지적 → 즉시 수리 → 재캡처. (전체 일괄 완성 후 개별 수정이 사장님 확정 진행 방식. 반려된 시안도 코드 보존 — 재시도 재료)
6. **확정 시 적립** — 규칙 → §8.16/§8.17 / 상태 → `.ngn-session.md` / 현황 → §1 / 금지 게이트(검사①③) 실행.

### 분업·비용 (사장님 2026-07-15 "꼭 필요한 것만 페이블")
- 구현·검수·디자인 판단 = 메인(페이블) 직접. 서브 = 대량 grep·기계 추출·병렬 조사만(Haiku 급).
- 대규모 팬아웃(벤치마크 리서치·적대 감사)은 비용이 크므로 **사장님께 먼저 제안** 후 진행.

### 렌더 캡처 노하우 (전부 실증)
- **형제 숨김 + 뷰포트 확대 + scroll 0 + 문서좌표 clip**이 기본. 스크롤 상태에서 캡처 = 백지.
- 🛑 **FadeUp 노출용 `[style*="opacity: 0"]{opacity:1!important}` 전역 주입 금지(2026-10-08 사고로 폐기).**
  접근성용으로 숨겨 둔 **Radix RadioGroup 의 `<input type=radio>`(`appearance:auto`)가 함께 깨어나**
  브라우저가 직접 그리는 **기본 라디오 동그라미**가 글자 위에 뜬다. `/start` 에서 이것을 진짜 결함으로
  오인해 하루를 썼다(원 중심 = 숨김 input rect 중심과 일치로 확정, 라디오만 숨기면 사라짐으로 재확인).
  전역 `border-radius:0 !important` 로도 안 막히고(네이티브 컨트롤이라 CSS 밖), `elementsFromPoint` 는
  `pointer-events:none` 을 건너뛰어 DOM 조사로도 안 잡힌다 — **눈으로만 보이는 유령이 된다.**
  ✅ 대신: ⑴스크롤로 페이지를 끝까지 훑어 등장 반응을 **실제로 소화**시킨 뒤 찍는다(권장, 실화면과 같다)
  ⑵꼭 강제로 켜야 하면 **대상 요소만** 지정한다(`input,select,textarea` 는 제외).
  **검사 도구가 화면을 바꾸면 그 도구로 본 것은 더 이상 증거가 아니다.**
- 큰 뷰포트에서 clip 좌표가 어긋나면(dpr 1.25 환경) 좌표 계산을 버리고 형제 숨김으로 대상만 남겨 찍는다.
- 요소 위치는 `getBoundingClientRect().top + scrollY`로 실측 후 클립.

### ★ Vercel 실측 기준 (§8.13 Clone01·08에서 추출 — 모든 목업의 기본값)
- **그림자 = 얇고 거의 안 보이게.** 큰 카드 `0 6px 16px rgba(0,0,0,0.04)` · 작은 요소 `0 1px 2px rgba(0,0,0,0.03)`. ⛔ **stdDeviation 큰 퍼지는 그림자·opacity 0.08+ 금지**(사장님 "단순·퍼지는 그림자" 반려의 실측 원인).
- **강조 = 그림자가 아니라 테두리 색·굵기·accent.** (Clone01 active 카드 = 1.5px 검정 border. 후광·큰 그림자로 강조하지 마라.)
- **커넥터 = SVG path + `linearGradient` stroke, 끝 opacity 0 fade**(offset 0=0, .15=1, .85=1, 1=0). strokeWidth 1.7~2.
- **카드/노드 = 흰 배경 + 1px #ECECEC 얇은 테두리 + radius 16~26.**
- **내용 표현 = 스켈레톤 바**(회색 #EBEBEB, radius 9.5)로 추상. (~~실제 UI 금지~~ 2026-10-09 폐기 — 필요하면 실제 화면을 진짜와 똑같이.)
- **배경 = #FAFAFA + 도트 그리드(30px) / 세로 가이드선(칸).** 배경은 별도 absolute 레이어 + edge mask(콘텐츠엔 mask 안 걸리게 §8.14-6).
- **★ 그리드 선 규칙(사장님 2026-07-14, S8 실증)**: ⛔ **선은 절대 텍스트·버튼을 관통하지 않는다.** 콘텐츠가 칸 안에 정렬되거나, 그 영역엔 선을 두지 않는다. **위 칸과 아래 칸의 세로선 위치가 달라도 되며, 달라야 할 땐 다르게 — "다르면서도 통일감"이 Vercel 그리드 디테일의 핵심**(전 높이 관통을 맹목 복제하지 말 것).

## 8.16 ★★★ NGN Grid Occupancy 시스템 (2026-07-14 확립 — 홈 히어로 사장님 "바로 이거야" 확정. /content·/ads 등 모든 페이지 작업의 좌표계 정본)

> **한 문장 정의**: 페이지 전체가 하나의 그리드 좌표계이고, 모든 콘텐츠는 셀 정수 개를 병합 점유하는 "칸(면)"이다. **칸 내부에 그리드 선 절대 금지, 선은 칸 경계에만.** 다음 페이지(누구나 콘텐츠 등)는 이 절부터 읽고 시작한다.

### A. 원칙 (사장님 확정)
1. **Grid Occupancy ≠ Grid Overlay.** 배경에 선을 깔고 콘텐츠를 겹치는 방식 금지. 불투명 배경으로 선을 가리는 것도 금지. **실제 CSS Grid 점유 구조**로 — 빈 셀과 콘텐츠 칸이 같은 grid의 아이템.
2. **콘텐츠가 점유한 칸 = 내부 선 없는 하나의 면.** 칸 둘레는 셀 경계선과 이어진다. 칸 내부 padding은 허용, 내부를 가로지르는 선은 금지.
3. **간격 = margin 금지, 빈 칸/빈 행이 담당.** 여백은 "남는 공간"이 아니라 "의도적으로 비워둔 셀".
4. **모든 섹션이 1×1 바둑판일 필요 없음** — 바둑판(checker)은 히어로의 표현. 다른 섹션은 같은 좌표에 스냅된 **큰 칸(병합 구획)으로 균형 분할**.
5. 전 섹션 동일 좌표계 — "같은 사람이 설계했다"는 느낌이 목표. 그리드가 보이는 게 목표가 아니라, 정돈의 이유가 그리드인 것.
6. **★빈칸 지양(사장님 2026-07-14, S2 실증)** — Vercel엔 "그냥 빈칸"이 없다. blank 칸은 **간격 목적(빈 행 1개·좁은 여백 열)만** 허용. 콘텐츠 없는 큰 blank 구획(좌우 2~3칸짜리 빈 판) 금지 — 그만큼 콘텐츠 칸을 넓히거나 2열 구성(좌 헤딩 레일+우 목업)으로 칸을 채운다. 텍스트를 줄였으면 칸도 같이 줄인다(칸 크기는 항상 콘텐츠 실측 기준).

### B. 구현 정본 = `components/layout/OccupancyGrid.tsx`
- API: `cols`·`rows`·`areas[{key, c:[start,end), r:[start,end), blank?}]`(1-based 그리드 라인)·`tone`(dark/light)·`checker`(미점유를 1×1 빈 셀로)·`mobile`(md 분기)·`render(key)`.
- **셀 정사각 = 컨테이너 `aspectRatio: cols/rows` + 행 `1fr`.** ⛔ `100vw` 기반 행높이 금지 — 부모 max-w(OuterContainer 1200)와 어긋나 세로 직사각이 된다(실증).
- 선 = 각 아이템의 `boxShadow`(우측 1px)+`borderBottom` — 병합 칸은 아이템이 하나라 내부 선이 물리적으로 없음.
- 12열 중심축 = line 7 → **짝수 span만 정중앙 가능**(홀수 span은 중앙 불가).

### C. 좌표 공식
- **PC = 12열**(셀 ~85~100px 정사각). 텍스트 칸: h1급 6칸 / 서브 4칸 / 버튼 4칸(2칸=버튼 197px이 꺾임 — 실증).
- **★모듈 정수배(벤치마크 실측 2026-07-15)**: Vercel = 대칸 540px = 소셀 135×4의 2단계 모듈, **임의 폭 금지**. 우리 = 12열 셀 기준 대칸 4셀·중칸 2셀 단위 우선.
- **★섹션 경계 여백 줄 필수(사장님 확정)**: 섹션과 섹션 사이 = **checker 1행(1×1 정사각 한 줄)**. 다크 전환부 = 라이트 checker 1행 + 다크 내부 상단 빈 행. Vercel 실측 = 선 2개 사이 얇은 무지대 + 그리드 밀도 리셋, 세로선은 관통 유지, 십자 마커는 섹션당 2~3개만.
- **★칸 행 수 = 콘텐츠 실측(카피가 바뀌면 반드시 재실측)** — 텍스트 감량 후 칸을 안 줄인 것이 "덩그러니" 불합격의 근본 원인(2026-07-15 검수 실증). 여백은 flex 중앙으로 때우지 말고 행 수로.
- **★긴 칸의 텍스트 정렬**: 목업이 긴 2열에서 텍스트 칸 세로 중앙 금지(뷰포트보다 긴 칸 = 텍스트가 화면 밖 — 실증). **items-start + sticky(top ~96px)** 또는 텍스트를 상부 행만 점유시키고 하부는 인덱스/하드웨어로.
- **★콘텐츠 인셋**: 텍스트·카드는 가이드선에서 **칸 폭의 ~13%(70px급)** 띄운다(선에 붙이면 무성의 — Vercel 실측 69~74px).
- **★텍스트가 항상 이긴다**: 목업 내부 글자는 고스트(아웃라인)·회색·모노로 눌러놓기. 텍스트·목업 겹침 배치 금지 — 3패턴만(좌우 / 상하 150px 분리 / 고정 레일+행).
- **★모바일 = 좁은 열 점유 금지**(풀폭 행 분할은 허용). 좁은 열(4~8칸)에 요소를 가두면 폭 축소·리듬 붕괴(반려 3회 실증: 6열 65px=텍스트 안 맞음 → 4열 98px=격자 성김 → 8열 좌우 빈 열=폭 깎임). 대신 **풀폭 행으로 나눠** 사이 가로선을 살린다. **히어로 확정(2026-07-16 갱신) = 모바일 6×7** + h1 c[2,6] r[2,4] / sub c[2,6] r[4,5] / cta c[2,6] r[5,6](좌우 c1·c6 checker). ⚠ 옛 "6×8·c[1,7]×r[2,8] 단일 병합 칸"은 폐기 → §8.18-H.
- 섹션 상단 빈 행 0~1, **하단 빈 행 없음**(사장님 "하단 그리드 한 줄 필요 없다").
- 칸 행 수는 계산으로 정하고 **렌더 실측으로 확정** — 칸보다 콘텐츠가 크면 이웃 섹션을 침범한다(S2 실증. grid 행은 1fr 고정이라 안 늘어남 = overflow).

### D. 함정 (전부 실증 — 재발 금지)
1. **SVG defs id 중복**: 콘텐츠를 모바일/PC 그리드에 중복 렌더하면 gradient/filter id가 겹치고, display:none 쪽이 참조돼 **선·채움이 통째로 사라진다**. → id에 uid 접미사(`renderFor(uid)` 패턴, S2 실증).
2. **배경 장식(빔 등)의 좌표는 그리드 라인과 동기화** — 그리드 열·행을 바꾸면 빔 루프 코너(1/cols·1/rows 계열)도 같이 바꿔야 한다(사장님 "빔이 그리드를 안 따라가" 실증).
3. **`[text-wrap:balance]` + 한국어 = 줄 머리 쉼표** 유발 — 여러 줄 문장엔 수동 `<br>` 또는 balance 제거.
4. tsc는 반드시 `nugoona/`에서 + `${PIPESTATUS[0]}`로 판정(다른 cwd의 "exit=0"은 head 파이프의 가짜 통과 — 실증).
5. 렌더 검증 시 `* {opacity:1!important}` 강제는 노이즈 레이어(0.035)까지 올려 **캡처가 실물과 달라짐** — 캡처용 강제는 FadeUp 셀렉터(`[style*="opacity: 0"]`)만.
6. **원(circle)을 그리는 두 가지 함정(2026-07-15 실증)**: ①전역 직각 리셋(`border-radius:0!important`)이 rounded-full·인라인 radius까지 덮음 → HTML 원은 **`.rounded-dot`(50%!important) 예외 유틸 필수** ②`preserveAspectRatio="none"` SVG 안의 circle은 화면비 따라 타원으로 찌그러짐 → 원은 SVG 밖 HTML로 분리.

### E. 텍스트 규칙 (2026-07-14 감량 확정과 세트)
- 서브 = **1줄**(15~17px 이상), 헤딩 동어반복·다음 섹션 예고 서브 금지. 14px 이하 문장은 각주 1곳(S8)만.
- **헤딩 자간 = -0.04em**(히어로 h1과 통일 — 사장님 "자간 더 타이트하게" 2026-07-15).
- **★"Vercel감" 처방 3종(2026-07-15 S2 실증 — 사장님 "왜 Vercel 느낌이 안 나지" 진단 결과)**: ①헤딩은 굵은 검정 한 덩어리(**줄 단위 회색 분리 금지** — 무게 분산의 주범). 회색은 "**볼드 검정 리드.** 회색 설명" **인라인 패턴**으로만 ②작은 하드웨어를 심는다 — ✦ 스파클+라벨(eyebrow), 다크 필 버튼, 십자 마커, 아이콘 칩 ③리드문은 헤딩급으로 크게(17~22px), 콘텐츠는 칸에 꽉 차게. 2열 문법 = 좌 레일(✦라벨+헤딩) / 우 = 상단 리드 행 + 아래 목업.
- **다이어그램 선 = 매우 얇은 완전 검정**(#171717, 0.9~1.3px + 양끝 fade. 회색 굵은 선 = "흐릿하다" 반려 실증 2026-07-15). 중심 심볼 = 다크 원 + 흰 라인 아이콘(**아이콘은 lucide 등 검증된 것만 — 자작 path 반려**). 파스텔 배경 원 금지(§7-7과 동일). 미세 애니 문법 = accent 실 dash 흐름·노드 부유(±3px 위상차)·중앙 ripple(reduce-motion 시 정지).
- **⛔ 흐린 회색 테두리·텍스트 + 뿌연 그림자 조합 금지(사장님 2026-07-15 "최악")** — 태그·칩·뱃지는 **잉크(#171717) 테두리 1px + 무그림자**. 강조 = 테두리 색/굵기(accent 1.5px)로, 그림자로 하지 않는다(§8.14와 동일 원리).
- **⛔ 십자(+) 마커는 그리드 선이 맞물리는 교차점에만(사장님 2026-07-15 "볼트마냥 아무데나 금지")** — 칸 안쪽 코너에 인셋 장식으로 박지 않는다. 섹션당 2~3개, 경계 교차점 한정(Vercel 실측과 동일).
- **★라이트 배경 = 순백(#ffffff) 확정(사장님 2026-07-15, 시험 3안 전부 반려)** — ①전면 #eaeaea ②전면 회색+행 선 풀폭 관통 ③목업 칸만 #eaeaea 캔버스, 셋 다 실렌더로 보여드렸으나 반려("정말 이상하다 그냥 흰색으로"). 배경 회색 아이디어가 다시 나오면 이 이력부터 안내할 것. 그리드 선 정본 = #ECECEC 유지.
- **⛔ 목업(폰 캡 등) 하단 페이드 금지(사장님 2026-07-15 "아래 선이 있기 때문에 모든 모바일 캡은 페이드가 필요가 없어")** — 칸 하단 경계선이 마감을 담당하므로 mask 페이드 대신 **overflow hidden 하드 컷**. 페이드 = 뿌연 처리 금지 원칙과 동일 계열.
- **S4 제품 블록 = 좌 텍스트 / 우 목업 세로 3단(2026-07-15 최종 — "일단 예전처럼 좌우 레이아웃으로" 회귀 확정)** — "1,2,3 한 줄 3열 + 텍스트 풀폭 행" 시안은 변형 5종(좌우 2열→중앙 스택→다크 바→좌측 정렬)까지 시도 후 전부 회귀. 다만 그 과정의 **개별 확정은 유지**: ①텍스트 쪽 01/02/03 인덱스 레일 = 목업 StepHead와 중복 금지(삭제) ②S41/S42의 part prop(단계별 렌더)은 코드에 보존(재시도 시 재사용) ③part 렌더 시 StepHead는 first 처리(구획 border 남기면 칸 상단에서 "붕 뜬다") ④로고 SVG 라운드 제거(rx 40→0, 직각 시스템 정합).
- **패널형 병합 칸(다크 패널 등) = 렌더 루트에 h-full 필수** — 없으면 콘텐츠 높이만큼만 차서 칸 아래 빈 띠(S8 "아래는 두 칸" 반려 실증).
- **SpacerRow thin** — **PC** = 세로선 없는 얇은 무지대(높이 clamp 26~42px)+borderBottom만(borderTop까지 주면 직전 그리드 하단선과 겹쳐 두꺼워짐 — 실증). ⚠ **모바일은 07-16부터 thin도 칸칸이**(§8.18-I) — 단 CTA 위처럼 붕 떠 보이는 자리만 `noMobileGrid`로 얇은 줄.
- **다크 = 선언부(히어로·철학·CTA)에만(사장님 2026-07-15 "위아래 모두 다크라 이상")** — 정보성 섹션(업데이트 로그)은 라이트. S7 라이트 전환 확정(제품 점 색도 라이트용 #0070f3/#0aa5c9). 다크 3연속 금지.
- **S3 하단 = 히어로 점유 문법 확정(2026-07-15, ★채팅 07-16 갱신)**: 채팅 = **밝은 dotLayer 카드** 5열×4행(⚠ 구 다크 패널 `bg-[#0a0a0a]`은 07-16 GPT PM으로 폐기 → `#FAFAFA`+도트+떠있는 그림자 = 위 궤도와 통일, 질문 말풍선 accent) / 화살표 = lucide arrow-right 아이콘만 1열×2행(박스·그라디언트 선 반려) / 헤딩 4열×2행 / 미점유 = checker. **모바일은 `MobileOurWay`(§8.18-F)**. S6 결론 = Clone05 하드웨어(코너 교차점 십자 2 + 상단 잘린 다크 바. 칸 안 세로선은 반려).
- **★제품 로고 확정(사장님 D안 택1 2026-07-15)**: **NC = 플랫 다크 네이비(#0c2a5c)+파랑 글자(#4d9fff) / NA = 플랫 accent 파랑(#0070f3)+흰 글자** — 명도 반전으로 구분("NA가 NC와 너무 비슷" 해소). ⛔그라데이션 금지(파비콘 겸용), 직각(rx 0). 캐시버스터 = nc v16·na v20(로고 수정 시 반드시 버전 업). **로고 크기 = 작게 쓰지 말 것** — 철학 decl 76px·자산 셀 56px·분기 플로우 84px("한 칸 꽉 채워도 돼").
- **eyebrow 소제목 = Inter Tight 대문자 + 자간 0.14em(13px, 사장님 2026-07-15)** — PHILOSOPHY·ASSET·OUR WAY·UPDATES·NUGOONA COMPANY 전 섹션 통일.
- **⛔ 목업 내부 리스트 하단 페이드도 금지(자산 블로그 컬렉션 실증 2026-07-15 "아래 페이드 넣지마")** — 폰 캡 페이드 금지와 동일 원리, 카드가 창 하단에서 그대로 끝나게.
- 텍스트 구조 다양화: "헤딩+서브" 천편일률 대신 ①헤딩+목업 무서브형 ②큰 원라이너 선언(철학 섹션) ③구조화 행(S7 로그 문법).

## 8.17 ★★★ 홈 PC 1차 완성 = 톤앤매너 정본 (2026-07-15 사장님 확정 — "여기에 모든 전체 톤앤매너와 내 모든 니즈가 있어")

> 이후 모든 작업(/content·/ads·/pricing·/start)의 **PC 기준 = 홈 PC 실물 렌더**(`localhost:3131/` PC) / **모바일 기준 = §8.18(홈 모바일 완성 실물, 2026-07-16 — OUR WAY·자산·Hero·여백 칸칸이 전부 모바일 전용 컴포넌트로 완료)**. 문서와 실물이 어긋나면 실물이 이긴다. 새 페이지 = §8.15 플로우 + §8.16 좌표계 + **§8.18(모바일)** + 이 절 팔레트.

### 확정 팔레트·문법 (홈 전 섹션에서 실증된 값만)
- **색 3개뿐**: 순백 `#ffffff` + 잉크 `#171717` + accent `#0070f3`. 배경 회색 전면 금지(시험 3안 반려 이력 §8.16-E). 목업 내부 보조 회색은 §8.9 허용값만.
- **다크 = 선언부에만**: 히어로·철학·CTA. 정보 섹션(로그·목업)은 라이트. **다크 3연속 금지**. ⚠ 구 "S3 다크 채팅 칸"(포인트 다크 1곳)은 07-16 **밝은 카드로 폐기**(§8.18-F) — /content에서 "포인트 다크 칸" 복제 금지.
- **선 = 1px 고정**: 라이트 `#ECECEC` / 다크 `rgba(255,255,255,0.12)`. 다이어그램 선만 hairline 완전 검정(#171717 0.9~2px)+양끝 fade.
- **로고**: NC = 플랫 네이비 `#0c2a5c`+`#4d9fff` / NA = 플랫 accent `#0070f3`+흰 글자(명도 반전 구분). ⛔그라데이션·라운드 금지(파비콘 겸용). **작게 쓰지 말 것**(철학 76px·자산 56px·분기 84px급).
- **eyebrow** = ✦ 스파클 + Inter Tight **대문자** 13px `tracking 0.14em`(PHILOSOPHY·ASSET·OUR WAY·UPDATES·NUGOONA COMPANY).
- **태그·칩·뱃지 = 다크 필**(#171717 + 흰 글자), active = accent 배경. ⛔흐린 회색 테두리+뿌연 그림자.
- **마감 = 선, 페이드 금지**: 폰 캡 하단·리스트 하단 페이드 전면 금지 — 잘림 마감은 경계선/밀착 구획선(중앙 도톰 fade 허용)이 담당.
- **여백 = SpacerRow**: PC = checker 1행 / thin 얇은 띠. ⚠ **모바일은 07-16부터 여백 전부 칸칸이**(§8.18-I — `gridline` 톤 #d8d8d8·배경 #fafafa·`noMobileGrid` 예외).
- **십자(+) = 그리드 교차점에만** 섹션당 2~3개. 아이콘 = lucide 등 검증된 것만(자작 path 반려 이력).
- **호칭 = "고객님"**(구 "사장님" 전면 교체 2026-07-15). 제품명 = "누구나 콘텐츠"/"누구나 광고" 정식 표기.

### 홈 최종 구성 스냅샷 (1차 완료 — 상세 컴포넌트 = §1 표)
히어로(다크 바둑판, PC h1 r3·sub r4·cta r6) → 회사 정의(대형 선언+분기 플로우) → 제품 블록×2(좌 텍스트 sticky/우 목업 세로 3단) → 철학(다크, 좌 헤딩/우 선언 2칸) → 자산(셀 2열+Clone05 결론 배너) → OUR WAY(궤도+**밝은 채팅 카드**+화살표 셀) → 업데이트(라이트 로그) → CTA(다크 패널 좌6/우4, 디바이더=그리드 정합). ※모바일 트랙 = §8.18(별도 컴포넌트).

### ★/content S1 히어로 확정 = 스타일 락 (2026-07-17 — S2~S11 제작의 상속 기준)
> 히어로 반려 ~10회 끝에 확정된 취향. **이 절을 안 읽고 /content 섹션을 만들면 같은 반려를 반복한다.**
- **다크 시각물 = 톤온톤**: 다크 배경(#0a0a0a) 위 시각물은 순백 블록이 아니라 **한 층 밝은 다크**(타일 #161616 + 글자 white/85 + 줄눈·보더 white/8). 순백 덩어리 = "표(엑셀)" 인상 반려. Linear 층 문법.
- **accent = 드문드문**: 포인트 컬러(#4d9fff 다크/# 0070f3 라이트)는 요소의 ~1/9만(인덱스 분산·결정적). 광고 문구성 강조("내 스토어가 여기 보입니다") 금지 — 콘텐츠는 콘텐츠답게.
- **블러 전면 금지 재확인**: box-shadow blur·뿌연 inset 전부 반려. 입체 = ①다크 톤온톤 대비 ②blur 0 하드 단차 ③1px 보더. **예외 = 다크 위 텍스트 딥섀도**(검정 그림자 = 깊이로 작동, 하드 1px + blur ≤8 소프트 1겹만).
- **제품 표기 = NC/NA 로고 + 제품명**(✦아이콘·한글 라벨 금지). PC 40px·모바일 32px.
- **애니 루프 = seamless 필수**(Marquee = 콘텐츠 2회전 + gap 통일). "덜컥" = 반려. 펄스류 마이크로 반짝임 반려("이쁘지 않다").
- **모바일**: 텍스트 = c[2,6] + 좌우 checker + `darkFaint`(선이 글자와 안 싸움) / 콘텐츠·시각물 사이 **여백 행 필수** / h1 24px·자간 -0.02 / CTA `.rounded-pill`. ⚠ §8.18 좌표는 **취지(기기별 최적화)가 값보다 우선** — 카피 길이 다르면 칸도 다르게(3줄 깨짐 반려 실증).
- **작업 방식(사장님 확정 2026-07-17)**: **모바일 우선 제작 → PC 확장** / 개별 목업 캡처 루프 폐지 → **묶음(2~3섹션) 일괄 제작** → 셀프 감독관(§8.10) 통과 후 사장님 O/X / 실화면 필요 지점은 모아서 한 번에 요청(F:\github 타 프로젝트 실코드 차용 허용).

### 사장님 니즈 원문 (판단이 흔들릴 때 기준)
- "유저가 내용을 보기에 불편함이 없어야 해" · "빈칸 지양 — Vercel은 그냥 빈칸이 없어" · "텍스트가 항상 이긴다"
- "흐린 회색 + 뿌연 그림자 최악. 앞으로도 없어야 해" · "십자는 그리드가 맞물리는 데만"
- "싹뚝 잘린 것처럼 보이면 안 돼 — 선을 붙여" · "구분선이 위 칸칸이 세로선과 맞아야 해, 연결성 있게"
- "다르면서도 통일감"(그리드) · "목업은 칸칸이 사이에 쏙 들어가야 해" · 로고는 "칸칸이의 한 칸으로 꽉 채워도 돼"

## 8.18 ★★★ 모바일 전용 레이아웃·규칙 정본 (2026-07-15 사장님 확정 — "PC랑 모바일은 레이아웃이 달라야 한다")

> ★대원칙: **모바일 = PC를 세로로 쌓은 게 아니라 별도 설계.** 페이지마다 PC 트랙 + 모바일 트랙 따로. PC를 그대로 세로 스택하면 가독성·이해도 붕괴(2026-07-15 실증). ⛔ **모바일 수정이 PC에 영향 주면 안 됨** — `md:hidden`/`max-md:` 전용 경로 또는 CSS 미디어쿼리(**md 브레이크 = 900px**, globals.css `--breakpoint-md`)로 PC 무력화. §8.17의 "싹둑 잘리면 안 돼(선 마감)"는 **PC 규칙**이고, 모바일 캐러셀 홀더(아래 B)는 의도된 잘림이라 예외.

### A. 모바일 목업 = 깨지는 단계만 전용 재제작
- 판정 기준 = **"좁은 모바일 세로 카드에서 가로 배치가 깨지는 단계만" 재제작**(제목/본문/썸네일이 안 맞아 박살나는 것). 실제 재제작 = **NC02 문서(세로 글카드)·NA03 챗봇(세로 대화)** 둘뿐(`MobileStepMocks.tsx`의 `NcMobileMock`/`NaMobileMock`이 그 part만 교체, 나머지는 `S41/S42` part 그대로 재활용). ⛔ "기기 목업만 재활용"이 아님 — 폰(NC1·NA1·NA2)뿐 아니라 **검색 브라우저(NC3, 평면 UI)도 세로로 길어 카드에 맞으므로 재활용**.

### B. 제품 캐러셀 (TwoAppsRail 모바일 = 애플 스토어 카드 문법)
- 가로 스냅 캐러셀 + **peek**(다음 카드 살짝 노출, `basis-[80%]`) + **스텝 진행 바 + 영문 카운터(`01/03`)**(활성 = 바가 26px로 늘어남. 현재 카드 = 카드 중심이 뷰포트 중심에 최근접으로 판정 — 마지막 카드도 정확. 스크롤위치 계산은 peek 때문에 어긋나 폐기).
- 카드 = **흰 배경**(섹션 배경과 통일) + **큰 라운딩 28px**(`.rounded-card` — 전역 직각리셋 `*{border-radius:0!important}` 예외를 globals.css에 추가) + 상단 STEP 라벨·제목 + 하단 목업. **고정 높이 `h-[452px]`, 목업영역 `top-[112px]`~하단, 캐러셀 세로 패딩 `py-5`(=20px, 아래 그림자 규칙의 분모).**
- **★홀더("홀더에 카드 꽂힌" 느낌 = 사장님 기준 NC1 폰 카드)**: 목업이 카드보다 세로로 커서 **하단이 카드 경계에서 잘림**. data-mock `absolute inset-x-0 bottom-0 max-h-full overflow-hidden`.
  - 긴 목업(검색·문서): `max-h-full`이 상단 보호(검색창·앱바 안 잘림 = "3번째 카드 내용 잘려" 방지) + 하단만 잘림.
  - 짧은 목업: 하단 정렬. ⚠ NA 폰 목업처럼 너무 짧으면(258~272px) 위 여백 과대 → **카드 높이를 목업에 맞춰 낮추거나** 목업 세로 확장으로 균형(진행 중 미결).
  - 카드 하단 **홀더 립**: 카드 배경 띠(`h-6`=24px)를 목업 앞(z-20) + 경계선(`inset 0 1px 0` holderLine)으로 "꽂혀 들어간" 마감.
- **카드 독립 = border + 옅은 그림자**. ⚠ 그림자 강하면 캐러셀 `overflow-x:auto`(CSS상 y도 clip)에서 잘려 **"층"(끊긴 선)** 생김 — **그림자 퍼짐(blur+spread) < 캐러셀 세로 패딩(py)**. (실증: 44px 그림자 vs py 20px → 24px 잘림.)
- **배경 = 섹션(블록) 배경을 위/아래 섹션과 통일**(흰). 카드-섹션 구분은 회색 배경이 아니라 그림자로(회색 블록 = 다음 섹션과 안 통일 반려).

### C. 콘텐츠 잘림 마감용 페이드 금지 (§8.17 계승·강화, PC·모바일 공통)
- ⛔ 금지 대상 = **"콘텐츠가 흐려지며 사라지는" 잘림 마감용 mask/페이드**(리스트 하단 fade, 목업 하단 그라디언트 등). 사장님 "페이드는 뭐든 다 싫어". 잘림 마감 = 홀더(하단 크롭) 또는 스켈레톤.
- ✅ **예외(살아있는 지시 — 지우지 말 것)**: 장식용 **선 그라디언트 fade** = BranchFlow 수평선·S곡선 양끝 fade, StepHead 구획선 radial 양끝 fade(사장님 "중간 굵고 양옆 얇게"), 배경 도트 edge mask(§8.14-6). 이건 "콘텐츠를 흐리는 페이드"가 아니라 선/배경 마감이라 유효.
- 검색 목업의 "다른 결과"("동네 산책 기록" 등) = **회색 스켈레톤 바**(mask 페이드 대신). 내 가게 글만 실제 = "다른 결과 사이에서 내 가게가 보인다". (`S41SearchScene` part3, PC·모바일 공통 경로.)

### D. 모바일 헤딩 리빌 (라인 마스크 — 이노션 실측 이식)
- overflow-hidden 줄상자 > 자식(translateY 120%→0), `0.6s cubic-bezier(0.17,0.84,0.44,1)` + 줄당 0.15s 시차. 스크롤 진입 IntersectionObserver(once) → `data-reveal` wait→in. CSS는 globals.css `.reveal-line`. **PC(md 900px↑)는 미디어쿼리로 무력화**(정적 텍스트).
- ⛔ **`prefers-reduced-motion:reduce` 예외 금지** — 사장님 폰이 절전(reduce) 모드라 예외 두면 아예 안 보임(실증). 0.6s 마스크 이동이라 reduce에도 무해.

### E. ★실기기 캡처 파이프라인 (이 PC = OS 배율로 왜곡 → 아래가 유일 정확. 매번 사장님 스샷 불필요)
1. CDP `Emulation.setDeviceMetricsOverride` `{width:390, height:H, deviceScaleFactor:2, mobile:true, screenWidth:390, screenHeight:H}` — **screenWidth/Height 안 주면 innerWidth 312로 나옴**.
2. `document.documentElement.style.scrollBehavior='auto'` 강제 후 `window.scrollTo({top, behavior:'instant'})` — smooth면 캡처 시점 위치 안 맞음(scrollY 0 유지).
3. `page.screenshot({path: 절대경로})`. Read로 눈 검증.
- CDP `clearDeviceMetricsOverride`가 세션 중복 시 안 먹음 → 데스크톱 값 명시 덮어쓰기.

### F. OUR WAY 모바일 = 한 흐름 (`MobileOurWay`, 2026-07-16 완성)
- PC(`S3GraphicA` OccupancyGrid) 불변, 모바일은 `MobileOurWay` 단일 컴포넌트로 교체(`md:hidden`). 흐름 = 헤드라인 → 궤도(`MobileOrbit`) → 세로 이음선 → **선언 텍스트바** → 세로 이음선 → 채팅(브라우저 창).
- **`MobileOrbit` = PC `OrbitScene`과 동일 *시각 문법***(사장님 "PC랑 똑같이, 다르게 할 이유 없다"): 다크 칩(#171717·진행중 accent)·우상단 완료 뱃지·중앙 앱에서 각 칩으로 accent **빔**(처리 중 드로잉→완료 잔광)·동심 궤도·완료 시 중앙 accent 원+전체 체크. **애니 1회만**(무한 루프 X → 완료 고정), `useInView` 트리거. 좌표 320×246, 긴 라벨은 부채꼴 x 안쪽으로.
  - ⚠ "동일"은 시각 문법뿐 — **라벨 6개는 모바일 신규**(광고 계정 연결·픽셀·전환 추적·캠페인 생성·예산·기간 설정·타깃 설정·소재 규격 확인). PC `OrbitScene`은 옛 6개(계정 연결·예산 설정·타겟 설정·소재 확인·문구 생성·검수)로 **다름**. **아이콘 제거("태그 앞 아이콘 지저분, 떼")는 모바일만** — PC 칩은 `NodeIcon` 아이콘 **유지 확정**(사장님 판정 2026-07-16: PC는 화면 넓어 여유). PC/모바일 궤도는 이 부분(아이콘)만 다름.
- **세로 이음선** = S9 차용: accent **단색** 선(rgba 0.55·2px) + glow 도트(`animate-pipeline-flow`). ⛔ 양끝 fade 금지(도형과 "맞물리게" 단색). 접점 노드(동그라미) 시도→반려("이게 뭐야")→제거.
- **선언 텍스트바** = **직각**(라운드 제거, 사장님 2026-07-16) + **그림자 없음**(Vercel DevCycle 카드 = 옅은 1px 테두리만). 폰트 = 헤드라인과 동일 크기.
- **채팅 = 검은 박스 금지**(GPT PM "검은 박스가 먼저 보이면 안 됨"). 밝은 브라우저 창(신호등 3점 `#ec6a5e/#f4bf4f/#61c454` + "광고 도우미" chrome) + 말풍선(사용자 accent 우/도우미 회색 좌). 직각. **PC 채팅도 검은 패널→밝은 dotLayer 카드**로 통일(§8.17 색 3개, 콘텐츠 우선). ⛔ 성과 숫자 금지.
- 선언 문구 = "고객님은 광고 소재와 성과만 보세요"(⛔"사장님" 금지 → "고객님").

### G. 자산 모바일 = 타임라인 이음선 (`MobileAssetTimeline`, 2026-07-16)
- 사장님 택1(안 A). 헤드라인(좌측) → 왼쪽 세로 **spine** + 두 제품 accent 노드 분기 → 각 제품 = 텍스트(로고+이름+메시지) 좌 + **미니 목업 우**.
- **미니 목업 = 작게(132px) + 라운드·그림자 없음**(사장님 "크게 보일 필요 없다" + "이상한 그림자"=blur 뿌염 → 테두리만·각짐). 콘텐츠=미니 브라우저창 글 2장 / 광고=미니 리포트 카드. 좌우 배치에서 목업 키우면 텍스트 눌림 → 작게 유지가 정답.
- 결론 3줄 = "서비스 이용이 종료되어도 / 발행한 콘텐츠와 광고 계정, / 운영 기록은 그대로 남습니다"(**중앙 위치·왼쪽 정렬** = `inline-block text-left`).

### H. Hero 모바일 = 밀도 압축 (`HeroB`, 2026-07-16 GPT PM)
- 그리드 **9행→7행**(`aspectRatio=cols/rows` → 높이 585→455px). 콘텐츠 = h1 c[2,6] r[2,4] / sub r[4,5] / cta r[5,6](좌우 c1·c6 checker) → 위 1행(r1)·**아래 2행(r6·r7)** 여백, H1+Sub+CTA 한 덩어리. (완전 대칭 아님 — 아래가 1행 더 넓음.)
- ⚠ **빔 루프 좌표(MOB_TL 등)는 M_ROWS에 묶임** — 행 변경 시 y(1/7·6/7) 반드시 동기화(§8.16-D2).
- Grid 선 흐리게 = **`darkFaint` 톤(rgba 0.06)** — 콘텐츠 우선(GPT "Grid보다 텍스트 먼저").
- H1 = `max-md:text-[24px]`(25→24) + 자간 완화(-0.04→-0.02em)로 답답함↓(**크기 아닌 자간이 밀도감 핵심**)·한 줄 유지(`whitespace-nowrap`). Sub 15px·밝기↑(#e4e4e4).

### I. 모바일 여백 = 칸칸이 (`SpacerRow`, 2026-07-16)
- 섹션 사이·의미 없는 큰 여백 = 히어로식 **칸칸이(checker) 일렬**로 채움(빈 여백 금지, 사장님 "칸칸이를 일렬로 붙여"). PC(§8.16 checker/thin 두 문법)와 별개 모바일 전용(6칸).
- **배경 #fafafa + 선 #d8d8d8**(`gridline` 톤) — #fafafa에 #ECECEC(대비 14)는 안 보임 → d8d8d8. 흰 네모 없이 **선만** 도드라짐(사장님 "옅은 회색에 선만"). 위 선 = `border-t`로 보장(첫 행 위 선 없는 문제 교정).
- **`noMobileGrid` 예외** = 칸칸이가 공간을 벌려 "붕 떠" 보이는 자리(CTA 위 등)는 칸칸이 빼고 얇은 줄.

### J. 모바일 공통 디테일 규칙 (2026-07-16)
- **직각 통일** — 라운드는 살아있는 예외 클래스(`.rounded-dot`·`.rounded-card` 28px 캐러셀·`.rounded-pill` 버튼)만, 나머지는 전역 `*{border-radius:0!important}`로 직각. 사장님 "직각으로" 지시 = 예외 클래스 제거. (`.rounded-bar` 16px는 07-16 선언바·채팅 직각 전환으로 사용처 0 → globals.css 정의 **삭제 완료**.)
- **그림자** = 두 갈래. ①**선언 텍스트바·평면 텍스트 카드 = 제거**(옅은 1px 테두리만, Vercel DevCycle 카드). ②**카드 목업 = 실측 토큰** `0 1px 3px rgba(15,23,42,0.06), 0 4px 10px rgba(15,23,42,0.08)`(캐러셀 카드·미니 목업 계열, **blur ≤10 · 알파 ≤0.08**). ⛔ **뿌연 대형 그림자(blur 20+·광역) 금지**(반복 격노). 채팅 브라우저 창 = `0 4px 14px …0.07`(blur 14 — 2026-07-16 사장님 판정으로 수리 완료).
- **버튼** = `.rounded-pill` + 컴팩트. 캐러셀 CTA는 캐러셀에 **붙여**(mt 최소 → 카드 하단과 ~24px) + 가운데 정렬 = "이 캐러셀 기능을 체험" 소속감(GPT PM).
- **배경 회색 = #fafafa**(Vercel Surface2 실측 = rgb 250,250,250). 흰 카드 대비로 가독성.

### K. 작업 플로우 (모바일, 2026-07-16 검증된 루프)
- **`/lab/<name>` 시안 페이지에서 먼저 만들어 캡처 자가검증 → 확정 후 홈 이식**(별도 컴포넌트). 홈 특정 섹션(OUR WAY)은 무한 애니+`whileInView` 조합으로 **캡처 blank** → 동일 스타일 `/lab`로 대체 검증.
- **GPT PM 피드백 루프** = 사장님이 GPT로 밀도·시선 흐름·브랜드 톤 디렉션 → 미세 조정(**레이아웃 유지 / 카피 유지 / 디자인 언어만 통일**). 목표 = "적게 말하지만 오래 보게 되는 화면"(Linear·Vercel).

### L. 모바일 스케일 정본 (2026-07-16 실측 — /content 재현 기준, 흩어진 값 표로 확정)
- **컨테이너 골격** = `mx-auto max-w-[390px]` + 섹션 래퍼 `px-6`(모바일 공통).
- **섹션 세로 리듬** = `py-20` 기본(OUR WAY·회사정의 — 코드 주석 "모바일 리듬 표준 py-20 사장님 확정"), 제품 캐러셀만 `py-24`. ⚠ **§8.9 모바일 절의 "py-12~14"는 이 값(py-20)으로 대체**(옛 기준, /content는 py-20).
- **헤딩 스케일** = 섹션 h2 **26~27px** / 카드 h3 **22px** / 히어로 h1 **24px** / 자간 -0.035~-0.04em.
- **eyebrow** = 모바일 `text-[11px] tracking-[0.18em] text-[#9aa0a6]`(§8.17 PC 13px·0.14em과 별개 = **모바일 정본**).
- **사진 정책 = 빈 슬롯 확정**(사장님 판정 2026-07-16, §8.7-E 유지): 신규 목업 사진 = **엔바토 정품 조달 전까지 빈 슬롯/회색 스켈레톤**. ⛔ /content 신규 목업은 이 원칙(사진 자리 = 임시 스톡 사진 금지 → 스켈레톤). ⚠ 홈 실물(`MobileAssetTimeline`·`MobileStepMocks`·`S6AssetStacks` POSTS)이 현재 언스플래시 사용 중 = 엔바토 조달 시 교체 대상.

## 9. 변경 이력
- 2026-07-16: **§8.18 F~K 신설 = 모바일 홈 완성 노하우 정본**(사장님 "모바일 홈 끝 → 정본 정리 후 /content 빌드"). OUR WAY 한 흐름(`MobileOurWay`)·자산 타임라인(`MobileAssetTimeline`)·Hero 7행 압축·모바일 칸칸이 여백(`SpacerRow` gridline·noMobileGrid)·직각/그림자/버튼 공통 규칙·/lab→홈 이식 플로우·GPT PM 루프. 검은 채팅 패널→밝은 dotLayer 카드(PC·모바일 통일). **페이블 적대 검수 반영 예정.**
- 2026-07-15: **§8.18 모바일 전용 레이아웃·규칙 정본 신설**(사장님 "PC랑 모바일은 레이아웃이 달라야 한다" + 모바일 규칙 정본 저장 지시). 모바일=PC 세로스택 금지·전용 목업 재제작·제품 캐러셀(애플식 카드·홀더·흰배경통일·그림자 클립 주의)·콘텐츠 페이드 금지(장식선 fade 예외)·리빌·실기기 캡처 파이프라인. **페이블 적대 검수 반영**(C절 페이드 금지 범위 한정, A절 재활용 기준 정정, 카드높이 452·진행바 명칭 보강, 코드 주석 basis-82%→80% 교정).
- 2026-07-07: 초안 작성(현행 5페이지·토큰·모션·규칙 파악, 리빌드 방향은 미정 자리만 마련).
- 2026-07-07: **재사용 자산 인벤토리(§8.5)** 추가 — 컴포넌트 50개 전수 분류(범용/목업/하드코딩). 설계 시 매핑 우선.
- 2026-07-08: **§8.6 원래 홈 디자인 해부(재건 설계도)** 추가 — 사장님 지시("하나도 빼지 마라"). 점·선·면·그리드(HeroAurora 12×8 격자·크로스헤어·브래킷·노이즈·빔)·타이포/줄바꿈(수동 `<br>` 균형·`.comma`·accent 스팬·leading 촘촘)·목업 밀도(텍스트카드 금지=실제 제품화면)·원래 10블록 인벤토리·재건 매핑 명문화. 리빌드가 평범해진 원인=이 규칙 누락으로 진단. **+ F~I 확장**(사장님 2차 지적 "홈 외 섹션도 하나도 빼지 마라"): /features(FeatureRow·4스텝 애니목업)·/about(CounterUp 통계)·/pricing·/start(gradient·select) 전수 + G 쇼케이스 리치패턴(SVG 파이프라인·매거진 AI리포트·iPhone·데이터테이블·라인차트) + H 공통 마이크로(번호칩·AIAnalysis·타이틀패널·탭·springPop 등) + I 재건규칙.
- 2026-07-10: **§8.0 홈 방향 전환** 추가(사장님 확정) — 원본은 **디자인 언어만 차용**(§8.6 A~I 유효), 섹션구성·카피·FAQ·후기는 폐기. **홈 7섹션 신설계**(S1 히어로~S7 CTA, 6섹션 원본 컴포넌트 직접 재사용, S5=신규 콘텐츠 목업 대안A). 옛 '홈 5블록'·§8.6-D 판정 방향 대체. 상류 전파 = CONTENT §0·랜딩-아이디어로그 배너.
- 2026-07-10(2차, **문서 통합**): 페이블 적대 감사 결과 반영. ①**§1을 "구현 현황 정본"으로 전면 교체**(라우트 9개 실측·홈 실물 vs §8.0 차이 명기 — 사장님 판정: 홈은 §8.0대로 미구현이니 그대로 만들 것 / /ads 히어로 정본은 `lib/content/ads.ts`). ②**§7-7 "파스텔·AI 냄새 금지" 신설** — 이 규칙이 홈페이지 디자인 정본에 한 줄도 없고 PPT 제안서·업로드 앱 스펙에만 있던 것을 발견해 이식. ③**§8.7 신설** — 07-10 확정 규칙(S9 목업 문법·카드 나열 금지·정보 위계·텍스트 감량 4조·엔바토 사진 정책·`/styles` 프로세스·Claude Design 시점)이 전부 `.ngn-session.md`에만 있어 컴팩션 유실 직전이던 것을 이관. ④§3에 `--font-quote`(명조 인용) 추가 + Tailwind v4 `@theme` 변수 증발 함정 기록.
- 2026-07-10(3차, **페이블 재검 반영**): 위 2차 작업이 스스로 만든 오류를 교정. ①**§1 컴포넌트 사용 현황 실측 재작성** — 2차에서 07-07 옛 목록을 그대로 둬 `DashboardGlimpse`·`ManageGlimpse`·`ReportGlimpse`·`StoryStep`·`BrowserFrame`을 "미사용"으로 잘못 표기(전부 홈 실사용). `home.ts`도 "promise만"이 아니라 `hero`·`cta`도 살아있음. 자산 창고 목록에 `EvidenceInsight`(§8.0 S4용) 등 누락분 추가. ②globals.css 정리 후보를 **줄번호 → 블록 이름**으로(`--font-quote` 추가로 좌표가 밀렸고, `:root`가 두 개가 되어 낡은 좌표로 지우면 명조 토큰이 함께 삭제될 위험). ③**§8.7-B 카드 금지의 적용 범위 명시**(설명 시각화 한정 / §8.0 S3의 분기 2카드·bento는 예외). ④§8.7-E 인용 좌표 교정 + §8.6-H의 언스플래시 보존 자산과의 관계 명시. ⑤§1에 **의도적 보류 중인 코드 오염 목록** 편입(세션 파일에만 있으면 유실).
