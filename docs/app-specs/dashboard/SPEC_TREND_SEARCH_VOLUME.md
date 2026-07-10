# SPEC: Search Volume 검색량 분석 페이지 (/trend/search-volume)

> **1:1 Clone 대상** — Flask 검색량 분석 페이지 (Google Search Console + 네이버 검색량)
> **Flask 원본 (Desktop)**: `ngn_wep/dashboard/templates/trend_search_volume.html` (968 lines)
> **Flask 원본 (Mobile)**: `ngn_wep/dashboard/templates/mobile/trend_search_volume.html` (931 lines)
> **Flask 핸들러**: `ngn_wep/dashboard/handlers/data_handler.py`
> **서비스 (네이버)**: `ngn_wep/dashboard/services/naver_search_volume_service.py`
> **서비스 (구글)**: `ngn_wep/dashboard/services/google_search_console_service.py`
> **데모 데이터**: `ngn_wep/dashboard/demo/demo_search_data.py`
> **JS**: HTML 템플릿 내 인라인 `<script>` 블록 (외부 JS 없음)
> **URL (Desktop)**: `/trend/search-volume?company_name=piscess`
> **URL (Mobile)**: `/m/trend/search-volume?company_name=piscess`
> **검증 기준 업체**: piscess
> **버전**: v1.0 (2026-02-28)

---

## 페이지 개요

검색량 분석 페이지는 자사 브랜드의 검색 유입 현황을 한눈에 보여주는 통합 뷰이다.
Google Search Console(실제 검색 유입 키워드)과 네이버 검색량(브랜드 검색량 추이 + 경쟁사 비교)
두 가지 데이터 소스를 하나의 페이지에서 제공한다.

### 주요 기능 요약

| # | 기능 | 설명 |
|---|------|------|
| 1 | **Google 검색 유입** | Search Console API — 최근 28일 검색어별 클릭/노출/CTR/순위 |
| 2 | **네이버 일간 검색량 차트** | 데이터랩 + 검색광고 API 조합 — 자사 브랜드 30일 추산 검색량 라인차트 |
| 3 | **네이버 월간 검색량 비교** | 검색광고 API — 자사 + 경쟁사 월간 검색량 순위 테이블 |
| 4 | **업체 선택 (관리자)** | 관리자는 드롭다운으로 업체 전환 가능 |
| 5 | **데이터 수집 (관리자)** | 데이터 없을 시 관리자가 수동 수집 실행 |

---

## 데이터 플로우 개요

```
[DOMContentLoaded]
  |-- loadSearchVolumeData()   --- 병렬 호출 ---+
  |   +-- GET /dashboard/search-volume          |
  |       ?company={selectedCompany}            |
  |                                             |
  +-- loadSearchConsoleData()  --- 병렬 호출 ---+
      +-- GET /dashboard/search-console
          ?company={selectedCompany}&limit=50&min_clicks=1

[loadSearchVolumeData 응답]
  |-- brands === [] -> 빈 상태 표시 (#emptyState)
  |-- ownBrand 존재 -> renderChart(ownBrand)
  |   |-- 차트 타이틀 업데이트 (#chartBrandName)
  |   |-- 월간/일평균 수치 표시 (#monthlyVolume, #dailyAverage)
  |   +-- Chart.js 라인차트 생성 (#trendChart)
  +-- renderTable(brands, collectedDate)
      |-- 수집일 표시 업데이트 (.table-info)
      +-- 월간 검색량 내림차순 정렬 -> 테이블 렌더링 (#tableBody)

[loadSearchConsoleData 응답]
  |-- queries === [] -> 에러 메시지 표시
  |-- 날짜 범위 표시 (#searchConsoleInfo)
  |-- renderSearchConsoleTable(queries.slice(0, 10))
  +-- queries.length > 10 -> 더보기 버튼 표시 (#searchConsoleMore)

[관리자: 데이터 수집]
  +-- POST /dashboard/search-volume/collect
      body: { company_name: selectedCompany }
      -> 성공 시 location.reload()
```

---

## CSS 변수 / 디자인 토큰

> 이 페이지는 별도 CSS 파일이 아닌 인라인 `<style>` 블록에 스타일이 정의되어 있다.
> 다크 모드 전용이며 Zinc 팔레트 기반이다.

```css
/* 배경 */
--bg-body:          #0a0a0a;
--bg-card:          #18181b;
--bg-table-header:  #111113;
--bg-card-hover:    #1f1f23;     /* 테이블 행 hover (첫 번째 정의) */
--bg-card-hover-2:  #27272a;     /* 테이블 행 hover (우선) */

/* 테두리 */
--border-default:   #27272a;
--border-subtle:    rgba(255, 255, 255, 0.06);  /* 모바일 */
--border-focus:     #22c55e;     /* select focus */

/* 텍스트 */
--text-primary:     #ffffff;
--text-secondary:   #e4e4e7;
--text-muted:       #9ca3af;
--text-hint:        #71717a;
--text-disabled:    rgba(255, 255, 255, 0.4);  /* 모바일 */

/* 브랜드 컬러 */
--accent-green:     #22c55e;     /* 네이버/자사몰 주색 */
--accent-green-light: #4ade80;   /* 자사 배지 텍스트 */
--accent-green-bg:  rgba(34, 197, 94, 0.15);   /* 자사 배지 배경 */
--accent-green-dark: #16a34a;    /* 버튼 hover */
--accent-naver:     #03c75a;     /* 네이버 브랜드 그린 */

--accent-indigo:    #6366f1;     /* 경쟁사 주색 */
--accent-indigo-light: #a5b4fc;  /* 경쟁사 배지 텍스트 */
--accent-indigo-bg: rgba(99, 102, 241, 0.15);  /* 경쟁사 배지 배경 */

--accent-google:    #4285f4;     /* Google Search Console 주색 */

--accent-chart-line:      #22c55e;
--accent-chart-fill:      rgba(34, 197, 94, 0.1);

/* 에러 */
--error-bg:         rgba(239, 68, 68, 0.1);
--error-border:     rgba(239, 68, 68, 0.3);
--error-text:       #fca5a5;

/* 기타 */
--bg-help:          #3f3f46;
--bg-help-hover:    #52525b;
--bg-tooltip:       #27272a;
--tooltip-border:   #3f3f46;
```

### 타이포그래피

