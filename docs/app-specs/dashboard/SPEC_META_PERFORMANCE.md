# SPEC: Meta 성과 관리 (/adcanvas/meta/performance)

> **1:1 Clone 대상** — Meta 광고 성과 조회/수정/관리 페이지
> **Flask 원본**: `templates/admake_performance_page.html`
> **백엔드**: `handlers/data_handler.py`, `services/admake_performance_service.py`, `services/admin_campaign_service.py`

---

## 페이지 구조

### 2개 메인 섹션

1. **오늘의 성과 (Performance Summary)** — 7 KPI 카드 + 기간 선택
2. **예산 조정 (Budget Adjustment)** — 3탭 캠페인 계층 + 편집

---

## 1. KPI 카드 (7개)

| 순서 | 카드 | 필드 | 포맷 | 계산 로직 (서버) |
|------|------|------|------|------------------|
| 1 | 지출금액 | spend | `₩` + `formatNumber` | `SUM(spend)` from BQ |
| 2 | 구매 | purchases | 숫자 | `SUM(purchases)` from BQ |
| 3 | ROAS | roas | `%` | `purchase_value / spend * 100` |
| 4 | 전환율 | cvr | `%` | `purchases / clicks * 100` |
| 5 | 유입당비용 | cpc | `₩` + `formatNumber` | `spend / clicks` |
| 6 | 클릭율 | ctr | `%` | `clicks / impressions * 100` |
| 7 | 객단가 | aov | `₩` + `formatNumber` | `purchase_value / purchases` |

### 기간 선택 체인

```
[기간 드롭다운 #periodSelect] → [change 이벤트]
  → currentPeriod 업데이트
  → 모든 .period-select-sync 드롭다운 값 동기화
  → adsDataCache = {} (캐시 초기화)
  → loadSummary() 호출
  → loadCampaigns() 호출
  → showToast('${periodLabels[currentPeriod]} 데이터를 불러옵니다')
```

#### 기간 옵션

| 값 | 라벨 (periodLabels) | 제목 변경 | 날짜 표시 |
|----|---------------------|-----------|-----------|
| `today` | 오늘의 성과 | `#summaryLabel` 텍스트 변경 | `start_date` (단일일) |
| `yesterday` | 어제의 성과 | " | `start_date` (단일일) |
| `3days` | 최근 3일 성과 | " | `start_date ~ end_date` |
| `7days` | 최근 7일 성과 | " | `start_date ~ end_date` |

#### loadSummary() 체인

```
[loadSummary()] → [GET /dashboard/adcanvas_meta/performance/summary]
  Params: account_id, period
  → get_today_summary(account_id, period)
    → BigQuery: meta_ads_account_summary 테이블
    → 서버에서 roas/cvr/cpc/ctr/aov 계산
  → Response: { spend, purchases, roas, cvr, cpc, ctr, aov, start_date, end_date, period }
  → #summaryLabel.text(periodLabels[period])
  → #summaryDate.text(start_date === end_date ? start_date : `${start_date} ~ ${end_date}`)
  → #summaryGrid에 7개 카드 HTML 렌더링
```

---

## 2. 탭 구조 (캠페인 유형별)

| 탭 | 컬러 닷 (CSS ::before) | 분류 조건 (objective) |
|----|------------------------|----------------------|
| 전환 (Conversion) | 에메랄드 `#10b981` | `CONVERSIONS`, `OUTCOME_SALES`, `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS` |
| 트래픽 (Traffic) | 골드 `#f59e0b` | `LINK_CLICKS`, `OUTCOME_TRAFFIC`, `TRAFFIC` |
| 카탈로그 (Catalog) | 파랑 `#3b82f6` | `PRODUCT_CATALOG_SALES` 또는 캠페인명에 '카탈로그' 포함 |

### 캠페인 타입 분류 로직 (서버 `_classify_campaign_by_objective`)

```python
# 1순위: 캠페인 이름에 '카탈로그' 포함 → catalog (objective 무시)
# 2순위: objective 매핑
#   PRODUCT_CATALOG_SALES → catalog
#   LINK_CLICKS, OUTCOME_TRAFFIC, TRAFFIC → traffic
#   CONVERSIONS, OUTCOME_SALES, OUTCOME_ENGAGEMENT, OUTCOME_LEADS → conversion
# 3순위 폴백: 캠페인/세트 이름 파싱 (_classify_campaign_type)
#   '카탈로그'/'catalog'/'dpa'/'다이나믹' → catalog
#   '유입'/'traffic'/'트래픽'/'링크클릭' → traffic
#   '전환'/'conversion'/'구매'/'sales' → conversion
#   기본값 → conversion
```

### 탭 헤더 체인

```
[탭 .perf-tab 클릭] → [click 이벤트]
  → currentTab = type
  → .perf-tab.active 토글
  → .perf-tab-content.active 토글
  → renderTabContent(type) 호출
```

#### 탭 헤더 구성

- 캠페인 타입 컬러 닷 (CSS `::before`)
- 캠페인 이름 (`.perf-tab-name`)
- 일일 예산 (`.perf-tab-budget`) — `calculateCampaignDailyBudget()` 계산
- ON/OFF 토글 + 상태 표시 (`.perf-tab-toggle`)

### 필터

```
["전체 보기" 토글 #showAllCampaigns] → [change 이벤트]
  → showAllCampaigns = checkbox.checked (boolean)
  → renderTabContent(currentTab) (현재 탭 다시 렌더링만, API 호출 없음)
```

- 기본: `showAllCampaigns = false` → ACTIVE 캠페인만 표시
- 체크 시: PAUSED 포함 표시
- DELETED/ARCHIVED는 항상 제외 (서버 측 + 클라이언트 측 모두)

---

## 3. 캠페인 계층 표시

