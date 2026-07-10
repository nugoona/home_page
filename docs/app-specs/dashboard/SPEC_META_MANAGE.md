# SPEC: Meta AdCanvas 사전 세팅 (/adcanvas_meta/manage)

> **1:1 Clone 대상** — Flask 5-Step 위자드의 Step 4 (사전 세팅)
> **Flask 원본**: `ngn_wep/dashboard/templates/admake_admanage_page.html` (4133 lines)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py`
> **JS**: HTML 템플릿 내 인라인 `<script>` 블록
> **URL**: `/adcanvas_meta/manage?account_id=XXX`
> **위자드 위치**: Step 4 of 5 (Upload -> Crop -> Ad Create -> **사전 세팅** -> Publish)

---

## 페이지 개요

Step 4는 광고를 실제 게시하기 전 최종 세팅 단계이다.
Step 3에서 생성한 pending 광고들을 기존 광고와 어떻게 조합할지(노출 방식), 예산은 얼마로 설정할지, 유입 캠페인에도 복사할지, 노출 기간은 어떻게 할지를 결정한다.

### 주요 기능 요약

1. **광고 노출 방식 선택** — 새 광고만 노출 vs 기존 광고와 함께 (50개 제한 체크)
2. **캠페인별 예산 확인** — 전환/유입 캠페인 예산 조회 및 수정
3. **유입 캠페인 광고 확장 설정** — 전환 캠페인 크리에이티브를 유입 캠페인에 복사
4. **노출 기간 설정** — 종료 없음 또는 종료 날짜/시간 지정

---

## 데이터 플로우 개요 (Step 4 내부)

```
[DOMContentLoaded]
  ├─ setupExitModalHandlers()
  ├─ setupLogoClickHandler() → 나가기 모달
  ├─ setupEventListeners() (테이블, 버튼, 섹션, 기간)
  ├─ 데모 모드: 자동 new_only 선택 (저장된 모드 없을 시)
  ├─ restoreExposureMode() → sessionStorage('admake_exposure_mode') 복원
  ├─ await loadAccountInfo()
  │   └─ GET /dashboard/get_account_info
  ├─ await Promise.all([
  │   loadPendingAdsCount(),    → GET /dashboard/get_pending_ads
  │   loadActiveAds()           → GET /dashboard/get_active_ads
  │ ])
  └─ loadBudgetInfo()           → GET /dashboard/get_budget_info

[다음 단계로 버튼]
  ├─ 검증: exposureMode 필수
  ├─ step4Data 구성 → sessionStorage('admake_step4_state')
  ├─ POST /dashboard/update_adset_schedule
  └─ 성공 → /adcanvas_meta/publish?account_id=XXX 이동
```

---

## CSS 변수

```css
:root {
  --bg-primary: #09090B;
  --bg-secondary: #121215;
  --bg-card: #18181B;
  --bg-card-hover: #1f1f23;
  --bg-input: #0d0d0f;

  --border-default: #27272A;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-focus: rgba(255, 255, 255, 0.2);

  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  --accent-blue: #3b82f6;
  --accent-emerald: #10b981;
  --accent-gold: #f59e0b;
  --accent-red: #ef4444;
}
```

---

## 레이아웃 구조

```
top-header (56px, position:sticky, top:0, z-index:1000)
  ├── header-left
  │   ├── .platform-logo (Meta 그라디언트 아이콘)
  │   ├── .header-title ("AdCanvas")
  │   └── .account-badge (계정 ID 표시)
  └── header-right
      └── .hamburger-menu-wrapper (내비게이션 드롭다운)

admake-progress-bar (position:sticky, top:56px, z-index:100)
  └── 5 steps:
      ├── Upload ✓ (completed)
      ├── Crop ✓ (completed)
      ├── Ad Create ✓ (completed)
      ├── 사전 세팅 (active) ← 현재 위치
      └── 검토 및 생성 (pending)

admake-main-wrapper
  └── admake-main-content (overflow-y:auto, padding: 0 32px)
      └── admake-content-inner (max-width:900px, margin:0 auto)
          ├── Tip Banner (dismissible)
          ├── Section 01: 광고 노출 방식 선택
          ├── Section 02: 캠페인별 예산 확인 (collapsible, collapsed)
          ├── Section 03: 유입 캠페인 광고 확장 설정 (collapsible, collapsed)
          └── Section 04: 노출 기간 설정 (collapsible, collapsed)

admake-action-bar (position:fixed, bottom:0, height:72px, z-index:1000)
  ├── left: "STEP 4 OF 5" (Inter Tight, 11px, letter-spacing:0.05em)
  └── right:
      ├── #backBtn — "이전" (.admake-btn-secondary)
      └── #nextBtn — "다음 단계로" (.admake-btn-primary)
```

---

## JS 전역 상태 변수

```javascript
// ─── 상수 ───
const AD_SET_MAX_ADS = 50;          // 광고 세트당 최대 광고 수

// ─── 광고 데이터 ───
let ads = [];                        // 기존 활성 광고 객체 배열 (API에서 로드)
let selectedAdIds = new Set();       // 테이블에서 체크박스 선택된 광고 ID
let currentAction = null;            // 'pause' | 'delete' | null (모달 액션)

// ─── 예산 데이터 ───
let budgetData = {
  conv: {
    originalBudget: 0,               // 서버에서 로드한 원본 예산 (KRW)
    currentBudget: 0,                // 현재 UI에 표시된 예산 (KRW)
    budgetType: 'CBO',               // 'CBO' | 'ABO'
    campaignId: '',                   // Meta 캠페인 ID
    adsetId: '',                      // Meta AdSet ID
    isActive: false                   // 캠페인 활성 여부
  },
  traffic: {
    originalBudget: 0,
    currentBudget: 0,
    budgetType: 'CBO',
    campaignId: '',
    adsetId: '',
    isActive: false
  }
};
let accountInfo = null;              // 계정 정보 객체 (loadAccountInfo 결과)

// ─── 노출 모드 ───
let exposureMode = null;             // 'new_only' | 'with_existing' | null
let pendingAdsCount = 0;             // Step 3에서 만든 새 광고 수
let adsToTurnOff = [];               // OFF 대상 광고 ID 배열
let adsToDelete = [];                // 삭제 대상 광고 객체 배열

// ─── AdSet 선택 ───
let adsetData = {
  conv: {
    mode: 'recommended',             // 'recommended' | 'custom'
    allAdsets: [],                    // 전체 AdSet 배열 (API 로드)
    recommendedAdsetId: null,        // 추천 AdSet ID (account_info에서)
    selectedAdsetIds: [],            // 선택된 AdSet ID 배열
    adsetSettings: {}                // { adsetId: { budget: number, enabled: boolean } }
  },
  traffic: {
    mode: 'recommended',
    allAdsets: [],
    recommendedAdsetId: null,
    selectedAdsetIds: [],
    adsetSettings: {}
  }
};
```

---

## HTML 요소 전체 맵

### 공통 요소

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.top-header` | header | 상단 고정 헤더 (56px) | - |
| `.platform-logo` | div | Meta 그라디언트 로고 아이콘 | - |
| `.header-title` | div | "AdCanvas" 타이틀 | - |
| `.account-badge` | div | 계정 ID 배지 | - |
| `.hamburger-menu-wrapper` | div | 햄버거 메뉴 드롭다운 | - |
| `.admake-progress-bar` | div | 5단계 프로그레스 바 | Step 4 active |
| `.admake-main-wrapper` | div | 메인 래퍼 | - |
| `.admake-main-content` | div | 스크롤 가능 콘텐츠 영역 | - |
| `.admake-content-inner` | div | 콘텐츠 내부 (max-width:900px) | - |
| `.admake-action-bar` | div | 하단 고정 액션 바 (72px) | - |
| `#backBtn` | button | "이전" 버튼 | - |
| `#nextBtn` | button | "다음 단계로" 버튼 | - |
| `#toastContainer` | div | 토스트 알림 컨테이너 (fixed top:70px right:20px) | - |
| `#exitModalOverlay` | div | 나가기 확인 모달 오버레이 | hidden |
| `#exitCancelBtn` | button | 나가기 모달 — "계속 작업하기" | - |
| `#exitConfirmBtn` | button | 나가기 모달 — "나가기" | - |

