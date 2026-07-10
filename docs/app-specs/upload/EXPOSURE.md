# NGN Upload — 노출(검색 상위노출) 파이프라인 단일 지도 🔍

> **최근 보강 (2026-07-05, 워커 라이브 — 키워드 병목 감사 3R):** 온보딩→키워드가 앱 최대 난제라 실 19업종 감사·수정.
> - **상권명 결정론화**: place-prefill이 네이버 SubwayStationInfo(역·도보시간)를 `nearestStations`로 파싱 → 키워드 지역축에 **결정론 합류**(LLM areaAliases 변덕 무관). 정체카드 v2 areaAliases(자료 실증·환각컷)와 ∪. 경기 "시구동" 구 축 복원·"동N가"(성수동1가→성수) 접기. → 홍대미용실·미금역치과·성수카페 생성.
> - **업태어 축**(`categoryVenueTerms`): 분류→업태 검색어(주점→술집·생선회→횟집·고기구이→고깃집)를 상권×업태에 추가(메뉴=검색어 아닌 업종 구멍). → 전포술집·속초횟집·망포고깃집. 게이트+검색량이 검증(억지 채택 없음).
> - **노이즈 방어**: reviewMenus를 "손님 리뷰(타가게·잡음)"로 격하(약과 환각 제거)·상위6캡, 메뉴 이모지/[]괄호/프로모문구/문장형 정화(잠실궁금하다면❤️ 제거), 브랜드 체인명 단독 target 배제(블루보틀).
> 전부 앱·워커 미러 3쌍 동기·§1-14 유지. IDENTITY_CARD_VERSION=2(해시 게이트 재생성).

> **이 문서 = "키워드가 어떻게 뽑혀서·순위가 어떻게 추적되고·발행 글에 노출이 어떻게 반영되나"의 단일 진실.**
> **⚠️ 키워드·순위·노출소식·발행글 노출반영 관련 코드를 건드리기 전에 반드시 먼저 읽는다.**
> 여기 적힌 **불변식(§7)**을 깨면 추천 키워드와 발행 태그가 어긋나거나(앱≠워커), 순위 크론이 한 업체
> 때문에 전 업체 미측정으로 멈추거나, **잘못된 노출소식 지침이 전 업체 글에 무검수로 주입**된다.
> 북극성은 "검색 시 우리 가게가 보이냐(꾸준한 노출)"이지 **등수 끌어올리기가 아니다.**
>
> **역할 분담**: 키워드를 **어떤 룰로 뽑는지**(출처추적·검색량게이트·태그 결합 매트릭스)는
> [KEYWORD-TAGSET-RULES.md](KEYWORD-TAGSET-RULES.md)가 단일 진실이다. **이 문서는 그 룰이 아니라
> '파이프라인·연결·크론'에 집중**한다(키워드가 어디서 만들어져 어디로 흘러 발행에 합류하나).
> 짝 문서: [SCHEDULE.md](SCHEDULE.md)(발행 타이밍)·[BLUEPRINT.md](BLUEPRINT.md)(연쇄위험)·[BUG-REGISTER.md](BUG-REGISTER.md).

---

## 1. 한눈 흐름 — 키워드가 어디서 나서 어디로 흐르나

```
[온보딩/설정]  가게 정보(업종·분류·메뉴·시설·진료과목·지역)
   │
   ├─▶ keyword-builder (앱·워커 미러)  ── 결정론 조합 (검색량 게이트 없음)
   │       buildAutoKeywords  → seoKeywords (저장용 소수)
   │       buildTagSet        → tagSet (롱테일 태그 ≤18)
   │
   ├─▶ keyword-engine (앱·워커 미러)  ── 검색량 게이트(VOLUME_FLOOR=30)
   │       buildKeywordSeeds → searchad API 검색량 → selectRecommendations(cap 8)
   │       = 온보딩 ready의 1차 저장(중간 상태·폴백 계열) — 아래 목표 키워드 엔진이 곧 승격
   │
   └─▶ ★목표 키워드 엔진(워커 전용 실행, 2026-07-04 라이브)★  ── "고객이 검색하는 말 중 우리가 정답인 것"
           [1] 정체 카드(LLM#1, identity-card) — whatWeDo·businessType·customers·searchExpressions
           [2] 후보 3원 결합(target-keyword-core) — C1 의도표현±지역변형 + C2 결정론 조합 + C3 searchad 연관 확장
           [3] 정확도 게이트(LLM#2, gate-keyword-accuracy) — 4-티어 target/support/broad/off
           [4] 검색량 티어 랭킹 — target ≤6(니치 ≤3)·support ≤3, 티어 절대 우선·score=log10(vol)+comp
           → buildProfilePatch(EXPO-1 owner 병합) → profile.seoKeywords·targetMeta·trackKeywords 승격
           트리거 = target-keyword-watcher(tenants onSnapshot — 정체 카드 있는 테넌트만, verified만 저장)

[신규 계정]  exposure-bootstrap-watcher  ── tenants onSnapshot, 순차 큐
   │   키워드≥1+잴 기준+keywordRanks 0건 → 즉시 1회 측정+셋업 진단 (구글 생략, §4-1)
   ▼
[매일 07:40 크론]  track-keyword-ranks  ── 업체별 격리(forEachIsolated)
   │   trackKeywords(없으면 seoKeywords 폴백) 6개를 순위 조회
   │   블로그탭·플레이스(HTTP)·통합검색·구글(Chrome 1개 공유, 상위 2개만+회로차단기 §4)
   │   파생: seoKeywords 변경 테넌트만 LLM 매칭 감사(T3-7, §4-2)·추천 글감 갱신(ROTATION §12)
   ▼
keywordRanks 컬렉션  ── 최신 스냅샷 덮어쓰기 + history 30일 시계열 누적
profile.keywordMatch  ── T3-7 감사 결과(mismatch가 발행 태그에서 최종 제외됨, §3)

[주1회 일 23:00 크론]  collect-exposure-news  ── 매체 5종 소식 수집
   │   exposureNews(pending-review) 적재 → 즉시 LLM 자가판정
   ▼
exposureDirectives/active  ── ★전역 단일 문서★ (검수 게이트 없음, §7-D)

[블로그 글 생성 시]  generate-blog → blog-claude 프롬프트
   ├─ rank-signal: keywordRanks → "잘 보이는 키워드 / 아직 안 잡힌 키워드" 섹션
   ├─ exposure-rules.md(정적·사람검수) + exposureDirectives(전역·자동)
   └─ seoKeywords·tagSet → 제목·태그

[발행 직전]  seoKeywords + tagSet 합류 (4곳)
   ├─ 블로그 제목·태그: mergeSeoAndTagSet (keywordMatch mismatch 키워드 최종 제외, T3-7)
   └─ 인스타 해시태그: mergeCaptionHashtags

[사장님 홈]  HomeExposureCards  ── 순위 카드 + 노출소식 1건 + 셋업 진행률
```