```
Campaign (아코디언 카드)
├── Campaign Header
│   ├── 캠페인명 (+ "라이브"/"중지됨" 배지 — 중복 캠페인명일 때만)
│   ├── 일 예산 (₩ 포맷) — #campaign-budget-{id}
│   ├── 예산 모드 배지 (.budget-mode-badge) — "캠페인 예산"(CBO) / "세트별 예산"(ABO)
│   ├── [CBO] 예산 입력: ₩ [input] /일 + 저장 버튼
│   ├── [ABO] "↓ 각 세트에서 예산 설정" 텍스트
│   └── 편집 버튼 (연필 아이콘) — PAUSED일 때 숨김
├── Adsets (세트 아코디언)
│   ├── Adset Header (2줄 구조)
│   │   ├── 1줄: 상태닷 + 세트명 + 편집 + 광고 미리보기(최대3) + "광고 X개" 배지
│   │   │   ├── [카탈로그] "상품 보기" 버튼
│   │   │   ├── [ABO] 예산 입력: 예산 ₩ [input] + 저장
│   │   │   ├── [CBO] 예산 입력 display:none
│   │   │   ├── 상태 라벨: "라이브"/"중지"
│   │   │   └── ON/OFF 토글 (.status-toggle)
│   │   └── 2줄: 지출/구매/CPC/CTR/ROAS 성과 지표
│   └── Adset Content (펼치기)
│       ├── "라이브만" 체크박스 필터 pill (.live-only-filter)
│       ├── 기간 드롭다운 (.period-select-sync — 메인과 동기화)
│       ├── 새로고침 버튼 (.refresh-btn-sync)
│       └── 광고 테이블 (12-13컬럼)
└── Campaign Budget (CBO/ABO 분기)
    ├── CBO: 캠페인 예산 입력 (헤더에 위치)
    └── ABO: "↓ 각 세트에서 예산 설정" (헤더에 위치)
```

### loadCampaigns() 체인

```
[loadCampaigns()] → [GET /dashboard/adcanvas_meta/performance/campaigns]
  Params: account_id, period
  → get_campaigns_by_type(account_id, period)
    → 1. _get_all_campaigns_from_meta(account_id) — ACTIVE+PAUSED 캠페인 전체 조회
    → 2. BigQuery: meta_ads_adset_summary — 기간별 세트 성과 집계
    → 3. campaigns_map 그룹핑 (타입별 분류)
    → 4. PAUSED 캠페인 추가 (BQ에 없는 것)
    → 5. _batch_get_adsets_for_campaigns() — 배치 세트 조회 (PAUSED 포함)
    → 6. BQ 성과 + Meta API 세트 정보 병합
    → 7. ABO 세트 예산 정보 배치 보강 (_batch_get_adsets_info)
  → Response: { conversion: [...], traffic: [...], catalog: [...], period }
  → campaignsData = result.data (전역 상태 저장)
  → updateCampaignTabs() — 탭 헤더 상태/예산 업데이트
  → renderTabContent(currentTab) — 현재 탭 렌더링
  → updateAccountBudgetDisplay() — 계정 전체 예산 표시
```

### 렌더링 후 로드 체인

```
[renderCampaignContent() 완료] →
  → .period-select-sync 전부 currentPeriod 동기화
  → adsetIdsToLoad.forEach((adsetId, idx) =>
      setTimeout(() => {
        loadAdsForAdset(adsetId);     // 광고 데이터
        loadEntityInfo('adset', adsetId);  // 실시간 상태/예산
      }, idx * 50)  // 순차 지연
    )
```

**핵심**: 광고 데이터는 초기 로드 시 NOT 프리로드됨. 각 세트마다 50ms 간격으로 순차적으로 로드.

---

## 4. 광고 테이블 컬럼 (정렬 가능)

| 컬럼 | 필드 | 정렬 | 카탈로그 | 포맷 |
|------|------|------|----------|------|
| 상태 | status | O | O | 토글 스위치 |
| 썸네일 | thumbnail_url | X | **숨김** | `<img>` 또는 placeholder |
| 광고명 | ad_name | O | O | left, 말줄임 max-width:200px |
| 지출금액 | spend | O (**기본 DESC**) | O | `₩` + formatNumber |
| 노출 | impressions | O | O | formatNumber |
| CPM | cpm | O | O | `₩` + formatNumber |
| CTR | ctr | O | O | `%` (소수점 2자리) |
| CPC | cpc | O | O | `₩` + formatNumber |
| 구매(7일) | purchases | O | O | 숫자 |
| 구매(1일) | purchases_1d | O | O | 숫자 |
| ROAS(7일) | roas | O | O | `%` |
| ROAS(1일) | roas_1d | O | O | `%` |
| 광고 수정 | - | X | O | 편집 버튼 + Meta 관리자 링크 |

### 정렬 동작 체인

```
[테이블 헤더 th.sortable 클릭] → [click 이벤트]
  → adsetId = table.data('adset-id')
  → column = th.data('sort')
  → 같은 컬럼 클릭: direction 토글 (asc ↔ desc)
  → 다른 컬럼 클릭: desc로 시작
  → sortState[adsetId] = { column, direction }
  → renderAdsTable(adsetId) — 클라이언트 사이드 정렬 (API 호출 없음)
  → updateSortHeaderState() — CSS 클래스 토글
```

#### 정렬 상태 관리

```javascript
// 전역 상태
let sortState = {};  // { adsetId: { column: 'spend', direction: 'desc' } }

// 기본 정렬 (최초 로드 시)
if (!sortState[adsetId]) {
  sortState[adsetId] = { column: 'spend', direction: 'desc' };
}

// CSS 클래스
// th.sort-asc — 오름차순 활성
// th.sort-desc — 내림차순 활성 (기본)
```

### "라이브만" 필터 체인

```
["라이브만" 체크박스 .live-only-filter] → [change 이벤트]
  → adsetId = checkbox.data('adset-id')
  → .perf-filter-pill.active 토글 (에메랄드 테두리/배경)
  → renderAdsTable(adsetId) — 클라이언트 사이드 필터링 (API 호출 없음!)
    → showLiveOnly === true: ads.filter(ad => ad.status === 'ACTIVE')
    → showLiveOnly === false: 모든 광고 표시
```

**핵심**: "라이브만" 필터는 `adsDataCache`에서 클라이언트 사이드로만 필터링. API 호출 없음.

### 광고 목록 로드 체인

