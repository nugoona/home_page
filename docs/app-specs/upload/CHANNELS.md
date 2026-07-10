# NGN Upload — 채널 연결·발행 인증 단일 지도 🔌

> **이 문서 = "연결했는데 왜 안 올라가나"의 단일 진실.**
> **⚠️ 채널 연결·세션·발행 인증(네이버 블로그/플레이스·인스타·페북·유튜브) 코드를 건드리기 전에 반드시 먼저 읽는다.**
> 여기 적힌 **불변식(§5)**을 깨면 "연결은 됐는데 발행이 침묵으로 죽거나", 만료된 인증으로 발행을 시도해
> 거부당하거나, 운영자에게 연결 요청이 안 닿아 사장님이 영영 대기에 묶인다. 새 기능 작업 중 채널 인증이
> "꺼지거나 헷갈리는" 걸 막는 게 이 문서의 목적이다.
> 짝 문서: [SCHEDULE.md](SCHEDULE.md)(발행 타이밍)·[BLUEPRINT.md](BLUEPRINT.md)(연쇄위험)·[BUG-REGISTER.md](BUG-REGISTER.md)(채널 감사 갭).

> **NAVER-1 (2026-07-06, 커밋 57eeb44, 워커라이브) — 발행 직전 세션 "실" 유효성 검증**: 기존 `checkLoggedIn`은 **쿠키 이름 존재만** 봐 서버측 무효화된 세션(쿠키 잔존·미만료)을 통과시켜 SmartEditor 단계 **침묵 실패**(실사고 aurume-wellness). → `verifyNaverSessionValid`(session.ts)로 교체: 발행에 쓰는 그 컨텍스트로 글쓰기 진입URL 1회 열어 **로그인 리다이렉트 감지**(`classifyNaverProbeUrl`: `nid.naver.com`+login경로만 invalid·그 외/파싱실패=fail-open·`unknown`(타임아웃)=계속 → 거짓만료 QR스팸·발행차단 방지). ③실브라우저: aurume 죽은세션→`nid.naver.com/nidlogin.login`→'invalid' 실확인('valid' 실케이스는 살아있는 세션 0이라 QR재로그인 후 사후확인). publish-naver-tenant·preview-publish 양쪽. 아래 CHAN-1 '되반영'이 이제 쿠키존재가 아니라 **실무효화** 기준으로 발동.
> **CHAN-1 (2026-07-04, 워커 라이브)**: 발행 직전 세션 무효(위 NAVER-1 판정) 시 `markNaverSessionExpiredAndNotify`로 **`channels.naver.sessionStatus='expired'` 되반영 + `naver-session-expired` 알림**(QR 재로그인 유도). 예전엔 `{ok:false, reason:'session-expired'}`만 반환해 재로그인 유도가 영영 미발동했다. 재발송 3일 간격·안내 문구는 크론과 **단일 정의 공유**(`mark-session-expired.ts:91·94~98`, 미러 드리프트 방지). best-effort — 되반영 실패가 발행 실패 반환을 막지 않음.
> ⚠️ **단, 크론의 무조건 덮어쓰기는 지금도 그대로다**: `naver-session-check` 크론은 **쿠키 만료시각 단일 기준**으로 `sessionStatus`를 **매일 무조건 덮어쓴다**(`naver-session-check.ts:79·100~105` — "문제 여부와 무관하게 항상 기록", 서버측 무효화는 못 본다). 따라서 CHAN-1의 `expired` 되반영은 **다음 크론까지만** 유효 — 쿠키가 아직 유효하면 다음날 `'ready'`로 복원된다(**진동**: 발행 시도마다 다시 `expired` 되반영). 이 진동은 설계 수용 상태다 — 조기 게이트는 발행 시도 시마다 되살아나고, 알림은 3일 간격을 크론과 공유해 스팸이 안 난다.

---

## 1. 한눈 흐름 — "연결"부터 "실제 발행 가능"까지

```
[연결] 사장님/운영자가 채널을 잇는다
   │
   ├─ 네이버 블로그: 앱 connect 라우트가 ID/PW 암호화 저장 + connected:true + sessionStatus:'pending'
   │     │  (이 단계는 아직 발행 못 함 — 자격증명만 있고 세션이 없다)
   │     ▼
   │  운영자 QR 로그인(naver-qr-login-watcher → 진짜 Chrome CDP + 폰 QR)
   │     │  성공 시 세션파일 저장(auth/naver/{tid}.json) + sessionStatus:'ready'
   │     ▼
   │  ★이제야 발행 가능★ (connected:true AND 세션 ready)
   │
   ├─ 네이버 플레이스: 앱이 placeId만 저장(connected:true) — 세션은 블로그 세션 재활용
   │     (실제 소식 발행은 NAVER_PLACE_PUBLISH_ENABLED=true 일 때만, 현재 HOLD)
   │
   ├─ 인스타·페북(메타): 앱 OAuth(메타 다이얼로그) → 페이지 선택 → pageToken 암호화 저장
   │     connected:true + expiresAt(약 53일 뒤) 박힘 → ★연결 즉시 발행 가능★
   │
   └─ 유튜브: 운영자 관리(env 계정), 영상 워처가 별도 발행
```

