# SPEC: Ably 트렌드 페이지 (/trend/ably)

> **1:1 Clone 대상** — Flask Ably 트렌드 페이지 (주간 베스트 랭킹 + AI Insight 사이드바)
> **Flask 원본 HTML**: `ngn_wep/dashboard/templates/trend_page.html` (page_type="ably" 분기)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py` (Ably 트렌드 API 라인 3034~3232)
> **Flask 라우트**: `ngn_wep/dashboard/app.py` → `trend_ably_page()` (라인 317~347)
> **JS**: `ngn_wep/dashboard/static/js/trend_page.js` (29CM/Ably 공통, IS_ABLY 분기)
> **서비스**: `ngn_wep/dashboard/services/trend_ably_service.py` (BigQuery + GCS 스냅샷)
> **URL**: `/trend/ably?company_name=XXX`
> **버전**: v1.0 (2026-02-28)

---

## 1. 페이지 개요

Ably 플랫폼의 주간 베스트 상품 트렌드를 카테고리별로 조회하는 페이지.
카테고리(상의, 바지, 스커트 등) 탭과 트렌드 타입(급상승, 신규 진입, 순위 하락) 탭을 조합하여
랭킹 테이블을 표시한다. 별도 Insight 사이드바에서 AI 분석 리포트를 확인할 수 있다.

### 주요 기능 요약

| # | 기능 | 설명 |
|---|------|------|
| 1 | **카테고리 탭** | BigQuery에서 동적 조회된 category_medium 목록 (상의, 바지, 스커트 등) |
| 2 | **트렌드 타입 탭** | 급상승(Rising Star) / 신규 진입(New Entry) / 순위 하락(Rank Drop) |
| 3 | **랭킹 테이블** | 썸네일, 브랜드, 상품명, 순위변화, 이번주/지난주 순위 표시 |
| 4 | **더보기/접기** | 초기 4개 → 더보기 클릭 시 전체 (최대 20개, maxHeight 600px 스크롤) |
| 5 | **컬럼 정렬** | 브랜드명, 순위변화, 이번주 순위, 지난주 순위 클릭 정렬 |
| 6 | **Insight 사이드바** | AI 분석 리포트 (Section 1: MY BRAND, Section 2: KEYWORD, Section 3: TRENDS) |
| 7 | **GCS 스냅샷 로딩** | 스냅샷 우선, 없으면 에러 반환 (BigQuery fallback 비활성화) |
| 8 | **NEW 배지** | Insights 버튼에 세션 기반 NEW 배지 (빨간 점, 펄스 애니메이션) |

### Ably 전용 차이점 (vs 29CM)

| 항목 | Ably | 29CM |
|------|------|------|
| Compare 사이드바 | **없음** | 있음 (경쟁사 비교) |
| 리뷰 모달 | **없음** | 있음 |
| Rank_Change 부호 | **양수** = 하락 (rankDrop 탭) | 음수 = 하락 |
| 기본 탭 | 첫 번째 카테고리 (예: "상의") | "전체" |
| 상품명 길이 제한 | **50자** (초과 시 "..." + title 툴팁) | 제한 없음 |
| compare_page.js | **로드 안 함** | 로드 |

---

## 2. 데이터 플로우

```
[페이지 진입: /trend/ably?company_name=piscess]
  │
  ├─ Flask Route: trend_ably_page()
  │   ├─ 인증 확인 (세션 or 데모)
  │   ├─ company_name 검증 (세션 company_names에 포함 여부)
  │   ├─ 스냅샷 버킷 존재 확인: check_trend_snapshot_exists(company_name, "ably")
  │   └─ render_template("trend_page.html", page_type="ably", selected_company=company_name)
  │
  ├─ HTML 렌더링
  │   ├─ <script> var pageType = "ably"; </script>
  │   ├─ window.selectedCompany = "piscess"
  │   └─ IS_ABLY = true → API_ENDPOINT = '/dashboard/trend/ably'
  │
  └─ $(document).ready()
      ├─ loadTabs()
      │   └─ GET /dashboard/trend/ably/tabs
      │       └─ Response: { status: "success", tabs: ["상의", "바지", "스커트", ...] }
      │
      ├─ setupTrendTypeTabs()   → 급상승/신규진입/순위하락 탭 이벤트 바인딩
      ├─ setupTrendAnalysisToggle()  → Insights 사이드바 토글 설정
      │
      └─ loadAllTabsData()  (loadTabs 완료 후)
          └─ POST /dashboard/trend/ably
              ├─ Request:  { tab_names: [...], trend_type: "all", company_name: "piscess" }
              └─ Response: { status: "success", current_week: "2026W08_WEEKLY_POPULARITY",
              │              tabs_data: { "상의": { rising_star: [...], new_entry: [...], rank_drop: [...] }, ... },
              │              insights: { analysis_report: "## Section 1...", generated_at: "..." } }
              │
              ├─ allTabsData = data.tabs_data   (메모리 캐싱)
              ├─ window.trendInsights = data.insights
              ├─ updatePageTitle(currentWeek)
              ├─ localStorage.setItem('trend_last_viewed_ably', currentWeek)
              └─ displayCurrentTabData()  → 테이블 렌더링

[카테고리 탭 전환]
  └─ switchTab(tabName)
      ├─ currentTab = tabName
      └─ displayCurrentTabData()  → allTabsData[currentTab] 에서 클라이언트 렌더링 (API 호출 없음)

[트렌드 타입 탭 전환]
  └─ setupTrendTypeTabs → click handler
      ├─ currentTrendType = "risingStar" | "newEntry" | "rankDrop"
      └─ displayCurrentTabData()

[Insights 사이드바 열기]
  └─ trendAnalysisToggleBtn.click
      ├─ removeNewBadge + sessionStorage('trend_insights_viewed')
      ├─ refreshTrendAnalysisTitle()
      ├─ loadTrendAnalysisReport()
      │   └─ window.trendInsights 있으면 바로 렌더링
      │   └─ 없으면 POST /dashboard/trend/ably (재호출)
      └─ renderTrendAnalysisReport(insights)
          ├─ parseAnalysisReportSections(analysisText) → { section1, section2, section3 }
          ├─ Section 1: renderSection1AsCard() → MY BRAND 카드
          │   └─ getCompanyProducts() → 자사몰 상품 썸네일 그리드
          ├─ Section 2: renderSection2AsCards() → KEYWORD (Material + Mood 2열 카드)
          └─ Section 3: renderSection3WithTabs() → TRENDS (탭: 급상승/신규/하락)
              └─ renderSection3SegmentContent() → 카테고리별 Card UI + 썸네일 그리드
```

---

## 3. CSS 변수 / 디자인 토큰

```
트렌드 페이지는 라이트 테마를 사용한다 (대시보드 다크 테마와 다름).
CSS 변수 없이 직접 색상값 사용.
```

### 컬러 팔레트

| 용도 | 값 | 설명 |
|------|----|----|
| 페이지 배경 | `#f8fafc` | sticky header 배경 |
| 카드 배경 | `#ffffff` | 테이블, 카드, 사이드바 배경 |
| 텍스트 Primary | `#212529` | 제목, 브랜드명, 순위 |
| 텍스트 Secondary | `#495057` | 분석 텍스트, 상품명 |
| 텍스트 Muted | `#6B7280` | 업데이트 정보, 탭 비활성 |
| 텍스트 Dimmed | `#868E96` | 빈 상태, 로딩 텍스트 |
| 보더 Default | `#E9ECEF` | 카드, 섹션 보더 |
| 보더 Subtle | `#F1F3F5` | 테이블 행 구분선 |
| 탭 배경 (비활성) | `#F8F9FA` | 카테고리 탭 기본 |
| 탭 배경 (활성) | `#212529` | 카테고리 탭 선택 |
| 트렌드 타입 탭 배경 | `#E5E7EB` | Segmented Control 배경 |
| 트렌드 타입 탭 (활성) | `#ffffff` | Segmented Control 선택 |
| 순위 상승 (급상승) | `#DC3545` | 빨간색 ▲ |
| 순위 하락 | `#0066CC` | 파란색 ▼ |
| 신규 진입 | `#28A745` | 초록색 |
| 순위 배지 | `#003366` | 썸네일 내 순위 배지 |
| 더보기 버튼 | `#374151` | gray-700 |
| 접기 버튼 | `#6b7280` | gray-500 |
| Insights 버튼 | `#1a1a1a` | 진한 차콜 |
| 사이드바 헤더 | `#000000` | 블랙 |
| NEW 배지 | `#ef4444` | 빨간색 + 펄스 |
| Section3 탭 인디케이터 | `linear-gradient(90deg, #667eea, #764ba2)` | 보라 그라디언트 |
| 카테고리 뱃지 | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | 보라 그라디언트 |
| Section1 강조 (strong) | `rgba(255, 224, 51, 0.3)` | 노란 하이라이트 배경 |