```
[loadAdsForAdset(adsetId)] → [GET /dashboard/adcanvas_meta/performance/ads]
  Params: account_id, adset_id, period
  → get_ads_for_adset(account_id, adset_id, period)
    → period='today' + FB_TOKEN: Meta API 실시간 (_get_adset_ads_insights_batch)
      → 1. GET /{adset_id}/ads — 광고 목록 + 썸네일
      → 2. GET /{adset_id}/insights?level=ad — 배치 성과 조회
      → 서버에서 정렬: spend DESC
    → 그 외: BigQuery (meta_ads_ad_summary 테이블)
  → Response: [{ ad_id, ad_name, status, thumbnail_url, spend, impressions, cpm, ctr, cpc, purchases, purchases_1d, roas, roas_1d }]
  → 썸네일 캐싱: thumbnailCache[ad_id] = thumbnail_url
  → adsDataCache[adsetId] = result.data
  → updateAdsetPreview(adsetId, ads) — 세트 헤더에 썸네일 스택 + 카운트
  → sortState 초기화 (spend DESC)
  → renderAdsTable(adsetId)
```

### CPC 계산 (서버 측)

```python
# CPC = 지출 / 링크클릭 (전체 클릭이 아닌 링크클릭 기준!)
link_clicks = int(perf.get("inline_link_clicks", 0)) or link_clicks_from_action
cpc = round(spend / link_clicks) if link_clicks > 0 else 0
```

### ROAS 계산 (서버 측)

```python
# ROAS = (구매 가치 / 지출) * 100  (% 단위)
roas_7d = round((purchase_value_7d / spend * 100), 1) if spend > 0 else 0
roas_1d = round((purchase_value_1d / spend * 100), 1) if spend > 0 else 0
```

---

## 5. 상태 토글 (ON/OFF) — 캐스케이드 없음

### 탭 레벨 토글 (캠페인)

```
[캠페인 탭 토글 #convCampaignToggle 등] → [change 이벤트]
  → entityType = toggle.data('entity-type')  // 'campaign' 또는 'adset'
  → entityId = toggle.data('entity-id')
  → status = checked ? 'ACTIVE' : 'PAUSED'
  → [POST /dashboard/adcanvas_meta/performance/update-status]
    Body: { entity_type, entity_id, status }
    → update_entity_status(entity_type, entity_id, status)
      → POST /{entity_id} { status: 'ACTIVE'|'PAUSED' }
  → 성공: 상태 텍스트 ON/OFF 업데이트 + toast
  → 실패: 토글 원복 + 에러 toast
```

### 세트/광고 레벨 토글

```
[세트/광고 토글 .status-toggle] → [change 이벤트]
  → entityId = toggle.data('entity-id')
  → entityType = toggle.data('entity-type')  // 'adset' 또는 'ad'
  → status = checked ? 'ACTIVE' : 'PAUSED'
  → [POST /dashboard/adcanvas_meta/performance/update-status]
    Body: { entity_type, entity_id, status }
  → 성공:
    → #status-{entityId}: '라이브'/'중지' 업데이트
    → #dot-{entityId}: active/paused 클래스 토글
    → toast: '광고/세트가 활성화/비활성화되었습니다'
  → 실패: 토글 원복
```

### 캐스케이드 동작

**중요: 캐스케이드 없음!** 상태 토글은 해당 엔티티만 변경합니다.
- 캠페인 OFF → 해당 캠페인만 PAUSED (하위 세트/광고 상태 변경 없음)
- 세트 OFF → 해당 세트만 PAUSED (하위 광고 상태 변경 없음)
- 광고 OFF → 해당 광고만 PAUSED

### UI 상태

| 상태 | 토글 | 텍스트 | 도트 클래스 | 배지 |
|------|------|--------|-------------|------|
| ACTIVE | checked (파란색) | ON / 라이브 | `.active` | `.perf-name-status-badge.live` |
| PAUSED | unchecked (회색) | OFF / 중지 | `.paused` | `.perf-name-status-badge.paused` |

### 상태별 CSS

```css
.perf-toggle-status.on { color: #3b82f6; }
.perf-toggle-status.off { color: var(--text-muted); }
.perf-campaign-card.paused, .perf-adset-item.paused { opacity: 0.6; }
```

---

## 6. 예산 편집

### 예산 타입 감지 (CBO vs ABO)

```python
# 서버 측 (_get_campaign_info_from_meta, _batch_get_campaigns_info)
has_campaign_budget = data.get("daily_budget") or data.get("lifetime_budget")
budget_type = "CBO" if has_campaign_budget else "ABO"

# 정확한 필드 체크:
# - Meta API GET /{campaign_id}?fields=daily_budget,lifetime_budget
# - daily_budget 필드 존재 + 값이 truthy → CBO
# - lifetime_budget 필드 존재 + 값이 truthy → CBO
# - 둘 다 없음 (null/undefined/0) → ABO
```

### 예산 변환 공식 (API ↔ 원화)

```
┌────────────────────────────────────────────────────────────┐
│  Meta API는 "센트" 단위 저장                                │
│  한국 원화에서 1원 = 100센트 (Meta 내부 단위)                │
│                                                            │
│  [Meta API 값] ──÷100──→ [서버 저장값] ──×100──→ [화면 표시] │
│  [화면 표시]   ──÷100──→ [서버 전송값] ──×100──→ [Meta API]  │
│                                                            │
│  예시: 50,000원 일 예산                                     │
│    Meta API 저장: 5,000,000 (센트)                          │
│    서버 응답값:   50,000 (÷100)                              │
│    화면 표시:     5,000,000 (×100) — **이것은 버그 아님!**   │
└────────────────────────────────────────────────────────────┘

실제 변환 흐름:
  서버 (Python):
    # Meta API → 서버 응답: int(data["daily_budget"]) // 100
    daily_budget = int(data["daily_budget"]) // 100  # 5,000,000 → 50,000

  클라이언트 (JS):
    # 서버 응답 → 화면 표시: apiValue * 100
    function formatBudgetDisplay(apiValue) {
      const won = (parseInt(apiValue) || 0) * 100;  // 50,000 → 5,000,000
      return formatNumber(won);
    }

    # 화면 입력 → API 전송: displayValue / 100
    function parseBudgetInput(displayValue) {
      const won = parseInt(String(displayValue).replace(/[^\d]/g, ''), 10) || 0;
      return Math.round(won / 100);  // 5,000,000 → 50,000
    }

  서버 (Python, 예산 저장):
    # 클라이언트 전송값 → Meta API: × 100
    payload["daily_budget"] = int(daily_budget) * 100  # 50,000 → 5,000,000

NOTE: 이 변환은 서비스 파일과 핸들러에서 일관되게 적용됨.
      loadEntityInfo()에서도 동일: budgetWon = (parseInt(data.daily_budget) || 0) * 100
```

