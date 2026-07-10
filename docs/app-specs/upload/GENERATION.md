# NGN Upload — 콘텐츠 생성 단일 지도 🪄

> **이 문서 = "사진·메모를 올리면 어떻게 글(블로그·인스타·페북)이 만들어지나"의 단일 진실.**
> **⚠️ 생성·분류·작성·fan-out·수정요청 관련 코드를 건드리기 전에 반드시 먼저 읽는다.**
> 여기 적힌 **불변식(§3)**을 깨면 글이 **중복 생성**되거나(1업로드→2글), **안 만들어지거나**(무음 누락),
> **조용히 죽는다**(사장님은 "사진 올렸는데 글 안 나옴"만 봄). 새 기능 작업 중 생성이 "꼬이거나
> 꺼지는" 걸 막는 게 이 문서의 목적이다.
> 짝 문서: [SCHEDULE.md](SCHEDULE.md)(생성 이후 = 승인→슬롯→발행)·[BLUEPRINT.md](BLUEPRINT.md)(연쇄위험)·[BUG-REGISTER.md](BUG-REGISTER.md)(GEN 생성정확성 감사).
> 📸 **PUB 관문 A(2026-07-08)**: 생성 완료(preview-ready 전이) *직전*에 발행 사진 표준(중복·품질·서비스적합성)을 미리 판정해 부적합이면 `content.photoIssues` 기록→자동승인 차단·검토화면 안내. 배선=`markPhotoIssuesForReview`(blog/insta/fb 3생성기, transitionState 전). 상세·정본=[BUG-REGISTER.md](BUG-REGISTER.md) PUB.

---

## 1. 한눈 흐름 — 사진 업로드부터 검토 대기까지

```
[웹 업로드] event(generationKind='blog', status='uploaded')
   │  (event-watcher 가 감지)
   ▼
① 비용 게이트 → ② 원자적 선점(claimEventForClassify) → status='generating'
   │   (비활성/정지 가게면 claim 안 함 = Claude 호출 0, event는 uploaded로 남아 나중 처리)
   ▼
prepareAndClassify  ── 사진 분류·질문 생성 (Claude 호출 1회)
   │   ③ GCS 사진 → 작업폴더 다운로드 → dHash 중복 제거
   │   ④ classifyPhotos(업종별 가치질문) → photoPlan
   │   ⑤ ★fan-out: 켜진 채널 → 생성 종류 결정★ (resolveGenerationChannels)
   │       채널 0개면 생성 생략 + 운영자 알림(B6, 불변식 §3-C)
   │   ⑥ 채널마다 content 문서 생성(같은 photoPlan 공유) → awaiting-answers
   ▼
awaiting-answers  ── 사진 질문 대기 (검토 화면에 "질문에 답해주세요" 배너)
   │  (앱: 사장님이 답 저장 → answers API 가 한 트랜잭션에서 형제 전부 'writing'으로)
   ▼
writing  ── 답이 채워진 상태
   │  (write-blog/insta/facebook-watcher 가 kind별로 감지)
   ▼
⑦ 비용 게이트 → ⑧ ★원자적 선점(claimForWriting, expectedKind)★ → state='generating'
   │   (다른 워처/재발화가 이미 집었으면 false → 건너뜀. 중복 작성 방지, 불변식 §3-A)
   ▼
writeBlog / writeInstaCarousel / writeFacebook  ── 본문 작성 (Claude 호출 1회 + 조건부 1회)
   │   ⑨ 생성 내내 generatingAt 하트비트(STB-05: 긴 작업 거짓 회수 방지)
   │   ⑨-b 블로그만: 제목에 노출 키워드가 없으면 "제목만" 고치는 소형 Claude 호출 1회 추가
   │       (조건부 3번째 호출 — 분류 1 + 본문 1 + 제목 보강 0~1. 상세 §6)
   │   ⑩ 본문·이미지 변환·업로드 → preview/naverInput 저장 (+ policyVersion 도장, 불변식 §3-H)
   ▼
preview-ready  ── 검토 대기(이후는 SCHEDULE.md: 승인→슬롯→발행)
```

**핵심 한 줄**: 업로드 1건은 **켜진 채널 수만큼 content(형제)**로 갈라지고(fan-out), 각 형제는
**자기 kind 워처**가 **단 한 번만** 작성한다. 글이 안 나오는 건 대부분 **고장이 아니라**
질문에 답을 안 했거나(awaiting-answers), 켜진 채널이 0개라(B6) 만들 게 없는 정상 상태다.

