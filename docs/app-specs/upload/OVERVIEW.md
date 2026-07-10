# NGN Upload — 전체 개요 (아키텍처·흐름의 단일 진실)

> **"시스템이 어떻게 생겼고 어떻게 흐르나"의 유일한 답 문서.** 앱+워커 2축, end-to-end 파이프라인, 핵심 모델, 기능→코드 위치, 함정(레거시 vs 신 경로)을 담는다.
> **수동 큐레이션** — `update-ctx.js`가 안 건드린다. 아키텍처·흐름이 바뀐 세션 끝에 여기 반영한다.
> ⚠️ **시점 상태(라이브·배포·검증·우선순위)는 여기 적지 않는다** — 그건 `docs/STATUS.md`(라이브)·`docs/BUG-REGISTER.md`(구멍)가 담당. 문서 라우팅 = `docs/INDEX.md`.
> 마지막 갱신: **2026-07-04**. 브랜치 `rotation-intake-catalog`(master 미머지) 기준. 구 §5(기능 인벤토리+검증 서사)·§5.5(상태보드) 원문 = [`_archive/OVERVIEW-5-LOG-2026-06.md`](_archive/OVERVIEW-5-LOG-2026-06.md).

## 📚 문서 세트
문서 지도·작업 라우팅·코드→문서 매핑 = **`docs/INDEX.md`** (구 📚표·§7·§8은 그리로 이사).


## 1. 제품 한 줄
자영업 사장님이 **사진·메모만 올리면** AI가 글을 써서 검토 후 **네이버 블로그(현재)·인스타·페북(예정)에 자동 발행**해 주는 도구. 사장님은 SNS에 신경 안 써도 된다. (가치제안 메모리 [[project_app_value_proposition]])

## 2. 시스템 2축
1. **앱 (Next.js 16, Cloud Run 배포)** — 사장님/운영자 UI: 온보딩·업로드·검토·승인, 운영자 콘솔(act-as). `src/`. API는 `src/app/api/**`.
2. **워커 (Node/tsx, `worker/`)** — 발행 엔진. **사장님 PC 상주**(클라우드 X — 비용·로컬파일 의존으로 의도적 보류, 업체 늘면 재검토). 시작프로그램 `NGN_Upload_Worker.lnk` → `start_worker.vbs`(supervisor)가 기동. **2026-06-02 하드닝**: ①매 (재)시작 자동 빌드(stale 방지) ②단일 인스턴스 가드(중복 방지) ③크래시 자동 재시작. 재배포=`worker/restart_worker.bat`(또는 코드 바꾸면 supervisor 재시작 시 자동 빌드). Firestore watch로 분류·글생성·스케줄·발행.

데이터: **Firestore**(tenants·contents·events·schedule_slots) + **GCS**(`uploads/`=업로드 임시·Sync가 며칠 뒤 비움, `previews/{tenantId}/{contentId}/`=가공본 영속) + **로컬 `F:\업체영상`**(원본 영구, NGN Sync가 GCS와 미러).

## 3. 전체 파이프라인 (end-to-end)
```
[앱] 사장님 모바일 업로드(사진+메모/음성)         src/app/(mobile)/*, /api/submit, /api/upload-url
   → GCS uploads/ + Firestore event 생성
[워커] event-watcher → prepareAndClassify          worker/src/triggers/event-watcher.ts, blog/generate-blog.ts
   → 사진 dHash 중복제거 + Claude 분류·질문생성 → content 생성, state=awaiting-answers
[앱] 검토화면서 사장님이 사진질문 답변              src/app/(mobile)/review, AnswerPrompt → /api/answers
   → 답 병합 후 state=writing
[워커] write-blog-watcher → writeBlog               worker/src/triggers/write-blog-watcher.ts, blog/generate-blog.ts
   → Claude 호출: 중립코어 + [업종가이드] + [톤] + [업체정보] 주입 → 글+이미지선별
   → 4:5 변환·GCS previews/ 업로드·썸네일 → state=preview-ready  (claimForWriting CAS로 중복작성 차단)
[앱] 사장님 검토 → 승인                              review 화면 → state=approved
[워커] approved-watcher → assignSlotForContent       worker/src/scheduler/assign-slot.ts
   → decideTiming: 밀린 거 없으면 즉시(scheduledAt=now), backlog면 빈도분산. state=scheduled
[워커] slot-fire-watcher → publishNaverForTenant      worker/src/triggers/slot-fire-watcher.ts, publish/publish-naver-tenant.ts
   → 금지어 게이트(tenant.bannedWords) → 이미지 GCS 재수집·가드 → 네이버 발행 → state=published
```
수정 흐름: 검토화면서 수정요청 → state=revising → revision-request-watcher → Claude → preview-ready.
이식 흐름: 아우르메 과거글(content.legacyPostNumber)은 sns 완성본(`worker/legacy-posts/post-XXX.json`)을 buildLegacyBlogInput으로 변환해 발행. **별도 상태 단계가 아니라** 일반 상태머신(§4)에 `legacyPostNumber`가 얹혀 흐른다 — 발행 직전 분기만 이식본을 탄다. 코드 = 워커 `legacy/{build-legacy-blog-input,load-legacy-post,sns-to-naver-input,stage-images,regen-post}.ts`(로드→변환→이미지 스테이징→재생성본 우선 적용). PIPELINE §6.4 상세.