### CBO (캠페인 레벨) 예산 편집 체인

```
[CBO 예산 입력 .perf-campaign-budget-input] → [input 이벤트]
  → 숫자만 추출 → formatNumber 적용 (실시간 포맷팅)
  → original과 비교 → .modified 클래스 토글

[저장 버튼 .save-budget-btn] → [click 이벤트]
  → budgetWon = input.val() 파싱 (원화)
  → 검증: budgetWon < 1000 → '최소 예산은 1,000원입니다' 에러
  → apiBudget = Math.round(budgetWon / 100)
  → [POST /dashboard/adcanvas_meta/performance/update-budget]
    Body: { entity_type: 'campaign', entity_id, daily_budget: apiBudget }
    → update_entity_budget(entity_type, entity_id, daily_budget)
      → payload["daily_budget"] = int(daily_budget) * 100 (센트 변환)
      → POST /{entity_id} { daily_budget: 센트값 }
  → 성공:
    → 모든 .budget-input[data-entity-id] 동기화
    → campaignsData 내 캠페인 예산 업데이트
    → updateCampaignBudgetDisplay(entityId)
    → updateAccountBudgetDisplay()
    → toast: '예산이 변경되었습니다'
  → 실패: 에러 toast
```

### ABO (세트 레벨) 예산 편집 체인

```
[ABO 세트 예산 입력 .perf-budget-input-sm] → [input 이벤트]
  → 숫자만 추출 → formatNumber 적용

[저장 버튼 .save-budget-btn] → [click 이벤트]
  → budgetWon = input.val() 파싱 (원화)
  → 검증: budgetWon < 1000 → 에러
  → apiBudget = Math.round(budgetWon / 100)
  → [POST /dashboard/adcanvas_meta/performance/update-budget]
    Body: { entity_type: 'adset', entity_id, daily_budget: apiBudget }
  → 성공:
    → updateBudgetHierarchy(adsetId, budgetWon)
      → adset.daily_budget = Math.round(budgetWon / 100) (campaignsData 업데이트)
      → updateCampaignBudgetDisplay(campaign_id)
      → updateAccountBudgetDisplay()
    → toast
```

### UI 포맷

| 모드 | 위치 | 포맷 | display 조건 |
|------|------|------|-------------|
| CBO 캠페인 예산 | 캠페인 헤더 `.budget-mode-content` | `₩ [input] /일` + 저장 | `isCBO === true` |
| ABO 세트 예산 | 세트 헤더 `.perf-adset-budget-inline` | `예산 ₩ [input]` + 저장 | `isCBO === false` |
| ABO 안내 | 캠페인 헤더 | `↓ 각 세트에서 예산 설정` | `isCBO === false` |

### 계정 총 예산 계산

```javascript
function calculateAccountDailyBudget() {
  let total = 0;
  Object.values(campaignsData).filter(Array.isArray).forEach(campaigns => {
    campaigns.forEach(campaign => {
      if (campaign.budget_type === 'CBO') {
        // CBO: ACTIVE 캠페인의 daily_budget × 100 (원화 변환)
        if (campaign.campaign_status === 'ACTIVE' && campaign.daily_budget) {
          total += (campaign.daily_budget || 0) * 100;
        }
      } else {
        // ABO: ACTIVE 세트의 daily_budget × 100 합산
        (campaign.adsets || []).forEach(adset => {
          if (adset.status === 'ACTIVE' && adset.daily_budget) {
            total += (adset.daily_budget || 0) * 100;
          }
        });
      }
    });
  });
  return total;
}
```

---

## 7. 편집 사이드 패널

### 패널 속성

```css
.edit-panel {
  position: fixed;
  top: 0;
  right: -420px;     /* 닫힘 상태 */
  width: 400px;      /* 고정 너비 */
  height: 100vh;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-default);
  z-index: 9999;
  transition: right 0.3s ease;  /* 슬라이드 인 */
}
.edit-panel.active { right: 0; }

.edit-panel-overlay {
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}
```

### 편집 버튼 → 패널 열기 체인

```
[편집 버튼 .edit-entity-btn 클릭] → [click 이벤트, stopPropagation]
  → entityType = button.data('entity-type')  // 'campaign' | 'adset' | 'ad'
  → entityId = button.data('entity-id')
  → entityName = button.data('entity-name')
  → openEditPanel(entityType, entityId, entityName)

[openEditPanel()] →
  → currentEditEntity = { type, id }
  → 패널 타이틀: "캠페인 수정" / "광고세트 수정" / "광고 수정"
  → 필드 표시/숨김:
    → #editTargetingGroup: adset만 show
    → #editCreativeBtn: ad만 show
  → #editPanelLoading show, #editPanelForm hide
  → #editPanel.addClass('active'), #editPanelOverlay.addClass('active')
  → [GET /dashboard/adcanvas_meta/performance/entity-details] ← 이 API 호출이 핵심!
    Params: entity_type, entity_id
    → campaign: get_meta_campaign_details(entity_id)
      → fields: id, name, status, objective, daily_budget, lifetime_budget
    → adset: get_meta_adset_details(entity_id)
      → fields: id, name, status, daily_budget, optimization_goal, targeting, promoted_object
      → targeting: { age_min, age_max, genders, geo_locations, advantage_audience }
    → ad: get_meta_ad_details(entity_id)
      → fields: id, name, status, creative info
  → 폼 프리필:
    → #editEntityName = data.name
    → #editEntityStatus = data.status
    → [adset] #editAgeMin/Max, #editGender
    → [campaign] 읽기 전용: 캠페인 목표 (translateObjective)
    → [adset] 읽기 전용: 최적화 목표 (translateOptimizationGoal)
    → [ad] 읽기 전용: 광고 형식, 헤드라인, 랜딩 URL
  → #editPanelLoading hide, #editPanelForm show
```

