# NGN Upload — 스케줄·발행 타이밍 단일 지도 📅

> **이 문서 = "안 나간 글이 어떻게 줄 서서 하루 1건씩 나가나"의 단일 진실.**
> **⚠️ 스케줄·예약·발행시각·슬롯 관련 코드를 건드리기 전에 반드시 먼저 읽는다.**
> 여기 적힌 **불변식(§3)**을 깨면 발행이 멈추거나(침묵), 같은 글이 두 번 나가거나, 하루 여러 건이
> 쏟아진다. 새 기능 작업 중 스케줄이 "꺼지거나 꼬이는" 걸 막는 게 이 문서의 목적이다.
> 짝 문서: [BLUEPRINT.md](BLUEPRINT.md)(연쇄위험)·[BUG-REGISTER.md](BUG-REGISTER.md)(PSA 발행정확성 감사).

---

## 1. 한눈 흐름 — 사진 업로드부터 발행까지

```
[승인] approved
   │  (approved-watcher 가 감지)
   ▼
assignSlotForContent  ── 슬롯 배정 (scheduler/assign-slot.ts)
   │   ① 타이밍 결정: **같은 채널에** 밀린 글 없으면 즉시(오늘 — **scheduledAt이 지금 시각으로 찍힘**),
   │      있으면 빈도수 간격으로 분산
   │      (SCHE-1: 밀림·간격 판정은 채널별 — 채널A 밀림이 채널B를 못 늦춤, §3-H)
   │   ② 14일 내 빈 슬롯 탐색 (하루 1건/채널 하드캡, 09~21시 5분 격자 144슬롯)
   │   ②b 예약 직전 같은 콘텐츠의 **옛 활성 슬롯 자동 취소** (PUB-03 — 범위=오늘부터 lookahead 14일
   │      **전체**(SCH-06: 후보일로 좁히면 좀비 슬롯 놓침), best-effort: 정리 실패가 새 배정을 안 막음)
   │   ③ ★슬롯을 먼저 예약(reserveSlot) → 성공해야 scheduled 전이★  (불변식 §3-A)
   ▼
scheduled + scheduledAt(발행 예정 시각)
   │  (slot-fire-watcher 가 30초마다 폴링: state=scheduled AND scheduledAt<=지금)
   ▼
firePublish  ── 발행 (publish/fire-publish.ts)
   │   ④ 정지/발행보류 게이트 → ⑤ ★claimForPublish 원자적 선점(중복발행 차단)★ (불변식 §3-B)
   │   ⑥ 정지 재확인(TOCTOU) → ⑦ 채널 어댑터(네이버/인스타/페북/유튜브) 실발행
   ▼
published (발행결과 URL·ID 저장) + markSlotFired
```

**핵심 한 줄**: 승인된 글은 **슬롯(하루 1칸)**을 잡고 `scheduled`가 되어, **예정 시각(`scheduledAt`)**이
되면 발행된다. 안 나간 글이 많은 건 **고장이 아니라** 미래 날짜로 줄 서 있는 정상 대기열이다.

---

## 2. 파일 지도 — 스케줄은 여기에만 산다