**핵심 한 줄**: 가게 정보로 태그는 **결정론적으로**, 목표 키워드는 **정체 카드→의도 후보→정확도
게이트→검색량 랭킹**(워커 목표 키워드 엔진)으로 만들어지고, 매일 그 순위를 **업체별 격리**로 추적해,
글 쓸 때 "뭐가 보이고 뭐가 안 보이나"를 프롬프트에 알려준다. 안 보이는 키워드도 **글마다 제목·태그로
꾸준히 밀어** 노출을 넓히는 게 목적이다(등수 집착 아님).

---

## 2. 파일 지도 — 노출은 여기에만 산다

| 역할 | 파일 | 무엇 |
|---|---|---|
| **키워드/태그 조합(미러)** | `src/lib/keyword-builder.ts`(앱)·`worker/src/content/keyword-builder.ts`(워커) | `effectiveAutoTerms`·`buildAutoKeywords`·`buildKeywordSuggestions`·`buildTagSet`. **두 파일 동일 미러**(§7-A). `TAG_CAP=18`. |
| 검색량 게이트(추천) | `src/lib/keyword-engine.ts`(앱)·`worker/src/exposure/keyword-engine.ts`(워커) | `buildKeywordSeeds`→searchad→`selectRecommendations`. `VOLUME_FLOOR=30`. **앱·워커 미러**(목표 키워드 엔진이 시드·프리필터·선별 규율을 재사용하려고 워커에 미러됨 — parity 테스트 강제). |
| 추천 API | `src/app/api/keywords/recommend/route.ts` | 추천만 반환(조회 전용, 저장 안 함). |
| **검색량 프록시(앱)** | `src/app/api/keywords/volume/route.ts` | POST — 네이버 searchad 키워드도구를 **앱에서** 프록시(월검색량 PC+모바일 합산). `hintKeywords` 호출당 5개라 배치로 나눠 묶고, "< 10"은 5로 환산(정렬용)+`approx` 플래그. 키(`NAVER_ADS_*`)는 서버 env 전용, `accountAllowsAiWork` 게이트. 워커 `keyword-volume.ts`(크론·엔진용)와 별개 — 이건 앱 화면(추천 키워드에 검색량 표시)용 라우트. |
| **목표 키워드 엔진 [1] 정체 카드** | `worker/src/exposure/identity-card.ts` | LLM#1 — `extractIdentityCard`(whatWeDo·businessType·coreServices·customers·searchExpressions·tooBroadTerms). 재료 해시(`identitySourceHash`)로 재크롤 변경분만 재실행. 실패=null(fail-open, 폴백 사다리 1). |
| **목표 키워드 엔진 [2·4] 순수 코어(미러)** | `worker/src/exposure/target-keyword-core.ts`(워커)·`src/lib/target-keyword-core.ts`(앱 미러) | C1 의도표현±지역변형(`buildIntentCandidates`)·C3 기계 프리필터·티어 랭킹(`rankTargetsByTier` — target ≤6/니치 ≤3/support ≤3, `SUPPORT_FLOOR=30`·니치 floor 10+연관목록 등장, C1 의도어 원형은 면제). **미러 동기 필수.** |
| **목표 키워드 엔진 [3] 정확도 게이트** | `worker/src/exposure/gate-keyword-accuracy.ts` | LLM#2 배치 1콜 — 정체 카드 기준 4-티어(target/support/broad/off). 파싱 실패·커버리지<50% = null(**정직 폴백** — 가짜 확신 금지). |
| **목표 키워드 엔진 — 오케스트레이터** | `worker/src/exposure/select-target-keywords.ts` | `selectTargetKeywords`(폴백 사다리 3단: no-identity/gate-failed/searchad-failed, 전부 verified=false) + `buildProfilePatch`(**EXPO-1 병합**: owner 보존·targetDismissed 부활 금지·커스텀 trackKeywords 안 덮음). 저장은 안 함(순수 결과). |
| 검색량 조회(워커) | `worker/src/exposure/keyword-volume.ts` | `fetchRelatedRows`(searchad 연관행 전부, C3·검색량 보충)·`gateKeywordsByVolume`(로테이션 mainKeywords, fail-safe). |
| **목표 키워드 배선(트리거)** | `worker/src/triggers/target-keyword-watcher.ts` | tenants onSnapshot — 온보딩 프로필 저장 직후 비동기 승격. **정체 카드 있는 테넌트만**(기존 업체 불가침), 순차 큐, 멱등(sourceHash+targetMeta), **verified=true만 저장**(폴백·0개는 저장 스킵). |
| 목표 키워드 표시(앱) | `src/components/TargetKeywordCard.tsx`·`src/lib/target-keyword-display.ts` | `profile.targetMeta` 배지·검색량·이유 + "이런 키워드는 뺐어요"(excludedBroad). 온보딩 ready(읽기 전용)·설정>우리 가게 소개(빼기·직접 추가) 공유. |
| 키워드 저장 | `src/app/api/profile/route.ts`·`src/app/api/exposure/keywords/route.ts` | `profile.seoKeywords`·`profile.tagSet`·`trackKeywords` 영속. 워커 초기생성=`worker/src/firestore/tenant-profile.ts`. |
| **온보딩 프리필 재료** | 네이버=`worker/src/exposure/place-prefill*`·앱 `/api/places/naver-prefill` / 구글=`src/app/api/places/search` / **웹 폴백**=`worker/src/exposure/web-prefill.ts` | 상호명으로 가게 정보(지역·업태·메뉴 등 키워드 재료)를 자동 수집. **플레이스에 없거나 엉뚱한 가게가 잡히는 업체는 `web-prefill`이 네이버 웹문서 검색에서 상호가 제목에 든 첫 외부 사이트(홈페이지)를 찾아 title·og설명을 intro 후보로 프리필**(포털·SNS·커뮤니티 호스트는 `EXCLUDED_HOSTS`로 배제 — "디시 글이 홈페이지로 잡히던" 사고 방지). 크롤 표준=place-prefill과 동일(순수 HTTP·모바일 UA·딜레이). |
| **순위 크론** | `worker/src/cron/jobs/track-keyword-ranks.ts` | `40 7 * * *`(매일 07:40). `trackKeywordRanks`+노출셋업 진단. |
| 순위 엔진 | `worker/src/exposure/keyword-rank.ts` | 업체별 격리 순회, 키워드별 4소스 순위 조회·저장(`processTenantRanks` 코어 — 크론·부트스트랩 공용). 구글 회로차단기(`applyGoogleCircuitBreaker`, exposure-3)·T3-7 감사(`auditTenantKeywords`) 포함. |
| **신규 계정 즉시 측정(부트스트랩)** | `worker/src/triggers/exposure-bootstrap-watcher.ts` | tenants onSnapshot — 셋업 직후 일배치 안 기다리고 즉시 1회 측정+셋업 진단(§4-1). 등록=`worker/src/index.ts`(triggers). |
| T3-7 매칭 감사 LLM | `worker/src/exposure/audit-keyword-match.ts` | `auditKeywordMatch` — 정체 정보 기준 키워드 match/weak/mismatch 판정. 실패=전부 match(fail-open). |
| 플레이스 순위(HTTP) | `worker/src/exposure/place-rank.ts` | 순수 HTTP + `__APOLLO_STATE__` 파싱(크롤 표준). `display=100`=100위까지. **100위 초과는 순수 HTTP 불가**(pcmap page/start 무시·GraphQL/allSearch 캡차, R&D 2026-07-05) → 100위 밖=사실상 미노출로 정직 표기(CDP만 가능하나 비권장). |
| 구글 노출(브라우저) | `worker/src/exposure/google-rank.ts` | Playwright Chrome **1개 공유**(크론 전체). **일반 구글 웹검색(SERP) 1페이지 노출만** 판정 — 렌더된 SERP HTML의 외부 결과 링크 순서 파싱. **GBP(구글 비즈니스 게시물) 노출은 추적하지 않는다**(아래 §4 비대칭 주의). |
| **글 노출반영** | `worker/src/exposure/rank-signal.ts` | `buildRankSignal`(순위→exposed/notYet). 텍스트화=`worker/src/blog/blog-claude.ts`. |
| **노출소식 수집 크론** | `worker/src/cron/jobs/collect-exposure-news.ts` | `0 23 * * 0`(주1회 일 23:00). |
| 노출소식 엔진 | `worker/src/exposure/collect-news.ts`·`judge-news.ts`·`apply-news-judgment.ts` | 수집→LLM 판정→directive 반영. |
| **노출 지침(전역)** | `worker/src/exposure/exposure-directives.ts` | `exposureDirectives/active` 단일 문서(≤12개). ★검수 주의★ |
| 노출 규칙(정적) | `worker/src/exposure/exposure-rules.ts` | `worker/prompts/exposure-rules.md` 파일. 사람 검수로만 변경. |
| 발행 태그 합류(블로그) | `worker/src/blog/tags.ts` | `mergeSeoAndTagSet`. `POST_TAG_CAP=18`. |
| 발행 태그 합류(인스타) | `worker/src/insta/hashtags.ts` | `mergeCaptionHashtags`(tagSet 6번째 인자)·`isMetaUnsafeHashtag`. |
| 홈 노출 카드 | `src/components/HomeExposureCards.tsx`·`src/lib/exposure-label.ts`·`exposure-effort.ts` | 순위 라벨·노출노력 푸터. |
| 노출 셋업 | `src/lib/exposure-setup.ts`·`exposure-setup-ready.ts`·`src/app/(mobile)/exposure/setup/page.tsx` | 노출 준비 체크리스트·완성본 미리생성. |
| 노출소식 화면 | `src/app/(mobile)/exposure/page.tsx` | 노출 소식만(순위·셋업은 홈으로 이사). |

