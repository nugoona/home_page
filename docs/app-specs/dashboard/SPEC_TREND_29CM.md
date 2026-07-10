# SPEC: 29CM 트렌드 페이지 (Trend + Compare + Insight)

> **1:1 Clone 대상** — Flask 29CM 트렌드 페이지 (카드, Compare 사이드바, Insight 사이드바 포함)
> **Flask 원본 HTML**: `ngn_wep/dashboard/templates/trend_page.html` (1705 lines)
> **Flask JS (Trend+Insight)**: `ngn_wep/dashboard/static/js/trend_page.js` (~2000 lines)
> **Flask JS (Compare)**: `ngn_wep/dashboard/static/js/compare_page.js` (665 lines)
> **Flask CSS (Compare)**: `ngn_wep/dashboard/static/css/compare.css`
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py`
> **Flask 서비스 (Trend)**: `ngn_wep/dashboard/services/trend_29cm_service.py` (514 lines)
> **Flask 서비스 (Compare)**: `ngn_wep/dashboard/services/compare_29cm_service.py` (773 lines)
> **URL**: `/trend?company_name=XXX` (29CM), `/trend?company_name=XXX&page_type=ably` (Ably)
> **검증 기준 업체**: piscess
> **버전**: 2026-02-28

---

## 1. 페이지 개요

29CM 주간 베스트 상품 트렌드를 카테고리별/트렌드 타입별로 표시하는 페이지이다.
메인 영역에 랭킹 테이블, 오른쪽 사이드바로 **Insight** (AI 분석 리포트)와 **Compare** (경쟁사 비교)를 제공한다.

### 주요 기능 요약

| # | 기능 | 설명 |
|---|------|------|
| 1 | **카테고리 탭** | 전체, 의류, 신발 등 29CM best_page_name 기반 탭 전환 (클라이언트 사이드) |
| 2 | **트렌드 타입 탭** | 급상승(Rising Star), 신규 진입(New Entry), 순위 하락(Rank Drop) 세그먼트 컨트롤 |
| 3 | **랭킹 테이블** | 썸네일, 브랜드, 상품명, 순위변화, 이번주/지난주 순위 (정렬 가능) |
| 4 | **Insight 사이드바** | AI 분석 리포트 (GCS 스냅샷 → 마크다운 렌더링, Section 1/2/3 파싱) |
| 5 | **Compare 사이드바** | 경쟁사 브랜드 TOP 20 상품, 리뷰 모달, 베스트 랭킹 매칭 |
| 6 | **NEW 배지** | 세션 최초 접근 시 Insights/Compare 버튼에 NEW 뱃지 표시 |
| 7 | **주차 정보** | ISO 8601 주차 기반 "{년}년 {월}월 {주}주차 트렌드" 제목 |

---

## 2. 데이터 플로우

```
[페이지 로드 - $(document).ready]
  ├─ loadTabs()                       → GET /dashboard/trend/tabs
  │   └─ renderTabs()                 → 카테고리 탭 동적 생성
  ├─ setupTrendTypeTabs()             → 급상승/신규진입/순위하락 탭 이벤트 바인딩
  ├─ setupTrendAnalysisToggle()       → Insights 버튼/사이드바 이벤트 바인딩
  └─ loadAllTabsData()                → POST /dashboard/trend
      ├─ company_name 결정: URL param > window.selectedCompany > accountFilter
      ├─ allTabsData 메모리 저장      → { "전체": { rising_star:[], new_entry:[], rank_drop:[] }, ... }
      ├─ window.trendInsights 저장    → { analysis_report: "...", generated_at: "..." }
      └─ displayCurrentTabData()      → 현재 탭/트렌드 타입에 맞는 테이블 렌더링

[카테고리 탭 전환]
  └─ switchTab(tabName)               → API 호출 없음, allTabsData[tabName]에서 즉시 렌더링

[트렌드 타입 탭 전환]
  └─ displayCurrentTabData()          → currentTrendType에 따라 rising_star/new_entry/rank_drop 선택

[Insights 버튼 클릭]
  ├─ loadTrendAnalysisReport()        → window.trendInsights 있으면 즉시, 없으면 POST /dashboard/trend
  └─ renderTrendAnalysisReport()      → Section 1(MY BRAND) + Section 2(Material/Mood) + Section 3(세그먼트 상세)

[Compare 버튼 클릭 (29CM 전용)]
  ├─ GET /dashboard/compare/29cm/brands?company_name=XXX   → 자사몰 brand_id + 경쟁사 브랜드 목록
  ├─ POST /dashboard/compare/29cm/search (get_run_id_only)  → 최신 run_id 조회
  ├─ POST /dashboard/compare/29cm/search (전체 데이터)       → 모든 브랜드 검색 결과 캐싱
  └─ selectOwnCompanyTab()            → 자사몰 탭 선택, 카드 렌더링

[Compare 리뷰 모달]
  └─ GET /dashboard/compare/29cm/reviews?item_id=XXX        → 상품 리뷰 10개
```

---

## 3. CSS 변수 / 디자인 토큰

트렌드 페이지는 **라이트 테마** (bg: `#f8fafc`)이다. 다크 테마가 아님에 주의.

```css
/* 트렌드 페이지 (inline <style> in trend_page.html) */
/* 배경색 — #f8fafc는 body가 아닌 .trend-sticky-header의 inline style로 적용됨 */
.trend-sticky-header    { background: #f8fafc; }
.trend-table            { background: #ffffff; }
.trend-table-section    { background: #ffffff; border: 1px solid #E9ECEF; }

/* 텍스트 */
--title-color:          #212529;     /* 26px, font-weight:700 */
--subtitle-color:       #4B5563;     /* gray-600, 테이블 헤더 */
--muted-color:          #6B7280;     /* gray-500, 업데이트 정보 */
--body-color:           #495057;     /* gray-700 */

/* 탭 */
.trend-tab-btn          { bg: #F8F9FA, border: #E9ECEF, color: #212529 }
.trend-tab-btn.active   { bg: #212529, color: #ffffff }
.trend-type-tabs        { bg: #E5E7EB, border-radius: 12px, padding: 4px }
.trend-type-tab-btn     { color: #6B7280, font-size: 15px, font-weight: 600 }
.trend-type-tab-btn.active { bg: #ffffff, color: #212529, shadow: 0 1px 3px rgba(0,0,0,0.1) }

/* Compare 사이드바 */
.compare-tab-btn.active { bg: #212529, color: #ffffff }
.compare-best-badge     { gradient: #FF6B6B → #FF8E53, pulse-glow animation }
.compare-card-rank      { bg: #212529, color: #ffffff }

/* 랭크 변화 */
.trend-rank-change.up   { color: #DC3545 (red) }
.trend-rank-change.down { color: #0066CC (blue) }
```

---

## 4. 레이아웃 구조