### Section 01: 광고 노출 방식 선택

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#section01` | div | 섹션 01 컨테이너 (.admake-section) | 항상 확장 |
| `#adCountLabel` | span | "새 광고 N개 / 기존 광고 N개" 라벨 | - |
| `#newAdCount` | span | 새 광고 개수 | "0" |
| `#existingAdCount` | span | 기존 광고 개수 | "0" |
| `.exposure-mode-cards` | div | 노출 모드 카드 그리드 (2열) | - |
| `#modeNewOnly` | div | "새 광고만 노출" 카드 (.mode-new-only) | 미선택 |
| `#modeWithExisting` | div | "기존 광고와 함께" 카드 (.mode-with-existing) | 미선택 |
| `#modeNewOnlyCount` | span | "새 광고 N개" 카운트 | - |
| `#modeWithExistingCount` | span | "총 N개" 카운트 | - |
| `#adLimitWarning` | div | 50개 초과 경고 영역 | hidden |
| `#deleteRequiredCount` | span | "N개의 광고를 삭제해야 합니다" | - |
| `#adsToDeleteList` | div | 삭제 대상 광고 리스트 (max-height:200px, overflow-y:auto) | - |
| `#exposureModeSummary` | div | 노출 모드 요약 표시 | hidden |
| `#exposureModeSummaryText` | span | 요약 텍스트 내용 | - |
| `#existingAdsToggle` | button | "기존 광고 상세 보기" 토글 버튼 | collapsed |
| `#existingAdsDetail` | div | 기존 광고 상세 영역 (테이블 포함) | hidden |
| `#btnRefresh` | button | "새로고침" 버튼 | - |
| `#btnPause` | button | "선택 종료" 버튼 | disabled |
| `#btnDelete` | button | "선택 삭제" 버튼 (.admake-btn-sm-danger) | disabled |
| `#selectAll` | input[checkbox] | 전체 선택 체크박스 (테이블 헤더) | unchecked |
| `.ad-checkbox` | input[checkbox] | 개별 광고 체크박스 (테이블 행) | unchecked |
| `#loadingState` | div | 테이블 로딩 상태 (스피너 + "광고를 불러오는 중...") | - |
| `#emptyState` | div | 테이블 빈 상태 (inbox 아이콘 + "활성 상태인 광고가 없습니다") | - |

### Section 02: 캠페인별 예산 확인

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#section02` | div | 섹션 02 컨테이너 (.admake-section.collapsible.collapsed) | 접힘 |
| `#btnRefreshBudget` | button | 예산 새로고침 버튼 | - |
| `#convBudgetCard` | div | 전환 캠페인 예산 카드 | - |
| `#trafficBudgetCard` | div | 유입 캠페인 예산 카드 | - |
| `.badge-conv` | span | 전환 캠페인 타입 배지 (blue) | - |
| `.badge-traffic` | span | 유입 캠페인 타입 배지 (gold) | - |
| `#convBudgetMode` | span | 전환 캠페인 예산 모드 라벨 ("CBO" / "ABO") | - |
| `#trafficBudgetMode` | span | 유입 캠페인 예산 모드 라벨 | - |
| `#convDailyBudget` | input | 전환 캠페인 일일 예산 입력 (₩ + formatted + "/일") | - |
| `#trafficDailyBudget` | input | 유입 캠페인 일일 예산 입력 | - |
| `#convActiveToggle` | div | 전환 캠페인 활성 토글 (.admake-toggle, 50x26px) | - |
| `#trafficActiveToggle` | div | 유입 캠페인 활성 토글 | - |
| `#convToggleLabel` | span | 전환 캠페인 토글 라벨 ("활성화"/"비활성화") | - |
| `#trafficToggleLabel` | span | 유입 캠페인 토글 라벨 | - |
| `#convBudgetStatus` | div | 전환 캠페인 상태 표시기 | - |
| `#trafficBudgetStatus` | div | 유입 캠페인 상태 표시기 | - |
| `.status-dot` | span | 상태 도트 (loading:gold pulse, active:green, paused:gray) | - |
| `#convAdsetSelection` | div | 전환 캠페인 AdSet 선택 영역 | - |
| `#trafficAdsetSelection` | div | 유입 캠페인 AdSet 선택 영역 | - |
| `#convRecommendedAdsetName` | span | 전환 캠페인 추천 AdSet 이름 | - |
| `#trafficRecommendedAdsetName` | span | 유입 캠페인 추천 AdSet 이름 | - |
| `#convAdsetList` | div | 전환 캠페인 AdSet 목록 (custom 모드) | hidden |
| `#trafficAdsetList` | div | 유입 캠페인 AdSet 목록 | hidden |

### Section 03: 유입 캠페인 광고 확장 설정

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#section03` | div | 섹션 03 컨테이너 (.admake-section.collapsible.collapsed) | 접힘 |
| `#copyToTrafficToggle` | input[checkbox] | 유입 캠페인 복사 토글 (56x30px) | unchecked |

### Section 04: 노출 기간 설정

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#section04` | div | 섹션 04 컨테이너 (.admake-section.collapsible.collapsed) | 접힘 |
| `input[name="period"][value="no_end"]` | input[radio] | "종료 기간 없음" 라디오 | checked |
| `input[name="period"][value="set_end"]` | input[radio] | "종료 날짜/시간 설정" 라디오 | unchecked |
| `#datetimePicker` | div | 날짜/시간 선택 영역 | hidden |
| `#endDatetime` | input[datetime-local] | 종료 날짜/시간 입력 (color-scheme:dark) | 현재 시간 |
| `#calendarBtn` | button | 네이티브 날짜 피커 열기 버튼 | - |

### 모달/오버레이

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#confirmModalOverlay` | div | 확인 모달 오버레이 (일시중지/삭제) | hidden |
| `#confirmModalIcon` | div | 모달 아이콘 (warning / danger) | - |
| `#confirmModalTitle` | h3 | 모달 제목 ("광고 종료" / "광고 삭제") | - |
| `#confirmModalMessage` | p | 모달 메시지 | - |
| `#confirmModalCancel` | button | 모달 "취소" 버튼 | - |
| `#confirmModalConfirm` | button | 모달 "확인" 버튼 | - |
| `#loadingOverlay` | div | 로딩 오버레이 (진행률 표시) | hidden |
| `#loadingProgress` | span | "1/N" 진행률 텍스트 | - |

---

## 섹션별 상세 명세

### Section 01: 광고 노출 방식 선택

이 섹션은 항상 확장 상태이며 접을 수 없다. 페이지 진입 시 가장 먼저 사용자가 결정해야 할 항목이다.

#### 헤더 영역

```
[01 배지] 광고 노출 방식 선택    [새 광고 N개 / 기존 광고 N개]
```

- `01` 숫자 배지: `.section-number` (accent-blue 배경, 24x24px, border-radius:6px)
- 광고 카운트: `#adCountLabel` — `#newAdCount` + `#existingAdCount` 조합

#### 노출 모드 카드 (.exposure-mode-cards)

2열 그리드 레이아웃 (`grid-template-columns: 1fr 1fr`, gap:16px)

**카드 1: 새 광고만 노출 (`#modeNewOnly`)**

```
[sparkles 아이콘]
새 광고만 노출
기존 광고를 모두 OFF하고 새로 만든 광고만 노출합니다
[새 광고 N개]
```

- 클래스: `.exposure-mode-card.mode-new-only`
- 선택 시: `.selected` 클래스 추가 (blue 테두리 + blue 배경 tint)
- 아이콘: sparkles SVG (accent-blue)
- `#modeNewOnlyCount`: "새 광고 N개"

**카드 2: 기존 광고와 함께 (`#modeWithExisting`)**

```
[layers 아이콘]
기존 광고와 함께
기존 광고를 유지하고 새 광고를 추가합니다
[총 N개]
```

- 클래스: `.exposure-mode-card.mode-with-existing`
- 선택 시: `.selected` 클래스 추가 (emerald 테두리 + emerald 배경 tint)
- 아이콘: layers SVG (accent-emerald)
- `#modeWithExistingCount`: "총 N개" (activeAds + pendingAds)

#### 노출 모드 선택 함수 체인