### 패널 구조

```
Header
├── 타이틀: "캠페인 수정" / "광고세트 수정" / "광고 수정"
└── 닫기 (X) #editPanelClose

Body (스크롤) #editPanelForm
├── 편집 폼
│   ├── 이름 (text) #editEntityName
│   ├── 상태 (select: ACTIVE/PAUSED) #editEntityStatus
│   ├── 타게팅 (adset만) #editTargetingGroup
│   │   ├── 성별 (select: 전체/남성/여성) #editGender
│   │   └── 연령 (number: min~max) #editAgeMin ~ #editAgeMax
│   └── 읽기 전용 섹션 #editReadonlyInfo
│       ├── [campaign] 캠페인 목표
│       ├── [adset] 최적화 목표
│       └── [ad] 광고 형식, 헤드라인, URL
└── 소재 수정 버튼 #editCreativeBtn (ad만 표시)
    → /adcanvas_meta/create?edit_ad_id=...&adset_id=...&campaign_id=...&account_id=...

Footer
├── 삭제 (좌, 빨강) #editDeleteBtn
└── 저장 (우, 파랑) #editSaveBtn
```

### 저장 체인

```
[저장 버튼 #editSaveBtn 클릭] → [click 이벤트]
  → payload = { entity_type, entity_id, name, status }
  → [adset] payload += { age_min, age_max, gender }
  → [POST /dashboard/adcanvas_meta/performance/update-entity]
    → campaign: update_meta_campaign(id, name, daily_budget, status)
    → adset: update_meta_adset(id, name, daily_budget, status, age_min, age_max, gender)
    → ad: update_meta_ad(id, name, status)
  → 성공: toast + 패널 닫기 + loadCampaigns() 새로고침
```

### 삭제 체인

```
[삭제 버튼 #editDeleteBtn 클릭] → [click 이벤트]
  → #deleteConfirmModal 표시
  → 텍스트: "이 캠페인/광고세트/광고을(를) 삭제하시겠습니까?"
  → 경고: "이 작업은 되돌릴 수 없습니다."

[삭제 확인 #deleteConfirmBtn] → [click 이벤트]
  → [POST /dashboard/adcanvas_meta/performance/delete-entity]
    Body: { entity_type, entity_id }
    → delete_meta_campaign/adset/ad(entity_id)
  → 성공: toast + 모달/패널 닫기 + loadCampaigns() 새로고침
```

---

## 8. 아코디언 동작

### 세트 행 펼치기/접기 체인

```
[세트 헤더 .perf-adset-header 클릭] → [click 이벤트]
  → .perf-adset-right 영역 클릭은 무시 (이벤트 버블링 방지)
  → $header.toggleClass('expanded')
  → $content (#content-{adsetId}).toggleClass('expanded')
  → 펼침 상태 추적:
    → expanded → expandedAdsets.add(adsetId)
    → collapsed → expandedAdsets.delete(adsetId)
  → 아이콘 회전: CSS .expanded .perf-adset-toggle-icon → 90deg
```

### 펼침 상태 유지

```
새로고침/기간변경 시:
  → loadCampaigns() → renderCampaignContent() →
    → expandedAdsets.has(adset.adset_id) → isExpanded 판단
    → isExpanded === true → 'expanded' 클래스 자동 적용
    → 데이터 새로 로드되어도 펼침 상태 유지됨
```

**핵심**: `expandedAdsets`는 `new Set()`이며 새로고침(refreshBtn) 클릭 시에도 초기화되지 않음. 기간 변경 시에도 유지됨.

### 계층 연결선 (CSS)

```css
.perf-adset-accordion::before { /* 세로선 (좌측) */ }
.perf-adset-item::before { /* 가로선 (각 세트) */ }
.perf-adset-item:last-child::after { /* 마지막 세트 닫기선 */ }
/* 색상: rgba(255, 255, 255, 0.1) */
```

---

## 9. 새로고침 버튼 동작

```
[새로고침 #refreshBtn 또는 .refresh-btn-sync 클릭] → [click 이벤트]
  → loadSummary()   — KPI 카드 새로고침
  → loadCampaigns() — 캠페인/세트 목록 새로고침
  → showToast('데이터를 새로고침했습니다')
  ※ expandedAdsets 유지 → 펼침 상태 보존
  ※ adsDataCache 재로드 → 광고 데이터 최신화
  ※ sortState 유지 → 정렬 상태 보존
```

---

## 10. 기간 드롭다운 동기화

```
[메인 #periodSelect 또는 세트 내 .period-select-sync 변경] → [change 이벤트]
  → currentPeriod = 선택한 값
  → 모든 '#periodSelect, .period-select-sync' 동기화:
    → $('#periodSelect, .period-select-sync').val(currentPeriod)
  → adsDataCache = {} (캐시 초기화!)
  → loadSummary()
  → loadCampaigns()
  → toast: '${periodLabels[currentPeriod]} 데이터를 불러옵니다'
```

**핵심**: 어느 드롭다운을 변경해도 모든 드롭다운이 동기화됨. 세트 내 기간 드롭다운 변경 시에도 전체 데이터가 리로드됨.

---

## 11. 조건부 표시 규칙

### 캠페인 타입별

| 조건 | 동작 |
|------|------|
| `type === 'catalog'` | "상품 보기" 버튼 표시, 썸네일 컬럼 숨김 |
| `type !== 'catalog'` | 썸네일 컬럼 표시 |
| "상품 보기" 클릭 | 상품 모달 열기 (API 호출) |

### 예산 타입별

| 조건 | 동작 |
|------|------|
| `budget_type === 'CBO'` | 캠페인 헤더에 예산 입력, 배지: `.budget-mode-badge.cbo` "캠페인 예산" |
| `budget_type === 'ABO'` | 세트 헤더에 예산 입력, 배지: `.budget-mode-badge.abo` "세트별 예산" |
| CBO + 세트 행 | `.perf-adset-budget-inline` display:none |
| ABO + 캠페인 헤더 | "↓ 각 세트에서 예산 설정" 텍스트 |

### 상태별

