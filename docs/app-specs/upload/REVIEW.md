# NGN Upload — 검토·승인 (③) 단일 지도 ✅

> **⚠️ 글 검토 화면·승인·수정요청·자동승인 코드를 건드리기 전에 반드시 먼저 읽는다.**
> 이 도메인 = **글이 생성된 뒤(`preview-ready`) → 사장님이 앱에서 보고 → 승인/수정요청/삭제**.
> 앞단(생성)은 [GENERATION.md](GENERATION.md), 승인 **뒤** 일정배정·발행은 [SCHEDULE.md](SCHEDULE.md)가 담는다.
> 이 문서는 그 사이 — **"사람이 글을 통과시키는 관문"** 하나만 다룬다.
>
> 📸 **PUB 관문 A(2026-07-08, 회수 루프는 미작동 — 2026-07-10 페이블 감사)**: `content.photoIssues`가 있으면 검토화면 held배너에 구체 안내 노출 + 승인·예약 차단(`canApprove/canScheduleContentState`+CAS) — **이 절반은 동작·배포됨**. ⛔ **회수("사진 더 올리기"→/edit·"다시 만들기"→regenerate)는 코드상 닫히지 않음**(event 톱레벨 gcsPath 부재로 /edit 폴백 死 + add-images가 sourceFiles 미갱신→재생성이 새 사진 못 봄). 상세·정본=[BUG-REGISTER.md](BUG-REGISTER.md) PUB.
>
> 근거: 2026-06-28 코드 실측(상태전이·검토UI·승인API·수정루프·자동승인) + 2026-07-04 수정루프 알림 배선(REVI-1·REVI-2) 실코드 반영
> + **2026-07-05 문서↔코드 일관성 감사 8건 정정**(불변식① 오서술·미문서 전이 3종·클라 CAS·approve-7·sweep 알림/토글 규칙·큐 필터·revising skip — [감사 리포트](superpowers/audits/2026-07-05-doc-code-consistency-audit.md)). 버그·갭은 BUG-REGISTER.

---

## 1. 한눈 흐름

```
[검토 목록]  useReviewPending  (state=="preview-ready"만, 옛글·발행보류 필터)
   │   src/hooks/useReviewPending.ts:70~145  ·  화면 src/app/(mobile)/review/page.tsx
   ▼
[상세 검토]  detail/[id]/page.tsx
   ├─ [승인] ───────→ approve()            state="approved" + history(by:"customer")
   │                   useContentActions.ts:41~74 (승인·예약 앞단에 approve-7 채널 게이트 — §3-b)
   │                       └─ approved-watcher가 감지 → 일정배정(§SCHEDULE)
   │
   ├─ [예약] ───────→ schedule(at)          state="scheduled" **직행**(approved 미경유) + scheduledAt
   │                   useContentActions.ts:80~115 — §3 불변식①의 두 번째 갈래
   │
   ├─ [AI 수정요청] ─→ requestRevision(text)  state="revising" + revisionRequests
   │                   useContentActions.ts:117~155
   │                       └─ revision-request-watcher → Claude 재작성 → 다시 preview-ready
   │                           ├─ 완료 알림(REVI-1): 커밋 시 onResolved → 사장님 push+텔레그램
   │                           └─ 실패 시 failed + 알림(REVI-2): generation-failed(운영자+사장님)
   │                               └─ failed → [다시 시도] retryRevision() → state="revising" 복귀
   │
   ├─ [직접 편집] ──→ 썸네일/캡션/사진 수정    state="preview-ready" 유지(관문 안 넘음)
   │                   detail/[id]/page.tsx:157~173, 366~393
   │
   ├─ [예약 취소] ──→ unschedule()          scheduled → state="preview-ready" + customerTouched
   │                   useContentActions.ts:271~306
   │
   └─ [삭제/거절] ──→ deleteContent()        state="deleted" (soft, 검토 쿼리서 빠짐)
                       useContentActions.ts:313~341

[자동승인(검토 OFF)]  settings/publish-mode 토글 autoApprove false→true
   └─ auto-approve-sweep-watcher → approveIfPreviewReady(CAS) → state="approved" (by:"system")
```