> **"버그 아님" 정당 사유 목록** (진단 전 먼저 확인):
> - **질문 0개인데 글이 나옴 = 정상.** 분류 파싱 실패·누락 사진은 전부 ambient 폴백이라 질문 없이
>   진행된다(§6 '분류 침묵 방어').
> - **비슷한 사진만 3장 미만 = 블로그 정당 실패.** 프롬프트 규칙상 distinct 이미지 3장 미만이면
>   `success:false`로 실패 처리(억지 채움 금지). **인스타는 다르다**: 뚜렷한 장면 3개 미만이면
>   실패가 아니라 **single(단일 이미지) 폴백**으로 계속 간다 — 채널 비대칭이 설계다.
>   (blog-agent-prompt.md 이미지 선별 규칙 / select-insta-slides.ts 단일 폴백·`slides<3 → single`)
> - **B6(채널 0개)는 event='generated'로 종결** — 나중에 채널을 연결해도 자동 재생성 없음(§5).

> **두 진입 모드** (event-watcher 가 분기):
> - **질문 경로(기본)**: `prepareAndClassify` → `awaiting-answers` → 사장님 답 → `writing` → 워처가 작성.
> - **자동 경로(`event.autoGenerate=true`)**: `generateAll` → 질문 없이 `autoWrite` → 곧바로 작성.
>   백로그 자동 적재용. 이땐 content를 `generating`에 직접 두고 generateAll이 모든 kind를 손수
>   작성한다(write-*-watcher는 'writing'만 보므로 안 집음 = 이중 처리 없음).

---

## 2. 파일 지도 — 생성은 여기에만 산다

| 역할 | 파일 | 무엇 |
|---|---|---|
| **업로드 감지(진입점)** | `worker/src/triggers/event-watcher.ts` | `events`(generationKind='blog', status='uploaded') 감시 → 게이트·claim 후 prepare/generateAll. |
| **분류·질문(1단계)** | `worker/src/blog/generate-blog.ts` `prepareAndClassify` (:256) | 사진 다운로드·중복제거·분류 → fan-out content 생성 → awaiting-answers. |
| **블로그 작성(2단계)** | `worker/src/blog/generate-blog.ts` `writeBlog` (:398) | photoPlan 답+shape+tone → 본문·이미지·썸네일 → preview-ready. **모델**(COST-1, 2026-07-06): 본문=`config.blogWriteModel`(기본 opus, env `BLOG_WRITE_MODEL`)·사진분류=`config.classifyPhotosModel`(opus)로 명시 고정(계정 기본 드리프트 방지). 제목 보강만 sonnet. |
| fan-out content 생성 | `worker/src/blog/generate-blog.ts` `createFanoutContents` (:93) | kind마다 content 문서(같은 plan). 부분 실패 시 형제 self-clean(failed). |
| **채널→생성종류 결정** | `worker/src/channels/resolve-generation-channels.ts` | 켜진 채널 → ['blog','insta-carousel','facebook']. undefined=레거시→['blog']. |
| 채널 읽기 | `worker/src/firestore/channels.ts` `getChannelsForTenant` | `tenants/{tid}.channels` 맵 읽음. 맵 없음=undefined, 연결 0개=`[]`(B6). |
| 인스타 작성 | `worker/src/insta/generate-insta-carousel.ts` `writeInstaCarousel` | 카루셀 작성(자체 격리 폴더·GCS 독립). 커버 텍스트는 결정론(§5-b). |
| 페북 작성 | `worker/src/facebook/generate-facebook.ts` `writeFacebook` | 인스타 preview 복사 재사용. **재사용 게이트(gen-3) 4조건**: ①상태∈{preview-ready·approved·scheduled·published} ②images≥1 ③정책 신선(`isPolicyStale` 아님 — 옛 정책 복사 금지, 자체 렌더로 현행 정책 보장 = 채널 비대칭 방지) ④레거시 이식본(`legacyPostNumber`)은 정책 무관 재사용. 하나라도 탈락 시 자체 렌더(`findReusableInstaSibling`). |
| 제목 키워드 보강 | `worker/src/blog/title-keyword.ts` | 조건부 3번째 소형 호출(§6). 실패=원제목 유지·발행 비차단. |
| 분류 결과 파서 | `worker/src/blog/classify-result.ts` `parseClassifyItems` | 침묵 방어: 파싱 실패·누락 사진=ambient 폴백(§6). |
| **작성 트리거(블로그)** | `worker/src/triggers/write-blog-watcher.ts` | `contents`(state='writing', kind='blog') → claim → writeBlog. |
| **작성 트리거(인스타)** | `worker/src/triggers/write-insta-watcher.ts` | 같은 패턴, kind='insta-carousel'. |
| **작성 트리거(페북)** | `worker/src/triggers/write-facebook-watcher.ts` | 같은 패턴, kind='facebook'. |
| 자동 경로 | `worker/src/blog/generate-all.ts` `generateAll` | autoGenerate=true: 분류→모든 kind 직접 작성(질문 생략). |
| **답 저장(앱)** | `src/app/api/content/[contentId]/answers/route.ts` | 답 병합 + 형제 전부 awaiting-answers→writing(한 트랜잭션, GEN-04). |
| **사진 위 글자 규칙 저장(앱)** | `src/app/api/profile/rules/route.ts` | 사진 위 글자(썸네일·오버레이)의 **금칙어 + 대체어** 저장 — `profile.imageTextBannedWords`/`imageTextSubstitutions` merge(다른 프로필 필드 보존). 저장 즉시 **미발행 글(검토대기·예약)의 썸네일/커버를 새 규칙으로 재렌더**(thumbRerender 마킹, chunk 배치). 향후 생성·발행은 자동 적용, 발행된 글은 불변. 아우르메 "'마사지' 제외" 정책이 여기로 들어간다(RULES §2). |
| **음성 받아쓰기(앱→워커)** | `src/app/api/voice/transcribe/route.ts` → `worker/src/triggers/voice-cleanup-watcher.ts` | 녹음 오디오 → GCS 업로드 → `workerJobs kind='voice-transcribe'` 큐 → 워커 faster-whisper 받아쓰기 + Claude 정리 → `voiceCleanupResults`. **좀비 주의(아래 노트)**: 워처 이름은 voice-cleanup이나 실제 감시 kind는 `voice-transcribe`. |
| **선점 CAS** | `worker/src/firestore/contents.ts` `claimForWriting` (:122) | writing→generating 원자 전이. expectedKind 일치 시에만(gen-6). |
| | `worker/src/firestore/events.ts` `claimEventForClassify` (:208) | uploaded→generating 원자 전이(이벤트 단위 멱등). |
| event 상태 파생 | `worker/src/firestore/events.ts` `reconcileEventStatus` (:178) | 형제 content 상태에서 event 상태 파생(부분 성공 보존, GEN-02). |
| **비용 게이트** | `worker/src/account/gate-check.ts` `tenantAllowsAiWork` | 비활성/정지면 false → 생성·claim 스킵(Claude 0). |
| 멈춤 회수기 | `worker/src/recovery/stuck-reaper.ts` `reapStuck` | 하드 크래시로 generating에 갇힌 글 회수(GEN-01 중복생성 가드 포함). |
| 생성 하트비트 | `worker/src/recovery/generating-heartbeat.ts` | 작성 내내 generatingAt 갱신(STB-05 거짓 회수 방지). |
| **수정요청 처리** | `worker/src/triggers/revision-request-watcher.ts` | revising → 재작성 → preview-ready(상태 CAS 가드 PSA-07). |
| 예약 복원 | `worker/src/content/policy-refresh.ts` `restoreScheduleAfterRewrite` | 재생성 후 원 예약시각 복원(예약글이었으면). |
| 실패 알림 | `worker/src/blog/generate-blog.ts` `notifyGenerationFailed` (:54) | 생성 실패를 사장님 인앱에 알림(무음 방지). |