---

## 4. 레이아웃 구조

```
body (margin:0, overflow-x:hidden)
│
├── .top-header (56px, position:sticky, z-index:1000) ← 공통 헤더 (별도 SPEC)
│
├── .trend-page-wrapper (max-width:1400px, margin:0 auto, padding:0 24px 8px 24px)
│   │
│   ├── .trend-sticky-header (position:sticky, top:0, z-index:100, bg:#f8fafc)
│   │   │
│   │   ├── .trend-page-header (mb:8px)
│   │   │   └── h1#trendPageTitle .trend-page-title (26px, 700, flex, gap:16px)
│   │   │       ├── "Ably {year}년 {month}월 {week}주차 트렌드"
│   │   │       └── span.trend-page-update-info (12px, 400, #6B7280, ml:auto)
│   │   │           └── "↻ 매주 월요일 오전 9시 업데이트"
│   │   │
│   │   ├── .trend-tabs-wrapper (overflow-x:auto, scrollbar:none)
│   │   │   └── .trend-tabs#trendTabs (flex, gap:8px, pb:4px)
│   │   │       └── button.trend-tab-btn * N (동적 생성)
│   │   │           ├── padding: 10px 20px
│   │   │           ├── border: 2px solid #E9ECEF
│   │   │           ├── border-radius: 8px
│   │   │           ├── font: 14px 500
│   │   │           └── .active: bg:#212529, color:#fff, fw:600
│   │   │
│   │   └── .trend-type-tabs-wrapper (mt:8px mb:8px)
│   │       └── .trend-type-tabs#trendTypeTabs
│   │           ├── bg: #E5E7EB, border-radius:12px, padding:4px
│   │           └── button.trend-type-tab-btn * 3 (flex:1)
│   │               ├── "급상승" (data-type="risingStar") [active default]
│   │               ├── "신규 진입" (data-type="newEntry")
│   │               └── "순위 하락" (data-type="rankDrop")
│   │               ├── padding: 12px 24px
│   │               ├── font: 15px 600
│   │               ├── color: #6B7280 (비활성)
│   │               └── .active: bg:#fff, color:#212529, shadow-sm
│   │
│   └── .trend-table-section (bg:#fff, border:1px solid #E9ECEF, mb:32px)
│       └── .trend-table-container (bg:#fff, flex-column)
│           └── div#trendTableContent
│               └── (동적 렌더링) .trend-table-wrapper
│                   ├── .trend-table-scroll-container
│                   │   └── table.trend-table
│                   │       ├── thead → tr
│                   │       │   ├── th "랭킹"
│                   │       │   ├── th "썸네일"
│                   │       │   ├── th "브랜드" (sortable)
│                   │       │   ├── th "상품명"
│                   │       │   ├── th "순위변화" (sortable) ← risingStar/rankDrop만
│                   │       │   ├── th "이번주 순위" (sortable)
│                   │       │   └── th "지난주 순위" (sortable, hide-mobile)
│                   │       └── tbody → tr * N (초기 4개)
│                   │           ├── td: Ranking 텍스트 (예: "상의 3위")
│                   │           ├── td.trend-thumbnail-cell: 썸네일 이미지 (120x120px)
│                   │           ├── td: Brand_Name
│                   │           ├── td: Product_Name (max 50자, 호버 시 전체 표시)
│                   │           ├── td.trend-rank-number: 순위변화 (▲/▼ + 숫자, 22px 700)
│                   │           ├── td.trend-rank-number: 이번주 순위 (22px 700)
│                   │           └── td.trend-rank-number: 지난주 순위 (22px 700)
│                   └── .trend-pagination-container
│                       ├── button.trend-show-more-btn "더보기 (N개 더)"
│                       └── button.trend-collapse-btn "접기" (display:none)
│
├── div#trendAnalysisToggleBtn .trend-analysis-toggle-btn (Insights 버튼)
│   ├── position: fixed, bottom:20px, right:0
│   ├── writing-mode: vertical-rl
│   ├── padding: 36px 14px
│   ├── z-index: 1500
│   └── span "Insights" + (optional) span.btn-new-badge
│
└── div#trendAnalysisSidebar .trend-analysis-sidebar-wrapper.hidden
    ├── position: fixed, top:20px, right:0
    ├── width: 1600px, max-width:95vw
    ├── max-height: calc(100vh - 40px)
    ├── z-index: 2000
    ├── border-top-left-radius: 12px
    ├── border-bottom-left-radius: 12px
    ├── transform: translateX(100%) → .active: translateX(0%)
    │
    ├── .trend-analysis-header-bar (sticky, top:0, z:11, bg:#000, h:60px)
    │   ├── .trend-analysis-header-title "트렌드 데이터 분석" (20px, 700, #fff)
    │   └── button#closeTrendAnalysisSidebarBtn .trend-analysis-close-btn "×"
    │
    └── .trend-analysis-sidebar-content (padding:24px, overflow-y:auto, flex:1)
        ├── .trend-analysis-header (mb:24px, pb:16px, border-bottom:2px #E9ECEF)
        │   ├── h3#trendAnalysisTitle (20px, 700, flex)
        │   │   ├── "Ably {month}월 {week}주차 트렌드 데이터 분석"
        │   │   └── span.trend-analysis-update-info (12px, 400, #6B7280)
        │   └── .trend-analysis-meta
        │       └── span#trendAnalysisCreatedAt "생성일: -" (13px, #6C757D)
        │
        └── .trend-analysis-body#trendAnalysisContent
            └── (동적 렌더링) .trend-analysis-report-container
                │
                ├── [Section 1] .trend-section1-container (mt:32px, mb:32px)
                │   ├── h2.trend-section1-header "MY BRAND" (20px, 600)
                │   └── .trend-section1-card (border:1px #E9ECEF, radius:16px, p:24px)
                │       ├── .trend-section1-card-content (마크다운 → HTML)
                │       └── .trend-section1-thumbnails
                │           └── .trend-thumbnails-grid (grid, 10col → 반응형)
                │               └── .trend-thumbnail-card * N (자사몰 상품)
                │
                ├── [Section 2] .trend-section2-container (mt:32px, mb:32px)
                │   ├── h2.trend-section2-header "KEYWORD" (20px, 600)
                │   └── .trend-section2-grid (grid, 2col, gap:24px)
                │       ├── .trend-section2-card (Material Trend)
                │       │   ├── .trend-section2-card-header
                │       │   │   ├── span.trend-section2-card-icon "🧶"
                │       │   │   └── h3 "Material Trend 소재 트렌드"
                │       │   └── .trend-section2-card-content (마크다운 → HTML)
                │       └── .trend-section2-card (Mood & Style)
                │           ├── .trend-section2-card-header
                │           │   ├── span.trend-section2-card-icon "✨"
                │           │   └── h3 "Mood & Style 무드 & 스타일"
                │           └── .trend-section2-card-content (마크다운 → HTML)
                │
                └── [Section 3] .trend-section3-container (mt:32px, mb:24px)
                    ├── h2.trend-section3-header "TRENDS" (18px, 700)
                    ├── .market-trend-tabs-wrapper (border-bottom:1px #E9ECEF)
                    │   └── .market-trend-tabs#section3Tabs (flex, padding:0 24px)
                    │       ├── button.market-trend-tab-btn "급상승" [active]
                    │       ├── button.market-trend-tab-btn "신규 진입"
                    │       └── button.market-trend-tab-btn "순위 하락"
                    │       └── ::before pseudo (밑줄 인디케이터, 보라 그라디언트, h:3px)
                    └── .trend-section3-content-wrapper#section3Content (p:24px)
                        └── (동적 렌더링) 카테고리별 Card UI
                            └── .trend-category-card * N (border:1px #E9ECEF, radius:12px, p:24px)
                                ├── .trend-category-header (flex-col, pb:16px, border-bottom)
                                │   ├── .trend-category-badge "상의" (그라디언트 보라)
                                │   └── .trend-category-analysis
                                │       ├── .trend-category-headline (16px, 700)
                                │       └── .trend-category-insight (마크다운 → HTML)
                                └── .trend-category-thumbnails
                                    └── .trend-thumbnails-grid (grid)
                                        └── .trend-thumbnail-card * 6 (상위 6개)
```