| 조건 | 동작 |
|------|------|
| `campaign_status === 'PAUSED'` | `.perf-campaign-card.paused` → opacity 0.6 |
| `adset.status !== 'ACTIVE'` | `.perf-adset-item.paused` → opacity 0.6 |
| 중복 캠페인명 | "중지됨" / "라이브" 배지 표시 |
| PAUSED 캠페인 | 편집 버튼 숨김 |

### 기간별

```
기간 변경 → #summaryLabel 업데이트 (periodLabels)
기간 변경 → .period-select-sync 전체 동기화
```

---

## 12. 상품 세트 모달 (카탈로그 전용)

### 트리거 → 데이터 로드 체인

```
["상품 보기" 버튼 .view-products-btn 클릭] → [click 이벤트]
  → setId = button.data('set-id')   // product_set_id 또는 adset_id
  → setName = button.data('set-name')
  → #productModalTitle.text(setName)
  → #productList — 로딩 스피너 표시
  → #productModal.addClass('active')
  → [GET /dashboard/adcanvas_meta/performance/product-set-items]
    Params: product_set_id, account_id
    → get_product_set_items(product_set_id, account_id)
      → Meta API: GET /{product_set_id}?fields=id,name,filter,product_count
      → product_set_id가 아닌 adset_id 전달 시: promoted_object에서 추출
      → filter JSON에서 retailer_id (상품번호) 추출
      → BigQuery: cafe24_products 테이블에서 상품명 매핑
  → 성공: 상품 리스트 렌더링 (번호 + 이름 + 상품번호)
  → 빈 상태: "상품이 없습니다"
```

### 모달 속성

```css
/* 오버레이 */
background: rgba(0, 0, 0, 0.8);

/* 모달 */
width: 90%;
max-width: 500px;
max-height: 70vh;  /* 스크롤 */
```

### 모달 구조

```
Header: 세트 이름 + 닫기(X)
Body:
  └── 상품 리스트 (.perf-product-item)
      ├── 번호. 상품명 (좌)
      └── #상품번호 (우, monospace)
빈 상태: "상품이 없습니다"
```

### 닫기

```
[#productModalClose 또는 모달 배경 클릭] → [click 이벤트]
  → #productModal.removeClass('active')
```

---

## 13. 광고 미리보기 (세트 헤더)

```
[loadAdsForAdset() 완료] → updateAdsetPreview(adsetId, ads)
  → ACTIVE 광고 우선, 없으면 전체 ads
  → 최대 3개 썸네일 스택: <img class="perf-ad-thumb">
  → 썸네일 없으면 placeholder (이미지 아이콘 SVG)
  → 카운트 배지: "광고 X개"
  → #adpreview-{adsetId}에 렌더링
```

---

## 14. API 엔드포인트 (완전)

### A. 성과 요약

```
GET /dashboard/adcanvas_meta/performance/summary
Params: account_id (string), period (today|yesterday|3days|7days)
Handler: admake_performance_summary()
Service: get_today_summary(account_id, period) — @cached_query(ttl=60)
Source: BigQuery meta_ads_account_summary
Response: {
  status: "success",
  data: {
    spend, purchases, purchase_value, roas, cvr, cpc, ctr, aov,
    clicks, impressions, period, start_date, end_date
  }
}
```

### B. 캠페인 목록 (타입별)

```
GET /dashboard/adcanvas_meta/performance/campaigns
Params: account_id, period
Handler: admake_performance_campaigns()
Service: get_campaigns_by_type(account_id, period) — @cached_query(ttl=120)
Source: Meta API + BigQuery meta_ads_adset_summary
Response: {
  status: "success",
  data: {
    conversion: [{ campaign_id, campaign_name, campaign_status, type, budget_type,
                    daily_budget, lifetime_budget, adsets: [...],
                    total_spend, total_purchases, total_purchase_value, roas }],
    traffic: [...],
    catalog: [...],
    period
  }
}
```

### C. 세트 광고 목록

```
GET /dashboard/adcanvas_meta/performance/ads
Params: account_id, adset_id, period
Handler: admake_performance_ads()
Service: get_ads_for_adset(account_id, adset_id, period)
Source: today=Meta API (실시간) / 과거=BigQuery meta_ads_ad_summary
Response: {
  status: "success",
  data: [{ ad_id, ad_name, status, effective_status, thumbnail_url,
           spend, impressions, clicks, link_clicks, cpm, ctr, cpc,
           purchases, purchases_1d, roas, roas_1d }]
}
```

### D. 엔티티 실시간 정보

```
GET /dashboard/adcanvas_meta/performance/entity-info
Params: entity_type (campaign|adset|ad), entity_id
Handler: admake_performance_entity_info()
Service: get_entity_realtime_info(entity_type, entity_id)
Source: Meta API
Fields: id, name, status, effective_status, daily_budget, lifetime_budget, budget_remaining, end_time(adset)
Response: {
  status: "success",
  data: { id, name, status, effective_status, daily_budget, lifetime_budget, budget_remaining, end_time }
}
```

### E. 상태 토글

```
POST /dashboard/adcanvas_meta/performance/update-status
Body: { entity_type (campaign|adset|ad), entity_id, status (ACTIVE|PAUSED) }
Handler: admake_performance_update_status()
Service: update_entity_status(entity_type, entity_id, status)
Action: POST /{entity_id} { status }
Response: { status: "success", message }
```

### F. 예산 수정

```
POST /dashboard/adcanvas_meta/performance/update-budget
Body: {
  entity_type (campaign|adset),
  entity_id,
  daily_budget (서버값 = 원화/100, 서버에서 ×100으로 센트 변환),
  lifetime_budget (optional)
}
Handler: admake_performance_update_budget()
Service: update_entity_budget(entity_type, entity_id, daily_budget, lifetime_budget)
Action: POST /{entity_id} { daily_budget: value*100 }
Response: { status: "success", message: "예산이 변경되었습니다." }
```

### G. 엔티티 상세 정보 (편집 패널용)