> ⚠️ **voice-cleanup-watcher = 좀비 회피 상태(코드 주석에만 있던 사실 정본화)**: `voice-cleanup-watcher.ts:34` 주석대로, **옛 `voice-cleanup` kind는 6/2부터 떠 있는 별도 좀비 워커가 여전히 잡고 있어**, 신 워커는 충돌을 피하려고 `kind=='voice-transcribe'`만 감시한다(faster-whisper 받아쓰기 + Claude 정리). 파일명·로그(`voice-cleanup`)와 실제 감시 대상(`voice-transcribe`)이 어긋나 보이는 건 이 좀비 회피 때문이지 버그가 아니다 — 좀비 워커를 정리하기 전엔 이 비대칭을 건드리지 말 것. (PIPELINE §3 동일 노트.)

---

## 3. 🔒 불변식 (이걸 깨면 생성이 망가진다 — 새 작업 시 보존 필수)

| # | 불변식 | 왜(깨지면) | 지키는 코드 |
|---|---|---|---|
| **A** | **한 글은 정확히 한 번만 작성** — `writing`→`generating` 전이를 **claimForWriting(트랜잭션 CAS)**으로. 워처는 claim이 true일 때만 작성한다. | 비원자면 두 워처/재시작 초기 스냅샷이 같은 글을 동시에 집어, 둘째가 첫째가 지운 작업폴더 위에서 **빈 이미지로 preview를 덮어쓴다** | contents.ts:122 claimForWriting / write-*-watcher.ts claim 후 작성 |
| **B** | **kind별 워처 분리 + claim에서 kind 재검증** — write-blog/insta/facebook-watcher가 같은 `state=='writing'`을 보지만 **인-코드 `c.kind` 필터** + **claimForWriting(expectedKind)** 둘로 걸러 자기 kind만 작성. | 형제(blog·insta·fb)가 같은 'writing'을 공유하므로, kind 게이트가 없으면 한 워처가 엉뚱한 kind를 집어 작성한다 | write-blog-watcher.ts:39·48 / claimForWriting expectedKind(:131) |
| **C** | **켜진 채널 0개면 생성 생략(B6)** — `resolveGenerationChannels`가 `[]`면 content를 안 만들고 운영자에게 채널연결 알림. **event는 'generated'로 종결**(재큐 없음 — 나중에 채널을 연결해도 그 업로드는 자동 재생성되지 않는다, 재업로드 필요). 비활성/정지(claim 안 함 = uploaded 잔류, 나중 처리)와 **정반대**다(§5 대비표). | 발행 불가능한 글을 만들면 승인 후 'not-connected'로 죽고(과거 버그), 0개를 ['blog']로 폴백하면 채널 없는 신규가 발행 못 할 블로그를 받는다 | resolve-generation-channels.ts(빈 배열) / generate-blog.ts B6 블록(`setEventStatus('generated')`) |
| **D** | **형제 부분 실패가 흐름을 안 깬다** — 한 채널 작성 실패가 다른 채널을 멈추지 않는다. event 상태는 **형제 상태에서 파생**(any 성공=generated, 전부 실패=failed, 진행중 남으면 보존). | 형제 무조건 덮어쓰기면 인스타 성공한 글이 페북 실패로 'failed'가 되어 검토에서 사라진다 | reconcileEventStatus(:178, GEN-02) / generateAll writeOne 격리 |
| **E** | **이벤트 단위 멱등(1업로드→1벌)** — `claimEventForClassify`(uploaded→generating CAS)로 분류를 한 번만. 멈춤 회수기는 **이미 content가 있으면 event를 requeue 안 함**. | 같은 event를 두 번 분류하면 fan-out이 두 벌 돌아 **1업로드→2글 중복 생성** | claimEventForClassify(:208) / stuck-reaper.ts:83 GEN-01 가드 |
| **F** | **비활성/정지면 생성 안 함(비용 게이트)** — event-watcher·write-*-watcher 모두 작성 전 `tenantAllowsAiWork` 확인. | 정지·비활성 가게에 Claude 호출이 나가 비용 발생 + 발행 못 할 글 양산 | gate-check.ts tenantAllowsAiWork / 각 워처 첫 줄 |
| **G** | **실패는 조용히 죽지 말고 알린다** — 사진 0장·LLM 실패·이미지 전부 실패 시 content를 failed로 두고 **사장님 인앱 알림**. 사진 일부 누락(>30%)은 운영자 알림. | 조용히 종료되면 사장님은 "사진 올렸는데 글이 안 나옴"만 보고 원인을 모른다(무음 실패) | notifyGenerationFailed(:54) / ensurePhotos 누락 알림(:222) |
| **H** | **policyVersion 도장 필수** — 블로그·인스타·페북 **writer 셋 다** preview 저장 시 `policyVersion: CONTENT_POLICY_VERSION`을 함께 도장한다. **새 채널 writer를 추가하면 반드시 복제**(§8 체크리스트 8). | 누락하면 `isPolicyRefreshTarget=true`로 **발행 직전 영구보류** + policy-refresh 크론이 **매일 재생성하는 무한루프**(policy-1 실사고). [[BLUEPRINT §4 정책버전]] | generate-blog.ts naverInput 저장 블록 / generate-insta-carousel.ts instaInput 저장 블록 / generate-facebook.ts policy-1 주석 블록 |

