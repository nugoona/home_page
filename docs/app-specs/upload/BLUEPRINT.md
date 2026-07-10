# NGN Upload — 블루프린트 (연결·연쇄영향 단일 지도) 🗺️

> **이 문서의 목적은 딱 하나: "어디를 건드리면 어디가 터지나"를 한 장에 보이게.**
> 기능이 *무엇을 하나*는 [OVERVIEW.md](OVERVIEW.md)가, *어디에 구멍이 있나*는 [BUG-REGISTER.md](BUG-REGISTER.md)가 담는다.
> 이 문서는 그 사이 — **기능들이 서로 어떻게 연결되고, 한 곳을 고치면 어디로 번지나**(연쇄영향)만 다룬다.
> 비개발자도 **§1 지도 + §2 연쇄표 + §3 패턴** 세 개만 보면 전체 위험 구조가 잡히게 썼다.
>
> 🚦 **출시·릴리즈·"됐다/준비됨" 판단 전 반드시 [STATUS.md](STATUS.md)의 "채널·기능 완성도 보드"부터 본다.** 이 블루프린트(§1~§7)는 "연결·위험"만 그려서, *무엇이 실제로 라이브 vs HOLD vs 예정인가*(완성도)를 안 담는다 — 그 결과 2026-06-28 릴리즈 판단에서 **플레이스·구글·유튜브·카카오가 미연결인데 "출시 가능"이라 잘못 말한 구멍**이 났다(사장님 지적). 완성도 보드는 시점 상태라 STATUS로 이사했다(구 §10). 완성도 상세 = [GUIDE-SERVICE-MAP.md](GUIDE-SERVICE-MAP.md).
>
> 근거: 2026-06-26 연쇄위험 팀 감사(12도메인 코드 실측 → 적대적 재검 80건→50건 확정). 상세 50건 = BUG-REGISTER "연쇄위험 감사".
> 원칙(사장님 확정): **안정성 > 기능.** 복잡한 자동화가 안정성을 떨어뜨리면, 기능을 포기해서라도 단순하게.
>
> ⚠️ **상태 표기(🔴🟠) 주의(2026-06-28 갱신)**: §2·§3·§6·§7의 위험 상태는 **6/26 감사 시점**이다. 그 이후
> **다수가 이미 수정·라이브**됐다 — 예: 페북 정책도장(policy-1·2, BLUEPRINT 유일 🔴 critical), 네이버
> 세션 백업(infra-3, §7 1순위), 자동승인 CAS(approve-2), 노출 directive 검수 게이트(exposure-1), 워커
> 자가재시작(cron-2), 전역 크론 격리(C패턴) 등. **현재 실제 위험·해결 상태의 단일 진실은 STATUS.md·
> BUG-REGISTER.md**다(이 표의 🔴를 "지금도 미해결"로 읽지 말 것). 이 문서는 "연쇄 구조·패턴"을 보는 용도.

---

## 1. 한눈 지도 — 도메인 12개와 연결

```
[사장님 입력]
  ①업로드 ──사진+메모──▶ ②콘텐츠 생성 ──글/캐러셀/페북──▶ ③검토·승인 ──승인──▶ ④스케줄·발행 ──▶ [네이버·인스타·페북]
     │                      ▲   ▲   ▲                      │                    ▲
     │                      │   │   │                  (자동발행 토글)            │
  ⑧온보딩·프로필 ──키워드·소개·제외어·지시사항──┘   │   └──⑥정책버전·재생성(횡단)──────┤ ←미발행 글 재투입
   (플레이스 크롤)            │                      │                            │
     │              ⑤노출(키워드·검색량·순위·노출소식)──directive 주입──┘   ⑦썸네일·커버 렌더(횡단)
     │                                                                          ▲
  ⑨계정·인증·act-as ──정지/삭제──▶ (전 도메인 진입·발행 게이트)      ⑩알림·실패복구·크론·자가복구 (옆에서 전부 감시)

  ⑪영상(3레포 경계): 업로드 →[편집준비 ngn-shorts]→ 사장님 편집 →[발행 sns-poster]   ← 본체와 파일/폴더로만 연결
  ⑫호스팅: 워커 = 사장님 PC 단일 프로세스(SPOF). 앱 = Cloud Run. 데이터 = Firestore(GCP).
```