상태 enum 단일 정의: `src/types/content.ts:4~14`
`generating·awaiting-answers·writing·preview-ready·approved·revising·scheduled·published·failed·deleted`

---

## 2. 검토 화면 (앱 UI)

| 역할 | 파일:줄 |
| --- | --- |
| 검토 대기 목록 화면 | `src/app/(mobile)/review/page.tsx:15~52` |
| 검토 대기 쿼리(실시간) | `src/hooks/useReviewPending.ts:70~145` (`where("state","==","preview-ready")` + 아래 2필터) |
| 상세 검토 화면 | `src/app/(mobile)/detail/[id]/page.tsx` |
| [승인] 버튼 | `detail/[id]/page.tsx:894~906` (`canAct = preview-ready && !held`) |
| [AI 수정요청] 버튼 → RevisionSheet | `detail/[id]/page.tsx:868~878` · `src/components/RevisionSheet.tsx` |
| [삭제] (더보기 → DeleteSheet) | `detail/[id]/page.tsx:581` |
| 썸네일 직접수정(디자인·글자·사진) | `detail/[id]/page.tsx:629~717` → 저장 `:157~173` `/api/content/{id}/thumbnail-photo` |
| 캡션 직접수정(인스타·페북) | `detail/[id]/page.tsx:366~393` |

**검토 큐 필터 2종** (`useReviewPending.ts:102~105`, 판정 함수 = `src/lib/content-edit.ts:21~31`):

1. **옛글 숨김 + 예외**: `isLegacyContent`(legacyPostNumber 있거나 source="sns-auto-poster")면 숨김 —
   **단 `customerTouched=true`(사장님이 직접 손댄 글, 예: 예약 취소 도장 §3)면 예외로 표시**. 이 예외가
   없으면 레거시 글을 예약 취소한 순간 그 글이 검토 큐에도 예약 목록에도 없는 **미아**가 된다.
2. **발행 보류 숨김**: `isHeldContent` = **`pauseReason`이 비공백 문자열**이면 보류 판정 — 승인해도 발행
   게이트가 막으므로 검토 큐에 일반 글처럼 보이면 혼란만 준다.

> **직접 편집은 관문을 넘지 않는다**: 썸네일·캡션·사진을 바꿔도 state는 `preview-ready` 그대로 — 사장님이
> [승인]을 눌러야만 `approved`로 간다. (편집 = 글을 다듬는 것, 승인 = 통과시키는 것. 둘은 분리.)

---

## 3. 상태 전이 ★불변식★

| 전이 | 일으키는 곳 | CAS 가드 | 무엇을 쓰나 |
| --- | --- | --- | --- |
| preview-ready → **approved** (사장님 승인) | `useContentActions.ts:41~74` `approve()` | ✅ preview-ready만 (approve-6) | state="approved" + history(by:"customer") |
| preview-ready → **scheduled** (사장님 직접 예약, **approved 미경유 직행**) | `useContentActions.ts:80~115` `schedule(at)` | ✅ preview-ready만 (RVW-02) | state="scheduled" + `scheduledAt` + history(note:"예약: …") |
| preview-ready → **revising** (수정요청) | `useContentActions.ts:117~155` `requestRevision()` | ✅ preview-ready만 (RVW-02) | state="revising" + `revisionRequests` arrayUnion |
| failed → **revising** (수정 실패 다시 시도) | `useContentActions.ts:161~192` `retryRevision()` | ✅ failed만 (RVW-02) | state="revising"만(새 요청 안 만듦 — 마지막 미해결 요청을 워커가 재처리) |
| scheduled → **preview-ready** (예약 취소) | `useContentActions.ts:271~306` `unschedule()` | ✅ scheduled만 (RVW-02) | state="preview-ready" + `scheduledAt` 삭제 + **`customerTouched:true`**(레거시 글 미아 방지 — §2 필터 1 예외와 짝) |
| revising → **preview-ready** (수정 완료) | `worker/.../revision-request-watcher.ts:148~187` | ✅ 트랜잭션, state 이탈 시 abort | state="preview-ready" + history(by:"claude") + **커밋 시에만 onResolved → 사장님 알림(REVI-1)** |
| preview-ready → **deleted** (거절) | `useContentActions.ts:313~341` `deleteContent()` | ❌ **유일하게 가드 없는 전이**(무가드 batch) | state="deleted" (soft) — 본인+형제(`alsoIds`) 일괄. "미발행 글만 넘길 것"은 코드 강제가 아니라 **호출부 책임**(주석 규율뿐) |
| approved → **scheduled** (일정배정) | `worker/.../approved-watcher.ts:15~56` | (워커) | → [SCHEDULE.md](SCHEDULE.md) `assignSlotForContent` |