```
폰트 패밀리: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
모바일 추가: 'Pretendard'

페이지 타이틀:    2rem (32px), font-weight:700, color:#ffffff
Beta 배지:       Desktop 11px / Mobile 9px, font-weight:600, bg:#22c55e, color:#fff
업데이트 정보:    12px, font-weight:400, color:#71717a
서브타이틀:       1rem (16px), color:#9ca3af

차트 타이틀:      18px, font-weight:600, color:#03c75a
차트 통계 라벨:   11px, color:#71717a
차트 통계 값:     18px, font-weight:700, color:#22c55e

테이블 헤더:      12px, font-weight:600, color:#71717a, uppercase, letter-spacing:0.5px
테이블 셀:        14px, color:#e4e4e7
검색량 값:        15px, font-weight:600, font-variant-numeric:tabular-nums
PC/모바일 값:     14px, color:#71717a

브랜드 이름:      font-weight:500
브랜드 타입 배지:  11px, padding:2px 6px, border-radius:4px
```

---

## 레이아웃 구조

### Desktop (trend_search_volume.html)

```
body (bg:#0a0a0a)
|-- .nav-buttons (position:fixed, top:0, z-index:100)
|   +-- .hamburger-menu-wrapper
|       |-- .hamburger-icon (#hamburgerIcon)
|       +-- .hamburger-dropdown (#hamburgerDropdown)
|
+-- .search-volume-wrapper (max-width:1400px, margin:0 auto, padding:80px 24px 40px 24px)
    |-- .page-header (margin-bottom:32px)
    |   |-- h1.page-title (2rem, font-weight:700, display:flex, gap:16px)
    |   |   |-- "Search Volume"
    |   |   |-- span.beta-badge ("Beta", 11px, bg:#22c55e)
    |   |   +-- span.page-update-info ("NAVER 검색광고 + Datalab 기반 . 매일 업데이트")
    |   |-- p.page-subtitle ("자사 브랜드 검색량 추이 및 경쟁사 비교")
    |   +-- [관리자만] .company-selector
    |       |-- span.company-selector-label ("업체 선택")
    |       +-- select.company-select (#companySelect, onchange -> changeCompany)
    |
    |-- #loadingState (.loading-state, 초기 표시)
    |   |-- .loading-spinner (40x40px, border:3px, green top)
    |   +-- "검색량 데이터 로딩 중..."
    |
    |-- #errorMessage (.error-message, display:none)
    |
    |-- #emptyState (.empty-state, display:none)
    |   |-- "아직 수집된 검색량 데이터가 없습니다."
    |   +-- [관리자만] button.collect-btn (#collectBtn)
    |
    +-- #mainContent (display:none, 데이터 로드 후 표시)
        |
        |-- [Section 1] .table-section #searchConsoleSection (margin-bottom:24px)
        |   |-- .table-header
        |   |   |-- .table-title-wrapper
        |   |   |   |-- .table-title ("Google 검색 유입", color:#4285f4)
        |   |   |   +-- .help-icon ("?")
        |   |   |       +-- .help-tooltip (Google Search Console 설명)
        |   |   +-- .table-info #searchConsoleInfo ("최근 28일 . 클릭 1회 이상")
        |   |-- #searchConsoleLoading (스피너 + "Google Search Console 로딩 중...")
        |   |-- #searchConsoleError (display:none)
        |   |-- table.data-table #searchConsoleTable (display:none)
        |   |   |-- thead: [순위 | 검색어 | 클릭 | 노출 | CTR | 평균순위]
        |   |   +-- tbody #searchConsoleBody
        |   +-- #searchConsoleMore (display:none, 더보기 버튼)
        |       +-- button ("더보기 (N개 더)")
        |
        |-- [Section 2] .chart-section (bg:#18181b, border:1px solid #27272a, radius:8px, padding:24px)
        |   |-- .chart-header (display:flex, justify-content:space-between)
        |   |   |-- .chart-title-wrapper
        |   |   |   |-- .chart-title #chartBrandName ("네이버 일간 검색량 추이", color:#03c75a)
        |   |   |   +-- .help-icon ("?")
        |   |   |       +-- .help-tooltip (추산 검색량 공식 설명)
        |   |   +-- .chart-stats (display:flex, gap:24px)
        |   |       |-- .chart-stat (text-align:right)
        |   |       |   |-- .chart-stat-label ("월간 검색량")
        |   |       |   +-- .chart-stat-value #monthlyVolume ("-")
        |   |       +-- .chart-stat
        |   |           |-- .chart-stat-label ("일평균")
        |   |           +-- .chart-stat-value #dailyAverage ("-")
        |   +-- .chart-container (height:350px)
        |       +-- canvas #trendChart
        |
        +-- [Section 3] .table-section
            |-- .table-header
            |   |-- .table-title-wrapper
            |   |   |-- .table-title ("네이버 월간 검색량 비교", color:#03c75a)
            |   |   +-- .help-icon ("?")
            |   |       +-- .help-tooltip (데이터 출처 설명)
            |   +-- .table-info ("자사 + 경쟁사 브랜드")
            +-- table.data-table
                |-- thead: [순위 | 브랜드 | 월간 검색량 | PC | 모바일]
                +-- tbody #tableBody
```

### Mobile (mobile/trend_search_volume.html)