> **재생성(정책버전·설정저장)이 예약된 글을 다시 쓸 때**: 원 예약시각을 `restoreScheduledAt`에
> 보존했다가 작성 완료 시 `scheduled`로 **원자 복원**(`restoreScheduleAfterRewrite`, CAS).
> terminal(published·deleted·failed)이면 건드리지 않는다. 이 경로를 깨면 예약이 통째 날아간다.
> [[정책버전=BLUEPRINT §4]] / 자세한 예약 보존 = SCHEDULE.md §3-E.

### 3-b. ⛔ 프롬프트 절대룰 3종 (모든 생성 경로에 강제 — 채널·프롬프트 추가 시 복제 필수)

콘텐츠 최상위 정책. **블로그·인스타·수정 3경로 전부**에 박혀 있고, **수정요청이 이와 충돌하면
절대룰이 우선**한다(요청 의도는 살리되 거짓은 안 됨 — revise-content.md의 명시 규칙).

| # | 절대룰 | 어디에 박혀 있나 |
|---|---|---|
| 1 | **글 시점 = 가게(사장님) 본인.** 손님·방문객·체험단 위장 = 사기, 절대 금지. (출장 업종의 "우리가 갔다" 1인칭은 사실이라 허용) | blog-claude.ts 프롬프트 "시점 (절대 규칙)" 절 · prompts/blog-agent-prompt.md 문장·톤 규칙 · insta/select-insta-slides.ts 캡션 지시 · prompts/revise-content.md "절대 규칙" 1 |
| 2 | **도입부 인사말 금지.** "안녕하세요 OOO입니다" 류 시작 금지 — 첫 문장부터 현장·장소로 진입. | prompts/blog-agent-prompt.md 문장·톤 규칙 · insta/select-insta-slides.ts 캡션 지시 · prompts/revise-content.md "절대 규칙" 2 |
| 3 | **거짓 단정 금지.** 사진·원본·고객 입력에 근거 없는 사실(산지·효능·속설)을 지어내지 않는다. 확인된 것만. | prompts/blog-agent-prompt.md("사진에서 확인 안 되는 디테일을 지어내지 말 것") · prompts/revise-content.md "절대 규칙" 3 |
| 4 | **글감 기반 글은 landing(가게 약속)까지 착지 (GLAM-9, 2026-07-05).** `## 글감 원안`이 있으면 본문 마지막 1~2문단이 글감의 landing으로 끝맺는다(1원칙 "사진에서 본 것만"의 유일 예외=사장 승인 사실, 취지 안·과장금지). **사진 전부가 글감 소재와 딴판이면 `success:false` 실패 반환**(사진에 끌려 글감을 조용히 갈아끼우는 침묵 폐기 금지). 착지 원칙 = 헌법 §6 최상위. | prompts/blog-agent-prompt.md "🧲 글감 원안 착지" · blog-claude.ts `buildAngleSection` 헤더 · classify-photos.ts angle 주입(질문 상류 관통) |