**불변식 ①** — `scheduled` 진입은 **세 갈래**다: ⓐ `approved` 경유(사장님 `approve()` · 자동승인
`approveIfPreviewReady()` → approved-watcher가 일정배정) ⓑ **사장님 직접 예약 `schedule(at)`**
(preview-ready → scheduled 직행, approved 미경유 — 워커 slot-fire가 `scheduledAt` 도래 시 발행)
ⓒ **운영자 재발행**(`failed` → scheduled, `admin/content/[contentId]/republish/route.ts:34~40`,
버튼 `detail/[id]/page.tsx`): PUB-01로 `failed`된 글의 `publishStartedAt` 표식을 지우고
`state=scheduled`·`scheduledAt=now`로 되돌려 즉시 재발행 큐에 올림. (워커 내부 복원 2곳
`fire-publish.ts`·`policy-refresh.ts`도 scheduled로 되돌리는 경로 — §4 각주.)
~~"다른 경로로 scheduled에 바로 못 간다"~~는 옛 오서술이었다(2026-07-05 감사 정정). `published`는
여전히 워커 발행 경로만 쓴다.

**불변식 ②** — **모든 상태 전이는 소스 상태 CAS**: 워커 자동승인(`worker/src/firestore/contents.ts:98~114`
`approveIfPreviewReady`, approve-2)만이 아니라 **클라 전이 5종 전부**(승인·예약·수정요청·재시도·예약취소)가
`runTransaction` + 소스 상태 가드(`src/lib/approve-gate.ts:17~40` `can*ContentState`, approve-6·RVW-02)다.
blind updateDoc이 아니다 — 이미 종결된 글(published·deleted)이 연타·여러 탭으로 되살아나 중복발행되는
경로를 막는다. 소스 상태가 아니면 **no-op**(트랜잭션 성공 — 사용자에겐 "이미 됨"). **유일한 예외 =
`deleteContent`**(무가드 batch, 위 표 참조).

### 3-b. 승인·예약 직전 채널 사전검증 (approve-7)

승인/예약을 누르면 발행이 시작되는데 그 채널이 미연결이면 발행 직전에 조용히 실패한다 — 사장님은 "올라가요"
토스트까지 보고 나서야 알게 된다. 이 실패를 **관문 앞단으로 당긴** 게이트:

| 요소 | 코드 | 규칙 |
| --- | --- | --- |
| kind→채널 매핑 + 판정 | `src/lib/approve-gate.ts:42~73` `approveBlockedChannelLabel` | blog→네이버(connected+세션 ready), insta-carousel·reel→인스타그램, facebook→페이스북, shorts→유튜브 |
| 차단 동작 | `detail/[id]/page.tsx:400~408` `blockIfChannelNotReady` | 미준비면 승인/예약 중단 + 토스트("○○을 먼저 연결해야 발행돼요") + 1.2초 뒤 `/onboarding/channels` 이동 |
| 적용 지점 | `handlePublishNow` · `handleSchedule` | **승인과 직접 예약 둘 다** 이 게이트를 먼저 통과 |
| 통과 폴백 | 채널 정보 **로딩 중** · **미지 kind** | 막지 않고 통과(거짓 차단 방지) — **백스톱 = 워커 발행 게이트**(fire-publish의 connected 판정, [CHANNELS.md](CHANNELS.md)) |