---

## 3. 키워드 생성·태그 합류 (추천=발행, 같은 엔진)

키워드는 **두 출력으로 분리**된다. 어떤 룰로 뽑는지는 [KEYWORD-TAGSET-RULES.md](KEYWORD-TAGSET-RULES.md)가
담당하고, 여기선 **흐름·합류 지점**만 본다.

- **노출 키워드(목표 키워드)** = 정식 경로는 **워커 목표 키워드 엔진**(§1 흐름도 — 정체카드→의도후보→
  정확도게이트→검색량랭킹)이 `profile.seoKeywords`·`targetMeta`로 승격 저장. 온보딩 ready 시점엔
  keyword-engine(`buildKeywordSeeds` → searchad 검색량 → `selectRecommendations` cap 8, `VOLUME_FLOOR=30`)이
  1차 저장하고, target-keyword-watcher가 ~2분 내 목표 키워드로 승격한다. keyword-engine은 **앱·워커 미러**
  (워커 `worker/src/exposure/keyword-engine.ts` — 목표 엔진이 시드·선별 규율 재사용, 폴백 사다리 겸용).
- **발행 태그(태그세트)** = 검색량 게이트 **없는** 롱테일 ≤18개. `buildTagSet`(앱 728·워커 726),
  `TAG_CAP=18`(앱 690·워커 688). 글마다 태그/해시태그로 단다.
- **단일 경첩** `effectiveAutoTerms`(앱 143·워커 141): 업종 안전어→분류 폴백→출장의 안전어 결정.
  소비처 3곳(`buildAutoKeywords`·`buildKeywordSuggestions`·`buildTagSet`)이 모두 이 함수를 부른다.

**저장 — `profile` 하위 필드로 분리(오염 방지)**:
- `profile.seoKeywords` 저장 = `src/app/api/profile/route.ts:164`. `profile.tagSet` = `:130~135`(≤30).
- `src/app/api/exposure/keywords/route.ts`: 사장님이 추적 키워드를 정하면 `trackKeywords`+`seoKeywords`를
  같은 세트로 갱신(`:28`). **빈 배열이면 seoKeywords 보존**(EXP-01 가드 `:22~28`) → 영구손실 방지.
- 추천 API(`recommend/route.ts`)는 **조회 전용, 저장 안 함**. 저장은 항상 profile route 경유.

**발행 직전 합류 4곳** — `mergeSeoAndTagSet`은 인자 5개(tags·seoKeywords·tagSet·cap·**mismatchKeywords**):
1. **블로그 생성 태그**: `mergeSeoAndTagSet`(`worker/src/blog/tags.ts`)를 `generate-blog.ts`(naverInput.tags
   조립부)에서 호출(캡 18). seoKeywords는 상위 6개만(`SEO_TAG_LIMIT=6`) + tagSet 전부 합류.
   5번째 인자로 `mismatchKeywordsOf(profile.keywordMatch)`를 넘겨 **T3-7 mismatch 키워드를 제외**(§4-2).
2. **블로그 발행 직전**: 같은 함수를 `worker/src/publish/publish-naver-tenant.ts`(post.tags 재합류부)에서
   캡 30(네이버 한도)·제외어 strip으로 멱등 재합류. 여기도 mismatch 제외 인자 동일.
   mismatch는 **병합 전 입력에서 빼**(좋은 키워드가 cap 자리를 채우게) + 병합 후 최종 필터로 2중 차단
   (모델이 본문 태그로 직접 낸 경우까지). **보수적** — mismatch만 제외(weak·match 유지), 발행 태그만
   (생성 재료·프롬프트엔 영향 없음).