---

## 5. JS 전역 상태 변수

```javascript
// ─── 페이지 타입 (Ably 분기) ───
const PAGE_TYPE = 'ably';                        // pageType 템플릿 변수에서 설정
const IS_ABLY = true;                            // PAGE_TYPE === 'ably'

// ─── API 엔드포인트 ───
const API_ENDPOINT = '/dashboard/trend/ably';           // IS_ABLY ? '/dashboard/trend/ably' : '/dashboard/trend'
const TABS_ENDPOINT = '/dashboard/trend/ably/tabs';     // IS_ABLY ? '/dashboard/trend/ably/tabs' : '/dashboard/trend/tabs'

// ─── 탭 상태 ───
let currentTab = "상의";                         // IS_ABLY ? "상의" : "전체" (동적으로 첫 탭으로 변경됨)
let availableTabs = ["상의"];                     // IS_ABLY ? ["상의"] : ["전체"] (서버에서 로드)
let currentTrendType = "risingStar";              // "risingStar" | "newEntry" | "rankDrop"

// ─── 데이터 캐싱 ───
let allTabsData = {};                            // 모든 탭 데이터를 메모리에 저장 (API 1회 호출)
window.allTabsData = allTabsData;               // 전역으로 설정 (Section 3 썸네일용)
let currentWeek = "";                            // run_id (예: "2026W08_WEEKLY_POPULARITY")

// ─── Insight 사이드바 ───
// window.trendInsights = { analysis_report: "...", generated_at: "..." };  // API 응답에서 저장

// ─── 테이블 내부 상태 (createTableWithPagination 클로저) ───
// let sortColumn = null;                        // 정렬 컬럼 ('brand'|'rank_change'|'current_rank'|'previous_rank')
// let sortDirection = null;                     // 'asc' | 'desc'
// let sortedData = [...data];                   // 정렬된 데이터
// let isExpanded = false;                       // 더보기 상태
// const INITIAL_ITEMS = 4;                      // 초기 표시 행 수

// ─── localStorage / sessionStorage ───
// localStorage: 'trend_last_viewed_ably'        // 마지막으로 본 주차 (NEW 배지용)
// sessionStorage: 'trend_insights_viewed'       // 현재 세션에서 Insights 열어본 여부 (NEW 배지용)

// ─── 브랜드 매핑 (자사몰 상품 필터링용, JS 하드코딩) ───
const brandMapping = {
    'piscess': ['파이시스', 'PISCESS', 'piscess', 'Piscess'],
    'somewherebutter': ['썸웨어버터', 'Somewhere Butter', 'SOMEWHERE BUTTER', 'somewherebutter', 'SomewhereButter'],
    'demo': ['파이시스', 'PISCESS', 'piscess', 'Piscess']  // 데모는 piscess와 동일
};
```

---

## 6. HTML 요소 맵

### 페이지 헤더 & 탭

| ID / 클래스 | 타입 | 역할 | 기본값 |
|-------------|------|------|--------|
| `#trendPageTitle` | h1 | 페이지 제목 (동적 업데이트) | "Ably 트렌드" |
| `.trend-page-update-info` | span | 업데이트 주기 안내 | "↻ 매주 월요일 오전 9시 업데이트" |
| `#trendTabs` | div | 카테고리 탭 컨테이너 (동적 생성) | - |
| `.trend-tab-btn` | button | 카테고리 탭 버튼 (동적 생성) | data-tab="상의" |
| `#trendTypeTabs` | div | 트렌드 타입 탭 컨테이너 | - |
| `.trend-type-tab-btn` | button | 트렌드 타입 탭 버튼 (3개 고정) | data-type="risingStar" |

### 테이블