```
body (bg:#0a0a0a)
+-- .search-container (min-height:100vh)
    |-- header.search-header (position:fixed, h:56px, backdrop-filter:blur(12px))
    |   |-- .header-left (w:44px)
    |   |   +-- a.back-btn -> /m/trend/
    |   |-- .header-title-wrap
    |   |   |-- h1.header-title ("검색량 분석", 16px, font-weight:600)
    |   |   +-- span.beta-badge ("Beta")
    |   +-- .header-right (w:44px, 빈 공간)
    |
    +-- main.search-main (padding:72px 16px 24px)
        |-- [Section 1] .section-card.google-section
        |   |-- .section-header
        |   |   |-- .section-title ("Google 검색 유입", color:#4285f4)
        |   |   +-- .section-info #gscDateRange ("최근 28일")
        |   |-- #gscLoading (.loading-state)
        |   |-- #gscError (.error-state, display:none)
        |   +-- #gscContent (display:none)
        |       |-- .query-list #queryList
        |       |   +-- .query-item x N
        |       |       |-- .query-rank (w:28px)
        |       |       |-- .query-info
        |       |       |   |-- .query-text (14px, font-weight:500, ellipsis)
        |       |       |   +-- .query-meta (노출/CTR/순위)
        |       |       +-- .query-clicks
        |       |           |-- .clicks-value (15px, font-weight:700, color:#4285f4)
        |       |           +-- .clicks-label ("클릭")
        |       +-- button.more-btn #gscMoreBtn (display:none)
        |
        |-- [Section 2] .section-card.naver-section
        |   +-- .chart-section (padding:20px)
        |       |-- .chart-header
        |       |   |-- .chart-title #chartTitle ("네이버 일간 검색량 추이")
        |       |   |-- .chart-subtitle ("자사 브랜드 30일 추이")
        |       |   +-- .chart-stats
        |       |       |-- .chart-stat: 월간 검색량 #monthlyVolume
        |       |       +-- .chart-stat: 일평균 #dailyAverage
        |       +-- .chart-wrapper (h:200px)
        |           +-- canvas #searchChart
        |
        |-- [Section 3] .section-card.naver-section
        |   |-- .section-header
        |   |   |-- .section-title ("네이버 월간 검색량 비교", color:#03c75a)
        |   |   +-- .section-info #brandCollectedDate ("자사 + 경쟁사")
        |   |-- #brandLoading (.loading-state)
        |   |-- #brandError (.error-state, display:none)
        |   +-- .brand-list #brandList (display:none)
        |       +-- .brand-item x N
        |           |-- .brand-rank (w:28px)
        |           |-- .brand-indicator (.own | .competitor, 4x32px)
        |           |-- .brand-info-wrap
        |           |   |-- .brand-name-row
        |           |   |   |-- .brand-name
        |           |   |   +-- [자사만] .brand-type.own ("자사")
        |           |   +-- .brand-volume-breakdown ("PC N / 모바일 N")
        |           +-- .brand-volume
        |               |-- .volume-value (16px, font-weight:700)
        |               +-- .volume-label ("월간 검색량")
        |
        +-- #emptyState (.empty-state, display:none)

    +-- #loadingOverlay (.loading-overlay)
    +-- #toastContainer
```

---

## JS 전역 상태 변수

### Desktop

```javascript
// Flask 템플릿에서 주입
const selectedCompany = "piscess";       // 현재 선택된 업체명
const isAdmin = false;                    // 관리자 여부

// 차트 인스턴스
let trendChart = null;                    // Chart.js 인스턴스 (renderChart에서 생성)

// Search Console
let allSearchConsoleQueries = [];        // 전체 검색어 배열 (API 응답)
const INITIAL_SHOW_COUNT = 10;           // 초기 표시 개수
```

### Mobile

```javascript
var companyName = "piscess";             // Flask 템플릿에서 주입된 업체명
var searchChart = null;                   // Chart.js 인스턴스
var allQueries = [];                      // 전체 Search Console 검색어 배열
var INITIAL_SHOW_COUNT = 10;             // 초기 표시 개수
```

---

## HTML 요소 맵

### Desktop -- 공통 / 페이지 레벨

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.nav-buttons` | div | 상단 고정 네비게이션 바 | - |
| `#hamburgerIcon` | div | 햄버거 메뉴 아이콘 | - |
| `#hamburgerDropdown` | div | 햄버거 드롭다운 메뉴 | hidden |
| `.search-volume-wrapper` | div | 페이지 메인 래퍼 (max-width:1400px) | - |
| `.page-title` | h1 | "Search Volume" + Beta 배지 | - |
| `.page-subtitle` | p | "자사 브랜드 검색량 추이 및 경쟁사 비교" | - |
| `#companySelect` | select | 업체 선택 드롭다운 (관리자만 표시) | 현재 업체 |
| `#loadingState` | div | 초기 로딩 상태 (스피너) | 표시됨 |
| `#errorMessage` | div | 에러 메시지 영역 | display:none |
| `#emptyState` | div | 빈 상태 (데이터 없음) | display:none |
| `#collectBtn` | button | 데이터 수집 버튼 (관리자만) | - |
| `#mainContent` | div | 메인 컨텐츠 컨테이너 | display:none |