```
body
└── .common-header (sticky, top:0, z-index:1000)    ← 공통 헤더 (common.js)
    └── 햄버거 메뉴, 로고, 계정 선택 등

└── .trend-page-wrapper (max-width:1400px, margin:0 auto, padding:0 24px 8px 24px)
    └── .trend-sticky-header (position:sticky, top:0, z-index:100, bg:#f8fafc)
        ├── .trend-page-header (margin-bottom:8px)
        │   └── h1#trendPageTitle (26px, font-weight:700, color:#212529)
        │       └── span.trend-page-update-info (12px, color:#6B7280, margin-left:auto)
        │
        ├── .trend-tabs-wrapper (overflow-x:auto, scrollbar-width:none)
        │   └── .trend-tabs#trendTabs (display:flex, gap:8px)
        │       ├── button.trend-tab-btn[data-tab="전체"] (10px 20px, border-radius:8px)
        │       ├── button.trend-tab-btn[data-tab="의류"]
        │       └── ... (동적 생성)
        │
        └── .trend-type-tabs-wrapper (margin:8px 0)
            └── .trend-type-tabs#trendTypeTabs (flex, bg:#E5E7EB, border-radius:12px, padding:4px)
                ├── button.trend-type-tab-btn.active[data-type="risingStar"]  "급상승"
                ├── button.trend-type-tab-btn[data-type="newEntry"]           "신규 진입"
                └── button.trend-type-tab-btn[data-type="rankDrop"]           "순위 하락"

    └── .trend-table-section (bg:#fff, border:1px solid #E9ECEF, margin-bottom:32px)
        └── .trend-table-container (overflow:visible)
            └── #trendTableContent
                └── .trend-table-wrapper (동적 생성)
                    ├── .trend-table-scroll-container (overflowX:auto)
                    │   └── table.trend-table
                    │       ├── thead → tr → th × 6~7 (랭킹, 썸네일, 브랜드, 상품명, [순위변화], 이번주순위, 지난주순위)
                    │       └── tbody (초기 4행 → "더보기" 클릭 시 전체, maxHeight:600px)
                    └── .trend-pagination-container
                        ├── button.trend-show-more-btn   "더보기 (N개 더)"
                        └── button.trend-collapse-btn     "접기" (display:none)

<!-- 고정 버튼 (오른쪽 하단) -->
├── #trendCompareToggleBtn.trend-compare-toggle-btn   "Compare" (29CM 전용)
└── #trendAnalysisToggleBtn.trend-analysis-toggle-btn  "Insights"

<!-- Insight 사이드바 (오른쪽 슬라이드) -->
└── #trendAnalysisSidebar.trend-analysis-sidebar-wrapper.hidden
    ├── .trend-analysis-header-bar
    │   ├── .trend-analysis-header-title  "트렌드 데이터 분석"
    │   └── #closeTrendAnalysisSidebarBtn  "×"
    └── .trend-analysis-sidebar-content
        ├── .trend-analysis-header
        │   ├── h3#trendAnalysisTitle  "29CM N월 N주차 트렌드 데이터 분석"
        │   └── span#trendAnalysisCreatedAt  "생성일: -"
        └── #trendAnalysisContent
            └── .trend-analysis-report-container (동적 생성)
                ├── Section 1: .trend-section1-container → MY BRAND 카드 + 자사몰 썸네일
                ├── Section 2: Material(소재) + Mood(무드&스타일) 카드
                └── Section 3: 세그먼트 탭 기반 UI (급상승/신규/하락 + 카테고리별 썸네일)

<!-- Compare 사이드바 (오른쪽 슬라이드, 29CM 전용) -->
└── #compareSidebar.trend-analysis-sidebar-wrapper.hidden
    ├── .trend-analysis-header-bar
    │   ├── .trend-analysis-header-title  "29CM 경쟁사 판매순 TOP 20"
    │   └── #closeCompareSidebarBtn  "×"
    └── .trend-analysis-sidebar-content
        ├── .compare-info-bar#compareInfoBar
        │   └── .compare-info-text#compareInfoText  "2026년 02-28 오전 9시 기준 - 판매순 TOP20"
        ├── .compare-tabs-wrapper
        │   └── .compare-tabs#compareTabs (동적 생성)
        │       ├── button.compare-tab-btn.active[data-brand-id="own"]  "piscess"
        │       ├── button.compare-tab-btn[data-brand-id="123"]  "경쟁브랜드A"
        │       └── ...
        └── .compare-content-wrapper
            ├── .compare-cards-container#compareCardsContainer
            │   └── .compare-cards-grid (grid: 5col × 2row, gap:12px)
            │       └── .compare-card × 10
            │           ├── .compare-card-rank  "1"
            │           ├── .compare-best-badge  "전체 5위" (베스트 매칭 시)
            │           ├── .compare-card-image → img
            │           ├── .compare-card-info
            │           │   ├── .compare-card-brand  "브랜드명"
            │           │   ├── .compare-card-name  "상품명"
            │           │   ├── .compare-card-price  "39,000원"
            │           │   └── .compare-card-like  "❤️ 1,234"
            │           └── .compare-card-actions
            │               ├── a.compare-card-link-btn  "바로가기" (target=_blank)
            │               └── button.compare-card-review-btn  "최신 리뷰 10"
            └── .compare-pagination#comparePagination (display:none)
                ├── button#comparePrevBtn  "←"
                ├── span#comparePageInfo  "1 / 2"
                └── button#compareNextBtn  "→"

<!-- 리뷰 모달 (29CM 전용) -->
└── #compareReviewModal.compare-review-modal (display:none)
    ├── .compare-review-modal-overlay
    └── .compare-review-modal-content
        ├── .compare-review-modal-header
        │   ├── h3#compareReviewModalTitle  "상품 리뷰"
        │   └── #closeCompareReviewModalBtn  "×"
        └── #compareReviewModalBody
            └── .compare-review-list
                └── .compare-review-item × N
                    ├── .compare-review-header
                    │   ├── .compare-review-rating  "⭐⭐⭐⭐⭐"
                    │   └── .compare-review-date  "2026-02-28"
                    ├── .compare-review-option  "옵션: 블랙/M"
                    └── .compare-review-content  "리뷰 내용..."
```

---

## 5. JS 전역 상태 변수

### trend_page.js

```javascript
// ─── 페이지 타입 ───
const PAGE_TYPE = (typeof pageType !== 'undefined' ? pageType : '29cm').toLowerCase();
const IS_ABLY = PAGE_TYPE === 'ably';

// ─── API 엔드포인트 ───
const API_ENDPOINT = IS_ABLY ? '/dashboard/trend/ably' : '/dashboard/trend';
const TABS_ENDPOINT = IS_ABLY ? '/dashboard/trend/ably/tabs' : '/dashboard/trend/tabs';

// ─── 탭 상태 ───
let currentTab = IS_ABLY ? "상의" : "전체";           // 현재 카테고리 탭
let availableTabs = IS_ABLY ? ["상의"] : ["전체"];     // 사용 가능한 카테고리 목록
let allTabsData = {};                                   // 모든 탭 데이터 메모리 캐시
// 구조: { "전체": { rising_star: [], new_entry: [], rank_drop: [] }, "의류": { ... } }

let currentWeek = "";                                   // 현재 주차 (e.g., "2026W09_WEEKLY_...")
let currentTrendType = "risingStar";                    // "risingStar" | "newEntry" | "rankDrop"

// ─── Insight 관련 (window 전역) ───
window.trendInsights = null;    // { analysis_report: string, generated_at: string }
window.allTabsData = null;      // allTabsData의 전역 참조 (Section 3 썸네일용)
```