3. **인스타 생성 해시태그**: `mergeCaptionHashtags`(`worker/src/insta/hashtags.ts:38`, tagSet=6번째 인자)를
   `generate-insta-carousel.ts:321`에서 호출. `isMetaUnsafeHashtag`(`:20`)로 메타 위험태그 차단.
4. (세 채널 모두 같은 `profile.tagSet`·`profile.seoKeywords`를 읽는다 — 단일 소스.)

> **seoKeywords가 비면**: `mergeSeoAndTagSet`·`mergeCaptionHashtags`는 기본값 `[]`라 **에러 없이** tagSet만으로
> 진행(발행 차단 없음). 단 추천 키워드 화면은 비게 된다.

---

## 4. 순위 추적 (매일 07:40, 업체별 격리)

매일 **07:40 KST**(`track-keyword-ranks.ts:12` `'40 7 * * *'`, 등록=`worker/src/index.ts:195`, `enableCron`
가드 안)에 전 업체 추적 키워드의 순위를 잰다.

- **비활성·정지 계정은 측정 안 함(EXP-12)**: `accountAllowsAiWork` 게이트가 크롤·검색 API·브라우저 렌더 전에
  컷(`processTenantRanks` 초입, EXP-12 주석). T3-7 매칭 감사(§4-2)에도 같은 게이트 적용 — 정지 업체
  "순위가 안 잡혀요"는 버그가 아니라 이 게이트일 수 있다.
- **키워드 집합**: `pickTrackKeywords`(`keyword-rank.ts`) — **`trackKeywords` 우선, 없으면 `seoKeywords`
  폴백**, 최대 6개(`MAX_TRACK_KEYWORDS=6`). §1-14 오염어는 여기서도 제외(추적 검색을 안 태움).
- **업체별 격리** ★불변식 §7-B★: `forEachIsolated`(`worker/src/cron/for-each-isolated.ts`)로 테넌트마다
  try/catch. 한 업체가 throw해도 나머지는 계속. 키워드 1건 단위도 try/catch,
  크론 핸들러도 try/catch+알림(`cron/registry.ts`) = **3중 안전망**.
- **매칭 기준 2종(blog/mention)** — 블로그 미연결 업체도 측정한다:
  - 네이버 연결+`naverId` 있음 → **내 글 순위**(`matchType:'blog'`). 블로그탭 실화면 **다페이지 크롤**
    (`fetchBlogTabRank`, 2026-07-05 R&D·페이블) 1차: `search.naver?ssc=tab.blog.all&start=1/31/61` + fender
    hydration JSON(`entry.bootstrap`의 `clickLog.title.r`) 파싱(`parseBlogTabItems`) → **절대순위 =
    start-1+(organic 순번), 90위(9페이지)까지**(내 글이 30위 안이면 1회 조기종료). ⚠️ `r`은 **광고 포함 통합
    슬롯번호**라 그대로 쓰면 광고 수(±7)만큼 순위가 밀리고 페이지 경계가 역전됨 → 광고(`isAdType`)+광고
    쌍둥이(`ader.naver.com`) 제외 후 organic만 r-유니크·정렬해 순번으로 환산(`blogRankFromItems`, 페이블 적대검수
    확정·광고포함 픽스처 단위테스트). **외부블로그(티스토리·인플루언서)도 포함**해
    기존 정규식(`parseBlogTabOrder`, `blog.naver.com`만 매칭)이 외부블로그를 건너뛰어 순위를 당겨 보고하던
    버그 수복. 파싱 0건이면 정규식 폴백, 전 페이지 실패 시에만 검색 API 유사도순 폴백(`findMyRank`).
    요청 간격(1초 sleep)은 요청 '전'에 둬 429/파싱실패 `continue`로도 우회 안 됨(차단 정황에서 연타 방지).
    → "안 보임"이 아니라 **"3페이지 27위"**로 답 가능(사장님 지적: 몇 페이지인지가 노출 판정의 토대).
    검증=**③ 실 HTTP 프로브**(60여회 무차단 실측·절대순위 교차검증 10/10)+**단위테스트**(광고포함 순번 환산).
    **미검증**: 하루 대량(키워드당 1→3배) 지속 차단내성·fender 구조 지속성(네이버가 바꾸면 폴백)·90위 초과.
    **RANK-2 반영(2026-07-06, b3d3637)**: rank가 최대 90이라 `rank-signal`의 notYet 기준을
    `rank==null || rank>=31`로(31위 밖=사실상 미노출 → 계속 밀기). 크롤 전 동작 복원(§5 참조). `FIRST_PAGE_MAX`/
    `exposure-label`은 회귀 없음(검수 확인). 노출 카드 표기도 페이지 프레이밍(≤10=위·11+=페이지)으로 앱 반영.
  - `naverId` 없음+상호명 있음 → **상호명 언급 순위**(`matchType:'mention'`, `findMentionRank` — 검색 API
    본문에 상호명이 언급된 글의 순위). **의미가 다르므로**(내 글이 아니라 우리 가게가 언급된 글)
    `matchType`을 keywordRanks에 저장한다(표시용 — 단 **현재 화면 렌더는 미배선**: `useKeywordRanks.ts`가 파싱만 하고 이를 표시하는 컴포넌트는 아직 없음. "UI가 표시" 아님).
  - 둘 다 없으면(naverId도 상호명도) 그 테넌트는 **스킵**(잴 기준 없음).
- **순위 4소스**(키워드당):
  - 블로그탭/언급: 위 2종 매칭.
  - 플레이스: `fetchPlaceRank`(`place-rank.ts`) = **순수 HTTP** + `__APOLLO_STATE__` 파싱(브라우저 아님).
  - 통합검색 노출: `judgePresence`(비치명, 실패 시 생략).
  - 구글: `judgeGooglePresence` — **상위 2개 키워드만**(`GOOGLE_TOP_N=2`). ⚠️ 이는 **일반 구글 웹검색(SERP)** 노출이지 **GBP 게시물 노출이 아니다**(바로 아래 비대칭).
- **⚠️ GBP 게시물 노출은 추적 안 함(추적 비대칭)**: 네이버 **플레이스**는 `place-rank.ts`(순수 HTTP)로 순위가 추적되지만, **구글 비즈니스 프로필(GBP) 게시물이 실제 얼마나 노출되는지 재는 코드·경로는 없다**(grep 확인 — GBP 순위/노출 판정 함수 부재). `google-rank.ts`는 일반 웹검색 SERP만 본다. 즉 **플레이스=추적 O / GBP=추적 X**의 비대칭이 있다. 홈페이지가 "구글 노출 관리"를 소구할 때 이 비대칭을 인지해야 한다(GBP는 발행만 되고 노출 측정은 안 됨 — GBP 자체가 현재 HOLD, CHANNELS §3 GBP 표). 향후 GBP 노출 추적을 붙이려면 이 자리에 place-rank 대칭으로 신설한다.
- **구글 Chrome 1개 공유**: `openGoogleBrowser`(`google-rank.ts`)로 실 Chrome 1회 기동, 크론 전체에서 1개
  재사용(`trackKeywordRanks`가 googleCtx 소유·close). 키워드마다 page만 새로 연다. 구글은 정확한 등수가
  아니라 **"1페이지에 보이는가"**만 판정(등수 집착 회피).