| 역할 | 파일 | 무엇 |
|---|---|---|
| **슬롯 배정(진입점)** | `worker/src/scheduler/assign-slot.ts` | approved → 빈 슬롯 찾아 예약 → scheduled 전이. 모든 예약의 단일 입구. 예약 직전 같은 콘텐츠의 옛 활성 슬롯 자동 취소(PUB-03 — 범위=lookahead 14일 **전체**, SCH-06: 후보일로 좁히면 좀비 놓침. best-effort). |
| 빈 슬롯 탐색(순수) | `worker/src/scheduler/find-slot.ts` | 14일·하루1건/채널·같은 분 전역 상한(MAX_PER_SLOT_TIME=8)으로 가장 이른 빈 칸. |
| 발행 시점 결정(순수) | `worker/src/scheduler/publish-timing.ts` | 즉시 vs 분산, 빈도수(perWeek)→간격일. 입력(backlog·마지막 예약일)은 **채널별**. |
| 슬롯 시각 격자(순수) | `worker/src/scheduler/slot-times.ts`·`kst-date.ts` | 09~21시 **5분 격자(하루 144슬롯)**, KST 날짜 변환. |
| 슬롯 저장소 | `worker/src/firestore/schedule-slots.ts` | `schedule_slots` 컬렉션 예약/취소/종결(reserveSlot·cancelSlot·markSlotFired/Failed). |
| **발행 트리거** | `worker/src/triggers/slot-fire-watcher.ts` | 30초마다 `scheduled`+시각 도래 글을 firePublish. |
| 승인 트리거 | `worker/src/triggers/approved-watcher.ts` | approved 감지 → assignSlotForContent 호출. |
| **발행 실행** | `worker/src/publish/fire-publish.ts` | 게이트·claim·채널 어댑터·결과 저장. |
| 매일 재배치 | `worker/src/lifecycle/reschedule.ts` | 04시 크론: 슬롯 없는 approved + 지난 미발행 scheduled 재배정. |
| 삭제 슬롯 회수 | `worker/src/triggers/deleted-content-watcher.ts` | 삭제된 글의 예약 슬롯 반환(PSA-02). |
| 운영자 재발행 | `src/app/api/admin/content/[id]/republish/route.ts` | 봉쇄된 failed 글 복구(PSA-05). |
| **빈도수 저장/조회(앱)** | `src/app/api/settings/frequency/route.ts` | GET=현재 `settings.frequency.perWeek`(기본 7) · POST=**주 N회 저장**(1~7 범위 검증, merge로 dailyLimit·notificationChannels 보존). 이게 아래 §5 `perWeek`를 **쓰는 유일한 앱 라우트** — 스케줄러(`publish-timing.ts`)는 이 값을 **소비**만 한다. 하드캡(채널당 하루 1건)은 무관하게 워커가 별도 보장. |

---

## 3. 🔒 불변식 (이걸 깨면 발행이 망가진다 — 새 작업 시 보존 필수)

| # | 불변식 | 왜(깨지면) | 지키는 코드 |
|---|---|---|---|
| **A** | **슬롯 보유 ⇔ scheduled** — 슬롯을 실제로 예약한 글만 scheduled가 된다. 전이를 예약보다 먼저 하지 말 것. **역방향도 성립**: scheduled 전이 자체가 트랜잭션 CAS(그새 삭제·재수정으로 approved를 이탈했으면 전이 거부), 전이 실패 시 **방금 예약한 슬롯을 즉시 회수**(고아 슬롯=하드캡 점유 왜곡 방지, best-effort). | 슬롯 없이 scheduled면 slot-fire가 그날 발행 → **하루 1건 하드캡이 깨져 여러 건 발행**. 전이 실패 슬롯을 안 회수하면 고아 슬롯이 칸 점유. | assign-slot.ts PSA-08 블록(reserve → CAS 전이 → 실패 시 cancelSlot) |
| **B** | **발행 직전 원자적 claim** — `claimForPublish`(트랜잭션 CAS)로 정확히 한 번만 발행. | 비원자면 동시 워커/재시도가 **같은 글 두 번 게시** | fire-publish.ts:417·contents.ts claimForPublish (PSA-01) |
| **C** | **`publishStartedAt`는 발행중 표식 — 함부로 지우거나 덮지 말 것** | 지우면 크래시 후 중복발행 방지가 무력화. reschedule이 발행중 글을 approved로 되돌리면 경합. | reschedule.ts:54 (PUB-02 skip) / republish만 해제(PSA-05) |
| **D** | **취소된 슬롯을 되살리지 말 것** — markSlotFired/Failed는 status==reserved일 때만. | 삭제·재배정으로 취소된 슬롯을 fired로 덮으면 점유 집계 왜곡 | schedule-slots markSlot* CAS (PSA-02) |
| **E** | **자동 전이는 CAS로** — 자동승인·재생성이 삭제·수정요청 글을 되살리지 않게 "그 상태일 때만" 전이. | blind update면 삭제·발행된 글 부활 | approveIfPreviewReady(approve-2)·restoreScheduleAfterRewrite(policy-4) |
| **F** | **정지(suspended)면 발행 안 함 + 활성 슬롯 비움(publish-4)** — 정지 게이트 **2지점**(최초 게이트·발행 직전 TOCTOU 재확인) 모두에서 발행 보류(state=scheduled 유지, 해제 후 자동 재개) + 그 콘텐츠의 활성 슬롯을 회수(범위=lookahead 14일+당일, best-effort: 회수 실패가 보류 자체를 안 막음). | 게이트 통과 후 정지시켰는데 글이 나감. 슬롯을 안 비우면 좀비 슬롯이 칸을 점유해 **정지 해제 후 재배정이 SlotConflictError로 막혀 그날 발행 지연**. | fire-publish.ts tenantPublishHold 게이트·PSA-03 TOCTOU·clearSlotsForSuspendedTenant(publish-4) |
| **G** | **불확실하면 보류(맹목 재발행 금지) — 단 `crash-uncertain`은 무조건 failed가 아니라 2분기(publish-5)**: ① 승자가 이미 종결했거나 표식(`publishStartedAt`) 나이가 10분 미만이면 "다른 인스턴스가 발행 처리 중"으로 보고 **조용히 skip**(상태·알림 변경 없음), ② 표식 10분 초과만 진짜 크래시 의심으로 **failed 종결+운영자 알림**. | 자동 재발행하면 중복 게시 위험. ①까지 failed로 종결하면 claim 패배(재시작·동시 폴링 경계의 정상 경합)를 실패로 오분류+오알림. | fire-publish.ts publish-5 블록(PUBLISH_IN_PROGRESS_MS=10분) |
| **H** | **밀림·간격 판정은 채널별(테넌트 합산 금지)** — backlog(다른 미발행 건)·마지막 예약일(lastScheduledDate)은 같은 tenantId+**channelId** 안에서만 센다. 발행 빈도 정책(2026-06-02)의 "채널 합산 금지"와 한 몸. | 합산하면 다채널 업체(블로그+인스타+페북)가 채널 간 직렬화돼 **예약 꼬리가 매일 뒤로 발산**(꾸준함=북극성 붕괴). SCH-01(find-slot 채널당 캡)+SCHE-1(backlog·간격 채널별)이 짝. | assign-slot.ts backlog 집계(channelId 필터)·find-slot.ts mineChannel 캡 |