### compare_page.js (IIFE 스코프)

```javascript
// ─── 전역 변수 (IIFE 내부) ───
let currentCompanyName = null;        // URL의 company_name 파라미터
let currentRunId = null;              // 최신 run_id (e.g., "2026W09_WEEKLY_...")
let currentBrandId = null;            // 현재 선택된 브랜드 ID
let ownBrandId = null;                // 자사몰 브랜드 ID (company_info.brand_id_29cm)
let allBrands = [];                   // 경쟁사 브랜드 목록 [{brand_id, brand_name, display_name, sort_order}]
let currentResults = [];              // 현재 탭의 상품 목록
let allResultsCache = {};             // 모든 브랜드 데이터 캐시 { "company_runId": { "brandId": [...] } }
let snapshotCreatedAt = null;         // 스냅샷 수집 시간 (ISO string)
let currentPage = 1;                  // 현재 페이지 (페이지네이션)
const ITEMS_PER_PAGE = 10;            // 페이지당 아이템 수
```

---

## 6. HTML 요소 맵

### 메인 페이지 요소

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#trendPageTitle` | h1 | 페이지 제목 "29CM N월 N주차 트렌드" | "29CM 트렌드" |
| `.trend-page-update-info` | span | "↻ 매주 월요일 오전 9시 업데이트" | - |
| `#trendTabs` | div | 카테고리 탭 컨테이너 (동적 생성) | 빈 div |
| `.trend-tab-btn` | button | 카테고리 탭 버튼 (전체, 의류, 신발 등) | .active on "전체" |
| `#trendTypeTabs` | div | 트렌드 타입 탭 컨테이너 | - |
| `.trend-type-tab-btn[data-type="risingStar"]` | button | "급상승" 탭 | .active |
| `.trend-type-tab-btn[data-type="newEntry"]` | button | "신규 진입" 탭 | - |
| `.trend-type-tab-btn[data-type="rankDrop"]` | button | "순위 하락" 탭 | - |
| `#trendTableContent` | div | 테이블 렌더링 영역 | "데이터를 불러오는 중..." |
| `.trend-table` | table | 랭킹 테이블 (동적 생성) | - |
| `.trend-show-more-btn` | button | "더보기 (N개 더)" 버튼 | 4개 초과 시 표시 |
| `.trend-collapse-btn` | button | "접기" 버튼 | display:none |

### Insights 사이드바 요소

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#trendAnalysisToggleBtn` | div | Insights 열기 버튼 (고정) | "Insights" + NEW 배지 |
| `#trendAnalysisSidebar` | div | Insight 사이드바 래퍼 | .hidden |
| `#closeTrendAnalysisSidebarBtn` | button | 사이드바 닫기 "×" | - |
| `#trendAnalysisTitle` | h3 | "29CM N월 N주차 트렌드 데이터 분석" | - |
| `.trend-analysis-update-info` | span | "매주 월요일 오전 7시5분 업데이트" | - |
| `#trendAnalysisCreatedAt` | span | "생성일: 2026. 2. 28 오전 09:05" | "생성일: -" |
| `#trendAnalysisContent` | div | 분석 리포트 본문 영역 | "분석 데이터를 불러오는 중..." |

### Compare 사이드바 요소 (29CM 전용)

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#trendCompareToggleBtn` | div | Compare 열기 버튼 (고정) | "Compare" + NEW 배지 |
| `#compareSidebar` | div | Compare 사이드바 래퍼 | .hidden |
| `#closeCompareSidebarBtn` | button | 사이드바 닫기 "×" | - |
| `#compareInfoBar` | div | 기준 정보 영역 | - |
| `#compareInfoText` | div | "2026년 02-28 오전 9시 기준 - 판매순 TOP20" | "데이터를 불러오는 중..." |
| `#compareTabs` | div | 브랜드 탭 컨테이너 (동적 생성) | 빈 div |
| `.compare-tab-btn` | button | 브랜드 탭 (자사몰 + 경쟁사) | .active on 자사몰 |
| `#compareCardsContainer` | div | 상품 카드 영역 | "데이터를 불러오는 중..." |
| `.compare-cards-grid` | div | 카드 그리드 (5col × 2row) | 동적 생성 |
| `.compare-card` | div | 개별 상품 카드 | 동적 생성 |
| `.compare-card-review-btn` | button | "최신 리뷰 10" 버튼 | data-item-id, data-product-name |
| `#comparePagination` | div | 페이지네이션 | display:none |
| `#comparePrevBtn` | button | "←" 이전 페이지 | - |
| `#comparePageInfo` | span | "1 / 2" | "1 / 1" |
| `#compareNextBtn` | button | "→" 다음 페이지 | - |

### 리뷰 모달 요소 (29CM 전용)

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#compareReviewModal` | div | 리뷰 모달 래퍼 | display:none |
| `.compare-review-modal-overlay` | div | 모달 배경 오버레이 | 클릭 시 모달 닫기 |
| `#compareReviewModalTitle` | h3 | 상품명 | "상품 리뷰" |
| `#closeCompareReviewModalBtn` | button | 모달 닫기 "×" | - |
| `#compareReviewModalBody` | div | 리뷰 목록 영역 | - |

---

## 7. 섹션별 상세 스펙

### 7-1. 29CM 트렌드 카드 섹션 (메인 영역)

#### 카테고리 탭

```
┌────────────────────────────────────────────────────────────────────────┐
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────┐           │
│  │ 전체 │ │ 상의 │ │ 바지 │ │ 아우터│ │ 니트웨어  │ │ 원피스│  ...     │ ← 가로 스크롤
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘ └──────┘           │
│  ■ active                                                             │
│  bg:#212529, color:#fff              bg:#F8F9FA, border:#E9ECEF       │
└────────────────────────────────────────────────────────────────────────┘
```

- 탭 목록은 `GET /dashboard/trend/tabs` API로 동적 조회
- 탭 클릭 시 `switchTab(tabName)` → **API 호출 없이** `allTabsData[tabName]`에서 즉시 렌더링
- 탭 버튼: `padding: 10px 20px`, `border: 2px solid #E9ECEF`, `border-radius: 8px`, `font-size: 14px`

#### 트렌드 타입 탭 (Segmented Control)