### Desktop -- Section 1: Google 검색 유입

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `#searchConsoleSection` | div | Google 검색 유입 섹션 래퍼 (.table-section) | - |
| `.table-title` (첫 번째) | div | "Google 검색 유입" (color:#4285f4) | - |
| `#searchConsoleInfo` | div | 날짜 범위 표시 (.table-info) | "최근 28일 . 클릭 1회 이상" |
| `#searchConsoleLoading` | div | Search Console 로딩 상태 | 표시됨 |
| `#searchConsoleError` | div | Search Console 에러 메시지 | display:none |
| `#searchConsoleTable` | table | Search Console 결과 테이블 (.data-table) | display:none |
| `#searchConsoleBody` | tbody | Search Console 테이블 바디 | - |
| `#searchConsoleMore` | div | 더보기 버튼 영역 | display:none |
| `#searchConsoleRemaining` | span | 남은 검색어 개수 ("0") | "0" |

### Desktop -- Section 2: 네이버 일간 검색량 차트

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.chart-section` | div | 차트 섹션 래퍼 (bg:#18181b) | - |
| `#chartBrandName` | div | 차트 타이틀 (.chart-title, color:#03c75a) | "네이버 일간 검색량 추이" |
| `.help-icon` (차트) | div | "추산 검색량이란?" 도움말 아이콘 | - |
| `#monthlyVolume` | div | 월간 검색량 수치 (.chart-stat-value) | "-" |
| `#dailyAverage` | div | 일평균 수치 (.chart-stat-value) | "-" |
| `.chart-container` | div | 차트 래퍼 (height:350px) | - |
| `#trendChart` | canvas | Chart.js 라인차트 캔버스 | - |

### Desktop -- Section 3: 네이버 월간 검색량 비교

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.table-section` (두 번째) | div | 월간 검색량 테이블 래퍼 | - |
| `.table-title` (두 번째) | div | "네이버 월간 검색량 비교" (color:#03c75a) | - |
| `.table-info` (두 번째) | div | "자사 + 경쟁사 브랜드" -> 수집일 표시로 업데이트 | - |
| `#tableBody` | tbody | 월간 검색량 테이블 바디 | - |
| `.brand-cell` | div | 브랜드 셀 (인디케이터 + 이름 + 타입) | - |
| `.brand-indicator` | div | 색상 바 (4x24px, .own=green, .competitor=indigo) | - |
| `.brand-name` | span | 브랜드 한글명 | - |
| `.brand-type` | span | "자사" 배지 (.own or .competitor) | 자사만 표시 |
| `.volume-value` | span | 월간 검색량 값 (N건) | - |

### Mobile -- 추가/다른 요소

| ID / 클래스 | 타입 | 용도 | 기본값 |
|-------------|------|------|--------|
| `.search-header` | header | 모바일 고정 헤더 (h:56px) | - |
| `.back-btn` | a | 뒤로가기 버튼 -> /m/trend/ | - |
| `.header-title` | h1 | "검색량 분석" (16px) | - |
| `.beta-badge` | span | "Beta" 배지 | - |
| `#gscDateRange` | span | GSC 날짜 범위 (.section-info) | "최근 28일" |
| `#gscLoading` | div | GSC 로딩 상태 | 표시됨 |
| `#gscError` | div | GSC 에러 메시지 | display:none |
| `#gscContent` | div | GSC 컨텐츠 래퍼 | display:none |
| `#queryList` | div | 검색어 리스트 (.query-list) | - |
| `#gscMoreBtn` | button | 더보기 버튼 (.more-btn) | display:none |
| `#gscRemaining` | span | 남은 개수 | "0" |
| `#chartTitle` | div | 차트 타이틀 | "네이버 일간 검색량 추이" |
| `#searchChart` | canvas | 차트 캔버스 (mobile) | - |
| `#brandCollectedDate` | span | 경쟁사 수집일 (.section-info) | "자사 + 경쟁사" |
| `#brandLoading` | div | 브랜드 로딩 상태 | 표시됨 |
| `#brandError` | div | 브랜드 에러 메시지 | display:none |
| `#brandList` | div | 브랜드 리스트 (.brand-list) | display:none |
| `#emptyState` (mobile) | div | 빈 상태 (.empty-state) | display:none |
| `#loadingOverlay` | div | 전체 화면 로딩 오버레이 | display:none |
| `#toastContainer` | div | 토스트 메시지 컨테이너 | - |

---

## 섹션별 상세 스펙

### Section 1: Google 검색 유입

#### 기능

- Google Search Console API에서 최근 28일간의 검색어 데이터 조회
- 클릭 1회 이상인 검색어를 클릭수 내림차순으로 표시
- 최초 10개만 표시하고 "더보기" 버튼으로 나머지 확장

#### Desktop 목업

```
+------------------------------------------------------------------+
| Google 검색 유입  [?]                   2026-02-01 ~ 2026-02-25   |
+------------------------------------------------------------------+
| 순위   검색어                    클릭       노출    CTR   평균순위 |
+------------------------------------------------------------------+
|  1     파이시스                   482      6,340   7.6%    1.2    |
|  2     파이시스 공식              315      4,120   7.6%    1.0    |
|  3     파이시스 자켓              247      3,850   6.4%    2.1    |
| ...                                                               |
| 10     파이시스 셔츠               89      1,380   6.4%    3.5    |
+------------------------------------------------------------------+
|              더보기 (5개 더)                                       |
+------------------------------------------------------------------+
```

#### Mobile 목업

```
+------------------------------+
| Google 검색 유입   최근 28일   |
+------------------------------+
| 1  파이시스                482 |
|    노출 6,340  CTR 7.6%  클릭  |
|    순위 1.2                    |
+------------------------------+
| 2  파이시스 공식           315 |
|    노출 4,120  CTR 7.6%  클릭  |
|    순위 1.0                    |
+------------------------------+
|        더보기 (5개 더)         |
+------------------------------+
```

#### 데이터 매핑

| 필드 | API 응답 키 | 포맷 |
|------|------------|------|
| 순위 | index + 1 | 정수 |
| 검색어 | `query` | HTML escaped |
| 클릭 | `clicks` | `.toLocaleString()` |
| 노출 | `impressions` | `.toLocaleString()` |
| CTR | `ctr` | `N.N%` |
| 평균순위 | `position` | 소수점 1자리 |

---

### Section 2: 네이버 일간 검색량 차트

#### 기능

- 자사 브랜드의 최근 30일 일간 추산 검색량을 라인차트로 표시
- 월간 검색량과 일평균을 상단 우측에 수치로 표시
- 추산 검색량 계산 공식: `월간검색량 x (해당일 비율 / 30일 비율합계)`
- 도움말 아이콘 hover 시 공식 툴팁 표시

#### Desktop 목업

```
+------------------------------------------------------------------+
| 네이버 파이시스 일간 검색량 추이 [?]   월간 검색량   일평균        |
|                                        12,600건     420건         |
+------------------------------------------------------------------+
|                                                                   |
|  500 |                                                            |
|      |         /\                          /\                     |
|  400 |   /\  /    \    /\         /\    /    \                    |
|      |  /   \/      \  /  \      /  \  /      \/                 |
|  300 | /              \/    \    /    \/                           |
|      |/                      \  /                                 |
|  200 |                        \/                                  |
|      +---+---+---+---+---+---+---+---+---+---+---+---            |
|       1/29 2/1  2/4  2/7  2/10 2/13 2/16 2/19 2/22 2/25          |
|                                                                   |
+------------------------------------------------------------------+
```

#### Chart.js 설정

```javascript
{
  type: 'line',
  data: {
    labels: ['M/D', ...],        // dailyData.map(d => date format)
    datasets: [{
      label: '추산 검색량',
      data: [420, 390, ...],     // dailyData.map(d => d.estimated)
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 2,
      tension: 0.3,              // 부드러운 곡선
      pointRadius: 0,            // 포인트 기본 숨김
      pointHoverRadius: 6,       // hover 시 표시 (모바일: 4)
      fill: true                 // 영역 채우기
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#a1a1aa',
        padding: 12,              // 모바일: 10
        callbacks: {
          label: (ctx) => '추산 검색량: ' + ctx.parsed.y.toLocaleString() + '건'
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#27272a' },          // 모바일: display:false
        ticks: { color: '#71717a', font: { size: 11 } }  // 모바일: rgba(255,255,255,0.4), size:10
      },
      y: {
        grid: { color: '#27272a' },          // 모바일: rgba(255,255,255,0.06)
        ticks: {
          color: '#71717a',
          font: { size: 11 },
          callback: (value) => value.toLocaleString()  // 모바일: value >= 1000 ? (value/1000)+'K' : value
        },
        beginAtZero: true
      }
    }
  }
}
```

---

### Section 3: 네이버 월간 검색량 비교

#### 기능

- 자사 + 경쟁사 브랜드의 월간 검색량을 테이블로 비교
- 월간 검색량 내림차순 정렬
- 자사 브랜드는 녹색 인디케이터 + "자사" 배지
- 경쟁사는 인디고 인디케이터
- 경쟁사 데이터 수집일 표시

#### Desktop 목업

```
+------------------------------------------------------------------+
| 네이버 월간 검색량 비교 [?]    자사 + 경쟁사 . 수집일: 2026-02-27 |
+------------------------------------------------------------------+
| 순위   브랜드                       월간 검색량     PC      모바일 |
+------------------------------------------------------------------+
|  1    |# 라르디                       18,400건    6,100   12,300  |
|  2    |# 소르비                       15,200건    5,000   10,200  |
|  3    || 파이시스  [자사]              12,600건    4,200    8,400  |
|  4    |# 뮤이엔                        9,800건    3,200    6,600  |
|  5    |# 헤르밀                        7,400건    2,500    4,900  |
+------------------------------------------------------------------+
   || = 녹색 (자사, #22c55e)   |# = 인디고 (경쟁사, #6366f1)
```

#### Mobile 목업

```
+------------------------------+
| 네이버 월간 검색량 비교        |
|             수집일: 2026-02-27|
+------------------------------+
| 1  # 라르디              18,400|
|      PC 6,100 / 모바일 12,300  |
+------------------------------+
| 2  # 소르비              15,200|
|      PC 5,000 / 모바일 10,200  |
+------------------------------+
| 3  | 파이시스 [자사]     12,600|
|      PC 4,200 / 모바일 8,400   |
+------------------------------+
| 4  # 뮤이엔               9,800|
|      PC 3,200 / 모바일 6,600   |
+------------------------------+
| 5  # 헤르밀               7,400|
|      PC 2,500 / 모바일 4,900   |
+------------------------------+
   | = #22c55e (자사)   # = #6366f1 (경쟁사)
```

---

## 핵심 함수 흐름

### Desktop

```
$(document).ready()
  |-- 햄버거 메뉴 토글 설정
  |-- loadSearchVolumeData()         --- async, 병렬 호출
  |   |-- fetch GET /dashboard/search-volume?company=piscess
  |   |-- #loadingState 숨김
  |   |-- 에러 -> #errorMessage 표시
  |   |-- brands === [] -> #emptyState 표시
  |   |-- #mainContent 표시
  |   |-- ownBrand = brands.find(b => b.brand_type === 'own')
  |   |-- renderChart(ownBrand)
  |   |   |-- #chartBrandName.textContent = "네이버 {brand_name} 일간 검색량 추이"
  |   |   |-- #monthlyVolume.textContent = "{N}건"
  |   |   |-- #dailyAverage.textContent = "{N}건"
  |   |   |-- labels = dailyData.map(M/D 포맷)
  |   |   |-- values = dailyData.map(d => d.estimated)
  |   |   |-- if (trendChart) trendChart.destroy()
  |   |   +-- new Chart(ctx, config)
  |   +-- renderTable(brands, collectedDate)
  |       |-- .table-info -> "자사 + 경쟁사 . 수집일: {date}"
  |       |-- sortedBrands = [...brands].sort(b.monthly_volume DESC)
  |       +-- #tableBody = 행 HTML 생성
  |
  |   > **KNOWN BUG**: Desktop `renderTable()`에서 `document.querySelector('.table-info')`로
  |   > 수집일 텍스트를 업데이트하는데, DOM의 첫 번째 `.table-info` 엘리먼트는 Google Search Console
  |   > 섹션의 `#searchConsoleInfo`이지, 네이버 월간 테이블의 `.table-info`가 아니다.
  |   > 따라서 `#searchConsoleInfo`의 텍스트("최근 28일 . 클릭 1회 이상")가 수집일 정보로 덮어씌워진다.
  |   > `querySelectorAll('.table-info')[1]` 또는 ID 기반 선택자를 사용해야 한다.
  |
  +-- loadSearchConsoleData()        --- async, 병렬 호출
      |-- fetch GET /dashboard/search-console?company=piscess&limit=50&min_clicks=1
      |-- #searchConsoleLoading 숨김
      |-- 에러 -> #searchConsoleError 표시
      |-- queries === [] -> 에러 메시지 표시
      |-- #searchConsoleInfo -> 날짜 범위 업데이트
      |-- allSearchConsoleQueries = queries
      |-- renderSearchConsoleTable(queries.slice(0, 10))
      |   |-- startRank = tbody.children.length
      |   |-- HTML 생성 (순위, 검색어, 클릭, 노출, CTR, 평균순위)
      |   |-- startRank === 0 -> set content
      |   |-- startRank > 0 -> append content (더보기)
      |   +-- #searchConsoleTable.style.display = 'table'
      +-- queries.length > 10 -> #searchConsoleMore 표시

> **KNOWN BUG**: Desktop `loadSearchConsoleData()`가 검색어 없음 시 "클릭 10회 이상인 검색어가
> 없습니다." 메시지를 표시하고, `#searchConsoleInfo` 텍스트도 "클릭 10회 이상"으로 업데이트하지만,
> 실제 API 호출은 `min_clicks=1`로 전송한다. Mobile은 올바르게 "클릭 1회 이상"으로 표시.
> Desktop의 메시지 텍스트를 "클릭 1회 이상"으로 수정해야 한다.

changeCompany(companyName)
  +-- window.location.href = /trend/search-volume?company_name={companyName}

collectData()                         --- 관리자 전용
  |-- #collectBtn.disabled = true, textContent = '수집 중...'
  |-- fetch POST /dashboard/search-volume/collect
  |   body: { company_name: selectedCompany }
  |-- 성공 -> alert() + location.reload()
  +-- 실패 -> alert() + 버튼 복원

> **KNOWN BUG**: Desktop `collectData()` 함수가 성공 시 `data.rows_inserted`를 참조하여
> alert 메시지에 삽입 건수를 표시하려 하지만, `collect_search_volume()` API 응답에는
> `rows_inserted` 필드가 존재하지 않고 `own_rows`와 `competitor_rows`만 존재한다.
> 따라서 `data.rows_inserted`는 항상 `undefined`가 되어 alert에 "undefined건" 등이 표시될 수 있다.

showMoreSearchConsole()
  |-- currentCount = #searchConsoleBody.children.length
  |-- remaining = allSearchConsoleQueries.slice(currentCount)
  |-- renderSearchConsoleTable(remaining)
  +-- #searchConsoleMore 숨김
```

### Mobile

```
DOMContentLoaded
  |-- companyName 비어있음 -> 토스트 "업체를 먼저 선택해주세요." -> 2.5초 후 /m/trend/ 이동
  |-- loadSearchConsoleData()        --- async, 병렬 호출
  |   |-- fetch GET /dashboard/search-console?company={companyName}&limit=50&min_clicks=1&_t={timestamp}
  |   |-- #gscLoading 숨김
  |   |-- 에러 -> #gscError 표시
  |   |-- #gscDateRange -> 날짜 범위
  |   |-- allQueries = queries
  |   |-- renderQueryList(queries.slice(0, 10))
  |   |   +-- .query-item 생성 (모바일 리스트 형태)
  |   |-- #gscContent 표시
  |   +-- queries.length > 10 -> #gscMoreBtn 표시
  |
  +-- loadSearchVolumeData()         --- async, 병렬 호출
      |-- fetch GET /dashboard/search-volume?company={companyName}&_t={timestamp}
      |-- #brandLoading 숨김
      |-- 에러 -> #brandError 표시
      |-- brands === [] -> #emptyState.classList.add('show')
      |-- #brandCollectedDate -> "수집일: {date}"
      |-- ownBrand -> renderChart(ownBrand)
      |   |-- #chartTitle -> "네이버 {brand_name} 일간 검색량"
      |   |-- #monthlyVolume, #dailyAverage 업데이트
      |   +-- Chart.js 생성 (모바일 최적화 옵션)
      +-- renderBrandList(brands)
          |-- sortedBrands = brands.sort(monthly_volume DESC)
          +-- #brandList = .brand-item 생성

showToast(message, type, duration)
  |-- type: 'success' | 'error' | 'info' (기본 'info')
  |-- duration: ms 단위 (기본 3000)
  |-- #toastContainer에 토스트 엘리먼트 생성 -> 애니메이션 표시 -> duration 후 자동 제거

formatNumber(num)
  +-- return new Intl.NumberFormat().format(num)  // 천 단위 콤마 포맷

escapeHtml(text)
  +-- &, <, >, ", ' 문자를 HTML 엔티티로 치환

showMoreQueries()
  |-- currentCount = #queryList.children.length
  |-- nextBatch = allQueries.slice(currentCount, currentCount + 10)  // 10개씩 추가
  |-- renderQueryList(nextBatch)  // 기존 리스트에 append
  |-- remaining = allQueries.length - (currentCount + nextBatch.length)
  |-- remaining > 0 -> #gscRemaining 업데이트
  +-- remaining <= 0 -> #gscMoreBtn 숨김
```

---

## API 엔드포인트 레퍼런스

### 1. GET /dashboard/search-volume -- 네이버 검색량 조회

#### 요청

```
GET /dashboard/search-volume?company=piscess
Authorization: Bearer {JWT} 또는 세션 인증
```

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|-----|------|--------|
| `company` | string | Y | 업체명 (소문자) | - |

#### 응답 -- 성공 (데이터 있음)

```json
{
  "status": "success",
  "brands": [
    {
      "brand_name": "파이시스",
      "brand_type": "own",
      "monthly_volume": 12600,
      "pc_volume": 4200,
      "mobile_volume": 8400,
      "daily_data": [
        {
          "date": "2026-01-29",
          "ratio": 45.2,
          "estimated": 420
        },
        {
          "date": "2026-01-30",
          "ratio": 41.8,
          "estimated": 390
        }
      ]
    },
    {
      "brand_name": "라르디",
      "brand_type": "competitor",
      "monthly_volume": 18400,
      "pc_volume": 6100,
      "mobile_volume": 12300,
      "daily_data": []
    },
    {
      "brand_name": "소르비",
      "brand_type": "competitor",
      "monthly_volume": 15200,
      "pc_volume": 5000,
      "mobile_volume": 10200,
      "daily_data": []
    },
    {
      "brand_name": "뮤이엔",
      "brand_type": "competitor",
      "monthly_volume": 9800,
      "pc_volume": 3200,
      "mobile_volume": 6600,
      "daily_data": []
    },
    {
      "brand_name": "헤르밀",
      "brand_type": "competitor",
      "monthly_volume": 7400,
      "pc_volume": 2500,
      "mobile_volume": 4900,
      "daily_data": []
    }
  ],
  "competitor_collected_date": "2026-02-27"
}
```

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `brands` | array | 브랜드 배열 (자사 1개 + 경쟁사 N개) |
| `brands[].brand_name` | string | 브랜드 한글명 (네이버 검색 키워드) |
| `brands[].brand_type` | string | `"own"` (자사) 또는 `"competitor"` (경쟁사) |
| `brands[].monthly_volume` | integer | 네이버 월간 검색량 (PC + 모바일) |
| `brands[].pc_volume` | integer | PC 월간 검색량 |
| `brands[].mobile_volume` | integer | 모바일 월간 검색량 |
| `brands[].daily_data` | array | 일간 데이터 (자사만, 경쟁사는 빈 배열) |
| `brands[].daily_data[].date` | string | 날짜 (`"YYYY-MM-DD"`) |
| `brands[].daily_data[].ratio` | float | 네이버 데이터랩 상대값 (0~100) |
| `brands[].daily_data[].estimated` | integer | 추산 일간 검색량 |
| `competitor_collected_date` | string or null | 경쟁사 데이터 수집일 (`"YYYY-MM-DD"`) |

#### 응답 -- 에러

```json
{
  "status": "error",
  "message": "company 파라미터 필요"
}
```

#### 데모 모드

데모 계정(is_demo)인 경우 `demo_search_data.get_demo_search_volume_data()` 반환.
데모 데이터는 가짜 브랜드명(데모브랜드, 라르디, 소르비, 뮤이엔, 헤르밀)을 사용하며
날짜만 동적 생성(오늘 기준 30일 전~어제), 검색량 패턴은 고정(시드 42).

> **Note**: 데모 데이터의 `daily_data`는 `ratio` 필드가 없고 `date`와 `estimated`만 포함한다.
> 실제 API 응답(`brands[].daily_data[].ratio`)과 구조가 다르므로, 프론트엔드에서 `ratio` 필드에
> 접근할 경우 `undefined`가 된다. 차트 렌더링에는 `estimated`만 사용하므로 현재 동작에는 영향 없음.

---

### 2. GET /dashboard/search-console -- Google 검색 유입 조회

#### 요청

```
GET /dashboard/search-console?company=piscess&limit=50&min_clicks=1
Authorization: Bearer {JWT} 또는 세션 인증
```

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|-----|------|--------|
| `company` | string | Y | 업체명 (소문자) | - |
| `limit` | integer | N | 최대 반환 개수 | 50 |
| `min_clicks` | integer | N | 최소 클릭수 필터 | 10 |

> **Note**: Flask 핸들러의 `min_clicks` 기본값은 `10`이지만, Desktop과 Mobile 프론트엔드 모두
> 쿼리 파라미터로 `min_clicks=1`을 명시적으로 전송한다. 따라서 실효 값은 항상 `1`이다.

#### 내부 동작

1. BigQuery `company_info` 테이블에서 `main_url` 조회
2. Search Console API에서 속성 URL 자동 탐색 (`sc-domain:` 또는 `https://`)
3. 최근 28일 (3일 전까지) 검색어 데이터 조회 (`dimensions: ['query']`)
4. 클릭수 >= min_clicks 필터링
5. 클릭수 내림차순 정렬 후 limit 적용

#### 응답 -- 성공

```json
{
  "status": "success",
  "company_name": "piscess",
  "main_url": "https://piscess.shop",
  "site_url": "sc-domain:piscess.shop",
  "date_range": {
    "start": "2026-01-28",
    "end": "2026-02-25"
  },
  "total_count": 15,
  "queries": [
    {
      "query": "파이시스",
      "clicks": 482,
      "impressions": 6340,
      "ctr": 7.6,
      "position": 1.2
    },
    {
      "query": "파이시스 공식",
      "clicks": 315,
      "impressions": 4120,
      "ctr": 7.6,
      "position": 1.0
    },
    {
      "query": "파이시스 자켓",
      "clicks": 247,
      "impressions": 3850,
      "ctr": 6.4,
      "position": 2.1
    }
  ]
}
```

#### 응답 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `company_name` | string | 업체명 |
| `main_url` | string | 업체 메인 URL |
| `site_url` | string | Search Console 속성 URL |
| `date_range.start` | string | 조회 시작일 |
| `date_range.end` | string | 조회 종료일 |
| `total_count` | integer | 총 검색어 수 |
| `queries` | array | 검색어 배열 |
| `queries[].query` | string | 검색어 텍스트 |
| `queries[].clicks` | integer | 클릭수 |
| `queries[].impressions` | integer | 노출수 |
| `queries[].ctr` | float | 클릭률 (%, 소수점 1자리) |
| `queries[].position` | float | 평균 순위 (소수점 1자리) |

#### 응답 -- 에러

```json
{
  "status": "error",
  "message": "업체 'piscess'의 main_url을 찾을 수 없음"
}
```

#### 데모 모드

데모 계정인 경우 `demo_search_data.get_demo_search_console_data()` 반환.
15개의 가짜 검색어(데모브랜드, demo brand 등) 사용. 날짜만 동적 생성.

---

### 3. POST /dashboard/search-volume/collect -- 검색량 수집 (관리자 전용)

#### 요청

```
POST /dashboard/search-volume/collect
Content-Type: application/json
Authorization: Bearer {JWT} 또는 세션 인증 (is_admin 필수)

{
  "company_name": "piscess",
  "force_full": false
}
```

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|-----|------|--------|
| `company_name` | string | N | 수집 대상 업체명 | "piscess" |
| `force_full` | boolean | N | true: 30일 전체 재수집, false: 증분 수집 | false |

#### 내부 동작 (collect_search_volume)

1. **자사몰 일별 수집** (`collect_own_brand_daily`)
   - `company_info` 테이블에서 `korean_name` 조회
   - 네이버 검색광고 API -> 월간 검색량 (PC, 모바일, 합계)
   - 네이버 데이터랩 API -> 30일 일별 상대값 트렌드
   - 추산 일간 검색량 계산: `월간검색량 x (해당일 비율 / 30일 비율합계)`
   - BigQuery 임시 테이블 -> MERGE 방식으로 저장 (중복 방지)

2. **경쟁사 월간 수집** (`collect_competitor_monthly`)
   - `company_competitor_brands` 테이블에서 경쟁사 브랜드 조회
   - 각 브랜드별 네이버 검색광고 API -> 월간 검색량
   - 기존 경쟁사 데이터 DELETE 후 INSERT (덮어쓰기)

#### 응답 -- 성공

```json
{
  "status": "success",
  "company_name": "piscess",
  "own_brand": "파이시스",
  "competitors": ["라르디", "소르비", "뮤이엔", "헤르밀"],
  "mode": "incremental",
  "own_rows": 1,
  "competitor_rows": 5
}
```

#### 응답 -- 권한 에러

```json
{
  "status": "error",
  "message": "관리자 권한 필요"
}
```

---

## BigQuery 테이블 스키마

### naver_search_volume 테이블

```
Project: winged-precept-443218-v8
Dataset: ngn_dataset
Table: naver_search_volume
```

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `collected_date` | DATE | 수집일 (KST 기준) |
| `company_name` | STRING | 업체명 (예: "piscess") |
| `brand_name` | STRING | 브랜드 한글명 (예: "파이시스") |
| `brand_type` | STRING | `"own"` (자사) 또는 `"competitor"` (경쟁사) |
| `search_date` | DATE | 검색 날짜 (자사 일별만, 경쟁사는 NULL) |
| `ratio` | FLOAT | 데이터랩 상대값 (0~100, 경쟁사는 NULL) |
| `monthly_volume` | INTEGER | 네이버 월간 총 검색량 |
| `estimated_daily` | INTEGER | 추산 일간 검색량 (경쟁사는 NULL) |
| `pc_volume` | INTEGER | PC 월간 검색량 |
| `mobile_volume` | INTEGER | 모바일 월간 검색량 |

#### 유니크 키

- 자사몰: `company_name + brand_name + brand_type + search_date`
- 경쟁사: `company_name + brand_type` (매 수집 시 DELETE 후 INSERT)

### company_info 테이블 (참조)

| 컬럼명 | 타입 | 용도 |
|--------|------|------|
| `company_name` | STRING | 업체 식별자 (예: "piscess") |
| `korean_name` | STRING | 업체 한글명 = 네이버 검색 키워드 (예: "파이시스") |
| `main_url` | STRING | 자사몰 URL (예: "https://piscess.shop") -- GSC 연동 |

### company_competitor_brands 테이블 (참조)

| 컬럼명 | 타입 | 용도 |
|--------|------|------|
| `company_name` | STRING | 업체 식별자 |
| `brand_name` | STRING | 경쟁사 브랜드 한글명 (네이버 검색 키워드) |
| `is_active` | BOOLEAN | 활성 여부 |
| `sort_order` | INTEGER | 정렬 순서 |

---

## 네이버 API 상세

### 1. 검색광고 API -- 월간 검색량

```
GET https://api.searchad.naver.com/keywordstool
    ?hintKeywords={keyword}&showDetail=1

Headers:
  Content-Type: application/json; charset=UTF-8
  X-Timestamp: {timestamp_ms}
  X-API-KEY: {NAVER_ADS_ACCESS_LICENSE}
  X-Customer: {NAVER_ADS_CUSTOMER_ID}
  X-Signature: {HMAC-SHA256 서명}

서명 생성:
  message = "{timestamp}.GET./keywordstool"
  signature = base64(HMAC-SHA256(NAVER_ADS_SECRET_KEY, message))
```

#### 응답 (관련 부분만)

```json
{
  "keywordList": [
    {
      "relKeyword": "파이시스",
      "monthlyPcQcCnt": 4200,
      "monthlyMobileQcCnt": 8400
    }
  ]
}
```

> `monthlyPcQcCnt` 또는 `monthlyMobileQcCnt`가 `"< 10"` 문자열일 수 있음 -> 10으로 처리

### 2. 데이터랩 API -- 일별 트렌드

```
POST https://openapi.naver.com/v1/datalab/search

Headers:
  X-Naver-Client-Id: {NAVER_CLIENT_ID}
  X-Naver-Client-Secret: {NAVER_CLIENT_SECRET}
  Content-Type: application/json

Body:
{
  "startDate": "2026-01-29",
  "endDate": "2026-02-27",
  "timeUnit": "date",
  "keywordGroups": [
    {"groupName": "파이시스", "keywords": ["파이시스"]}
  ]
}
```

#### 응답

```json
{
  "results": [
    {
      "title": "파이시스",
      "keywords": ["파이시스"],
      "data": [
        {"period": "2026-01-29", "ratio": 45.2},
        {"period": "2026-01-30", "ratio": 41.8}
      ]
    }
  ]
}
```

> 최대 5개 키워드 그룹까지 한 번에 요청 가능.
> 당일 데이터는 불완전하므로 어제까지만 수집 (KST 기준).

---

## 환경 변수

| 변수명 | 용도 | 필수 |
|--------|------|------|
| `NAVER_CLIENT_ID` | 데이터랩 API 클라이언트 ID | Y (네이버 차트) |
| `NAVER_CLIENT_SECRET` | 데이터랩 API 클라이언트 시크릿 | Y (네이버 차트) |
| `NAVER_ADS_CUSTOMER_ID` | 검색광고 API 고객 ID | Y (월간 검색량) |
| `NAVER_ADS_ACCESS_LICENSE` | 검색광고 API 엑세스 키 | Y (월간 검색량) |
| `NAVER_ADS_SECRET_KEY` | 검색광고 API HMAC 서명 키 | Y (월간 검색량) |
| `GOOGLE_CLOUD_PROJECT` | GCP 프로젝트 ID | Y (BigQuery) |
| `BQ_DATASET` | BigQuery 데이터셋 | Y (BigQuery) |

> Google Search Console은 ADC(Application Default Credentials) 사용.
> `gcloud auth application-default login` 또는 Cloud Run 서비스 계정 자동 인증.

---

## Flask 라우트 매핑

| URL | Method | Handler | 템플릿/응답 |
|-----|--------|---------|------------|
| `/trend/search-volume` | GET | `app.trend_search_volume_page()` | `trend_search_volume.html` |
| `/m/trend/search-volume` | GET | `mobile_trend_bp.trend_search_volume()` | `mobile/trend_search_volume.html` |
| `/dashboard/search-volume` | GET | `data_blueprint.get_search_volume()` | JSON |
| `/dashboard/search-console` | GET | `data_blueprint.get_search_console_data()` | JSON |
| `/dashboard/search-volume/collect` | POST | `data_blueprint.collect_search_volume_api()` | JSON |

---

## 외부 라이브러리 의존성

| 라이브러리 | 버전/CDN | 용도 |
|-----------|----------|------|
| jQuery | 3.6.0 (CDN) | Desktop: 햄버거 메뉴 토글 |
| Chart.js | latest (CDN) | 라인차트 렌더링 |
| Inter 폰트 | Google Fonts | 타이포그래피 |
| Pretendard 폰트 | orioncactus CDN | 모바일 타이포그래피 |

> Next.js 포팅 시 jQuery 제거하고 React state로 대체.
> Chart.js는 `react-chartjs-2` 또는 `recharts`로 대체 가능.

---

## Next.js 포팅 시 고려사항

### 1. 컴포넌트 분리 안

```
app/trend/search-volume/page.tsx          -- 페이지 (서버 컴포넌트)
components/trend/
  |-- SearchVolumeHeader.tsx              -- 페이지 헤더 + 업체 선택
  |-- GoogleSearchConsoleCard.tsx         -- Section 1: Google 검색 유입
  |-- NaverDailyTrendChart.tsx            -- Section 2: 일간 검색량 차트
  |-- NaverMonthlyComparisonTable.tsx     -- Section 3: 월간 비교 테이블
  |-- SearchVolumeLoading.tsx             -- 로딩 상태
  +-- SearchVolumeEmpty.tsx               -- 빈 상태
lib/api/
  +-- search-volume.ts                    -- API 호출 함수
```

### 2. 데이터 페칭

- 두 API(`search-volume`, `search-console`)를 `Promise.all`로 병렬 호출
- `useSWR` 또는 `@tanstack/react-query`로 캐싱 관리
- 모바일 구분은 `useMediaQuery` 또는 Tailwind responsive 사용

### 3. 차트

- `react-chartjs-2` 사용 시 Chart.js 설정 그대로 적용 가능
- 또는 `recharts`의 `<LineChart>` + `<Area>` 조합
- 반응형 높이: Desktop 350px, Mobile 200px

### 4. 상태 관리

- `selectedCompany`: URL query parameter (`searchParams`)
- `trendChart`: `useRef`로 Chart.js 인스턴스 관리
- `allSearchConsoleQueries`: `useState`
- `INITIAL_SHOW_COUNT = 10`: 상수

### 5. 데모 모드

- JWT 토큰에 `is_demo_user` 플래그 포함
- 데모 모드에서는 Flask 백엔드가 자동으로 데모 데이터 반환 (프론트 분기 불필요)
- 단, 관리자 전용 UI(업체 선택, 수집 버튼)는 `is_admin` 플래그로 조건부 렌더링

### 6. 스타일

- 기존 CSS 변수를 Tailwind config의 extend colors로 매핑
- 다크 모드 전용 (라이트 모드 미지원)
- 주요 컬러: `green-500 (#22c55e)`, `indigo-500 (#6366f1)`, `blue-500 (#4285f4)`