---

## 4. 수정요청 루프 (revising → preview-ready)

| 단계 | 파일:줄 |
| --- | --- |
| 1. 사장님 입력 | `src/components/RevisionSheet.tsx` |
| 2. 요청 저장 | `src/hooks/useContentActions.ts:117~155` (state=revising + revisionRequests) |
| 3. 워커 감지 | `worker/src/triggers/revision-request-watcher.ts:44~76` |
| 3-b. **skip 규칙** | `revision-request-watcher.ts:105~109` — **마지막 요청에 `resolvedAt`이 이미 있으면 경고 로그만 남기고 skip**(새 요청 없이 state만 revising인 비정상 상태). 그런 글은 **수동 복구 전까지 영영 revising에 머문다** — "revising에서 안 움직여요" 진단 시 여기부터 볼 것 |
| 4. 수정 프롬프트 구성 | `worker/src/claude/prompt-builder.ts:79~111` `buildRevisionPrompt`(요청문 + 현재 블록) |
| 5. 프롬프트 템플릿 | `worker/prompts/revise-content.md` |
| 6. Claude 호출 | `revision-request-watcher.ts:119~128` |
| 7. 결과 처리(블록·naverInput 갱신) | `worker/src/triggers/revision-update.ts:48~101` (P1-2: contentBlocks와 naverInput 함께) |
| 8. preview-ready 복귀 | `revision-request-watcher.ts:148~187` (트랜잭션 — state 이탈 시 abort·onResolved 미호출, PSA-07[11]) |
| **9. 수정 완료 알림(REVI-1, 2026-07-04 라이브)** | `worker/src/index.ts:229~231` `startRevisionRequestWatcher({onResolved})` → `worker/src/triggers/revision-resolved-notify.ts` `notifyRevisionResolved` |
| 실패 처리 | `revision-request-watcher.ts:211~263` `markFailed`(트랜잭션 — state==revising일 때만 failed 종결, 이탈 시 보존) |
| **실패 알림(REVI-2, 2026-07-04 라이브)** | `revision-request-watcher.ts:266~311` `notifyRevisionFailed`(failed 전이 **커밋 시에만**) |

> **★알림 배선(2026-07-04, REVI-1·REVI-2)** — 수정 루프의 침묵 구간 두 곳을 닫았다(RECOVERY.md "최근 보강"의 짝):
> - **수정 완료(REVI-1)**: 예전엔 onResolved 훅이 미배선이라 수정 완료 알림이 0이었다. 이제 preview-ready 복귀
>   **트랜잭션이 커밋된 경우에만** `notifyRevisionResolved`가 최초 생성 완료와 **같은 인프라 그대로**(dispatch
>   push kind `preview-ready` → 앱 알림함 + `notifyOwner` 텔레그램) 알린다. `payload.revised=true`로 문구만
>   "수정 완료"로 구분(새 NotificationKind 없음). best-effort — 알림 실패가 수정 흐름을 안 막는다.
> - **수정 실패(REVI-2)**: 예전엔 markFailed가 완전 침묵(생성 실패 generation-failed와 미러 드리프트)이었다.
>   이제 failed 전이가 **커밋된 경우에만**(상태 이탈·문서 없음이면 알림도 없음 — 오탐 방지) `generation-failed`
>   패턴 그대로 운영자 텔레그램 + 사장님 앱 알림함(이벤트 업로더) + 사장님 텔레그램(chatId 있는 테넌트만).