```
GET /dashboard/adcanvas_meta/performance/entity-details
Params: entity_type (campaign|adset|ad), entity_id
Handler: admake_performance_entity_details()
Service:
  campaign → get_meta_campaign_details(entity_id)
    Response: { id, name, status, objective, daily_budget }
  adset → get_meta_adset_details(entity_id)
    Response: { id, name, status, daily_budget, optimization_goal, billing_event,
                promoted_object, targeting: { age_min, age_max, genders, geo_locations, advantage_audience } }
  ad → get_meta_ad_details(entity_id)
    Response: { id, name, status, creative: { type, headline, link_url }, adset_id, campaign_id }
```

### H. 엔티티 수정

```
POST /dashboard/adcanvas_meta/performance/update-entity
Body: {
  entity_type (campaign|adset|ad), entity_id,
  name (optional), status (optional),
  daily_budget (optional, campaign/adset),
  age_min, age_max, gender (optional, adset only)
}
Handler: admake_performance_update_entity()
Service:
  campaign → update_meta_campaign(id, name, daily_budget, status)
  adset → update_meta_adset(id, name, daily_budget, status, age_min, age_max, gender)
  ad → update_meta_ad(id, name, status)
Response: { status: "success", ... }
```

### I. 엔티티 삭제

```
POST /dashboard/adcanvas_meta/performance/delete-entity
Body: { entity_type (campaign|adset|ad), entity_id }
Handler: admake_performance_delete_entity()
Service:
  campaign → delete_meta_campaign(entity_id)
  adset → delete_meta_adset(entity_id)
  ad → delete_meta_ad(entity_id)
Response: { status: "success", message: "삭제되었습니다." }
```

### J. 종료일 변경

```
POST /dashboard/adcanvas_meta/performance/update-schedule
Body: { entity_id, end_time (ISO 8601 | null) }
Handler: admake_performance_update_schedule()
Service: update_entity_schedule(entity_id, end_time)
Action: POST /{entity_id} { end_time: value | 0 }
  → null → end_time: 0 (무기한)
Response: { status: "success", message: "종료일이 변경되었습니다." }
```

### K. 상품 목록

```
GET /dashboard/adcanvas_meta/performance/product-set-items
Params: product_set_id, account_id
Handler: admake_performance_product_set_items()
Service: get_product_set_items(product_set_id, account_id)
Source: Meta API + BigQuery (cafe24_products)
Response: {
  status: "success",
  data: [{ set_name, product_count, products: [{ product_name, product_no }] }]
}
```

### L. 예산 모드 전환

```
POST /dashboard/adcanvas_meta/performance/switch-budget-mode
Body: { campaign_id, to_cbo (bool), daily_budget (CBO 전환 시 필수) }
Handler: admake_performance_switch_budget_mode()
Service: switch_campaign_budget_mode(campaign_id, to_cbo, daily_budget)
Action: POST /{campaign_id} { is_campaign_budget_on: "true"|"false", daily_budget? }
Response: { status: "success", message, new_mode: "CBO"|"ABO" }
```

### M. CBO → ABO 전환 + 세트 예산 일괄 설정

```
POST /dashboard/adcanvas_meta/performance/switch-to-abo
Body: { campaign_id, adset_budgets: { adset_id: budget_won, ... } }
Handler: admake_performance_switch_to_abo()
Service: switch_to_abo_with_budgets(campaign_id, adset_budgets)
Steps:
  1. POST /{campaign_id} { is_campaign_budget_on: "false" }
  2. 3초 대기 (Meta API 반영)
  3. 각 세트 POST /{adset_id} { daily_budget: budget_won * 100 }
Response: { status: "success", message }
```

### N. 캠페인 세트 목록 (예산 배분 모달용)

```
GET /dashboard/adcanvas_meta/performance/campaign-adsets
Params: campaign_id
Handler: admake_performance_campaign_adsets()
Service: get_campaign_adsets(campaign_id)
Response: {
  status: "success",
  data: { campaign_id, campaign_name, campaign_budget, adsets: [{ id, name, status, daily_budget }] }
}
```

### O. 세트 예산 일괄 설정 (ABO)

```
POST /dashboard/adcanvas_meta/performance/set-adset-budgets
Body: { adset_budgets: { adset_id: budget_won, ... } }
Handler: admake_performance_set_adset_budgets()
Service: set_adset_budgets(adset_budgets)
Validation: 최소 예산 1,000원
Response: { status: "success", message: "N개 세트 예산 설정 완료" }
```

---

## 15. 에러/검증 메시지

| 상황 | 메시지 |
|------|--------|
| 예산 < 1000원 | "최소 예산은 1,000원입니다" |
| 상태 변경 실패 | "상태 변경 실패" + result.message |
| 예산 변경 실패 | "예산 변경 실패" + result.message |
| API 토큰 없음 | "Meta API 토큰이 없습니다." |
| 필수 파라미터 누락 | "account_id가 필요합니다" / "entity_id와 status가 필요합니다" |
| 빈 캠페인 | "전환/트래픽/카탈로그 캠페인이 없습니다" |
| 빈 세트 | "활성 세트가 없습니다" / "세트가 없습니다" (전체보기) |
| 라이브 광고 없음 | "라이브 광고가 없습니다. (전체 보기: 체크 해제)" |
| 삭제 확인 | "이 {type}을(를) 삭제하시겠습니까?" |
| 삭제 경고 | "이 작업은 되돌릴 수 없습니다." |
| 종료일 미선택 | "종료일을 선택해주세요" |
| 매핑 없음 | "매핑된 캠페인이 없습니다" |

---

## 16. 로딩 상태

| 상황 | UI | 구현 |
|------|-----|------|
| 초기 KPI | #summaryGrid 스피너 | loadSummary() → HTML 교체 |
| 초기 캠페인 | #loading-{type} show | loadCampaigns() → hide |
| 광고 테이블 | tbody 내 스피너 + "로딩 중..." | loadAdsForAdset() → renderAdsTable() |
| 상품 모달 | #productList 스피너 | API 응답 후 교체 |
| 편집 패널 | #editPanelLoading show, #editPanelForm hide | entity-details 응답 후 교체 |
| 순차 지연 | `setTimeout(fn, idx * 50)` | 세트별 50ms 간격 순차 로드 |

---

## 17. 클라이언트 상태 관리