## 4. 핵심 모델
- **테넌트/운영자 act-as**: 운영자=누구나컴퍼니(`nugoona`). 운영자가 업체를 만들고 "들어가기(act-as)"로 그 업체 클레임으로 전환해 온보딩·발행 대행. 복귀 인가=`requireOperatorByRegistry`. 현재 테넌트: `nugoona`(운영자, 네이버 yturn21 연결), `aurume-wellness`(아우르메 출장케어, 이식글 164건, **네이버 채널 연결됨** — 2026-07-03 폰 QR 재로그인으로 세션 복구, `channels.naver.sessionStatus='ready'`. STATUS 참조). 메모리 [[project_operator_act_as]].
  - ⚠️ **브랜드·계정 구조(혼동 주의)**: 사장님 **김순재 한 분 = 두 브랜드**. ①**아우름웰니스**(웰니스·B2B 출장케어) = `aurume-wellness` 테넌트(이식글·네이버 블로그). ②**아우르메테라피**(오프라인 샵·B2C) = **별개 브랜드**(B2B 블로그에선 금지어로 차단), 아직 테넌트 없음 → 나중에 별도 테넌트(한 로그인 다브랜드 [[project_folder_structure_and_accounts]]). **인스타도 브랜드별 별도 계정**. 채널 연결 시 반드시 해당 브랜드 계정으로(웰니스 ≠ 테라피).
- **콘텐츠 상태머신**: uploaded → awaiting-answers → writing → preview-ready → approved → scheduled → published. (revising는 preview-ready↔). 정의 `worker/src/firestore/types.ts`.
- **발행 모델** (spec `docs/superpowers/specs/2026-06-02-per-business-publish-scheduling-model.md`): 무조건 업체별(합산 금지). 검토후 **즉시발행이 기본**, 콘텐츠 밀리면(미발행 승인 2+) 빈도수(`frequency.perWeek`)로 분산. **업체는 발행 시간 설정 못 함**(시점=엔진). **하드캡=채널당 하루 1건**(버스트 차단). 안내 대상=운영자. 빈도 UI는 backlog일 때만 노출(추천+이유 필수 [[feedback_business_choices_need_recommendation]]).
- **콘텐츠 생성** (spec `2026-06-02-per-industry-content-guides-design.md`): 중립 코어(`worker/prompts/blog-agent-prompt.md`) + **업종 가이드**(`worker/prompts/guides/blog-guide-{industry}.md` 7종, 웹리서치 근거) + **톤**(`tone-prompt-blocks.ts` 6종, 온보딩 디폴트) + **업체 정보**(profile: 업체명·연락처→CTA·금지어·SEO). 업종은 `tenant.profile.industry`로 결정론 선택. 아우르메 특화는 wellness 가이드 + 프로필.

## 5. 기능 → 코드 위치 맵 (아키텍처 관점 — 상태 컬럼 없음, 라이브 여부는 STATUS)