> **★정직 가드(불변식, 2026-06-28)**: 수정 프롬프트 템플릿 `revise-content.md`에 **절대 규칙**을 박았다 —
> 시점=가게 본인(방문자·체험단 위장 금지=사기), 인사말("안녕하세요 OOO입니다") 금지, 검증 안 된 사실 단정
> 금지. 수정 루프는 `buildRevisionPrompt`가 이 템플릿만 주입하므로, **최초 생성의 정직 규칙이 수정 때 새지
> 않게** 여기서도 다시 강제한다. (감사 ⑥에서 누락 발견·수정. 관련 메모리 [[feedback_business_owner_voice]])

---

## 5. 자동승인 (검토 OFF — 사장님이 끄면)

검토를 부담스러워하는 사장님이 끌 수 있는 길. 기본값은 **검토 ON**(자동승인 꺼짐).

설정 토글 화면 = `src/app/(mobile)/settings/publish-mode/page.tsx:9~77` (`autoApprove`, `/api/settings/auto-publish`).
자동승인 **입구는 2곳**이고 알림 배선이 서로 다르다(섞으면 오판):

| 입구 | 코드 | 대상 | 알림 |
| --- | --- | --- | --- |
| **① 신규 글** (토글 이미 ON 상태에서 글이 preview-ready 도달) | `worker/src/index.ts:337~358` (preview-ready-watcher `onPreviewReadyForEvent`) | 그 이벤트의 글들 | ✅ `dispatchNotification`(push "auto-approved") + `notifyOwner` 텔레그램 |
| **② 토글 sweep** (토글 false→true 켜지는 순간 쌓인 대기분 일괄) | `worker/src/triggers/auto-approve-sweep-watcher.ts:49~69` | 그 테넌트의 preview-ready 전부(cap까지) | ❌ **알림 미발송 — 로그만**(notify 미사용, 배선 여부 = BUG-REGISTER **RVW-07** 등재) |

둘 다 대상 선정 = `worker/src/content/auto-approve-decision.ts:24~45` `decideAutoApprove`,
승인 실행 = `worker/src/firestore/contents.ts:98~114` `approveIfPreviewReady`(CAS).

**자동승인 가드**: ① blog·insta-carousel·facebook만 대상(이식분 `legacyPostNumber`는 제외) · ② 한 번 sweep에
**SWEEP_CAP(기본 20)**까지만(폭주 방지) · ③ `preview-ready`만 CAS 전이(불변식②) · ④ `by:"system"` 기록.
"auto-approved" 알림은 **입구 ①(신규 글)만** 보낸다 — sweep 경로(②)는 로그만 남긴다.

**토글 감지 규칙** (`auto-approve-sweep-watcher.ts:13~17·28~35·46~48·66~67` — 재시작 방어):
- **최초 스냅샷 = 현재 토글값 기록만, sweep 안 함**(워커 재시작마다 재-sweep 방지).
- **true→false = no-op**(이미 approved/scheduled는 유지), **false→true 전이 순간만** sweep. `inFlight`로
  같은 테넌트 중복 sweep 차단.
- 따라서 **토글이 이미 ON인 채 쌓인 대기분은 sweep이 영영 안 집는다**(전이가 다시 안 일어나므로) —
  신규 글이 오면 입구 ①이 처리하고, 기존 대기분은 사장님이 직접 검토해야 나간다.

> **헷갈림 주의**: `src/app/api/rotation/approve/route.ts`의 approve는 **글감 회전 카탈로그 승인**(rotationCatalogs,
> status="approved"+approvedAt)이지 **콘텐츠 글 승인이 아니다**. 글 승인은 클라 Firestore 직접 update
> (`useContentActions.ts`)다. 같은 단어 "approve"라 섞지 말 것.

---

## 6. 검증