```javascript
// 전역 상태 변수
let campaignsData = { conversion: [], traffic: [], catalog: [] };  // 캠페인 전체 데이터
let currentTab = 'conversion';          // 현재 활성 탭
let currentPeriod = 'today';            // 기간 선택
let showAllCampaigns = false;           // PAUSED 포함 표시
let budgetData = {};                     // 예산 원본 데이터: { entityId: { original, current } }
let expandedAdsets = new Set();          // 펼쳐진 세트 ID 추적
let thumbnailCache = {};                 // 광고별 썸네일 URL 캐시: { ad_id: url }
let adsDataCache = {};                   // 세트별 광고 데이터: { adsetId: [ads] }
let sortState = {};                      // 정렬 상태: { adsetId: { column, direction } }
let currentEditEntity = null;            // 편집 중인 엔티티: { type, id, creative?, adset_id?, campaign_id? }
let pendingAccountId = null;             // 계정 변경 대기 중 ID

const periodLabels = {
  'today': '오늘의 성과',
  'yesterday': '어제의 성과',
  '3days': '최근 3일 성과',
  '7days': '최근 7일 성과'
};

const accountId = "{{ account_id }}";    // 서버 렌더링 변수 (Jinja2)
```

---

## 18. 계정 전환

```
[계정 셀렉터 #accountSelector 변경] → [change 이벤트]
  → 같은 계정: 무시
  → 다른 계정:
    → 셀렉터 값 원복 (확인 전까지)
    → #accountChangeTarget에 계정명 표시
    → #accountChangeModal 표시 (확인 모달)

[확인 #accountChangeConfirm] → 페이지 이동:
  window.location.href = /adcanvas_meta/performance?account_id=${newId}

[취소 #accountChangeCancel] → 모달 닫기
[배경 클릭] → 모달 닫기
```

---

## 19. 종료일 설정

```
[종료일 옵션 .perf-schedule-btn 클릭] → [click 이벤트]
  type === 'no_end':
    → 버튼 active/no-end 클래스
    → schedule-input disabled + opacity 0.4
    → save-schedule-btn hide
    → updateSchedule(entityId, null) — 즉시 API 호출!

  type === 'set_end':
    → 버튼 active 클래스
    → schedule-input enabled + opacity 1
    → save-schedule-btn show

[종료일 저장 .save-schedule-btn 클릭] → [click 이벤트]
  → endTime = schedule-input.val()
  → 미입력 시: 에러 toast
  → updateSchedule(entityId, endTime)
    → [POST /dashboard/adcanvas_meta/performance/update-schedule]
      Body: { entity_id, end_time }
    → 성공: toast
```

---

## 20. 소재 수정 (광고 → 새 광고 생성 플로우)

```
[소재 수정 버튼 #editCreativeBtn 클릭] → [click 이벤트]
  → 조건: currentEditEntity.type === 'ad'
  → 페이지 이동: /adcanvas_meta/create?edit_ad_id={id}&adset_id=...&campaign_id=...&account_id=...
  → 광고 생성 페이지에서 기존 광고 정보 프리필 + 기존 광고 OFF 옵션
```

---

## 21. 다크 테마

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
  --text-primary: #ffffff;
  --text-secondary: #d4d4d8;
  --text-muted: #a1a1aa;
  --accent-blue: #3b82f6;
  --accent-emerald: #10b981;
  --accent-gold: #f59e0b;
  --accent-red: #ef4444;
}
```

### 강제 다크

```css
/* 클래스: body.adcanvas-dark-theme */
body.adcanvas-dark-theme { color: #e5e5e5 !important; }
body.adcanvas-dark-theme select { background-color: #18181b !important; color: #fafafa !important; }
body.adcanvas-dark-theme select option { background-color: #27272a !important; color: #fafafa !important; }
body.adcanvas-dark-theme select option:checked { background-color: #3b82f6 !important; }
```

---

## 22. 데모 모드

```
{% if session.get('is_demo') %}
  → 상단 배너: "데모 모드 — 예산/상태를 자유롭게 변경해보세요. 실제 광고에 반영되지 않습니다."
  → 모든 API 핸들러: is_demo() 체크 → demo_meta_data 반환 (가짜 데이터)
  → demo_delay() 호출 (시뮬레이션 지연)
```

---

## 23. 헤더 네비게이션

```
[헤더 좌측 (로고/타이틀) 클릭] → [click 이벤트]
  → account-selector-wrapper 클릭 시 제외
  → window.location.href = /adcanvas_meta?account_id={account_id}
  → Meta 선택 페이지로 이동

[햄버거 메뉴] → 드롭다운 표시
  → .hamburger-dropdown.show 토글
  → 링크 목록: 페이지 이동
```

---

## 24. 서버 캐싱

| 함수 | TTL | 키 |
|------|-----|-----|
| `get_today_summary` | 60초 | `admake_period_summary` + account_id + period |
| `get_campaigns_by_type` | 120초 | `admake_campaigns_by_type` + account_id + period |

---

## 25. 폰트

```
기본: 'Pretendard', -apple-system, sans-serif
숫자/영문: 'Inter Tight', sans-serif (.font-inter)
로드: Google Fonts (Inter Tight) + CDN (Pretendard)
```

---

## 26. Meta 광고 관리자 링크 (광고별)

```
[Meta 관리자 링크 (external-link 아이콘)] → [클릭]
  → target="_blank"
  → URL: https://adsmanager.facebook.com/adsmanager/manage/ads/edit/standalone
    ?act={accountId (act_ 제거)}
    &business_id=287563004172481
    &selected_ad_ids={ad_id}
    &current_step=0
```

---

## 27. 레이아웃 수치

| 요소 | 수치 |
|------|------|
| 상단 헤더 높이 | 56px, position: fixed, z-index: 1000 |
| 메인 컨테이너 패딩 | 100px 40px 40px 40px |
| KPI 그리드 | 7열 `repeat(7, 1fr)`, gap: 12px |
| 탭 | flex: 1, border-radius: 10px 10px 0 0 |
| 편집 패널 너비 | 400px |
| 토글 스위치 | 50px × 26px |
| 썸네일 | 40px × 40px, border-radius: 4px |
| 상품 모달 | max-width: 500px, max-height: 70vh |