**핵심 한 줄**: **`connected:true`만으로는 발행이 안 된다.** 네이버는 **세션이 `ready`**까지 가야 하고,
메타는 **토큰이 안 만료**돼야 한다. "연결했는데 안 올라감"의 대부분은 **연결(connected)과 발행 가능(ready·미만료)을
혼동**해서 생긴다 — 이 둘을 구분하는 게 이 문서의 핵심.

> ⚠️ 위 흐름도의 "★발행 가능★"은 채널 조건일 뿐 — 그 위에 **채널별 env 실전환 게이트**가 하나 더 있다
> (기본=dry-run, §4 하단). 채널·세션이 다 멀쩡해도 env가 `'false'`가 아니면 실제로는 안 올라간다.

---

## 2. 채널 데이터 모델 — 인증은 여기에만 산다

모든 채널 연결 상태는 **`tenants/{tenantId}.channels` 맵** 하나에 산다.
(구 루트 `channels` 컬렉션은 **아무도 쓰지 않아 비어 있다** — 읽지 않는다. `worker/src/firestore/channels.ts:46~49`.)

```
tenants/{tid}.channels = {
  naver:      { connected, sessionStatus, sessionCheckedAt, sessionExpiresAt, naverId, credential(암호화), ... },
  naverPlace: { connected, placeId, sessionStatus },          // 발행 세션은 블로그 것 재활용
  instagram:  { connected, igUserId, pageId, pageToken(암호화), expiresAt, handle, ... },
  facebook:   { connected, pageId, pageToken(암호화), expiresAt, handle, ... },
  youtube:    { connected, account }                          // 운영자 env 계정
}
```

| 필드 | 누가 쓰나 | 의미 |
|---|---|---|
| `connected` | 앱 connect 라우트·OAuth | "이었다"는 표식. **이것만으론 발행 못 함**(불변식 §5-A). |
| `sessionStatus`(네이버) | 워커 세션점검 크론·QR 로그인 | `pending`(자격증명만)·`ready`(세션 살아있음)·`expiring`(14일내 만료)·`expired`(만료). |
| `sessionCheckedAt`·`sessionExpiresAt` | 워커 세션점검 크론 | 마지막 점검 시각·로그인 쿠키 만료 시각(ms). |
| `expiresAt`(메타) | 앱 메타 connect | 페이지 토큰 만료 시각(epoch **ms**). 약 53일. |
| `paused` | 운영자/설정 | 일시정지 — 생성·점검·발행에서 제외. |
| `credential`·`pageToken` | 앱 connect | AES 암호화된 자격증명. 워커가 복호화해 발행에 씀. |

**타입 정의 주의(드리프트)**: 앱 `src/types/channels.ts`의 `ChannelId`는 `naver|instagram|facebook` **3종만**이고
`youtube`·`naverPlace`가 빠져 있다. 실제 데이터에는 둘 다 있고(앱 훅·워커가 직접 읽음), 유튜브는
`src/hooks/useExposureSetup.ts:74,82`에서 별도로 읽는다. 타입을 손댈 때 이 누락을 기억할 것.

### 읽는 쪽 (앱 vs 워커 미러)

| 쪽 | 파일 | 무엇을 읽나 |
|---|---|---|
| **앱(사장님 화면)** | `src/hooks/useExposureSetup.ts:70~83` | `tenants/{tid}` 스냅샷 구독 → `naver/instagram/facebook/youtube` connected + **`naverReady`**(네이버 세션 ready) 파생. |
| **워커(생성 채널 결정)** | `worker/src/firestore/channels.ts:54`(`getChannelsForTenant`) | `connected && !paused`인 채널만 → `resolve-generation-channels.ts`가 생성할 콘텐츠 종류(blog/insta-carousel/facebook) 결정. |
| **워커(발행 자격증명)** | `worker/src/naver/tenant-session.ts`·`worker/src/publish/tenant-meta.ts` | 발행 직전 그 테넌트의 세션파일·복호화 토큰을 가져옴. |

> **레거시 회귀 안전**: `channels` 맵 자체가 없으면(옛 테넌트) `getChannelsForTenant`는 `undefined`를 반환하고
> `resolveGenerationChannels`가 `['blog']`로 폴백한다. 반면 **맵은 있는데 연결 0개**면 `[]`(생성 생략, B6 채널연결
> 안내). 이 구분이 깨지면 채널 0개 신규가 발행 불가능한 블로그를 받아 승인 후 `not-connected`로 죽는다
> (`channels.ts:30~41`, intake6-3).