```
[#modeNewOnly 클릭] → selectExposureMode('new_only'):
  ├─ exposureMode = 'new_only'
  ├─ UI 업데이트:
  │   ├─ #modeNewOnly.classList.add('selected')
  │   ├─ #modeWithExisting.classList.remove('selected')
  │   └─ adsToTurnOff = ads.filter(a => (a.configured_status || a.status) === 'ACTIVE').map(a => a.id)
  ├─ adsToDelete = []  // new_only는 삭제 불필요
  ├─ checkAdLimit()
  ├─ updateExposureSummary()
  ├─ renderTable()  // OFF 예정 배지 반영
  └─ saveExposureModeState() → sessionStorage('admake_exposure_mode')

[#modeWithExisting 클릭] → selectExposureMode('with_existing'):
  ├─ exposureMode = 'with_existing'
  ├─ UI 업데이트:
  │   ├─ #modeWithExisting.classList.add('selected')
  │   ├─ #modeNewOnly.classList.remove('selected')
  │   └─ adsToTurnOff = []  // 기존 광고 유지
  ├─ checkAdLimit()  // 50개 초과 시 삭제 대상 산출
  ├─ updateExposureSummary()
  ├─ renderTable()  // 삭제 예정 배지 반영
  └─ saveExposureModeState()
```

#### 50개 제한 체크 (checkAdLimit)

```
checkAdLimit():
  ├─ with_existing 모드일 때만 적용
  ├─ activeAds = ads.filter(a => (a.configured_status || a.status) === 'ACTIVE')
  ├─ totalAds = activeAds.length + pendingAdsCount
  ├─ totalAds <= AD_SET_MAX_ADS(50):
  │   └─ #adLimitWarning 숨김, adsToDelete = []
  └─ totalAds > AD_SET_MAX_ADS:
      ├─ deleteCount = totalAds - AD_SET_MAX_ADS
      ├─ sortedAds = activeAds.sort(by created_time ASC)  // 오래된 순
      ├─ adsToDelete = sortedAds.slice(0, deleteCount)
      ├─ #adLimitWarning 표시
      ├─ #deleteRequiredCount.textContent = "N개의 광고를 삭제해야 합니다"
      └─ #adsToDeleteList 렌더링:
          각 광고 → .ads-to-delete-item:
            ├─ 썸네일 (thumbnail_url 또는 placeholder)
            ├─ 광고 이름 (.ad-name-text)
            ├─ 생성일 (created_time formatted)
            └─ "삭제 예정" 배지 (.action-badge-delete, red)
```

#### 노출 모드 요약 (updateExposureSummary)

```
updateExposureSummary():
  ├─ #exposureModeSummary.classList.add('visible')
  ├─ new_only:
  │   └─ "새 광고 {pendingAdsCount}개만 노출됩니다. 기존 광고 {activeCount}개 OFF 예정"
  │       + adsToDelete 있으면: " / {deleteCount}개 삭제 예정"
  └─ with_existing:
      └─ "기존 광고 {activeCount}개 + 새 광고 {pendingAdsCount}개 = 총 {total}개 노출"
          + adsToDelete 있으면: " ({deleteCount}개 삭제 예정)"
```

#### 기존 광고 상세 보기 토글

```
[#existingAdsToggle 클릭]:
  ├─ #existingAdsDetail.classList.toggle('expanded')
  ├─ 버튼 내 chevron 아이콘 회전 (0deg ↔ 180deg)
  └─ 텍스트: "기존 광고 상세 보기" ↔ "접기"
```

#### 액션 버튼 (기존 광고 테이블 상단)

| 버튼 | ID | 클래스 | 동작 | 비활성 조건 |
|------|-----|--------|------|-------------|
| 새로고침 | `#btnRefresh` | `.admake-btn-sm` | `loadActiveAds()` | 없음 |
| 선택 종료 | `#btnPause` | `.admake-btn-sm` | `showModal('pause')` | `selectedAdIds.size === 0` |
| 선택 삭제 | `#btnDelete` | `.admake-btn-sm-danger` | `showModal('delete')` | `selectedAdIds.size === 0` |

#### 기존 광고 테이블 (.admake-table)

**컬럼 정의:**

| # | 컬럼명 | 너비 | 내용 |
|---|--------|------|------|
| 1 | 선택 | 40px | `#selectAll` (헤더) / `.ad-checkbox` (행) |
| 2 | 소재 | 72px | `.admake-thumbnail` (60x60px) 또는 `.admake-thumbnail-placeholder` |
| 3 | 광고 이름 | auto (flex) | `.ad-name-with-badge` → `.ad-name-text` + 액션 배지 |
| 4 | 캠페인 | 70px | 캠페인 유형 배지 (전환:blue / 유입:gold) |
| 5 | 상태 | 70px | `.admake-status-badge` (ON:green / OFF:gray) |
| 6 | 현재 노출 | 80px | `.admake-exposure-badge` (노출중:green / 노출중지:red) |

**행 상태 클래스:**

| 클래스 | 적용 조건 | 시각 효과 |
|--------|----------|----------|
| `.selected` | 체크박스 선택됨 | 파란색 배경 tint |
| `.delete-target` | adsToDelete에 포함됨 | 빨간색 배경 tint |
| `.off-target` | adsToTurnOff에 포함됨 | 골드색 배경 tint |

**액션 배지:**