> **§3-A 비고(PUB-04) — 하드캡의 원자 방어선은 reserveSlot 트랜잭션이다.** `schedule-slots.ts`의
> reserveSlot이 같은 (날짜·업체·채널)에 활성(reserved/fired) 슬롯 존재 검사와 예약을 **한 트랜잭션**으로
> 묶는다 — 이게 하루 1건/채널의 유일한 원자 보장. §1 ②의 find-slot 캡 검사는 미리 읽은 스냅샷 기준의
> **비원자 사전 필터**일 뿐이다. 경합으로 예약이 거부되면 `SlotConflictError` → content는 **approved로
> 남아 다음 사이클에 재시도**된다(실패가 아니라 정상 보호 동작).

> **재생성·정책버전·설정저장이 예약글을 건드릴 때**: 미발행 글을 다시 쓰면 **원 예약시각을
> `restoreScheduledAt`에 보존**했다가 재생성 완료 시 `scheduled`로 **원자 복원**(policy-4 CAS).
> 이 경로를 건드리면 예약시각이 통째 날아간다. [[정책버전=BLUEPRINT §4]]

---

## 4. 상태 기계 (글 하나의 일생)

```
uploaded → (생성) → preview-ready → (승인) → approved → (슬롯배정) → scheduled → (시각도래) → published
                          │                                   │                        
                       (수정요청) revising                 (슬롯고갈) approved 유지·재시도(reschedule)
                          │                                   │
                       (삭제) deleted ←─────────────── (삭제 시 슬롯 회수: deleted-content-watcher)
                                                            (발행실패) failed → (운영자 republish) → scheduled
```

- **preview-ready**: 검토 대기(아직 슬롯·예약 없음). 사장님/운영자 승인 전.
- **approved**: 승인됐으나 아직 슬롯 못 잡음(배정 직전 or 슬롯고갈 재시도 중).
- **scheduled**: 슬롯 보유 + `scheduledAt` 예정. **안 나간 글의 정상 대기 상태.**
- **published**: 발행 완료(결과 URL/ID 저장).
- **failed**: 발행 실패 or crash-uncertain(**표식 10분 초과인 경우만** — 이내면 조용히 skip, §3-G) → 운영자가 republish로 복구.

---

## 5. 타이밍 규칙 (언제 나가나)