검토·승인 변경은 **②에뮬레이터/실Firestore 통합 + 상태전이 실측**이 최소선이다(순수 로직만으론 onSnapshot
리스너·CAS 경합·자동승인 sweep 같은 다프로세스 흐름을 못 잡는다). 가능하면 **Playwright 커스텀토큰 주입
E2E**(검토 목록 → 승인 → 토스트 "N월 N일 올라가요" → approved-watcher가 scheduledAt 실배정)까지 올라간다.

## 7. 코드↔문서 매핑 (색인 — 규칙 본문은 각 §에)

> [CONTENT-ROTATION-CONSTITUTION.md](CONTENT-ROTATION-CONSTITUTION.md) §12 형식의 이 도메인판.
> **라인 번호 대신 함수·마커 주석 기준**(라인은 밀린다 — 2026-07-05 감사에서 이 문서의 라인 참조 3곳이
> 이미 밀려 있었음). 코드를 바꾸면 이 표와 해당 § 본문을 같이 갱신한다.

| 규칙 한 줄 | 코드 (파일 + 함수·마커) | 문서 § |
| --- | --- | --- |
| 클라 전이 5종 = 트랜잭션 CAS(소스 상태일 때만, 아니면 no-op) | `src/hooks/useContentActions.ts` `approve`·`schedule`·`requestRevision`·`retryRevision`·`unschedule` + `src/lib/approve-gate.ts` `can*ContentState`(approve-6·RVW-02 주석) | §3 불변식② |
| scheduled 진입 두 갈래(approved 경유 or 직접 예약 직행) | `useContentActions.ts` `schedule`(RVW-02 주석) · `worker/src/triggers/approved-watcher.ts` | §3 불변식① |
| deleteContent만 무가드 batch("미발행만"=호출부 책임) | `useContentActions.ts` `deleteContent` 주석 | §3 표 |
| 예약 취소 시 `customerTouched:true` 도장(레거시 글 미아 방지) | `useContentActions.ts` `unschedule`(customerTouched 주석) | §3 표 ↔ §2 필터 1 |
| 검토 큐 필터: 레거시 숨김+customerTouched 예외 / pauseReason 비공백=보류 | `src/hooks/useReviewPending.ts`(미아 방지 주석) · `src/lib/content-edit.ts` `isLegacyContent`·`isHeldContent` | §2 |
| 승인·예약 직전 채널 사전검증(미준비=차단+연결 유도, 로딩 중·미지 kind=통과) | `src/lib/approve-gate.ts` `approveBlockedChannelLabel`(approve-7 주석) · `detail/[id]/page.tsx` `blockIfChannelNotReady` | §3-b |
| 워커 자동승인 = preview-ready만 CAS(approve-2) | `worker/src/firestore/contents.ts` `approveIfPreviewReady` | §3 불변식② · §5 |
| 자동승인 알림은 신규 글 경로만(sweep은 로그만) | `worker/src/index.ts` `onPreviewReadyForEvent` vs `worker/src/triggers/auto-approve-sweep-watcher.ts` sweep 블록 | §5 |
| sweep 토글 감지: 최초 스냅샷=기록만·false→true 전이만·inFlight 차단 | `auto-approve-sweep-watcher.ts` 헤더 주석·`initialized`·`lastAuto`·`inFlight` | §5 |
| revising 워처: 마지막 요청 resolvedAt 있으면 skip(그 글은 영영 revising) | `worker/src/triggers/revision-request-watcher.ts` `handleRevision`(already resolved 주석) | §4 3-b |
| 수정 완료/실패 알림은 전이 커밋 시에만(REVI-1·REVI-2) | `revision-request-watcher.ts` `onResolved`·`notifyRevisionFailed` | §4 |

---

> **유지 규율**: 상태전이·검토 UI·자동승인 가드가 바뀌면 이 문서를 **즉시 갱신**(STATUS·SCHEDULE처럼 드리프트
> 없이) — §7 매핑 표와 해당 § 본문을 함께. 검토·승인 감사 = BUG-REGISTER. 연쇄영향은 [BLUEPRINT.md](BLUEPRINT.md).