| 영역 | 기능 | 코드 위치 |
|------|------|-----------|
| 업로드 | 모바일/PC 사진·영상·음성 업로드, 임시저장, 사진4장 게이트 | `src/app/(mobile)/{new,quick}`·`src/app/pc/*`·`/api/{submit,upload-url,complete,quick-init,add-images}`·`src/lib/photo-gate` |
| 온보딩 | 이름 1칸→플레이스 후보→ready→채널, 수동(manual), 자동 키워드 | `src/app/onboarding/*`·`/api/profile`·`/api/places/naver-prefill`·`src/lib/{onboarding-auto,place-prefill-apply}`·워커 `exposure/place-prefill*` |
| 계정·인증 | 소셜 로그인 4종·자동가입·활성화·정지/삭제·act-as·staff | `src/app/login`·`/api/auth/*`·`/api/admin/*`·`AuthGate`·`src/lib/{account-status,tenant-defaults,tenant-delete,social-oauth}` |
| 생성 | 분류→사진Q&A→블로그/인스타/페북 fan-out 작성 | 워커 `blog/generate-blog`(prepareAndClassify·writeBlog)·`blog-claude`·`insta/*`·`facebook/*`·`prompts/*`(코어+업종가이드+톤) |
| 음성 입력 | 녹음→받아쓰기(faster-whisper)→Claude 정리 | 앱 `/api/voice/transcribe`(신, `voice-transcribe` 큐)·`/api/voice/cleanup`(구, 텍스트 정리)·워커 `triggers/voice-cleanup-watcher`(⚠️좀비 회피로 `voice-transcribe`만 감시, PIPELINE/GENERATION §노트) |
| 검토·수정 | 검토·승인·직접편집·AI수정요청·삭제 | `(mobile)/{review,detail}`·`ContentEditor`·`useContentActions`·`/api/content/*`·워커 `revision-request-watcher` |
| 스케줄·발행 | 슬롯·빈도·즉시발행·하드캡·금지어/사진 게이트·채널 어댑터 | 워커 `scheduler/*`·`triggers/slot-fire-watcher`·`publish/*`(fire-publish·claim CAS)·`naver/publish-post`·`legacy/*`(이식) |
| 썸네일 | 커버 렌더·재렌더·글별 디자인/칸 편집 | 워커 `thumbnails/*`·`thumb-rerender-watcher`·`src/lib/thumb-slots`·`/api/content/[id]/thumbnail-photo` |
| 키워드·노출 | 목표 키워드·태그세트·검색량·순위 크론·노출소식 | `src/lib/{keyword-builder,keyword-engine}`(워커 미러)·워커 `exposure/*`(keyword-rank·collect-news)·`/api/keywords/*`·`/exposure` |
| 로테이션(1년치 글감) | 모델A 카탈로그 52·역산 질문·이번 주 추천 | 워커 `rotation/*`·`build-rotation-catalog-watcher`·`/api/rotation/build`·`/rotation/{building,topics}` |
| 영상 | 소재 전달(F:\_소재)·규격변환 사이드카(D:\영상편집)·제안형 분석 | 워커 `triggers/video-source-watcher`·`video/*`·`transcode/*`·`start_video_sidecar.vbs`(stage3=옆 레포) |
| 리뷰 답글 | 배민·쿠팡 붙여넣기→AI 초안(하루 30건 캡) | 워커 `reviews/*`·`/api/reviews/reply`·`(mobile)/review-reply` |
| 복구·알림 | heartbeat·watchdog·자가재시작·reaper·크론 격리·텔레그램 | 워커 `recovery/*`·`cron/*`·**알림** `notifications/*`(`dispatcher`·`notifier-factory`·`notify-owner`+`senders/{email,fcm,telegram}` 3종·8 NotificationKind)·`/api/cron/worker-watchdog`·`/api/health/worker` |
| 채널 연결 | 네이버 세션(QR)·메타 OAuth·플레이스·GBP(HOLD)·연결상태 조회 | `/api/channels/*`(연결·끊기·`state` 읽기)·워커 `naver/{qr-login-core,tenant-session}`·**플레이스 발행** `publish/publish-naver-place-tenant`+`naver/publish-place-post`(블로그 뒤 부가발행, HOLD)·`publish/tenant-meta`·`src/lib/google-business`+워커 `google-business/*` |
| 정책·규칙 전파 | 정책버전 재생성·제외어(scope)·지시사항·rule-refresh | 워커 `content/{policy-version,exclude-keywords}`·`rule-refresh-watcher`·`src/lib/rules-diff` |