**읽는 법**: 화살표 = "이게 바뀌면 저기로 흘러간다". 가장 위험한 건 **⑥정책버전·⑦썸네일·⑤노출이 ②③④를 횡단으로 건드리는 점선** — 한 군데 설정이 여러 글로 번진다(§2·§3).

---

## 2. 연쇄영향 표 — "X를 바꾸면 어디로 번지나" (감사로 확인된 실제 경로)

| 바꾸는 것 | 통로(연결 필드/트리거) | 번지는 곳 | 위험 |
|---|---|---|---|
| **프롬프트·업종가이드 수정** | `CONTENT_POLICY_VERSION` 수동 bump → policy-refresh 크론(매일04시) | 예약된 옛버전 미발행 글 **전부 재생성** → 발행 | 🟠 cap·확인 없음 / 깜빡하면 옛글 발행(policy-3·6) |
| **프로필 저장**(키워드·제외어·지시사항) | `/api/profile` → `diffRules` → `ruleRefresh`+`thumbRerender` **동시** 마킹 | 미발행 글 다수 재생성 **+** 썸네일 재렌더 | 🟠 진원지. cap 없음(policy-5·thumb-1·profile-1) |
| **노출소식 채택**(주1회 자동) | `exposureDirectives/active`(전역 단일문서) | **전 업체** 새 글에 지침 주입 | 🟠 검수 없이 100업체 동시(exposure-1) |
| **추천키워드 5 변경** | `seoKeywords`/`tagSet` | 블로그 제목+태그+인스타 해시태그+발행직전 **4곳** | 🟡 미러·다중합류(exposure-4) |
| **썸네일 디자인 변경** | `/api/profile` → `thumbRerender` | 검토대기·예약 글 커버 **자동 재렌더** | 🟠 cap 없음+batch500 침묵실패(thumb-1·profile-2) |
| **자동발행 토글 ON** | `settings.autoApprove` → sweep 워처 | 대기분 **일괄 승인** → 발행 큐 | 🟡 cap 없음(하루1건이 분산은 함)(approve-1) |
| **자동승인 동작** | `transitionState`(CAS 없음) | 삭제·수정요청한 글을 **되살림** | 🟠 잠금 없음(approve-2) |
| **채널 연결/해제** | `channels.*` | 홈 카드 잠금 + fan-out 채널 수 + 발행 게이트 | ✅ 가드 있음 |
| **계정 정지** | `tenants.suspended` → whoami 403 | 앱 차단(3층) + 발행 보류(쓰기 없음, 해제 시 재개) | ✅ 가드 / 단 슬롯 좀비(publish-4) |
| **페북 글 생성** | `policyVersion` 도장 **누락** | 발행 직전 영구 보류 + 매일 무한 재생성 | 🔴 **critical**(policy-1·2) |
| **워커 PC 다운/hung** | 단일 프로세스 | 전 업체 발행·생성·검토 **전면 정지** | 🟠 자동복구 없음·알림만(infra-1·cron-2) |
| **PC 디스크 사고** | `auth/naver/*.json` 백업 0 | 전 업체 네이버 인증 소실 → 업체마다 재로그인 | 🟠 백업 0(infra-3) |

---

## 3. 🔑 핵심 — 50개 위험의 뿌리인 "7개 패턴"

감사 50건은 흩어진 50개가 아니라, **반복되는 7개 구조**에서 나온다. 고칠 때 이 패턴 단위로 봐야 한다.