**새 채널 writer·새 프롬프트를 추가하면 이 3룰을 반드시 복제한다**(§8 체크리스트 9).
관련 메모리: [[feedback_business_owner_voice]]·[[feedback_no_greeting_opening]].

---

## 4. 상태 기계 (글 하나의 일생 — 생성 구간)

```
event:   uploaded → (claim) → generating → (content 생성됨) → generated / failed
                                              │ (형제 상태에서 파생: reconcileEventStatus)

content: generating(초기) → awaiting-answers → (답 저장) → writing → (claim) → generating → preview-ready
                                  │ (autoWrite면 awaiting-answers 건너뛰고 generating 유지)
                                  └──────── 모든 실패 경로 ──────→ failed (+ 사장님 알림)

수정:    preview-ready/approved → (수정요청) revising → (재작성) → preview-ready
                                                    │ (실패) → failed (state==revising일 때만, PSA-07)
```

- **uploaded**: 업로드 직후. event-watcher가 집기 전.
- **awaiting-answers**: 사진 질문 대기. 검토 화면 "질문에 답해주세요" 배너. 아직 글 본문 없음.
- **writing**: 답이 채워짐. write-*-watcher가 곧 집어 작성. (앱이 답 저장 시 전환)
- **generating**: 작성 중("글 쓰는 중"). claimForWriting이 선점한 상태. 하트비트로 살아있음 표시.
- **preview-ready**: 본문·이미지 완성, 검토 대기. **이후는 SCHEDULE.md.**
- **failed**: 어느 단계든 실패. 사장님/운영자 알림. (운영자 재시도·재생성 가능)
  **정당 실패 포함**: 블로그는 distinct 이미지 3장 미만이면 `success:false` 실패가 설계다
  (억지 채움 금지 — §1 정당 사유 목록). 인스타는 같은 상황에서 실패 아닌 single 폴백.
- **revising**: 사장님이 수정요청. revision-request-watcher가 재작성.

---

## 5. fan-out 규칙 (한 업로드가 몇 개 글이 되나)

`resolveGenerationChannels(getChannelsForTenant(tenantId))` 한 줄이 결정한다:

| 채널 상태(`tenants/{tid}.channels`) | 결과 | 의미 |
|---|---|---|
| 맵 자체가 없음/빈 `{}` | `undefined` → `['blog']` | **레거시 테넌트**(채널 개념 없음). 회귀 안전 폴백. |
| naver `connected && !paused` | `'blog'` 포함 | 네이버 블로그 글 생성. |
| instagram `connected && !paused` | `'insta-carousel'` 포함 | 인스타 캐러셀 생성. |
| facebook `connected && !paused` | `'facebook'` 포함 | 페북 게시물 생성. |
| 맵은 있으나 연결 0개 | `[]` → **생성 생략(B6)** | 발행 채널 없음 → 글 0개 + 운영자 알림 + **event='generated' 종결**. ['blog'] 폴백 **금지**. |