### ⚖️ 박제된 법(사장님 확정 규칙 — 바꾸려면 사장님 승인)
- **사진 규칙**: 중복(비슷한 앵글)·게시불가 제외 **유효 4장 미만 = 발행 보류**(dHash+Claude 비전, fail-closed). 업로드 단에서도 4장 게이트. 워커 `photo-dedup-gate`·`vision-dedup`.
- **크롤링 표준**: 네이버 수집은 **순수 HTTP + `__APOLLO_STATE__` 파싱만**(모바일 UA·딜레이). Playwright·새 방식 발명 금지(예외=로그인 필요한 발행 자동화). `exposure/place-prefill`·`unified-search` 재사용.
- **글쓰기 정책 버전 강제**: 프롬프트·가이드·노출규칙 바꾸면 같은 커밋에서 `CONTENT_POLICY_VERSION` bump(+소스해시 가드 테스트) — 옛 정책 글 발행 차단. 워커 `content/policy-version`.

## 5.5 구멍·남은 일
**단일 진실 = `docs/BUG-REGISTER.md`**(미해결 갭·이월 표) · 라이브·대기 = `docs/STATUS.md` "캐리오버". 구 §5.5 상태보드 원문 = `_archive/OVERVIEW-5-LOG-2026-06.md`.

## 6. ⚠️ 헷갈리기 쉬운 것 (중복·엉뚱 방지)
- **글 생성 경로 2개**: (신·라이브) `blog-claude.ts`+업종가이드 = 업로드 흐름의 정식 경로. (구·레거시) `prompts/generate-posts.md`+`agent-prompt.md` = sns-auto-poster 배치 방식, 일부 살아있으나 신규 업로드엔 안 씀. **새 작업은 blog-claude 경로 기준.**
- **`blog-writing-guide.md`/`blog-template.md`**: 아우르메 특화 레거시. 신 경로는 `guides/`를 씀. 단 레거시(generate-posts)·수정루프(revise-content)가 아직 참조해 **삭제 안 함**(중복 정리 후속).
- **수정 2경로(2026-06-03~, 2026-06-05 정합화)**: ①**직접 편집**(`/detail` 고치기 → ContentEditor → `useContentActions.saveEdit`)은 `preview`+`naverInput`을 함께 써서 **발행본 즉시 반영**. ②**AI 수정요청(말로)** `state=revising` → revision-request-watcher가 `buildRevisionUpdate`로 **blog는 naverInput까지 갱신**(2026-06-05 수정, 이전엔 preview만 갱신해 발행본 안 바뀌던 #8 해소). 발행 소스 진실 = `naverInput.contentBlocks`(**text|image|heading|quote|list**)·`selectedImages`·`preview.caption`. `preview.body/images`는 표시용.
- **블록 5종 정합(2026-06-05, 헷갈리지 말 것)**: AI는 `text·image·heading·quote·list`를 만든다. 네이버 발행 레이어 `ContentBlock`은 `text|images|quote`만 — 그래서 `buildNaverPostFromContent`가 변환한다(`heading→quote`(프롬프트도 ▍인용구로 명시)·`quote` 패스스루·`list→불릿/번호 text`). 앱 `EditBlock`(content-edit.ts)도 5종 보존. **새로 블록을 다루는 코드는 5종 전부 처리**할 것(text|image만 처리하면 또 유실). 단 image `size`(large/small)는 신규 경로에서 아직 드롭됨(후속).
- **검토 큐**: 옛 자동발행(이식, `legacyPostNumber`/`source=sns-auto-poster`)은 `useReviewPending`/`useReviewStats`에서 숨김 — 사장님 검토 대상은 신규 업로드 글뿐. (아우르메 실패 3건 post-82·100·154가 빈 카드로 뜨던 문제 해결.)
- **`preview.images`는 GCS URL(로컬경로 아님)**: 인스타 생성(`writeInstaCarousel`)은 1시간 signed URL, 임포트/백필본은 공개형 URL을 저장. 발행 어댑터(`uploadCarousel`)는 입력이 http(s)면 객체경로 재서명, 로컬경로면 temp 업로드 — 둘을 섞어 다루는 코드는 이 분기를 지킬 것(과거 ENOENT 버그 원인 `1c09708`).
- **발행 실패는 자동 재시도될 수 있음**: transient(네트워크·타임아웃·5xx·레이트리밋)는 fire-publish가 state=scheduled로 유지하며 백오프 재시도(최대3) → 슬롯 마킹은 최종 성공/실패 때만. code/data/auth는 즉시 failed. 실패 원인은 `content.publishResult.category` + `worker/logs/publish-failures.ndjson`. 트리아지=`node _triage-failures.mjs`.
- **워커는 사장님 PC 상주**(클라우드 X). 코드 바꾸면 `cd worker && npm run build` + 재기동해야 반영. dist가 런타임.
- **에뮬레이터**: vitest 일부는 Firestore 에뮬레이터(127.0.0.1:8080) 필요. 떠 있으면 통합테스트 통과.
- **아우르메 자동발행 LIVE**: ✅ 2026-06-02 **자동 발행 가동**. `publishEnabled=true` + `.env.shared`에 `NAVER_PUBLISH_DRY_RUN=false`(신경로 실발행)·`NAVER_PUBLISH_ENABLED=false`(레거시 cron off, 컷오버). 미발행 레거시 104건을 **신 파이프라인 warm 톤·리치 구조(소제목·인용구·리스트)로 재생성**(`legacy-posts/regen/post-XXX.json`, `regen-post.ts`가 발행 시 우선 적용) → **1일 1건 자동 발행**(post-47·3 발행됨, 나머지 ~09-13). 실패 3건(82·100·154=사진 부적합/원본폴더 오연결). 세션 `auth/naver/aurume-wellness.json`(수동 로그인, 몇 주). ⚠️ **신규 업체는 publishEnabled를 따로 켜야** 자동발행(기본 false=안전).
- **비아우르메 업종 실제 생성**: 프롬프트 조립만 검증, Claude 실생성 e2e 미실행.
- **브랜치**: 현재 `rotation-intake-catalog`에 쌓임(master보다 760커밋 앞), **master 미머지·미푸시**. (구 `aurume-publish-wiring`은 이 브랜치로 대체됨.)

## 6.5 🎨 디자인 시스템 & UI 작업 규칙 (중요 — 창조 금지, 재사용)
**UI/화면/목업을 만들 때 새로 창조하지 말 것. 이미 만들어 둔 것을 재사용·매칭한다** ([[feedback_reuse_existing_systems]], [[feedback_mockup_is_design_spec]]).
- **실제 화면 스타일 = `src/app/**/*.module.css`** 가 진실. 새 컴포넌트는 같은 화면의 기존 클래스·값을 그대로 가져와 맞춘다. (예: 빈도수 UI → `src/app/(mobile)/review/review.module.css` 컴포넌트 재사용.)
- **라운딩**: globals.css 전역은 `border-radius:0 !important`지만 **Phase 2 컴포넌트가 `!important`로 10~22px 라운딩을 도로 입힌다** → **실제 앱은 둥글다**(카드 ~16-20px, 버튼 ~14-16px, 칩 ~8-11px, 알약 28px). 전역 규칙만 보고 직각으로 단정하면 틀린다.
- **토큰**: `src/app/globals.css` `:root`(--ink/--ink-2~5·--line/--line-strong·--accent #0070f3·--shadow-*·채널색). 색은 면적기준 절제([[feedback_color_saturation_by_area]]), 파스텔배경·옅은회색선·em dash·한글 기울임 금지.
- **기존 목업**: `public/docs/*.html`(예: catalog-mockup), Phase 2 mockup 48개+룰 = [[project_phase2_ui_design_complete]]. ⚠️ catalog-mockup은 직각이라 라운딩 기준으론 부적합 — 실제 module.css가 기준.
- 누구나 톤: 미니멀, 큰 타이틀(eyebrow+H1), 헤어라인 구분, 검정 강조칩, 사장님 용어(기술용어 금지).


## 7. 문서 지도
→ **`docs/INDEX.md`** (4층 문서지도·작업 라우팅·코드→문서 매핑을 한 곳으로 이사).

## 8. 갱신 규칙
→ **`docs/INDEX.md` §4** (문서별 관할·세션 끝 3점 세트·롤링 규칙으로 이사).