| 패턴 | 무엇 | 해당 위험 | 단순화 방향(안정성>기능) |
|---|---|---|---|
| **A. 채널 미러가 절반만 복사됨** | 블로그·인스타엔 있는 안전장치(정책도장·예약복원·게이트)가 **페북엔 빠짐**. 채널을 복사로 늘리다 누락 | policy-1🔴·policy-2·gen-3 | 페북을 **인스타의 파생으로 고정**(독립 경로 제거) 또는 재생성 대상에서 제외 |
| **B. 단일 동작이 cap 없이 글 다수를 건드림** | 설정 저장·토글·정책버전 **한 번**이 미발행 글을 한꺼번에 재생성/재렌더/승인. **`/api/profile`이 진원지** | gen-2·approve-1·policy-3·policy-5·thumb-1·profile-1·cron-3·exposure-1 | 자동 대량 → **"글 N개 다시 쓸까요?" 1클릭** 또는 발행 직전 lazy. 회당 cap 필수 |
| **C. 전역 루프에 업체별 격리 없음** | 한 업체의 깨진 데이터가 그날 **전 업체** 크론(순위·만료경고)을 죽임 | exposure-2·cron-1·cron-6 | 테넌트 1건을 try/catch+continue로 감싸기(작은 코드) |
| **D. 자동 전이에 안전잠금(CAS) 없음** | 자동승인·재생성이 삭제·수정요청한 글을 덮어써 **부활**시킴 | approve-2·publish-5·policy-4·approve-6 | "preview-ready일 때만 승인" 조건부 트랜잭션 |
| **E. 단일 PC·프로세스·파일에 백업 없음** | 워커 죽으면 전 정지, hung은 자동복구 없음, 네이버 세션 백업 0 | infra-1·infra-3🔴급·cron-2·prefill-1·video-2·infra-5·infra-6 | **클라우드 아님** → 세션 백업 크론 + 자동재시작 + UPS(§7) |
| **F. 게이트가 경로마다 제각각(미러 불일치)** | 계정 차단·비용 게이트가 PC빠른업로드·운영자추가·직원비활성화에서 안 먹거나 늦음 | intake-2·intake-3·intake-4·auth-1·auth-3 | 게이트를 **단일 함수**로 모아 모든 진입점이 같은 걸 쓰게 |
| **G. 영상 자동발행은 검열 0회** | `VIDEO_AUTO_PUBLISH` 켜면 금지어·검수 없이 유튜브·인스타 직행(현재 off) | video-1·video-5 | **영구 비활성 박제**(영상도 사람 검토 통일) |

> **사장님 직감 검증**: 위험의 절반(A·B·F)이 *"똑똑한 자동화"와 "코드 복사"* — 정확히 사장님이 말한 "복잡해서 불안정한 부분"이다. 단순화하면 대부분 한꺼번에 사라진다.

---

## 4. 지침 지도 — "어떤 규칙이 어디 있고, 무엇에 영향 주나"

⚠️ 지침이 **박제 문서(사람용 요약)**와 **실제 프롬프트(LLM 주입본)**로 이원화돼 있다. 둘이 어긋나면 *"문서엔 이렇게 썼는데 글은 다르게 나오는"* 드리프트가 생긴다. 지침을 바꾸면 §2의 연쇄(재생성)로 번진다.

| 지침 | 박제 문서 | 실제 동작(프롬프트/코드) | 무엇에 주입·영향 | 바꾸면 번지는 곳 |
|---|---|---|---|---|
| **키워드 발굴** | `docs/KEYWORD-TAGSET-RULES.md` | `keyword-builder.ts`·`keyword-engine.ts` (앱·워커 **2벌 미러**) | 블로그 제목·태그 + 인스타 해시태그 + 발행직전 합류 | 4곳 동시(미러 어긋나면 추천≠발행, exposure-4) |
| **글 주제·글감** | `docs/CONTENT-ROTATION-CONSTITUTION.md` (헌법) | `prompts/blog-agent-prompt.md`(코어) + `guides/blog-guide-{12업종}.md` + `generate-posts.md`(글감) | 글 본문 생성 전반 | `CONTENT_POLICY_VERSION` bump 시 미발행 글 재생성(policy-3) |
| **글쓰기 톤** | (RULES 일부) | `tone-prompt-blocks.ts`(6종) | 글 톤·문체 | 톤 변경=정책 변경 → 재생성 대상 |
| **사진 규칙** | OVERVIEW §5 "⚖️ 박제된 법"(원문=_archive/OVERVIEW-5-LOG) | `photo-dedup-vision.md` + `detect-similar` + 유효4장 게이트 | 발행 차단(4장 미만 보류) | 발행 직전 게이트(여러 도메인 수렴) |
| **노출 뉴스(정적 규칙)** | EXPOSURE.md(원문=_archive/OVERVIEW-5-LOG "노출 소식 엔진") | `prompts/exposure-rules.md`(v1, 공식 가이드) | 블로그 프롬프트에 정적 주입 | 글 생성에 항상 반영 |
| **노출 뉴스(동적 반영)** | `specs/2026-06-24-exposure-news-auto-reflect-design.md` | `exposure-collect.md`→`exposure-news-judge.md`→`exposureDirectives/active` | **전 업체** 새 글에 directive 주입 | 단일 전역문서 → 100업체 동시(exposure-1) |
| **업체별 지시사항** | (설정 화면) | `profile.instructions` → `buildTenantBlock` | 그 업체 글에 강제 주입 | `/api/profile` 저장 → rule-refresh 재생성(policy-5) |
| **제외어(빼는 말)** | (설정 화면) | `excludeKeywords`(scope all/imageText) → `resolveExcludeKeywords` | 제목·본문·태그·사진글자 | scope:all 추가 시 재생성(rules-diff) |
| **전체 작업·콘텐츠 규칙** | `docs/RULES.md` | (메모리 종합) | 사람(개발) 판단 기준 | 충돌 시 기준 |