---

## 3. 파일 지도 — 채널 인증은 여기에만 산다

### 네이버 블로그
| 역할 | 파일 | 무엇 |
|---|---|---|
| **연결(앱)** | `src/app/api/channels/naver/connect/route.ts` | ID/PW 암호화 저장 + `connected:true` + `sessionStatus:'pending'` + **운영자 알림**(QR 로그인 필요). |
| **운영자 QR 로그인(트리거)** | `worker/src/triggers/naver-qr-login-watcher.ts` | `workerJobs(kind=naver-qr-login)` 큐 감시 → CAS claim → 원격 로그인 실행. |
| QR 로그인 실행 | `worker/src/naver/qr-remote-login.ts` | **진짜 Chrome(CDP, webdriver 없음)** + 폰 QR. 성공 시 세션 저장 + `markNaverSessionReady`. |
| 큐잉(앱) | `src/app/api/admin/businesses/[id]/naver-qr-login/route.ts` | 운영자 "폰으로 네이버 연결" 버튼 → `workerJobs` 큐. |
| 세션파일 경로·읽기 | `worker/src/naver/tenant-session.ts` | `auth/naver/{tid}.json`(storageState 쿠키). `getTenantNaverChannel`·`markNaverSessionReady`. **발행 시도마다 롤링 갱신** — `publishPost` 후 성공·실패 무관 `saveStorageState`로 세션파일을 덮어쓴다(`publish-naver-tenant.ts:224`, 저장 실패는 침묵). **발행 빈도 자체가 세션 수명을 연장**하며, §5-B 백업의 "최신본"이 매일 의미 있는 이유도 이것. |
| **세션점검 크론** | `worker/src/cron/jobs/naver-session-check.ts` | 매일 04:05. 쿠키 만료 보고 + `sessionStatus` 갱신 + 만료 임박 알림. |
| **세션 백업 크론** | `worker/src/cron/jobs/backup-naver-sessions.ts`·`worker/src/naver/backup-sessions.ts` | 매일 03:00. 세션파일 GCS 암호화 백업(infra-3). |
| **발행 게이트** | `worker/src/publish/publish-naver-tenant.ts` | 세션상태 게이트 + 실 브라우저 발행 + 발행 직전 세션 라이브 재검. |

### 네이버 플레이스
| 역할 | 파일 | 무엇 |
|---|---|---|
| 연결(앱) | `src/app/api/channels/naver-place/connect/route.ts` | placeId 저장. **블로그 선연결 필수**(세션 재활용). |
| 발행 | `worker/src/publish/publish-naver-place-tenant.ts` | 블로그 발행 성공 후 부가 발행. **현재 HOLD**(`NAVER_PLACE_PUBLISH_ENABLED=true`일 때만). |

### 메타 (인스타·페북)
| 역할 | 파일 | 무엇 |
|---|---|---|
| OAuth 시작·콜백 | `src/app/api/channels/meta/start|callback/route.ts`·`src/lib/meta/oauth.ts` | 메타 다이얼로그 → 코드 교환 → 장기 토큰 → 페이지 목록 임시 저장. |
| **연결 확정(앱)** | `src/app/api/channels/meta/connect/route.ts` | 페이지 선택 → pageToken 암호화 + `connected:true` + `expiresAt`(약 53일) 저장. |
| 발행 자격증명(워커) | `worker/src/publish/tenant-meta.ts` | `getTenantInstagram`·`getTenantFacebook` — 복호화 + `expiresAt` 동봉. |
| **토큰점검 크론** | `worker/src/cron/jobs/meta-token-check.ts` | 매일 04:05. 14일내 만료·이미 만료 알림. |
| 발행 게이트 | `worker/src/publish/fire-publish.ts:96·233` | 발행 직전 토큰 만료 검사 → 만료면 보류(held). |