| 클래스 | 텍스트 | 색상 | 표시 조건 |
|--------|--------|------|----------|
| `.action-badge-delete` | "삭제 예정" | red (#ef4444) | adsToDelete에 포함 |
| `.action-badge-off` | "OFF 예정" | gold (#f59e0b) | adsToTurnOff에 포함 (new_only 모드) |

**상태 판정 로직:**

```javascript
// 광고 자체 상태 (ON/OFF)
const adStatus = ad.configured_status || ad.status;
// ACTIVE → "ON" (초록 .admake-status-on)
// 그 외 → "OFF" (회색 .admake-status-inactive)

// 실제 노출 상태
const effectiveStatus = ad.effective_status;
// ACTIVE → "노출중" (초록 .admake-exposure-active)
// 그 외 → "노출중지" (빨강/회색 .admake-exposure-paused)
```

**로딩/빈 상태:**

| ID | 아이콘 | 텍스트 |
|----|--------|--------|
| `#loadingState` | 스피너 | "광고를 불러오는 중..." |
| `#emptyState` | inbox 아이콘 | "활성 상태인 광고가 없습니다" |

#### 체크박스 동작

```
[#selectAll 변경]:
  ├─ checked → 모든 .ad-checkbox 체크, 모든 광고 ID → selectedAdIds
  └─ unchecked → 모든 .ad-checkbox 해제, selectedAdIds.clear()
  └─ updateActionButtons() → btnPause/btnDelete 활성/비활성

[.ad-checkbox 변경]:
  ├─ checked → selectedAdIds.add(adId), 행에 .selected 추가
  ├─ unchecked → selectedAdIds.delete(adId), 행에서 .selected 제거
  ├─ 전체 선택 여부 → #selectAll 체크 상태 동기화
  └─ updateActionButtons()
```

---

### Section 02: 캠페인별 예산 확인

`.admake-section.collapsible.collapsed` — 초기 접힌 상태

#### 섹션 접기/펼치기

```
[섹션 헤더 클릭]:
  ├─ .collapsed 클래스 토글
  ├─ 토글 아이콘 회전: collapsed → transform:rotate(-90deg) / expanded → rotate(0deg)
  └─ 내부 버튼 클릭은 e.stopPropagation()으로 무시
```

#### 예산 카드 구조 (conv / traffic 동일 구조)

```
.budget-card (#convBudgetCard / #trafficBudgetCard)
  ├── 카드 헤더
  │   ├── 캠페인 유형 배지 (.badge-conv 파란색 / .badge-traffic 골드색)
  │   ├── 예산 모드 라벨 (#convBudgetMode: "CBO" / "ABO")
  │   └── 상태 표시기 (#convBudgetStatus)
  │       └── .status-dot (loading:gold pulse / active:green / paused:gray)
  ├── 예산 입력 영역
  │   ├── "₩" 접두어
  │   ├── 예산 입력 (#convDailyBudget) — 포맷: 콤마 구분 숫자
  │   ├── "/일" 접미어
  │   └── .modified 클래스 (값 변경 시 → emerald 테두리)
  ├── 활성 토글 영역
  │   ├── .admake-toggle (#convActiveToggle, 50x26px)
  │   └── 토글 라벨 (#convToggleLabel: "활성화" / "비활성화")
  └── AdSet 선택 영역 (#convAdsetSelection)
      ├── 추천 세트 사용 옵션 (default)
      │   └── #convRecommendedAdsetName + 별 아이콘
      └── 직접 선택 옵션
          └── #convAdsetList (AdSet 목록)
```

#### 예산 로드 (loadBudgetInfo)

```
loadBudgetInfo():
  ├─ GET /dashboard/get_budget_info?account_id={accountId}
  │   Response: {
  │     status: "success",
  │     conv_campaign: {
  │       campaign_id: string,
  │       campaign_name: string,
  │       daily_budget: number,     // API 값 (예: 250 → 실제 25,000원)
  │       budget_type: "CBO" | "ABO",
  │       adset_id: string,
  │       status: "ACTIVE" | "PAUSED"
  │     },
  │     traffic_campaign: { /* 동일 구조 */ }
  │   }
  │
  ├─ 예산 변환 (API → KRW):
  │   budgetData.conv.currentBudget = response.conv_campaign.daily_budget * 100
  │   budgetData.conv.originalBudget = budgetData.conv.currentBudget
  │   // 예: API 250 → 250 * 100 = 25,000원 (KRW)
  │
  ├─ budgetData 갱신:
  │   ├─ budgetType = response.*.budget_type
  │   ├─ campaignId = response.*.campaign_id
  │   ├─ adsetId = response.*.adset_id
  │   └─ isActive = (response.*.status === 'ACTIVE')
  │
  └─ UI 업데이트:
      ├─ #convBudgetMode / #trafficBudgetMode → "CBO" / "ABO"
      ├─ #convDailyBudget / #trafficDailyBudget → formatBudget(currentBudget)
      ├─ #convActiveToggle / #trafficActiveToggle → checked = isActive
      ├─ #convToggleLabel / #trafficToggleLabel → "활성화" / "비활성화"
      └─ .status-dot → active(green) / paused(gray)
```

#### 예산 저장 (saveBudgetChanges)

```
saveBudgetChanges(type):  // type = 'conv' | 'traffic'
  ├─ 값 변환 (KRW → API):
  │   apiValue = budgetData[type].currentBudget / 100
  │   // 예: 25,000원 → 25,000 / 100 = 250 (API 값)
  │
  ├─ POST /dashboard/update_budget
  │   Content-Type: application/json
  │   Body: {
  │     account_id: string,
  │     target_type: "conv" | "traffic",
  │     campaign_id: string,
  │     adset_id: string,
  │     daily_budget: number,         // API 값
  │     budget_type: "CBO" | "ABO"
  │   }
  │   Response: { status: "success", message: string }
  │
  ├─ 성공:
  │   ├─ budgetData[type].originalBudget = currentBudget
  │   ├─ .modified 클래스 제거
  │   └─ showToast("저장 완료", 'success', 2000)
  │
  └─ 실패:
      └─ alert("예산 저장 실패")
```

#### 캠페인 활성/비활성 토글 (updateAdsetStatus)

```
updateAdsetStatus(type, isActive):
  ├─ POST /dashboard/update_adset_status
  │   Content-Type: application/json
  │   Body: {
  │     account_id: string,
  │     adset_id: string,
  │     campaign_id: string,
  │     status: "ACTIVE" | "PAUSED"
  │   }
  │   Response: { status: "success" }
  │
  ├─ 성공:
  │   ├─ budgetData[type].isActive = isActive
  │   ├─ 토글 라벨 업데이트
  │   └─ .status-dot 색상 업데이트
  │
  └─ 실패:
      └─ 토글 원래 상태로 복원 (revert)
```

#### AdSet 선택 모드 (selectAdsetMode)

```
selectAdsetMode(type, mode):  // mode = 'recommended' | 'custom'
  ├─ adsetData[type].mode = mode
  ├─ UI 업데이트:
  │   ├─ recommended 옵션: .selected 토글
  │   └─ custom 옵션: .selected 토글
  ├─ recommended:
  │   ├─ AdSet 리스트 숨김
  │   ├─ 메인 예산 입력 복원
  │   └─ adsetData[type].selectedAdsetIds = [recommendedAdsetId]
  └─ custom:
      ├─ AdSet 리스트 표시
      ├─ 메인 예산 입력 숨김 (ABO일 때만)
      └─ allAdsets 비어있으면 → loadCampaignAdsets(type)
```

#### AdSet 목록 로드 (loadCampaignAdsets)

```
loadCampaignAdsets(type):
  ├─ campaignId = budgetData[type].campaignId
  ├─ GET /dashboard/adcanvas_meta/performance/campaign-adsets?campaign_id={campaignId}
  │   Response: {
  │     status: "success",
  │     data: {
  │       adsets: [{
  │         id: string,
  │         name: string,
  │         daily_budget: number,
  │         status: "ACTIVE" | "PAUSED"
  │       }, ...]
  │     }
  │   }
  │
  ├─ adsetData[type].allAdsets = response.data.adsets
  ├─ recommendedAdsetId 설정 (accountInfo에서 매핑)
  └─ renderAdsetList(type)
```

#### AdSet 리스트 렌더링 (renderAdsetList)

```
renderAdsetList(type):
  각 adset에 대해:
  ├── 체크박스 (선택/해제)
  ├── AdSet 이름 (추천 세트면 ★ 별 아이콘 접미어)
  ├── 예산 입력:
  │   ├── CBO 모드 → disabled, "캠페인 예산 사용중" placeholder
  │   └── ABO 모드 → 개별 예산 편집 가능
  └── 활성 토글 (ON/OFF)
```

#### AdSet 선택 토글 (toggleAdsetSelection)

```
toggleAdsetSelection(type, adsetId):
  ├─ 이미 선택됨 → 해제 시도
  │   ├─ selectedAdsetIds.length === 1:
  │   │   └─ showToast("최소 1개의 세트를 선택해야 합니다.", 'warning')
  │   │       → 해제 차단
  │   └─ selectedAdsetIds.length > 1:
  │       └─ 해제 허용
  └─ 미선택 → 선택 추가
      └─ adsetData[type].selectedAdsetIds.push(adsetId)
```

---

### Section 03: 유입 캠페인 광고 확장 설정

`.admake-section.collapsible.collapsed` — 초기 접힌 상태

#### 구조

```
[Info 배너]
  "유입 캠페인(Traffic)에 대한 설정입니다."
  "활성화하면 전환 캠페인에 생성한 광고가 유입 캠페인에도 복사됩니다."

[유입 캠페인으로 복사 토글]
  ├── 라벨: "유입 캠페인으로 복사"
  ├── 설명: "활성화 시 전환 캠페인과 동일한 크리에이티브가 유입 캠페인에도
  │          생성됩니다. UTM 파라미터는 자동으로 적용됩니다."
  └── #copyToTrafficToggle — 대형 토글 스위치 (56x30px)
```

#### 토글 동작

```
[#copyToTrafficToggle 변경]:
  ├─ checked = true:
  │   └─ Step 5에서 traffic 캠페인에도 동일 크리에이티브 생성
  └─ checked = false:
      └─ conv 캠페인에만 광고 생성 (기본값)
```

---

### Section 04: 노출 기간 설정

`.admake-section.collapsible.collapsed` — 초기 접힌 상태

#### 구조

```
[라디오 옵션 1] 종료 기간 없음 (value="no_end", 기본 checked)
  └── 설명: "광고가 수동으로 중지하기 전까지 계속 게재됩니다"

[라디오 옵션 2] 종료 날짜/시간 설정 (value="set_end")
  └── 설명: "지정한 날짜와 시간에 광고가 자동으로 종료됩니다"
  └── #datetimePicker (.visible when selected)
      ├── #endDatetime — input[datetime-local] (dark theme, color-scheme:dark)
      └── #calendarBtn — 네이티브 피커 열기 버튼
```

#### 기간 선택 동작

```
[라디오 변경]:
  ├─ "no_end" 선택:
  │   └─ #datetimePicker.classList.remove('visible')
  └─ "set_end" 선택:
      ├─ #datetimePicker.classList.add('visible')
      └─ setDefaultEndDatetime() → 현재 시간을 기본값으로 설정

setDefaultEndDatetime():
  ├─ now = new Date()
  ├─ ISO 포맷 변환 (YYYY-MM-DDTHH:MM)
  └─ #endDatetime.value = formatted
```

---

## 액션 바 (.admake-action-bar)

```
position: fixed
bottom: 0
left: 0
right: 0
height: 72px
z-index: 1000
background: var(--bg-primary)
border-top: 1px solid var(--border-default)
display: flex
align-items: center
justify-content: space-between
padding: 0 32px
```

### 좌측

```
"STEP 4 OF 5"
font-family: 'Inter Tight'
font-size: 11px
letter-spacing: 0.05em
color: var(--text-muted)
```

### 우측 버튼

| ID | 텍스트 | 클래스 | 동작 |
|----|--------|--------|------|
| `#backBtn` | "이전" | `.admake-btn-secondary` | `/adcanvas_meta/create?account_id={accountId}` 이동 |
| `#nextBtn` | "다음 단계로" | `.admake-btn-primary` | `handleNextButton()` 실행 |

---

## 핵심 플로우: handleNextButton()

```
[#nextBtn 클릭] → handleNextButton():
  │
  ├─ 1. 검증:
  │   └─ exposureMode === null:
  │       ├─ showToast("광고 노출 방식을 선택해주세요.", 'warning')
  │       ├─ 스크롤: .exposure-mode-cards로 scrollIntoView({ behavior: 'smooth' })
  │       └─ return (차단)
  │
  ├─ 2. 기간 설정 읽기:
  │   ├─ endDateSetting = document.querySelector('input[name="period"]:checked').value
  │   │   // 'no_end' | 'set_end'
  │   ├─ set_end일 때:
  │   │   ├─ endDatetime = #endDatetime.value  // "YYYY-MM-DDTHH:MM"
  │   │   ├─ endDate = endDatetime.split('T')[0]   // "YYYY-MM-DD"
  │   │   └─ endTime = endDatetime.split('T')[1]   // "HH:MM"
  │   └─ no_end일 때:
  │       └─ endDate = null, endTime = null
  │
  ├─ 3. 토글 상태 읽기:
  │   ├─ copyToTraffic = #copyToTrafficToggle.checked
  │   ├─ convActive = #convActiveToggle.checked
  │   └─ trafficActive = #trafficActiveToggle.checked
  │
  ├─ 4. step4Data 구성:
  │   {
  │     selectedAdIds: [...selectedAdIds],
  │     endDateSetting: "no_end" | "set_end",
  │     endDate: "YYYY-MM-DD" | null,
  │     endTime: "HH:MM" | null,
  │     copyToTraffic: boolean,
  │     convActive: boolean,
  │     trafficActive: boolean,
  │     budgetData: { conv: {...}, traffic: {...} },
  │     exposureMode: "new_only" | "with_existing",
  │     adsToTurnOff: [adId, ...],
  │     adsToDelete: adsToDelete.map(ad => ad.id),
  │     adsetSelection: {
  │       conv: {
  │         mode: "recommended" | "custom",
  │         selectedAdsetIds: [...],
  │         adsetSettings: { adsetId: { budget, enabled } }
  │       },
  │       traffic: { /* 동일 구조 */ }
  │     }
  │   }
  │
  ├─ 5. sessionStorage 저장:
  │   sessionStorage.setItem('admake_step4_state', JSON.stringify(step4Data))
  │
  ├─ 6. AdSet 스케줄 업데이트 (API 호출):
  │   ├─ #nextBtn 로딩 상태: "세트 업데이트 중..." + 스피너
  │   ├─ #nextBtn.disabled = true
  │   │
  │   ├─ POST /dashboard/update_adset_schedule
  │   │   Content-Type: application/json
  │   │   Body: {
  │   │     account_id: string,
  │   │     end_time_setting: "no_end" | "set_end",
  │   │     end_time_value: "ISO 8601 string" | null,
  │   │     conv_active: boolean,
  │   │     traffic_active: boolean
  │   │   }
  │   │   Response: {
  │   │     status: "success" | "partial" | "error",
  │   │     message: string
  │   │   }
  │   │
  │   ├─ status === "success":
  │   │   ├─ showToast("AdSet 노출 기간이 업데이트되었습니다", 'success')
  │   │   └─ window.location.href = /adcanvas_meta/publish?account_id={accountId}
  │   │
  │   ├─ status === "partial":
  │   │   ├─ showToast(message, 'warning')
  │   │   └─ setTimeout(() => redirect, 1500)  // 1.5초 후 이동
  │   │
  │   └─ status === "error":
  │       ├─ showToast("AdSet 업데이트 중 오류가 발생했습니다.", 'error')
  │       └─ #nextBtn 복원 (텍스트 + enabled)
```

---

## 일시중지/삭제 모달 시스템

### showModal(action)

```
showModal(action):  // action = 'pause' | 'delete'
  ├─ currentAction = action
  ├─ selectedCount = selectedAdIds.size
  │
  ├─ action === 'pause':
  │   ├─ #confirmModalIcon → warning 아이콘 (gold)
  │   ├─ #confirmModalTitle → "광고 종료"
  │   └─ #confirmModalMessage → "선택한 {N}개의 광고를 즉시 종료하시겠습니까?"
  │
  └─ action === 'delete':
      ├─ #confirmModalIcon → danger 아이콘 (red)
      ├─ #confirmModalTitle → "광고 삭제"
      └─ #confirmModalMessage →
          "이 작업은 되돌릴 수 없으며 메타 관리자에 바로 반영됩니다."

  └─ #confirmModalOverlay 표시
```

### executeAction(action)

```
executeAction(action):
  ├─ adIds = [...selectedAdIds]
  │
  ├─ [3개 이상]:  // 개별 순차 처리 + 프로그레스
  │   ├─ #loadingOverlay 표시
  │   ├─ for (i = 0; i < adIds.length; i++):
  │   │   ├─ #loadingProgress → "{i+1}/{total}"
  │   │   ├─ POST /dashboard/{action}_ads
  │   │   │   Body: { ad_ids: [adIds[i]] }
  │   │   ├─ await delay(100)  // 100ms 간격
  │   │   └─ 결과 수집 (성공/실패 카운트)
  │   └─ #loadingOverlay 숨김
  │
  └─ [1-2개]:  // 배치 처리
      └─ POST /dashboard/{action}_ads
          Body: { ad_ids: adIds }

  // action = 'pause':
  │   POST /dashboard/pause_ads
  │   Body: { ad_ids: [string, ...] }
  │   Response: { status: "success" | "error", message: string }

  // action = 'delete':
  │   POST /dashboard/delete_ads
  │   Body: { ad_ids: [string, ...] }
  │   Response: { status: "success" | "error", message: string }

  ├─ 결과 처리:
  │   ├─ 전체 성공:
  │   │   └─ showToast("{N}개의 광고가 일시중지되었습니다." / "삭제되었습니다.", 'success')
  │   ├─ 부분 성공:
  │   │   └─ showToast("{N}개 성공, {M}개 실패", 'warning')
  │   └─ 전체 실패:
  │       └─ showToast("삭제 실패: 모든 광고 처리에 실패했습니다.", 'error')
  │
  └─ 후처리:
      ├─ selectedAdIds.clear()
      ├─ #selectAll.checked = false
      ├─ updateActionButtons()
      └─ loadActiveAds()  // 테이블 새로고침
```

---

## 초기화 플로우 (DOMContentLoaded) 상세

```
document.addEventListener('DOMContentLoaded', async function() {
  │
  ├─ 1. 나가기 모달 핸들러 설정:
  │   setupExitModalHandlers()
  │
  ├─ 2. 로고 클릭 → 나가기 모달:
  │   .platform-logo 클릭 → #exitModalOverlay 표시
  │
  ├─ 3. 이벤트 리스너 설정:
  │   ├─ 테이블: #selectAll, .ad-checkbox delegation
  │   ├─ 액션 버튼: #btnRefresh, #btnPause, #btnDelete
  │   ├─ 섹션 접기/펼치기: .collapsible 헤더 클릭
  │   ├─ 기간 라디오: input[name="period"] 변경
  │   ├─ 예산 입력: #convDailyBudget, #trafficDailyBudget 변경
  │   ├─ 활성 토글: #convActiveToggle, #trafficActiveToggle 변경
  │   ├─ AdSet 모드: selectAdsetMode 버튼
  │   └─ 기존 광고 토글: #existingAdsToggle
  │
  ├─ 4. 데모 모드 처리:
  │   ├─ sessionStorage에 저장된 exposureMode 없으면
  │   └─ selectExposureMode('new_only') 자동 호출
  │
  ├─ 5. 노출 모드 복원:
  │   restoreExposureMode():
  │   ├─ sessionStorage.getItem('admake_exposure_mode')
  │   ├─ 있으면: exposureMode, adsToTurnOff, adsToDelete 복원
  │   └─ 카드 UI 상태 반영
  │
  ├─ 6. 계정 정보 로드 (순차):
  │   await loadAccountInfo()
  │
  ├─ 7. 병렬 데이터 로드:
  │   await Promise.all([
  │     loadPendingAdsCount(),
  │     loadActiveAds()
  │   ])
  │
  └─ 8. 예산 정보 로드:
      loadBudgetInfo()
});
```

---

## 페이지 복원 및 캐시 처리

### sessionStorage 복원 (restoreExposureMode)

```
restoreExposureMode():
  ├─ saved = sessionStorage.getItem('admake_exposure_mode')
  ├─ saved === null → return (복원할 데이터 없음)
  ├─ parsed = JSON.parse(saved)
  ├─ exposureMode = parsed.exposureMode
  ├─ adsToTurnOff = parsed.adsToTurnOff || []
  ├─ adsToDelete = (parsed.adsToDelete || []).map(id를 광고 객체로 재매핑)
  │   // adsToDelete는 ID만 저장, 광고 객체는 loadActiveAds 후 재매핑 필요
  └─ UI 카드 선택 상태 반영
```

### saveExposureModeState (저장)

```
saveExposureModeState():
  sessionStorage.setItem('admake_exposure_mode', JSON.stringify({
    exposureMode: 'new_only' | 'with_existing',
    adsToTurnOff: [adId, ...],
    adsToDelete: adsToDelete.map(ad => ad.id)  // ID만 저장
  }))
```

### bfcache 핸들러 (pageshow)

```javascript
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // bfcache에서 복원된 경우 오버레이 상태 리셋
    ├─ #exitModalOverlay → hidden
    ├─ #loadingOverlay → hidden
    └─ #confirmModalOverlay → hidden
  }
});
```

---

## 섹션 접기/펼치기 공통 동작

```
.admake-section.collapsible:
  ├─ 헤더 영역 클릭 가능 (cursor: pointer)
  ├─ .collapsed 클래스:
  │   └─ 헤더 외 모든 자식 요소 숨김 (display: none 또는 max-height:0)
  ├─ 토글 아이콘:
  │   ├─ collapsed → transform: rotate(-90deg)
  │   └─ expanded → transform: rotate(0deg)
  └─ 내부 버튼/입력 클릭 시:
      └─ e.stopPropagation() → 섹션 토글 방지
```

---

## API 엔드포인트 전체 목록

### 데이터 조회 (GET)

| 메서드 | URL | 용도 | 응답 형식 |
|--------|-----|------|----------|
| GET | `/dashboard/get_pending_ads` | pending 광고 수 조회 | `{ status, total_count, ads[] }` |
| GET | `/dashboard/get_active_ads?account_id={id}` | 기존 활성 광고 목록 | `{ status, ads[], total, campaigns[] }` |
| GET | `/dashboard/get_account_info?account_id={id}` | 계정/캠페인 매핑 정보 | `{ status, page_id, conv_adset_id, traffic_adset_id, ... }` |
| GET | `/dashboard/get_budget_info?account_id={id}` | 예산 정보 조회 | `{ status, conv_campaign, traffic_campaign }` |
| GET | `/dashboard/adcanvas_meta/performance/campaign-adsets?campaign_id={id}` | 캠페인의 AdSet 목록 | `{ status, data: { adsets[] } }` |

### 데이터 변경 (POST)

| 메서드 | URL | 용도 | 요청 Body | 응답 형식 |
|--------|-----|------|-----------|----------|
| POST | `/dashboard/update_budget` | 예산 수정 | `{ account_id, target_type, campaign_id, adset_id, daily_budget, budget_type }` | `{ status, message }` |
| POST | `/dashboard/update_adset_status` | AdSet 활성/비활성 | `{ account_id, adset_id, campaign_id, status }` | `{ status }` |
| POST | `/dashboard/update_adset_schedule` | AdSet 스케줄 업데이트 | `{ account_id, end_time_setting, end_time_value, conv_active, traffic_active }` | `{ status, message }` |
| POST | `/dashboard/pause_ads` | 광고 일시중지 | `{ ad_ids: [] }` | `{ status, message }` |
| POST | `/dashboard/delete_ads` | 광고 삭제 | `{ ad_ids: [] }` | `{ status, message }` |

### API 응답 상세

#### GET /dashboard/get_pending_ads

```json
{
  "status": "success",
  "total_count": 3,
  "ads": [
    {
      "id": "uuid-string",
      "media_id": "1",
      "media_type": "image",
      "image_hash": "abc123",
      "video_id": null,
      "thumbnail_url": "https://...",
      "message": "주요문구 텍스트",
      "headline": "제목",
      "description": "설명",
      "link": "https://landing.url",
      "cta_type": "SHOP_NOW",
      "ad_name": "AD_1",
      "is_carousel": false,
      "cards": null,
      "product_tags": null
    }
  ]
}
```

#### GET /dashboard/get_active_ads

```json
{
  "status": "success",
  "ads": [
    {
      "id": "ad_id_string",
      "name": "광고 이름",
      "status": "ACTIVE",
      "configured_status": "ACTIVE",
      "effective_status": "ACTIVE",
      "thumbnail_url": "https://...",
      "campaign_type": "conv",
      "created_time": "2026-01-15T10:30:00+0900",
      "adset_id": "adset_123",
      "campaign_id": "campaign_456"
    }
  ],
  "total": 15,
  "campaigns": [
    {
      "id": "campaign_456",
      "name": "캠페인 이름",
      "status": "ACTIVE",
      "adsets": [
        { "id": "adset_123", "name": "AdSet 이름", "status": "ACTIVE" }
      ]
    }
  ]
}
```

#### GET /dashboard/get_account_info

```json
{
  "status": "success",
  "page_id": "page_123",
  "page_name": "페이지 이름",
  "instagram_user_id": "ig_456",
  "conv_adset_id": "adset_conv_789",
  "conv_adset_name": "전환 AdSet",
  "traffic_adset_id": "adset_traffic_012",
  "traffic_adset_name": "유입 AdSet",
  "utm_params": "utm_source=meta&utm_medium=paid",
  "pixel_id": "pixel_345"
}
```

#### GET /dashboard/get_budget_info

```json
{
  "status": "success",
  "conv_campaign": {
    "campaign_id": "campaign_conv_123",
    "campaign_name": "전환 캠페인",
    "daily_budget": 250,
    "budget_type": "CBO",
    "adset_id": "adset_conv_456",
    "status": "ACTIVE"
  },
  "traffic_campaign": {
    "campaign_id": "campaign_traffic_789",
    "campaign_name": "유입 캠페인",
    "daily_budget": 100,
    "budget_type": "CBO",
    "adset_id": "adset_traffic_012",
    "status": "ACTIVE"
  }
}
```

#### GET /dashboard/adcanvas_meta/performance/campaign-adsets

```json
{
  "status": "success",
  "data": {
    "adsets": [
      {
        "id": "adset_001",
        "name": "AdSet Alpha",
        "daily_budget": 150,
        "status": "ACTIVE"
      },
      {
        "id": "adset_002",
        "name": "AdSet Beta",
        "daily_budget": 100,
        "status": "PAUSED"
      }
    ]
  }
}
```

#### POST /dashboard/update_budget

```json
// Request
{
  "account_id": "act_123456",
  "target_type": "conv",
  "campaign_id": "campaign_conv_123",
  "adset_id": "adset_conv_456",
  "daily_budget": 300,
  "budget_type": "CBO"
}

// Response
{
  "status": "success",
  "message": "예산이 업데이트되었습니다"
}
```

#### POST /dashboard/update_adset_status

```json
// Request
{
  "account_id": "act_123456",
  "adset_id": "adset_conv_456",
  "campaign_id": "campaign_conv_123",
  "status": "ACTIVE"
}

// Response
{
  "status": "success"
}
```

#### POST /dashboard/update_adset_schedule

```json
// Request
{
  "account_id": "act_123456",
  "end_time_setting": "set_end",
  "end_time_value": "2026-03-15T23:59:00+09:00",
  "conv_active": true,
  "traffic_active": true
}

// Response (성공)
{ "status": "success", "message": "AdSet 스케줄이 업데이트되었습니다" }

// Response (부분 성공)
{ "status": "partial", "message": "전환 캠페인만 업데이트되었습니다" }

// Response (실패)
{ "status": "error", "message": "업데이트 실패" }
```

#### POST /dashboard/pause_ads

```json
// Request
{ "ad_ids": ["ad_001", "ad_002", "ad_003"] }

// Response
{ "status": "success", "message": "3개 광고 상태 변경 완료" }
```

#### POST /dashboard/delete_ads

```json
// Request
{ "ad_ids": ["ad_004", "ad_005"] }

// Response
{ "status": "success", "message": "2개 광고 삭제 완료" }
```

---

## 예산 변환 규칙

Meta API와 UI 간 예산 값 변환이 필요하다.

```
[Meta API → UI 표시]
  API 응답값 × 100 = KRW 표시값
  예: daily_budget: 250 → 25,000원

[UI 입력 → Meta API]
  KRW 입력값 / 100 = API 전송값
  예: 25,000원 → daily_budget: 250
```

---

## 토스트 시스템

```javascript
function showToast(message, type = 'info', duration = 3500)
// type: 'info' | 'success' | 'warning' | 'error'
```

### 토스트 컨테이너

```
#toastContainer
  position: fixed
  top: 70px
  right: 20px
  z-index: 10000
```

### 타입별 스타일

| 타입 | 아이콘 | 왼쪽 테두리 색 | 배경 tint |
|------|--------|---------------|----------|
| `info` | `i` (원형) | `--accent-blue` (#3b82f6) | 파란 tint |
| `success` | `✓` (체크) | `--accent-emerald` (#10b981) | 초록 tint |
| `warning` | `⚠` (삼각) | `--accent-gold` (#f59e0b) | 골드 tint |
| `error` | `✕` (엑스) | `--accent-red` (#ef4444) | 빨간 tint |

### 애니메이션

```css
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
```

- 진입: `slideIn` 0.3s ease
- 퇴장: `slideOut` 0.3s ease (duration 후 자동)

---

## 헬퍼 함수

```javascript
// 예산 포맷팅 (숫자 → 콤마 구분 문자열)
function formatBudget(value) {
  return value.toLocaleString('ko-KR');
}
// 예: 25000 → "25,000"

// 예산 파싱 (콤마 구분 문자열 → 숫자)
function parseBudget(str) {
  return parseInt(str.replace(/,/g, '')) || 0;
}
// 예: "25,000" → 25000

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// 캠페인 유형 배지 HTML 생성
function getCampaignTypeBadge(type) {
  if (type === 'conv') {
    return '<span class="badge-conv">전환</span>';          // blue
  } else {
    return '<span class="badge-traffic">유입</span>';       // gold
  }
}

// 노출 상태 텍스트 매핑
function getEffectiveStatusText(status) {
  switch (status) {
    case 'ACTIVE': return '노출중';
    case 'PAUSED': return '노출중지';
    case 'DELETED': return '삭제됨';
    case 'ARCHIVED': return '보관됨';
    default: return '노출중지';
  }
}
```

---

## 데모 모드

### 감지 및 동작

```
데모 모드 조건: URL에 demo 관련 파라미터 또는 특정 account_id

데모 모드 동작:
  ├─ 자동으로 exposureMode = 'new_only' 선택
  ├─ 데모 배너 표시:
  │   "데모 모드 — 설정을 자유롭게 변경해보세요. 실제 광고에 반영되지 않습니다."
  │   배경: accent-gold/10, 테두리: accent-gold/20
  └─ API 호출은 정상 수행 (서버에서 demo account 판별)
```

---

## sessionStorage 키 (Step 4 관련)

| 키 | 설정 위치 | 읽기 위치 | 데이터 구조 |
|----|----------|----------|-------------|
| `admake_exposure_mode` | Step 4 (selectExposureMode) | Step 4 (restoreExposureMode) | `{ exposureMode, adsToTurnOff, adsToDelete: [ids] }` |
| `admake_step4_state` | Step 4 (handleNextButton) | Step 5 | `{ selectedAdIds, endDateSetting, endDate, endTime, copyToTraffic, convActive, trafficActive, budgetData, exposureMode, adsToTurnOff, adsToDelete, adsetSelection }` |

### admake_step4_state 전체 스키마

```javascript
{
  // 선택된 광고 ID (테이블 체크박스)
  selectedAdIds: string[],

  // 기간 설정
  endDateSetting: "no_end" | "set_end",
  endDate: "YYYY-MM-DD" | null,
  endTime: "HH:MM" | null,

  // 토글 상태
  copyToTraffic: boolean,
  convActive: boolean,
  trafficActive: boolean,

  // 예산 데이터
  budgetData: {
    conv: {
      originalBudget: number,     // KRW
      currentBudget: number,      // KRW
      budgetType: "CBO" | "ABO",
      campaignId: string,
      adsetId: string,
      isActive: boolean
    },
    traffic: { /* 동일 */ }
  },

  // 노출 모드
  exposureMode: "new_only" | "with_existing",
  adsToTurnOff: string[],        // OFF 예정 광고 ID
  adsToDelete: string[],         // 삭제 예정 광고 ID

  // AdSet 선택
  adsetSelection: {
    conv: {
      mode: "recommended" | "custom",
      selectedAdsetIds: string[],
      adsetSettings: {
        [adsetId: string]: {
          budget: number,
          enabled: boolean
        }
      }
    },
    traffic: { /* 동일 */ }
  }
}
```

---

## 검증 규칙

| 항목 | 필수 | 검증 내용 | 에러 메시지 |
|------|------|----------|-------------|
| 노출 모드 | O | `exposureMode !== null` | "광고 노출 방식을 선택해주세요." |
| AdSet 선택 (custom) | O | `selectedAdsetIds.length >= 1` | "최소 1개의 세트를 선택해야 합니다." |
| 종료 날짜 (set_end) | O | `#endDatetime.value !== ''` | 네이티브 검증 |
| 예산 | - | 숫자만 입력 가능 | 자동 포맷팅 |
| 광고 수 제한 | 자동 | `totalAds <= 50` | 50개 초과 시 자동 삭제 대상 산출 |

---

## 에러/경고 메시지 전체 목록 (한국어)

### 토스트 메시지

| 메시지 | 타입 | 발생 조건 |
|--------|------|----------|
| "광고 노출 방식을 선택해주세요." | warning | 다음 단계 클릭 시 모드 미선택 |
| "최소 1개의 세트를 선택해야 합니다." | warning | AdSet 전체 해제 시도 |
| "{N}개의 광고가 일시중지되었습니다." | success | 일시중지 성공 |
| "{N}개의 광고가 삭제되었습니다." | success | 삭제 성공 |
| "{N}개 성공, {M}개 실패" | warning | 부분 성공 (pause/delete) |
| "삭제 실패: 모든 광고 처리에 실패했습니다." | error | 전체 실패 (delete) |
| "AdSet 업데이트 중 오류가 발생했습니다." | error | update_adset_schedule 실패 |
| "예산 저장 실패" | error (alert) | update_budget 실패 |
| "저장 완료" | success | 예산 저장 성공 (2초 표시) |
| "AdSet 노출 기간이 업데이트되었습니다" | success | 스케줄 업데이트 성공 |

### UI 텍스트

| 텍스트 | 위치 |
|--------|------|
| "광고를 불러오는 중..." | `#loadingState` |
| "활성 상태인 광고가 없습니다" | `#emptyState` |
| "N개의 광고를 삭제해야 합니다" | `#adLimitWarning` |
| "새 광고 N개만 노출됩니다. 기존 광고 M개 OFF 예정" | 노출 요약 (new_only) |
| "기존 광고 M개 + 새 광고 N개 = 총 X개 노출" | 노출 요약 (with_existing) |
| "세트 업데이트 중..." | 다음 버튼 로딩 상태 |
| "캠페인 예산 사용중" | CBO 모드 AdSet 예산 placeholder |
| "데모 모드 — 설정을 자유롭게 변경해보세요. 실제 광고에 반영되지 않습니다." | 데모 배너 |

### 모달 텍스트

| 항목 | 일시중지 (pause) | 삭제 (delete) |
|------|-----------------|---------------|
| 아이콘 | warning (gold) | danger (red) |
| 제목 | "광고 종료" | "광고 삭제" |
| 메시지 | "선택한 N개의 광고를 즉시 종료하시겠습니까?" | "이 작업은 되돌릴 수 없으며 메타 관리자에 바로 반영됩니다." |
| 취소 | "취소" | "취소" |
| 확인 | "종료" | "삭제" |

---

## CSS 클래스 전체 맵

### 레이아웃

| 클래스 | 용도 |
|--------|------|
| `.top-header` | 상단 헤더 (56px, sticky) |
| `.admake-progress-bar` | 프로그레스 바 (sticky) |
| `.admake-main-wrapper` | 메인 래퍼 |
| `.admake-main-content` | 메인 콘텐츠 (overflow-y:auto) |
| `.admake-content-inner` | 콘텐츠 내부 (max-width:900px) |
| `.admake-action-bar` | 하단 액션 바 (fixed) |

### 섹션

| 클래스 | 용도 |
|--------|------|
| `.admake-section` | 섹션 컨테이너 |
| `.collapsible` | 접기/펼치기 가능 섹션 |
| `.collapsed` | 접힌 상태 |
| `.section-number` | 섹션 번호 배지 (01, 02, ...) |

### 노출 모드

| 클래스 | 용도 |
|--------|------|
| `.exposure-mode-cards` | 모드 카드 그리드 (2열) |
| `.exposure-mode-card` | 개별 모드 카드 |
| `.mode-new-only` | "새 광고만" 카드 |
| `.mode-with-existing` | "기존 광고와 함께" 카드 |
| `.selected` | 선택된 카드 (blue/emerald 테두리) |
| `.ads-to-delete-item` | 삭제 대상 광고 아이템 |
| `.action-badge-delete` | "삭제 예정" 배지 (red) |
| `.action-badge-off` | "OFF 예정" 배지 (gold) |

### 테이블

| 클래스 | 용도 |
|--------|------|
| `.admake-table` | 테이블 컨테이너 |
| `.admake-thumbnail` | 광고 썸네일 (60x60px) |
| `.admake-thumbnail-placeholder` | 썸네일 없을 때 placeholder |
| `.ad-name-with-badge` | 광고 이름 + 배지 래퍼 |
| `.ad-name-text` | 광고 이름 텍스트 |
| `.admake-status-badge` | 상태 배지 |
| `.admake-status-on` | ON 상태 (초록) |
| `.admake-status-inactive` | OFF 상태 (회색) |
| `.admake-exposure-badge` | 노출 배지 |
| `.admake-exposure-active` | 노출중 (초록) |
| `.admake-exposure-paused` | 노출중지 (회색/빨강) |
| `.delete-target` | 삭제 대상 행 (빨간 tint) |
| `.off-target` | OFF 대상 행 (골드 tint) |
| `.selected` | 체크박스 선택 행 (파란 tint) |

### 예산

| 클래스 | 용도 |
|--------|------|
| `.budget-card` | 예산 카드 컨테이너 |
| `.badge-conv` | 전환 캠페인 배지 (blue) |
| `.badge-traffic` | 유입 캠페인 배지 (gold) |
| `.admake-toggle` | 토글 스위치 (50x26px) |
| `.status-dot` | 상태 도트 (색상 변경) |
| `.modified` | 예산 값 변경됨 (emerald 테두리) |

### 버튼

| 클래스 | 용도 |
|--------|------|
| `.admake-btn-primary` | 기본 버튼 (blue 그라디언트) |
| `.admake-btn-secondary` | 보조 버튼 (투명/테두리) |
| `.admake-btn-sm` | 소형 버튼 |
| `.admake-btn-sm-danger` | 소형 위험 버튼 (red 그라디언트) |

### 모달

| 클래스 | 용도 |
|--------|------|
| `.modal-overlay` | 모달 오버레이 (backdrop) |
| `.modal-content` | 모달 본문 |
| `.modal-icon-warning` | 경고 아이콘 (gold) |
| `.modal-icon-danger` | 위험 아이콘 (red) |

---

## 상수

```javascript
// 광고 세트당 최대 광고 수
const AD_SET_MAX_ADS = 50;

// 토글 크기
// 캠페인 활성 토글: 50x26px
// 유입 캠페인 복사 토글: 56x30px

// 썸네일 크기
// 테이블 썸네일: 60x60px

// 콘텐츠 영역 최대 너비
// max-width: 900px

// 헤더 높이
// top-header: 56px

// 액션 바 높이
// admake-action-bar: 72px

// executeAction 딜레이 (3개 이상 광고 순차 처리)
const ACTION_DELAY = 100;  // ms

// 예산 변환 계수
const BUDGET_MULTIPLIER = 100;  // API값 × 100 = KRW
```

---

## 네비게이션

### Step 4에서의 이동 경로

```
[이전 버튼 (#backBtn)]
  └─ /adcanvas_meta/create?account_id={accountId}  // Step 3으로

[다음 단계로 (#nextBtn)]
  └─ /adcanvas_meta/publish?account_id={accountId}  // Step 5로

[로고 클릭]
  └─ 나가기 모달 → 확인 시:
      ├─ clearAllAdmakeData()
      └─ /adcanvas_meta?account_id={accountId}  // AdCanvas 홈으로

[햄버거 메뉴]
  └─ 대시보드 내 다른 페이지로 이동 가능
```

### 나가기 모달

```
[경고 아이콘]
페이지를 나가시겠습니까?
현재 진행 중인 광고 제작 내용이
**모두 삭제**됩니다.
[계속 작업하기] [나가기]
```

트리거: 로고 클릭 (변경사항 있을 때)
- "계속 작업하기" → 모달 닫기
- "나가기" → `clearAllAdmakeData()` → 리다이렉트

---

## 외부 라이브러리

| 라이브러리 | 버전 | 용도 | CDN |
|-----------|------|------|-----|
| jQuery | 3.6.0 | DOM 조작 (레거시) | - |
| Lucide Icons | latest | SVG 아이콘 | unpkg CDN |

---

## 폰트

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
/* 한글 본문 */

.font-inter {
  font-family: 'Inter Tight', sans-serif;
}
/* 숫자, 영문 레이블 (STEP 4 OF 5 등) */

font-weight: 300 ~ 900;
```

---

## Tip 배너 (페이지 상단)

```
.tip-banner (dismissible)
  ├── 전구 아이콘 (💡 또는 Lucide lightbulb)
  ├── 팁 텍스트 (노출 방식, 예산, 기간 설정 안내)
  └── 닫기 버튼 (×)
      └─ 클릭 → .tip-banner 숨김 (display:none)
```

---

## 주의사항 (구현 시)

1. **예산 변환**: API 값과 UI 표시값의 100배 차이 주의 (API 250 = 25,000원)
2. **adsToDelete 직렬화**: sessionStorage에는 ID 배열만 저장, 광고 객체는 loadActiveAds 후 재매핑
3. **50개 제한**: `with_existing` 모드에서만 적용, `new_only`에서는 기존 광고 전체 OFF이므로 미적용
4. **3개 이상 삭제/일시중지**: 개별 API 호출 + 100ms 딜레이 (서버 부하 방지)
5. **bfcache**: `pageshow` 이벤트로 오버레이 상태 리셋 필수
6. **섹션 접기**: 내부 버튼 클릭 시 `e.stopPropagation()` 필수
7. **AdSet 최소 1개**: custom 모드에서 마지막 AdSet 해제 시도 시 토스트 경고 + 차단
8. **endDatetime color-scheme**: `color-scheme: dark` 설정으로 다크 테마 네이티브 피커 사용