> **정책버전이 열쇠**: 위 지침(키워드·글주제·톤·노출규칙)을 바꿨는데 `CONTENT_POLICY_VERSION`을 안 올리면 → 옛 지침 글이 그대로 발행된다(policy-6). 지침 수정 = 버전 bump가 **한 세트**여야 한다.

---

## 5. 단순화 원칙 (안정성 > 기능)

블루프린트가 지키는 설계 규율. 새 기능·수정 때 이 잣대로:

1. **자동 대량 처리 금지** — 한 동작이 글 여러 개를 건드리면 cap을 두거나 사장님 1클릭으로(패턴 B).
2. **복사 대신 단일 소스** — 같은 로직을 두 곳에 복사하지 말 것(채널·앱/워커 미러). 어쩔 수 없으면 동일성 테스트로 강제(패턴 A·F).
3. **항목 단위 격리** — 한 글/업체의 결함이 전체를 죽이지 않게 try/catch는 항목 단위로(패턴 C·E).
4. **자동 전이엔 잠금** — 상태를 자동으로 바꿀 땐 "이 상태일 때만" 조건부로(패턴 D).
5. **무검토 발행 경로 금지** — 사람 검토를 건너뛰는 자동발행은 두지 않는다(패턴 G).
6. **클라우드보다 백업·자동복구** — SPOF는 이전이 아니라 백업·자동재시작으로 단순하게 완화(§7).

---

## 6. 도메인 카드 (드릴다운 — 각 도메인의 입력·트리거·파급)

각 카드: **무엇 · 트리거(누가 부르나) · 의존 · 🔗파급(바꾸면 어디로) · 상세링크**