### 구글 비즈니스 프로필 (2026-06-28 신설 · 코드 완성 · 진행 중 서비스)
블로그 발행 후 **부가 발행**(네이버 플레이스와 같은 패턴). 메타와 달리 access_token 1시간이라 **refresh_token 저장 → 발행 직전 갱신**.
| 역할 | 파일 | 무엇 |
|---|---|---|
| OAuth lib(앱) | `src/lib/google-business/oauth.ts` | 인가 URL(scope=business.manage, offline+consent)·code 교환(refresh_token)·refresh·`listAccounts`/`listLocations`. |
| OAuth 라우트(앱) | `src/app/api/channels/google/{start,callback,session,connect}/route.ts` | start=인가 URL · callback=교환+계정/위치 조회+세션 · connect=refresh_token 암호화 저장(`channels.googleBusiness`). `GOOGLE_BUSINESS_CONNECT_ENABLED` 게이트. |
| 온보딩(앱) | `src/app/onboarding/channels/google/{page,select,fail}/page.tsx` | 안내 → 가게(위치) 선택 → 연결. |
| 발행 자격증명(워커) | `worker/src/publish/tenant-google-business.ts` | `getTenantGoogleBusiness` — refresh_token 복호화 + account/location. |
| 토큰 갱신(워커) | `worker/src/google-business/refresh-token.ts` | refresh_token → access_token(발행 직전). |
| 게시(워커) | `worker/src/google-business/{local-post.ts,publish-local-post.ts}` | LocalPost 본문 빌더 + v4 `localPosts.create`(parent=accounts/a/locations/l). |
| 발행 오케스트레이터(워커) | `worker/src/publish/publish-google-business-tenant.ts` | 블로그 발행 후 부가 발행. 사진은 발행 시점 재서명(`freshSignedReadUrl`). |
| 발행 게이트(워커) | `worker/src/publish/fire-publish.ts` blog case | **HOLD**: `GOOGLE_BUSINESS_PUBLISH_ENABLED=true`일 때만. dry=`GOOGLE_BUSINESS_DRY_RUN`(기본 true). |

⚠️ **현재 상태·의도 = `STATUS.md` 완성도 보드**(시점 상태는 STATUS에만 — INDEX §4-1). 요약: **진행 중 서비스**(먼 훗날 HOLD 아님 — 아우르메가 첫 클라이언트). 발행 게이트 off + 외부 승인 2건 대기(GBP 프로필 관리권한 요청 2026-06-23 발송 + GBP API Basic 승인 케이스 `3-8925000041719`). 미승인 프로젝트는 quota 0(403). 게이트 미설정=완전 비활성, settings 채널 카드 "준비중".

### 연결 상태 조회(앱 공통) — `src/app/api/channels/state/route.ts`
**GET** — 테넌트명 + `tenants/{tid}.channels` 맵 전체(전 채널 연결상태)를 한 번에 반환. 설정·온보딩 화면 로드의 핵심 읽기 라우트다(연결/끊기/일시정지는 쓰기, 이건 유일한 **읽기** 라우트). `tenantName`은 최상위 `name`(업체생성 시) → `profile.storeName`(온보딩 시) 순 폴백(환영 문구용). §2의 채널 데이터 모델을 그대로 노출하므로 앱은 여기서 `naver.sessionStatus`·메타 `expiresAt` 등 발행가능 판정(§4) 재료를 다 받는다.

> 참고: 실시간 구독(홈 카드 잠금 등)은 이 라우트가 아니라 `src/hooks/useExposureSetup.ts`의 `tenants/{tid}` onSnapshot(§2 "읽는 쪽" 표)을 쓴다. `channels/state`는 **1회성 로드**(폴링/초기 렌더)용이다.

### 만료 안내(앱 공통)
`src/lib/channels/expiry.ts` — `expiresAt` 기준 ok/warn(7일내)/danger 배너. `src/components/channels/ExpiryBanner.tsx`.

### 끊기·일시정지(앱 공통) — `src/app/api/channels/disconnect/route.ts`
사장님의 채널 끊기는 **서버 라우트 경유**다(tenants 쓰기는 firestore 규칙상 operator 전용이라 클라 직접 쓰기는 권한거부, CH-02).
- **`disconnect`**: `connected:false` + **발행 자격증명 동시 삭제**(naver: `credential` 삭제+`sessionStatus:'pending'` 리셋 / 메타: `pageToken`·`igUserId`·`pageId` 삭제 / naverPlace: 자격증명 없어 connected만) + `disconnectedAt` 도장 (`disconnect/route.ts:58~86`).
  **불변식: 끊기 = 자격증명 동시 삭제.** 남겨두면 워커가 잔존 토큰·레거시 계정으로 발행을 시도한다(CH-03).
- **`pause`/`resume`**: `paused` 토글만(연결·자격증명 유지, 생성·점검·발행에서 제외).
- **워커의 끊김 판정 근거는 정확히 `connected === false`다**(`fire-publish.ts:111~112`) — `disconnectedAt`은 기록용 표식일 뿐 판정에 안 쓴다. 판정 로직을 disconnectedAt 기준으로 "개선"하면 안 된다.

---

## 4. 발행 준비 판정 — `connected` ≠ 발행 가능

**가장 헷갈리는 지점.** "연결됨"과 "지금 발행 가능"은 다르다. 이걸 앞단(홈카드·승인 게이트)에서 구분해야
첫 글이 발행 직전에 침묵으로 죽는 사고(channels-1)를 막는다.

| 채널 | 연결됨(`connected`) | **발행 가능** 추가 조건 | 판정 함수 |
|---|---|---|---|
| 네이버 블로그 | 자격증명 저장(앱) | **세션 `ready`/`expiring`/undefined**(즉 `pending`·`expired`가 아님) | `naverReadyFromSession`(`src/lib/exposure-setup.ts:156`) ↔ 워커 게이트(`publish-naver-tenant.ts:122·129`) |
| 인스타·페북 | OAuth 완료(앱) | **토큰 미만료**(`expiresAt > now`) | `fire-publish.ts:96`(IG)·`233`(FB) |
| 유튜브 | env 계정 | (영상 워처 별도) | — |