| ID / 클래스 | 타입 | 역할 | 기본값 |
|-------------|------|------|--------|
| `#trendTableContent` | div | 테이블 렌더링 대상 | "데이터를 불러오는 중..." |
| `.trend-table-wrapper` | div | 테이블 + 페이지네이션 래퍼 (동적) | - |
| `.trend-table-scroll-container` | div | 스크롤 컨테이너 (더보기 시 maxH:600px) | - |
| `.trend-table` | table | 랭킹 테이블 | - |
| `#${tableId}Table` | table | 테이블 ID (예: risingStarTable) | - |
| `#${tableId}Tbody` | tbody | 테이블 바디 | - |
| `#${tableId}Pagination` | div | 페이지네이션 컨테이너 | - |
| `.trend-show-more-btn` | button | 더보기 버튼 | "더보기 (N개 더)" |
| `.trend-collapse-btn` | button | 접기 버튼 | display:none |
| `.trend-thumbnail-cell` | td | 썸네일 셀 (120x120px) | - |
| `.trend-thumbnail` | img | 썸네일 이미지 (120x120, object-fit:cover) | - |
| `.trend-rank-number` | td | 숫자 셀 (22px, 700) | - |
| `.trend-rank-change` | div | 순위변화 표시 (▲/▼ + 숫자) | - |
| `.trend-rank-change.up` | div | 순위 상승 (빨간색 #DC3545) | - |
| `.trend-rank-change.down` | div | 순위 하락 (파란색 #0066CC) | - |
| `.trend-rank-change-icon` | span | ▲/▼ 아이콘 (14px) | - |
| `.sortable` | th | 정렬 가능 컬럼 헤더 | cursor:pointer |
| `.sort-icon` | span | 정렬 아이콘 (⇅/↑/↓) | "⇅" |
| `.hide-mobile` | class | 모바일 숨김 클래스 | 지난주 순위 컬럼 |

### Insights 사이드바

| ID / 클래스 | 타입 | 역할 | 기본값 |
|-------------|------|------|--------|
| `#trendAnalysisToggleBtn` | div | Insights 고정 버튼 (right:0, bottom:20px) | "Insights" |
| `.btn-new-badge` | span | NEW 배지 (빨간 점, 펄스) | 세션 미열람 시 표시 |
| `#trendAnalysisSidebar` | div | 사이드바 래퍼 | .hidden |
| `.trend-analysis-sidebar-wrapper` | div | 사이드바 (1600px, 슬라이드 애니메이션) | translateX(100%) |
| `.trend-analysis-header-bar` | div | 사이드바 헤더 바 (60px, 블랙) | - |
| `.trend-analysis-header-title` | div | 헤더 타이틀 "트렌드 데이터 분석" | - |
| `#closeTrendAnalysisSidebarBtn` | button | 닫기 버튼 "×" (32px) | - |
| `.trend-analysis-sidebar-content` | div | 사이드바 본문 (p:24px, scroll) | - |
| `#trendAnalysisTitle` | h3 | 분석 제목 (동적 주차 업데이트) | "Ably 트렌드 데이터 분석" |
| `.trend-analysis-update-info` | span | 분석 업데이트 정보 | "매주 월요일 오전 7시5분 업데이트" |
| `#trendAnalysisCreatedAt` | span | 생성일 표시 | "생성일: -" |
| `#trendAnalysisContent` | div | 분석 콘텐츠 렌더링 대상 | "분석 데이터를 불러오는 중..." |

### Insight 사이드바 내부 동적 요소

| 클래스 | 타입 | 역할 |
|--------|------|------|
| `.trend-analysis-report-container` | div | 전체 리포트 컨테이너 |
| `.trend-section1-container` | div | Section 1 (MY BRAND) 컨테이너 |
| `.trend-section1-header` | h2 | "MY BRAND" |
| `.trend-section1-card` | div | MY BRAND 카드 (radius:16px) |
| `.trend-section1-card-content` | div | 마크다운 HTML 콘텐츠 |
| `.trend-section1-thumbnails` | div | 자사몰 상품 썸네일 영역 |
| `.trend-section2-container` | div | Section 2 (KEYWORD) 컨테이너 |
| `.trend-section2-header` | h2 | "KEYWORD" |
| `.trend-section2-grid` | div | 2열 그리드 |
| `.trend-section2-card` | div | Material / Mood 카드 |
| `.trend-section2-card-header` | div | 카드 헤더 (아이콘 + 제목) |
| `.trend-section2-card-icon` | span | 아이콘 (🧶 / ✨) |
| `.trend-section2-card-title` | h3 | 카드 제목 |
| `.trend-section2-card-content` | div | 마크다운 HTML 콘텐츠 |
| `.trend-section3-container` | div | Section 3 (TRENDS) 컨테이너 |
| `.trend-section3-header` | h2 | "TRENDS" |
| `.market-trend-tabs-wrapper` | div | Section3 탭 래퍼 |
| `#section3Tabs` | div | Section3 탭 컨테이너 |
| `.market-trend-tab-btn` | button | Section3 세그먼트 탭 (밑줄 인디케이터) |
| `#section3Content` | div | Section3 콘텐츠 래퍼 |
| `.trend-category-card` | div | 카테고리별 카드 (radius:12px) |
| `.trend-category-header` | div | 카테고리 헤더 영역 |
| `.trend-category-badge` | div | 카테고리 뱃지 (보라 그라디언트) |
| `.trend-category-analysis` | div | 카테고리 분석 영역 |
| `.trend-category-headline` | div | 카테고리 헤드라인 (16px, 700) |
| `.trend-category-insight` | div | 카테고리 인사이트 텍스트 |
| `.trend-category-thumbnails` | div | 카테고리 썸네일 그리드 영역 |
| `.trend-thumbnails-grid` | div | 썸네일 그리드 (10col → 반응형) |
| `.trend-thumbnail-card` | div | 개별 썸네일 카드 |
| `.trend-thumbnail-link` | a | 썸네일 링크 (target:_blank) |
| `.trend-thumbnail-image-wrapper` | div | 이미지 래퍼 (aspect-ratio:1) |
| `.trend-thumbnail-image` | img | 상품 이미지 |
| `.trend-thumbnail-rank` | div | 순위 배지 (absolute, top:6px, left:6px) |
| `.trend-thumbnail-info` | div | 상품 정보 (padding:8px) |
| `.trend-thumbnail-brand` | div | 브랜드명 (9px, #868E96) |
| `.trend-thumbnail-name` | div | 상품명 (11px, 2줄 말줄임) |
| `.trend-thumbnail-rank-change` | div | 순위변화 텍스트 (10px, 600) |
| `.trend-thumbnail-price` | div | 가격 (11px, 600, #003366) |

---

## 7. 섹션별 상세 스펙

### 7-1. 카테고리 탭 + 트렌드 타입 탭

#### ASCII 목업

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Ably 2026년 2월 4주차 트렌드      ↻ 매주 월요일 오전 9시 업데이트      │
├─────────────────────────────────────────────────────────────────────────┤
│ [상의] [바지] [스커트] [원피스] [니트웨어] [아우터] [셋업] [...]        │
│                                                                         │
│ ┌──────────────┬──────────────┬──────────────┐                         │
│ │   급상승     │   신규 진입   │   순위 하락   │  ← Segmented Control  │
│ │  (active)    │              │              │                         │
│ └──────────────┴──────────────┴──────────────┘                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**카테고리 탭 동작:**
1. 페이지 로드 시 `GET /dashboard/trend/ably/tabs` 호출
2. 응답 `tabs` 배열로 버튼 동적 생성
3. 탭 클릭 → `switchTab(tabName)` → `currentTab` 변경 → `displayCurrentTabData()` (API 재호출 없음)

**트렌드 타입 탭 동작:**
1. HTML에 3개 고정 (`risingStar`, `newEntry`, `rankDrop`)
2. 탭 클릭 → `currentTrendType` 변경 → `displayCurrentTabData()`
3. `risingStar` / `rankDrop`: 순위변화 컬럼 표시 (`showRankChange=true`)
4. `newEntry`: 순위변화 컬럼 숨김 (`showRankChange=false`)

### 7-2. 랭킹 테이블

#### ASCII 목업

```
┌─────────┬──────────┬──────────┬────────────────────┬──────────┬──────────┬──────────┐
│ 랭킹    │ 썸네일   │ 브랜드 ⇅ │ 상품명             │ 순위변화 ⇅│ 이번주 ⇅ │ 지난주 ⇅ │
├─────────┼──────────┼──────────┼────────────────────┼──────────┼──────────┼──────────┤
│상의 3위 │ [120px]  │ 파이시스 │ [최대 50자...]     │  ▲ 45    │   3      │   48     │
│상의 7위 │ [120px]  │ 썸웨어.. │ [상품명...]        │  ▲ 32    │   7      │   39     │
│상의 12위│ [120px]  │ 지니추   │ [상품명...]        │  ▲ 28    │   12     │   40     │
│상의 15위│ [120px]  │ 크라시앙 │ [상품명...]        │  ▲ 22    │   15     │   37     │
├─────────┴──────────┴──────────┴────────────────────┴──────────┴──────────┴──────────┤
│                          [ 더보기 (16개 더) ]                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**테이블 컬럼 스펙:**

| 컬럼 | 너비 | 폰트 | 정렬 | 정렬 가능 | 비고 |
|------|------|------|------|----------|------|
| 랭킹 | auto | 14px | left | No | "상의 3위" 형식 |
| 썸네일 | 120px | - | center | No | 120x120, object-fit:cover, 클릭 → 상품 URL |
| 브랜드 | auto | 14px | left | Yes (문자열) | - |
| 상품명 | max:250px, min:150px | 14px | left | No | 50자 초과 시 "...", hover 시 전체 표시 |
| 순위변화 | auto | 22px 700 | center | Yes (숫자) | ▲빨간/▼파란, risingStar/rankDrop만 |
| 이번주 순위 | auto | 22px 700 | center | Yes (숫자) | - |
| 지난주 순위 | auto | 22px 700 | center | Yes (숫자) | hide-mobile, newEntry: "순위없음" |

**Ably 순위변화 부호 규칙:**
- `risingStar` 탭: `Rank_Change` = 양수 (지난주 - 이번주), 항상 ▲ (빨간)
- `rankDrop` 탭: `Rank_Change` = 양수 (이번주 - 지난주), 항상 ▼ (파란)
- `newEntry` 탭: `Rank_Change` = null, 순위변화 컬럼 숨김

**데이터 정렬 기본값:**
- `risingStar`: Rank_Change 내림차순 (큰 수 먼저)
- `rankDrop`: Rank_Change 내림차순 (큰 수 = 더 많이 하락) ← **Ably 전용** (29CM은 오름차순)
- `newEntry`: This_Week_Rank 오름차순 (낮은 순위 먼저)

**더보기/접기 동작:**
1. 초기: 상위 4개만 표시
2. 더보기 클릭: 전체 표시, maxHeight:600px, overflowY:auto, thead sticky
3. 접기 클릭: 4개로 축소, maxHeight:none, 테이블 상단으로 스크롤

### 7-3. Insight 사이드바 — AI 분석 리포트

#### ASCII 목업

```
                                                    ┌──────────────────┐
                                                    │     Insights     │ ← 고정 버튼
                                                    │  (● NEW badge)   │    vertical-rl
                                                    └──────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│ ■ 트렌드 데이터 분석                                                             [×]│  ← 블랙 헤더
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  Ably 2월 4주차 트렌드 데이터 분석        매주 월요일 오전 7시5분 업데이트          │
│  생성일: 2026. 2. 24. 오전 9:44                                                      │
│  ─────────────────────────────────────────────────────────────────────────────────── │
│                                                                                      │
│  ┌── MY BRAND ──────────────────────────────────────────────────────────────────┐    │
│  │                                                                              │    │
│  │  이번 주 Ably 베스트 랭킹에 **파이시스** 상품이 포함되었습니다.              │    │
│  │  • 상의 카테고리 급상승: ...                                                 │    │
│  │                                                                              │    │
│  │  [썸네일] [썸네일] [썸네일]  ← 자사몰 상품 그리드                            │    │
│  └──────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
│  ┌── KEYWORD ───────────────────────────────────────────────────────────────────┐    │
│  │  ┌──────────────────┐  ┌──────────────────┐                                  │    │
│  │  │ 🧶 Material      │  │ ✨ Mood & Style  │  ← 2열 그리드                    │    │
│  │  │ Trend            │  │                  │                                  │    │
│  │  │                  │  │                  │                                  │    │
│  │  │ • 린넨 소재 강세 │  │ • 미니멀 무드... │                                  │    │
│  │  │ • 면 혼방 증가   │  │ • Y2K 감성 ...  │                                  │    │
│  │  └──────────────────┘  └──────────────────┘                                  │    │
│  └──────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
│  ┌── TRENDS ────────────────────────────────────────────────────────────────────┐    │
│  │  [ 급상승 ]  [ 신규 진입 ]  [ 순위 하락 ]  ← 밑줄 인디케이터 탭             │    │
│  │  ─────────────────────────────────────────                                   │    │
│  │                                                                              │    │
│  │  ┌── 상의 ──────────────────────────────────────────────────────────────┐    │    │
│  │  │  [카테고리 뱃지: 상의]                                               │    │    │
│  │  │  (AI 분석 텍스트 - 마크다운 렌더링)                                  │    │    │
│  │  │                                                                      │    │    │
│  │  │  [썸네일] [썸네일] [썸네일] [썸네일] [썸네일] [썸네일]  ← 상위 6개   │    │    │
│  │  └──────────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                              │    │
│  │  ┌── 바지 ──────────────────────────────────────────────────────────────┐    │    │
│  │  │  (동일 구조)                                                         │    │    │
│  │  └──────────────────────────────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### Insight 사이드바 열기/닫기

| 트리거 | 동작 |
|--------|------|
| Insights 버튼 클릭 | sidebar.classList.add('active'), NEW 배지 제거, 리포트 로드 |
| X 버튼 클릭 | sidebar.classList.remove('active'), 300ms 후 .hidden 추가 |
| ESC 키 | X 버튼과 동일 |

#### AI 리포트 텍스트 구조 (마크다운)

스냅샷 `insights.analysis_report` 필드에 저장된 마크다운 텍스트:

```markdown
## Section 1. 자사몰(파이시스) 성과 분석

이번 주 Ably 베스트 랭킹에 **파이시스** 상품이 포함되었습니다.
...

## Section 2. 키워드 트렌드

**Material (소재):**
- 린넨/마 소재 급부상...
- 면 혼방 증가...

**Mood (무드 & 스타일):**
- 미니멀 무드 지속...
- Y2K 감성...

## Section 3. Segment Deep Dive

**🔥 급상승 (Rising Star)**

**상의:**
크로셰 니트와 린넨 소재의 급상승이 두드러집니다...

**바지:**
와이드 팬츠와 카프리 팬츠가...

**🚀 신규 진입 (New Entry)**

**상의:**
...

**📉 순위 하락 (Rank Drop)**

**상의:**
...
```

#### 리포트 파싱 → 렌더링 흐름

```
analysis_report (마크다운 텍스트)
  │
  ├─ parseAnalysisReportSections(text)
  │   └─ { section1, section2, section3 }
  │
  ├─ Section 1 → renderSection1AsCard(section1)
  │   ├─ 마크다운 → HTML (marked.js + DOMPurify)
  │   ├─ getCompanyProducts() → 자사몰 상품 필터링
  │   │   └─ brandMapping[companyName]으로 allTabsData에서 브랜드 매칭
  │   └─ createThumbnailGridFromProducts() → 썸네일 그리드
  │
  ├─ Section 2 → parseSection2IntoMaterialAndTPO(section2)
  │   ├─ { material, mood }
  │   ├─ ⚠️ **KNOWN BUG**: early return 경로는 `{ material: '', tpo: '' }` (키: `tpo`)를 반환하지만,
  │   │   정상 return 경로는 `{ material, mood }` (키: `mood`)를 반환함.
  │   │   소비자(renderSection2AsCards)는 `mood` 키를 기대하므로, early return 시 mood가 undefined가 됨.
  │   └─ renderSection2AsCards(section2Data)
  │       ├─ createSection2Card('🧶', 'Material Trend', '소재 트렌드', material)
  │       └─ createSection2Card('✨', 'Mood & Style', '무드 & 스타일', mood)
  │
  └─ Section 3 → parseSection3BySegment(section3)
      ├─ { rising_star, new_entry, rank_drop }  (세그먼트별 텍스트)
      └─ renderSection3WithTabs(section3Data)
          └─ 탭 클릭 → renderSection3SegmentContent(segmentType, text, container)
              ├─ 카테고리 헤더 파싱: **{카테고리명}:** 패턴
              ├─ 카테고리별 텍스트 추출 → 마크다운 → HTML
              ├─ getProductsByCategory(categoryName, trendType) → 상위 6개
              └─ 카테고리 Card UI 렌더링 (뱃지 + 분석 텍스트 + 썸네일 그리드)
```

#### 마크다운 렌더링 스펙

- **라이브러리**: `marked.js` (CDN) + `DOMPurify` (CDN)
- **marked 옵션**: `{ breaks: true, gfm: false, headerIds: false, mangle: false }`
- **DOMPurify 허용 태그**: `p, br, strong, em, u, ul, ol, li, span, mark, blockquote`
- **폴백** (marked 없을 때): 수동 정규식 변환 (`**text**` → `<strong>text</strong>`, `\n` → `<br>`)

#### 썸네일 그리드 반응형

| 뷰포트 | 컬럼 수 |
|---------|---------|
| > 1800px | 10 |
| 1400~1800px | 8 |
| 1024~1400px | 6 |
| 768~1024px | 5 |
| 480~768px | 4 |
| < 480px | 2 |

#### 썸네일 카드 내부

```
┌──────────────────────┐
│ ┌──────────────────┐ │
│ │    [상품 이미지]  │ │  ← aspect-ratio: 1, object-fit: cover
│ │ [3위]            │ │  ← 순위 배지 (absolute, bg:#003366)
│ └──────────────────┘ │
│ 파이시스               │  ← 브랜드명 (9px, #868E96)
│ 린넨 크롭 블라우스     │  ← 상품명 (11px, 2줄 말줄임)
│ 🔥 +45위 급상승       │  ← 순위변화 (10px, #DC3545)
│ 28,900원              │  ← 가격 (11px, #003366)
└──────────────────────┘
```

---

## 8. 핵심 함수 흐름

```
$(document).ready
  ├─ loadTabs()                              → GET /dashboard/trend/ably/tabs
  │   ├─ availableTabs = data.tabs
  │   ├─ currentTab = availableTabs[0]       (Ably: 첫 번째 카테고리)
  │   ├─ renderTabs()                        → #trendTabs에 버튼 동적 생성
  │   └─ .then → loadAllTabsData()
  │
  ├─ setupTrendTypeTabs()                    → .trend-type-tab-btn에 click 이벤트
  │   └─ click → currentTrendType 변경 → displayCurrentTabData()
  │
  └─ setupTrendAnalysisToggle()              → Insights 버튼/사이드바 이벤트
      ├─ NEW 배지 추가 (sessionStorage 확인)
      ├─ toggleBtn.click → sidebar.active, loadTrendAnalysisReport()
      ├─ closeBtn.click → sidebar.remove('active'), 300ms → .hidden
      └─ ESC 키 → 닫기

loadAllTabsData()
  ├─ companyName 결정 (URL 파라미터 > window.selectedCompany > accountFilter)
  ├─ POST /dashboard/trend/ably
  │   body: { tab_names: availableTabs, trend_type: "all", company_name: "piscess" }
  ├─ allTabsData = data.tabs_data
  ├─ window.trendInsights = data.insights
  ├─ updatePageTitle(currentWeek)
  ├─ localStorage.setItem('trend_last_viewed_ably', currentWeek)
  └─ displayCurrentTabData()

displayCurrentTabData()
  ├─ tabData = allTabsData[currentTab]
  ├─ switch(currentTrendType)
  │   ├─ 'risingStar' → data = tabData.rising_star, showRankChange=true
  │   ├─ 'newEntry'   → data = tabData.new_entry,   showRankChange=false
  │   └─ 'rankDrop'   → data = tabData.rank_drop,   showRankChange=true
  ├─ data 정렬 (기본 정렬 규칙 적용)
  └─ createTableWithPagination(data, showRankChange, currentTrendType)
      ├─ 테이블 헤더 생성 (정렬 가능 컬럼에 click 이벤트)
      ├─ 초기 4개 행 렌더링: renderTableRows(sortedData.slice(0,4), ...)
      ├─ 더보기 버튼 생성 (data.length > 4 일 때)
      └─ 접기 버튼 생성

switchTab(tabName)
  ├─ currentTab = tabName
  ├─ 탭 버튼 활성 상태 업데이트
  └─ displayCurrentTabData()  (API 호출 없음)

renderTableRows(items, tbody, showRankChange, tableId)
  └─ items.forEach → 행 생성
      ├─ td: Ranking
      ├─ td: 썸네일 (img + a[target=_blank])
      ├─ td: Brand_Name
      ├─ td: Product_Name (Ably: 50자 제한)
      ├─ td: Rank_Change (조건부)
      │   ├─ risingStar 탭: 항상 ▲ (빨간)
      │   ├─ rankDrop 탭: 항상 ▼ (파란)
      │   └─ abs(changeValue) 표시
      ├─ td: This_Week_Rank (22px 700)
      └─ td: Last_Week_Rank (newEntry: "순위없음")

loadTrendAnalysisReport()
  ├─ window.trendInsights 있으면 → renderTrendAnalysisReport() 직접 호출
  └─ 없으면 → POST /dashboard/trend/ably (재호출)
      └─ 응답에서 insights 추출 → renderTrendAnalysisReport()

renderTrendAnalysisReport(insights, createdAtElement)
  ├─ 생성일 업데이트 (#trendAnalysisCreatedAt)
  ├─ parseAnalysisReportSections(analysisText)
  │   └─ 정규식으로 Section 1/2/3 분리
  ├─ renderSection1AsCard(section1)
  │   ├─ 마크다운 → HTML (marked + DOMPurify)
  │   └─ getCompanyProducts() → 자사몰 썸네일 추가
  ├─ parseSection2IntoMaterialAndTPO(section2)
  │   └─ renderSection2AsCards({ material, mood })
  └─ parseSection3BySegment(section3)
      └─ renderSection3WithTabs({ rising_star, new_entry, rank_drop })
          └─ 탭 click → renderSection3SegmentContent(segmentType, text, container)
              ├─ 카테고리 헤더 정규식 파싱: /^\*\*([^:]+):\*\*/
              ├─ 카테고리별 텍스트 추출 + 마크다운 → HTML
              ├─ getProductsByCategory(categoryName, trendType) → 상위 6개
              └─ Card UI 렌더링 (뱃지 + 분석 + 썸네일)

parseWeekInfo(currentWeek)
  └─ run_id (예: "2026W08_WEEKLY_POPULARITY") → { year, month, week } 객체 변환

updateTrendAnalysisTitle(currentWeek)
  └─ 사이드바 분석 제목 (#trendAnalysisTitle) 업데이트 (주차 정보 반영)

refreshTrendAnalysisTitle()
  └─ 사이드바 열릴 때 호출되는 래퍼 → updateTrendAnalysisTitle(currentWeek) 호출

showLoading()
  └─ #trendTableContent에 로딩 상태 표시

showError(message)
  └─ #trendTableContent에 에러 메시지 표시

createEmptySection1Container()
  └─ MY BRAND 섹션 빈 상태 폴백 (자사몰 상품이 없을 때)
```

---

## 9. API 엔드포인트 레퍼런스

### 9-1. `GET /dashboard/trend/ably/tabs`

**설명**: 사용 가능한 Ably 카테고리 탭 목록 조회

**인증**: 불필요 (public)

**Request**:
```
GET /dashboard/trend/ably/tabs
```

**Response (200)**:
```json
{
  "status": "success",
  "tabs": [
    "니트웨어",
    "바지",
    "비치웨어",
    "상의",
    "스커트",
    "아우터",
    "언더웨어",
    "원피스",
    "점프수트",
    "파티복/행사복",
    "해외브랜드",
    "홈웨어",
    "셋업"
  ]
}
```

**Response (500)**:
```json
{
  "status": "error",
  "message": "에러 메시지"
}
```

**서비스 함수**: `trend_ably_service.get_available_tabs()`
- BigQuery: `SELECT DISTINCT category_medium FROM platform_ably_best WHERE period_type='WEEKLY' AND run_id = (최신 run_id)`
- 캐싱: 24시간 (`@cached_query ttl=86400`)

---

### 9-2. `POST /dashboard/trend/ably`

**설명**: Ably 트렌드 데이터 조회 (스냅샷 우선, 없으면 에러 반환)

**인증**: 필수 (`@login_required` — 세션 또는 JWT Bearer 토큰)

**Request**:
```json
{
  "tab_names": ["상의", "바지", "스커트", "원피스", "니트웨어", "아우터"],
  "trend_type": "all",
  "company_name": "piscess"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `tab_names` | `string[]` | 선택 | 여러 탭 한 번에 요청 (우선) |
| `tab_name` | `string` | 선택 | 단일 탭 (하위 호환) |
| `trend_type` | `string` | 선택 | `"all"` \| `"rising"` \| `"new_entry"` \| `"rank_drop"` (기본: `"all"`) |
| `company_name` | `string` | 선택 | 업체명 (자사몰 필터링용, `"demo"` → `"piscess"` 매핑) |

**Response — 여러 탭 (200)**:
```json
{
  "status": "success",
  "current_week": "2026W08_WEEKLY_POPULARITY",
  "tabs_data": {
    "상의": {
      "rising_star": [
        {
          "Ranking": "상의 3위",
          "Brand_Name": "파이시스",
          "Product_Name": "린넨 크롭 블라우스",
          "Rank_Change": 45,
          "This_Week_Rank": 3,
          "Last_Week_Rank": 48,
          "thumbnail_url": "https://d3ha2047wt6x28.cloudfront.net/...",
          "price": 28900,
          "item_url": "https://m.a-bly.com/goods/57339317",
          "current_run_id": "2026W08_WEEKLY_POPULARITY"
        }
      ],
      "new_entry": [
        {
          "Ranking": "상의 15위",
          "Brand_Name": "크라시앙",
          "Product_Name": "크로셰 니트 탑",
          "Rank_Change": null,
          "This_Week_Rank": 15,
          "Last_Week_Rank": "New",
          "thumbnail_url": "https://d3ha2047wt6x28.cloudfront.net/...",
          "price": 31000,
          "item_url": "https://m.a-bly.com/goods/41254112",
          "current_run_id": "2026W08_WEEKLY_POPULARITY"
        }
      ],
      "rank_drop": [
        {
          "Ranking": "상의 55위",
          "Brand_Name": "데일리러블리",
          "Product_Name": "베이직 코튼 티셔츠",
          "Rank_Change": 40,
          "This_Week_Rank": 55,
          "Last_Week_Rank": 15,
          "thumbnail_url": "https://d3ha2047wt6x28.cloudfront.net/...",
          "price": 19800,
          "item_url": "https://m.a-bly.com/goods/55036060",
          "current_run_id": "2026W08_WEEKLY_POPULARITY"
        }
      ]
    },
    "바지": { "rising_star": [...], "new_entry": [...], "rank_drop": [...] }
  },
  "insights": {
    "analysis_report": "## Section 1. 자사몰(파이시스) 성과 분석\n\n이번 주 Ably 베스트 랭킹에 **파이시스** 상품이...\n\n## Section 2. 키워드 트렌드\n\n**Material (소재):**\n- 린넨 소재 급부상...\n\n**Mood (무드 & 스타일):**\n- 미니멀 무드...\n\n## Section 3. Segment Deep Dive\n\n**🔥 급상승 (Rising Star)**\n\n**상의:**\n크로셰 니트와...",
    "generated_at": "2026-02-24T09:44:18.808789Z"
  }
}
```

**Response — 단일 탭 (하위 호환, 200)**:
```json
{
  "status": "success",
  "tab_name": "상의",
  "current_week": "2026W08_WEEKLY_POPULARITY",
  "rising_star": [...],
  "new_entry": [...],
  "rank_drop": [...],
  "insights": { "analysis_report": "...", "generated_at": "..." }
}
```

**Response — 스냅샷 없음 (404)**:
```json
{
  "status": "error",
  "message": "해당 업체의 Ably 트렌드 데이터가 아직 준비되지 않았습니다."
}
```

**Response — 주차 정보 없음 (404)**:
```json
{
  "status": "error",
  "message": "주차 정보를 찾을 수 없습니다."
}
```

**Response — 서버 에러 (500)**:
```json
{
  "status": "error",
  "message": "에러 상세 메시지"
}
```

**서비스 흐름**:
1. `get_ably_current_week_info()` → 최신 run_id 조회 (BigQuery, 1시간 캐싱)
2. `load_ably_trend_snapshot_from_gcs(current_week, company_name)` → GCS 스냅샷 로드
   - 경로: `ai-reports/trend/ably/{company_name}/{YYYY}-{MM}-{week}/snapshot.json.gz`
   - `"demo"` → `"piscess"` 매핑
   - 하위 호환: 업체명 폴더 없는 경로도 시도
3. 스냅샷 있으면 → 탭 데이터 + insights 반환
   - `filter_ai_report_by_company()` 로 Section 1 브랜드명 필터링
4. 스냅샷 없으면 → 404 에러 (BigQuery fallback 비활성화)

---

### 9-3. `POST /dashboard/trend/ably/snapshot/create`

**설명**: Ably 트렌드 스냅샷 수동 생성 (관리자용)

**인증**: 필수 (`@login_required`)

**Request**:
```json
{
  "tab_names": ["상의", "바지", "스커트"]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `tab_names` | `string[]` | 선택 | 탭 목록 (비어있으면 자동 조회) |

**Response (200)**:
```json
{
  "status": "success",
  "message": "Ably 스냅샷 생성 완료: 2026W08_WEEKLY_POPULARITY",
  "run_id": "2026W08_WEEKLY_POPULARITY",
  "tabs_count": 13
}
```

**Response (404)**:
```json
{
  "status": "error",
  "message": "주차 정보를 찾을 수 없습니다."
}
```

**Response (500)**:
```json
{
  "status": "error",
  "message": "스냅샷 저장 실패"
}
```

**서비스 흐름**:
1. `get_ably_available_tabs()` → 탭 목록 (기본)
2. `get_ably_current_week_info()` → 현재 주차
3. `get_ably_all_tabs_data_from_bigquery(tab_names)` → 모든 탭의 BigQuery 데이터 조회
4. `save_ably_trend_snapshot_to_gcs(current_week, tabs_data, current_week, enable_ai_analysis=True)`
   - AI 분석 리포트 생성 (`trend_29cm_ai_analyst.generate_trend_analysis_from_snapshot`)
   - JSON → Gzip → GCS 업로드

---

### 9-4. `POST /dashboard/trend/check_new`

**설명**: 새로운 트렌드 데이터 존재 여부 확인 (사이드 네비게이션 NEW 배지용)

**인증**: 필수 (`@login_required`)

**Request**:
```json
{
  "last_viewed_29cm": "2026W07_WEEKLY_POPULARITY",
  "last_viewed_ably": "2026W07_WEEKLY_POPULARITY"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "current_29cm_week": "2026W08_WEEKLY_POPULARITY",
  "current_ably_week": "2026W08_WEEKLY_POPULARITY",
  "has_new_29cm": true,
  "has_new_ably": true
}
```

---

## 10. GCS 스냅샷 데이터 구조

### 스냅샷 파일 경로

```
gs://{GCS_BUCKET}/ai-reports/trend/ably/{company_name}/{YYYY}-{MM}-{week}/snapshot.json.gz
```

**예시**:
```
gs://winged-precept-443218-v8.appspot.com/ai-reports/trend/ably/piscess/2026-02-08/snapshot.json.gz
```

- `company_name`: 소문자, `"demo"` → `"piscess"` 매핑
- `{YYYY}`: ISO 주차 기준 연도
- `{MM}`: ISO 주차 시작일(월요일) 기준 월 (2자리, 01~12)
- `{week}`: ISO 주차 번호 (정수, 1~53)

### 스냅샷 JSON 구조

```json
{
  "run_id": "2026W08_WEEKLY_POPULARITY",
  "current_week": "2026W08_WEEKLY_POPULARITY",
  "created_at": "2026-02-24T09:43:25.566334+00:00",
  "tabs_data": {
    "상의": {
      "rising_star": [
        {
          "Ranking": "상의 3위",
          "Brand_Name": "파이시스",
          "Product_Name": "린넨 크롭 블라우스",
          "Rank_Change": 45,
          "This_Week_Rank": 3,
          "Last_Week_Rank": 48,
          "thumbnail_url": "https://d3ha2047wt6x28.cloudfront.net/...",
          "price": 28900,
          "item_url": "https://m.a-bly.com/goods/57339317",
          "current_run_id": "2026W08_WEEKLY_POPULARITY"
        }
      ],
      "new_entry": [...],
      "rank_drop": [...]
    },
    "바지": { ... },
    "스커트": { ... }
  },
  "insights": {
    "analysis_report": "## Section 1. 자사몰(파이시스) 성과 분석\n\n...",
    "generated_at": "2026-02-24T09:44:18.808789Z"
  }
}
```

### 상품 아이템 필드 맵

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `Ranking` | string | 카테고리 + 순위 | "상의 3위" |
| `Brand_Name` | string | 브랜드명 | "파이시스" |
| `Product_Name` | string | 상품명 (원본) | "린넨 크롭 블라우스" |
| `Rank_Change` | int \| null | 순위 변화 (양수) | 45 (rising), null (new_entry), 40 (rank_drop) |
| `This_Week_Rank` | int | 이번주 순위 | 3 |
| `Last_Week_Rank` | int \| string | 지난주 순위 | 48 또는 "New" (신규진입) |
| `thumbnail_url` | string | 상품 이미지 URL | "https://d3ha2047wt6x28.cloudfront.net/..." |
| `price` | int | 가격 (원) | 28900 |
| `item_url` | string | Ably 상품 페이지 URL | "https://m.a-bly.com/goods/57339317" |
| `current_run_id` | string | run_id | "2026W08_WEEKLY_POPULARITY" |

---

## 11. BigQuery 쿼리 레퍼런스

### 데이터 소스

```
테이블: winged-precept-443218-v8.ngn_dataset.platform_ably_best
```

### Rising Star (급상승) 쿼리

```sql
DECLARE target_category STRING DEFAULT @category_medium;

WITH
weeks AS (
  SELECT DISTINCT run_id FROM `winged-precept-443218-v8.ngn_dataset.platform_ably_best`
  WHERE period_type = 'WEEKLY' ORDER BY run_id DESC LIMIT 2
),
base_data AS (
  SELECT *,
    DENSE_RANK() OVER (ORDER BY run_id DESC) as week_idx,
    REGEXP_EXTRACT(item_url, r'goods/([0-9]+)') as product_id
  FROM `winged-precept-443218-v8.ngn_dataset.platform_ably_best`
  WHERE period_type = 'WEEKLY' AND category_medium = target_category
    AND run_id IN (SELECT run_id FROM weeks)
  QUALIFY ROW_NUMBER() OVER (PARTITION BY run_id, item_url ORDER BY collected_at DESC) = 1
),
curr_week AS (SELECT * FROM base_data WHERE week_idx = 1),
prev_week AS (SELECT * FROM base_data WHERE week_idx = 2)

SELECT
  CONCAT(curr.category_medium, ' ', CAST(curr.rank AS STRING), '위') AS Ranking,
  curr.brand_name AS Brand_Name,
  curr.product_name AS Product_Name,
  (prev.rank - curr.rank) AS Rank_Change,     -- 양수 = 순위 상승
  curr.rank AS This_Week_Rank,
  prev.rank AS Last_Week_Rank,
  curr.thumbnail_url,
  curr.price,
  curr.item_url,
  curr.run_id AS current_run_id
FROM curr_week curr
JOIN prev_week prev ON curr.product_id = prev.product_id
WHERE prev.rank > curr.rank                   -- 이번주가 더 높은 순위
ORDER BY Rank_Change DESC
LIMIT 20
```

**캐싱**: 7일 (`@cached_query func_name="trend_ably_rising", ttl=604800`)

### New Entry (신규 진입) 쿼리

```sql
-- 동일 WITH 절 ...

SELECT
  CONCAT(curr.category_medium, ' ', CAST(curr.rank AS STRING), '위') AS Ranking,
  curr.brand_name AS Brand_Name,
  curr.product_name AS Product_Name,
  NULL AS Rank_Change,
  curr.rank AS This_Week_Rank,
  'New' AS Last_Week_Rank,
  curr.thumbnail_url,
  curr.price,
  curr.item_url,
  curr.run_id AS current_run_id
FROM curr_week curr
LEFT JOIN prev_week prev ON curr.product_id = prev.product_id
WHERE curr.rank <= 100
  AND prev.product_id IS NULL               -- 지난주에 없었던 상품
ORDER BY curr.rank ASC
LIMIT 20
```

**캐싱**: 7일 (`@cached_query func_name="trend_ably_new_entry", ttl=604800`)

### Rank Drop (순위 하락) 쿼리

```sql
-- 동일 WITH 절 ...

SELECT
  CONCAT(curr.category_medium, ' ', CAST(curr.rank AS STRING), '위') AS Ranking,
  curr.brand_name AS Brand_Name,
  curr.product_name AS Product_Name,
  (curr.rank - prev.rank) AS Rank_Change,     -- 양수 = 순위 하락 (Ably 특이사항)
  curr.rank AS This_Week_Rank,
  prev.rank AS Last_Week_Rank,
  curr.thumbnail_url,
  curr.price,
  curr.item_url,
  curr.run_id AS current_run_id
FROM curr_week curr
JOIN prev_week prev ON curr.product_id = prev.product_id
WHERE curr.rank > prev.rank                   -- 이번주가 더 낮은 순위 (하락)
ORDER BY Rank_Change DESC
LIMIT 20
```

**캐싱**: 7일 (`@cached_query func_name="trend_ably_rank_drop", ttl=604800`)

### product_id 추출

```
REGEXP_EXTRACT(item_url, r'goods/([0-9]+)')
```

Ably URL 형식: `https://m.a-bly.com/goods/{product_id}`

---

## 12. Next.js 포팅 시 고려사항

### 데이터 페칭 전략

1. **탭 목록**: 서버 컴포넌트에서 초기 로드 또는 클라이언트 SWR/React Query
2. **트렌드 데이터**: 클라이언트에서 POST 1회 호출 → 모든 탭 데이터 메모리 캐싱
3. **탭 전환**: 클라이언트 메모리에서 즉시 렌더링 (API 재호출 없음)

### API 프록시 설정

Flask API는 `/dashboard/trend/ably`로 서빙되므로 Next.js `next.config.ts`에서 리라이트 필요:

```typescript
rewrites: [
  { source: '/api/trend/ably/:path*', destination: 'http://localhost:8080/dashboard/trend/ably/:path*' }
]
```

### 인증

Flask `@login_required`는 세션 + JWT 모두 지원. Next.js에서는 JWT Bearer 토큰으로 인증:

```
Authorization: Bearer {jwt_token}
```

### 마크다운 렌더링

Flask에서는 `marked.js` (CDN) + `DOMPurify` 사용. Next.js에서는:
- `react-markdown` + `rehype-sanitize` 또는
- `@mdx-js/react` 또는
- 직접 `marked` + `dompurify` (클라이언트 전용)

### 주요 상태 관리

```typescript
// Zustand 또는 React Context
interface TrendState {
  currentTab: string;            // 카테고리 탭
  availableTabs: string[];       // 탭 목록
  currentTrendType: 'risingStar' | 'newEntry' | 'rankDrop';
  allTabsData: Record<string, TabData>;  // 모든 탭 데이터 캐시
  currentWeek: string;           // run_id
  trendInsights: Insights | null;
  isSidebarOpen: boolean;
}

interface TabData {
  rising_star: TrendItem[];
  new_entry: TrendItem[];
  rank_drop: TrendItem[];
}

interface TrendItem {
  Ranking: string;
  Brand_Name: string;
  Product_Name: string;
  Rank_Change: number | null;
  This_Week_Rank: number;
  Last_Week_Rank: number | string;
  thumbnail_url: string;
  price: number;
  item_url: string;
  current_run_id: string;
}

interface Insights {
  analysis_report: string;    // 마크다운 텍스트
  generated_at: string;       // ISO 8601
}
```

### 반응형 브레이크포인트 (썸네일 그리드)

```css
/* Tailwind CSS 기준 */
grid-cols-2       /* < 480px */
sm:grid-cols-4    /* 480~768px */
md:grid-cols-5    /* 768~1024px */
lg:grid-cols-6    /* 1024~1400px */
xl:grid-cols-8    /* 1400~1800px */
2xl:grid-cols-10  /* > 1800px */
```