- **구글 회로차단기** ★exposure-3★: 단일 Chrome을 전 테넌트가 공유하므로 구글이 한 번 차단(captcha/sorry)
  하면 그날 거의 모든 요청이 막힌다. **연속 3회 측정 실패**(`GOOGLE_CIRCUIT_BREAK_THRESHOLD=3`)가 쌓이면
  **그날 구글 단계를 전 테넌트에서 통째로 생략**(회로 개방, 네이버 추적·발행은 무관), **측정 성공 시
  카운터 0으로 리셋**. 판정 순수 함수=`applyGoogleCircuitBreaker`(`keyword-rank.ts`). 코드의 exposure-3
  라벨은 **이 회로차단기**를 가리킨다(Chrome 공유 자체가 아님). 며칠째 실패로 노후된 옛 구글 값은
  제거(`isGoogleMeasurementStale`, EXP-08, 10일).
- **저장 = `keywordRanks` 컬렉션**: 문서 ID `{tenantId}__{keyword}`. 최신 스냅샷은 **한 번의 `ref.set`
  전체 덮어쓰기**(exposure-6 — 순위·unified·google을 한 set으로, 중간 크래시 부분 상태 방지), `history`
  배열에 **30일 시계열 누적**(`HISTORY_CAP=30`). **당일 멱등**: 마지막 history가 오늘 날짜면 그 키워드는
  통째 스킵(재시작·부트스트랩·크론이 겹쳐도 하루 1회). 추적에서 빠진 옛 키워드 문서는
  삭제(`staleRankKeywords`).
- **알림 = 하락 경고만**(`keyword-rank-drop`, "등수 달성" 알림 없음). 판정 3조건(`classifyRankChange`) —
  ①1페이지(≤10위)에서 이탈 ②10계단 이상 하락(`DROP_THRESHOLD=10`) ③순위권(100위 내)에서 이탈.
  기준은 **플레이스 순위 우선**(사장님이 보는 기준), 플레이스 기록이 전혀 없을 때만 블로그 순위로 판정.

> **타임존(추정)**: cron 등록에 timezone 인자가 없어 워커 OS 로컬시간(KST 추정)으로 07:40 실행된다.

### 4-1. 신규 계정 즉시 측정 (exposure-bootstrap-watcher)

셋업을 갓 마친 업체가 다음 날 07:40 일배치를 기다리지 않고 **곧바로 첫 순위 측정+셋업 진단**을 받는다.
`worker/src/triggers/exposure-bootstrap-watcher.ts`(등록=`worker/src/index.ts` triggers).

- **판정**(`shouldBootstrapExposure`, `keyword-rank.ts`): ①추적 키워드 ≥1 ②잴 기준 있음(naverId 또는
  상호명) ③**keywordRanks 문서 0건**. 셋 다 참이어야 발동.
- **멱등의 진짜 기준 = keywordRanks 존재 여부** — 한 번 측정되면 다시는 부트스트랩 안 함(재시작·일배치와
  충돌 없음, 같은 날 재측정은 코어의 당일 멱등이 막음).
- **구글 생략** ★exposure-5★: 부트스트랩은 `skipGoogle`로 구글 단계를 통째 생략(브라우저 자체를 안 띄움) —
  일배치 크론과 단일 실 Chrome을 다투면 차단 빈도가 오른다. 빠른 네이버 첫 측정이 목적, 구글은 다음
  크론이 채운다.
- **순차 큐**: 동시 크롤로 네이버를 때리지 않게 한 번에 한 테넌트만(pump 큐). 최초 스냅샷도 평가
  (워커 꺼진 동안 생긴 신규 계정 놓치지 않음). 조건 미달 테넌트는 done 표시 안 함 — 키워드가 나중에
  채워지면 다음 변경에서 재평가.
- **코어 공용**: 측정 본체는 크론과 같은 `processTenantRanks`(`trackKeywordRanksForTenant` 경유) — 별도
  측정 로직이 없다. 실패는 삼킴(다음 변경/일배치에서 재시도).

### 4-2. T3-7 — 순위 크론이 발행 태그를 바꾼다 (keywordMatch 감사)

순위 크론의 파생 작업으로, **seoKeywords가 업체 정체와 맞는지 LLM이 감사**해 어긋난 키워드를 발행
태그에서 뺀다(예: 고깃집인데 '파스타'). `auditTenantKeywords`(`keyword-rank.ts`) + LLM 본체
`audit-keyword-match.ts`.

- **해시 게이트(비용 0~1콜)**: seoKeywords 정렬 해시가 `profile.keywordMatch.hash`와 같으면 재감사 안 함
  (Claude 0콜). **바뀐 테넌트만** LLM 1콜.
- **저장**: `profile.keywordMatch = { hash, verdicts(키워드→match/weak/mismatch), checkedAt }` merge.
- **소비 = 발행 태그 2곳**(§3 합류 1·2번): 블로그 생성 태그 + 발행 직전 재합류에서
  `mergeSeoAndTagSet` 5번째 인자로 **mismatch만 최종 제외**. weak·match는 유지(보수적), 생성
  재료·프롬프트엔 영향 없음.
- **fail-open·비차단**: LLM 실패 시 `auditKeywordMatch`가 전부 match 반환(감사가 발행을 막지 않음),
  크론 훅도 try/catch로 삼킴(순위 기록과 독립). 비활성·정지·키워드 없음이면 스킵(EXP-12).

---

## 5. 글에 노출 반영 (rank-signal → 블로그 프롬프트)

순위 데이터를 **블로그 글 생성 프롬프트**에 녹여, 잘 보이는 키워드는 제목·첫 문단에 살리고 안 잡힌
키워드는 새 각도로 밀게 한다.

- **빌더**: `buildRankSignal(ranks)`(`rank-signal.ts:15`) — `keywordRanks`(seoKeywords 정적값이 아니라 **실측
  순위**)를 받아 `{ exposed, notYet }`로 분류. `current.rank≤10` 또는 통합/구글 found → `exposed`,
  `!found && (rank==null || rank>=31)` → `notYet`(31위 밖=사실상 미노출, RANK-2 2026-07-06),
  **11~30위(2~3페이지)만 중립**으로 둬 신호를 흐리지 않는다. 전 키워드가 11~30이면 notYet=[](추천배지 미표시=의도).