**`naverReady`의 정확한 규칙(앱·워커 미러)**: `connected === true` **그리고** `sessionStatus`가
`'pending'`도 `'expired'`도 아닐 때만 true. `'ready'`·`'expiring'`·`undefined`(구버전 데이터)는 통과
— 워커 발행 게이트가 `pending`/`expired`만 차단하는 것과 **정확히 같다**(레거시 undefined 회귀 안전).

이 `naverReady`가 쓰이는 곳:
- **홈 메인 카드 잠금**(`isHomeCardLocked`, `exposure-setup.ts:196`): post 카드는 `naverReady`까지 돼야 열림.
  세션 `pending`이면 카드를 열어줘 봐야 첫 글이 발행 직전에 죽으니, 잠그고 `/onboarding/channels`로 보낸다.
- **생애주기 판정**(`lifecycleStage`, `exposure-setup.ts:173`): `naverReady` 또는 인스타가 있어야 `active`.
- **승인 직전 채널 사전검증**(channels-1·approve-7).

### env 실전환 게이트 — 표의 조건을 다 통과해도 마지막 관문이 하나 더 있다

**실발행은 채널별 env가 정확히 문자열 `'false'`일 때만** 일어난다 — 미설정·오타·다른 값 전부 **dry-run**(안전 기본):

| env | 채널 | 코드 |
|---|---|---|
| `NAVER_PUBLISH_DRY_RUN` | 네이버 블로그 | `fire-publish.ts:165` |
| `META_DRY_RUN` | 인스타·페북·릴스 | `fire-publish.ts:49`(`isDryRun`) |
| `YT_DRY_RUN` | 유튜브 쇼츠 | `fire-publish.ts:50`(`isYouTubeDryRun`) |

dry-run이면 어댑터까지 갔다 와도 **`published` 전이·슬롯 `fired`·완료 알림 전부 skip**한다
(`fire-publish.ts:568~576`, B2 — 안 막으면 "발행했다"고 거짓 종결돼 재발행도 안 잡힘).
"연결·세션·토큰 다 멀쩡한데 안 올라감"의 **마지막 용의자가 이 게이트**다. 채널별 상세는
[srs/05-네이버-블로그.md](srs/05-네이버-블로그.md)·[srs/06-인스타그램.md](srs/06-인스타그램.md)·[srs/07-페이스북.md](srs/07-페이스북.md)·[PIPELINE.md](PIPELINE.md) 참조.
(GBP의 `GOOGLE_BUSINESS_DRY_RUN` 기본 true도 같은 패턴 — §3 GBP 표.)

---

## 5. 🔒 불변식 (이걸 깨면 "연결했는데 안 올라감"이 재발한다)

| # | 불변식 | 왜(깨지면) | 지키는 코드 |
|---|---|---|---|
| **A** | **`connected`만으론 발행 못 한다** — 네이버는 세션 `ready`, 메타는 토큰 미만료까지 봐야 "발행 가능". 앞단 판정·게이트에서 둘을 구분할 것. | connected만 보고 카드 열거나 발행 시도하면 **첫 글이 발행 직전 침묵 실패**(`pending`)하거나 만료 토큰으로 거부당함 | `naverReadyFromSession` exposure-setup.ts:156 / publish-naver-tenant.ts:122·129 / fire-publish.ts:96·233 |
| **B** | **네이버 세션 = 로컬 파일 + GCS 백업(2중 prefix)** — `auth/naver/{tid}.json`이 단일 사본이면 디스크 사고 시 전 업체 인증 소실. 매일 오프사이트 암호화 백업 유지. 백업은 최신본+날짜 세대 2중 구조(§7) — **prefix 통합·세대 제거 = 복원 배선 파괴**. | 백업 없으면 디스크 사고 = 전 업체 네이버 발행권 통째 소실(복구 불가). 세대 없으면 손상 세션이 백업을 덮는 순간 끝 | backup-naver-sessions.ts(03:00) / backup-sessions.ts (infra-3·RECO-1) |
| **C** | **발행 직전 세션 라이브 재검** — 크론 기록(`sessionStatus`)으로 조기 차단하되, 실제 발행 브라우저에서 `checkLoggedIn`으로 한 번 더 확인. | 크론 점검과 발행 사이에 세션이 죽으면(TOCTOU) 빈 세션으로 발행 시도 | publish-naver-tenant.ts:188(`checkLoggedIn`) + :122·129(크론 게이트) |
| **D** | **만료 토큰으로 메타 발행 시도 금지** — `expiresAt <= now`면 발행하지 말고 **보류(held)** + 재연결 유도. 자동 재발행은 무의미(메타가 거부). ⚠️ held의 실제 종결 = **state `failed` + 슬롯 failed + 운영자 `publish-held` 알림**(사장님 안 울림), **자동 재개 없음**(§6 메타 참조). | 만료 토큰 재시도는 영원히 실패하며 자동재시도 루프만 돈다 | fire-publish.ts:225~227(IG expired)·254~256(FB)·617~655(held 종결) |
| **E** | **채널 미러(앱·워커) 동기** — 발행 가능 판정 규칙은 앱(`naverReadyFromSession`)과 워커 게이트(`publish-naver-tenant`)가 **같아야** 한다. | 둘이 어긋나면 앱은 "발행 가능"이라 카드 열어주는데 워커는 차단 → 사장님이 "왜 안 올라가" | exposure-setup.ts:153~162 주석이 "워커 게이트와 정확히 같은 규칙"임을 명시 |
| **F** | **연결 요청은 운영자에게 닿아야 한다** — 네이버는 셀프 연결 불가(운영자 QR 필수). connect 시 운영자 알림이 안 가면 사장님이 영영 대기. | 알림 누락 시 사장님 연결 요청이 운영자에게 안 닿아 영영 `pending`(사장님 제보) | naver/connect/route.ts:70(`notifyOperatorNaverConnect`) |
| **G** | **만료/미연결을 조용히 폴백하지 말 것** — 끊은 채널(`connected:false`)을 레거시 env 계정으로 교차발행하면 **엉뚱한 계정에 게시**된다. | 사장님이 끊은 인스타로 다른 업체 계정에 발행되는 사고 | fire-publish.ts:100~109(CH-03, `unconnected` 분기) |