```
┌──────────────────────────────────────────────────┐
│  ┌────────────┐┌────────────┐┌────────────┐      │  bg: #E5E7EB
│  │  급상승    ││  신규 진입  ││  순위 하락  │      │  border-radius: 12px
│  │ (active)   ││            ││            │      │  padding: 4px
│  │ bg: #fff   ││ color:gray ││ color:gray │      │
│  │ shadow:sm  ││            ││            │      │
│  └────────────┘└────────────┘└────────────┘      │
└──────────────────────────────────────────────────┘
```

- 3개 버튼이 동일 비율로 분할 (`flex: 1`)
- active 버튼: `bg: #ffffff`, `color: #212529`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- inactive 버튼: `bg: transparent`, `color: #6B7280`
- `data-type` 값: `"risingStar"`, `"newEntry"`, `"rankDrop"`

#### 랭킹 테이블

```
┌──────┬──────────┬──────────┬─────────────────┬──────────┬──────────┬──────────┐
│ 랭킹 │  썸네일  │  브랜드  │     상품명      │ 순위변화 │ 이번주   │ 지난주   │
│      │          │  ↕ sort  │                 │  ↕ sort  │  ↕ sort  │  ↕ sort  │
├──────┼──────────┼──────────┼─────────────────┼──────────┼──────────┼──────────┤
│전체  │ ┌──────┐ │ PISCESS  │ 와이드 팬츠...  │  ▲ 15   │   3      │   18     │
│ 3위  │ │  img │ │          │                 │ (red)    │ (22px)   │ (22px)   │
│      │ └──────┘ │          │                 │          │          │          │
├──────┼──────────┼──────────┼─────────────────┼──────────┼──────────┼──────────┤
│ ...  │ ...      │ ...      │ ...             │ ...      │ ...      │ ...      │
├──────┴──────────┴──────────┴─────────────────┴──────────┴──────────┴──────────┤
│                    [ 더보기 (16개 더) ]                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

**테이블 헤더 열 구조:**

| 열 | key | sortable | 조건 |
|----|-----|----------|------|
| 랭킹 | ranking | No | 항상 표시 |
| 썸네일 | thumbnail | No | 항상 표시 (클릭 → item_url) |
| 브랜드 | brand | Yes (알파벳순) | 항상 표시 |
| 상품명 | product | No | 항상 표시 |
| 순위변화 | rank_change | Yes | **급상승/순위하락 탭에서만** (신규진입 숨김) |
| 이번주 순위 | current_rank | Yes | 항상 표시 |
| 지난주 순위 | previous_rank | Yes | 항상 표시 (모바일 숨김, 신규진입 시 "순위없음") |

**초기 표시:** 4행만 표시 → "더보기" 클릭 시 전체 표시 (maxHeight: 600px, overflow-y: auto, sticky thead)

**정렬 로직:**
- 급상승: `Rank_Change DESC` (순위변화 큰 것부터)
- 신규진입: `This_Week_Rank ASC` (순위 낮은 것부터)
- 순위하락: `Rank_Change ASC` (29CM은 음수값이므로 작은 것 = 가장 많이 하락)

**썸네일 셀:**
- 이미지: 링크(`<a>`)로 감싸서 `item_url`로 연결 (`target="_blank"`)
- class: `.trend-thumbnail-cell`
- onerror: base64 빈 SVG 이미지로 대체

**순위변화 셀:**
- 상승: `▲` + 숫자 (red, `.trend-rank-change.up`)
- 하락: `▼` + 숫자 (blue, `.trend-rank-change.down`)
- 순위 숫자: `font-size: 22px`, `font-weight: 700`

**데이터 아이템 구조 (API 응답):**

```json
{
  "Ranking": "전체 3위",
  "Brand_Name": "PISCESS",
  "Product_Name": "와이드 핏 세미 크롭 데님 팬츠",
  "Rank_Change": 15,
  "This_Week_Rank": 3,
  "Last_Week_Rank": 18,
  "thumbnail_url": "https://img.29cm.co.kr/...",
  "price": 39000,
  "item_url": "https://product.29cm.co.kr/catalog/123456",
  "current_run_id": "2026W09_WEEKLY_..."
}
```

---

### 7-2. Insight 섹션 (AI 분석 사이드바)

#### 사이드바 열기/닫기

- **열기**: `#trendAnalysisToggleBtn` 클릭 → `.hidden` 제거, `.active` 추가
- **닫기**: `#closeTrendAnalysisSidebarBtn` 클릭 또는 ESC 키 → `.active` 제거, 300ms 후 `.hidden` 추가
- **NEW 배지**: `sessionStorage('trend_insights_viewed')` 미설정 시 `.btn-new-badge` 추가, 열면 제거
- **상호 배타**: Insight와 Compare 사이드바는 동시에 열 수 없음 (Compare 열 때 Insight 닫기)

#### 데이터 소스

- `window.trendInsights` (초기 `loadAllTabsData()`에서 저장됨)
- 없으면 `POST /dashboard/trend` 재호출
- **GCS 스냅샷 경로**: `ai-reports/trend/29cm/{company_name}/{YYYY}-{MM}-{week_of_month:02d}/snapshot.json.gz`
- demo 계정은 piscess로 매핑

#### AI 리포트 구조 (analysis_report 마크다운)

```
## Section 1. MY BRAND
- 자사몰 상품이 베스트에 포함된 경우 분석
- company_name 기반 필터링 (filter_ai_report_by_company)

## Section 2. 트렌드 키워드
**Material (소재):** 린넨, 코튼 등 소재 트렌드
**Mood (무드 & 스타일):** 미니멀, 캐주얼 등 스타일 트렌드

## Section 3. Segment Deep Dive
### 급상승 (Rising Star) 🔥
**상의:** 카테고리별 상세 분석
**바지:** ...
### 신규 진입 (New Entry) 🚀
...
### 순위 하락 (Rank Drop) 📉
...
```

#### 렌더링 파이프라인

```
renderTrendAnalysisReport(insights, createdAtElement)
  ├─ parseAnalysisReportSections(analysisText) → { section1, section2, section3 }
  │
  ├─ Section 1: renderSection1AsCard(section1)
  │   ├─ 마크다운 → HTML (marked.js + DOMPurify)
  │   ├─ MY BRAND 카드 + 자사몰 상품 썸네일
  │   └─ getCompanyProducts() → brandMapping 기반 필터링
  │
  ├─ Section 2: parseSection2IntoMaterialAndTPO(section2)
  │   ├─ { material, mood } 추출
  │   └─ renderSection2AsCards(section2Data) → Material 카드 + Mood 카드
  │
  └─ Section 3: parseSection3BySegment(section3)
      ├─ { rising_star, new_entry, rank_drop } 추출
      └─ renderSection3WithTabs(section3Data) → 탭 기반 UI + 카테고리별 썸네일 그리드
```

#### Section 3 썸네일 그리드

- `createThumbnailGridFromProducts(products, trendType)` → `.trend-thumbnails-grid` (그리드)
- 카테고리별 최대 6개 상품 썸네일 표시
- 각 썸네일 카드 (`.trend-thumbnail-card`):
  - 이미지 (`.trend-thumbnail-image`, 1:1 비율)
  - 순위 배지 (`.trend-thumbnail-rank`)
  - 브랜드명 (`.trend-thumbnail-brand`)
  - 상품명 (`.trend-thumbnail-name`)
  - 순위변화 (`.trend-thumbnail-rank-change`)
  - 가격 (`.trend-thumbnail-price`)