- **조회**: `getTenantKeywordRanks(tenantId)`(`:33`) — Firestore 조회, **실패·없음이면 빈 배열**(`:37~39`).
- **주입**: `generate-blog.ts:431`에서 빌드 → `:446` `buildBlogPrompt({ rankSignal })` → 텍스트화는
  `blog-claude.ts:171` `buildExposureSignalSection`이 sections 배열 **맨 끝**에 붙임(`:173`).
- **무력화 가드** ★불변식 §7-C★: `blog-claude.ts:104`
  `if (!sig || (sig.exposed.length===0 && sig.notYet.length===0)) return '';` → 순위 데이터가 없으면
  **빈 문자열** → sections 조립의 `.filter(Boolean)`로 제거 → 프롬프트에 **헤더조차 안 들어감**(글 생성 안 깨짐).
- **블로그 전용**: `buildRankSignal`·`buildExposureSignalSection`·`getTenantKeywordRanks` 호출처는 blog 3파일뿐.
  인스타·페북은 rank-signal을 **안 쓴다**(인스타는 정적 `profile.seoKeywords`를 해시태그에만 합류 — 별개 경로).

> 주의: 정적 `seoKeywords`(업체 정보 블록, `blog-claude.ts:138~143`)는 **항상** 프롬프트에 들어가고, 위
> 빈 가드는 **`keywordRanks`(실측 순위)** 에만 적용된다. 둘은 다른 경로다.

---

## 6. 노출소식 자동반영(EXP-AUTO) + 홈 가시화

### 6-1. 노출소식 → 글쓰기 지침 (★전역, 검수 주의★)

- **수집 크론**: `collect-exposure-news.ts` `schedule '0 23 * * 0'`(주1회 일 23:00, 등록 = `index.ts`의
  `registerCron(collectExposureNewsCronJob)`). 매체 5종(네이버 플레이스·블로그·인스타·당근·구글, `collect-news.ts`
  `EXPOSURE_MEDIA`) 동향을 Claude 웹서치로 모아 `exposureNews`에 `pending-review`로 적재. 수집 직후 같은 크론에서
  `judgeAndApplyUnjudgedNews()` 자가판정 연쇄(`collect-news.ts`, best-effort try/catch — 판정 실패해도 수집은 성공).
- **지침 저장 = 전역 단일 문서** ★불변식 §7-D★: `exposureDirectives/active`(`exposure-directives.ts`
  `COLLECTION`/`ACTIVE_DOC`). **업체별이 아니라 전역 1개 문서**(≤12개, `MAX_ACTIVE_DIRECTIVES=12`; 한 회차 판정
  상한 `JUDGE_CAP=20`·마킹 상한 `MARK_CAP=20`은 `judge-and-apply-news.ts`). 조회 `loadActiveDirectives`,
  저장 `saveActiveDirectives`, 주입 필터 `buildDirectiveBlock`(`approved===true`만).
- **소비**: **블로그 생성 프롬프트**에만. `blog-claude.ts:180` `buildDirectiveBlock(await loadActiveDirectives())`
  → `:181` directiveSection. 인스타 등엔 안 들어감(grep 기준, 동적 호출이면 누락 가능=추정).
- **판정 체계(2026-06-28 재설계, 사장님 확정)**: 수집된 소식을 **Claude가 판정**한다(사람 사전승인 아님 —
  "안 본 걸 미리 승인 못 한다"는 사장님 판단). 4분기(`judge-news.ts` NewsVerdictKind):
  - **adopt**(정직 + 노출 관련성↑) → `approved:true`로 directive에 **자동 반영**(`apply-news-judgment.ts`).
  - **needs-human**(허용 가능한 기만이냐 애매한 경계 사례) → `approved:false` + **사장님께 알림**(사람 판단 요청).
  - **notify-only / reject** → 반영 안 함(기만·방문자위장·체험단 등 거짓은 reject).
  - **판정 실패 시 안전 폴백**: LLM 호출·JSON 파싱이 실패하면 throw 없이 **notify-only로 폴백**
    (`judge-news.ts` `fallback` — "검수 없으니 확실할 때만 글 반영"이 안전 기본값). 즉 실패는 자동반영으로 새지 않는다.
    또한 adopt/needs-human인데 scope≠content-rule이거나 directive가 비면 notify-only로 강등(`parseNewsVerdict`).
  - 북극성 = **노출**(우리 업체와 매칭되며 검색량 높은 키워드 × 블로그가 그 키워드에 최적화). 거짓 배제.
- **★승인 게이트(중요)**: directive 소비는 **`approved===true`만** 주입된다(`exposure-directives.ts`
  `buildDirectiveBlock`이 필터). 즉 자동반영은 Claude가 adopt 판정한 정직·노출관련 건만이고, 애매한
  기만 건은 사장님이 승인하기 전엔 프롬프트에 **안 들어간다**. "검수 없이 전역 적용"이던 옛 위험은 해소됨.
  상세 프레임워크 = 메모리 [[feedback_exposure_news_judge_framework]].
- **영향 범위(글쓰기)**: 현재 **기존 글 재작성은 보류**(`judge-and-apply-news.ts` `markUnpublishedForDirective`
  `return 0`, 2026-06-24 지시) → 반영돼도 **앞으로 생성되는 블로그 글**에만(발행본·미발행본 안 건드림).
- **사장님 소식 피드(`exposureFeed`) 자동 노출 (EXP-16, 2026-07-05 배선)**: 자동판정 결과 중
  **adopt·notify-only**를 `exposureFeed` 컬렉션에도 써서(`writeVerdict` 콜백, `autoPublished:true`) 홈·`/exposure`
  소식 카드에 **매주 자동 갱신**되게 한다(reject·needs-human 제외). 이전엔 피드가 **운영자 수동 발행
  (`admin/exposure-news/route.ts`)으로만** 채워져, 06-28 자동판정 도입 후 수동검수 중단으로 피드가 06-10에
  얼어붙는 고아화가 있었다(BUG-REGISTER EXP-16). **두 경로 공존**: 수동 admin(레거시, 여전히 동작) + 자동
  워커(신규). 소비처 = `useExposureNews.ts`(`exposureFeed` onSnapshot). directive(글 반영)와 feed(사장님 표시)는
  **별개 출력**이라 둘 다 배선돼야 "글에도 반영 + 화면에도 보임"이 성립한다.
- **정적 규칙(대비)**: `exposure-rules.ts`는 Firestore가 아니라 `worker/prompts/exposure-rules.md` 파일을 읽어
  주입(`blog-claude.ts:175`). **사람 손(운영자 승인+버전헤더+git)으로만 변경** — directive(자동)와 달리 검수됨.

### 6-2. 홈 노출 가시화 (순위·소식·셋업을 한 화면에)

- **HomeExposureCards**(`src/components/HomeExposureCards.tsx`): 홈에 카드 3개 — ① 키워드별 순위 칩
  (`exposure-label.ts` `keywordExposureLabel`, 측정 전은 "곧 확인해요"로 정직), ② 노출 소식 최신 1건 +
  `/exposure` 링크, ③ 노출 셋업 진행률.