---

## 6. 인증 상태 기계 (채널 하나의 일생)

### 네이버 블로그
```
(미연결) ──연결(앱 connect)──▶ connected + pending ──운영자 QR 로그인──▶ connected + ready
                                      │                                        │
                              (운영자 미처리)                          (쿠키 만료 임박, 14일내)
                                  영영 대기                                  expiring
                                                                              │ (만료)
                                                                           expired ──재로그인(QR)──▶ ready
```
- **pending**: 자격증명만 저장됨. 운영자 QR 로그인 전. **발행 불가**(게이트 `no-session`).
- **ready**: 세션 살아있음. **발행 가능.**
- **expiring**: 로그인 쿠키 14일내 만료. 아직 발행 가능하나 운영자에게 사전 경고.
- **expired**: 만료. **발행 불가**(게이트 `session-expired`) → 운영자 재로그인 필요.
- **undefined**(구버전 데이터): 게이트 없이 통과(레거시 회귀 안전).
- **우회 전이(합법)**: 운영자 QR 로그인 성공(`markNaverSessionReady`)이 `sessionStatus:'ready'`와 함께
  **`connected:true`도 켠다**(`tenant-session.ts:17~22` · `qr-remote-login.ts:86`) — 앱 connect 라우트를
  안 거친 연결이 가능하다. 따라서 **connected인데 `credential` 없음 = 정상일 수 있다**(위 다이어그램의
  "연결(앱 connect)" 단일 입구만 가정하고 credential 존재를 전제하면 안 됨).
- **끊기 전이(전 채널 공통)**: 어떤 상태에서든 사장님 끊기(§3 disconnect 라우트) → `connected:false` +
  자격증명 삭제 + naver는 `sessionStatus:'pending'` 리셋. 재연결은 처음부터(connect → QR).

### 메타 (인스타·페북)
```
(미연결) ──OAuth 연결(앱)──▶ connected + expiresAt(약 53일) ──(만료 임박 14일)──▶ 알림 ──(만료)──▶ 만료분 발행 = held
                                                                                                     │
                                                                                     state 'failed' 종결 + 슬롯 failed
                                                                                     + 운영자 publish-held 알림 (자동 재개 없음)
```
- 연결 즉시 발행 가능(네이버와 달리 별도 세션 단계 없음). 단 실전환 env 게이트는 별도(§4 하단).
- 만료되면 발행 시도 안 하고 **held로 종결** — content **state `failed`** + 슬롯 `failed` + **운영자** `publish-held`
  알림(사장님 텔레그램은 안 울림). `fire-publish.ts:225~227·254~256(expired 분기)·617~655(held 종결)`.
- **자동 재개 없음** — 재연결(설정>연결된 채널)은 **채널을 복구할 뿐**이고, 만료 기간에 밀린 글은 **수동 재발행**해야
  한다. 계정 정지(suspended)가 scheduled 유지 + 해제 시 자동 재개인 것과 **정반대** — 둘을 혼동하면 "재연결했는데
  밀린 글이 안 나감"을 버그로 오판한다.

---

## 7. 점검·백업 크론 (언제 무엇이 돌아가나)