- **① 업로드/인테이크** — 사진·메모·영상 수신. 트리거=사장님 업로드→`event-watcher`. 의존=인증·GCS. 🔗→②생성(fan-out). 갭=경로 IDOR·게이트 미러(intake-2~4). [PIPELINE](PIPELINE.md)
- **② 콘텐츠 생성** — 분류·Q&A·블로그/인스타/페북 작성. 트리거=`write-*-watcher`. 의존=④지침·⑤키워드·프로필. 🔗→③검토. 갭=fan-out 순서·페북 미러(gen-2·3). 
- **③ 검토·승인** — 직접편집·수정요청·**자동발행 토글**. 트리거=사장님 or `auto-approve-sweep`. 🔗→④발행. 갭=일괄승인·CAS없음(approve-1·2).
- **④ 스케줄·발행** — 슬롯·빈도·금지어·사진·이미지 게이트·채널 어댑터. 트리거=`slot-fire-watcher`. 🔗→외부 발행. 갭=슬롯 좀비·dry-run(publish-4·2).
- **⑤ 노출** — 키워드·검색량·순위·노출소식. 트리거=온보딩·크론·`exposure-bootstrap`. 🔗→②생성·④태그. 갭=directive 무차별·크론 격리(exposure-1·2).
- **⑥ 정책버전·재생성(횡단)** — 지침 바뀌면 미발행 글 재생성. 트리거=`policy-refresh`·`rule-refresh-watcher`. 🔗→②③④ 전부. 갭=페북 영구보류·cap없음·수동버전(policy-1~6).
- **⑦ 썸네일·렌더(횡단)** — 커버 자동 재렌더. 트리거=`thumb-rerender-watcher`. 🔗→발행 커버. 갭=cap없음·경쟁·미러(thumb-1~6).
- **⑧ 온보딩·프로필·크롤** — 이름1칸 온보딩·플레이스 크롤·**프로필 저장(연쇄 진원)**. 트리거=`place-prefill-watcher`. 🔗→⑤⑥⑦. 갭=크롤 SPOF·batch500(prefill-1·profile-2).
- **⑨ 계정·인증·act-as** — whoami 게이트·정지/삭제·운영자. 트리거=진입마다 whoami. 🔗→전 도메인 게이트. 갭=게이트 미러·토큰무효화(auth-1·3).
- **⑩ 알림·실패복구·크론** — 워처 재구독·reaper·만료경고·watchdog. 트리거=크론·onSnapshot. 🔗→감시 전반. 갭=hung 미복구·크론 격리·onFatal(cron-2·4·6).
- **⑪ 영상(3레포 경계)** — 업로드→편집준비→발행. 트리거=폴더/작업스케줄러. 🔗→sns-poster·shorts. 갭=무검토 발행·chokidar 누락·폴더 미러(video-1·2·5). [메모리 video-pipeline]
- **⑫ 호스팅** — 워커=PC 단일(SPOF)·앱=Cloud Run·데이터=Firestore. 갭=백업0·자동복구없음(infra-1·3·5). →§7

---

## 7. 인프라·클라우드 판단 (감사 확정)

**워커가 사장님 PC 한 대에 사는 SPOF는 진짜 약점(high). 하지만 클라우드 풀이전은 권고 안 함:**
- 네이버 발행이 **실크롬 세션**(봇탐지 회피), 영상·STT가 **로컬**에 묶여 클라우드와 상극 → 이전 시 복잡도↑·네이버 자동화 깨질 위험 = 안정성 역효과.
- **데이터(Firestore)는 이미 GCP라 안전.** 진짜 구멍은 **로컬 세션·영상 백업 0**.

**클라우드 대신 더 단순·탄탄한 4종(우선순위):**
1. 🔴 **네이버 세션 백업 크론** — `auth/naver/*.json`을 매일 1회 GCS 암호화 동기화. 코드 한 조각. (infra-3 = 디스크 사고 시 전 업체 인증 소실, 지금 가장 시급)
2. **워커 hung 자동재시작** — 지금은 알림만. heartbeat 정체 자가감지→`process.exit`→supervisor 재기동(cron-2).
3. **UPS + BIOS 자동전원복구 + 부팅 자동실행** — PC 꺼져도 스스로 복귀(infra-1).
4. **예비 PC 콜드스탠바이** — 세션·env 동기화로 수동 페일오버 30분.

**재검토 조건**: 업체가 크게 늘거나 PC 물리 장애가 잦아지면 그때 부분 이전 검토.

---

## 8. 문서 지도
→ **`docs/INDEX.md`** (문서지도·작업 라우팅·코드→문서 매핑의 단일 소스로 이사). 도메인 문서 10종(SCHEDULE·ACCOUNT-AUTH·CHANNELS·RECOVERY·GENERATION·REVIEW·ONBOARDING·THUMBNAIL·EXPOSURE·VIDEO)은 §1 도메인 지도·§2 연쇄표의 드릴다운이다 — 해당 도메인 건드리기 전 먼저 읽는다.

> **유지 규율**: 세션 끝에 연쇄·패턴 변화가 생기면 이 문서 §2·§3을 갱신. 새 기능은 §5 원칙으로 점검. STATUS·BUG-REGISTER처럼 드리프트 없이.

---

## 9. 영상 규격변환 파이프라인 — stage3 사이드카 (✅ 라이브, 2026-06-28)
> ✅ **사이드카 배선·검증·라이브 완료(2026-06-28).** 다른 레포(ngn-shorts-reels-automation)의 Python `stage3` 파이프라인을 ngn_upload가 **별도 프로세스(사이드카)로 띄우는 런처·상주·config**를 만들었다(원본 인계 = `ngn-shorts-reels-automation/docs/HANDOFF_ngn_upload_pipeline.md`, 70a4da8). **자동시작·부팅 등록까지 라이브 켜짐**(STATUS "영상 규격변환 사이드카 ✅ 라이브" 참조).