#### 라이브러리 의존성

- **marked.js**: `https://cdn.jsdelivr.net/npm/marked/marked.min.js` (마크다운 → HTML)
- **DOMPurify**: `https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js` (XSS 방지)

---

### 7-3. Compare 섹션 (경쟁사 비교 사이드바, 29CM 전용)

#### 사이드바 열기/닫기

- **열기**: `#trendCompareToggleBtn` 클릭 → Insight 사이드바 닫기 → `.hidden` 제거, 10ms 후 `.active` 추가
- **닫기**: `#closeCompareSidebarBtn` 클릭 → `.active` 제거, 300ms 후 `.hidden` 추가
- **NEW 배지**: `sessionStorage('trend_compare_viewed')` 미설정 시 `.btn-new-badge` 추가

#### 데이터 로드 플로우

```
openCompareSidebar()
  └─ loadCompareData()
      ├─ 1. GET /dashboard/compare/29cm/brands?company_name=piscess
      │     → ownBrandId, allBrands[]
      ├─ 2. POST /dashboard/compare/29cm/search { get_run_id_only: true }
      │     → currentRunId
      ├─ 3. updateInfoBar() → 수집 시간 표시
      ├─ 4. renderTabs() → 자사몰 + 경쟁사 탭 동적 생성
      ├─ 5. loadAllSearchResults() → POST /dashboard/compare/29cm/search { company_name, run_id }
      │     → allResultsCache에 전체 저장
      └─ 6. selectOwnCompanyTab() → 첫 번째 탭(자사몰) 선택 → 카드 렌더링
```

#### 브랜드 탭

```
┌──────────────────────────────────────────────────────────────────┐
│ ┌────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│ │piscess │ │ 브랜드A │ │ 브랜드B │ │ 브랜드C │ ...              │ ← 가로 스크롤
│ │(active)│ │         │ │         │ │         │                  │
│ └────────┘ └─────────┘ └─────────┘ └─────────┘                  │
│  bg:#212529            bg:#fff, border:#DEE2E6                   │
└──────────────────────────────────────────────────────────────────┘
```

- 첫 번째 탭: 자사몰 (`ownBrandId` 또는 "own")
- 나머지 탭: 경쟁사 브랜드 (`allBrands[]` 순서, `sort_order ASC`)
- 탭 클릭 → `loadSearchResults(brandId)` → 캐시 우선 → API 폴백

#### 상품 카드 그리드

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│ │ 1    │  │ 2    │  │ 3    │  │ 4    │  │ 5    │ ← 5열 × 2행       │
│ │ ┌──┐ │  │ ┌──┐ │  │ ┌──┐ │  │ ┌──┐ │  │ ┌──┐ │   grid: 5col     │
│ │ │img│ │  │ │img│ │  │ │img│ │  │ │img│ │  │ │img│ │   gap: 12px     │
│ │ └──┘ │  │ └──┘ │  │ └──┘ │  │ └──┘ │  │ └──┘ │                   │
│ │브랜드│  │브랜드│  │브랜드│  │브랜드│  │브랜드│                   │
│ │상품명│  │상품명│  │상품명│  │상품명│  │상품명│                   │
│ │39,000│  │45,000│  │29,000│  │55,000│  │33,000│                   │
│ │바로가기│  │바로가기│  │바로가기│  │바로가기│  │바로가기│           │
│ │리뷰10│  │리뷰10│  │리뷰10│  │리뷰10│  │리뷰10│                   │
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                   │
│ ... (6~10번 카드, 2번째 행)                                         │
│                                                                     │
│              [ ← ]  1 / 2  [ → ]                                    │ ← 페이지네이션
└─────────────────────────────────────────────────────────────────────┘
```

- 페이지당 10개 (`ITEMS_PER_PAGE = 10`)
- TOP 20이므로 최대 2페이지
- 베스트 배지: 상품이 29CM 베스트 랭킹에 포함된 경우 `"전체 5위"` 또는 `"카테고리명 3위"` 표시
  - 그라데이션 배경: `linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)`
  - `pulse-glow` 애니메이션

#### 상품 카드 데이터 구조

```json
{
  "rank": 1,
  "item_id": 2345678,
  "brand_name": "PISCESS",
  "product_name": "와이드 핏 세미 크롭 데님 팬츠",
  "price": 39000,
  "discount_rate": 10,
  "like_count": 1234,
  "review_count": 56,
  "review_score": 4.8,
  "thumbnail_url": "https://img.29cm.co.kr/...",
  "item_url": "https://product.29cm.co.kr/catalog/2345678",
  "best_rank": 5,
  "best_category": "전체",
  "reviews": [
    {
      "rating": 5,
      "option": "블랙/M",
      "created_at": "2026-02-20T12:00:00",
      "content": "사이즈 딱 맞고 핏이 예뻐요..."
    }
  ]
}
```

#### 리뷰 모달

- `openReviewModal(itemId, productName)` → `GET /dashboard/compare/29cm/reviews?item_id=XXX`
- 별점: `⭐` × rating 개수
- 옵션: "옵션: 블랙/M"
- 내용: 최대 200자 (서버에서 잘림 + "...")
- 날짜: `created_at` 표시
- **모달 닫기**: "×" 버튼 또는 오버레이 클릭

---

## 8. 핵심 함수 흐름

### trend_page.js 함수 트리

```
$(document).ready
  ├─ loadTabs()
  │   └─ renderTabs()
  ├─ setupTrendTypeTabs()
  ├─ setupTrendAnalysisToggle()
  │   ├─ addNewBadgeToButton()
  │   ├─ toggleBtn.click → loadTrendAnalysisReport()
  │   │                   └─ renderTrendAnalysisReport()
  │   │                       ├─ parseAnalysisReportSections()
  │   │                       ├─ renderSection1AsCard()
  │   │                       │   ├─ marked.parse() + DOMPurify.sanitize()
  │   │                       │   └─ getCompanyProducts() → createThumbnailGridFromProducts()
  │   │                       ├─ parseSection2IntoMaterialAndTPO()
  │   │                       │   └─ renderSection2AsCards()
  │   │                       └─ parseSection3BySegment()
  │   │                           └─ renderSection3WithTabs()
  │   │                               └─ renderSection3Thumbnails()
  │   │                                   └─ renderThumbnailsForSegment()
  │   │                                       └─ getProductsByCategory()
  │   │                                           └─ createThumbnailGridFromProducts()
  │   └─ closeBtn.click → sidebar.remove('active')
  └─ loadAllTabsData()
      ├─ getSelectedCompany()      → URL param / window.selectedCompany / accountFilter
      ├─ POST /dashboard/trend     → { tab_names, trend_type:'all', company_name }
      ├─ updatePageTitle()         → parseWeekInfo() → "29CM 2026년 2월 4주차 트렌드"
      └─ displayCurrentTabData()
          └─ createTableWithPagination()
              ├─ renderTableRows()
              └─ showMoreBtn.click → reRenderTable() (scroll 활성화)