| 크론 | 시각(KST) | 무엇 | 파일 |
|---|---|---|---|
| **네이버 세션 백업** | 매일 03:00 | 세션파일 GCS 암호화 백업(오프사이트 사본, 2중 구조 — 아래). | backup-naver-sessions.ts |
| **네이버 세션 점검** | 매일 04:05 | 쿠키 만료시각 **단일 기준**으로 `sessionStatus` **무조건 덮어쓰기** + 만료(임박) 알림. 만료 임박 14일·재발송 최소 3일 간격. | naver-session-check.ts |
| **메타 토큰 점검** | 매일 04:05 | 인스타·페북 `expiresAt` 14일내·만료 알림. number/Timestamp 양쪽 방어. | meta-token-check.ts |

**크론 격리(cron-1·cron-6)**: 세 크론 모두 `forEachIsolated`로 업체 단위 격리 — 한 업체의 update 실패가
그날 나머지 업체 점검을 통째로 중단시키지 않는다.

**세션 백업은 2중 구조(RECO-1)** — prefix 두 개가 역할이 다르다:
- **최신본** `naver-session-backup/{name}.enc` — **복원 스크립트(`scripts/restore-naver-sessions.ts`)가 읽는 유일한 경로.**
- **날짜 세대** `naver-session-backup-history/{YYYY-MM-DD}/{name}.enc` — 7세대(=최근 7일) 보관 후 자동 정리.
  손상된 세션이 최신본을 덮어써도 세대에서 되살릴 수 있다(단일 사본 시절의 구멍 봉합).
- **침묵 실패 판정**: 대상 파일이 있는데(`found>0`) 백업이 0건(`backed=0`)이면 크론이 **throw → `cron-failed`
  운영자 알림**(`backup-sessions.ts:41~49` `evaluateBackupResult`). GCS_BUCKET 미설정·업로드 전멸이 조용히 안 넘어간다.
- ⚠️ prefix를 하나로 합치거나 세대를 없애는 "정리"는 복원 배선 파괴다(§5-B).

**세션 점검은 무조건 덮어쓰기**: `sessionStatus`는 문제 여부와 무관하게 **매일 항상 기록**된다
(`naver-session-check.ts:79·100~105` — 앱 표시·운영자 콘솔 연결대기 목록이 읽으므로). 쿠키 만료시각만 보고
서버측 무효화는 못 보기 때문에, CHAN-1이 되반영한 `expired`도 쿠키가 유효하면 다음날 `ready`로 복원된다(상단 노트의 진동).

**⚠️ 판단 불가 = '문제 없음'으로 기운다(두 크론 공통)**: 네이버는 세션파일 파싱 불가·세션쿠키(만료시각 없음)면
`ready` **정상 취급**(`naver-session-check.ts:45~49·88~89`), 메타는 `expiresAt` 미상이면 **스캔 스킵**
(`meta-token-check.ts:61~62`) — 어느 쪽도 알림이 안 나간다. 즉 크론 커버리지는 완전하지 않고, 이런 케이스의
**마지막 방어선은 발행 직전 라이브 재검(§5-C)뿐**이다. "크론이 이미 점검했으니" 재검을 최적화 삭제하면 안 되는 근거.

**과거 사고(meta-token-check 주석)**: 예전엔 비어 있는 루트 `channels` 컬렉션을 조회 + number에 없는
`expiresAt.toMillis()` 호출 → 메타 만료 알림이 한 건도 안 나갔다. 발행이 조용히 멈춰도 사장님이 몰랐다(CH-04).
지금은 `tenants` 맵을 순회하고 number/Timestamp 양쪽을 방어한다.

---

## 8. 🧪 채널 인증을 안전하게 바꾸는 법 (새 작업 체크리스트)

채널 연결·세션·발행 인증 근처를 손댈 때 **이 넷을 자문**한다:
1. **`connected`만 보고 "발행 가능"이라 판정하나?** → 위반 §5-A. 네이버는 세션 ready, 메타는 미만료까지 봐야 한다.
2. **앱 판정과 워커 게이트 규칙이 어긋나나?** → 위반 §5-E. `naverReadyFromSession`과 `publish-naver-tenant` 게이트를 같이 본다.
3. **만료/미연결을 조용히 폴백하나?** → 위반 §5-D·G. 만료는 보류(held)+알림, 끊은 채널은 `unconnected`.
4. **세션 백업·운영자 알림 배선을 끊나?** → 위반 §5-B·F. 백업 크론·`notifyOperatorNaverConnect`를 깨면 인증이 조용히 소실된다.

**검증**: 채널 인증 변경은 **②실Firestore 통합 테스트** + 가능하면 **③실 로그인 스모크**(네이버 QR/CDP·메타 OAuth)까지.
순수 로직만으론 세션 만료·토큰 거부·TOCTOU를 못 잡는다. 네이버 QR/CDP·메타 OAuth의 실제 동작은
[[메모리 reference_naver_session_qr_cdp_no_captcha]] 참조.