- **하드캡**: **채널당 하루 1건**(`HARD_DAILY_CAP=1`, 업체 설정과 무관 고정). 버스트 차단.
- **빈도수**: `tenant.settings.frequency.perWeek`(기본 7) → 간격일 `round(7/perWeek)` (주7=매일, 주3=2일, 주1=7일).
  간격의 기준점(마지막 예약일)은 **그 채널의** 가장 늦은 예약일이다(§3-H, 채널 합산 금지).
  이 값을 **저장하는 앱 라우트 = `/api/settings/frequency`**(POST, 1~7 검증·merge). 스케줄러는 소비만 하고,
  빈도 UI(backlog일 때만 노출)가 이 라우트로 쓴다. 업체는 발행 "시간"은 못 정하고 "빈도(주 N회)"만 정한다.
- **즉시 vs 분산**: **같은 채널에** 밀린 글(다른 미발행) 없고 간격제약 없으면 **오늘 즉시**, 있으면 **미래로 분산**.
  다른 채널의 밀림·예약은 이 판정에 안 들어간다 — 각 채널이 자기 빈도로 독립 발행(SCHE-1).
- **발행 창(=배정 격자)**: KST **09:00~21:00**, **5분 격자(하루 144슬롯)** (`slot-times.ts STEP_MINUTES=5`).
  ⚠️ **이 창은 슬롯 배정 격자에만 존재하고, 발행 시각을 강제하지 않는다.** 즉시발행은 `scheduledAt=지금`
  (창 밖 시각 가능, `assign-slot.ts`), slot-fire-watcher는 `state=scheduled AND scheduledAt<=지금`만
  검사한다(창 검사 없음). 밀린 글이 밤에 나가는 건 **사고가 아니라 정상**이다 — slot-fire에 창 강제를
  넣으면 즉시발행("오늘 바로 올라가요") 약속이 깨진다.
- **같은 분 전역 상한**: 같은 시각(분)에 전 업체 합산 최대 **8건**(`find-slot.ts MAX_PER_SLOT_TIME=8`).
  시스템 일일 capacity ≈ 144슬롯 × 8 = **1,152건/일**(목표 100업체×3채널=300의 약 3.8배 여유).
- **같은 업체는 같은 분을 공유하지 않는다**: 그 업체의 기존 활성 슬롯 시각(분)은 **채널이 달라도** 회피
  (`find-slot.ts` mineTimes) — 위 전역 상한 8과 **별개**의 업체 단위 제약(한 업체 글이 같은 분에 안 몰리게 분산).
- **매일 04시 재배치**: 슬롯 못 잡은 approved + **시각 지났는데 안 나간** scheduled를 다시 배정.
  **미래 예약(scheduledAt > 지금)은 절대 안 건드림** → 줄 서 있는 대기열은 안정적.
  14일 내 빈 슬롯 없으면(슬롯고갈) 운영자에게 `schedule-stuck` 알림.

---

## 6. 🧪 스케줄을 안전하게 바꾸는 법 (새 작업 체크리스트)

스케줄·발행 근처를 손댈 때 **이 다섯을 자문**한다:
1. **하루 1건 하드캡을 우회하나?** (슬롯 없이 scheduled 만들기·전이 순서 뒤집기 = 위반 §3-A)
2. **중복발행 가드를 건드리나?** (`publishStartedAt`·`claimForPublish` 손대기 = 위반 §3-B·C·G)
3. **예약시각을 보존하나?** (예약글 재생성·상태변경 시 `scheduledAt`/`restoreScheduledAt` 보존 = §3-E)
4. **채널을 다시 합산하나?** (backlog·간격·캡 어디든 tenant 단위 집계로 되돌리기 = 위반 §3-H, 다채널 발산 재발)
5. **발행 창을 발행 시각 강제로 바꾸나?** (slot-fire에 09~21시 창 검사 추가 = 즉시발행·밀린 글 발행 파괴, §5 — 창은 배정 격자에만 존재)

**상수 변경 시 문서 갱신 규율**: 격자 간격(`STEP_MINUTES`)·발행 창(`START_HOUR`/`END_HOUR`)·
`MAX_PER_SLOT_TIME`·`HARD_DAILY_CAP`·lookahead(14일)를 바꾸면 **이 문서 §1·§2·§5의 숫자를 같은
커밋에서 갱신**한다(SCHE-6: "15분 격자" 문서 드리프트가 실제로 있었다 — 코드는 5분/144슬롯).

**검증**: 스케줄 변경은 **②에뮬레이터 통합 테스트 필수**(순수 로직만으론 경합·트랜잭션 못 잡음).
관련 테스트 = `worker/test/scheduler/*`·`worker/test/firestore/schedule-slots.test.ts`·
`assign-slot.test.ts`·`firestore/approve-cas.test.ts`. 발행 회귀 = `worker/test/firestore/publish*`.