switchTab(tabName)               → allTabsData[tabName] 즉시 렌더링

parseWeekInfo(currentWeek)       → { year, month, week } (ISO 8601 계산)
updateTrendAnalysisTitle()       → 사이드바 제목 업데이트
refreshTrendAnalysisTitle()      → 사이드바 열릴 때 제목 갱신
showToast(message, type)         → 토스트 알림
removeNewBadgeFromButton()       → 버튼의 NEW 배지 제거 유틸리티
createEmptySection1Container()   → MY BRAND 데이터 없을 때 빈 Section 1 컨테이너 생성
removeProductNamesAndReplaceWithThumbnails() → 상품명 텍스트를 썸네일로 교체하는 유틸리티
escapeRegex()                    → 정규식 특수문자 이스케이프 유틸리티
getActiveTrendType()             → 현재 활성 트렌드 타입(risingStar/newEntry/rankDrop) getter
renderRisingStarTable()          → 급상승 테이블 렌더링
renderNewEntryTable()            → 신규 진입 테이블 렌더링
renderRankDropTable()            → 순위 하락 테이블 렌더링
createSection2Card()             → Section 2 Material/Mood 카드 빌더 헬퍼
renderSection3SegmentContent()   → Section 3 세그먼트별 콘텐츠 렌더링
renderSection3ThumbnailsForSegment() → Section 3 세그먼트별 썸네일 렌더링
```

### compare_page.js 함수 트리

```
init()
  ├─ currentCompanyName = URL param 'company_name'
  ├─ addNewBadgeToButton(compareToggleBtn)
  └─ setupEventListeners()
      ├─ compareToggleBtn.click → openCompareSidebar()
      │   └─ loadCompareData()
      │       ├─ GET /compare/29cm/brands          → ownBrandId, allBrands
      │       ├─ POST /compare/29cm/search (run_id) → currentRunId
      │       ├─ updateInfoBar()
      │       ├─ renderTabs()                       → 자사몰 + 경쟁사 탭
      │       ├─ loadAllSearchResults()             → 전체 캐싱
      │       └─ selectOwnCompanyTab()
      │           └─ loadSearchResults(brandId)
      │               └─ renderCards()
      │                   └─ updatePagination()
      ├─ closeCompareBtn.click → closeCompareSidebar()
      ├─ closeReviewModalBtn.click → closeReviewModal()
      ├─ comparePrevBtn.click → currentPage-- → renderCards()
      └─ compareNextBtn.click → currentPage++ → renderCards()