- **노출 노력 푸터**(사안2): `exposure-effort.ts:13~19` `exposureEffortNote(tones)` — **순위·발행수를 새로
  계산하지 않고**, "안 보이는 키워드도 글마다 제목·태그로 꾸준히 밀고 있다"는 **동작 설명 문구**만 생성
  (`HomeExposureCards.tsx:83,129`). "노출없음"이 포기처럼 보이지 않게(북극성=꾸준함).
- **노출 셋업**(`exposure-setup.ts`·`exposure-setup-ready.ts`·`/exposure/setup`): 노출 준비 체크리스트를
  lane(auto/assist/owner)으로 분류, 각 항목 **붙여넣을 완성본을 미리 생성**(대표키워드·메뉴·블로그이름 등).
  진행률은 owner 항목을 분모에서 빼 압박 대신 확인 톤(`setupProgress`).
- **/exposure 페이지**: **노출 소식만** 보여줌(순위·키워드관리·셋업은 홈으로 이사). 출처 뱃지(공식/확인된
  소식/업계추정), 추정 소식은 "참고용" 경고, 규칙 반영 상태 정직 표기(`appliedRuleVersion`).

---

## 7. 🔒 불변식 (이걸 깨면 노출이 망가진다 — 새 작업 시 보존 필수)

| # | 불변식 | 왜(깨지면) | 지키는 코드 |
|---|---|---|---|
| **A** | **앱·워커 keyword-builder는 동일 미러** — 추천(앱 keyword-engine)과 발행(워커 keyword-builder)이 같은 결정론 조합을 쓴다. 한쪽만 고치면 즉시 드리프트. | 추천 키워드 ≠ 실제 발행 태그가 됨(사장님이 본 추천과 다른 게 글에 달림) | `src/lib/keyword-builder.ts` ↔ `worker/src/content/keyword-builder.ts` (diff=자기참조 주석·`METRO_STEMS` export 유무뿐). 자동 검증 장치 없음(추정)→수동 동기 규율 |
| **B** | **순위 크론은 업체별 격리** — 한 업체의 깨진 데이터/일시오류가 그날 나머지 업체 미측정으로 번지지 않게. | 한 곳 실패가 전체 순위 추적 중단 | `forEachIsolated`(`for-each-isolated.ts:18~39`) + 키워드 단위 try/catch(`keyword-rank.ts:355`) + 크론 핸들러 try/catch(`registry.ts:52~58`) = 3중 |
| **C** | **순위 데이터 없으면 글 프롬프트 무영향** — rank-signal은 빈 배열일 때 빈 문자열을 반환해 프롬프트에서 사라진다. | 빈 신호가 헤더만 박혀 프롬프트 오염·생성 깨짐 | `blog-claude.ts:104`(빈 가드) + `getTenantKeywordRanks` 빈배열 폴백(`rank-signal.ts:37~39`) |
| **D** | **노출소식 directive는 전역 단일 문서 — 사전 검수 게이트 없음, 손댈 때 극히 주의** | 잘못 들어가면 전 업체 블로그 생성에 무검수 주입 | `exposureDirectives/active`(`exposure-directives.ts` `COLLECTION`). 완화 3겹: ① **`approved===true` 주입 게이트**(`buildDirectiveBlock` — needs-human·미승인은 프롬프트 진입 차단) ② LLM 강등·실패 폴백 notify-only(`judge-news.ts` `parseNewsVerdict`/`fallback`) ③ 기존 글 재작성 보류(`judge-and-apply-news.ts` `markUnpublishedForDirective` return 0) |
| **E** | **seoKeywords 빈 배열로 덮어쓰지 말 것** — 추적/추천 비울 때 seoKeywords는 보존. | 발행 태그·추천이 통째 사라짐 | EXP-01 가드(`exposure/keywords/route.ts:22~28`) |
| **F** | **북극성 = 꾸준한 노출(등수 집착 아님)** — 안 보이는 키워드도 글마다 밀어 넓힌다. 코드·카피가 등수 압박을 만들지 말 것. | 등수 집착 UI = 사장님 불안·앱 가치 왜곡 | 구글=1페이지 노출만 판정(`google-rank.ts`)·`exposure-effort.ts`(꾸준함 문구)·셋업 owner 분모 제외 |
| **G** | **목표 키워드 선정은 정직 폴백 — 실패를 확신으로 둔갑시키지 않는다.** 정체 카드 없음·게이트 실패·searchad 실패는 verified=false 폴백이고, 워처는 **폴백·선정 0개를 저장하지 않는다**(ready 저장분 보존, 빈 배열로 안 덮음). 정체 카드 없는 기존 업체 프로필은 불가침. | 실패가 'target' 확신으로 저장되거나, 더 나쁜 폴백 값·빈 배열이 기존 키워드를 덮음(profile-kw-5 동형 사고) | `select-target-keywords.ts` 폴백 사다리(P7) + `gate-keyword-accuracy.ts`(null 반환) + `target-keyword-watcher.ts`(fallback-skipped·empty-skipped·no-identity 전부 무수정) |
| **H** | **재선정이 사장님 조정을 지우지 않는다(EXPO-1)** — `source:'owner'` 항목 무조건 보존(§1-14 오염어만 예외), `targetDismissed`(뺀 키워드)는 새 선정에 있어도 부활 금지(뺐다가 직접 재추가한 owner가 이김), 커스텀 `trackKeywords` 흔적 있으면 기본값으로 안 덮음. | 재크롤·마이그레이션 재실행 한 번에 사장님 직접 조정 전멸(데이터 소실 클래스) | `buildProfilePatch`(existing 병합)·`parseOwnerEntries`·`hasCustomTrackKeywords`(`select-target-keywords.ts`) + 단위테스트 가드 |

> **앱 ↔ 워커 미러**가 이 문서에서 가장 깨지기 쉬운 지점이다. 미러는 이제 **3쌍**: ① `keyword-builder`
> (결정론 조합) ② `keyword-engine`(시드·선별) ③ `target-keyword-core`(목표 키워드 순수 코어 — parity 강제).
> 수동 복붙 미러라 한쪽만 고치면 추천과 발행·선정이 갈라진다. **반드시 양쪽 동기** + 코퍼스 골든 스냅샷
> (`src/lib/keyword-corpus.test.ts`)·parity 테스트로 회귀 확인. [[룰 상세=KEYWORD-TAGSET-RULES.md §7]]

---

## 8. 🧪 노출을 안전하게 바꾸는 법 (새 작업 체크리스트)