- **youtube/reels**는 여기 범위 밖 — 영상 파이프라인(편집본 워처)이 별도로 생성한다.
- fan-out된 형제는 **같은 photoPlan·같은 답**을 공유한다(answers API가 형제 전부에 전파).
- **형제는 같은 `state=='writing'`을 공유**하므로 워처는 반드시 kind로 걸러야 한다(불변식 §3-B).
- `primaryId` = blog(있으면) 우선, 없으면 첫째 — 레거시 E2E가 기대하는 반환 contentId.

**"글 안 만들어짐" 두 경로 대비 (정반대 — 혼동 금지)**:

| 경로 | event 상태 | 나중에 조건이 풀리면 |
|---|---|---|
| **B6 (채널 0개)** | `'generated'`로 **종결** | 자동 재생성 **없음** — 채널 연결 후 **재업로드** 필요 |
| **비활성/정지 (비용 게이트)** | `uploaded` **잔류**(claim 안 함) | 계정 복구 시 워처가 **집어서 자동 처리** |

### 5-b. 형제 간 순서 의존 (커버 결정론 + 채널 작성 순서)

fan-out 형제는 병렬이지만 **두 가지 순서 의존**이 있다 — 뒤집으면 조용히 깨진다:

1. **인스타 커버 텍스트는 결정론** (`buildCoverText`, generate-insta-carousel.ts):
   - 커버 제목 = **행사명(form.eventName) 우선**. Claude가 돌려준 커버 `line1`/`line2`는
     **무시된다**(프롬프트에도 명시) — **프롬프트를 고쳐도 커버 문구는 안 바뀐다.**
   - 행사명이 비었을 때만 **블로그 형제의 SEO 제목(preview.caption)을 최대 180초 폴링 대기**
     (`waitForBlogTitle` — 블로그·인스타가 동시에 'writing' 진입하는 팬아웃 동시성 보정).
     블로그 형제가 아예 없으면(인스타 단독 업체) **즉시 null 폴백**(GEN-07, 무의미 폴링 방지)
     → 행사명·제목 둘 다 없으면 커버 제목 빈 채 진행.
   - 커버·부제는 사진 위 글자라 sanitizeImageText(테넌트 정책) 정화를 거친다.
2. **generateAll의 채널 순서** (generate-all.ts): **블로그 ∥ 인스타 동시 → 페북은 인스타 뒤.**
   페북은 인스타 형제의 완성 preview를 복사 재사용하므로(§2 gen-3), **순서를 뒤집으면
   재사용이 항상 실패해 페북이 매번 자체 렌더(비용·비일관)로 빠진다.** 워처 경로에서도
   페북 재사용은 인스타 완성 여부에 의존한다(미완성이면 자체 렌더 폴백 — 고장 아님).

---

## 6. 선점·멱등·회수 (중복 생성을 어떻게 막나)

생성에는 **두 층의 원자적 선점**이 있다:

1. **이벤트 층(`claimEventForClassify`)**: `uploaded`→`generating` CAS. 같은 업로드를 두 워커가
   동시에 집어도 한 명만 분류 → **1업로드→1벌 fan-out**(불변식 §3-E).
2. **콘텐츠 층(`claimForWriting`)**: `writing`→`generating` CAS + expectedKind 검증. 같은 글을
   두 워처가 집어도 한 번만 작성(불변식 §3-A·B).

**멈춤 회수기(stuck-reaper)** — 하드 크래시(OOM·SIGKILL·배포중단)로 `generating`에 갇힌 글을 회수:
- 판정: `generatingAt`(없으면 `createdAt`)이 임계(기본 **30분**, LLM 타임아웃 20분보다 길게)보다 오래됨.
- event 회수: `generating`→`uploaded` 재투입. **단 이미 content가 있으면 requeue 안 함**(GEN-01:
  fan-out이 이미 지났으므로 event를 되돌리면 또 한 벌 만든다 → 중복). 멈춘 content는 content 루프가 처리.
- content 회수: `generating`→`writing` 재투입(워처가 다시 집음). 상한(2회) 초과 시 failed+알림.
- **거짓 회수 방지(STB-05)**: writeBlog가 작성 내내 60초마다 `generatingAt`을 갱신(하트비트)해,
  본문(20분)+제목보강+이미지N개 변환이 30분을 넘겨도 멈춤으로 오인되지 않는다.

### 6-b. 제목 키워드 보강 — 조건부 3번째 Claude 호출 (블로그만)

본문 파싱 성공 후, **제목에 노출 키워드가 없을 때만** 발동한다(generate-blog.ts writeBlog ·
정책 원문 = title-keyword.ts 머리 주석):

- **후보 키워드**: seoKeywords를 **아직 순위에 안 잡힌(notYet) 키워드 우선**으로 정렬(T3-6 옵션3)
  → **금칙어 필터(`isProhibitedKeyword`)** 통과분 → **top 5**. 오염어가 seoKeywords에 남아 있어도
  제목에 능동 주입하지 않는다(§1-14 — 제목은 법적 리스크 최대 표면, [KEYWORD-TAGSET-RULES.md](KEYWORD-TAGSET-RULES.md)).