> **유지 규율**: 스케줄 흐름·불변식·파일이 바뀌면 이 문서를 **즉시 갱신**(STATUS·BLUEPRINT처럼 드리프트 없이).
> PSA(발행·스케줄 정확성) 감사 = BUG-REGISTER "4차 감사". 옛 `worker/src/scheduler/README.md`는
> 코드-로컬 요약(일부 stale) — 이 문서가 상위 단일 진실이다.

---

## 7. 코드↔문서 매핑 (규칙이 사는 곳 — 색인)

> [CONTENT-ROTATION-CONSTITUTION.md](CONTENT-ROTATION-CONSTITUTION.md) §12 형식의 색인.
> **규칙의 정본은 위 각 §**이고, 이 표는 그 규칙을 지키는 코드가 어디 사는지 새 세션이 즉시 찾게 하는
> 색인이다. **라인 번호는 밀리므로 쓰지 않는다** — 파일 + 함수·마커 주석(PSA-*·PUB-*·SCHE-* 등) 기준
> (일관성 감사 2026-07-05 권고). 코드 위치는 `worker/src/` 기준.

| 규칙(문서 §) | 코드 위치(파일 + 마커·함수) | 규칙 한 줄 |
|---|---|---|
| §3-A 슬롯 보유⇔scheduled | `scheduler/assign-slot.ts` PSA-08 주석 블록 | reserveSlot 성공 후에만 CAS 전이(approved일 때만), 전이 실패 시 cancelSlot로 슬롯 즉시 회수 |
| §3-A 비고 하드캡 원자 방어선 | `firestore/schedule-slots.ts` reserveSlot의 PUB-04 트랜잭션 | (날짜·업체·채널) 활성 슬롯 검사+예약이 한 트랜잭션, 경합=SlotConflictError→approved 유지 재시도 |
| §1 ②b·§2 옛 슬롯 자동 정리 | `assign-slot.ts` PUB-03 블록 → `schedule-slots.ts` cancelActiveSlotsForContent | 예약 직전 같은 콘텐츠 활성 슬롯 취소, 범위=lookahead 14일 전체(SCH-06), best-effort |
| §3-B 발행 직전 원자적 claim | `publish/fire-publish.ts` PSA-01 → `firestore/contents.ts` claimForPublish | scheduled+무표식일 때만 표식을 찍고 진행(트랜잭션 CAS) |
| §3-C publishStartedAt 보존 | `lifecycle/reschedule.ts` PUB-02 skip · `admin/.../republish` 라우트(PSA-05) | 발행중 표식은 republish 경로만 해제 |
| §3-D 취소 슬롯 부활 금지 | `schedule-slots.ts` markSlotTerminal의 PSA-02 가드 | reserved일 때만 fired/failed 종결 전이(cancelled는 안 되살림) |
| §3-F 정지=보류+슬롯 비움 | `fire-publish.ts` tenantPublishHold 게이트 · PSA-03 TOCTOU · clearSlotsForSuspendedTenant(publish-4) | 정지 감지 2지점 모두 발행 보류+활성 슬롯 회수(14일+당일, best-effort) |
| §3-G crash-uncertain 2분기 | `fire-publish.ts` publish-5 블록(PUBLISH_IN_PROGRESS_MS) | 승자 종결 or 표식 10분 미만=조용히 skip(무알림), 초과만 failed+운영자 알림 |
| §3-H 채널별 밀림·간격 | `assign-slot.ts` SCHE-1 주석 블록(backlog 집계) · `find-slot.ts` SCH-01(mineChannel 캡) | 밀림·간격·일일캡 전부 tenantId+channelId 단위(합산 금지) |
| §5 발행 창=배정 격자만 | `scheduler/slot-times.ts`(창·격자 생성) vs `assign-slot.ts` 즉시발행 scheduledAt=now · `triggers/slot-fire-watcher.ts` checkOnce | 창은 슬롯 격자 생성에만 존재, 발행 트리거는 시각 도래(scheduledAt<=now)만 검사 |
| §5 같은 분 업체 회피 | `find-slot.ts` mineTimes | 같은 업체 기존 슬롯의 분은 채널 불문 회피(전역 상한 MAX_PER_SLOT_TIME=8과 별개) |