키워드·순위·노출소식 근처를 손댈 때 **이 다섯을 자문**한다:
1. **앱·워커 미러를 둘 다 고쳤나?** (keyword-builder·keyword-engine·target-keyword-core 한쪽만 = 위반 §7-A) → `cp` 후 자기참조 주석만 복원.
2. **순위 크론 격리를 건드리나?** (`forEachIsolated`·per-keyword try/catch 제거 = 위반 §7-B)
3. **rank-signal 빈 가드를 살리나?** (순위 없을 때 빈 문자열 반환 = §7-C)
4. **노출소식 directive를 전 업체에 무검수로 흘리나?** (전역 단일문서 = §7-D 검수 주의)
5. **목표 키워드 재선정·저장 경로가 정직 폴백과 owner 병합을 지키나?** (폴백·0개 저장, owner/targetDismissed/커스텀 track 무시 = 위반 §7-G·H)

**검증 사다리**:
- 키워드 빌더(결정론) = **코퍼스 골든 스냅샷**(`keyword-corpus.test.ts`)으로 충분(searchad 호출 없는 재실행
  공짜). 미러 회귀는 앱·워커 양쪽 단위 + tsc 0 + diff 자기참조뿐 확인.
- 검색량 게이트(searchad 의존) = **실 searchad 스모크**(과금 주의, [[no-rerun-52angle]] 정신으로 남발 금지).
- 순위 크론·구글 브라우저 = **에뮬레이터/실DB 통합** + 실 네이버/구글 1회 스모크(④ 브라우저 E2E는 배포 시).
- 노출소식·directive = LLM 판정 품질이라 **실 LLM 스모크로 눈 확인** 필수(자가판정이 잘못 adopt 안 하나).
- 목표 키워드 엔진 = 순수 코어(후보·랭킹·EXPO-1 병합)는 단위+parity, 정체 카드·정확도 게이트는 **실 LLM
  스모크로 선정 결과를 눈으로**(잘못 target 확신 안 하나), 배선은 실 Firestore 통합까지.

> **유지 규율**: 노출 흐름·불변식·파일이 바뀌면 이 문서를 **즉시 갱신**(STATUS·SCHEDULE처럼 드리프트 없이).
> 키워드 **룰** 변경은 [KEYWORD-TAGSET-RULES.md](KEYWORD-TAGSET-RULES.md)를 먼저 고치고, **파이프라인·연결·크론**
> 변경은 이 문서를 먼저 고친다. 둘이 충돌하면 룰=KEYWORD-TAGSET-RULES, 흐름=EXPOSURE가 각자 단일 진실이다.

---

## 9. 코드↔문서 매핑 (색인 — 규칙 본문은 해당 §, 여기는 "지키는 코드가 어디 사는가")

> 형식 규율: **라인 번호 금지**(밀림 확정), 파일 + 함수·마커 주석 + 규칙 한 줄. 이 표는 색인이지
> 규칙의 정본이 아니다 — 규칙이 바뀌면 해당 §와 이 행을 같이 고친다.

| 규칙(문서 §) | 코드 위치(파일 + 함수/마커) | 한 줄 요약 |
|---|---|---|
| 추적 키워드 선택 (§4) | `worker/src/exposure/keyword-rank.ts` `pickTrackKeywords` | trackKeywords 우선→seoKeywords 폴백, ≤6, §1-14 오염어 제외 |
| blog/mention 2종 매칭 (§4) | 같은 파일 `processTenantRanks` 매칭 기준 주석 · `findMyRank`/`findBlogTabRank`/`findMentionRank` | naverId=내 글 순위, 없으면 상호명 언급 순위(matchType 저장), 둘 다 없으면 스킵 |
| 하락 경고 3조건·플레이스 우선 (§4) | 같은 파일 `classifyRankChange` + "경고는 사장님 기준인 플레이스 우선" 주석 | 1페이지 이탈·10계단·100위 밖, 플레이스 기록 있으면 플레이스 기준 |
| 당일 멱등 (§4) | 같은 파일 `processTenantRanks`의 `lastEntry?.date === today` 가드 | 오늘 이미 기록된 키워드는 통째 스킵(크론·부트스트랩·재시작 겹침 안전) |
| 구글 회로차단기 exposure-3 (§4) | 같은 파일 `GOOGLE_CIRCUIT_BREAK_THRESHOLD` · `applyGoogleCircuitBreaker` · exposure-3 주석 | 연속 3회 실패→그날 구글 전 테넌트 생략, 성공 시 리셋 |
| EXP-12 계정 게이트 (§4) | 같은 파일 EXP-12 주석(`accountAllowsAiWork`) — 순위·T3-7 감사 양쪽 | 비활성·정지 계정은 크롤·렌더·LLM 자원 안 태움 |
| 부트스트랩 즉시 측정 (§4-1) | `worker/src/triggers/exposure-bootstrap-watcher.ts` + `keyword-rank.ts` `shouldBootstrapExposure`·`trackKeywordRanksForTenant` | 키워드≥1+잴 기준+ranks 0건→즉시 1회, 멱등=keywordRanks 존재, 순차 큐 |
| 부트스트랩 구글 생략 exposure-5 (§4-1) | `keyword-rank.ts` exposure-5 주석(`skipGoogle`) | 부트스트랩은 Chrome 안 띄움(일배치와 자원 경쟁 원천 차단) |
| T3-7 매칭 감사 (§4-2) | `keyword-rank.ts` `auditTenantKeywords`(해시 게이트) + `worker/src/exposure/audit-keyword-match.ts`(fail-open) | seoKeywords 변경 테넌트만 LLM 감사→profile.keywordMatch 저장 |
| T3-7 mismatch 발행 제외 (§3·§4-2) | `worker/src/blog/tags.ts` `mergeSeoAndTagSet` 5번째 인자(T3-7 주석) — 호출 2곳=`generate-blog.ts` naverInput.tags·`publish-naver-tenant.ts` post.tags | mismatch만 발행 태그서 제외(weak·match 유지), 병합 전+후 2중 |
| 업체별 격리 (§7-B) | `worker/src/cron/for-each-isolated.ts` `forEachIsolated` + 키워드 단위 try/catch | 한 업체 실패가 전체 미측정으로 안 번짐(3중) |
| rank-signal 빈 가드 (§7-C) | `worker/src/blog/blog-claude.ts` `buildExposureSignalSection` 빈 가드 + `rank-signal.ts` 빈배열 폴백 | 순위 없으면 프롬프트에 헤더조차 안 들어감 |
| seoKeywords 빈 덮어쓰기 금지 EXP-01 (§7-E) | `src/app/api/exposure/keywords/route.ts` EXP-01 가드 | 빈 배열이면 seoKeywords 보존 |
| 목표 키워드 정직 폴백·owner 병합 (§7-G·H) | `worker/src/exposure/select-target-keywords.ts` `buildProfilePatch`(EXPO-1) · `target-keyword-watcher.ts` | 폴백·0개 저장 안 함, owner·targetDismissed 불가침 |