- **동작**: "제목만" 고치는 **소형 Claude 호출 1회**(전체 재생성 아님, 타임아웃 3분).
  강제 머지 금지 — 태그처럼 붙이면 제목 품질이 망가진다(2026-06-12 감사 정책).
- **실패 시**: 원제목 유지 + 경고 로그. **발행 차단 없음(비차단)** — 보강 실패는 failed 사유가 아니다.

### 6-c. 분류 침묵 방어 — 파싱 실패로 죽지 않는다 (`parseClassifyItems`)

분류(Claude 호출 1, 타임아웃 **5분** = classify-photos.ts)의 출력 파싱은 **어떤 경우에도 실패로
글을 죽이지 않는다**(classify-result.ts):

- **JSON 파싱 실패** → 사진 전부 **ambient 단일 아이템 폴백**(한 사진=한 아이템). 질문 0개로 글이
  나온다 = **정상**(§1 정당 사유 목록).
- **explain인데 질문이 비면** → ambient로 **강등**.
- **어느 아이템에도 안 들어간 사진** → 각자 ambient 단일 아이템으로 **보강(누락 0)**.
- 이미 다른 아이템이 소유한 사진은 제외(첫 아이템 우선), fileNames는 실존 파일과 교집합.

---

## 7. 수정 루프 (revising → 재작성)

사장님이 검토 화면에서 수정요청을 하면 content가 `revising`이 되고
`revision-request-watcher`가 감지한다:

- 최신 미해결 revisionRequest → `buildRevisionPrompt` → Claude(sonnet, 20분 타임아웃) 재작성.
- blog는 `naverInput.contentBlocks`까지 갱신(발행 소스 동기). 성공 시 `preview-ready` 복원.
- **상태 CAS 가드(PSA-07)**: 성공·실패 둘 다 **`state==='revising'`일 때만** 전이한다.
  수정 도중 사장님이 글을 삭제(revising→deleted)·자동승인 등으로 상태가 옮겨가면 **그 상태가
  진실** — 덮어쓰지 않는다(삭제·발행된 글 부활 금지). 이탈 시 onResolved·로그도 안 보낸다.

---

## 8. 🧪 생성을 안전하게 바꾸는 법 (새 작업 체크리스트)

생성 근처를 손댈 때 **이 아홉을 자문**한다:

1. **한 번만 쓰는가?** (claim CAS 우회·전이 순서 뒤집기 = 위반 §3-A)
2. **kind를 걸러내는가?** (새 워처가 `state=='writing'`을 보면서 `c.kind` 필터·expectedKind 없이
   작성 = 위반 §3-B. 형제 글을 엉뚱하게 덮어쓴다)
3. **채널 0개를 생성 생략으로 두는가?** (`[]`를 ['blog']로 폴백 = 위반 §3-C, B6 재발)
4. **형제 부분 실패가 흐름을 안 깨는가?** (event 무조건 덮어쓰기 = 위반 §3-D. reconcileEventStatus 사용)
5. **1업로드→1벌인가?** (event를 content 있는데 requeue·재분류 = 위반 §3-E 중복생성)
6. **실패가 알림을 내는가?** (조용히 return = 위반 §3-G 무음 실패)
7. **비활성/정지 가게를 거르는가?** (게이트 없이 Claude 호출 = 위반 §3-F 비용)
8. **새 writer가 policyVersion을 도장하는가?** (누락 = 위반 §3-H. 발행 영구보류 + 매일 재생성
   무한루프 = policy-1 실사고 재발)
9. **새 채널·새 프롬프트에 절대룰 3종을 복제했는가?** (시점=가게 본인·인사말 금지·거짓 단정 금지
   = §3-b. 누락 = 위장 후기 등 사기성 글 생성)

**검증**: 생성 변경은 **②에뮬레이터 통합 테스트 필수**(순수 로직만으론 경합·트랜잭션·형제 전파 못 잡음).
실 LLM 재생성(52 angle 풀 생성 등)은 **느리고 이미 통과** — 로직만 바꿨으면 invokeClaude를 모킹해
단위/통합으로 검증한다(메모리 [[feedback_no_rerun_52angle_generation]]). 관련 테스트 =
`worker/test/blog/*`·`worker/test/triggers/write-*-watcher.test.ts`·`worker/test/firestore/*claim*`·
`worker/test/channels/resolve-generation-channels.test.ts`.

---

## 9. 🔗 코드↔문서 매핑 (규칙이 사는 곳 — 색인, 정본은 각 §)