### 구현 현황(2026-06-28)
- **사이드카 런처**: `worker/start_video_sidecar.vbs` — stage3를 ngn-shorts 레포에서 `python -m stage3.jobqueue start`로 띄움(watcher+worker 한 프로세스). 단일 인스턴스 가드 + 지수 백오프 크래시 재시작 + 로그 로테이션(start_worker.vbs와 동일 정책). **UTF-8 강제**(PYTHONUTF8=1, 한글 경로 깨짐 방지 = HANDOFF §3-F). 경로 명시 주입(INTAKE_WATCH_ROOT=`F:\업체영상\_소재`, EDIT_OUTPUT_ROOT=`D:\영상편집`). python = 3.12(faster-whisper 설치본) 하드코딩.
- **상주 보조**: `worker/install_video_sidecar_autostart.bat`(시작프로그램 등록) · `stop_video_sidecar.bat` · `restart_video_sidecar.bat`.
- **왜 복사-인 아니고 레포에서 띄우나**: stage3가 tools/·cuda_bootstrap 등 같은 레포에 의존 + 그 팀이 SAR·HDR·회전 함정 수정을 그 레포에서 계속 유지(단일 출처). 양 레포가 같은 PC(F:\github)라 사이드카로 띄우는 게 깔끔. (완전 self-contained vendoring은 후속 선택.)
- **검증(정직)**: ①stage3 pytest **62 passed** · ②/④ **실 영상 F→D end-to-end 스모크**(테스트영상.mp4 → 규격변환 + GPU whisper + `D\테스트업체\테스트영상\{clips,xml,srt,transcript,notes}`, 한글경로·날짜폴더 정상, ~8s, RTX 4070 Ti SUPER) · 런처 env·기동 검증(빈 폴더 watcher 시작). **미검증**: ⓐVBS supervisor 루프 실기동(실 폴더 켜면 68 백로그 즉시 처리라 보류) ⓑ실 폰 영상(회전·HDR·세로변환)→Premiere 육안(HANDOFF §5 — 실 소재·Premiere 필요 = 사장님 환경).

### ✅ 라이브 (켜짐, 2026-06-28)
사장님 승인하에 `F:\업체영상\_소재` 정리(테스트 2 + 아우름웰니스 백로그 68 전부 — 사장님이 F 원본 이미 이동) → **깨끗한 상태에서 사이드카 라이브 기동**. `D:\영상편집`(편집 완성본 86)은 보존. 부팅 자동시작 등록됨(시작프로그램 `NGN_Video_Sidecar.lnk`). 로그 = `worker\video-sidecar.log`("watching F:\업체영상\_소재", 안정). 이제 **새 영상 업로드 시 자동으로 규격변환→D 편집패키지**.

> 🐛 **기동 시 실제로 겪은 버그(박제)**: VBS에 한글 경로 리터럴(`F:\업체영상\_소재`)을 넣었더니 wscript가 UTF-8 .vbs를 CP949로 읽어 경로가 깨져 watcher가 `WinError 123`으로 즉시 크래시. **해법 = VBS에 한글 경로 리터럴 절대 금지**, stage3 config.py 기본값(Python+PYTHONUTF8로 정확)에 위임. + PYTHONUNBUFFERED=1로 로그 즉시 가시화(블록버퍼링이면 idle 시 로그 0바이트라 진단 불가였음).