---

## 9. 코드↔문서 매핑 (이 문서의 규칙이 사는 곳)

> 형식: **파일 + 함수·마커 주석 + 규칙 한 줄** (라인 번호는 밀리므로 함수·마커 기준 — 본문 §가 정본, 이 표는 색인).
> 이 표의 코드를 고치면 해당 §를 **같은 커밋에서** 갱신한다. 여기 없는 새 채널 규칙을 만들면 행을 추가한다.

| 규칙 (한 줄) | 문서 § | 코드 (파일 · 함수/마커) |
|---|---|---|
| connected ≠ 발행 가능 — 네이버 세션 게이트 앱·워커 미러 | §4 · §5-A·E | `src/lib/exposure-setup.ts` `naverReadyFromSession` ↔ `worker/src/publish/publish-naver-tenant.ts` 세션상태 게이트 |
| env 실전환 게이트 — 정확히 `'false'`만 실발행, dry-run은 published 전이·슬롯·알림 skip | §4 하단 | `worker/src/publish/fire-publish.ts` `isDryRun`·`isYouTubeDryRun`·`NAVER_PUBLISH_DRY_RUN`(blog case)·B2 주석 블록 |
| 발행 직전 세션 라이브 재검 + 실패 시 `expired` 되반영·알림(CHAN-1) | §5-C · 상단 노트 | `publish-naver-tenant.ts` `checkLoggedIn` 분기 · `worker/src/naver/mark-session-expired.ts` `markNaverSessionExpiredAndNotify` |
| 세션점검 크론 = 쿠키 만료 단일 기준·매일 무조건 덮어쓰기(CHAN-1 진동의 원인) | §7 · 상단 노트 | `worker/src/cron/jobs/naver-session-check.ts` "상태는 문제 여부와 무관하게 항상 기록" 주석 |
| 판단 불가 = 정상 취급/스킵(알림 없음) — 백스톱은 발행 직전 재검뿐 | §7 | `naver-session-check.ts` `loginCookieExpiryMs` null 분기 · `worker/src/cron/jobs/meta-token-check.ts` `toMs`=0 스킵 |
| 발행 시도마다 세션 롤링 갱신(성공·실패 무관, 실패 침묵) | §3 세션파일 행 | `publish-naver-tenant.ts` `saveStorageState`(publishPost 직후) |
| 세션 백업 2중 prefix(최신본=복원 유일 경로+7세대) + 침묵 실패 throw | §5-B · §7 | `worker/src/naver/backup-sessions.ts` `NAVER_SESSION_BACKUP_PREFIX`·`NAVER_SESSION_BACKUP_HISTORY_PREFIX`·`evaluateBackupResult`(RECO-1) |
| 끊기 = connected:false + 자격증명 동시 삭제(서버 라우트 경유, CH-02·03) | §3 끊기 절 · §6 | `src/app/api/channels/disconnect/route.ts` disconnect 분기 |
| 워커 끊김 판정 = `connected === false` 정확히(disconnectedAt은 기록용) | §3 끊기 절 | `fire-publish.ts` `resolveIgPublishTarget`의 `disconnected` 분기(CH-03 주석) |
| 메타 토큰 만료 = held → state failed + 슬롯 failed + 운영자 알림, 자동 재개 없음(CH-05) | §5-D · §6 메타 | `fire-publish.ts` `expired` 분기(IG·FB) + `dispatched.held` 종결 블록 |
| QR 로그인 성공이 connected:true도 켬(앱 connect 없는 우회 연결 합법) | §6 네이버 | `worker/src/naver/tenant-session.ts` `markNaverSessionReady` · `qr-remote-login.ts` 로그인 감지 분기 |
| 미연결·끊은 채널 레거시 폴백 금지(엉뚱한 계정 발행 방지) | §5-G | `fire-publish.ts` `resolveIgPublishTarget`·`LEGACY_IG_ACCOUNT`(폴백은 알려진 레거시만) |
| 네이버 connect 시 운영자 알림 필수(안 가면 영영 pending) | §5-F | `src/app/api/channels/naver/connect/route.ts` `notifyOperatorNaverConnect` |
| 레거시(channels 맵 없음)=`['blog']` 폴백 vs 맵 있고 0개=생성 생략 구분(intake6-3) | §2 | `worker/src/firestore/channels.ts` `getChannelsForTenant` · `resolve-generation-channels.ts` |

> **유지 규율**: 채널 데이터 모델·인증 흐름·불변식·파일이 바뀌면 이 문서를 **즉시 갱신**(STATUS·SCHEDULE처럼 드리프트 없이).
> 채널 감사 갭은 BUG-REGISTER(CH-01~), 연쇄위험은 BLUEPRINT를 짝으로 본다.