> 형식 규율([CONTENT-ROTATION-CONSTITUTION.md](CONTENT-ROTATION-CONSTITUTION.md) §12의 개선판,
> 2026-07-05 일관성 감사 권고): **라인 번호 금지**(밀림 확정), **파일 + 함수·마커 주석 + 규칙
> 한 줄 요약**으로 쓴다. 이 표는 색인일 뿐 — 규칙 본문은 해당 §가 정본이다.
> 코드·규칙이 바뀌면 **해당 § + 이 표를 같이 갱신**한다.

| 규칙(한 줄) | 문서 § | 코드 (파일 · 함수/마커) |
|---|---|---|
| 한 글은 한 번만 작성 (writing→generating CAS) | §3-A | `worker/src/firestore/contents.ts` · `claimForWriting` |
| kind 재검증 (형제 오작성 방지) | §3-B | `write-*-watcher.ts` kind 필터 · `claimForWriting(expectedKind)` (gen-6) |
| 채널 0개=생성 생략 + event 'generated' 종결 | §3-C·§5 | `worker/src/blog/generate-blog.ts` · B6 블록(`setEventStatus('generated')`) / `resolve-generation-channels.ts` |
| event 상태는 형제에서 파생 (부분 성공 보존) | §3-D | `worker/src/firestore/events.ts` · `reconcileEventStatus` (GEN-02) |
| 1업로드→1벌 (분류 멱등 + requeue 가드) | §3-E·§6 | `events.ts` · `claimEventForClassify` / `stuck-reaper.ts` · GEN-01 가드 |
| 비활성/정지=생성 안 함 (uploaded 잔류) | §3-F·§5 대비표 | `worker/src/account/gate-check.ts` · `tenantAllowsAiWork` |
| 실패=사장님 알림 (무음 금지) | §3-G | `generate-blog.ts` · `notifyGenerationFailed` (GEN-03 인스타·페북 대칭) |
| policyVersion 도장 (누락=발행 영구보류 루프) | §3-H | `generate-blog.ts`·`generate-insta-carousel.ts` 저장 블록 / `generate-facebook.ts` · policy-1 주석 |
| 절대룰① 시점=가게 본인 | §3-b | `blog/blog-claude.ts` "시점 (절대 규칙)" · `prompts/blog-agent-prompt.md` · `insta/select-insta-slides.ts` · `prompts/revise-content.md` 절대 규칙 1 |
| 절대룰② 도입부 인사말 금지 | §3-b | `prompts/blog-agent-prompt.md` · `select-insta-slides.ts` · `revise-content.md` 절대 규칙 2 |
| 절대룰③ 거짓 단정 금지 (수정요청보다 우선) | §3-b | `prompts/revise-content.md` 절대 규칙 3~4 · `blog-agent-prompt.md` |
| 블로그 distinct<3=정당 실패 / 인스타=single 폴백 | §1·§4 | `prompts/blog-agent-prompt.md` 이미지 선별 규칙 / `select-insta-slides.ts` · `parseInstaResult`(`slides<3 → single`) |
| 제목 보강=조건부 소형 호출·비차단·금칙어 제외 | §1·§6-b | `blog/title-keyword.ts` · `rewriteTitleWithKeyword` / `generate-blog.ts` · `orderKeywordsByNotYet`+`isProhibitedKeyword` |
| 페북 재사용 게이트 4조건 (gen-3) | §2 | `facebook/generate-facebook.ts` · `findReusableInstaSibling` |
| 커버 텍스트 결정론 + 블로그 제목 180초 폴링 | §5-b | `insta/generate-insta-carousel.ts` · `buildCoverText`·`waitForBlogTitle` (GEN-07) |
| 채널 순서: 블로그∥인스타 → 페북 뒤 | §5-b | `blog/generate-all.ts` · `writeOne` Promise.all 2단 |
| 분류 침묵 방어 (ambient 폴백·강등·누락 보강) | §1·§6-c | `blog/classify-result.ts` · `parseClassifyItems` / `classify-photos.ts` 타임아웃 5분 |
| 재생성 후 예약 복원 (CAS) | §3 비고 | `content/policy-refresh.ts` · `restoreScheduleAfterRewrite` |
| 하트비트 (거짓 회수 방지) | §6 | `recovery/generating-heartbeat.ts` (STB-05) · 각 writer `startGeneratingHeartbeat` |
| 수정 루프 상태 CAS (revising일 때만 전이) | §7 | `triggers/revision-request-watcher.ts` (PSA-07) |

> **유지 규율**: 생성 흐름·불변식·파일이 바뀌면 이 문서를 **즉시 갱신**(STATUS·SCHEDULE·BLUEPRINT처럼
> 드리프트 없이). GEN(생성 정확성) 감사 = BUG-REGISTER 참조. 이 문서가 생성 흐름의 상위 단일 진실이다.