### 무엇이 들어오나
유저가 앱에서 올린 영상을 **규격변환**(H.264 1080p 6Mbps 30fps, NVENC→libx264 폴백) + **편집 패키지 생성**(FCP7 XML·SRT·transcript·notes) → `D:\영상편집\{업체}\{영상stem}\`로 출력. 편집은 사장님이 Premiere에서. = §1 ⑪영상의 "[편집준비 ngn-shorts]" 단계를 우리 안으로 가져오는 것(Python `stage3` 패키지).

### 인계 경계는 깔끔함 (충돌 아님, 체인)
기존 `video-source-watcher`(Firestore `videoSourceUploads` 감시 → GCS에서 `F:\업체영상\_소재\{업체}\{날짜}\{파일}`로 다운로드 + 제안분석)가 **F:\_소재까지 배달하고 끝.** stage3는 **바로 그 F:\_소재를 파일감시해 다음 단계**(변환→D). → 인계점 = `F:\업체영상\_소재`.

### 🔴 통합 전 해소할 충돌·모순 (실제 코드 대조로 확인)
| # | 충돌 | 기존(우리) | HANDOFF(stage3) | 해소 방향 |
|---|------|------------|------------------|-----------|
| 1 | **날짜 하위폴더 불일치** | `_소재\{업체}\{YYYY-MM-DD}\파일`(날짜층 有, video-source-watcher buildDeliveryNames) | `_소재\{업체}\파일`(날짜 無) 가정(§1) | stage3 brand 추출을 "_소재 다음 **첫 칸**=업체"로 확정(날짜를 brand로 오인 금지). 재귀감시라 파일 자체는 잡힘 |
| 2 | **Whisper 이중 실행** | 제안분석(runAndStoreVideoProposal)이 Whisper 받아쓰기 | 편집패키지도 Whisper 받아쓰기 | 같은 영상에 Whisper 2번(단일 PC 무거움) → transcript 공유 or 한쪽 일원화 |
| 3 | **언어/런타임 모순** | TypeScript/Node 워커 | **Python**(ffmpeg·faster-whisper·SQLite) | "stage3 그대로 import" 불가 → **별도 사이드카 프로세스**(sns-poster처럼) 또는 Node가 셸아웃. 아키텍처 결정 필요 |
| 4 | **D 출력 vs 완성본 자동발행** | edited-video-folder-watcher: `D\{업체}\파일.ext`(정확히 **2단계**)=완성본 발행 트리거 | `D\{업체}\{stem}\clips\파일`(**3~4단계**)=편집준비 | 현재 안전(2단계 매칭 안 됨+자동발행 video-1 박제 OFF). **이 깊이 분리(깊은=편집준비/2단계=완성본)를 유지**해야 함 |
| 5 | **중복 처리 철학 충돌** | 동명 재배달 시 `(2)` 사본 생성(uniqueLocalPath, 덮어쓰기 방지) | dedup_key로 중복 **차단** | 우리가 `(2)`를 만들면 stage3가 새 파일로 보고 재변환할 수 있음 → 정렬 필요 |
| 6 | **단일 PC SPOF 가중** | 워커=사장님 PC 단일 프로세스(infra-1 SPOF) | 무거운 NVENC 직렬 트랜스코드 큐 추가 | 부하·SPOF 영향 ↑. 안정성(북극성) 관점 주의 — 별도 프로세스로 격리 권장 |

### 원칙·범위 (HANDOFF 핵심)
- **F 원본 절대 안 옮기고 안 지움**(제자리 영구, 90일 cleanup 정리 — 우리 cleanup-storage.mjs와 정합 확인 필요). 변환본만 D로.
- 배경매트·자막스타일은 영상에 미리 굽지 않음(Premiere에서). SRT는 텍스트+타이밍만.
- **범위 밖**: AI 나레이션/TTS(수동), 멀티소스 슈퍼컷(build_supercut, 별도 수동). SAR 찌그러짐·레터박스금지·회전늘어남·HDR과노출 함정은 주로 **세로변환/슈퍼컷** 단계 — 단일 클립 규격변환엔 일부만(상세 = HANDOFF §3).

원자료: `ngn-shorts-reels-automation/docs/HANDOFF_ngn_upload_pipeline.md`(70a4da8). 통합 착수·아키텍처(사이드카 vs 셸아웃)는 사장님/기획 결정.

---

## 10. 기능·채널 완성도 보드
→ **`docs/STATUS.md` "채널·기능 완성도 보드"로 이사**(2026-07-04). 완성도=시점 상태라 "시점 상태는 STATUS에만" 규칙(구 OVERVIEW §8-1)을 따라 옮겼다. 릴리즈 판단 게이트 역할 그대로 — 출시·"됐다" 판단 전 STATUS 보드부터 본다.
