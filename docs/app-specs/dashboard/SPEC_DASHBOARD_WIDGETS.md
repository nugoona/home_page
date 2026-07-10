# SPEC: 대시보드 위젯 (사이트 성과 - `/`)

> **1:1 Clone 대상** — Flask 대시보드 메인 페이지 (사이트 성과)
> **Flask 원본**: `ngn_wep/dashboard/templates/index.html` (637 lines)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py`
> **JS**: `ngn_wep/dashboard/static/js/dashboard.js` + 위젯별 개별 JS
> **URL**: `/` 또는 `/dashboard`
> **버전**: v1.3 (Batch API 통합)

---

## 페이지 개요

대시보드 메인 페이지는 Cafe24 쇼핑몰의 매출, GA4 유입, 광고 성과를 한 화면에 종합 표시하는 사이트 성과 대시보드이다.
페이지 로드 시 단일 Batch API 호출로 10개 위젯 데이터를 병렬 수집하여 렌더링한다.

### 주요 기능 요약

| # | 위젯 | 데이터 소스 | 설명 |
|---|------|-------------|------|
| 1 | **성과 요약 카드** | `performance_summary_new` | KPI 7개 + 광고 성과 테이블 |
| 2 | **카페24 매출** | `cafe24_service` | 일별/기간합 매출 테이블 |
| 3 | **GA4 소스별 유입수** | `ga4_source_summary` | 소스/국가별 유입 + 이탈률 |
| 4 | **카페24 상품 판매** | `cafe24_service` | 상품별 판매량/매출 |
| 5 | **GA4 상품별 조회수** | `viewitem_summary` | 소스/국가별 상품 조회 |
| 6 | **월별 매출/유입 차트** | `monthly_net_sales_visitors` | ApexCharts Bar+Line 차트 |
| 7 | **주요 상품 매출 비중** | `product_sales_ratio` | Top 5 수평 막대 차트 |
| 8 | **플랫폼별 매출 요약** | `platform_sales_summary` | 10개 플랫폼 매출 테이블 |
| 9 | **플랫폼별 매출 비중** | `platform_sales_ratio` | 플랫폼 비중 차트 |
| 10 | **계정별 광고 성과** | `meta_ads_insight` + `google_ads_insight` | Meta/Google 계정별 테이블 |

---

## 데이터 플로우 개요

```
[window.onload]
  ├─ initializeFilters()            → 업체/기간 필터 초기화
  │   ├─ sessionStorage 복원 (siteSelectedCompany, siteSelectedPeriod)
  │   ├─ Flatpickr 초기화 (#startDate, #endDate)
  │   ├─ 필터 이벤트 바인딩 (#accountFilter, #periodFilter)
  │   └─ fetchFilteredData()        → updateAllData() 호출
  │
  └─ updateAllData()                → 메인 데이터 로드
      ├─ window.isLoading = true
      ├─ 9개 로딩 오버레이 표시
      ├─ POST /dashboard/get_batch_dashboard_data
      │   └─ 서버: ThreadPoolExecutor 10개 병렬 쿼리
      │       ├─ get_performance_summary_new()  → BigQuery CTE
      │       ├─ get_cafe24_sales_data()        → BigQuery
      │       ├─ get_cafe24_product_sales()     → BigQuery
      │       ├─ get_ga4_source_summary()       → BigQuery
      │       ├─ get_viewitem_summary()         → BigQuery
      │       ├─ get_monthly_net_sales_visitors()→ BigQuery
      │       ├─ get_platform_sales_by_day()    → BigQuery
      │       ├─ get_platform_sales_ratio()     → BigQuery
      │       ├─ get_product_sales_ratio()      → BigQuery
      │       └─ combined_ads_insight (Meta+Google) → BigQuery
      │
      ├─ 응답 분배:
      │   ├─ renderPerformanceSummaryWidget(data, latestUpdate)
      │   ├─ renderCafe24SalesWidget(data, totalCount)
      │   ├─ renderCafe24ProductsWidget(data, totalCount)
      │   ├─ renderGa4SourceWidget(data, totalCount)
      │   ├─ renderViewItemSummaryWidget(data, totalCount)
      │   ├─ renderMonthlyNetSalesVisitorsWidget(data)
      │   ├─ renderPlatformSalesSummaryWidget(data)
      │   ├─ renderPlatformSalesRatioWidget(data)
      │   ├─ renderProductSalesRatioWidget(data)
      │   └─ renderAccountPerformanceRows(data)
      │
      └─ finally: window.isLoading = false, 모든 스피너 hide

[필터 변경 시]
  ├─ #accountFilter change → fetchFilteredDataWithoutPopup() → updateAllData()
  ├─ #periodFilter change  → fetchFilteredDataWithoutPopup() → updateAllData()
  ├─ #startDate change     → fetchFilteredDataWithoutPopup() → updateAllData()
  └─ #endDate change       → fetchFilteredDataWithoutPopup() → updateAllData()

[위젯 개별 필터 변경 시 — Batch 미사용, 개별 API 호출]
  ├─ dateType radio (일자별/기간합) → fetchCafe24SalesData() → POST /dashboard/get_data
  ├─ dateSort select (정렬)         → fetchCafe24SalesData() → POST /dashboard/get_data
  ├─ cafe24_product_sort radio      → fetchCafe24ProductSalesData() → POST /dashboard/get_data
  ├─ ga4SourceFilter select         → 클라이언트 필터링 (재렌더링)
  ├─ countryFilter select           → 클라이언트 필터링 (재렌더링)
  ├─ sourceFilter select            → 클라이언트 필터링 (재렌더링)
  ├─ productNameSearch input        → 클라이언트 필터링 (재렌더링)
  ├─ platformDateType radio         → fetchPlatformSalesSummary() → POST /dashboard/get_data
  └─ platformDateSort select        → fetchPlatformSalesSummary() → POST /dashboard/get_data
```

---

## CSS 변수 / 디자인 토큰

```css
:root {
  /* 색상 팔레트 */
  --primary: #1e293b;
  --primary-dark: #0f172a;
  --primary-light: #334155;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #475569;

  /* 배경 색상 */
  --bg-primary: #f8fafc;            /* 페이지 배경 */
  --bg-secondary: #ffffff;           /* 카드/테이블 배경 */
  --bg-tertiary: #f1f5f9;           /* 테이블 헤더, 호버 */

  /* 텍스트 색상 */
  --text-primary: #1e293b;           /* 제목, 본문 */
  --text-secondary: #64748b;         /* 보조 텍스트, 라벨 */
  --text-muted: #94a3b8;             /* 비활성 텍스트 */

  /* 테두리 색상 */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-dark: #94a3b8;

  /* 그림자 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* 간격 */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */

  /* 둥근 모서리 */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */

  /* 전환 효과 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* 인라인 확장 색상 (index.html <style>) */
/* 섹션 구분선 색상 */
.section-divider::before { background: #2563eb; }         /* 첫 번째 (파란색) */
.section-divider:nth-of-type(2)::before { background: #059669; } /* 두 번째 (초록색) */
.section-divider:nth-of-type(3)::before { background: #7c3aed; } /* 세 번째 (보라색) */

/* 테이블 카드 제목 왼쪽 바 색상 */
.table-wrapper h2 { border-left: 3px solid #2563eb; }              /* 기본 (파란색) */
.table-wrapper.right-narrow h2 { border-left-color: #059669; }     /* 우측 (초록색) */
.table-wrapper.full-wide h2 { border-left-color: #7c3aed; }        /* 전체폭 (보라색) */

/* 성과 요약 강조 색상 */
.site-summary .summary-card:first-child .value { color: #c9a067; }  /* 사이트 매출 금색 */
.ad-performance-header { border-left-color: #1e3a5f; }             /* 광고 성과 네이비 */
.total-row { background: linear-gradient(135deg, #1e3a5f, #2d4a6f); } /* 합계 행 */
.highlight-value { color: #059669; }                                /* ROAS 강조 */
.total-row .highlight-value { color: #6ee7b7; }                    /* 합계 행 ROAS */
```

### 폰트

```css
font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
/* Inter: 숫자/영문 | Pretendard: 한글 */
```

---

## 레이아웃 구조

```
body (padding-top: 80px, background: #f8fafc)
│
├── filter-wrapper (position: sticky, top:0, z-index: 1000)
│   ├── filter-section (flex, align-items:center, gap:15px)
│   │   ├── .header-logo → <img> NGN 로고
│   │   ├── #accountDropdown → <select id="accountFilter"> 업체 선택
│   │   ├── #periodDropdown → <select id="periodFilter"> 기간 선택
│   │   └── #dateRangeContainer (display:none, flex 시 표시)
│   │       ├── #startDate (Flatpickr)
│   │       ├── "~"
│   │       ├── #endDate (Flatpickr)
│   │       └── #applyDateFilter ("초기화")
│   │
│   └── .nav-buttons
│       └── .nav-left
│           ├── #updatedAtText ("최종 업데이트: -")
│           └── .hamburger-menu-wrapper
│               ├── #hamburgerIcon (3줄 아이콘)
│               └── #hamburgerDropdown (메뉴 링크들)
│
├── .loading-progress (height:3px)
│   └── .loading-progress-bar (shimmer 애니메이션)
│
├── section.performance-summary-full-width (padding: 0 24px)
│   └── #performanceSummaryWrapper
│       ├── #loadingOverlayPerformanceSummary
│       └── .performance-summary-section
│           ├── [사이트 성과요약] 7개 카드 그리드
│           └── [총 광고 성과] 테이블 (8열)
│               ├── 합계 행 (total-row)
│               └── #accountPerformanceRows (계정별 동적 행)
│
├── .section-divider "매출 / 유입"
│
├── .container (padding: 0 24px)
│   ├── .tables-row (flex, gap:24px)
│   │   ├── .table-wrapper.left-wide [카페24 매출]
│   │   │   ├── dateType 라디오 (기간합/일자별)
│   │   │   ├── dateSort 드롭다운
│   │   │   ├── #cafe24SalesTable (10열)
│   │   │   └── #pagination_cafe24_sales
│   │   │
│   │   └── .table-wrapper.right-narrow [GA4 소스별 유입수]
│   │       ├── 이탈률 설명 텍스트
│   │       ├── #ga4SourceSummaryTable (4열)
│   │       └── #pagination_ga4_source_summary
│   │
│   └── .table-wrapper.full-wide [월별 매출/유입]
│       └── .monthly-sales-traffic-wrapper (flex)
│           ├── .monthly-summary-table-section (flex:0 0 320px)
│           │   └── #monthlySummaryTableBody
│           └── .monthly-summary-chart-section (flex:1)
│               └── #monthlyNetSalesVisitorsChart (ApexCharts)
│
├── .section-divider "상품 판매 및 조회"
│
├── .container
│   ├── .tables-row
│   │   ├── .table-wrapper.left-wide [카페24 상품 판매]
│   │   │   ├── cafe24_product_sort 라디오 (판매순/매출순)
│   │   │   ├── #cafe24ProductSalesTable (10열)
│   │   │   └── #pagination_cafe24_product_sales
│   │   │
│   │   └── .table-wrapper.right-narrow [GA4 상품별 조회수]
│   │       ├── sourceFilter 드롭다운
│   │       ├── countryFilter 드롭다운
│   │       ├── productSearchFilter 검색
│   │       ├── #viewitemSummaryTable (5열, 1열 hidden)
│   │       └── #pagination_viewitem_summary
│   │
│   └── .table-wrapper.full-wide [주요 상품 매출 비중]
│       └── #productSalesRatioChart (HTML 수평 막대)
│
├── .section-divider "커스텀 구글 시트 연결"
│
├── .container
│   ├── .table-wrapper.full-wide [플랫폼별 매출 요약]
│   │   ├── platformDateType 라디오 (기간합/일자별)
│   │   ├── platformDateSort 드롭다운
│   │   ├── #platformSalesTable (13열)
│   │   ├── #pagination_platform_sales_summary
│   │   └── #platformSalesRatioContainer [플랫폼별 매출 비중]
│   │
│   └── .table-wrapper.full-wide [월별 플랫폼 매출]
│       └── #pagination_platform_sales_monthly
│
└── #openMonthlyReportBtn (fixed, 사이드바 "REPORT" 버튼)
    └── 월간 리포트 모달 (별도 컴포넌트)
```

### 테이블 레이아웃 크기 규칙

| 클래스 | 용도 | 비율 |
|--------|------|------|
| `.tables-row` | 2열 레이아웃 컨테이너 | `display:flex`, `gap:24px` |
| `.left-wide` | 좌측 넓은 테이블 | 약 60% |
| `.right-narrow` | 우측 좁은 테이블 | 약 40% |
| `.full-wide` | 전체 폭 테이블 | 100% |

### 테이블 카드 공통 스타일

```
.table-wrapper {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  padding: 24px;
  margin-bottom: 24px;
}

.table-wrapper h2 {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid #2563eb;
}
```

---

## JS 전역 상태 변수

### dashboard.js

```javascript
// ─── 전역 로딩 플래그 ───
window.isLoading = false;              // 데이터 로딩 중 여부 (filters.js와 공유)
window.isProduction = boolean;          // 배포 환경 여부 (로그 비활성화)

// ─── 디버그 로깅 ───
const debugLog = (...args) => {};      // isProduction이 false일 때만 console.log 출력
const debugError = (...args) => {};    // isProduction이 false일 때만 console.error 출력

// ─── 요청 레지스트리 ───
const requestRegistry = {};            // { key: { id: number } } — 최신 요청만 처리
```

### performance_summary.js

```javascript
// (전역 상태 없음 - 함수 기반)
// renderPerformanceSummaryWidget(), updatePerformanceSummaryCards()
// renderAccountPerformanceRows(), setCardValue(), updateUpdatedAtText()
```

### cafe24_sales.js

```javascript
let currentPage_sales = 1;            // 현재 페이지 번호
let totalPages_sales = 1;             // 총 페이지 수
const itemsPerPage_sales = 9;         // 페이지당 행 수
let cafe24SalesTotalCount = 0;         // 전체 데이터 개수
let lastXhrSales = null;               // 현재 XHR 요청 참조
let cafe24SalesRawData = [];           // 현재 페이지 데이터 배열
```

### cafe24_product_sales.js

```javascript
let cafe24ProductSalesRawData = [];    // 현재 페이지 데이터 배열
let cafe24ProductSalesCurrentPage = 1; // 현재 페이지 번호
const cafe24ProductSalesItemsPerPage = 13; // 페이지당 행 수
let cafe24ProductSalesTotalCount = 0;  // 전체 데이터 개수
let lastXhrProductSales = null;         // 현재 XHR 요청 참조
```

### ga4_source_summary.js

```javascript
let rawGa4SourceRows = [];             // 전체 GA4 소스 데이터
let currentGa4SourcePage = 1;          // 현재 페이지 번호
const ga4SourceItemsPerPage = 10;      // 페이지당 행 수
```

### viewitem_summary.js

```javascript
let rawViewItemRows = [];              // 전체 ViewItem 데이터
let currentPage = 1;                   // 현재 페이지 번호
const itemsPerPage = 10;              // 페이지당 행 수
```

### monthly_net_sales_visitors.js

```javascript
let chartInstance = null;              // ApexCharts 인스턴스
```

### product_sales_ratio.js

```javascript
let allProductSalesRatioData = [];     // 전체 상품 매출 비중 데이터
```

### platform_sales_ratio.js

```javascript
let platformSalesRatioData = [];       // 플랫폼별 매출 비중 데이터
const platformNameMap = {};            // 플랫폼 코드 → 한글명 매핑 (예: site_official → "자사몰")
```

### platform_sales_summary.js

```javascript
let currentPage_platform = 1;         // 현재 페이지 번호
let totalPages_platform = 1;          // 총 페이지 수
const itemsPerPage_platform = 1000;   // 페이지당 행 수 (사실상 무제한)
let allPlatformSalesData = [];         // 전체 플랫폼 매출 데이터
```

### platform_sales_monthly.js

```javascript
let allMonthlyPlatformSalesData = [];  // 전체 월별 플랫폼 매출 데이터
let monthlyPlatformSalesData = [];     // 현재 표시용 월별 플랫폼 매출 데이터
let platformSalesChart = null;         // 월별 플랫폼 매출 차트 인스턴스
let isExpandedMonthlyPlatform = false; // 테이블 확장 여부
const platforms = [];                  // 플랫폼 목록 배열
const INITIAL_ROWS = 6;               // 초기 표시 행 수
```

### filters.js (ES Module)

```javascript
let isRestoringFilter = false;         // 드롭다운 복원 중 플래그
let startDatePicker, endDatePicker;    // Flatpickr 인스턴스

// metaAdsState (import from meta_ads_state.js)
// - company, period, startDate, endDate, accountId, tabLevel
```

### common.js

```javascript
// sessionStorage 키 (페이지별 분리)
// "siteSelectedCompany"   — 대시보드 업체 선택값
// "siteSelectedPeriod"    — 대시보드 기간 선택값 (항상 "today"로 초기화)
// "siteFromOtherPage"     — 다른 페이지에서 복귀 플래그
// "selectedCompany"       — 레거시 호환
// "selectedPeriod"        — 레거시 호환
```

### Jinja 템플릿 → JS 전역 변수 (index.html <script>)

```javascript
var userCompanyList = ["piscess", "demo", ...];  // session['company_names']
var currentUserId = "oscar@nugoona.co.kr";       // session['user_id']
var isAdminUser = true;                           // session['is_admin']
```

---

## HTML 요소 전체 맵

### 필터 영역

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.filter-wrapper` | section | 상단 고정 필터 영역 | sticky top:0 |
| `.header-logo` | a | NGN 로고 (/ 링크) | - |
| `#accountFilter` | select | 업체 선택 드롭다운 | "all" (모든 업체) |
| `#accountDropdown` | div | 업체 드롭다운 래퍼 (.custom-dropdown) | - |
| `#periodFilter` | select | 기간 선택 드롭다운 | "today" |
| `#periodDropdown` | div | 기간 드롭다운 래퍼 | - |
| `#dateRangeContainer` | div | 직접 선택 시 날짜 입력 영역 | display:none |
| `#startDate` | input[text] | 시작일 (Flatpickr) | readonly |
| `#endDate` | input[text] | 종료일 (Flatpickr) | readonly |
| `#applyDateFilter` | button | "초기화" 버튼 | - |
| `#updatedAtText` | div | "최종 업데이트: -" 텍스트 | - |
| `#hamburgerIcon` | div | 햄버거 메뉴 아이콘 | - |
| `#hamburgerDropdown` | div | 햄버거 드롭다운 메뉴 | hidden |

### 기간 선택 옵션

| value | 텍스트 | 서버 날짜 계산 |
|-------|--------|---------------|
| `today` | 오늘 | KST 기준 오늘 |
| `yesterday` | 어제 | KST 기준 어제 |
| `last7days` | 최근 7일 | KST 기준 7일 전 ~ 어제 |
| `current_month` | 이번 달 | KST 기준 이번 달 1일 ~ 오늘 |
| `last_month` | 지난 달 | KST 기준 지난 달 1일 ~ 말일 |
| `manual` | 직접 선택 | 사용자 입력 startDate ~ endDate |

### 로딩 상태

| ID | 위치 | 용도 |
|----|------|------|
| `#loadingOverlayPerformanceSummary` | 성과 요약 | 로딩 스피너 |
| `#loadingOverlayCafe24Sales` | 카페24 매출 | 로딩 스피너 |
| `#loadingOverlayCafe24Products` | 카페24 상품 | 로딩 스피너 |
| `#loadingOverlayGa4Source` | GA4 소스 | 로딩 스피너 |
| `#loadingOverlayViewitemSummary` | GA4 조회수 | 로딩 스피너 |
| `#loadingOverlayMonthlyChart` | 월별 차트 | 로딩 스피너 |
| `#loadingOverlayProductSalesRatio` | 상품 비중 | 로딩 스피너 |
| `#loadingOverlayPlatformSalesSummary` | 플랫폼 매출 | 로딩 스피너 |
| `#loadingOverlayPlatformSalesRatio` | 플랫폼 비중 | 로딩 스피너 |
| `#loadingOverlayPlatformSalesMonthly` | 월별 플랫폼 매출 | 로딩 스피너 |

### 성과 요약 카드

| ID | 타입 | 용도 | 기본값 |
|----|------|------|--------|
| `#performanceSummaryWrapper` | div | 성과 요약 전체 래퍼 | - |
| `.performance-summary-section` | section | 카드 + 테이블 컨테이너 | - |
| `.summary-grid.site-summary` | div | 사이트 성과 카드 그리드 (flex) | - |
| `#site_revenue` | div.value | 사이트 매출 | "-" |
| `#total_orders` | div.value | 주문수 | "-" |
| `#total_visitors` | div.value | 방문자 | "-" |
| `#product_views` | div.value | 상품 조회수 | "-" |
| `#ad_spend_ratio` | div.value | 매출대비 광고비(%) | "-" |
| `#cart_users` | div.value | 장바구니_사용자(GA) | "-" |
| `#signup_count` | div.value | 회원가입(GA) | "-" |
| `.ad-performance-table` | table | 총 광고 성과 테이블 | - |
| `#ad_spend` | td | 광고비 (합계 행) | "-" |
| `#roas_percentage` | td | ROAS(%) (합계 행) | "-" |
| `#avg_cpc` | td | 클릭당 비용 (합계 행) | "-" |
| `#avg_ctr` | td | 클릭율(%) (합계 행) | "-" |
| `#total_purchases` | td | 구매 수 (합계 행) | "-" |
| `#total_purchase_value` | td | 구매 금액 (합계 행) | "-" |
| `#avg_aov` | td | 객단가 (합계 행) | "-" |
| `#accountPerformanceRows` | tbody | 계정별 성과 행 (동적) | 비어있음 |
| `#pagination_performance_summary` | div | 성과 요약 페이지네이션 | - |

### data-widget-id 속성 맵

| data-widget-id | 위젯 | 용도 |
|----------------|------|------|
| `cafe24-sales` | 카페24 매출 | 위젯 식별용 속성 |
| `ga4-source` | GA4 소스별 유입수 | 위젯 식별용 속성 |

### 카페24 매출 테이블

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `input[name="dateType"]` | radio | 기간합 / 일자별 전환 | "daily" checked |
| `#dateSort` | select | 날짜 내림차순 / 오름차순 | "desc" |
| `#cafe24SalesTable` | table | 카페24 매출 테이블 | - |
| `#cafe24SalesBody` | tbody | 매출 데이터 행 (동적) | - |
| `#pagination_cafe24_sales` | div | 페이지네이션 | - |

### GA4 소스별 유입수 테이블

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#ga4SourceFilter` | select | 소스 필터 드롭다운 | "전체" |
| `#countryFilter` | select | 국가 필터 드롭다운 | "전체" |
| `#ga4SourceSummaryTable` | table | GA4 소스 테이블 | - |
| `#ga4SourceSummaryBody` | tbody | 소스 데이터 행 (동적) | - |
| `#pagination_ga4_source_summary` | div | 페이지네이션 | - |

### 카페24 상품 판매 테이블

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `input[name="cafe24_product_sort"]` | radio | 판매순 / 매출순 전환 | "sales" checked |
| `#cafe24ProductSalesTable` | table | 상품 판매 테이블 | - |
| `#cafe24ProductSalesBody` | tbody | 상품 데이터 행 (동적) | - |
| `#pagination_cafe24_product_sales` | div | 페이지네이션 | - |

### GA4 상품별 조회수 테이블

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#sourceFilter` | select | 소스별 필터 | "전체" |
| `#countryFilter` | select | 국가별 필터 | "전체" |
| `#productSearchFilter` | input[text] | 상품명 검색 | "" |
| `#viewitemSummaryTable` | table | 조회수 테이블 | - |
| `#viewitemSummaryBody` | tbody | 조회 데이터 행 (동적) | - |
| `#pagination_viewitem_summary` | div | 페이지네이션 | - |

> **KNOWN BUG**: HTML 템플릿에서는 `id="productSearchFilter"`를 사용하지만, JS(viewitem_summary.js)에서는 `#productNameSearch` 셀렉터로 참조한다. ID 불일치로 인해 상품명 검색 기능이 동작하지 않을 수 있다. 둘 중 하나로 통일 필요.

### 월별 매출/유입

| ID / 클래스 | 타입 | 용도 |
|-------------|------|------|
| `.monthly-sales-traffic-wrapper` | div | flex 레이아웃 (테이블+차트) |
| `#monthlySummaryTableBody` | tbody | 월별 요약 테이블 (동적) |
| `#monthlyNetSalesVisitorsChart` | div | ApexCharts 렌더링 대상 |

### 상품 매출 비중

| ID / 클래스 | 타입 | 용도 |
|-------------|------|------|
| `#productSalesRatioChart` | div | HTML 수평 막대 차트 |
| `.product-bar-item` | div | 개별 상품 막대 (동적) |

### 플랫폼별 매출 요약

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `input[name="platformDateType"]` | radio | 기간합 / 일자별 | "summary" checked |
| `#platformDateSort` | select | 날짜 정렬 | "desc", display:none |
| `#platformStartDateValue` | input[hidden] | 기간합용 시작일 | - |
| `#platformEndDateValue` | input[hidden] | 기간합용 종료일 | - |
| `#platformSalesTable` | table | 플랫폼 매출 테이블 (13열) | - |
| `#platformSalesSummaryBody` | tbody | 플랫폼 데이터 행 (동적) | - |
| `#pagination_platform_sales_summary` | div | 페이지네이션 | - |
| `#platformSalesRatioContainer` | div | 플랫폼 비중 차트 컨테이너 | - |

---

## 섹션별 상세 명세

### 위젯 1: 성과 요약 카드 (Performance Summary)

#### ASCII 목업

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┃ 사이트 성과요약                                                          │
│                                                                             │
│ ┌────────┬────────┬────────┬────────┬────────────┬─────────────┬──────────┐ │
│ │사이트매출│ 주문수 │ 방문자 │상품조회수│매출대비광고비│장바구니_GA │회원가입_GA│ │
│ │₩15,234K│  342  │ 8,921 │ 45,230 │   12.5%   │    234     │    12    │ │
│ └────────┴────────┴────────┴────────┴────────────┴─────────────┴──────────┘ │
│                                                                             │
│ ┃ 총 광고 성과                                                             │
│ ┌──────────┬───────┬───────┬────────┬───────┬──────┬──────────┬──────┐    │
│ │ 광고 매체 │ 광고비 │ROAS(%)│클릭당비용│클릭율%│구매수│ 구매 금액 │ 객단가│    │
│ ├──────────┼───────┼───────┼────────┼───────┼──────┼──────────┼──────┤    │
│ │▓▓ 전체 ▓▓│ 2.5M │ 350% │  1,200 │ 2.3% │  45  │ 8,750,000│194K │    │
│ ├──────────┼───────┼───────┼────────┼───────┼──────┼──────────┼──────┤    │
│ │ PISCESS  │ 2.0M │ 380% │  1,100 │ 2.5% │  38  │ 7,600,000│200K │    │
│ │ [Meta]   │       │       │        │       │      │          │      │    │
│ ├──────────┼───────┼───────┼────────┼───────┼──────┼──────────┼──────┤    │
│ │ PISCESS  │ 500K │ 230% │  1,800 │ 1.8% │   7  │ 1,150,000│164K │    │
│ │ [Google] │       │       │        │       │      │          │      │    │
│ └──────────┴───────┴───────┴────────┴───────┴──────┴──────────┴──────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 데이터 매핑

| 카드 ID | 데이터 필드 | 소수점 | 접미사 | 특수 색상 |
|---------|------------|--------|--------|-----------|
| `site_revenue` | `site_revenue` | 0 | - | `#c9a067` (금색) |
| `total_orders` | `total_orders` | 0 | - | - |
| `total_visitors` | `total_visitors` | 0 | - | - |
| `product_views` | `product_views` | 0 | - | - |
| `ad_spend_ratio` | `ad_spend_ratio` | 2 | "%" | - |
| `cart_users` | `cart_users` | 0 | - | - |
| `signup_count` | `signup_count` | 0 | - | - |
| `ad_spend` | `ad_spend` | 0 | - | - |
| `roas_percentage` | `roas_percentage` | 2 | "%" | `#059669` |
| `avg_cpc` | `avg_cpc` | 0 | - | - |
| `avg_ctr` | `avg_ctr` | 2 | "%" | - |
| `total_purchases` | `total_purchases` | 0 | - | - |
| `total_purchase_value` | `total_purchase_value` | 0 | - | - |
| `avg_aov` | `avg_aov` | 0 | - | - |

#### 계정별 광고 성과 행 (동적 생성)

```javascript
// 각 계정 행 구조
{
  platform: "meta" | "google",      // 플랫폼 구분
  account_name: "PISCESS - 공홈",   // 계정명
  spend: 2000000,                   // 광고비
  impressions: 500000,              // 노출수
  clicks: 12000,                    // 클릭수
  purchases: 38,                    // 구매 수
  purchase_value: 7600000           // 구매 금액
}
// 플랫폼 배지: Meta → 파란 배경, Google → 노란 배경
// ROAS, CPC, CTR, AOV는 클라이언트에서 계산
```

---

### 위젯 2: 카페24 매출 테이블

#### ASCII 목업

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┃ 카페24 매출                                                      │
│                                                                     │
│ (●) 기간합  (○) 일자별  [날짜 내림차순 ▼]                         │
│                                                                     │
│ ┌──────┬────────┬────┬──────┬─────┬─────┬─────┬──────┬─────┬─────┐│
│ │업체명│  날짜  │총주문│상품매출│배송비│할인액│쿠폰  │총결제 │환불  │순매출││
│ ├──────┼────────┼────┼──────┼─────┼─────┼─────┼──────┼─────┼─────┤│
│ │pisces│2026-02│ 12 │890K │ 3K │ 50K │ 20K │ 823K│  0  │823K ││
│ └──────┴────────┴────┴──────┴─────┴─────┴─────┴──────┴─────┴─────┘│
│                                                                     │
│                          [이전] 1 / 5 [다음]                       │
└─────────────────────────────────────────────────────────────────────┘
```

#### 테이블 컬럼 (10열)

| # | 헤더 | 데이터 필드 | 정렬 |
|---|------|-------------|------|
| 1 | 업체명 | `company_name` | left |
| 2 | 날짜 | `report_date` | left |
| 3 | 총주문 | `total_orders` | right |
| 4 | 상품매출 | `item_product_price` | right |
| 5 | 배송비 | `total_shipping_fee` | right |
| 6 | 할인금액 | `total_discount` | right |
| 7 | 쿠폰할인 | `total_coupon_discount` | right |
| 8 | 총결제금액 | `total_payment` | right |
| 9 | 환불합계 | `total_refund_amount` | right |
| 10 | 순매출 | `net_sales` | right |

#### 필터 옵션

- **dateType**: `"summary"` (기간합) / `"daily"` (일자별, 기본값)
- **dateSort**: `"desc"` (내림차순, 기본값) / `"asc"` (오름차순)
  - dateSort는 dateType="daily"일 때만 표시
- **페이지당 행 수**: 9개

---

### 위젯 3: GA4 소스별 유입수

#### ASCII 목업

```
┌─────────────────────────────────────────┐
│ ┃ GA4 소스별 유입수                      │
│                                          │
│ 이탈률: 세션 10초 미만 + 1 이벤트만      │
│ ▲ 오늘의 이탈률은 미확정 데이터          │
│                                          │
│ ┌───────┬──────────┬──────┬──────┐      │
│ │업체명  │  소스    │유입수 │이탈률│      │
│ ├───────┼──────────┼──────┼──────┤      │
│ │piscess│(direct)  │ 3,421│ 45.2%│      │
│ │piscess│instagram │ 1,234│ 38.1%│      │
│ │piscess│meta_ad   │   892│ 32.5%│      │
│ │piscess│naver.com │   567│ 52.3%│      │
│ └───────┴──────────┴──────┴──────┘      │
│                                          │
│               [이전] 1 / 3 [다음]       │
└─────────────────────────────────────────┘
```

#### 테이블 컬럼 (4열)

| # | 헤더 | 데이터 필드 | 정렬 |
|---|------|-------------|------|
| 1 | 업체명 | `company_name` | left |
| 2 | 소스 | `source` | left |
| 3 | 유입수 | `total_users` | right |
| 4 | 이탈률 | `bounce_rate` | right (%.1f) |

#### 클라이언트 필터링 (서버 호출 없음)

- **ga4SourceFilter**: 소스별 필터 (동적 생성)
  - 우선순위 소스: `(direct)`, `instagram`, `meta_ad`, `naver.com`, `youtube.com`, `tiktok`, `google`, `daum`, `cafe24.com`
  - 최대 15개
- **countryFilter**: 국가별 필터 (동적 생성)
- 소스를 선택하면 국가별 그룹핑 (상위 5개)
- 페이지당 행 수: 10개

---

### 위젯 4: 카페24 상품 판매

#### 테이블 컬럼 (10열)

| # | 헤더 | 데이터 필드 | 정렬 |
|---|------|-------------|------|
| 1 | 업체명 | `company_name` | left |
| 2 | 날짜 | `report_date` | left |
| 3 | 상품명 | `product_name` | left |
| 4 | 가격 | `product_price` | right |
| 5 | 총 판매량 | `total_quantity` | right |
| 6 | 취소된 주문 | `total_canceled` | right |
| 7 | 순 판매량 | `item_quantity` | right |
| 8 | 총 매출 | `item_product_sales` | right |
| 9 | 첫 구매 | `total_first_order` | right |
| 10 | URL | `product_url` | link ("상품 보기") |

#### 필터 옵션

- **cafe24_product_sort**: `"sales"` (판매순, 기본값) / `"revenue"` (매출순)
- 페이지당 행 수: 13개

---

### 위젯 5: GA4 상품별 조회수

#### 테이블 컬럼 (5열, 1열 hidden)

| # | 헤더 | 데이터 필드 | 표시 | 정렬 |
|---|------|-------------|------|------|
| 1 | 업체명 | `company_name` | hidden | - |
| 2 | 상품명 | `product_name_cleaned` | visible | left |
| 3 | 소스 | `source_raw` | visible | left |
| 4 | 국가 | `country` | visible | left |
| 5 | 조회 | `total_view_item` | visible | right |

#### 클라이언트 필터링

- **sourceFilter**: 소스별 필터 (우선순위 동일)
- **countryFilter**: 국가별 필터 (상위 3개)
- **productNameSearch**: 상품명 키워드 검색 (실시간)
- 그룹핑: company_name + product_name_cleaned 기준
- 페이지당 행 수: 10개

---

### 위젯 6: 월별 매출/유입 차트

#### ASCII 목업

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┃ [월별] 매출/유입                                                  │
│ * 취소/환불 배송비 정산에 따라 실데이터와 소폭 다를 수 있습니다      │
│                                                                      │
│ ┌────────────────┬───────────────────────────────────────────────┐  │
│ │ 업체명│ 월   │매출    │유입  │                                  │  │
│ │ pisces│2026-01│12.5M  │45.2K│    ██████████████▓▓▓             │  │
│ │ pisces│2025-12│11.2M  │41.8K│    █████████████▓▓▓▓             │  │
│ │ pisces│2025-11│10.8M  │38.5K│    ████████████▓▓▓▓▓             │  │
│ │ ...   │  ...  │ ...   │ ... │    Bar=매출(Blue) Line=유입(Gray) │  │
│ └────────────────┴───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

#### 차트 설정

- **라이브러리**: ApexCharts
- **차트 타입**: Line (Bar + Line 복합)
- **시리즈 1**: 매출 (Bar, 색상: `#2563eb`, columnWidth: 50%, borderRadius: 4)
- **시리즈 2**: 유입 (Line, 색상: `#64748b`, width: 3, smooth)
- **Y축**: 좌측 = 매출 (₩ 포맷), 우측 = 유입 (숫자)
- **높이**: 450px (모바일 350px)
- **데이터**: 기간 필터 없음 (전체 월별 데이터)

#### 테이블 컬럼 (4열)

| # | 헤더 | 데이터 필드 |
|---|------|-------------|
| 1 | 업체명 | `company_name` |
| 2 | 월 | `date` (YYYY-MM) |
| 3 | 매출 | `net_sales` |
| 4 | 유입 | `total_visitors` |

---

### 위젯 7: 주요 상품 매출 비중

#### ASCII 목업

```
┌─────────────────────────────────────────────────────────────┐
│ ┃ 주요 상품 매출 비중                                       │
│                                                              │
│  ① 클래식 레더 백     25.3%  ████████████████████  ₩3,200K  │
│  ② 미니 숄더백        18.7%  ██████████████         ₩2,380K  │
│  ③ 캐주얼 토트백      12.1%  █████████              ₩1,540K  │
│  ④ 크로스바디 백       8.5%  ██████                 ₩1,080K  │
│  ⑤ 지갑 세트           5.2%  ████                   ₩  660K  │
└─────────────────────────────────────────────────────────────┘
```

#### 데이터 구조

```javascript
{
  cleaned_product_name: "클래식 레더 백",   // 또는 product_name
  sales_ratio_percent: 25.3,               // 매출 비중 (%)
  item_product_sales: 3200000              // 매출액 (원)
}
```

- Top 5만 표시
- 막대 너비: `(percent / maxPercent) * 100`%
- 순위 배지: 1위=파란색, 2위=진회색, 3위=회색, 4~5위=연회색

---

### 위젯 8: 플랫폼별 매출 요약

#### 테이블 컬럼 (13열)

| # | 헤더 | 데이터 필드 |
|---|------|-------------|
| 1 | 업체명 | `company_name` |
| 2 | 날짜 | `date` (일자별) 또는 `start_date ~ end_date` (기간합) |
| 3 | 합계 | `total_sales` |
| 4 | 자사몰 | `site_official` |
| 5 | 무신사 | `musinsa` |
| 6 | 29cm | `29cm` |
| 7 | SHOPEE | `shopee` |
| 8 | EQL | `eql` |
| 9 | LLUD | `llud` |
| 10 | HANA | `hana` |
| 11 | HEIGHTS | `heights` |
| 12 | 지그재그 | `zigzag` |
| 13 | 에이블리 | `ably` |

#### 기간합 모드 특수 처리

- 데이터 행 1개 + "기간합" 합계 행 (`.total-row`)
- `formattedDate = start_date ~ end_date`

---

## 핵심 함수 흐름

```
updateAllData()                          → Batch API 호출 (메인 흐름)
├── getRequestData()                     → 공통 파라미터 수집
├── fetch('/dashboard/get_batch_dashboard_data')
│   ├── renderPerformanceSummaryWidget() → updatePerformanceSummaryCards()
│   │                                       ├── setCardValue() × 14
│   │                                       └── updateUpdatedAtText()
│   │                                    → renderAccountPerformanceRows()
│   │
│   ├── renderCafe24SalesWidget()        → updateCafe24SalesTable()
│   │                                    → renderCafe24SalesPagination()
│   │
│   ├── renderCafe24ProductsWidget()     → renderCafe24ProductSalesTable()
│   │                                    → renderCafe24ProductSalesPagination()
│   │
│   ├── renderGa4SourceWidget()          → renderGa4SourceSummaryFilters()
│   │                                    → renderGa4CountrySummaryFilters()
│   │                                    → renderGa4SourceSummaryTable()
│   │                                    → renderGa4SourceSummaryPagination()
│   │
│   ├── renderViewItemSummaryWidget()    → renderViewItemSummaryFilters()
│   │                                    → renderViewItemSummaryTable()
│   │                                    → renderViewItemSummaryPagination()
│   │
│   ├── renderMonthlyNetSalesVisitorsWidget()
│   │   ├── renderMonthlyNetSalesVisitorsChart() → ApexCharts
│   │   └── renderMonthlySummaryTable()
│   │
│   ├── renderPlatformSalesSummaryWidget()→ renderPlatformSalesTable()
│   │                                     → renderPlatformSalesPagination()
│   │
│   ├── renderPlatformSalesRatioWidget() → (차트 렌더링)
│   │
│   ├── renderProductSalesRatioWidget()  → renderProductSalesRatioChart() → HTML 막대
│   │
│   └── renderAccountPerformanceRows()   → Meta/Google 계정별 행 생성
│
└── 폴백 (Batch 실패 시) → 개별 fetch 호출
    ├── fetchCafe24SalesData()
    ├── fetchCafe24ProductSalesData()
    ├── fetchPerformanceSummaryData()
    ├── fetchMonthlyNetSalesVisitors()
    ├── fetchPlatformSalesSummary()
    ├── fetchPlatformSalesRatio()
    ├── fetchGa4SourceSummaryData()
    ├── fetchGa4ViewItemSummaryData()
    └── fetchProductSalesRatio()
```

### 헬퍼 함수

```
cleanData(value, decimalPlaces)  → 숫자 포맷팅 (천단위 콤마)
setCardValue(cardId, rawValue, decimal, suffix)
                                 → 카드 값 설정 (null→"-", 천단위 콤마, suffix 추가)
showLoading(target)              → 로딩 오버레이 표시 + .loading 클래스
hideLoading(target)              → 로딩 오버레이 숨김
latestAjaxRequestWrapper(key, ajaxOptions, onSuccess)
                                 → 최신 요청만 콜백 실행 (이전 응답 무시)
getRequestData(page, extra)      → { company_name, period, start_date, end_date, page, limit, ...extra }
```

---

## API 엔드포인트 레퍼런스

### 1. POST `/dashboard/get_batch_dashboard_data`

> **용도**: 대시보드 초기 로딩 — 10개 위젯 데이터를 단일 요청으로 병렬 처리

#### Request

```json
{
  "company_name": "piscess",
  "period": "today",
  "date_type": "daily",
  "date_sort": "desc",
  "sort_by": "sales",
  "platform_date_type": "summary",
  "platform_date_sort": "desc",
  "limit": 9
}
```

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `company_name` | string \| string[] | Yes | "all" | 업체명 (단일 또는 배열) |
| `period` | string | Yes | "today" | 기간 프리셋 (today/yesterday/last7days/current_month/last_month/manual) |
| `start_date` | string | period=manual 시 | - | 시작일 (YYYY-MM-DD) |
| `end_date` | string | period=manual 시 | - | 종료일 (YYYY-MM-DD) |
| `date_type` | string | No | "daily" | 카페24 매출 날짜 유형 (daily/summary) |
| `date_sort` | string | No | "desc" | 카페24 매출 날짜 정렬 (desc/asc) |
| `sort_by` | string | No | "sales" | 카페24 상품 판매 정렬 (sales/revenue). **주의**: `get_data` 엔드포인트에서는 기본값이 `"item_product_sales"` (cafe24_service.py 기본값) |
| `platform_date_type` | string | No | "summary" | 플랫폼 매출 날짜 유형 (summary/daily) |
| `platform_date_sort` | string | No | "desc" | 플랫폼 매출 날짜 정렬 (desc/asc) |
| `limit` | int | No | 9 | 카페24 매출 페이지당 행 수 |

#### Response (성공)

```json
{
  "status": "success",

  "performance_summary": [
    {
      "date_range": "2026-02-28 ~ 2026-02-28",
      "ad_media": "meta",
      "ad_spend": 125000.00,
      "total_clicks": 3421,
      "total_impressions": 89200,
      "total_purchases": 12,
      "total_purchase_value": 1890000.00,
      "roas_percentage": 1512.00,
      "avg_cpc": 36.54,
      "avg_ctr": 3.84,
      "avg_aov": 157500.00,
      "site_revenue": 4560000.00,
      "total_orders": 45,
      "total_visitors": 8921,
      "product_views": 45230,
      "ad_spend_ratio": 2.74,
      "cart_users": 234,
      "signup_count": 12,
      "updated_at": "2026-02-28T06:30:00.000000"
    }
  ],
  "performance_summary_total_count": 1,
  "latest_update": "2026-02-28T06:30:00.000000",

  "cafe24_sales": [
    {
      "report_date": "2026-02-28",
      "company_name": "piscess",
      "total_orders": 12,
      "item_orders": 15,
      "item_product_price": 890000,
      "total_shipping_fee": 3000,
      "total_discount": 50000,
      "total_coupon_discount": 20000,
      "total_payment": 823000,
      "total_refund_amount": 0,
      "net_sales": 823000,
      "total_count": 28
    }
  ],
  "cafe24_sales_total_count": 28,

  "cafe24_product_sales": [
    {
      "report_date": "2026-02-01 ~ 2026-02-28",
      "company_name": "piscess",
      "product_name": "클래식 레더 백",
      "product_price": 128000,
      "total_quantity": 25,
      "total_canceled": 2,
      "item_quantity": 23,
      "item_product_sales": 2944000,
      "total_first_order": 5,
      "product_url": "https://piscess.cafe24.com/product/...",
      "updated_at": "2026-02-28T06:30:00",
      "_sort_key": 23,
      "total_count": 156
    }
  ],
  "cafe24_product_sales_total_count": 156,

  "ga4_source_summary": [
    {
      "company_name": "piscess",
      "source": "(direct)",
      "total_users": 3421,
      "bounce_rate": 45.2
    },
    {
      "company_name": "piscess",
      "source": "instagram",
      "total_users": 1234,
      "bounce_rate": 38.1
    }
  ],
  "ga4_source_summary_total_count": 15,

  "viewitem_summary": [
    {
      "company_name": "piscess",
      "product_name_cleaned": "클래식 레더 백",
      "source_raw": "(direct)",
      "country": "South Korea",
      "total_view_item": 892
    }
  ],
  "viewitem_summary_total_count": 230,

  "monthly_net_sales_visitors": [
    {
      "company_name": "piscess",
      "date": "2026-02",
      "net_sales": 12500000,
      "total_visitors": 45200
    },
    {
      "company_name": "piscess",
      "date": "2026-01",
      "net_sales": 11200000,
      "total_visitors": 41800
    }
  ],
  "monthly_net_sales_visitors_total_count": 12,

  "platform_sales_summary": [
    {
      "company_name": "piscess",
      "date": "2026-02-28",
      "total_sales": 1500000,
      "site_official": 823000,
      "musinsa": 350000,
      "29cm": 180000,
      "shopee": 0,
      "eql": 50000,
      "llud": 0,
      "hana": 0,
      "heights": 47000,
      "zigzag": 30000,
      "ably": 20000
    }
  ],
  "platform_sales_summary_total_count": 28,

  "platform_sales_ratio": [
    {
      "platform": "site_official",
      "total_sales": 12500000,
      "ratio_percent": 54.8
    },
    {
      "platform": "musinsa",
      "total_sales": 5600000,
      "ratio_percent": 24.6
    }
  ],

  "product_sales_ratio": [
    {
      "cleaned_product_name": "클래식 레더 백",
      "product_name": "클래식 레더 백 [블랙]",
      "item_product_sales": 3200000,
      "sales_ratio_percent": 25.3
    },
    {
      "cleaned_product_name": "미니 숄더백",
      "product_name": "미니 숄더백 [네이비]",
      "item_product_sales": 2380000,
      "sales_ratio_percent": 18.7
    }
  ],

  "combined_ads_insight": [
    {
      "platform": "meta",
      "account_name": "PISCESS - 공홈",
      "spend": 100000,
      "impressions": 75000,
      "clicks": 2800,
      "purchases": 10,
      "purchase_value": 1500000
    },
    {
      "platform": "google",
      "account_name": "PISCESS Google Ads",
      "spend": 25000,
      "impressions": 14200,
      "clicks": 621,
      "purchases": 2,
      "purchase_value": 390000
    },
    {
      "platform": "total",
      "account_name": "합계",
      "spend": 125000,
      "impressions": 89200,
      "clicks": 3421,
      "purchases": 12,
      "purchase_value": 1890000
    }
  ]
}
```

> **참고**: `combined_ads_insight` 키는 초기 응답 구조에 포함되지 않으며, 서버의 결과 수집(result collection) 단계에서 Meta/Google 광고 데이터를 병합하여 동적으로 추가된다.

#### Response (에러)

```json
{
  "status": "error",
  "message": "데이터 조회 중 오류 발생: ..."
}
```

---

### 2. POST `/dashboard/get_data`

> **용도**: 개별 위젯 데이터 조회 (페이지네이션, 필터 변경 시)

#### Request

```json
{
  "company_name": "piscess",
  "period": "today",
  "data_type": "cafe24_sales",
  "date_type": "daily",
  "date_sort": "desc",
  "page": 1,
  "limit": 9,
  "start_date": "2026-02-28",
  "end_date": "2026-02-28"
}
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `company_name` | string \| string[] | Yes | 업체명 |
| `period` | string | Yes | 기간 프리셋 |
| `data_type` | string | Yes | 위젯 타입 (아래 참조) |
| `page` | int | No | 페이지 번호 (기본 1) |
| `limit` | int | No | 페이지당 행 수 (기본 15) |
| `start_date` | string | 조건부 | 시작일 |
| `end_date` | string | 조건부 | 종료일 |

#### data_type 별 추가 파라미터

| data_type | 추가 파라미터 | 설명 |
|-----------|-------------|------|
| `performance_summary` | - | KPI 요약 |
| `cafe24_sales` | `date_type`, `date_sort` | 카페24 매출 |
| `cafe24_product_sales` | `sort_by` | 카페24 상품 판매 |
| `ga4_source_summary` | `_cache_buster` | GA4 소스 유입 |
| `viewitem_summary` | - | GA4 상품 조회 |
| `monthly_net_sales_visitors` | - | 월별 매출/유입 (기간 필터 없음) |
| `product_sales_ratio` | - | 상품 매출 비중 |
| `platform_sales_summary` | `date_type`, `date_sort` | 플랫폼 매출 |
| `platform_sales_ratio` | - | 플랫폼별 매출 비중 |
| `platform_sales_monthly` | - | 월별 플랫폼 매출 |
| `combined_ads_insight` | `level`, `date_type` | 통합 광고 성과 |
| `meta_account_list` | - | Meta 계정 목록 |

#### Response (cafe24_sales 예시)

```json
{
  "status": "success",
  "cafe24_sales": [
    {
      "report_date": "2026-02-28",
      "company_name": "piscess",
      "total_orders": 12,
      "item_orders": 15,
      "item_product_price": 890000,
      "total_shipping_fee": 3000,
      "total_discount": 50000,
      "total_coupon_discount": 20000,
      "total_payment": 823000,
      "total_refund_amount": 0,
      "net_sales": 823000,
      "total_count": 28
    }
  ],
  "cafe24_sales_total_count": 28
}
```

#### Response (performance_summary 예시)

```json
{
  "status": "success",
  "performance_summary": [
    {
      "date_range": "2026-02-28 ~ 2026-02-28",
      "ad_media": "meta",
      "ad_spend": 125000.00,
      "total_clicks": 3421,
      "total_impressions": 89200,
      "total_purchases": 12,
      "total_purchase_value": 1890000.00,
      "roas_percentage": 1512.00,
      "avg_cpc": 36.54,
      "avg_ctr": 3.84,
      "avg_aov": 157500.00,
      "site_revenue": 4560000.00,
      "total_orders": 45,
      "total_visitors": 8921,
      "product_views": 45230,
      "ad_spend_ratio": 2.74,
      "cart_users": 234,
      "signup_count": 12,
      "updated_at": "2026-02-28T06:30:00.000000"
    }
  ],
  "performance_summary_total_count": 1,
  "latest_update": "2026-02-28T06:30:00.000000"
}
```

#### Response (combined_ads_insight 예시)

```json
{
  "status": "success",
  "combined_ads_insight": [
    {
      "platform": "meta",
      "account_name": "PISCESS - 공홈",
      "account_id": "1289149138367044",
      "spend": 100000,
      "impressions": 75000,
      "clicks": 2800,
      "purchases": 10,
      "purchase_value": 1500000
    },
    {
      "platform": "google",
      "account_name": "PISCESS Google Ads",
      "spend": 25000,
      "impressions": 14200,
      "clicks": 621,
      "purchases": 2,
      "purchase_value": 390000
    }
  ]
}
```

#### Response (ga4_source_summary 예시)

```json
{
  "status": "success",
  "ga4_source_summary": [
    {
      "company_name": "piscess",
      "source": "(direct)",
      "country": "South Korea",
      "total_users": 3421,
      "bounce_rate": 45.2
    }
  ],
  "ga4_source_summary_total_count": 15
}
```

#### Response (viewitem_summary 예시)

```json
{
  "status": "success",
  "viewitem_summary": [
    {
      "company_name": "piscess",
      "product_name_cleaned": "클래식 레더 백",
      "source_raw": "(direct)",
      "country": "South Korea",
      "total_view_item": 892
    }
  ],
  "viewitem_summary_total_count": 230
}
```

#### Response (monthly_net_sales_visitors 예시)

```json
{
  "status": "success",
  "monthly_net_sales_visitors": [
    {
      "company_name": "piscess",
      "date": "2026-02",
      "net_sales": 12500000,
      "total_visitors": 45200
    }
  ],
  "monthly_net_sales_visitors_total_count": 12
}
```

#### Response (product_sales_ratio 예시)

```json
{
  "status": "success",
  "product_sales_ratio": [
    {
      "cleaned_product_name": "클래식 레더 백",
      "product_name": "클래식 레더 백 [블랙]",
      "item_product_sales": 3200000,
      "sales_ratio_percent": 25.3,
      "total_quantity": 25
    }
  ]
}
```

#### Response (platform_sales_summary 예시)

```json
{
  "status": "success",
  "platform_sales_summary": [
    {
      "company_name": "piscess",
      "date": "2026-02-28",
      "total_sales": 1500000,
      "site_official": 823000,
      "musinsa": 350000,
      "29cm": 180000,
      "shopee": 0,
      "eql": 50000,
      "llud": 0,
      "hana": 0,
      "heights": 47000,
      "zigzag": 30000,
      "ably": 20000,
      "start_date": "2026-02-01",
      "end_date": "2026-02-28"
    }
  ],
  "platform_sales_summary_total_count": 28
}
```

---

## 서비스 레이어 상세

### performance_summary_new.py — `get_performance_summary_new()`

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `company_name` | str \| list | Yes | 업체명 |
| `start_date` | str | Yes | YYYY-MM-DD |
| `end_date` | str | Yes | YYYY-MM-DD |
| `user_id` | str | No | 사용자 ID (demo 필터) |
| `account_id` | str | No | Meta 계정 ID (선택) |
| `is_admin` | bool | No | 관리자 여부 |

**BigQuery CTE 구조**:
1. `cafe24_latest_update` — cafe24_orders 테이블 수정 시간
2. `cafe24_summary` — daily_cafe24_sales (매출, 주문수)
3. `latest_meta_accounts` — meta_ads_account_summary (최신 계정 정보)
4. `meta_summary` — meta_ads_account_summary (광고비, 클릭, 구매)
5. `google_summary` — google_ads_account_summary (Google 광고 성과)
6. `combined_ads` — Meta + Google 통합
7. `ga4_visitors` — ga4_traffic_ngn (방문자)
8. `ga4_viewitem` — ga4_viewitem_ngn (상품 조회수)
9. `cart_signup` — performance_summary_ngn (장바구니, 회원가입)

**서버 계산 지표**:
- `roas_percentage` = (total_purchase_value / ad_spend) * 100
- `avg_cpc` = ad_spend / total_clicks
- `avg_ctr` = (total_clicks / total_impressions) * 100
- `avg_aov` = total_purchase_value / total_purchases
- `ad_spend_ratio` = (spend_for_ratio / site_revenue) * 100
  - `spend_for_ratio`는 29cm 계정 광고비 제외

**캐싱**: 60초 TTL (`@cached_query`)

### cafe24_service.py — `get_cafe24_sales_data()`

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `company_name` | str \| list | Yes | 업체명 |
| `period` | str | Yes | 기간 프리셋 |
| `start_date` | str | Yes | YYYY-MM-DD |
| `end_date` | str | Yes | YYYY-MM-DD |
| `date_type` | str | No | "daily" / "summary" |
| `date_sort` | str | No | "desc" / "asc" |
| `limit` | int | No | 페이지당 행 수 |
| `page` | int | No | 페이지 번호 |
| `user_id` | str | No | 사용자 ID |
| `is_admin` | bool | No | 관리자 여부 |

**반환**: `{ "rows": [...], "total_count": N }`

**캐싱**: 300초 (5분) TTL

### cafe24_service.py — `get_cafe24_product_sales()`

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `company_name` | str \| list | Yes | 업체명 |
| `period` | str | Yes | 기간 프리셋 |
| `start_date` | str | Yes | YYYY-MM-DD |
| `end_date` | str | Yes | YYYY-MM-DD |
| `sort_by` | str | No | "item_product_sales" (매출순, 기본값) / "sales" (판매순). `"sales"` → `item_quantity` 컬럼 정렬, `"item_product_sales"` → `item_product_sales` 컬럼 정렬 |
| `limit` | int | No | 페이지당 행 수 |
| `page` | int | No | 페이지 번호 |
| `user_id` | str | No | 사용자 ID |
| `is_admin` | bool | No | 관리자 여부 |

**반환**: `{ "rows": [...], "total_count": N }`

**캐싱**: 300초 (5분) TTL

---

## 인증/권한

### 세션 기반 (레거시 Flask)

```python
session['user_id']       # 사용자 ID (예: "oscar@nugoona.co.kr")
session['company_names'] # 접근 가능 업체 목록 (예: ["piscess", "demo"])
session['is_admin']      # 관리자 여부 (bool)
session['is_demo_user']  # 데모 사용자 여부 (bool)
session['is_demo']       # 데모 모드 여부 (bool)
```

### JWT 기반 (Next.js 호환)

```
Authorization: Bearer <JWT_TOKEN>
```

JWT payload:
```json
{
  "user_id": "oscar@nugoona.co.kr",
  "company_names": ["piscess"],
  "is_admin": true,
  "is_demo_user": false
}
```

### demo 데이터 접근 규칙

- `user_id == "demo"` → demo 데이터만 접근 가능
- `is_admin == true` → 모든 데이터 접근 가능 (demo 포함)
- 일반 사용자 → demo 데이터 제외

---

## 외부 라이브러리 의존성

| 라이브러리 | 버전 | 용도 | CDN |
|-----------|------|------|-----|
| jQuery | 3.6.0 | DOM 조작, Ajax | cdn.jsdelivr.net |
| Chart.js | latest | (레거시, 현재 미사용) | cdn.jsdelivr.net |
| chartjs-plugin-datalabels | 2.2.0 | (레거시, 현재 미사용) | cdn.jsdelivr.net |
| ApexCharts | 3.45.1 | 월별 매출/유입 차트 | cdn.jsdelivr.net |
| ECharts | 5.5.0 | (레거시, 현재 미사용) | cdn.jsdelivr.net |
| SweetAlert2 | 11 | 모달 알림 | cdn.jsdelivr.net |
| Flatpickr | 4.6.13 | 날짜 피커 | cdn.jsdelivr.net |
| Marked | 12.0.0 | 마크다운 렌더링 (월간 리포트) | cdn.jsdelivr.net |
| DOMPurify | 3.0.6 | XSS 방지 (월간 리포트) | cdn.jsdelivr.net |
| Font Awesome | 6.0.0 | 아이콘 | cdnjs.cloudflare.com |
| Inter (Google Fonts) | 300~800 | 영문/숫자 폰트 | fonts.googleapis.com |

### Next.js 포팅 시 대체 방안

| Flask (jQuery) | Next.js 대체 |
|---------------|-------------|
| `$.ajax()` | `fetch()` / `useSWR` / `react-query` |
| jQuery DOM 조작 | React state + JSX |
| ApexCharts | `react-apexcharts` 또는 Recharts |
| Flatpickr | `react-datepicker` 또는 `@shadcn/ui` DatePicker |
| SweetAlert2 | `sonner` (toast) + 커스텀 모달 |
| Chart.js | 제거 (ApexCharts로 통일 또는 Recharts) |

---

## 페이지네이션 패턴

모든 위젯은 동일한 페이지네이션 패턴을 사용한다.

```
[이전] 1 / 5 [다음]
```

| 요소 | 클래스 | 설명 |
|------|--------|------|
| 컨테이너 | `.pagination` | `margin-top:20px, padding:16px 0, border-top:1px solid #f1f5f9` |
| 이전 버튼 | `.pagination-btn` | `disabled` 시 `.disabled` 추가 |
| 페이지 정보 | `.pagination-info` | `"현재 / 전체"` 텍스트 |
| 다음 버튼 | `.pagination-btn` | `disabled` 시 `.disabled` 추가 |

```css
.pagination-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 4px;
}
```

---

## 로딩 상태 패턴

모든 위젯은 동일한 로딩 오버레이 패턴을 사용한다.

```html
<div id="loadingOverlay{Name}" class="loading-overlay">
  <div class="spinner"></div>
  <div class="loading-text">데이터를 불러오는 중입니다...</div>
</div>
```

### 로딩 시 동작

1. `showLoading(target)` → overlay `display:flex`, spinner 표시, `.loading-text` 숨김
2. 부모 `.table-wrapper`에 `.loading` 클래스 추가 → CSS 블러 효과
3. 데이터 로드 완료 → `hideLoading(target)` → overlay `display:none`
4. 부모 `.table-wrapper`에서 `.loading` 클래스 제거
5. 60초 안전장치: `setTimeout(forceHideAllLoading, 60000)`

---

## 반응형 브레이크포인트

| 브레이크포인트 | 영향 |
|-------------|------|
| `<= 1200px` | 성과 카드 `flex-wrap`, 카드 최소 너비 120px |
| `<= 900px` | 월별 차트 `flex-direction:column`, 테이블+차트 세로 배치 |
| `<= 768px` | 성과 카드 50% 너비, 폰트 축소, 차트 높이 350px |
| `<= 480px` | 광고 성과 테이블 CPC 컬럼 숨김, 계정 타입 배지 숨김 |

---

## Next.js 포팅 시 주요 고려사항

1. **Batch API 유지**: `get_batch_dashboard_data` 단일 호출로 10개 위젯 데이터 fetch → `useSWR` 또는 `react-query`로 캐싱
2. **개별 API 분리**: 위젯 내 필터 변경 시 개별 `get_data` 호출 유지
3. **서버 사이드 날짜 계산**: `get_start_end_dates()` 로직을 클라이언트 또는 API 미들웨어로 이식
4. **sessionStorage 대신 zustand/jotai**: 필터 상태 관리
5. **인증**: JWT Bearer 토큰 방식 (이미 Flask에서 지원)
6. **cleanData 함수**: `Intl.NumberFormat` 으로 대체
7. **로딩 상태**: React Suspense + Skeleton UI로 대체
8. **차트**: `react-apexcharts` 또는 Recharts로 포팅
9. **플랫폼 매출 플랫폼 목록**: 하드코딩된 10개 플랫폼 (`site_official`, `musinsa`, `29cm`, `shopee`, `eql`, `llud`, `hana`, `heights`, `zigzag`, `ably`) — 설정 파일로 분리 권장