selectTab(brandId, displayName)  → loadSearchResults(brandId)
openReviewModal(itemId, name)    → GET /compare/29cm/reviews?item_id=XXX
getCompanyDisplayName()          → 업체 표시명 반환 헬퍼
getWeekNumber()                  → 주차 번호 계산 유틸리티
```

---

## 9. API 엔드포인트 레퍼런스

### 9-1. GET /dashboard/trend/tabs

사용 가능한 카테고리 탭 목록 조회.

**Request:**
```
GET /dashboard/trend/tabs
```

**Response (200):**
```json
{
  "status": "success",
  "tabs": ["전체", "니트웨어", "바지", "상의", "셋업", "스커트", "아우터", "언더웨어", "원피스", "점프수트", "홈웨어"]
}
```

**참고**: "전체"가 항상 첫 번째. BigQuery `platform_29cm_best` 테이블의 `best_page_name` DISTINCT 값.

---

### 9-2. POST /dashboard/trend

29CM 트렌드 데이터 조회 (GCS 스냅샷 우선).

**Request:**
```json
{
  "tab_names": ["전체", "상의", "바지"],
  "trend_type": "all",
  "company_name": "piscess"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `tab_names` | string[] | 권장 | 여러 탭을 한 번에 요청 |
| `tab_name` | string | 하위 호환 | 단일 탭 (기본: "전체") |
| `trend_type` | string | No | "all" / "rising" / "new_entry" / "rank_drop" (기본: "all") |
| `company_name` | string | Yes | 업체명 (소문자). demo → piscess 매핑 |

**Response (200) - 여러 탭:**
```json
{
  "status": "success",
  "current_week": "2026W09_WEEKLY_2026-02-24_17-05-13",
  "tabs_data": {
    "전체": {
      "rising_star": [
        {
          "Ranking": "전체 3위",
          "Brand_Name": "PISCESS",
          "Product_Name": "와이드 핏 세미 크롭 데님 팬츠",
          "Rank_Change": 15,
          "This_Week_Rank": 3,
          "Last_Week_Rank": 18,
          "thumbnail_url": "https://img.29cm.co.kr/next-product/2024/...",
          "price": 39000,
          "item_url": "https://product.29cm.co.kr/catalog/2345678",
          "current_run_id": "2026W09_WEEKLY_2026-02-24_17-05-13"
        }
      ],
      "new_entry": [
        {
          "Ranking": "전체 12위",
          "Brand_Name": "ANOTHER BRAND",
          "Product_Name": "오버핏 코튼 셔츠",
          "Rank_Change": null,
          "This_Week_Rank": 12,
          "Last_Week_Rank": null,
          "thumbnail_url": "https://img.29cm.co.kr/...",
          "price": 45000,
          "item_url": "https://product.29cm.co.kr/catalog/...",
          "current_run_id": "2026W09_WEEKLY_..."
        }
      ],
      "rank_drop": [
        {
          "Ranking": "전체 45위",
          "Brand_Name": "DROP BRAND",
          "Product_Name": "슬림 스트레이트 진",
          "Rank_Change": -20,
          "This_Week_Rank": 45,
          "Last_Week_Rank": 25,
          "thumbnail_url": "https://img.29cm.co.kr/...",
          "price": 55000,
          "item_url": "https://product.29cm.co.kr/catalog/...",
          "current_run_id": "2026W09_WEEKLY_..."
        }
      ]
    },
    "상의": { "rising_star": [], "new_entry": [], "rank_drop": [] }
  },
  "insights": {
    "analysis_report": "## Section 1. MY BRAND\n\n**파이시스(PISCESS)**의 '와이드 핏 세미 크롭 데님 팬츠'가...\n\n## Section 2. 트렌드 키워드\n\n**Material (소재):** 린넨, 코튼 혼방...\n**Mood (무드 & 스타일):** 미니멀 캐주얼...\n\n## Section 3. Segment Deep Dive\n\n### 급상승 (Rising Star) 🔥\n...",
    "generated_at": "2026-02-24T08:05:00Z"
  }
}
```

**Response (404) - 스냅샷 없음:**
```json
{
  "status": "error",
  "message": "해당 업체의 트렌드 데이터가 아직 준비되지 않았습니다."
}
```

**GCS 스냅샷 경로 규칙:**
```
ai-reports/trend/29cm/{company_name}/{YYYY}-{MM}-{week_of_month:02d}/snapshot.json.gz
```
- `{week_of_month:02d}`: ISO 주차 시작일(월요일)의 해당 월 내 주 번호 (01~05, 2자리 zero-padding)
- gzip 압축된 JSON
- demo → piscess 매핑

---

### 9-3. POST /dashboard/trend/check_new

새로운 트렌드 데이터 유무 확인.

**Request:**
```json
{
  "last_viewed_29cm": "2026W08_WEEKLY_...",
  "last_viewed_ably": "2026W08_WEEKLY_..."
}
```

**Response (200):**
```json
{
  "status": "success",
  "current_29cm_week": "2026W09_WEEKLY_...",
  "current_ably_week": "2026W09_WEEKLY_...",
  "has_new_29cm": true,
  "has_new_ably": false
}
```

---

### 9-4. GET /dashboard/compare/29cm/brands

경쟁사 브랜드 목록 조회 (brandId 기반).

**Request:**
```
GET /dashboard/compare/29cm/brands?company_name=piscess
```

**Response (200):**
```json
{
  "status": "success",
  "own_brand_id": 12345,
  "brands": [
    {
      "brand_id": 67890,
      "brand_name": "COMPETITOR_A",
      "display_name": "경쟁사A",
      "sort_order": 1
    },
    {
      "brand_id": 11111,
      "brand_name": "COMPETITOR_B",
      "display_name": "경쟁사B",
      "sort_order": 2
    }
  ]
}
```

**BigQuery 테이블:**
- `company_competitor_brands`: `brand_id`, `brand_name`, `display_name`, `sort_order`, `is_active`, `company_name`
- `company_info.brand_id_29cm`: 자사몰 브랜드 ID

---

### 9-5. POST /dashboard/compare/29cm/search

경쟁사 검색 결과 조회 (GCS 스냅샷 기반).

#### (A) run_id만 조회

**Request:**
```json
{
  "company_name": "piscess",
  "get_run_id_only": true
}
```

**Response (200):**
```json
{
  "status": "success",
  "run_id": "2026W09_WEEKLY_2026-02-24_17-05-13"
}
```

#### (B) 전체 데이터 조회 (모든 브랜드)

**Request:**
```json
{
  "company_name": "piscess",
  "run_id": "2026W09_WEEKLY_..."
}
```

**Response (200):**
```json
{
  "status": "success",
  "run_id": "2026W09_WEEKLY_...",
  "results": {
    "12345": [
      {
        "rank": 1,
        "item_id": 2345678,
        "brand_name": "PISCESS",
        "product_name": "와이드 핏 세미 크롭 데님 팬츠",
        "price": 39000,
        "discount_rate": 10,
        "like_count": 1234,
        "review_count": 56,
        "review_score": 4.8,
        "thumbnail_url": "https://img.29cm.co.kr/...",
        "item_url": "https://product.29cm.co.kr/catalog/2345678",
        "best_rank": 3,
        "best_category": "전체",
        "reviews": [
          {
            "rating": 5,
            "option": "블랙/M",
            "created_at": "2026-02-20T12:00:00",
            "content": "사이즈 딱 맞고 핏이 예뻐요..."
          }
        ]
      }
    ],
    "67890": [ /* 경쟁사A 상품 20개 */ ],
    "11111": [ /* 경쟁사B 상품 20개 */ ]
  },
  "created_at": "2026-02-24T09:00:00+09:00"
}
```

**`results` key 형식**: `brand_id`를 문자열 키로 사용

#### (C) 특정 브랜드 조회

**Request:**
```json
{
  "company_name": "piscess",
  "run_id": "2026W09_WEEKLY_...",
  "brand_id": 67890
}
```

**Response (200):**
```json
{
  "status": "success",
  "run_id": "2026W09_WEEKLY_...",
  "brand_id": 67890,
  "results": [
    {
      "rank": 1,
      "item_id": 3456789,
      "brand_name": "COMPETITOR_A",
      "product_name": "오버사이즈 셔츠",
      "price": 45000,
      "discount_rate": 15,
      "like_count": 890,
      "review_count": 34,
      "review_score": 4.5,
      "thumbnail_url": "https://img.29cm.co.kr/...",
      "item_url": "https://product.29cm.co.kr/catalog/3456789",
      "best_rank": null,
      "best_category": null,
      "reviews": []
    }
  ],
  "created_at": "2026-02-24T09:00:00+09:00"
}
```

#### (D) 자사몰 조회 (brand_id = "own")

**Request:**
```json
{
  "company_name": "piscess",
  "run_id": "2026W09_WEEKLY_...",
  "brand_id": "own"
}
```

서버에서 `get_own_brand_id(company_name)` → 실제 `brand_id`로 변환 후 조회.

**GCS 스냅샷 경로:**
```
ai-reports/compare/29cm/{company_name}/{YYYY}-{MM}-{week}/search_results.json.gz
```

---

### 9-6. GET /dashboard/compare/29cm/reviews

상품 리뷰 조회 (29CM 리뷰 API 프록시).

**Request:**
```
GET /dashboard/compare/29cm/reviews?item_id=2345678
```

**Response (200):**
```json
{
  "status": "success",
  "item_id": 2345678,
  "reviews": [
    {
      "rating": 5,
      "option": "블랙/M",
      "created_at": "2026-02-20T12:00:00",
      "content": "사이즈 딱 맞고 핏이 예뻐요. 소재도 좋습니다."
    },
    {
      "rating": 4,
      "option": "네이비/L",
      "created_at": "2026-02-18T15:30:00",
      "content": "전체적으로 만족하지만 색상이 사진과 약간 다릅니다."
    }
  ]
}
```

**29CM 리뷰 API 호출 상세:**
- URL: `https://review-api.29cm.co.kr/api/v4/reviews?itemId={item_id}&page=0&size=10&sort={sort_value}`
- sort_value: `""` (최신순) → 실패 시 `"BEST"` 시도
- Referer fallback: `www.29cm.co.kr/products/{id}` → `product.29cm.co.kr/catalog/{id}`
- 리뷰 내용 200자 초과 시 잘림 + "..."

---

### 9-7. POST /dashboard/trend/snapshot/create

트렌드 스냅샷 수동 생성 (관리자용).

**Request:**
```json
{
  "tab_names": ["전체", "상의", "바지", "아우터"]
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "스냅샷 생성 완료: 2026W09_WEEKLY_...",
  "run_id": "2026W09_WEEKLY_...",
  "tabs_count": 4
}
```

---

### 9-8. GET /dashboard/compare/29cm/keywords [DEPRECATED]

> **[DEPRECATED]** 이 엔드포인트는 더 이상 사용되지 않으며, `/dashboard/compare/29cm/brands`로 리다이렉트된다.

**Request:**
```
GET /dashboard/compare/29cm/keywords?company_name=piscess
```

**동작:** 서버에서 `GET /dashboard/compare/29cm/brands`로 리다이렉트 처리. 기존 키워드 기반 비교 방식에서 브랜드 기반 비교 방식으로 변경되면서 deprecated됨.

---

## 10. 주요 구현 참고사항

### 10-1. 주차 계산 (ISO 8601)

```javascript
// run_id 형식: "2026W09_WEEKLY_2026-02-24_17-05-13"
// parseWeekInfo("2026W09") → { year: 2026, month: 2, week: 4 }

function parseWeekInfo(currentWeek) {
    const weekMatch = currentWeek.match(/(\d{4})W(\d{2})/);
    if (!weekMatch) return null;
    const year = parseInt(weekMatch[1]);
    const isoWeek = parseInt(weekMatch[2]);

    // Jan 4는 항상 ISO week 1에 속함
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay();
    const mondayOfWeek1 = new Date(jan4);
    if (dayOfWeek === 0) {
        mondayOfWeek1.setDate(jan4.getDate() - 6);
    } else {
        mondayOfWeek1.setDate(jan4.getDate() - (dayOfWeek - 1));
    }

    const weekStartDate = new Date(mondayOfWeek1);
    weekStartDate.setDate(mondayOfWeek1.getDate() + (isoWeek - 1) * 7);
    const month = weekStartDate.getMonth() + 1;
    const weekOfMonth = Math.ceil(weekStartDate.getDate() / 7);

    return { year, month, week: weekOfMonth };
}
```

### 10-2. company_name 결정 우선순위

```
1순위: URL 쿼리 파라미터 ?company_name=XXX
2순위: window.selectedCompany (서버 사이드 템플릿 변수)
3순위: #accountFilter select 값 (하위 호환성)
```

### 10-3. 브랜드 매핑 (자사몰 필터링)

```javascript
const brandMapping = {
    'piscess': ['파이시스', 'PISCESS', 'piscess', 'Piscess'],
    'somewherebutter': ['썸웨어버터', 'Somewhere Butter', 'SOMEWHERE BUTTER'],
    'demo': ['파이시스', 'PISCESS', 'piscess', 'Piscess']  // demo → piscess
};
```

이 매핑은 Insight Section 1의 자사몰 상품 필터링에 사용된다. 매핑에 없는 업체는 자사몰 상품을 표시하지 않는다.

### 10-4. 29CM 외부 API 참고

| API | URL | 용도 |
|-----|-----|------|
| 검색/브랜드 상품 | `https://display-bff-api.29cm.co.kr/api/v1/listing/items?colorchipVariant=treatment` | POST, brandFacetInputs 기반 |
| 리뷰 | `https://review-api.29cm.co.kr/api/v4/reviews` | GET, itemId 기반 |

### 10-5. GCS 버킷 구조

```
gs://{GCS_BUCKET}/
  └── ai-reports/
      ├── trend/
      │   └── 29cm/
      │       └── {company_name}/
      │           └── {YYYY}-{MM}-{week_of_month:02d}/
      │               └── snapshot.json.gz         ← 트렌드 + AI Insight
      └── compare/
          └── 29cm/
              └── {company_name}/
                  └── {YYYY}-{MM}-{week}/
                      └── search_results.json.gz   ← 경쟁사 비교 데이터
```

### 10-6. 캐싱 전략

| 항목 | TTL | 위치 | 메모 |
|------|-----|------|------|
| trend 탭 목록 | 24h | 서버 (cached_query) | `get_available_tabs` |
| trend rising_star | 7일 | 서버 (cached_query) | `get_rising_star` |
| trend new_entry | 7일 | 서버 (cached_query) | `get_new_entry` |
| trend rank_drop | 7일 | 서버 (cached_query) | `get_rank_drop` |
| trend current_week | 1h | 서버 (cached_query) | `get_current_week_info` |
| compare 검색결과 | 5분 | 서버 (cached_query) | `load_search_results_from_gcs` |
| allTabsData | 세션 | 클라이언트 메모리 | 탭 전환 시 API 재호출 없음 |
| allResultsCache | 세션 | 클라이언트 메모리 | 브랜드 탭 전환 시 API 재호출 없음 |
| NEW 배지 상태 | 세션 | sessionStorage | `trend_insights_viewed`, `trend_compare_viewed` |
| 마지막 본 주차 | 영구 | localStorage | `trend_last_viewed_29cm`, `trend_last_viewed_ably` |

### 10-7. Ably vs 29CM 차이점

| 항목 | 29CM | Ably |
|------|------|------|
| API_ENDPOINT | `/dashboard/trend` | `/dashboard/trend/ably` |
| TABS_ENDPOINT | `/dashboard/trend/tabs` | `/dashboard/trend/ably/tabs` |
| 기본 탭 | "전체" | "상의" |
| Compare 사이드바 | 있음 | 없음 |
| 순위하락 Rank_Change 부호 | 음수 (하락) | 양수 (하락) |
| 상품명 길이 제한 | 없음 | 50자 (Ably만) |

---

## 11. Next.js 포팅 시 권장 구조

```
next/app/trend/
  ├── page.tsx                  ← 트렌드 메인 페이지 (SSR, company_name 검증)
  ├── components/
  │   ├── TrendHeader.tsx       ← 제목 + 주차 정보
  │   ├── CategoryTabs.tsx      ← 카테고리 탭 (전체, 상의, 바지...)
  │   ├── TrendTypeTabs.tsx     ← 급상승/신규진입/순위하락 Segmented Control
  │   ├── RankingTable.tsx      ← 랭킹 테이블 (정렬, 더보기, 페이지네이션)
  │   ├── InsightSidebar.tsx    ← Insight 사이드바
  │   │   ├── Section1Card.tsx  ← MY BRAND 카드
  │   │   ├── Section2Cards.tsx ← Material + Mood 카드
  │   │   └── Section3Tabs.tsx  ← 세그먼트 탭 + 썸네일 그리드
  │   ├── CompareSidebar.tsx    ← Compare 사이드바
  │   │   ├── BrandTabs.tsx     ← 브랜드 탭
  │   │   ├── ProductCard.tsx   ← 상품 카드
  │   │   └── ReviewModal.tsx   ← 리뷰 모달
  │   └── FloatingButtons.tsx   ← Insights + Compare 고정 버튼
  └── hooks/
      ├── useTrendData.ts       ← allTabsData 관리 (SWR 또는 React Query)
      ├── useCompareData.ts     ← Compare 데이터 관리
      └── useWeekInfo.ts        ← 주차 계산 유틸리티
```

### 상태 관리 권장

- **allTabsData**: `useSWR` 또는 `React Query`로 관리, 탭 전환은 클라이언트 사이드
- **Compare 데이터**: 별도 훅으로 관리, 사이드바 열 때만 fetch
- **Insight**: `trendInsights`를 `allTabsData`와 함께 로드
- **NEW 배지**: `useState` + `sessionStorage` 동기화
- **마지막 본 주차**: `useEffect` + `localStorage`
